'use client';

import * as React from 'react';
import { Moon, Sun, Monitor, Check } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
  ActionDropdown,
  type ActionDropdownItem,
} from '@/components/common/action-dropdown';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

export function ModeToggle() {
  const t = useTranslations('settings');
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // 避免服务端渲染不一致问题
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const createThemeItem = (
    themeValue: string,
    label: string,
    icon: typeof Sun
  ): ActionDropdownItem => ({
    type: 'item',
    label: (
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          {React.createElement(icon, { className: 'h-4 w-4' })}
          <span>{label}</span>
        </div>
        {theme === themeValue && <Check className="h-4 w-4" />}
      </div>
    ) as React.ReactNode,
    onClick: () => setTheme(themeValue),
    className: cn(
      'flex cursor-pointer items-center justify-between',
      theme === themeValue && 'bg-accent text-accent-foreground'
    ),
  });

  const dropdownItems: ActionDropdownItem[] = [
    createThemeItem('light', t('themeLight'), Sun),
    createThemeItem('dark', t('themeDark'), Moon),
    createThemeItem('system', t('themeSystem'), Monitor),
  ];

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" disabled>
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <ActionDropdown
      trigger={
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">{t('theme')}</span>
        </Button>
      }
      items={dropdownItems}
      contentClassName="min-w-[140px]"
    />
  );
}
