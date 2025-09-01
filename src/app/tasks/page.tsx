'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Plus,
  Loader2,
  BarChart3,
  Trash2,
  ClipboardList,
  Clock,
} from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { TaskCard } from '@/components/task-card';
import { UserAvatarDropdown } from '@/components/user-avatar-dropdown';
import { getTodos } from '@/lib/todos';
import { Todo } from '@/types';

export default function TasksPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
    }
  }, [user, loading, router]);

  const fetchTasks = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);
      const fetchedTasks = await getTodos(user.uid);
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      setError('Failed to load tasks. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user, fetchTasks]);

  if (loading) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="border-primary h-32 w-32 animate-spin rounded-full border-b-2"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950">
      {/* Header */}
      <nav className="relative overflow-hidden border-b-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 shadow-xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="rounded-xl bg-white/20 p-3 ring-2 ring-white/30 backdrop-blur-sm">
                    <ClipboardList className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-400 ring-2 ring-white/50"></div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">我的任务</h1>
                  <p className="text-sm text-white/70">
                    {tasks.length === 0 ? '暂无任务' : `${tasks.length} 个任务`}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="rounded-lg bg-white/10 p-1 backdrop-blur-sm">
                <UserAvatarDropdown />
              </div>
            </div>
          </div>
        </div>

        {/* 装饰性背景元素 */}
        <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-white/5"></div>
        <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-white/5"></div>
        <div className="absolute top-0 right-1/4 h-16 w-16 rounded-full bg-white/5"></div>
      </nav>

      <main className="mx-auto max-w-6xl py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-2 sm:px-0">
          {/* 快捷操作区 */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  任务列表
                </h2>
                <p className="text-muted-foreground">管理您的所有待办事项</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard">
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    工作台
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/trash">
                    <Trash2 className="mr-1 h-4 w-4" />
                    回收站
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/statistics">
                    <BarChart3 className="mr-1 h-4 w-4" />
                    统计
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/add-task">
                    <Plus className="mr-1 h-4 w-4" />
                    添加任务
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* 任务列表部分 */}
          <div>
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 dark:border-gray-600 dark:border-t-blue-400"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    加载任务中...
                  </p>
                </div>
              </div>
            ) : error ? (
              <div className="relative overflow-hidden rounded-2xl border-0 bg-gradient-to-br from-red-100 to-red-200 p-12 text-center dark:from-red-800 dark:to-red-900">
                <div className="relative z-10">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/20 backdrop-blur-sm">
                    <Loader2 className="h-10 w-10 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-red-900 dark:text-red-100">
                    加载失败
                  </h3>
                  <p className="mb-6 text-red-700 dark:text-red-300">{error}</p>
                  <Button
                    onClick={fetchTasks}
                    variant="outline"
                    className="bg-white/50"
                  >
                    重试
                  </Button>
                </div>
              </div>
            ) : tasks.length === 0 ? (
              <div className="relative overflow-hidden rounded-2xl border-0 bg-gradient-to-br from-gray-100 to-gray-200 p-12 text-center dark:from-gray-800 dark:to-gray-900">
                <div className="relative z-10">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/50 backdrop-blur-sm dark:bg-gray-700/50">
                    <Plus className="h-10 w-10 text-gray-500 dark:text-gray-400" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">
                    还没有任务
                  </h3>
                  <p className="mb-6 text-gray-600 dark:text-gray-400">
                    创建您的第一个任务开始高效工作
                  </p>
                  <Link href="/add-task" className="group inline-block">
                    <div className="relative overflow-hidden rounded-xl border-0 bg-gradient-to-r from-green-500 to-green-600 px-6 py-3 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg">
                      <span className="relative z-10 flex items-center gap-2 font-semibold">
                        <Plus className="h-5 w-5" />
                        创建第一个任务
                      </span>
                      <div className="absolute -top-4 -right-4 h-12 w-12 rounded-full bg-white/20"></div>
                    </div>
                  </Link>
                </div>
                <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/10"></div>
                <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-white/5"></div>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {tasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onTaskUpdated={fetchTasks}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
