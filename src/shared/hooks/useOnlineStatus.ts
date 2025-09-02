'use client';

import { useState, useEffect } from 'react';
import { offlineQueue } from '@/shared/lib/offline-queue';

export interface OnlineStatus {
  isOnline: boolean;
  isOffline: boolean;
  queueLength: number;
}

export function useOnlineStatus(): OnlineStatus {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [queueLength, setQueueLength] = useState(0);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      console.log('Back online!');
    };

    const handleOffline = () => {
      setIsOnline(false);
      console.log('Gone offline!');
    };

    // Update queue length periodically
    const updateQueueLength = () => {
      setQueueLength(offlineQueue.getQueueLength());
    };

    // Set up event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Update queue length initially and every 5 seconds
    updateQueueLength();
    const intervalId = setInterval(updateQueueLength, 5000);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(intervalId);
    };
  }, []);

  return {
    isOnline,
    isOffline: !isOnline,
    queueLength,
  };
}
