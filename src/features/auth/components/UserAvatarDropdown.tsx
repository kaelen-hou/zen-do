'use client';

import { useAuth } from '@/features/auth';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/components/ui/button';
import {
  ActionDropdown,
  type ActionDropdownItem,
} from '@/shared/components/common/action-dropdown';
import { LogOut, Settings } from 'lucide-react';

export function UserAvatarDropdown() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const t = useTranslations();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  if (!user) return null;

  const dropdownItems: ActionDropdownItem[] = [
    {
      type: 'label',
      label: t('settings.account'),
    },
    {
      type: 'separator',
    },
    {
      type: 'item',
      label: t('navigation.settings'),
      icon: Settings,
      onClick: () => router.push('/settings'),
    },
    {
      type: 'separator',
    },
    {
      type: 'item',
      label: t('navigation.logout'),
      icon: LogOut,
      onClick: handleLogout,
      className: 'text-destructive focus:text-destructive',
    },
  ];

  return (
    <ActionDropdown
      trigger={
        <Button
          variant="ghost"
          className="min-h-[44px] min-w-[44px] touch-manipulation rounded-md p-2 text-white transition-colors hover:bg-white/20 active:bg-white/30"
          type="button"
        >
          <span className="truncate text-sm font-medium">
            {user.displayName || user.email}
          </span>
        </Button>
      }
      items={dropdownItems}
      contentClassName="w-56"
    />
  );
}
