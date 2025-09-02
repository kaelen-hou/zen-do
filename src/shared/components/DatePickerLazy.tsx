'use client';

import dynamic from 'next/dynamic';
import { Calendar } from 'lucide-react';

interface DatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
}

const DatePicker = dynamic(
  () => import('./DatePicker').then(mod => ({ default: mod.DatePicker })),
  {
    loading: () => (
      <div className="border-input bg-background ring-offset-background placeholder:text-muted-foreground flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm">
        <span className="text-muted-foreground">Loading calendar...</span>
        <Calendar className="h-4 w-4 opacity-50" />
      </div>
    ),
    ssr: false,
  }
) as React.ComponentType<DatePickerProps>;

export default DatePicker;
