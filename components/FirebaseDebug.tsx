'use client';

import { useEffect } from 'react';

export default function FirebaseDebug() {
  useEffect(() => {
    console.log('Firebase Environment Variables:');
    console.log('API Key:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
    console.log('Auth Domain:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
    console.log('Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
    console.log('Storage Bucket:', process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
    console.log('Messaging Sender ID:', process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID);
    console.log('App ID:', process.env.NEXT_PUBLIC_FIREBASE_APP_ID);
    console.log('Database URL:', process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL);
  }, []);

  return null;
}