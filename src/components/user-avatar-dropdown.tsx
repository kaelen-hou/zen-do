'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  ActionDropdown,
  type ActionDropdownItem,
} from '@/components/common/action-dropdown';
import { LogOut, Settings } from 'lucide-react';

export function UserAvatarDropdown() {
  const { user, logout } = useAuth();
  const router = useRouter();

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
      label: '我的账户',
    },
    {
      type: 'separator',
    },
    {
      type: 'item',
      label: '个人设置',
      icon: Settings,
      onClick: () => router.push('/settings'),
    },
    {
      type: 'separator',
    },
    {
      type: 'item',
      label: '退出登录',
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
          className="rounded-md p-2 text-white transition-colors hover:bg-white/20"
        >
          <span className="text-sm font-medium">
            {user.displayName || user.email}
          </span>
        </Button>
      }
      items={dropdownItems}
      contentClassName="w-56"
    />
  );
}
