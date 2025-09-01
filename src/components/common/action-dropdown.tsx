'use client';

import * as React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export interface ActionDropdownItem {
  type: 'item' | 'separator' | 'label';
  label?: React.ReactNode;
  icon?: LucideIcon;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export interface ActionDropdownProps {
  trigger: React.ReactNode;
  items: ActionDropdownItem[];
  align?: 'start' | 'center' | 'end';
  contentClassName?: string;
  disabled?: boolean;
}

export function ActionDropdown({
  trigger,
  items,
  align = 'end',
  contentClassName,
  disabled = false,
}: ActionDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        className={cn('min-w-[160px]', contentClassName)}
      >
        {items.map((item, index) => {
          const key = `dropdown-item-${index}`;

          if (item.type === 'separator') {
            return <DropdownMenuSeparator key={key} />;
          }

          if (item.type === 'label') {
            return (
              <DropdownMenuLabel key={key} className={item.className}>
                {item.label}
              </DropdownMenuLabel>
            );
          }

          const Icon = item.icon;

          return (
            <DropdownMenuItem
              key={key}
              onClick={item.onClick}
              className={cn(
                Icon && !React.isValidElement(item.label)
                  ? 'flex items-center'
                  : '',
                item.className
              )}
              disabled={item.disabled}
            >
              {Icon && !React.isValidElement(item.label) && (
                <Icon className="mr-2 h-4 w-4" />
              )}
              {item.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// 预设的触发器组件
export interface IconTriggerProps {
  icon: LucideIcon;
  loading?: boolean;
  loadingIcon?: LucideIcon;
  variant?: 'ghost' | 'outline' | 'default' | 'destructive' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  disabled?: boolean;
}

export function IconTrigger({
  icon: Icon,
  loading = false,
  loadingIcon: LoadingIcon,
  variant = 'ghost',
  size = 'sm',
  className,
  disabled = false,
}: IconTriggerProps) {
  const displayIcon = loading && LoadingIcon ? LoadingIcon : Icon;
  const DisplayIcon = displayIcon;

  return (
    <Button
      variant={variant}
      size={size}
      className={cn('h-8 w-8 p-0', className)}
      disabled={disabled || loading}
    >
      <DisplayIcon className={cn('h-4 w-4', loading && 'animate-spin')} />
    </Button>
  );
}
