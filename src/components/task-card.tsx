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
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ActionDropdown,
  IconTrigger,
  type ActionDropdownItem,
} from '@/components/common/action-dropdown';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Todo } from '@/types';
import { deleteTodo } from '@/lib/todos';
import { cn } from '@/lib/utils';
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
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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
      setIsDeleting(true);
      await deleteTodo(task.id);
      onTaskUpdated?.();
    } catch (error) {
      console.error('Failed to delete task:', error);
      // TODO: Show error toast
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
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
          <CardTitle className="line-clamp-2">{task.title}</CardTitle>
          <div className="flex flex-shrink-0 items-center gap-2">
            <Badge
              variant="secondary"
              className={priorityConfig[task.priority].className}
            >
              <Flag className="mr-1 h-3 w-3" />
              {priorityConfig[task.priority].label}
            </Badge>
            <ActionDropdown
              trigger={
                <IconTrigger
                  icon={MoreHorizontal}
                  loading={isDeleting}
                  loadingIcon={Loader2}
                  disabled={isDeleting}
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
        <div className="flex items-center justify-between">
          <Badge className={statusConfig[task.status].className}>
            {statusConfig[task.status].label}
          </Badge>

          <div className="text-muted-foreground flex items-center gap-4 text-sm">
            {task.dueDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {format(task.dueDate, 'yyyy-MM-dd')}
              </div>
            )}
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {format(task.createdAt, 'yyyy-MM-dd')}
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
