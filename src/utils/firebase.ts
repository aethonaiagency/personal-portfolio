import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore, doc, setDoc } from 'firebase/firestore';
import { firebaseConfig } from '../firebase-config';

// Initialize a clean, browser-compatible Firebase instances specifically for direct clientside actions
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const clientDb = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, firebaseConfig.firestoreDatabaseId);

export async function saveBookingDirect(booking: {
  name: string;
  email: string;
  focus: string;
  date: string;
  time: string;
}) {
  const docId = 'bk-' + Math.random().toString(36).substring(2, 7);
  const data = {
    ...booking,
    id: docId,
    createdAt: new Date().toISOString(),
    status: 'New'
  };
  await setDoc(doc(clientDb, 'bookings', docId), data);
  return data;
}

export async function saveLeadDirect(lead: {
  name: string;
  email: string;
  businessName: string;
  budget: string;
  message: string;
}) {
  const docId = 'ld-' + Math.random().toString(36).substring(2, 9);
  const data = {
    ...lead,
    id: docId,
    timestamp: new Date().toISOString(),
    status: 'unread'
  };
  await setDoc(doc(clientDb, 'leads', docId), data);
  return data;
}
