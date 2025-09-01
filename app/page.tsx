'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ModeToggle } from '@/components/mode-toggle';
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
  Sparkles
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">ZenDo</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ModeToggle />
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
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <div className="inline-flex items-center rounded-full px-4 py-2 text-sm bg-primary/10 text-primary mb-8">
              <Sparkles className="w-4 h-4 mr-2" />
              专为现代团队打造的智能任务管理
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8">
              让任务管理
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent block">
                变得简单高效
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
              ZenDo 是一款现代化的任务管理应用，支持实时同步、文件附件、团队协作。
              让你专注于重要的事情，提升工作效率。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6" asChild>
                <Link href="/signup">
                  免费开始使用
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                <Link href="/signin">立即登录</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">强大功能，简单易用</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              我们精心设计了每一个功能，让任务管理变得前所未有的高效
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>实时同步</CardTitle>
                <CardDescription>
                  在任何设备上的更改都会实时同步到其他设备，让你随时随地保持工作状态
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-blue-500" />
                </div>
                <CardTitle>文件附件</CardTitle>
                <CardDescription>
                  支持为任务添加文件附件，所有文件都安全存储在云端，永不丢失
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-600/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>团队协作</CardTitle>
                <CardDescription>
                  实时显示团队成员状态，支持任务分配和协作，让团队更高效
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-700/10 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-blue-700" />
                </div>
                <CardTitle>优先级管理</CardTitle>
                <CardDescription>
                  智能优先级系统帮你专注最重要的任务，合理安排时间
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>数据安全</CardTitle>
                <CardDescription>
                  企业级安全保障，数据加密存储，支持 Google 和邮箱登录
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-800/10 rounded-lg flex items-center justify-center mb-4">
                  <Smartphone className="w-6 h-6 text-blue-800" />
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
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">为什么选择 ZenDo？</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">提升 40% 工作效率</h3>
                    <p className="text-muted-foreground">智能任务排序和提醒功能，让你专注于最重要的事情</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">零学习成本</h3>
                    <p className="text-muted-foreground">直观的界面设计，新手也能快速上手使用</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">完全免费开始</h3>
                    <p className="text-muted-foreground">免费版本包含所有核心功能，满足个人和小团队需求</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500/20 to-blue-700/20 rounded-2xl p-8 h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">📊</div>
                  <p className="text-lg font-medium">在这里展示产品截图或演示视频</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">用户评价</h2>
            <p className="text-xl text-muted-foreground">看看其他用户怎么说</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  &ldquo;ZenDo 完全改变了我的工作方式。实时同步让我在家办公时也能与团队保持紧密协作。&rdquo;
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">张经理</p>
                    <p className="text-sm text-muted-foreground">产品经理</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  &ldquo;作为自由职业者，我需要管理多个项目。ZenDo 的优先级功能让我能更好地安排时间。&rdquo;
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center mr-3">
                    <Users className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium">李设计师</p>
                    <p className="text-sm text-muted-foreground">UI/UX 设计师</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  &ldquo;界面简洁美观，功能强大而不复杂。我们团队的效率提升了很多。&rdquo;
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-600/10 rounded-full flex items-center justify-center mr-3">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">王开发</p>
                    <p className="text-sm text-muted-foreground">前端工程师</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-blue-800 dark:from-primary dark:to-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            准备开始高效工作了吗？
          </h2>
          <p className="text-xl text-white/80 mb-12">
            加入数千名用户，让任务管理变得简单高效
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-white/90" asChild>
              <Link href="/signup">
                免费开始使用
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6 border-white/80 border-2 text-white bg-white/10 hover:bg-white hover:text-blue-600 backdrop-blur-sm" 
              asChild
            >
              <Link href="/signin">立即登录</Link>
            </Button>
          </div>
          <p className="text-white/60 mt-8 text-sm">
            免费版本 · 无需信用卡 · 30秒快速注册
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">ZenDo</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors">功能介绍</Link>
              <Link href="#" className="hover:text-foreground transition-colors">定价</Link>
              <Link href="#" className="hover:text-foreground transition-colors">帮助中心</Link>
              <Link href="#" className="hover:text-foreground transition-colors">联系我们</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; 2024 ZenDo. 保留所有权利。</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
