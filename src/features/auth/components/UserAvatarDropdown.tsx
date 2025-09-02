'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/shared/components/ui/dropdown-menu';
import { LogOut, Settings } from 'lucide-react';

export function UserAvatarDropdown() {
  const [isMobile, setIsMobile] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const t = useTranslations();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="min-h-[44px] min-w-[44px] touch-manipulation rounded-md p-2 text-white transition-colors hover:bg-white/20 active:bg-white/30"
          type="button"
          style={{
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'manipulation',
          }}
          onTouchStart={e => {
            if (isMobile) {
              e.currentTarget.style.backgroundColor =
                'rgba(255, 255, 255, 0.3)';
            }
          }}
          onTouchEnd={e => {
            if (isMobile) {
              setTimeout(() => {
                e.currentTarget.style.backgroundColor = '';
              }, 150);
            }
          }}
        >
          <span className="truncate text-sm font-medium">
            {user.displayName || user.email}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="bottom"
        sideOffset={5}
        className="z-50 w-56"
        onCloseAutoFocus={e => e.preventDefault()}
      >
        <DropdownMenuLabel>{t('settings.account')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex cursor-pointer items-center"
          onSelect={handleSettings}
        >
          <Settings className="mr-2 h-4 w-4" />
          {t('navigation.settings')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive flex cursor-pointer items-center"
          onSelect={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {t('navigation.logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
