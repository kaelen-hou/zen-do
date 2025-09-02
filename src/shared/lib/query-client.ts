'use client';

import { QueryClient } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

// Create persister for local storage
const persister = createSyncStoragePersister({
  storage: typeof window !== 'undefined' ? window.localStorage : null,
  key: 'zen-do-cache',
});

// Create Query Client with offline-first configurations
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 60 * 24, // 24 hours (previously cacheTime)
      networkMode: 'offlineFirst', // Enable offline-first mode
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: (failureCount, error: Error) => {
        // Don't retry if it's a network error and we're offline
        if (
          (error as { code?: string })?.code === 'NETWORK_ERROR' &&
          !navigator.onLine
        ) {
          return false;
        }
        // Otherwise, retry up to 3 times
        return failureCount < 3;
      },
    },
    mutations: {
      networkMode: 'offlineFirst',
      retry: (failureCount, error: Error) => {
        // Don't retry if it's a network error and we're offline
        if (
          (error as { code?: string })?.code === 'NETWORK_ERROR' &&
          !navigator.onLine
        ) {
          return false;
        }
        // Otherwise, retry up to 2 times for mutations
        return failureCount < 2;
      },
    },
  },
});

// Persist query client if we're in the browser
if (typeof window !== 'undefined') {
  persistQueryClient({
    queryClient,
    persister,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
}
