import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { google } from 'googleapis';

dotenv.config();

// Custom request interface for admin authorization middleware
interface AdminRequest extends express.Request {
  admin?: any;
}

// ----------------------------------------------------
// ENVIRONMENT VARIABLE VALIDATION
// ----------------------------------------------------
const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'ADMIN_USERNAME',
  'ADMIN_PASSWORD',
  'JWT_SECRET'
];

requiredEnvVars.forEach(v => {
  if (!process.env[v]) {
    console.warn(`[SYSTEM WARNING] Required environment variable "${v}" is missing! Backend system may work in partial fallback state.`);
  }
});

// Configure Database (Supabase)
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Configure Resend Email
const resendApiKey = process.env.RESEND_API_KEY || '';
const resend = resendApiKey ? new Resend(resendApiKey) : null;
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

// 4. CSRF / Referrer Sanitization check
app.use((req, res, next) => {
  const isPostOrWrite = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);
  if (isPostOrWrite && process.env.NODE_ENV === 'production') {
    const referer = req.headers.referer || req.headers.referrer as string;
    const origin = req.headers.origin;
    const allowedUrls = [process.env.APP_URL, 'localhost:3000', 'run.app'];
    
    const hasValidOrigin = (origin && allowedUrls.some(u => u && origin.includes(u))) ||
                           (referer && allowedUrls.some(u => u && referer.includes(u)));
    
    if (!hasValidOrigin) {
      console.warn(`[Security Alert] Request rejected due to referrer origin check failing.`);
      return res.status(403).json({ error: 'Rejected: Origin not verified.' });
    }
  }
  next();
});

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
// GOOGLE CALENDAR & ZOOM-STYLE MEET CONFIGURATION
// ----------------------------------------------------
function parseDateTimeToISO(dateStr: string, timeStr: string): { startIso: string; endIso: string } {
  try {
    const parts = dateStr.trim().split(' ');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    const monthIdx = monthNames.indexOf(parts[0]);
    const dayVal = parseInt(parts[1], 10);
    const curYear = new Date().getFullYear();
    
    if (monthIdx === -1 || isNaN(dayVal)) {
      throw new Error(`Invalid date components: ${dateStr}`);
    }
    
    // Parse timeStr like "05:00 PM"
    const timeMatch = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!timeMatch) {
      throw new Error(`Invalid time format: ${timeStr}`);
    }
    
    let hr = parseInt(timeMatch[1], 10);
    const min = parseInt(timeMatch[2], 10);
    const ampm = timeMatch[3].toUpperCase();
    if (ampm === 'PM' && hr < 12) hr += 12;
    else if (ampm === 'AM' && hr === 12) hr = 0;
    
    // Dhaka is UTC+6 (Standard local availability target is Asia/Dhaka)
    // Convert Dhaka local hour to UTC (substract 6 hours)
    const startUtc = new Date(Date.UTC(curYear, monthIdx, dayVal, hr - 6, min, 0));
    const endUtc = new Date(startUtc.getTime() + 60 * 60 * 1000); // 1-hour session
    
    return {
      startIso: startUtc.toISOString(),
      endIso: endUtc.toISOString()
    };
  } catch (e) {
    console.error('[Date Parser Error] Falling back to default system timing block:', e);
    const fallbackStart = new Date();
    fallbackStart.setDate(fallbackStart.getDate() + 1); // tomorrow
    const fallbackEnd = new Date(fallbackStart.getTime() + 60 * 60 * 1000);
    return {
      startIso: fallbackStart.toISOString(),
      endIso: fallbackEnd.toISOString()
    };
  }
}

// ----------------------------------------------------
// AUTHENTICATION MIDDLEWARE
// ----------------------------------------------------
const protectAdmin = (req: AdminRequest, res: express.Response, next: express.NextFunction) => {
  const token = req.cookies?.admin_session;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Session missing' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-jwt-secret-key-123456');
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Session expired or invalid' });
  }
};


// ----------------------------------------------------
// ROUTER INITIALIZATION
// ----------------------------------------------------
const apiRouter = express.Router();

// Public Profile endpoint - static robust fallback
apiRouter.get('/profile', (req, res) => {
  res.json({
    success: true,
    profile: {
      fullName: "Nashiat Hossain",
      creativeRole: "Full-Stack Software Engineer & Digital Architect",
      shortBio: "I design bespoke high-performance web systems and full-stack software for digital-first companies looking to build a commanding web presence.",
      avatarUrl: "https://avatars.githubusercontent.com/u/10000000?v=4"
    }
  });
});


// 1. AVAILABILITY ENDPOINT (Asia/Dhaka timezone)
apiRouter.get('/availability', async (req, res) => {
  try {
    // Read non-cancelled bookings from Supabase
    const { data: bookings, error } = await supabase
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


// 2. BOOKING ENDPOINT
apiRouter.post('/book-meeting', rateLimit(5, 60000), async (req, res) => {
  // Sanitize full incoming body
  const body = sanitize(req.body);
  const { name, email, focus, date, time, dhakaTime } = body;

  // Server-side input validation
  if (!name || name.length < 2) {
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
    // Check if the selected time slot is already booked
    const { data: conflict, error: checkErr } = await supabase
      .from('meetings')
      .select('id')
      .eq('selected_date', date)
      .eq('selected_time', dhakaTime)
      .neq('status', 'cancelled')
      .maybeSingle();

    if (conflict) {
      return res.status(409).json({ error: 'This time slot is already occupied. Please pick a separate available coordinate.' });
    }

    // Save initial pending meeting schedule to database
    const { data: dbBooking, error: insertErr } = await supabase
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
      throw new Error(`Database transaction failure: ${insertErr?.message || 'Insert returned null'}`);
    }

    let calendarEventId: string | null = null;
    let meetingLink: string | null = null;

    // Google Calendar Integration (Triggered automatically if credentials exist)
    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN) {
      try {
        console.log('[Google Calendar Service] Authorizing API operations...');
        const oauth2Client = new google.auth.OAuth2(
          process.env.GOOGLE_CLIENT_ID,
          process.env.GOOGLE_CLIENT_SECRET
        );
        oauth2Client.setCredentials({
          refresh_token: process.env.GOOGLE_REFRESH_TOKEN
        });

        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
        const parsed = parseDateTimeToISO(date, dhakaTime);

        console.log('[Google Calendar Service] Creating event and Google Meet room coordinates...');
        const eventResource = {
          summary: `Strategy Session: Nashiat × ${name}`,
          description: `Strategic Focus BottleNeck: ${focus}\nMeeting request booked online via Portfolio scheduler.`,
          start: {
            dateTime: parsed.startIso,
            timeZone: 'Asia/Dhaka'
          },
          end: {
            dateTime: parsed.endIso,
            timeZone: 'Asia/Dhaka'
          },
          attendees: [
            { email: adminEmail },
            { email: email }
          ],
          conferenceData: {
            createRequest: {
              requestId: `schedule-uuid-${dbBooking.id}`,
              conferenceSolutionKey: {
                type: 'hangoutsMeet'
              }
            }
          }
        };

        const eventResponse = await calendar.events.insert({
          calendarId: 'primary',
          requestBody: eventResource,
          conferenceDataVersion: 1
        });

        calendarEventId = eventResponse.data.id || null;
        meetingLink = eventResponse.data.hangoutLink || eventResponse.data.conferenceData?.entryPoints?.[0]?.uri || null;

        console.log(`[Google Calendar Service] Created successfully: ${calendarEventId} | Link: ${meetingLink}`);

        // Update booking row with actual event IDs and meeting links in Supabase
        await supabase
          .from('meetings')
          .update({
            meeting_link: meetingLink,
            calendar_event_id: calendarEventId,
            status: 'confirmed' // Auto-confirm when link is established
          })
          .eq('id', dbBooking.id);

      } catch (gcalErr) {
        console.error('[Google Calendar Service Error] Connection failed gracefully:', gcalErr);
      }
    }

    // ----------------------------------------------------
    // EMAIL DISPATCH SYSTEM (RESEND)
    // ----------------------------------------------------
    let emailsSent = false;
    if (resend) {
      try {
        console.log('[Resend Mail System] Shipping transactional receipt flows...');
        
        // 1. Initial Receipt Notification with confirmation metadata to Client
        await resend.emails.send({
          from: `Nashiat Hossain <${systemFromEmail}>`,
          to: email,
          subject: 'Meeting Request Received',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #1f1f23; background-color: #0c0a09; color: #f5f5f4; border-radius: 12px;">
              <h2 style="color: #8b5cf6; margin-top: 0; font-size: 22px; border-bottom: 1px solid #1f1f23; padding-bottom: 10px;">Meeting Scheduled Successfully</h2>
              <p>Hi <strong>${name}</strong>,</p>
              <p>Your strategy meeting request has been logged successfully and is being configured.</p>
              <div style="background-color: #1c1917; padding: 16px; border-radius: 8px; margin: 18px 0; border: 1px solid #292524;">
                <p style="margin: 4px 0;"><strong>Your Target Focus:</strong> ${focus}</p>
                <p style="margin: 4px 0;"><strong>Requested Date:</strong> ${date}</p>
                <p style="margin: 4px 0;"><strong>Selected Timeslot:</strong> ${time}</p>
              </div>
              <p style="font-size: 13px; color: #a8a29e; line-height: 1.5;">This message confirms we secured your submission. If Google Calendar credentials generate successfully, check your inbox for an active Google Calendar event invite link shortly.</p>
            </div>
          `
        });

        // 2. Booking Notification to Admin
        await resend.emails.send({
          from: `Inbound Calendar <${systemFromEmail}>`,
          to: adminEmail,
          subject: 'New Meeting Booking',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #1f1f23; background-color: #0c0a09; color: #f5f5f4; border-radius: 12px;">
              <h2 style="color: #ef4444; margin-top: 0; font-size: 20px; border-bottom: 1px solid #1f1f23; padding-bottom: 10px;">New Portfolio Meeting Booking</h2>
              <p>A new strategy meeting request was submitted online.</p>
              <div style="background-color: #1d1918; padding: 16px; border-radius: 8px; border: 1px solid #292524;">
                <p style="margin: 4px 0;"><strong>Client Name:</strong> ${name}</p>
                <p style="margin: 4px 0;"><strong>Client Email:</strong> ${email}</p>
                <p style="margin: 4px 0;"><strong>Requested Date:</strong> ${date}</p>
                <p style="margin: 4px 0;"><strong>Host Dhaka Slot:</strong> ${dhakaTime}</p>
                <p style="margin: 4px 0;"><strong>Client Local Slot:</strong> ${time}</p>
                <p style="margin: 4px 0;"><strong>Project Type / Target Bottleneck:</strong> ${focus}</p>
                <p style="margin: 4px 0;"><strong>Google Meet URL:</strong> ${meetingLink || 'N/A'}</p>
                <p style="margin: 4px 0;"><strong>Booking Timestamp:</strong> ${new Date().toLocaleString()}</p>
              </div>
            </div>
          `
        });

        // 3. Second Confirmation containing Google Meet URL to Client
        if (meetingLink) {
          await resend.emails.send({
            from: `Meeting Confirmation <${systemFromEmail}>`,
            to: email,
            subject: 'Meeting Room link: Strategy Session Verified',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #10b981; background-color: #0c0a09; color: #f5f5f4; border-radius: 12px; border-top: 4px solid #10b981;">
                <h2 style="color: #10b981; margin-top: 0; font-size: 22px;">Meeting Link generated Successfully</h2>
                <p>Hello <strong>${name}</strong>,</p>
                <p>Your collaborative strategy call with **Nashiat Hossain** lives in the calendar. A Google Calendar room has been created successfully.</p>
                <div style="background-color: #1c1917; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #292524; text-align: center;">
                  <p style="margin: 0 0 8px 0; font-size: 15px;"><strong>Scheduled Hour:</strong> ${time}</p>
                  <p style="margin: 0 0 16px 0; font-size: 14px; color: #a8a29e;"><strong>Strategic Focus:</strong> ${focus}</p>
                  <a href="${meetingLink}" target="_blank" style="display: inline-block; background-color: #10b981; color: #000; text-decoration: none; padding: 12px 24px; font-weight: bold; border-radius: 6px; font-size: 14px; text-transform: uppercase;">
                    Join Google Meet Now
                  </a>
                </div>
                <p style="font-size: 12px; color: #a8a29e;">An active .ics file invite has also been dispatched directly to your email calendar provider for easy attendance tracking.</p>
              </div>
            `
          });
        }

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
        meeting_link: meetingLink || null
      }
    });

  } catch (err) {
    console.error('[Booking Pipeline Failed]', err);
    return res.status(500).json({ error: (err as Error).message });
  }
});


// 3. LEGACY WRITER FALLBACKS AS ALIAS (support legacy frontends)
apiRouter.post('/book', async (req, res) => {
  console.log('[API ROUTE ALIAS] Forwarding book to book-meeting...');
  req.url = '/book-meeting';
  (app as any).handle(req, res);
});


// 4. GENERAL CONTACT ROUTER Integration (Resend + Database fallback)
apiRouter.post('/contact', rateLimit(5, 60000), async (req, res) => {
  const body = sanitize(req.body);
  const { name, email, businessName, budget, message } = body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required validation fields.' });
  }
  if (isSpam(name) || isSpam(message)) {
    return res.status(400).json({ error: 'Filing rejected. Message matches platform safety boundaries.' });
  }

  let emailsSent = false;
  if (resend) {
    try {
      await resend.emails.send({
        from: `Portfolio Contact <${systemFromEmail}>`,
        to: adminEmail,
        subject: `[Project Proposal] ${name} (${budget})`,
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #0c0a09; color: #f5f5f4; padding: 24px; border-radius: 12px; border: 1px solid #1f1f23; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #8b5cf6; margin-top: 0; font-size: 20px; border-bottom: 1px solid #1f1f23; padding-bottom: 10px;">New Project Brief Received</h2>
            <div style="background-color: #1c1917; padding: 16px; border-radius: 8px; border: 1px solid #292524; line-height: 1.6;">
              <p style="margin: 4px 0;"><strong>Sender Name:</strong> ${name}</p>
              <p style="margin: 4px 0;"><strong>Email Address:</strong> ${email}</p>
              <p style="margin: 4px 0;"><strong>Creative Brand:</strong> ${businessName || 'Sovereign'}</p>
              <p style="margin: 4px 0;"><strong>Proposed Budget:</strong> ${budget}</p>
              <hr style="border: 0; border-top: 1px solid #292524; margin: 12px 0;" />
              <p style="margin: 4px 0; font-style: italic;"><strong>Brief details:</strong></p>
              <p style="margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
          </div>
        `
      });
      emailsSent = true;
    } catch (mailErr) {
      console.error('[Resend Contact Dispatch Fail]', mailErr);
    }
  }

  return res.json({
    success: true,
    emailSent: emailsSent,
    message: 'Message dispatched successfully!'
  });
});


// 5. ADMIN AUTH LOGIN ENDPOINT
apiRouter.post('/admin/login', rateLimit(10, 60000), (req, res) => {
  const { username, password } = req.body;
  const targetUser = process.env.ADMIN_USERNAME || 'admin';
  const targetPass = process.env.ADMIN_PASSWORD || 'NashiatSuccess2026!';

  if (username === targetUser && password === targetPass) {
    const sessionToken = jwt.sign(
      { username: targetUser }, 
      process.env.JWT_SECRET || 'fallback-jwt-secret-key-123456', 
      { expiresIn: '1d' }
    );

    res.cookie('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 1-day cookie lifecycles
    });

    return res.json({ success: true, message: 'Logged in successfully.' });
  }

  return res.status(401).json({ success: false, error: 'Unauthorized: Invalid username or password credentials.' });
});


// 6. PROTECTED ADMIN GET MEETINGS ENDPOINT (Search, pagination, filtering)
apiRouter.get('/admin/meetings', protectAdmin, async (req, res) => {
  try {
    const status = req.query.status as string;
    const search = req.query.search as string;
    const limit = parseInt(req.query.limit as string || '10', 10);
    const page = parseInt(req.query.page as string || '1', 10);

    const fromRange = (page - 1) * limit;
    const toRange = fromRange + limit - 1;

    let query = supabase
      .from('meetings')
      .select('*', { count: 'exact' });

    // Status filtering
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    // Search query constraint (name/email filtering)
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    // Newest first sorting, pagination ranges
    query = query
      .order('created_at', { ascending: false })
      .range(fromRange, toRange);

    const { data: records, error, count } = await query;

    if (error) {
      throw error;
    }

    return res.json({
      success: true,
      meetings: records || [],
      total: count || 0,
      page,
      limit
    });

  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
});


// 7. PROTECTED ADMIN GET STATS ENDPOINT
apiRouter.get('/admin/stats', protectAdmin, async (req, res) => {
  try {
    // Aggregation pipeline from Supabase
    const { data: records, error } = await supabase
      .from('meetings')
      .select('status, created_at');

    if (error) {
       throw error;
    }

    const allRecords = records || [];
    const total = allRecords.length;
    const pending = allRecords.filter(m => m.status === 'pending').length;
    const confirmed = allRecords.filter(m => m.status === 'confirmed').length;
    const completed = allRecords.filter(m => m.status === 'completed').length;

    // Aggregating monthly booking frequencies
    const monthlyMap: { [month: string]: number } = {};
    allRecords.forEach(m => {
      if (m.created_at) {
        const d = new Date(m.created_at);
        const key = d.toLocaleString('en-US', { month: 'short', year: 'numeric' }); // "Jun 2026", etc
        monthlyMap[key] = (monthlyMap[key] || 0) + 1;
      }
    });

    return res.json({
      success: true,
      stats: {
        totalBookings: total,
        pendingBookings: pending,
        confirmedBookings: confirmed,
        completedProjects: completed,
        monthlyBookingCount: monthlyMap
      }
    });

  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
});


// 8. PROTECTED ADMIN UPDATE MEETING STATUS
apiRouter.patch('/admin/meeting/:id', protectAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid meeting status request value.' });
    }

    const { data: updatedRecord, error } = await supabase
      .from('meetings')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
       throw error;
    }

    return res.json({
      success: true,
      meeting: updatedRecord,
      message: `Status updated to ${status} successfully.`
    });

  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
});


// 9. PROTECTED ADMIN DELETE MEETING
apiRouter.delete('/admin/meeting/:id', protectAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('meetings')
      .delete()
      .eq('id', id);

    if (error) {
       throw error;
    }

    return res.json({
      success: true,
      message: 'Meeting deleted successfully.'
    });

  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
});


// Mount router
app.use('/api', apiRouter);
app.use('/', apiRouter);


// ----------------------------------------------------
// LOCAL DEV MIDDLEWARE & ASSET SERVING
// ----------------------------------------------------
if (!process.env.VERCEL) {
  const PORT = 3000;
  const isProd = process.env.NODE_ENV === 'production' || fs.existsSync(path.join(process.cwd(), 'dist', 'index.html'));

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
