import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// Lazy load unused Firebase services to reduce bundle size
// import { getDatabase } from 'firebase/database';
// import { getFunctions } from 'firebase/functions';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

// Validate Firebase config
const hasFirebaseConfig = firebaseConfig.apiKey && firebaseConfig.projectId;

// Initialize Firebase only if config is available
const app =
  hasFirebaseConfig && getApps().length === 0
    ? initializeApp(firebaseConfig)
    : hasFirebaseConfig
      ? getApp()
      : null;

// Initialize core Firebase services
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app) : null;

// Lazy load unused services on demand to reduce initial bundle size
export const getRealtimeDb = async () => {
  if (!app) return null;
  const { getDatabase } = await import('firebase/database');
  return getDatabase(app);
};

export const getFunctions = async () => {
  if (!app) return null;
  const { getFunctions } = await import('firebase/functions');
  return getFunctions(app);
};

// Initialize Analytics (only in browser)
export const getFirebaseAnalytics = async () => {
  if (typeof window !== 'undefined' && app) {
    const analyticsSupported = await isSupported();
    if (analyticsSupported) {
      return getAnalytics(app);
    }
  }
  return null;
};

export default app;
