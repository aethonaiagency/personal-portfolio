import fs from 'fs';
import path from 'path';

export interface Booking {
  id: string;
  name: string;
  email: string;
  company?: string;
  focus: string; // Meeting topic
  date: string;  // Proposed Date (e.g. "June 1")
  time: string;  // Proposed Time
  description?: string;
  createdAt: string;
  status: 'New' | 'Confirmed' | 'Completed' | 'Cancelled';
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  businessName?: string;
  budget: string;
  message: string;
  timestamp: string;
  status: 'unread' | 'read' | 'archived';
}

export interface AdminSettings {
  availableDays: {
    Monday: boolean;
    Tuesday: boolean;
    Wednesday: boolean;
    Thursday: boolean;
    Friday: boolean;
    Saturday: boolean;
    Sunday: boolean;
  };
  timeSlots: string[];
  blockedDates: string[]; // manually blocked dates
  timezone: string;
  googleMeetLink: string;
  notificationEmail: string;
}

export interface DatabaseSchema {
  bookings: Booking[];
  leads: Lead[];
  settings: AdminSettings;
}

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

const defaultSettings: AdminSettings = {
  availableDays: {
    Monday: true,
    Tuesday: true,
    Wednesday: true,
    Thursday: true,
    Friday: true,
    Saturday: false,
    Sunday: false,
  },
  timeSlots: [
    '09:00 AM (EST)',
    '10:30 AM (EST)',
    '01:00 PM (EST)',
    '02:30 PM (EST)',
    '04:00 PM (EST)',
    '05:30 PM (EST)',
  ],
  blockedDates: ['2026-06-12', '2026-06-25'],
  timezone: 'GMT+6 (Bangladesh) / EST (Eastern Standard)',
  googleMeetLink: 'https://meet.google.com/nas-webdev-meet',
  notificationEmail: 'nashiathossain@gmail.com',
};

// Seed initial mock bookings and leads so the dashboard is beautifully animated on launch!
const defaultBookings: Booking[] = [
  {
    id: 'bk-9z1a',
    name: 'Sarah Jenkins',
    email: 'sarah@glasshaven.co',
    company: 'Glass Haven Design',
    focus: 'E-Commerce Conversion',
    date: 'June 5',
    time: '10:30 AM (EST)',
    description: 'We need to boost our cart conversion rate and refine our product landing details.',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000 * 2).toISOString(), // 2 days ago
    status: 'Confirmed',
  },
  {
    id: 'bk-w29b',
    name: 'Tareq Ahmed',
    email: 'tareq@dhakatech.com',
    company: 'DhakaTech Solutions',
    focus: 'Custom Landing Web Asset',
    date: 'June 4',
    time: '02:30 PM (EST)',
    description: 'Sleek visual marketing site with local search engine optimization highlights.',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000 * 4).toISOString(), // 4 days ago
    status: 'New',
  },
  {
    id: 'bk-c782',
    name: 'Oliver Blackwood',
    email: 'oliver@neovision.agency',
    company: 'NeoVision Media',
    focus: 'Creative Agency Showcase',
    date: 'June 10',
    time: '04:00 PM (EST)',
    description: 'High-end layout transitions, scroll-based animations, and case study interactions.',
    createdAt: new Date().toISOString(),
    status: 'New',
  }
];

const defaultLeads: Lead[] = [
  {
    id: 'ld-fa39',
    name: 'Amir Hossain',
    email: 'amir@craftcaps.com',
    businessName: 'Craft Caps Co.',
    budget: '$5k - $10k',
    message: 'Hello Nashiat, I saw your outstanding Devialet mockup in your portfolio. We are launching a premium headwear brand and need a stunning custom single page experience with high end scroll effects. Let us align on a discovery call.',
    timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), // 1 day ago
    status: 'unread',
  },
  {
    id: 'ld-8b2c',
    name: 'Emily Watson',
    email: 'emily@luxeverse.marketing',
    businessName: 'Luxeverse Marketing',
    budget: '$10k - $25k',
    message: 'We are expanding our agency services and need a client interface designed with glassmorphism layouts. Please send us your case studies and average timelines.',
    timestamp: new Date(Date.now() - 24 * 3600 * 1000 * 3).toISOString(), // 3 days ago
    status: 'read',
  }
];

// Transaction gate to avoid file race conditions
let writeQueue = Promise.resolve();

export function initDatabase() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const data: DatabaseSchema = {
      bookings: defaultBookings,
      leads: defaultLeads,
      settings: defaultSettings,
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    console.log('Database initialized successfully with seeded mock models.');
  }
}

export async function readDatabase(): Promise<DatabaseSchema> {
  initDatabase();
  try {
    const raw = await fs.promises.readFile(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('Database read failure support backend', error);
    return { bookings: [], leads: [], settings: defaultSettings };
  }
}

export async function writeDatabase(data: DatabaseSchema): Promise<void> {
  initDatabase();
  // Queue writing operations sequentially
  writeQueue = writeQueue.then(async () => {
    try {
      await fs.promises.writeFile(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      console.error('Database write atomic write crash:', error);
    }
  });
  return writeQueue;
}

// Higher-order helper operations for streamlined CRUD
export const dbService = {
  // BOOKINGS CRUD
  async getBookings() {
    const d = await readDatabase();
    return d.bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async addBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'status'>) {
    const d = await readDatabase();
    const newBooking: Booking = {
      ...booking,
      id: 'bk-' + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString(),
      status: 'New'
    };
    d.bookings.push(newBooking);
    await writeDatabase(d);
    return newBooking;
  },

  async updateBookingStatus(id: string, status: Booking['status']) {
    const d = await readDatabase();
    const idx = d.bookings.findIndex(b => b.id === id);
    if (idx !== -1) {
      d.bookings[idx].status = status;
      await writeDatabase(d);
      return d.bookings[idx];
    }
    throw new Error(`Booking ${id} not found.`);
  },

  async deleteBooking(id: string) {
    const d = await readDatabase();
    const beforeLength = d.bookings.length;
    d.bookings = d.bookings.filter(b => b.id !== id);
    if (d.bookings.length !== beforeLength) {
      await writeDatabase(d);
      return true;
    }
    return false;
  },

  // LEADS CRUD
  async getLeads() {
    const d = await readDatabase();
    return d.leads.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  async addLead(lead: Omit<Lead, 'id' | 'timestamp' | 'status'>) {
    const d = await readDatabase();
    const newLead: Lead = {
      ...lead,
      id: 'ld-' + Math.random().toString(36).substring(2, 7),
      timestamp: new Date().toISOString(),
      status: 'unread'
    };
    d.leads.push(newLead);
    await writeDatabase(d);
    return newLead;
  },

  async updateLeadStatus(id: string, status: Lead['status']) {
    const d = await readDatabase();
    const idx = d.leads.findIndex(l => l.id === id);
    if (idx !== -1) {
      d.leads[idx].status = status;
      await writeDatabase(d);
      return d.leads[idx];
    }
    throw new Error(`Lead ${id} not found.`);
  },

  async deleteLead(id: string) {
    const d = await readDatabase();
    const beforeLength = d.leads.length;
    d.leads = d.leads.filter(l => l.id !== id);
    if (d.leads.length !== beforeLength) {
      await writeDatabase(d);
      return true;
    }
    return false;
  },

  // SETTINGS CRUD
  async getSettings() {
    const d = await readDatabase();
    return d.settings || defaultSettings;
  },

  async saveSettings(settings: AdminSettings) {
    const d = await readDatabase();
    d.settings = settings;
    await writeDatabase(d);
    return d.settings;
  }
};
