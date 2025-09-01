'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { UserAvatarDropdown } from '@/components/user-avatar-dropdown';
import { DashboardHero } from '@/components/dashboard-hero';
import { ClipboardList, Plus, BarChart3, Trash2, Clock } from 'lucide-react';
import { getTodos } from '@/lib/todos';
import { Todo } from '@/types';

const priorityConfig = {
  low: {
    label: '低',
    className:
      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  },
  medium: {
    label: '中',
    className:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  },
  high: {
    label: '高',
    className:
      'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  },
  urgent: {
    label: '急',
    className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  },
};

const statusConfig = {
  todo: {
    label: '待办',
    className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
  },
  'in-progress': {
    label: '进行中',
    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  },
  done: {
    label: '已完成',
    className:
      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  },
  archived: {
    label: '已归档',
    className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
  },
};

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [recentTasks, setRecentTasks] = useState<Todo[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
    }
  }, [user, loading, router]);

  const fetchRecentTasks = useCallback(async () => {
    if (!user) return;

    try {
      setTasksLoading(true);
      const tasks = await getTodos(user.uid);
      // 获取最近的5条任务
      setRecentTasks(tasks.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch recent tasks:', error);
    } finally {
      setTasksLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchRecentTasks();
    }
  }, [user, fetchRecentTasks]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950">
        <div className="flex min-h-screen items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="h-20 w-20 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 dark:border-gray-600 dark:border-t-blue-400"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <ClipboardList className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                加载工作台
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                正在为您准备最佳体验...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950">
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
                  <h1 className="text-2xl font-bold text-white">
                    ZenDo 工作台
                  </h1>
                  <p className="text-sm text-white/70">高效任务管理平台</p>
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
          {/* Hero 区域 */}
          <div className="mb-8">
            <DashboardHero />
          </div>

          {/* 快捷操作区 */}
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
              快捷操作
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* 我的任务卡片 */}
              <Link href="/tasks" className="group">
                <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
                        <ClipboardList className="h-6 w-6" />
                      </div>
                      <div className="text-right">
                        <div className="text-sm opacity-80">待办事项</div>
                        <div className="text-2xl font-bold">
                          {recentTasks.length}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div>
                      <div className="text-lg font-semibold">我的任务</div>
                      <div className="text-sm opacity-80">管理您的待办事项</div>
                    </div>
                  </CardContent>
                  <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-white/10"></div>
                </Card>
              </Link>

              {/* 添加任务卡片 */}
              <Link href="/add-task" className="group">
                <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-green-500 to-green-600 text-white transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
                        <Plus className="h-6 w-6" />
                      </div>
                      <div className="text-right">
                        <div className="text-sm opacity-80">创建</div>
                        <div className="text-2xl font-bold">+</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div>
                      <div className="text-lg font-semibold">添加任务</div>
                      <div className="text-sm opacity-80">创建新的待办事项</div>
                    </div>
                  </CardContent>
                  <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-white/10"></div>
                </Card>
              </Link>

              {/* 数据分析卡片 */}
              <Link href="/statistics" className="group">
                <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
                        <BarChart3 className="h-6 w-6" />
                      </div>
                      <div className="text-right">
                        <div className="text-sm opacity-80">统计</div>
                        <div className="text-2xl font-bold">📊</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div>
                      <div className="text-lg font-semibold">数据分析</div>
                      <div className="text-sm opacity-80">追踪您的工作效率</div>
                    </div>
                  </CardContent>
                  <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-white/10"></div>
                </Card>
              </Link>

              {/* 回收站卡片 */}
              <Link href="/trash" className="group">
                <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-gray-500 to-gray-600 text-white transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
                        <Trash2 className="h-6 w-6" />
                      </div>
                      <div className="text-right">
                        <div className="text-sm opacity-80">回收</div>
                        <div className="text-2xl font-bold">🗑️</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div>
                      <div className="text-lg font-semibold">回收站</div>
                      <div className="text-sm opacity-80">恢复或删除任务</div>
                    </div>
                  </CardContent>
                  <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-white/10"></div>
                </Card>
              </Link>
            </div>
          </div>

          {/* 最近任务部分 */}
          <div className="mt-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  最近任务
                </h2>
                <p className="text-muted-foreground">您最近创建的任务概览</p>
              </div>
              <Button variant="outline" asChild className="group">
                <Link href="/tasks" className="flex items-center gap-2">
                  查看全部
                  <Clock className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
            <div className="space-y-6">
              {tasksLoading ? (
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
              ) : recentTasks.length === 0 ? (
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
                <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
                  {recentTasks.map((task, index) => {
                    const colors = [
                      'from-blue-500 to-blue-600',
                      'from-purple-500 to-purple-600',
                      'from-green-500 to-green-600',
                      'from-orange-500 to-orange-600',
                      'from-pink-500 to-pink-600',
                    ];
                    const colorClass = colors[index % colors.length];

                    return (
                      <Link
                        href={`/edit-task/${task.id}`}
                        key={task.id}
                        className="group"
                      >
                        <div
                          className={`relative overflow-hidden rounded-2xl border-0 bg-gradient-to-br ${colorClass} p-6 text-white transition-all duration-300 hover:scale-105 hover:shadow-xl`}
                        >
                          <div className="relative z-10">
                            <div className="mb-4 flex items-start justify-between">
                              <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
                                <div className="flex items-center gap-2">
                                  <div className="h-2 w-2 rounded-full bg-white"></div>
                                  <Badge
                                    variant="secondary"
                                    className="border-0 bg-white/30 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm"
                                  >
                                    {statusConfig[task.status].label}
                                  </Badge>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xs opacity-80">优先级</div>
                                <div className="text-lg font-bold">
                                  {priorityConfig[task.priority].label}
                                </div>
                              </div>
                            </div>

                            <div className="mb-4">
                              <h3 className="mb-2 line-clamp-2 text-lg font-bold">
                                {task.title}
                              </h3>
                              {task.description && (
                                <p className="line-clamp-2 text-sm opacity-90">
                                  {task.description}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-1 opacity-80">
                                <Clock className="h-3 w-3" />
                                <span>
                                  {format(task.createdAt, 'yyyy-MM-dd')}
                                </span>
                              </div>
                              {task.dueDate && (
                                <div className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-1 text-xs backdrop-blur-sm">
                                  <span>⏰</span>
                                  <span>
                                    {format(task.dueDate, 'yyyy-MM-dd')}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* 装饰性元素 */}
                          <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-white/10"></div>
                          <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-white/5"></div>

                          {/* 编辑提示 */}
                          <div className="absolute right-4 bottom-4 rounded-full bg-white/20 p-2 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                            <span className="text-xs">点击编辑 →</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
