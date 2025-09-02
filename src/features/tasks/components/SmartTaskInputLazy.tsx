'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const SmartTaskInput = dynamic(() => import('./SmartTaskInput').then(mod => ({ default: mod.SmartTaskInput })), {
  loading: () => (
    <div className="flex items-center justify-center p-8">
      <div className="flex items-center gap-2">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>Loading smart input...</span>
      </div>
    </div>
  ),
  ssr: false,
});

export { SmartTaskInput };