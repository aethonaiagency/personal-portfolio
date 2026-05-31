import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Parse payload bodies
  app.use(express.json());

  // API endpoints defined FIRST
  app.post('/api/book', async (req, res) => {
    const { name, email, focus, date, time } = req.body;

    console.log('Received booking details:', { name, email, focus, date, time });

    if (!name || !email || !date || !time) {
      return res.status(400).json({ error: 'Missing required booking fields.' });
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
      booking: { name, email, focus, date, time }
    });
  });

  // Serve static assets in production, leverage Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
