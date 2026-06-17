import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { dbService } from './db';

dotenv.config();

// Configure Database (Supabase) lazily to prevent startup crashes when env vars are unconfigured
let _supabaseClient: any = null;
function getSupabase(): any {
  if (!_supabaseClient) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error('[CONFIGURATION ERROR] Supabase is missing required environmental coordinates (SUPABASE_URL and SUPABASE_ANON_KEY).');
    }
    _supabaseClient = createClient(url, key);
  }
  return _supabaseClient;
}

// Configure Resend Email lazily to prevent startup crashes when env vars are unconfigured
let _resendClient: Resend | null = null;
function getResend(): Resend | null {
  if (!_resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      _resendClient = new Resend(apiKey);
    }
  }
  return _resendClient;
}

const adminEmail = process.env.ADMIN_EMAIL || 'nashiathossain@gmail.com';
const systemFromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

// Configure Express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Enable CORS
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token']
}));

// ----------------------------------------------------
// SECURITY IMPLEMENTATIONS
// ----------------------------------------------------

// 1. IP-Based Rate Limiting Middleware
const ipRequestHistory = new Map<string, { count: number; resetAt: number }>();
const rateLimit = (maxRequests: number, windowMs: number) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const ip = req.ip || req.headers['x-forwarded-for'] as string || 'system-ip';
    const now = Date.now();
    const history = ipRequestHistory.get(ip);

    if (!history || now > history.resetAt) {
      ipRequestHistory.set(ip, { count: 1, resetAt: now + windowMs });
      return next();
    }

    history.count++;
    if (history.count > maxRequests) {
      return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }
    next();
  };
};

// 2. Input Sanitization Helper (HTML/Script tag stripper)
function sanitize(input: any): any {
  if (typeof input === 'string') {
    return input.replace(/<[^>]*>/g, '').trim();
  }
  if (Array.isArray(input)) {
    return input.map(item => sanitize(item));
  }
  if (input !== null && typeof input === 'object') {
    const sanitizedObj: { [key: string]: any } = {};
    for (const key in input) {
      sanitizedObj[key] = sanitize(input[key]);
    }
    return sanitizedObj;
  }
  return input;
}

// 3. Spam Detection Filter
function isSpam(text: string): boolean {
  if (!text) return false;
  const spamKeywords = [
    'casino', 'dating', 'viagra', 'porn', 'cryptocurrency', 'lottery', 
    'earn money fast', 'free cash', 'make dollars', 'pharmacy', 'bitcoin'
  ];
  const lowercaseText = text.toLowerCase();
  return spamKeywords.some(keyword => lowercaseText.includes(keyword));
}

// Normalize request URLs for serverless / index mapping stability
app.use((req, res, next) => {
  if (req.url.startsWith('/api/index.ts')) {
    req.url = req.url.slice('/api/index.ts'.length);
  } else if (req.url.startsWith('/index.ts')) {
    req.url = req.url.slice('/index.ts'.length);
  }
  if (!req.url || req.url === '') {
    req.url = '/';
  }
  next();
});

// ----------------------------------------------------
// ROUTER INITIALIZATION
// ----------------------------------------------------
const apiRouter = express.Router();

// 1. PROFILE ENDPOINT (Retrieves settings from Firebase setting collection, with local high-fidelity fallback)
apiRouter.get('/profile', async (req, res) => {
  try {
    const settings = await dbService.getSettings();
    const profile = settings?.profile || {
      fullName: 'Nashiat Hossain',
      roleTitle: 'Full-stack Web Developer & Creative UX Designer',
      bioIntroduction: 'Crafting websites that help brands stand out and convert.',
      bioLong: 'I design and build modern websites for businesses, startups, and personal brands that want a strong online presence. My focus is not just making websites look beautiful — but creating websites that feel premium, perform fast, and help convert visitors into clients.',
      whatsappPhone: '8801342272168',
      contactEmail: 'nashiathossain@gmail.com',
      githubLink: 'https://github.com/nashiathossain',
      linkedinLink: 'https://linkedin.com/in/nashiathossain',
      totalProjectsCount: 12,
      handcraftedBuiltPercent: 100,
      lighthouseTarget: '90+',
      designStandardName: 'Luxury'
    };

    return res.json({
      success: true,
      profile
    });
  } catch (err) {
    console.error('[Profile Fetch Error] Falling back to default:', err);
    return res.json({
      success: true,
      profile: {
        fullName: 'Nashiat Hossain',
        roleTitle: 'Full-stack Web Developer & Creative UX Designer',
        bioIntroduction: 'Crafting websites that help brands stand out and convert.',
        bioLong: 'I design and build modern websites for businesses, startups, and personal brands that want a strong online presence. My focus is not just making websites look beautiful — but creating websites that feel premium, perform fast, and help convert visitors into clients.',
        whatsappPhone: '8801342272168',
        contactEmail: 'nashiathossain@gmail.com',
        githubLink: 'https://github.com/nashiathossain',
        linkedinLink: 'https://linkedin.com/in/nashiathossain',
        totalProjectsCount: 12,
        handcraftedBuiltPercent: 100,
        lighthouseTarget: '90+',
        designStandardName: 'Luxury'
      }
    });
  }
});

// 2. CONTACT LEAD SUBMISSION ENDPOINT
apiRouter.post('/contact', rateLimit(10, 60000), async (req, res) => {
  try {
    const body = sanitize(req.body);
    const { name, email, businessName, budget, message } = body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: 'Name field cannot be left blank.' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ error: 'A valid email address is required.' });
    }
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Brief details message cannot be empty.' });
    }

    if (isSpam(name) || isSpam(message)) {
      return res.status(400).json({ error: 'Your project brief could not be submitted due to standard anti-spam policies.' });
    }

    // Attempt to save to database
    let savedLead = null;
    try {
      savedLead = await dbService.addLead({
        name,
        email,
        businessName: businessName || '',
        budget: budget || '',
        message
      });
    } catch (saveError) {
      console.error('[Contact Form DB Save Error] Continuing without database storage:', saveError);
    }

    // Try sending email via Resend
    let emailSent = false;
    const mailer = getResend();
    if (mailer) {
      try {
        await mailer.emails.send({
          from: `New Lead <${systemFromEmail}>`,
          to: adminEmail,
          subject: `Portfolio Project Brief from ${name}`,
          html: `
            <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #1f1f23; background-color: #0b0b0b; color: #f5f5f0; border-radius: 8px;">
              <h2 style="color: #a78bfa; margin-top: 0; padding-bottom: 8px; border-bottom: 1px solid #1f1f23;">New Project Brief Received</h2>
              <div style="margin: 16px 0;">
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Business Name:</strong> ${businessName || 'Not Provided'}</p>
                <p><strong>Proposed Budget:</strong> ${budget || 'Not Provided'}</p>
              </div>
              <div style="background-color: #161618; padding: 16px; border-radius: 4px; border: 1px solid #1f1f23; margin-top: 16px;">
                <p style="margin-top: 0; color: #a1a1aa; font-weight: 500;">Message Brief:</p>
                <p style="white-space: pre-wrap; line-height: 1.5; color: #e4e4e7; margin-bottom: 0;">${message}</p>
              </div>
              <p style="font-size: 13px; color: #71717a; margin-top: 24px; text-align: center; border-top: 1px solid #1f1f23; padding-top: 12px;">Submitted dynamically from portfolio site contact panel.</p>
            </div>
          `
        });
        emailSent = true;
      } catch (mailError) {
        console.error('[Contact Form Email Error] Failed to dispatch mail notifications:', mailError);
      }
    }

    return res.json({
      success: true,
      lead: savedLead || {
        id: 'fallback-' + Math.random().toString(36).substring(2, 7),
        name,
        email,
        businessName,
        budget,
        message,
        timestamp: new Date().toISOString()
      },
      emailSent
    });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

// 3. AVAILABILITY SYSTEM ENDPOINT (Asia/Dhaka query matcher)
apiRouter.get('/availability', async (req, res) => {
  try {
    // Read non-cancelled bookings from Supabase
    const { data: bookings, error } = await getSupabase()
      .from('meetings')
      .select('selected_date, selected_time')
      .neq('status', 'cancelled');

    if (error) {
      console.error('[Supabase Fetch Error] Loading current slots:', error);
    }

    const occupiedSlots = bookings || [];

    // Create 7 available calendar scheduling days starting from tomorrow
    const getDaysList = () => {
      const days = [];
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
      const baseDate = new Date();
      for (let i = 1; i <= 7; i++) {
        const d = new Date();
        d.setDate(baseDate.getDate() + i);
        days.push(`${monthNames[d.getMonth()]} ${d.getDate()}`);
      }
      return days;
    };

    const calendarDays = getDaysList();
    const standardDhakaSlots = ["05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM", "10:00 PM"];

    const availabilityMap: { [dateKey: string]: string[] } = {};

    calendarDays.forEach(dateKey => {
      // Find occupied slots for this exact date
      const occupiedTimesForDay = occupiedSlots
        .filter(b => b.selected_date === dateKey)
        .map(b => b.selected_time);

      // Remaining available timeslots
      availabilityMap[dateKey] = standardDhakaSlots.filter(slot => !occupiedTimesForDay.includes(slot));
    });

    return res.json({
      success: true,
      available: availabilityMap
    });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

// 4. BOOKING CORE API ENDPOINT (With server-side rules and Resend)
apiRouter.post('/book-meeting', rateLimit(5, 60000), async (req, res) => {
  // Sanitize full incoming body details
  const body = sanitize(req.body);
  const { name, email, focus, date, time, dhakaTime } = body;

  // Server-side input validation
  if (!name || name.trim().length < 2) {
    return res.status(400).json({ error: 'Name must be at least 2 characters long.' });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }
  if (!date || !time || !dhakaTime) {
    return res.status(400).json({ error: 'A valid date, local timeslot, and host timeslot coordinates are required.' });
  }

  // Active spam protection message audit
  if (isSpam(name) || isSpam(focus)) {
    return res.status(400).json({ error: 'Your meeting request could not be processed due to suspicious content constraints.' });
  }

  try {
    const supabaseClient = getSupabase();

    // Prevent duplicate bookings: Check if the selected date and time slot are already booked
    const { data: conflict, error: checkErr } = await supabaseClient
      .from('meetings')
      .select('id')
      .eq('selected_date', date)
      .eq('selected_time', dhakaTime)
      .neq('status', 'cancelled')
      .maybeSingle();

    if (conflict) {
      return res.status(409).json({ error: 'This time slot is already occupied. Please pick a separate available slot.' });
    }

    // Additional spam prevention: Check if the same email already has an active booking on that exact slot
    const { data: duplicateEmailBooking, error: emailCheckErr } = await supabaseClient
      .from('meetings')
      .select('id')
      .eq('email', email)
      .eq('selected_date', date)
      .eq('selected_time', dhakaTime)
      .neq('status', 'cancelled')
      .maybeSingle();

    if (duplicateEmailBooking) {
      return res.status(409).json({ error: 'You already have an active booking scheduled for this exact date and slot.' });
    }

    // Save booking data to Supabase table
    const { data: dbBooking, error: insertErr } = await supabaseClient
      .from('meetings')
      .insert({
        name,
        email,
        selected_date: date,
        selected_time: dhakaTime,
        project_type: focus,
        status: 'pending'
      })
      .select()
      .single();

    if (insertErr || !dbBooking) {
      throw new Error(`Database transaction failure: ${insertErr?.message || 'Insert operations returned empty.'}`);
    }

    // Initialize Resend dynamically
    const mailer = getResend();
    let emailsSent = false;

    if (mailer) {
      try {
        console.log('[Resend Mail System] Shipping transactional receipt flows...');

        // 1. Send confirmation email to client
        await mailer.emails.send({
          from: `Meetings <${systemFromEmail}>`,
          to: email,
          subject: 'Meeting Request Received',
          html: `
            <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; border: 1px solid #27272a; background-color: #09090b; color: #f4f4f5; border-radius: 8px;">
              <h2 style="color: #3b82f6; margin-top: 0; font-size: 24px; font-weight: 600; padding-bottom: 12px; border-bottom: 1px solid #27272a;">Meeting Request Received</h2>
              <p style="font-size: 16px; margin-top: 20px;">Dear <strong>${name}</strong>,</p>
              <p style="font-size: 15px; color: #a1a1aa; line-height: 1.6;">Thank you for your request! Your strategy meeting request has been logged successfully. Your scheduling details are presented below:</p>
              
              <div style="background-color: #18181b; padding: 20px; border-radius: 6px; margin: 24px 0; border: 1px solid #27272a;">
                <p style="margin: 8px 0; font-size: 15px;"><strong>Client Name:</strong> ${name}</p>
                <p style="margin: 8px 0; font-size: 15px;"><strong>Project Type:</strong> ${focus}</p>
                <p style="margin: 8px 0; font-size: 15px;"><strong>Selected Date:</strong> ${date}</p>
                <p style="margin: 8px 0; font-size: 15px;"><strong>Selected Time:</strong> ${time}</p>
              </div>

              <p style="font-size: 14px; color: #71717a; line-height: 1.6; border-top: 1px solid #27272a; padding-top: 16px; margin-top: 24px;">
                <strong>Confirmation Message:</strong> This is a confirmation that your request was received. I will review your target focus and follow up with you within 24 hours.
              </p>
            </div>
          `
        });

        // 2. Send notification email to admin/owner
        await mailer.emails.send({
          from: `Meeting Notifications <${systemFromEmail}>`,
          to: adminEmail,
          subject: 'New Meeting Booking',
          html: `
            <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; border: 1px solid #27272a; background-color: #09090b; color: #f4f4f5; border-radius: 8px;">
              <h2 style="color: #ef4444; margin-top: 0; font-size: 24px; font-weight: 600; padding-bottom: 12px; border-bottom: 1px solid #27272a;">New Meeting Booking</h2>
              <p style="font-size: 16px; margin-top: 20px;">A new meeting has been booked via your portfolio site.</p>
              
              <div style="background-color: #18181b; padding: 20px; border-radius: 6px; margin: 24px 0; border: 1px solid #27272a;">
                <p style="margin: 8px 0; font-size: 15px;"><strong>Client Name:</strong> ${name}</p>
                <p style="margin: 8px 0; font-size: 15px;"><strong>Client Email:</strong> ${email}</p>
                <p style="margin: 8px 0; font-size: 15px;"><strong>Selected Date:</strong> ${date}</p>
                <p style="margin: 8px 0; font-size: 15px;"><strong>Selected Time:</strong> ${time} (Dhaka slot: ${dhakaTime})</p>
                <p style="margin: 8px 0; font-size: 15px;"><strong>Project Type:</strong> ${focus}</p>
                <p style="margin: 8px 0; font-size: 15px;"><strong>Booking Timestamp:</strong> ${new Date().toISOString()}</p>
              </div>
            </div>
          `
        });

        emailsSent = true;
      } catch (mailErr) {
        console.error('[Resend Error] Email dispatch pipeline failed:', mailErr);
      }
    }

    return res.json({
      success: true,
      emailSent: emailsSent,
      booking: {
        id: dbBooking.id,
        name,
        email,
        date,
        time,
        status: dbBooking.status
      }
    });

  } catch (err) {
    console.error('[Booking Pipeline Failed]', err);
    return res.status(500).json({ error: (err as Error).message });
  }
});

// 5. LEGACY WRITER FALLBACKS AS ALIAS (support legacy frontends call /api/book)
apiRouter.post('/book', async (req, res) => {
  console.log('[API ROUTE ALIAS] Forwarding book to book-meeting...');
  req.url = '/book-meeting';
  (app as any).handle(req, res);
});

// Register API Router
app.use('/api', apiRouter);

// ----------------------------------------------------
// PRODUCTION VS DEV SERVER LAUNCHER SETUP
// ----------------------------------------------------
if (!process.env.VERCEL) {
  const PORT = 3000;
  const isProd = process.env.NODE_ENV === 'production';

  if (isProd) {
    console.log('[SYSTEM INFO] Booting in PRODUCTION mode. Serving pre-compiled static assets only.');
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Production server running on port ${PORT}`);
    });
  } else {
    console.log('[SYSTEM INFO] Booting in DEVELOPMENT/LOCAL mode. Mounting Vite Hot Reloading middleware.');
    // Keep import dynamic and invisible to standard compilation rewrites to prevent common-js requires of ESM files
    const loadModule = new Function('specifier', 'return import(specifier)');
    loadModule('vite').then(({ createServer: createViteServer }: any) => {
      createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      }).then((vite: any) => {
        app.use(vite.middlewares);
        app.listen(PORT, '0.0.0.0', () => {
          console.log(`Server launched on port ${PORT} with hot reloading module layer.`);
        });
      }).catch((err: any) => {
        console.error('Failed to boot local dev server:', err);
      });
    }).catch((err: any) => {
      console.error('Failed to import Vite dev server module dynamically:', err);
    });
  }
}

export default app;
