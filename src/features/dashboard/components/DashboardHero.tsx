'use client';

import { useEffect, useState, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Calendar, Clock, Sparkles, RefreshCw } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';

interface HistoryEvent {
  year: string;
  title: string;
  description: string;
}

interface TodayInHistoryResponse {
  success: boolean;
  date: string;
  events: HistoryEvent[];
  cached?: boolean;
  error?: string;
}

export function DashboardHero() {
  const t = useTranslations();
  const locale = useLocale();
  const [historyData, setHistoryData] = useState<TodayInHistoryResponse | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTodayInHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/today-in-history', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: TodayInHistoryResponse = await response.json();
      setHistoryData(data);

      if (!data.success && data.error) {
        setError(data.error);
      }
    } catch (err) {
      console.error('Failed to fetch today in history:', err);
      setError(err instanceof Error ? err.message : t('common.loading'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchTodayInHistory();
  }, [fetchTodayInHistory]);

  const getCurrentDateTime = () => {
    const now = new Date();
    const localeForDate = locale === 'en' ? 'en-US' : 'zh-CN';
    const date = now.toLocaleDateString(localeForDate, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
    const time = now.toLocaleTimeString(localeForDate, {
      hour: '2-digit',
      minute: '2-digit',
    });
    return { date, time };
  };

  const { date: currentDate, time: currentTime } = getCurrentDateTime();

  return (
    <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950">
      <div className="relative p-6 md:p-8">
        {/* 背景装饰 */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 h-20 w-20 rounded-full bg-blue-200/30 dark:bg-blue-800/30"></div>
        <div className="absolute bottom-0 left-0 -mb-6 -ml-6 h-24 w-24 rounded-full bg-indigo-200/20 dark:bg-indigo-800/20"></div>

        <div className="relative">
          {/* 顶部时间信息 */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-2 sm:mb-0">
              <h1 className="text-2xl font-bold text-gray-900 md:text-3xl dark:text-gray-100">
                {t('dashboard.welcomeBack')}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{currentDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{currentTime}</span>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchTodayInHistory}
              disabled={loading}
              className="bg-white/50 backdrop-blur-sm"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span className="ml-2">{t('dashboard.refresh')}</span>
            </Button>
          </div>

          {/* 历史上的今天 */}
          <Card className="bg-white/70 backdrop-blur-sm dark:bg-gray-900/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                {t('dashboard.todayInHistory')}
                {historyData && (
                  <span className="text-muted-foreground text-sm font-normal">
                    {historyData.date}
                  </span>
                )}
              </CardTitle>
              <CardDescription>
                {t('dashboard.todayInHistoryDesc')}
                {historyData?.cached && (
                  <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">
                    {t('dashboard.cached')}
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-muted-foreground flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>{t('dashboard.loading')}</span>
                  </div>
                </div>
              ) : error ? (
                <div className="py-6 text-center">
                  <p className="text-muted-foreground mb-2 text-sm">
                    {t('dashboard.errorMessage')}
                  </p>
                  <p className="text-xs text-red-500">{error}</p>
                </div>
              ) : historyData?.events ? (
                <div className="space-y-4">
                  {historyData.events.map((event, index) => (
                    <div
                      key={index}
                      className="flex gap-4 rounded-lg border-l-4 border-blue-500 bg-white/50 p-4 dark:bg-gray-800/50"
                    >
                      <div className="flex-shrink-0">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {event.year}
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">
                          {event.title}
                        </h4>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center">
                  <p className="text-muted-foreground text-sm">
                    {t('dashboard.noData')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
