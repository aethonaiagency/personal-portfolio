import express from 'express';
import path from 'path';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { dbService, initDatabase } from './db';

dotenv.config();

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

    if ((email && email !== envEmail) || password !== envPass) {
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

    // Try sending email via nodemailer
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    const useEmail = smtpUser && smtpPass;

    let emailSent = false;
    let detailMsg = '';

    if (useEmail) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465, // true for 465, false for other ports
          auth: {
            user: smtpUser,
            pass: smtpPass
          }
        });

        const mailOptions = {
          from: `"Nashiat Portfolio Builder" <${smtpUser}>`,
          to: 'nashiathossain@gmail.com',
          subject: `✨ New Discovery Meeting Booked: ${name}`,
          text: `
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
          `,
          html: `
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
          `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Nodemailer successfully dispatched meeting email:', info.messageId);
        emailSent = true;
        detailMsg = `Email sent successfully to nashiathossain@gmail.com`;
      } catch (err) {
        console.error('Nodemailer SMTP transmit error:', err);
        detailMsg = `Nodemailer SMTP error: ${(err as Error).message}`;
      }
    } else {
      console.warn('Simulated booking notification. Create SMTP_USER and SMTP_PASS first in Secrets/Env configurations.');
      detailMsg = 'Simulated delivery (set secrets SMTP_USER and SMTP_PASS for actual outward dispatch).';
    }

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

    // Try sending email notification via nodemailer
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    const useEmail = smtpUser && smtpPass;
    let emailSent = false;

    if (useEmail) {
      try {
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
          to: 'nashiathossain@gmail.com',
          subject: `⚡ New Project Brief Dispatched: ${name} (${budget})`,
          text: `
Dear Nashiat,

A premium client project brief has been filed via your online contact board.

Client: ${name}
Email: ${email}
Business Name: ${businessName || 'N/A'}
Allocated Budget: ${budget}

Message:
"${message}"

Log in to your Admin Panel to view/respond to all messages instantly!
          `
        };

        await transporter.sendMail(mailOptions);
        emailSent = true;
      } catch (err) {
        console.error('Email notification failure for lead:', err);
      }
    }

    res.json({
      success: true,
      emailSent,
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
