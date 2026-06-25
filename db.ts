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
  profile: {
    fullName: string;
    roleTitle: string;
    bioIntroduction: string;
    bioLong: string;
    whatsappPhone: string;
    contactEmail: string;
    githubLink: string;
    linkedinLink: string;
    totalProjectsCount: number;
    handcraftedBuiltPercent: number;
    lighthouseTarget: string;
    designStandardName: string;
  };
}

export interface DatabaseSchema {
  bookings: Booking[];
  leads: Lead[];
  settings: AdminSettings;
}

import { initializeApp } from 'firebase/app';
import { 
  initializeFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  limit
} from 'firebase/firestore';
import firebaseConfig from './src/firebase-config';

const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, firebaseConfig.firestoreDatabaseId);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null,
      isAnonymous: null
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

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

export async function initDatabase(): Promise<void> {
  try {
    const settingsDocRef = doc(db, 'settings', 'global');
    const settingsDoc = await getDoc(settingsDocRef);
    if (!settingsDoc.exists()) {
      await setDoc(settingsDocRef, defaultSettings);
      console.log('Seeded settings in Cloud Firestore successfully.');
    } else {
      const data = settingsDoc.data() as AdminSettings;
      if (data.profile?.whatsappPhone !== defaultSettings.profile.whatsappPhone) {
        await setDoc(settingsDocRef, {
          ...data,
          profile: {
            ...data.profile,
            whatsappPhone: defaultSettings.profile.whatsappPhone
          }
        });
        console.log('Successfully updated whatsappPhone to ' + defaultSettings.profile.whatsappPhone + ' in existing global settings doc.');
      }
    }
    
    const bookingsQuery = query(collection(db, 'bookings'), limit(1));
    const bookingsSnap = await getDocs(bookingsQuery);
    if (bookingsSnap.empty) {
      for (const booking of defaultBookings) {
        await setDoc(doc(db, 'bookings', booking.id), booking);
      }
      console.log('Seeded bookings in Cloud Firestore successfully.');
    }

    const leadsQuery = query(collection(db, 'leads'), limit(1));
    const leadsSnap = await getDocs(leadsQuery);
    if (leadsSnap.empty) {
      for (const lead of defaultLeads) {
        await setDoc(doc(db, 'leads', lead.id), lead);
      }
      console.log('Seeded leads in Cloud Firestore successfully.');
    }
  } catch (err) {
    console.error('Failed to initialize Cloud Firestore database connection:', err);
  }
}

// Helper function to race database requests with a timeout
function withTimeout<T>(promise: Promise<T>, timeoutMs: number, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => {
      console.warn(`[Firestore Timeout] Operation exceeded ${timeoutMs}ms. Returning fallback data.`);
      resolve(fallback);
    }, timeoutMs))
  ]);
}

// Higher-order helper operations for streamlined CRUD
export const dbService = {
  // BOOKINGS CRUD
  async getBookings() {
    const colPath = 'bookings';
    try {
      const fetchPromise = (async () => {
        const querySnapshot = await getDocs(collection(db, colPath));
        const bookings: Booking[] = [];
        querySnapshot.forEach(docSnap => {
          bookings.push({ id: docSnap.id, ...docSnap.data() } as Booking);
        });
        return bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      })();
      return await withTimeout(fetchPromise, 1500, defaultBookings);
    } catch (error) {
      console.warn('[Firestore Error] Failed to fetch bookings, using defaultBookings:', error);
      return defaultBookings;
    }
  },

  async addBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'status'>) {
    const docId = 'bk-' + Math.random().toString(36).substring(2, 7);
    const newBooking: Booking = {
      ...booking,
      id: docId,
      createdAt: new Date().toISOString(),
      status: 'New'
    };
    try {
      await setDoc(doc(db, 'bookings', docId), newBooking);
      return newBooking;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `bookings/${docId}`);
    }
  },

  async updateBookingStatus(id: string, status: Booking['status']) {
    try {
      const docRef = doc(db, 'bookings', id);
      await updateDoc(docRef, { status });
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Booking;
      }
      throw new Error(`Booking ${id} not found.`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `bookings/${id}`);
    }
  },

  async deleteBooking(id: string) {
    try {
      await deleteDoc(doc(db, 'bookings', id));
      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `bookings/${id}`);
    }
  },

  // LEADS CRUD
  async getLeads() {
    const colPath = 'leads';
    try {
      const fetchPromise = (async () => {
        const querySnapshot = await getDocs(collection(db, colPath));
        const leads: Lead[] = [];
        querySnapshot.forEach(docSnap => {
          leads.push({ id: docSnap.id, ...docSnap.data() } as Lead);
        });
        return leads.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      })();
      return await withTimeout(fetchPromise, 1500, defaultLeads);
    } catch (error) {
      console.warn('[Firestore Error] Failed to fetch leads, using defaultLeads:', error);
      return defaultLeads;
    }
  },

  async addLead(lead: Omit<Lead, 'id' | 'timestamp' | 'status'>) {
    const docId = 'ld-' + Math.random().toString(36).substring(2, 7);
    const newLead: Lead = {
      ...lead,
      id: docId,
      timestamp: new Date().toISOString(),
      status: 'unread'
    };
    try {
      await setDoc(doc(db, 'leads', docId), newLead);
      return newLead;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `leads/${docId}`);
    }
  },

  async updateLeadStatus(id: string, status: Lead['status']) {
    try {
      const docRef = doc(db, 'leads', id);
      await updateDoc(docRef, { status });
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Lead;
      }
      throw new Error(`Lead ${id} not found.`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `leads/${id}`);
    }
  },

  async deleteLead(id: string) {
    try {
      await deleteDoc(doc(db, 'leads', id));
      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `leads/${id}`);
    }
  },

  // SETTINGS CRUD
  async getSettings(): Promise<AdminSettings> {
    try {
      const fetchPromise = (async () => {
        const docSnap = await getDoc(doc(db, 'settings', 'global'));
        if (docSnap.exists()) {
          return docSnap.data() as AdminSettings;
        }
        return defaultSettings;
      })();
      return await withTimeout(fetchPromise, 1500, defaultSettings);
    } catch (error) {
      console.warn('[Firestore Error] Failed to fetch settings, using defaultSettings:', error);
      return defaultSettings;
    }
  },

  async saveSettings(settings: AdminSettings) {
    try {
      await setDoc(doc(db, 'settings', 'global'), settings);
      return settings;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'settings/global');
    }
  }
};
