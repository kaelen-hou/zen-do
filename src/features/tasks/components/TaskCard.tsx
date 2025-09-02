'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import {
  Calendar,
  Clock,
  Flag,
  Edit3,
  Trash2,
  Loader2,
  MoreHorizontal,
} from 'lucide-react';
import { useRouter } from '@/i18n/routing';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import {
  ActionDropdown,
  IconTrigger,
  type ActionDropdownItem,
} from '@/shared/components/common/action-dropdown';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';
import { Todo } from '@/shared/types';
import { useDeleteTodo } from '@/features/tasks';
import { cn } from '@/shared/utils/lib/utils';
import { useTranslations } from 'next-intl';

interface TaskCardProps {
  task: Todo;
  className?: string;
  onTaskUpdated?: () => void;
}

// Priority and status configurations will be created inside component to use translations

export function TaskCard({ task, className, onTaskUpdated }: TaskCardProps) {
  const t = useTranslations();
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deleteMutation = useDeleteTodo();

  const priorityConfig = {
    low: {
      label: t('priorities.low'),
      className:
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    },
    medium: {
      label: t('priorities.medium'),
      className:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    },
    high: {
      label: t('priorities.high'),
      className:
        'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    },
    urgent: {
      label: t('priorities.urgent'),
      className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    },
  };

  const statusConfig = {
    todo: {
      label: t('statuses.todo'),
      className:
        'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    },
    'in-progress': {
      label: t('statuses.inProgress'),
      className:
        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    },
    done: {
      label: t('statuses.done'),
      className:
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    },
    archived: {
      label: t('statuses.archived'),
      className:
        'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    },
  };

  const handleEdit = () => {
    router.push(`/edit-task/${task.id}`);
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(task.id);
      onTaskUpdated?.();
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Failed to delete task:', error);
      // 错误处理已在 mutation 中处理，显示 toast
    }
  };

  const dropdownItems: ActionDropdownItem[] = [
    {
      type: 'item',
      label: t('editTask.title'),
      icon: Edit3,
      onClick: handleEdit,
    },
    {
      type: 'separator',
    },
    {
      type: 'item',
      label: t('editTask.deleteTask'),
      icon: Trash2,
      onClick: () => setShowDeleteDialog(true),
      className: 'text-destructive focus:text-destructive',
    },
  ];

  return (
    <Card className={cn('transition-shadow hover:shadow-md', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-2 flex-1">{task.title}</CardTitle>
          <div className="flex flex-shrink-0 items-center gap-1 sm:gap-2">
            <Badge
              variant="secondary"
              className={`${priorityConfig[task.priority].className} text-xs`}
            >
              <Flag className="mr-1 h-2 w-2 sm:h-3 sm:w-3" />
              <span className="hidden sm:inline">
                {priorityConfig[task.priority].label}
              </span>
              <span className="sr-only">
                {priorityConfig[task.priority].label}
              </span>
            </Badge>
            <ActionDropdown
              trigger={
                <IconTrigger
                  icon={MoreHorizontal}
                  loading={deleteMutation.isPending}
                  loadingIcon={Loader2}
                  disabled={deleteMutation.isPending}
                />
              }
              items={dropdownItems}
            />
          </div>
        </div>
        {task.description && (
          <CardDescription className="line-clamp-3">
            {task.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Badge
            className={`${statusConfig[task.status].className} text-xs sm:text-sm`}
          >
            {statusConfig[task.status].label}
          </Badge>

          <div className="text-muted-foreground flex flex-col gap-1 text-xs sm:flex-row sm:items-center sm:gap-4 sm:text-sm">
            {task.dueDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span className="truncate">
                  {format(task.dueDate, 'yyyy-MM-dd')}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span className="truncate">
                {format(task.createdAt, 'yyyy-MM-dd')}
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('editTask.deleteTask')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('editTask.confirmDelete')} &ldquo;{task.title}&rdquo;?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
