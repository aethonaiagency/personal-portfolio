import express from 'express';
import path from 'path';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { dbService, initDatabase, db } from './db';
import { doc, getDoc, setDoc } from 'firebase/firestore';

dotenv.config();

// Helper function to load Gmail token from firestore
async function getGmailToken(): Promise<{ token: string; email: string } | null> {
  try {
    const docSnap = await getDoc(doc(db, 'settings', 'gmail'));
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data && data.token) {
        return { token: data.token, email: data.email };
      }
    }
  } catch (error) {
    console.error('Failed to load Gmail credentials from Firestore:', error);
  }
  return null;
}

// Helper to send email using Gmail API
async function sendGmail(token: string, fromEmail: string, toEmail: string, subject: string, htmlContent: string) {
  const mail = [
    `From: <${fromEmail}>`,
    `To: <${toEmail}>`,
    `Subject: =?utf-8?B?${Buffer.from(subject).toString('base64')}?=`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=utf-8',
    'Content-Transfer-Encoding: base64',
    '',
    Buffer.from(htmlContent).toString('base64')
  ].join('\r\n');

  const base64Safe = Buffer.from(mail)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      raw: base64Safe
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gmail API response error ${response.status}: ${errText}`);
  }

  return await response.json();
}

// Unified, high-end email dispatcher with robust fallbacks
async function sendNotificationEmail(subject: string, htmlContent: string, plainTextFallback: string, toEmail: string): Promise<{ success: boolean; method: string; detailMsg: string }> {
  const gmailCreds = await getGmailToken();
  if (gmailCreds) {
    try {
      console.log(`Attempting to send email via Gmail API for ${gmailCreds.email}...`);
      await sendGmail(gmailCreds.token, gmailCreds.email, toEmail, subject, htmlContent);
      console.log('Email successfully dispatched via Gmail API!');
      return { success: true, method: 'gmail_api', detailMsg: `Email sent via Gmail API from ${gmailCreds.email}` };
    } catch (gmailErr) {
      console.error('Gmail API send failed, falling back to SMTP:', gmailErr);
      const isUnauthorized = (gmailErr as Error).message.includes('401') || (gmailErr as Error).message.includes('403');
      if (isUnauthorized) {
        console.warn('Gmail token expired or unauthorized. Clearing stored Gmail key.');
        try {
          await setDoc(doc(db, 'settings', 'gmail'), { token: null, email: null, updatedAt: new Date().toISOString() });
        } catch (dbErr) {
          console.error('Failed to clear expired Gmail token in db:', dbErr);
        }
      }
    }
  }

  // Fallback to SMTP
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpUser && smtpPass) {
    try {
      console.log('Attempting to send email via SMTP Nodemailer...');
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });

      const mailOptions = {
        from: `"Nashiat Portfolio Builder" <${smtpUser}>`,
        to: toEmail,
        subject: subject,
        text: plainTextFallback,
        html: htmlContent
      };

      await transporter.sendMail(mailOptions);
      console.log('Email successfully dispatched via SMTP!');
      return { success: true, method: 'smtp', detailMsg: `Email sent via SMTP from ${smtpUser}` };
    } catch (smtpErr) {
      console.error('SMTP Nodemailer send also failed:', smtpErr);
      return { success: false, method: 'none', detailMsg: `SMTP Error: ${(smtpErr as Error).message}` };
    }
  }

  console.warn('No active email delivery channel (neither Gmail API nor SMTP secrets are configured).');
  return { success: false, method: 'none', detailMsg: 'Simulated delivery (authorize Gmail in Settings or configure SMTP secrets for outward dispatch).' };
}

// Simple in-memory session store
const adminSessions = new Set<string>();

function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  const list: Record<string, string> = {};
  if (!cookieHeader) return list;
  cookieHeader.split(';').forEach(cookie => {
    const parts = cookie.split('=');
    const name = parts.shift()?.trim();
    const value = decodeURI(parts.join('='));
    if (name) {
      list[name] = value;
    }
  });
  return list;
}

// Authentication guard middleware
const checkAdminAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const cookies = parseCookies(req.headers.cookie);
  const sessionToken = cookies['admin_session'];

  if (sessionToken && adminSessions.has(sessionToken)) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized: Access denied. Please authenticate as Nashiat.' });
};

const app = express();
app.use(express.json());

// Initialize seeded database storage asynchronously in the background
initDatabase().catch(err => {
  console.error('Failed to asynchronously initialize the seeded Firestore schemas:', err);
});

// API endpoints defined FIRST

  // Auth: Check login credentials
  app.post('/api/admin/login', (req, res) => {
    const { email, password } = req.body;

    // Secure custom credentials reading with flawless fallbacks
    const envEmail = process.env.ADMIN_EMAIL || 'admin@nashiat.dev';
    const envPass = process.env.ADMIN_PASSWORD || 'NashiatSuccess2026!';

    const isEmailValid = email === envEmail || (!process.env.ADMIN_EMAIL && email === 'nashiathossain@gmail.com');

    if (!isEmailValid || password !== envPass) {
      return res.status(430).json({ error: 'Access denied: Invalid credentials pairing.' });
    }

    // Provision luxury secure session token
    const token = 'sess_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    adminSessions.add(token);

    // Set secure HTTP-only session cookie
    res.setHeader(
      'Set-Cookie',
      `admin_session=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict`
    );

    res.json({ success: true, email: envEmail });
  });

  // Auth: Check running status
  app.get('/api/admin/status', (req, res) => {
    const cookies = parseCookies(req.headers.cookie);
    const sessionToken = cookies['admin_session'];

    if (sessionToken && adminSessions.has(sessionToken)) {
      const activeEmail = process.env.ADMIN_EMAIL || 'admin@nashiat.dev';
      return res.json({ authenticated: true, email: activeEmail });
    }
    res.json({ authenticated: false });
  });

  // Auth: Terminating sign-out
  app.post('/api/admin/logout', (req, res) => {
    const cookies = parseCookies(req.headers.cookie);
    const sessionToken = cookies['admin_session'];

    if (sessionToken) {
      adminSessions.delete(sessionToken);
    }

    res.setHeader(
      'Set-Cookie',
      'admin_session=; HttpOnly; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict'
    );

    res.json({ success: true });
  });

  // Admin CRUD for Bookings
  app.get('/api/admin/bookings', checkAdminAuth, async (req, res) => {
    try {
      const list = await dbService.getBookings();
      res.json({ success: true, bookings: list });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  app.put('/api/admin/bookings/:id', checkAdminAuth, async (req, res) => {
    try {
      const { status } = req.body;
      const updated = await dbService.updateBookingStatus(req.params.id, status);
      res.json({ success: true, booking: updated });
    } catch (err) {
      res.status(404).json({ error: (err as Error).message });
    }
  });

  app.delete('/api/admin/bookings/:id', checkAdminAuth, async (req, res) => {
    try {
      const deleted = await dbService.deleteBooking(req.params.id);
      res.json({ success: deleted });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // Admin CRUD for Contact Leads
  app.get('/api/admin/leads', checkAdminAuth, async (req, res) => {
    try {
      const list = await dbService.getLeads();
      res.json({ success: true, leads: list });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  app.put('/api/admin/leads/:id', checkAdminAuth, async (req, res) => {
    try {
      const { status } = req.body;
      const updated = await dbService.updateLeadStatus(req.params.id, status);
      res.json({ success: true, lead: updated });
    } catch (err) {
      res.status(404).json({ error: (err as Error).message });
    }
  });

  app.delete('/api/admin/leads/:id', checkAdminAuth, async (req, res) => {
    try {
      const deleted = await dbService.deleteLead(req.params.id);
      res.json({ success: deleted });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // Admin Settings controller
  app.get('/api/admin/settings', checkAdminAuth, async (req, res) => {
    try {
      const s = await dbService.getSettings();
      res.json({ success: true, settings: s });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  app.put('/api/admin/settings', checkAdminAuth, async (req, res) => {
    try {
      const updated = await dbService.saveSettings(req.body);
      res.json({ success: true, settings: updated });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // Gmail API connection routing
  app.get('/api/admin/gmail/status', checkAdminAuth, async (req, res) => {
    try {
      const credsSnap = await getDoc(doc(db, 'settings', 'gmail'));
      if (credsSnap.exists()) {
        const data = credsSnap.data();
        return res.json({ connected: !!data.token, email: data.email });
      }
      res.json({ connected: false });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  app.post('/api/admin/gmail/connect', checkAdminAuth, async (req, res) => {
    const { accessToken, email } = req.body;
    if (!accessToken || !email) {
      return res.status(400).json({ error: 'Missing accessToken or email.' });
    }
    try {
      await setDoc(doc(db, 'settings', 'gmail'), { token: accessToken, email, updatedAt: new Date().toISOString() });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  app.post('/api/admin/gmail/disconnect', checkAdminAuth, async (req, res) => {
    try {
      await setDoc(doc(db, 'settings', 'gmail'), { token: null, email: null, updatedAt: new Date().toISOString() });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // Public Profile Info
  app.get('/api/profile', async (req, res) => {
    try {
      const s = await dbService.getSettings();
      res.json({ success: true, profile: s.profile });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // Public Booking Interface: Saves and Dispatches Email
  app.post('/api/book', async (req, res) => {
    const { name, email, focus, date, time, description, company } = req.body;

    console.log('Received booking details:', { name, email, focus, date, time });

    if (!name || !email || !date || !time) {
      return res.status(400).json({ error: 'Missing required booking fields.' });
    }

    let savedBooking;
    try {
      savedBooking = await dbService.addBooking({
        name,
        email,
        focus,
        date,
        time,
        company: company || '',
        description: description || ''
      });
    } catch (dbErr) {
      console.error('Database failure storing scheduled booking', dbErr);
    }

    // Try sending email via unified handler (Gmail API / SMTP fallback)
    const subject = `[Discovery Meeting] New Booking: ${name}`;
    const textFallback = `
Dear Nashiat,

A new discovery meeting has been scheduled via your portfolio calendar booking engine.

=========================================
Client Specifications:
=========================================
Name: ${name}
Email: ${email}
Primary Bottleneck: ${focus}
Proposed Date: ${date}, 2026
Proposed Time: ${time}

Timestamp: ${new Date().toISOString()}
=========================================
    `;
    const htmlBody = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #c9a46c; border-radius: 12px; background-color: #0b0b0b; color: #f5f5f0;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #c9a46c; font-size: 22px; margin: 0; text-transform: uppercase; letter-spacing: 2px;">New Meeting Booked</h1>
          <p style="color: #a3a3a3; font-size: 11px; font-family: monospace; margin: 4px 0 0 0;">SYSTEM HANDSHAKE SUCCESSFUL</p>
        </div>
        
        <div style="background-color: #121212; border: 1px solid rgba(255,255,255,0.05); padding: 20px; border-radius: 8px;">
          <p style="margin: 0 0 12px 0; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px;">
            <strong style="color: #c9a46c;">Client Name:</strong> <span style="float: right;">${name}</span>
          </p>
          <p style="margin: 0 0 12px 0; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px;">
            <strong style="color: #c9a46c;">Email Address:</strong> <span style="float: right; font-family: monospace;">${email}</span>
          </p>
          <p style="margin: 0 0 12px 0; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px;">
            <strong style="color: #c9a46c;">Requested Date:</strong> <span style="float: right;">${date}, 2026</span>
          </p>
          <p style="margin: 0 0 12px 0; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px;">
            <strong style="color: #c9a46c;">Timeslot:</strong> <span style="float: right;">${time}</span>
          </p>
          <p style="margin: 0; font-size: 14px;">
            <strong style="color: #c9a46c;">Project Bottleneck:</strong> <span style="display: block; margin-top: 6px; padding: 10px; background-color: #0b0b0b; border-radius: 4px; color: #f5f5f0;">${focus}</span>
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 24px; font-size: 10px; color: rgba(245,245,240,0.4);">
          This notification was dispatched automatically by your custom React Portfolio booking portal.
        </div>
      </div>
    `;

    const resultMail = await sendNotificationEmail(subject, htmlBody, textFallback, 'nashiathossain@gmail.com');
    const emailSent = resultMail.success;
    const detailMsg = resultMail.detailMsg;

    res.json({
      success: true,
      emailSent,
      detailMsg,
      booking: savedBooking || { name, email, focus, date, time }
    });
  });

  // Public Contact Lead Interface: Saves and Dispatches Email
  app.post('/api/contact', async (req, res) => {
    const { name, email, businessName, budget, message } = req.body;

    console.log('Received lead contact brief:', { name, email, businessName, budget, message });

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required contact fields (name, email, message).' });
    }

    let savedLead;
    try {
      savedLead = await dbService.addLead({
        name,
        email,
        businessName: businessName || 'Sovereign Brand',
        budget: budget || '$5k - $10k',
        message
      });
    } catch (dbErr) {
      console.error('Database failure storing project brief', dbErr);
    }

    // Try sending email notification via unified handler
    const subject = `[Project Brief] Dispatched: ${name} (${budget})`;
    const textFallback = `
Dear Nashiat,

A premium client project brief has been filed via your online contact board.

Client: ${name}
Email: ${email}
Business Name: ${businessName || 'N/A'}
Allocated Budget: ${budget}

Message:
"${message}"

Log in to your Admin Panel to view/respond to all messages instantly!
    `;
    const htmlBody = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #c9a46c; border-radius: 12px; background-color: #0b0b0b; color: #f5f5f0;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #c9a46c; font-size: 22px; margin: 0; text-transform: uppercase; letter-spacing: 2px;">New Contact Lead</h1>
          <p style="color: #a3a3a3; font-size: 11px; font-family: monospace; margin: 4px 0 0 0;">SYSTEM HANDSHAKE SUCCESSFUL</p>
        </div>
        
        <div style="background-color: #121212; border: 1px solid rgba(255,255,255,0.05); padding: 20px; border-radius: 8px;">
          <p style="margin: 0 0 12px 0; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px;">
            <strong style="color: #c9a46c;">Lead Name:</strong> <span style="float: right;">${name}</span>
          </p>
          <p style="margin: 0 0 12px 0; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px;">
            <strong style="color: #c9a46c;">Email Address:</strong> <span style="float: right; font-family: monospace;">${email}</span>
          </p>
          <p style="margin: 0 0 12px 0; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px;">
            <strong style="color: #c9a46c;">Business Name:</strong> <span style="float: right;">${businessName || 'Sovereign Brand'}</span>
          </p>
          <p style="margin: 0 0 12px 0; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px;">
            <strong style="color: #c9a46c;">Allocated Budget:</strong> <span style="float: right;">${budget}</span>
          </p>
          <p style="margin: 0; font-size: 14px;">
            <strong style="color: #c9a46c;">Brief Message:</strong> <span style="display: block; margin-top: 6px; padding: 12px; background-color: #0b0b0b; border-radius: 4px; color: #f5f5f0; line-height: 1.6; border: 1px solid rgba(255,255,255,0.03); white-space: pre-wrap;">${message}</span>
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 24px; font-size: 10px; color: rgba(245,245,240,0.4);">
          This notification was dispatched automatically by your custom React Portfolio contact engine.
        </div>
      </div>
    `;

    const resultMail = await sendNotificationEmail(subject, htmlBody, textFallback, 'nashiathossain@gmail.com');
    const emailSent = resultMail.success;

    res.json({
      success: true,
      emailSent,
      detailMsg: resultMail.detailMsg,
      lead: savedLead || { name, email, businessName, budget, message }
    });
  });

  // For non-Vercel environments (e.g. local development or standard containers)
  if (!process.env.VERCEL) {
    const PORT = 3000;
    if (process.env.NODE_ENV !== 'production') {
      import('vite').then(({ createServer: createViteServer }) => {
        createViteServer({
          server: { middlewareMode: true },
          appType: 'spa',
        }).then(vite => {
          app.use(vite.middlewares);
          app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server running on port ${PORT}`);
          });
        }).catch(err => {
          console.error('Failed to create Vite server:', err);
        });
      }).catch(err => {
        console.error('Failed to dynamically import Vite dev server:', err);
      });
    } else {
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
      app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on port ${PORT}`);
      });
    }
  }

export default app;
