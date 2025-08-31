'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Welcome to Zen Do</h1>
          <p className="text-lg text-foreground/70">
            Your smart todo app with real-time sync and file attachments
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/signin"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
          >
            Sign In
          </Link>
          
          <Link
            href="/signup"
            className="w-full flex justify-center py-3 px-4 border border-foreground/20 rounded-md shadow-sm text-sm font-medium text-foreground bg-background hover:bg-foreground/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
          >
            Create Account
          </Link>
        </div>

        <div className="mt-8">
          <p className="text-sm text-foreground/60">
            Features:
          </p>
          <ul className="mt-2 text-sm text-foreground/80 space-y-1">
            <li>✓ Real-time synchronization across devices</li>
            <li>✓ File attachments with Firebase Storage</li>
            <li>✓ Priority and status management</li>
            <li>✓ Google and Email authentication</li>
            <li>✓ Collaborative presence indicators</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
