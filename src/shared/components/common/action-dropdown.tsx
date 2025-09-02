'use client';

import * as React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/shared/components/ui/dropdown-menu';
import { cn } from '@/shared/utils/lib/utils';

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
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild disabled={disabled}>
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        side="bottom"
        sideOffset={5}
        className={cn('min-w-[160px] z-50', contentClassName)}
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
              className={cn(
                'cursor-pointer',
                Icon && !React.isValidElement(item.label)
                  ? 'flex items-center'
                  : '',
                item.className
              )}
              disabled={item.disabled}
              onSelect={() => {
                if (item.onClick) {
                  item.onClick();
                }
              }}
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

export const IconTrigger = React.forwardRef<
  HTMLButtonElement,
  IconTriggerProps
>(({
  icon: Icon,
  loading = false,
  loadingIcon: LoadingIcon,
  variant = 'ghost',
  size = 'sm',
  className,
  disabled = false,
  ...props
}, ref) => {
  const displayIcon = loading && LoadingIcon ? LoadingIcon : Icon;
  const DisplayIcon = displayIcon;

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        'h-8 min-h-[44px] w-8 min-w-[44px] touch-manipulation p-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className
      )}
      disabled={disabled || loading}
      type="button"
      aria-label="More options"
      {...props}
    >
      <DisplayIcon className={cn('h-4 w-4', loading && 'animate-spin')} />
      <span className="sr-only">More options</span>
    </Button>
  );
});

IconTrigger.displayName = 'IconTrigger';
