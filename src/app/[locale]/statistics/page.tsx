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

import { useAuth } from '@/features/auth';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { getTodos } from '@/features/tasks';
import { Todo } from '@/shared/types';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations();
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
      setError(t('common.loading'));
    } finally {
      setLoading(false);
    }
  }, [user, calculateStats, t]);

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
          <span>{t('common.loading')}...</span>
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
            <h1 className="text-3xl font-bold">{t('statistics.title')}</h1>
            <p className="text-muted-foreground">
              {t('statistics.description')}
            </p>
          </div>
        </div>

        {error ? (
          <div className="py-12 text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={fetchStats} variant="outline">
              {t('common.cancel')}
            </Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {/* 概览统计 */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t('statistics.totalTasks')}
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <p className="text-muted-foreground text-xs">
                    {t('statistics.totalTasks')}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t('statistics.completedTasks')}
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.completed}</div>
                  <p className="text-muted-foreground text-xs">
                    {t('statistics.completionRate')} {stats.completionRate}%
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t('statuses.inProgress')}
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.inProgress}</div>
                  <p className="text-muted-foreground text-xs">
                    {t('statuses.inProgress')}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t('statistics.pendingTasks')}
                  </CardTitle>
                  <Clock className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.overdue}</div>
                  <p className="text-muted-foreground text-xs">
                    {t('addTask.dueDate')}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* 任务状态分布 */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('statistics.title')}</CardTitle>
                  <CardDescription>
                    {t('statistics.description')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-gray-500"></div>
                      <span className="text-sm">{t('statuses.todo')}</span>
                    </div>
                    <span className="font-medium">{stats.todo}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                      <span className="text-sm">
                        {t('statuses.inProgress')}
                      </span>
                    </div>
                    <span className="font-medium">{stats.inProgress}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <span className="text-sm">{t('statuses.done')}</span>
                    </div>
                    <span className="font-medium">{stats.completed}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-gray-400"></div>
                      <span className="text-sm">{t('statuses.archived')}</span>
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
                    {t('addTask.priority')}
                  </CardTitle>
                  <CardDescription>
                    {t('statistics.description')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <span className="text-sm">{t('priorities.low')}</span>
                    </div>
                    <span className="font-medium">
                      {stats.priorityStats.low}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                      <span className="text-sm">{t('priorities.medium')}</span>
                    </div>
                    <span className="font-medium">
                      {stats.priorityStats.medium}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                      <span className="text-sm">{t('priorities.high')}</span>
                    </div>
                    <span className="font-medium">
                      {stats.priorityStats.high}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <span className="text-sm">{t('priorities.urgent')}</span>
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
                  <CardTitle>{t('statistics.weeklyProgress')}</CardTitle>
                  <CardDescription>
                    {t('statistics.weeklyProgress')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <p className="text-muted-foreground text-sm">
                          {t('common.create')}
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
                          {t('statuses.done')}
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
