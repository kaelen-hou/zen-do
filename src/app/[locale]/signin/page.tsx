'use client';

import { useState, useEffect } from 'react';
import { useRouter, Link } from '@/i18n/routing';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Chrome } from 'lucide-react';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('请填写所有字段');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await signIn(email, password);
      router.push('/dashboard');
    } catch (error) {
      // 转换 Firebase 错误为中文提示
      const errorMessage = (error as Error).message;
      if (errorMessage.includes('user-not-found')) {
        setError('用户不存在，请检查邮箱地址');
      } else if (errorMessage.includes('wrong-password')) {
        setError('密码错误，请重试');
      } else if (errorMessage.includes('invalid-email')) {
        setError('邮箱格式不正确');
      } else if (errorMessage.includes('too-many-requests')) {
        setError('登录尝试次数过多，请稍后再试');
      } else {
        setError('登录失败，请检查您的凭据');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      await signInWithGoogle();
      // 登录成功后会自动通过 AuthContext 的状态变化跳转到 dashboard
    } catch (error) {
      // 只有在真正出错时才显示错误信息
      if (error && (error as Error).message) {
        setError((error as Error).message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">登录您的账户</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            还没有账户？{' '}
            <Link
              href="/signup"
              className="text-primary hover:text-primary/80 font-medium"
            >
              立即注册
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>欢迎回来</CardTitle>
            <CardDescription>请输入您的登录信息</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-destructive/10 border-destructive/20 text-destructive mb-4 rounded-md border p-3 text-sm">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleEmailSignIn}>
              <div className="space-y-2">
                <Label htmlFor="email">邮箱地址</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="请输入您的邮箱"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="请输入您的密码"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link
                    href="/reset-password"
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    忘记密码？
                  </Link>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? '登录中...' : '登录'}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background text-muted-foreground px-2">
                    或者使用以下方式
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                <Chrome className="mr-2 h-4 w-4" />
                使用 Google 登录
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
