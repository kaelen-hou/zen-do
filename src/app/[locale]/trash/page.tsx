'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, Link } from '@/i18n/routing';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Loader2,
  Trash2,
  RotateCcw,
  AlertTriangle,
  Calendar,
  Flag,
} from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  getDeletedTodos,
  restoreTodo,
  permanentlyDeleteTodo,
} from '@/lib/todos';
import { Todo } from '@/types';
import { cn } from '@/lib/utils';

const priorityConfig = {
  low: {
    label: '低优先级',
    className:
      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  },
  medium: {
    label: '中等优先级',
    className:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  },
  high: {
    label: '高优先级',
    className:
      'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  },
  urgent: {
    label: '紧急',
    className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  },
};

interface TrashTaskCardProps {
  task: Todo;
  onTaskRestored?: () => void;
  onTaskDeleted?: () => void;
}

function TrashTaskCard({
  task,
  onTaskRestored,
  onTaskDeleted,
}: TrashTaskCardProps) {
  const [isRestoring, setIsRestoring] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRestore = async () => {
    try {
      setIsRestoring(true);
      await restoreTodo(task.id);
      onTaskRestored?.();
    } catch (error) {
      console.error('Failed to restore task:', error);
    } finally {
      setIsRestoring(false);
    }
  };

  const handlePermanentDelete = async () => {
    try {
      setIsDeleting(true);
      await permanentlyDeleteTodo(task.id);
      onTaskDeleted?.();
    } catch (error) {
      console.error('Failed to permanently delete task:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className={cn('opacity-75 transition-shadow hover:shadow-md')}>
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
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                onClick={handleRestore}
                disabled={isRestoring}
              >
                {isRestoring ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RotateCcw className="h-4 w-4" />
                )}
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive h-8 w-8 p-0"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="text-destructive h-5 w-5" />
                      永久删除任务
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      您确定要永久删除任务 &ldquo;{task.title}&rdquo; 吗？
                      <br />
                      <strong>此操作无法撤销</strong>，任务将被完全删除。
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>取消</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handlePermanentDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      永久删除
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
        {task.description && (
          <CardDescription className="line-clamp-3">
            {task.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-muted-foreground flex items-center justify-between text-sm">
          {task.dueDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              截止：{format(task.dueDate, 'yyyy-MM-dd')}
            </div>
          )}
          {task.deletedAt && (
            <div className="flex items-center gap-1">
              <Trash2 className="h-3 w-3" />
              删除于：{format(task.deletedAt, 'yyyy-MM-dd HH:mm')}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function TrashPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
    }
  }, [user, authLoading, router]);

  const fetchDeletedTasks = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);
      const deletedTasks = await getDeletedTodos(user.uid);
      setTasks(deletedTasks);
    } catch (error) {
      console.error('Failed to fetch deleted tasks:', error);
      setError('获取回收站任务失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchDeletedTasks();
    }
  }, [user, fetchDeletedTasks]);

  const handleTaskRestored = () => {
    fetchDeletedTasks();
  };

  const handleTaskDeleted = () => {
    fetchDeletedTasks();
  };

  if (authLoading || isLoading) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>加载回收站中...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/tasks">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="flex items-center gap-2 text-3xl font-bold">
                <Trash2 className="h-8 w-8" />
                回收站
              </h1>
              <p className="text-muted-foreground">
                {tasks.length === 0
                  ? '回收站为空'
                  : `${tasks.length} 个已删除的任务`}
              </p>
            </div>
          </div>
        </div>

        {error ? (
          <div className="py-12 text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={fetchDeletedTasks} variant="outline">
              重试
            </Button>
          </div>
        ) : tasks.length === 0 ? (
          <div className="py-12 text-center">
            <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <Trash2 className="text-muted-foreground h-8 w-8" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">回收站为空</h3>
            <p className="text-muted-foreground mb-4">
              删除的任务会出现在这里，您可以选择恢复或永久删除。
            </p>
            <Button variant="outline" asChild>
              <Link href="/tasks">返回任务列表</Link>
            </Button>
          </div>
        ) : (
          <div>
            {/* 操作提示 */}
            <Card className="mb-6 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-600" />
                  <div className="text-sm">
                    <p className="mb-1 font-medium text-amber-800 dark:text-amber-200">
                      回收站操作说明
                    </p>
                    <p className="text-amber-700 dark:text-amber-300">
                      点击 <RotateCcw className="mx-1 inline h-4 w-4" />{' '}
                      恢复任务到原位置， 点击{' '}
                      <Trash2 className="mx-1 inline h-4 w-4" />{' '}
                      永久删除任务（不可恢复）。
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 任务列表 */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tasks.map(task => (
                <TrashTaskCard
                  key={task.id}
                  task={task}
                  onTaskRestored={handleTaskRestored}
                  onTaskDeleted={handleTaskDeleted}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
