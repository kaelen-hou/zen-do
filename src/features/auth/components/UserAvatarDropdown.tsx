'use client';

import { useAuth } from '@/features/auth';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import * as React from 'react';
import { LogOut, Settings } from 'lucide-react';
import {
  ActionDropdown,
  type ActionDropdownItem,
} from '@/shared/components/common/action-dropdown';
import { Button } from '@/shared/components/ui/button';

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

  const handleSettings = () => {
    router.push('/settings');
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
      onClick: handleSettings,
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

  // 创建带 forwardRef 的触发器组件
  const UserTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ComponentProps<typeof Button>
  >((props, ref) => (
    <Button
      ref={ref}
      variant="ghost"
      className="min-h-[44px] min-w-[44px] touch-manipulation rounded-md p-2 text-white transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 active:bg-white/30"
      style={{
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
      }}
      {...props}
    >
      <span
        className="truncate text-sm font-medium"
        style={{ pointerEvents: 'none' }}
      >
        {user.displayName || user.email}
      </span>
    </Button>
  ));

  UserTrigger.displayName = 'UserTrigger';

  return <ActionDropdown trigger={<UserTrigger />} items={dropdownItems} />;
}
