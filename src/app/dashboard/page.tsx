'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ModeToggle } from '@/components/mode-toggle';
import { UserAvatarDropdown } from '@/components/user-avatar-dropdown';
import { ClipboardList, Plus, BarChart3, Info } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="border-primary-600 h-32 w-32 animate-spin rounded-full border-b-2"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="bg-background min-h-screen">
      <nav className="border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">ZenDo 工作台</h1>
            </div>
            <div className="flex items-center space-x-4">
              <ModeToggle />
              <UserAvatarDropdown />
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8 text-center">
            <h2 className="mb-4 text-3xl font-bold">
              欢迎使用 ZenDo，{user.displayName || user.email?.split('@')[0]}！
            </h2>
            <p className="text-muted-foreground">
              您的任务管理工作台已准备就绪。在这里您可以管理任务并保持高效有序。
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader className="text-center">
                <div className="text-primary mb-4">
                  <ClipboardList className="mx-auto h-8 w-8" />
                </div>
                <CardTitle>我的任务</CardTitle>
                <CardDescription>查看和管理您的待办事项</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/tasks">查看任务 →</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="transition-shadow hover:shadow-md">
              <CardHeader className="text-center">
                <div className="text-secondary mb-4">
                  <Plus className="mx-auto h-8 w-8" />
                </div>
                <CardTitle>添加任务</CardTitle>
                <CardDescription>创建新的待办事项</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/add-task">新建任务 →</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="transition-shadow hover:shadow-md">
              <CardHeader className="text-center">
                <div className="mb-4 text-blue-600">
                  <BarChart3 className="mx-auto h-8 w-8" />
                </div>
                <CardTitle>数据分析</CardTitle>
                <CardDescription>追踪您的工作效率</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  查看统计 →
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mx-auto mt-8 max-w-md">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <Info className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">
                      更多功能即将推出！此工作台将成为您任务管理的中心枢纽。
                      您可以尝试使用主题切换器在浅色和深色模式之间切换。
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
