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

// Helper function to load SMTP credentials securely from Firestore
async function getFirestoreSmtp(): Promise<{ host: string; port: number; user: string; pass: string } | null> {
  try {
    const docSnap = await getDoc(doc(db, 'settings', 'smtp'));
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data && data.user && data.pass) {
        return {
          host: data.host || 'smtp.gmail.com',
          port: parseInt(data.port || '587', 10),
          user: data.user,
          pass: data.pass
        };
      }
    }
  } catch (error) {
    console.error('Failed to load SMTP credentials from Firestore:', error);
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
      console.warn('Gmail API send failed, falling back to SMTP:', (gmailErr as Error).message);
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

  // Load SMTP from Firestore or fallback to Env variables
  let smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  let smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
  let smtpUser = process.env.SMTP_USER;
  let smtpPass = process.env.SMTP_PASS;

  const firestoreSmtp = await getFirestoreSmtp();
  if (firestoreSmtp) {
    console.log('Using custom SMTP credentials loaded from Firestore settings/smtp doc.');
    smtpHost = firestoreSmtp.host;
    smtpPort = firestoreSmtp.port;
    smtpUser = firestoreSmtp.user;
    smtpPass = firestoreSmtp.pass;
  }

  if (smtpUser && smtpPass) {
    try {
      console.log(`Attempting to send email via SMTP Nodemailer (${smtpHost}:${smtpPort}) for ${smtpUser}...`);
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
      console.warn('SMTP Nodemailer send failed gracefully. Please verify your SMTP credentials (such as Google App Passwords) for mail dispatch:', (smtpErr as Error).message);
      return { success: false, method: 'none', detailMsg: `SMTP Error: ${(smtpErr as Error).message}` };
    }
  }

  console.warn('No active email delivery channel (neither Gmail API nor SMTP secrets are configured).');
  return { success: false, method: 'none', detailMsg: 'Simulated delivery (authorize Gmail in Settings or configure SMTP secrets for outward dispatch).' };
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Permissive CORS middleware for cross-origin scheduling and direct browser requests
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Normalize request URLs for robust Vercel serverless function routing.
// If req.url is rewritten to /api/index.ts or contains `/api/index.ts/...`
// we strip the function filename so Express router can match the endpoints correctly.
app.use((req, res, next) => {
  console.log(`[Express Incoming Request] Method: ${req.method} | Original URL: ${req.url}`);
  
  if (req.url.startsWith('/api/index.ts')) {
    req.url = req.url.slice('/api/index.ts'.length);
  } else if (req.url.startsWith('/index.ts')) {
    req.url = req.url.slice('/index.ts'.length);
  }
  
  if (!req.url || req.url === '') {
    req.url = '/';
  }
  
  console.log(`[Express Normalized Request] Method: ${req.method} | Final Routed URL: ${req.url}`);
  next();
});

// Initialize seeded database storage asynchronously in the background.
// We guide this outside Vercel to optimize cold boots and avoid top-level socket hangs.
if (!process.env.VERCEL) {
  initDatabase().catch(err => {
    console.error('Failed to asynchronously initialize the seeded Firestore schemas:', err);
  });
}

// Create verified API router to mount cleanly under both '/api' and '/'
const apiRouter = express.Router();

// Public Profile Info
apiRouter.get('/profile', async (req, res) => {
  try {
    const s = await dbService.getSettings();
    res.json({ success: true, profile: s.profile });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Public Booking Interface: Saves and Dispatches Email
apiRouter.post('/book', async (req, res) => {
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
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; border: 1px solid rgba(139, 92, 246, 0.3); border-top: 4px solid #8b5cf6; border-radius: 12px; background-color: #09090b; color: #f4f4f5; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.4);">
      <div style="text-align: center; margin-bottom: 28px;">
        <h1 style="color: #ffffff; font-size: 20px; font-weight: 700; margin: 0; text-transform: uppercase; letter-spacing: 2px;">New Meeting Booked</h1>
        <p style="color: #a78bfa; font-size: 11px; font-family: monospace; font-weight: bold; margin: 6px 0 0 0; letter-spacing: 1px;">NASHIAT HOSSAIN // INBOUND CALENDAR</p>
      </div>
      
      <div style="background-color: #121214; border: 1px solid rgba(255,255,255,0.03); padding: 24px; border-radius: 10px;">
        <p style="margin: 0 0 14px 0; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.04); padding-bottom: 10px; display: block; overflow: hidden;">
          <strong style="color: #a78bfa;">Client Name:</strong> <span style="float: right; color: #ffffff; font-weight: 500;">${name}</span>
        </p>
        <p style="margin: 0 0 14px 0; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.04); padding-bottom: 10px; display: block; overflow: hidden;">
          <strong style="color: #a78bfa;">Email Address:</strong> <span style="float: right; font-family: monospace; color: #ffffff;">${email}</span>
        </p>
        <p style="margin: 0 0 14px 0; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.04); padding-bottom: 10px; display: block; overflow: hidden;">
          <strong style="color: #a78bfa;">Requested Date:</strong> <span style="float: right; color: #ffffff;">${date}, 2026</span>
        </p>
        <p style="margin: 0 0 14px 0; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.04); padding-bottom: 10px; display: block; overflow: hidden;">
          <strong style="color: #a78bfa;">Timeslot:</strong> <span style="float: right; color: #ffffff;">${time}</span>
        </p>
        <p style="margin: 0; font-size: 14px;">
          <strong style="color: #a78bfa;">Project Bottleneck:</strong> 
          <span style="display: block; margin-top: 8px; padding: 12px; background-color: #09090b; border: 1px solid rgba(139, 92, 246, 0.15); border-radius: 6px; color: #e4e4e7; line-height: 1.5;">${focus}</span>
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 28px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.04);">
        <p style="margin: 0; font-size: 11px; color: rgba(244,244,245,0.4); line-height: 1.5;">
          This notification was dispatched automatically by your custom **Nashiat Hossain** portfolio booking portal.
        </p>
      </div>
    </div>
  `;

  let emailSent = false;
  let detailMsg = 'Skipped notification.';
  try {
    const resultMail = await sendNotificationEmail(subject, htmlBody, textFallback, 'nashiathossain@gmail.com');
    emailSent = resultMail.success;
    detailMsg = resultMail.detailMsg;
  } catch (mailErr) {
    console.error('Admin booking email dispatch failed:', mailErr);
    detailMsg = `Error: ${(mailErr as Error).message}`;
  }

  // Send confirmation email to the client who booked the meeting
  const clientSubject = `Meeting Confirmed: Nashiat Hossain × ${name}`;
  const clientTextFallback = `
Hi ${name},

Your strategy meeting has been successfully booked with Nashiat Hossain.

=========================================
Confirmed Timeslot Details:
=========================================
Meeting Date: ${date}, 2026
Timeslot: ${time}
Primary Focus: ${focus}

I will personally review your project focus area and reach out shortly with a meeting invite link.

Best regards,
Nashiat Hossain
https://www.instagram.com/_vxnash/
=========================================
  `;

  const clientHtmlBody = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; border: 1px solid rgba(139, 92, 246, 0.3); border-top: 4px solid #8b5cf6; border-radius: 12px; background-color: #09090b; color: #f4f4f5; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.4);">
      <div style="text-align: center; margin-bottom: 28px;">
        <h1 style="color: #ffffff; font-size: 20px; font-weight: 700; margin: 0; text-transform: uppercase; letter-spacing: 2px;">Meeting Scheduled</h1>
        <p style="color: #a78bfa; font-size: 11px; font-family: monospace; font-weight: bold; margin: 6px 0 0 0; letter-spacing: 1px;">NASHIAT HOSSAIN × DESIGN & DEVELOPMENT</p>
      </div>
      
      <div style="margin-bottom: 24px; font-size: 15px; line-height: 1.6; color: #d4d4d8;">
        <p>Hi <strong>${name}</strong>,</p>
        <p>Thank you for booking a strategy session. I have reserved your spot, and I'm excited to collaborate. We will dive deep into solving your digital bottleneck and outline a high-converting roadmap for your brand.</p>
      </div>

      <div style="background-color: #121214; border: 1px solid rgba(255,255,255,0.03); padding: 24px; border-radius: 10px; margin-bottom: 24px;">
        <h3 style="margin: 0 0 16px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #a78bfa; border-bottom: 1px solid rgba(255,255,255,0.04); padding-bottom: 8px;">Your Confirmed Session</h3>
        
        <p style="margin: 0 0 14px 0; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.04); padding-bottom: 10px; display: block; overflow: hidden;">
          <strong style="color: #a78bfa;">Meeting Date:</strong> <span style="float: right; color: #ffffff;">${date}, 2026</span>
        </p>
        <p style="margin: 0 0 14px 0; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.04); padding-bottom: 10px; display: block; overflow: hidden;">
          <strong style="color: #a78bfa;">Timeslot:</strong> <span style="float: right; color: #ffffff;">${time}</span>
        </p>
        <p style="margin: 0; font-size: 14px;">
          <strong style="color: #a78bfa;">Target Bottleneck:</strong> 
          <span style="display: block; margin-top: 8px; padding: 12px; background-color: #09090b; border: 1px solid rgba(139, 92, 246, 0.15); border-radius: 6px; color: #e4e4e7; line-height: 1.5;">${focus}</span>
        </p>
      </div>

      <div style="margin-bottom: 28px; font-size: 14px; line-height: 1.6; color: #a1a1aa;">
        <p><strong>Next Step:</strong> I will personally review your info and reach out shortly with a meeting invite link (e.g., Google Meet). In the meantime, feel free to gather any design assets, brand goals, or guidelines you'd like to address.</p>
      </div>
      
      <div style="text-align: center; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.04);">
        <p style="margin: 0 0 16px 0; font-size: 11px; color: rgba(244,244,245,0.4);">
          Have questions or need to make adjustments beforehand? Connect with me directly on Instagram.
        </p>
        <a href="https://www.instagram.com/_vxnash/" target="_blank" style="display: inline-block; background-color: #8b5cf6; color: #ffffff; text-decoration: none; padding: 10px 20px; font-size: 12px; font-weight: bold; border-radius: 6px; text-transform: uppercase; letter-spacing: 1px; transition: background-color 0.2s;">
          Connect on Instagram
        </a>
      </div>
    </div>
  `;

  // Dispatch confirmation to clients email
  try {
    console.log(`Dispatching confirmation receipt to booking client: ${email}`);
    await sendNotificationEmail(clientSubject, clientHtmlBody, clientTextFallback, email);
  } catch (clientMailErr) {
    console.warn('Client confirmation receipt dispatch failed gracefully:', (clientMailErr as Error).message);
  }

  res.json({
    success: true,
    emailSent,
    detailMsg,
    booking: savedBooking || { name, email, focus, date, time }
  });
});

// Public Contact Lead Interface: Saves and Dispatches Email
apiRouter.post('/contact', async (req, res) => {
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
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; border: 1px solid rgba(139, 92, 246, 0.3); border-top: 4px solid #8b5cf6; border-radius: 12px; background-color: #09090b; color: #f4f4f5; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.4);">
      <div style="text-align: center; margin-bottom: 28px;">
        <h1 style="color: #ffffff; font-size: 20px; font-weight: 700; margin: 0; text-transform: uppercase; letter-spacing: 2px;">New Contact Lead</h1>
        <p style="color: #a78bfa; font-size: 11px; font-family: monospace; font-weight: bold; margin: 6px 0 0 0; letter-spacing: 1px;">NASHIAT HOSSAIN // COLLABORATION LEAD</p>
      </div>
      
      <div style="background-color: #121214; border: 1px solid rgba(255,255,255,0.03); padding: 24px; border-radius: 10px;">
        <p style="margin: 0 0 14px 0; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.04); padding-bottom: 10px; display: block; overflow: hidden;">
          <strong style="color: #a78bfa;">Lead Name:</strong> <span style="float: right; color: #ffffff; font-weight: 500;">${name}</span>
        </p>
        <p style="margin: 0 0 14px 0; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.04); padding-bottom: 10px; display: block; overflow: hidden;">
          <strong style="color: #a78bfa;">Email Address:</strong> <span style="float: right; font-family: monospace; color: #ffffff;">${email}</span>
        </p>
        <p style="margin: 0 0 14px 0; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.04); padding-bottom: 10px; display: block; overflow: hidden;">
          <strong style="color: #a78bfa;">Business Name:</strong> <span style="float: right; color: #ffffff;">${businessName || 'Sovereign Brand'}</span>
        </p>
        <p style="margin: 0 0 14px 0; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.04); padding-bottom: 10px; display: block; overflow: hidden;">
          <strong style="color: #a78bfa;">Allocated Budget:</strong> <span style="float: right; color: #ffffff;">${budget}</span>
        </p>
        <p style="margin: 0; font-size: 14px;">
          <strong style="color: #a78bfa;">Brief Message:</strong> 
          <span style="display: block; margin-top: 8px; padding: 12px; background-color: #09090b; border: 1px solid rgba(139, 92, 246, 0.15); border-radius: 6px; color: #e4e4e7; line-height: 1.6; white-space: pre-wrap;">${message}</span>
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 28px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.04);">
        <p style="margin: 0; font-size: 11px; color: rgba(244,244,245,0.4); line-height: 1.5;">
          This notification was dispatched automatically by your custom **Nashiat Hossain** portfolio contact engine.
        </p>
      </div>
    </div>
  `;

  let emailSent = false;
  let detailMsg = 'Skipped notification.';
  try {
    const resultMail = await sendNotificationEmail(subject, htmlBody, textFallback, 'nashiathossain@gmail.com');
    emailSent = resultMail.success;
    detailMsg = resultMail.detailMsg;
  } catch (mailErr) {
    console.error('Admin contact email dispatch failed:', mailErr);
    detailMsg = `Error: ${(mailErr as Error).message}`;
  }

  res.json({
    success: true,
    emailSent,
    detailMsg,
    lead: savedLead || { name, email, businessName, budget, message }
  });
});

// --- ADMIN CONTROL CONSOLE ENDPOINTS ---

// Admin verification helper
const verifyAdminPassword = (req: express.Request) => {
  const reqPass = req.headers['x-admin-password'] || req.query.adminPassword;
  const correctPass = process.env.ADMIN_PASSWORD || 'NashiatSuccess2026!';
  return reqPass === correctPass;
};

// Admin authentication login router
apiRouter.post('/admin/login', (req, res) => {
  const { password } = req.body;
  const correctPass = process.env.ADMIN_PASSWORD || 'NashiatSuccess2026!';
  if (password === correctPass) {
    return res.json({ success: true });
  }
  return res.status(401).json({ success: false, error: 'Unauthorized: Invalid credentials.' });
});

// Load SMTP settings (with password field obscured for UI safety)
apiRouter.get('/admin/smtp', async (req, res) => {
  if (!verifyAdminPassword(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const docSnap = await getDoc(doc(db, 'settings', 'smtp'));
    if (docSnap.exists()) {
      const d = docSnap.data();
      return res.json({
        success: true,
        smtp: {
          host: d.host || 'smtp.gmail.com',
          port: d.port || 587,
          user: d.user || '',
          pass: d.pass ? '••••••••' : ''
        }
      });
    }
    return res.json({
      success: true,
      smtp: {
        host: 'smtp.gmail.com',
        port: 587,
        user: '',
        pass: ''
      }
    });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

// Update & sync SMTP settings securely within Firestore
apiRouter.post('/admin/smtp', async (req, res) => {
  if (!verifyAdminPassword(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const { host, port, user, pass } = req.body;
  try {
    const docRef = doc(db, 'settings', 'smtp');
    const existingSnap = await getDoc(docRef);
    let finalPass = pass;
    
    // If the input is our placeholder, preserve the original value stored in DB
    if (pass === '••••••••' && existingSnap.exists()) {
      finalPass = existingSnap.data().pass;
    }

    await setDoc(docRef, {
      host: host || 'smtp.gmail.com',
      port: parseInt(port || '587', 10),
      user: user || '',
      pass: finalPass || '',
      updatedAt: new Date().toISOString()
    });

    return res.json({ success: true, message: 'SMTP settings successfully stored in Cloud Firestore settings/smtp doc.' });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

// Launch custom SMTP socket analysis & output real-time handshake terminal logs
apiRouter.post('/admin/test-smtp', async (req, res) => {
  if (!verifyAdminPassword(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const { host, port, user, pass } = req.body;
  const testHost = host || 'smtp.gmail.com';
  const testPort = parseInt(port || '587', 10);
  const testUser = user;
  let testPass = pass;

  if (pass === '••••••••') {
    const docSnap = await getDoc(doc(db, 'settings', 'smtp'));
    if (docSnap.exists()) {
      testPass = docSnap.data().pass;
    }
  }

  if (!testUser || !testPass) {
    return res.status(400).json({ success: false, error: 'Mailing username and password credentials cannot be empty.' });
  }

  console.log(`[Diagnostic] Executing nodemailer connection test for: ${testHost}:${testPort} with user ${testUser}...`);

  try {
    const transporter = nodemailer.createTransport({
      host: testHost,
      port: testPort,
      secure: testPort === 465,
      auth: {
        user: testUser,
        pass: testPass
      },
      connectionTimeout: 10000 // 10s socket timeout
    });

    // Verify SMTP connection handshake
    await transporter.verify();
    console.log('[Diagnostic] SMTPSocket verification successful! Dispatching live confirm email...');

    // Try sending real email to user nashiathossain@gmail.com
    const info = await transporter.sendMail({
      from: `"Diagnostic Center" <${testUser}>`,
      to: 'nashiathossain@gmail.com',
      subject: `[Diagnostic Center] Active SMTP Connection Success!`,
      text: `Congratulations! Your custom portfolio email dispatch handshake is active and functioning perfectly.\n\nValidated Server: ${testHost}:${testPort}\nVerified User: ${testUser}\n\nTime Verified: ${new Date().toLocaleString()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #10b981; border-top: 4px solid #10b981; border-radius: 8px; background-color: #0c0a09; color: #f5f5f4;">
          <h2 style="color: #10b981; margin-top: 0;">✓ Outbound SMTP Active!</h2>
          <p>Your custom portfolio application has established a fully functional SMTP socket connection with your email delivery service.</p>
          <hr style="border: 0; border-top: 1px solid #292524; margin: 16px 0;" />
          <ul style="list-style: none; padding: 0; margin: 0; font-family: monospace; font-size: 13px; line-height: 1.6;">
            <li><strong>SMTP Server:</strong> ${testHost}:${testPort}</li>
            <li><strong>Mailing User:</strong> ${testUser}</li>
            <li><strong>SSL/TLS Mode:</strong> ${testPort === 465 ? 'Implicit SECURE' : 'Explicit STARTTLS'}</li>
            <li><strong>Dispatched To:</strong> nashiathossain@gmail.com</li>
          </ul>
        </div>
      `
    });

    return res.json({
      success: true,
      message: 'SMTP socket verified and test notification dispatched to nashiathossain@gmail.com successfully!',
      responseId: info.messageId
    });
  } catch (err) {
    console.error('[Diagnostic Error] SMTP handshake test failed:', err);
    return res.json({
      success: false,
      error: `Handshake Failed: ${(err as Error).message}`,
      code: (err as any).code || 'SOCKET_ERR',
      stack: (err as Error).stack || undefined
    });
  }
});

// Admin listings for reviews and state verification
apiRouter.get('/admin/data', async (req, res) => {
  if (!verifyAdminPassword(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const bookings = await dbService.getBookings() || [];
    const leads = await dbService.getLeads() || [];
    return res.json({
      success: true,
      bookings,
      leads
    });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

// Mount the API Router under both '/api' and '/' for maximum routing robustness on Vercel and local
app.use('/api', apiRouter);
app.use('/', apiRouter);

  // For non-Vercel environments (e.g. local development or standard containers)
  if (!process.env.VERCEL) {
    const PORT = 3000;
    if (process.env.NODE_ENV !== 'production') {
      const viteModule = 'vite';
      import(viteModule).then(({ createServer: createViteServer }) => {
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
