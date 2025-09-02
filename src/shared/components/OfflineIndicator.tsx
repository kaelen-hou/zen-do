'use client';

import React from 'react';
import { AlertCircle, Wifi, WifiOff, Clock } from 'lucide-react';
import { useOnlineStatus } from '@/shared/hooks';
import { cn } from '@/shared/utils/lib/utils';

interface OfflineIndicatorProps {
  className?: string;
  showQueueCount?: boolean;
}

export function OfflineIndicator({
  className,
  showQueueCount = true,
}: OfflineIndicatorProps) {
  const { isOnline, queueLength } = useOnlineStatus();

  // Don't show anything if online and no queue
  if (isOnline && queueLength === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        isOnline
          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
          : 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300',
        className
      )}
    >
      {isOnline ? (
        <>
          <Wifi className="h-4 w-4" />
          <span>在线</span>
          {queueLength > 0 && showQueueCount && (
            <>
              <Clock className="h-4 w-4" />
              <span>{queueLength} 项待同步</span>
            </>
          )}
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4" />
          <span>离线模式</span>
          {queueLength > 0 && showQueueCount && (
            <>
              <AlertCircle className="h-4 w-4" />
              <span>{queueLength} 项待同步</span>
            </>
          )}
        </>
      )}
    </div>
  );
}
