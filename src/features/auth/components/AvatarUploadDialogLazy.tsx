'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import React from 'react';

const LazyAvatarUploadDialog = dynamic(
  () =>
    import('./AvatarUploadDialog').then(mod => ({
      default: mod.AvatarUploadDialog,
    })),
  {
    loading: () => (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    ),
    ssr: false,
  }
);

interface AvatarUploadDialogProps {
  children: React.ReactNode;
  className?: string;
}

export function AvatarUploadDialog(props: AvatarUploadDialogProps) {
  return <LazyAvatarUploadDialog {...props} />;
}
