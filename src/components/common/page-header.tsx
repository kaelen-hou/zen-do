'use client';

import * as React from 'react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface PageHeaderAction {
  label: string;
  icon?: LucideIcon;
  onClick?: () => void;
  href?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  disabled?: boolean;
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: PageHeaderAction[];
  children?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'card' | 'minimal';
}

export function PageHeader({
  title,
  description,
  icon: Icon,
  actions = [],
  children,
  className,
  variant = 'default',
}: PageHeaderProps) {
  const renderContent = () => (
    <div className={cn('flex items-center justify-between', className)}>
      <div className="flex items-center gap-4">
        {Icon && (
          <div className="bg-primary/10 flex items-center justify-center rounded-lg p-2">
            <Icon className="text-primary h-6 w-6" />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </div>
      {(actions.length > 0 || children) && (
        <div className="flex items-center gap-2">
          {actions.map((action, index) => {
            const ActionIcon = action.icon;
            const key = `action-${index}`;

            const buttonContent = (
              <>
                {ActionIcon && <ActionIcon className="mr-2 h-4 w-4" />}
                {action.label}
              </>
            );

            if (action.href) {
              return (
                <Button
                  key={key}
                  variant={action.variant || 'outline'}
                  size={action.size || 'sm'}
                  className={action.className}
                  disabled={action.disabled}
                  asChild
                >
                  <Link href={action.href}>{buttonContent}</Link>
                </Button>
              );
            }

            return (
              <Button
                key={key}
                variant={action.variant || 'outline'}
                size={action.size || 'sm'}
                className={action.className}
                disabled={action.disabled}
                onClick={action.onClick}
              >
                {buttonContent}
              </Button>
            );
          })}
          {children}
        </div>
      )}
    </div>
  );

  switch (variant) {
    case 'card':
      return (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>{renderContent()}</CardTitle>
          </CardHeader>
        </Card>
      );

    case 'minimal':
      return <div className={cn('py-4', className)}>{renderContent()}</div>;

    default:
      return <div className={cn('mb-6', className)}>{renderContent()}</div>;
  }
}

// 预设的页面 header 变体
export interface BackHeaderProps {
  title: string;
  description?: string;
  onBack?: () => void;
  backLabel?: string;
  actions?: PageHeaderAction[];
  children?: React.ReactNode;
  className?: string;
}

export function BackHeader({
  title,
  description,
  onBack,
  backLabel = '返回',
  actions = [],
  children,
  className,
}: BackHeaderProps) {
  return (
    <PageHeader
      title={title}
      description={description}
      actions={[
        {
          label: backLabel,
          variant: 'ghost',
          onClick: onBack,
        },
        ...actions,
      ]}
      className={className}
    >
      {children}
    </PageHeader>
  );
}
