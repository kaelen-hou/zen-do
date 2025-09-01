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
import { useTranslations, useLocale } from 'next-intl';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signInWithGoogle, user } = useAuth();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('auth');

  // 临时调试信息
  console.log('Current locale:', locale);
  try {
    console.log('createAccount translation:', t('createAccount'));
  } catch (e) {
    console.log('createAccount error:', e instanceof Error ? e.message : String(e));
  }

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      setError(t('fillAllRequiredFields'));
      return;
    }

    if (password !== confirmPassword) {
      setError(t('passwordsNotMatch'));
      return;
    }

    if (password.length < 6) {
      setError(t('passwordMinLengthError'));
      return;
    }

    try {
      setLoading(true);
      setError('');
      await signUp(email, password, displayName || undefined);
      router.push('/dashboard');
    } catch (error) {
      // 转换 Firebase 错误为中文提示
      const errorMessage = (error as Error).message;
      if (errorMessage.includes('email-already-in-use')) {
        setError(t('emailAlreadyInUse'));
      } else if (errorMessage.includes('invalid-email')) {
        setError(t('invalidEmailFormat'));
      } else if (errorMessage.includes('weak-password')) {
        setError(t('weakPassword'));
      } else {
        setError(t('signUpFailed'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
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
          <h2 className="text-3xl font-bold tracking-tight">{t('createAccount')}</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            {t('alreadyHaveAccount')}{' '}
            <Link
              href="/signin"
              className="text-primary hover:text-primary/80 font-medium"
            >
              {t('signInNow')}
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>{t('getStarted')}</CardTitle>
            <CardDescription>{t('createAccountToStart')}</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-destructive/10 border-destructive/20 text-destructive mb-4 rounded-md border p-3 text-sm">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSignUp}>
              <div className="space-y-2">
                <Label htmlFor="displayName">{t('displayName')}</Label>
                <Input
                  id="displayName"
                  name="displayName"
                  type="text"
                  autoComplete="name"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder={t('displayNamePlaceholder')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t('emailAddress')}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={t('emailPlaceholder')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t('password')}</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={t('passwordMinLength')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder={t('confirmPasswordPlaceholder')}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t('creatingAccount') : t('createAccountButton')}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background text-muted-foreground px-2">
                    {t('orUseFollowing')}
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignUp}
                disabled={loading}
              >
                <Chrome className="mr-2 h-4 w-4" />
                {t('signUpWithGoogle')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
