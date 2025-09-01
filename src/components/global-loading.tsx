'use client';

import React from 'react';
import { useGlobalLoading } from '@/stores/useGlobalLoading';
import { Loader2 } from 'lucide-react';

export function GlobalLoading() {
  const { isLoading, message } = useGlobalLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-background rounded-lg p-6 shadow-lg">
        <div className="flex items-center space-x-4">
          <Loader2 className="text-primary h-6 w-6 animate-spin" />
          <div className="text-sm font-medium">{message || '加载中...'}</div>
        </div>
      </div>
    </div>
  );
}
