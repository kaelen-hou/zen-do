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
import {
  CheckCircle,
  Zap,
  Shield,
  Smartphone,
  Users,
  FileText,
  Star,
  ArrowRight,
  Target,
  Sparkles,
} from 'lucide-react';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-primary h-12 w-12 animate-spin rounded-full border-b-2"></div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Navigation */}
      <nav className="bg-background/95 supports-[backdrop-filter]:bg-background/60 border-b backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="bg-primary/10 rounded-xl p-2">
                    <CheckCircle className="text-primary h-6 w-6" />
                  </div>
                  <div className="ring-background absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500 ring-2"></div>
                </div>
                <div>
                  <span className="text-xl font-bold">ZenDo</span>
                  <p className="text-muted-foreground text-xs">
                    智能任务管理平台
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" asChild>
                <Link href="/signin">登录</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">免费开始</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="from-primary/5 via-background to-secondary/5 relative overflow-hidden bg-gradient-to-br">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="text-center">
            <div className="bg-primary/10 text-primary mb-8 inline-flex items-center rounded-full px-4 py-2 text-sm">
              <Sparkles className="mr-2 h-4 w-4" />
              专为现代团队打造的智能任务管理
            </div>
            <h1 className="mb-8 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              让任务管理
              <span className="from-primary to-secondary block bg-gradient-to-r bg-clip-text text-transparent">
                变得简单高效
              </span>
            </h1>
            <p className="text-muted-foreground mx-auto mb-12 max-w-3xl text-xl">
              ZenDo
              是一款现代化的任务管理应用，支持实时同步、文件附件、团队协作。
              让你专注于重要的事情，提升工作效率。
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" className="px-8 py-6 text-lg" asChild>
                <Link href="/signup">
                  免费开始使用
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg"
                asChild
              >
                <Link href="/signin">立即登录</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-background py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              强大功能，简单易用
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
              我们精心设计了每一个功能，让任务管理变得前所未有的高效
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="relative overflow-hidden transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                  <Zap className="text-primary h-6 w-6" />
                </div>
                <CardTitle>实时同步</CardTitle>
                <CardDescription>
                  在任何设备上的更改都会实时同步到其他设备，让你随时随地保持工作状态
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="relative overflow-hidden transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                  <FileText className="h-6 w-6 text-blue-500" />
                </div>
                <CardTitle>文件附件</CardTitle>
                <CardDescription>
                  支持为任务添加文件附件，所有文件都安全存储在云端，永不丢失
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="relative overflow-hidden transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600/10">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>团队协作</CardTitle>
                <CardDescription>
                  实时显示团队成员状态，支持任务分配和协作，让团队更高效
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="relative overflow-hidden transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-700/10">
                  <Target className="h-6 w-6 text-blue-700" />
                </div>
                <CardTitle>优先级管理</CardTitle>
                <CardDescription>
                  智能优先级系统帮你专注最重要的任务，合理安排时间
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="relative overflow-hidden transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>数据安全</CardTitle>
                <CardDescription>
                  企业级安全保障，数据加密存储，支持 Google 和邮箱登录
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="relative overflow-hidden transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-800/10">
                  <Smartphone className="h-6 w-6 text-blue-800" />
                </div>
                <CardTitle>跨平台支持</CardTitle>
                <CardDescription>
                  支持 Web、手机端，响应式设计适配所有屏幕尺寸
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-muted/30 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold md:text-4xl">
                为什么选择 ZenDo？
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-500">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold">
                      提升 40% 工作效率
                    </h3>
                    <p className="text-muted-foreground">
                      智能任务排序和提醒功能，让你专注于最重要的事情
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-500">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold">零学习成本</h3>
                    <p className="text-muted-foreground">
                      直观的界面设计，新手也能快速上手使用
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-500">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold">完全免费开始</h3>
                    <p className="text-muted-foreground">
                      免费版本包含所有核心功能，满足个人和小团队需求
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="flex h-96 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-700/20 p-8">
                <div className="text-center">
                  <div className="mb-4 text-6xl">📊</div>
                  <p className="text-lg font-medium">
                    在这里展示产品截图或演示视频
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-background py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">用户评价</h2>
            <p className="text-muted-foreground text-xl">看看其他用户怎么说</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  &ldquo;ZenDo
                  完全改变了我的工作方式。实时同步让我在家办公时也能与团队保持紧密协作。&rdquo;
                </p>
                <div className="flex items-center">
                  <div className="bg-primary/10 mr-3 flex h-10 w-10 items-center justify-center rounded-full">
                    <Users className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">张经理</p>
                    <p className="text-muted-foreground text-sm">产品经理</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  &ldquo;作为自由职业者，我需要管理多个项目。ZenDo
                  的优先级功能让我能更好地安排时间。&rdquo;
                </p>
                <div className="flex items-center">
                  <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
                    <Users className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium">李设计师</p>
                    <p className="text-muted-foreground text-sm">
                      UI/UX 设计师
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  &ldquo;界面简洁美观，功能强大而不复杂。我们团队的效率提升了很多。&rdquo;
                </p>
                <div className="flex items-center">
                  <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600/10">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">王开发</p>
                    <p className="text-muted-foreground text-sm">前端工程师</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="dark:from-primary dark:to-secondary bg-gradient-to-br from-blue-600 to-blue-800 py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
            准备开始高效工作了吗？
          </h2>
          <p className="mb-12 text-xl text-white/80">
            加入数千名用户，让任务管理变得简单高效
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white px-8 py-6 text-lg text-blue-600 hover:bg-white/90"
              asChild
            >
              <Link href="/signup">
                免费开始使用
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white/80 bg-white/10 px-8 py-6 text-lg text-white backdrop-blur-sm hover:bg-white hover:text-blue-600"
              asChild
            >
              <Link href="/signin">立即登录</Link>
            </Button>
          </div>
          <p className="mt-8 text-sm text-white/60">
            免费版本 · 无需信用卡 · 30秒快速注册
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="mb-4 flex items-center space-x-2 md:mb-0">
              <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
                <CheckCircle className="text-primary-foreground h-5 w-5" />
              </div>
              <span className="text-xl font-bold">ZenDo</span>
            </div>
            <div className="text-muted-foreground flex items-center space-x-6 text-sm">
              <Link
                href="#"
                className="hover:text-foreground transition-colors"
              >
                功能介绍
              </Link>
              <Link
                href="#"
                className="hover:text-foreground transition-colors"
              >
                定价
              </Link>
              <Link
                href="#"
                className="hover:text-foreground transition-colors"
              >
                帮助中心
              </Link>
              <Link
                href="#"
                className="hover:text-foreground transition-colors"
              >
                联系我们
              </Link>
            </div>
          </div>
          <div className="text-muted-foreground mt-8 border-t pt-8 text-center text-sm">
            <p>&copy; 2024 ZenDo. 保留所有权利。</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
