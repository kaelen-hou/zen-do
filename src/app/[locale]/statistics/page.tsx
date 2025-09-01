'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, Link } from '@/i18n/routing';
import {
  ArrowLeft,
  Loader2,
  TrendingUp,
  Clock,
  Flag,
  CheckCircle,
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
import { getTodos } from '@/lib/todos';
import { Todo } from '@/types';

interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  todo: number;
  archived: number;
  overdue: number;
  completionRate: number;
  priorityStats: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
  recentActivity: {
    createdThisWeek: number;
    completedThisWeek: number;
  };
}

export default function StatisticsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<TaskStats | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
      return;
    }
  }, [user, authLoading, router]);

  const calculateStats = useCallback((tasks: Todo[]): TaskStats => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'done').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const todo = tasks.filter(t => t.status === 'todo').length;
    const archived = tasks.filter(t => t.status === 'archived').length;

    const overdue = tasks.filter(
      t =>
        t.dueDate &&
        t.status !== 'done' &&
        t.status !== 'archived' &&
        new Date(t.dueDate) < now
    ).length;

    const completionRate =
      total > 0 ? Math.round((completed / total) * 100) : 0;

    const priorityStats = {
      low: tasks.filter(t => t.priority === 'low').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      high: tasks.filter(t => t.priority === 'high').length,
      urgent: tasks.filter(t => t.priority === 'urgent').length,
    };

    const createdThisWeek = tasks.filter(
      t => new Date(t.createdAt) >= oneWeekAgo
    ).length;

    const completedThisWeek = tasks.filter(
      t => t.status === 'done' && new Date(t.updatedAt) >= oneWeekAgo
    ).length;

    return {
      total,
      completed,
      inProgress,
      todo,
      archived,
      overdue,
      completionRate,
      priorityStats,
      recentActivity: {
        createdThisWeek,
        completedThisWeek,
      },
    };
  }, []);

  const fetchStats = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const tasks = await getTodos(user.uid);
      const calculatedStats = calculateStats(tasks);
      setStats(calculatedStats);
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
      setError('获取统计数据失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, [user, calculateStats]);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user, fetchStats]);

  if (authLoading || loading) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>加载统计数据中...</span>
        </div>
      </div>
    );
  }

  if (!user || !stats) {
    return null;
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">数据统计</h1>
            <p className="text-muted-foreground">
              查看您的任务完成情况和工作效率
            </p>
          </div>
        </div>

        {error ? (
          <div className="py-12 text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={fetchStats} variant="outline">
              重试
            </Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {/* 概览统计 */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    总任务数
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <p className="text-muted-foreground text-xs">
                    所有任务的总数量
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">已完成</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.completed}</div>
                  <p className="text-muted-foreground text-xs">
                    完成率 {stats.completionRate}%
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">进行中</CardTitle>
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.inProgress}</div>
                  <p className="text-muted-foreground text-xs">
                    正在处理的任务
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">已逾期</CardTitle>
                  <Clock className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.overdue}</div>
                  <p className="text-muted-foreground text-xs">超过截止日期</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* 任务状态分布 */}
              <Card>
                <CardHeader>
                  <CardTitle>任务状态分布</CardTitle>
                  <CardDescription>按状态分类的任务数量统计</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-gray-500"></div>
                      <span className="text-sm">待办</span>
                    </div>
                    <span className="font-medium">{stats.todo}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                      <span className="text-sm">进行中</span>
                    </div>
                    <span className="font-medium">{stats.inProgress}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <span className="text-sm">已完成</span>
                    </div>
                    <span className="font-medium">{stats.completed}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-gray-400"></div>
                      <span className="text-sm">已归档</span>
                    </div>
                    <span className="font-medium">{stats.archived}</span>
                  </div>
                </CardContent>
              </Card>

              {/* 优先级分布 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Flag className="h-5 w-5" />
                    优先级分布
                  </CardTitle>
                  <CardDescription>按优先级分类的任务数量统计</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <span className="text-sm">低优先级</span>
                    </div>
                    <span className="font-medium">
                      {stats.priorityStats.low}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                      <span className="text-sm">中等优先级</span>
                    </div>
                    <span className="font-medium">
                      {stats.priorityStats.medium}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                      <span className="text-sm">高优先级</span>
                    </div>
                    <span className="font-medium">
                      {stats.priorityStats.high}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <span className="text-sm">紧急</span>
                    </div>
                    <span className="font-medium">
                      {stats.priorityStats.urgent}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* 近期活动 */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>近期活动（7天内）</CardTitle>
                  <CardDescription>
                    过去一周的任务创建和完成情况
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <p className="text-muted-foreground text-sm">
                          本周创建
                        </p>
                        <p className="text-2xl font-bold">
                          {stats.recentActivity.createdThisWeek}
                        </p>
                      </div>
                      <div className="text-blue-600">
                        <TrendingUp className="h-8 w-8" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <p className="text-muted-foreground text-sm">
                          本周完成
                        </p>
                        <p className="text-2xl font-bold">
                          {stats.recentActivity.completedThisWeek}
                        </p>
                      </div>
                      <div className="text-green-600">
                        <CheckCircle className="h-8 w-8" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
