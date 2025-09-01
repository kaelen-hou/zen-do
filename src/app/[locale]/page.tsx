'use client';

import { useEffect } from 'react';
import { useRouter } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LanguageSwitcher } from '@/components/language-switcher';
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
  const t = useTranslations();

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
                  <span className="text-xl font-bold">{t('home.title')}</span>
                  <p className="text-muted-foreground text-xs">
                    {t('home.subtitle')}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <LanguageSwitcher />
              <Button variant="ghost" asChild>
                <Link href="/signin">{t('navigation.login')}</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">{t('navigation.signup')}</Link>
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
              {t('home.subtitle')}
            </div>
            <h1 className="mb-8 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              {t('home.heroTitle')}
              <span className="from-primary to-secondary block bg-gradient-to-r bg-clip-text text-transparent">
                {t('home.heroTitleHighlight')}
              </span>
            </h1>
            <p className="text-muted-foreground mx-auto mb-12 max-w-3xl text-xl">
              {t('home.heroDescription')}
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" className="px-8 py-6 text-lg" asChild>
                <Link href="/signup">
                  {t('home.getStarted')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg"
                asChild
              >
                <Link href="/signin">{t('home.login')}</Link>
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
              {t('home.featuresTitle')}
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
              {t('home.featuresSubtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="relative overflow-hidden transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                  <Zap className="text-primary h-6 w-6" />
                </div>
                <CardTitle>{t('home.realtimeSync')}</CardTitle>
                <CardDescription>{t('home.realtimeSyncDesc')}</CardDescription>
              </CardHeader>
            </Card>

            <Card className="relative overflow-hidden transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                  <FileText className="h-6 w-6 text-blue-500" />
                </div>
                <CardTitle>{t('home.fileAttachments')}</CardTitle>
                <CardDescription>
                  {t('home.fileAttachmentsDesc')}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="relative overflow-hidden transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600/10">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>{t('home.teamCollaboration')}</CardTitle>
                <CardDescription>
                  {t('home.teamCollaborationDesc')}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="relative overflow-hidden transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-700/10">
                  <Target className="h-6 w-6 text-blue-700" />
                </div>
                <CardTitle>{t('home.priorityManagement')}</CardTitle>
                <CardDescription>
                  {t('home.priorityManagementDesc')}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="relative overflow-hidden transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>{t('home.dataSecurity')}</CardTitle>
                <CardDescription>{t('home.dataSecurityDesc')}</CardDescription>
              </CardHeader>
            </Card>

            <Card className="relative overflow-hidden transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-800/10">
                  <Smartphone className="h-6 w-6 text-blue-800" />
                </div>
                <CardTitle>{t('home.crossPlatform')}</CardTitle>
                <CardDescription>{t('home.crossPlatformDesc')}</CardDescription>
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
                {t('home.whyChooseTitle')}
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-500">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold">
                      {t('home.improveEfficiency')}
                    </h3>
                    <p className="text-muted-foreground">
                      {t('home.improveEfficiencyDesc')}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-500">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold">
                      {t('home.zeroLearning')}
                    </h3>
                    <p className="text-muted-foreground">
                      {t('home.zeroLearningDesc')}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-500">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold">
                      {t('home.freeTrial')}
                    </h3>
                    <p className="text-muted-foreground">
                      {t('home.freeTrialDesc')}
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
                    {t('home.demoPlaceholder')}
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
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              {t('home.testimonialsTitle')}
            </h2>
            <p className="text-muted-foreground text-xl">
              {t('home.testimonialsSubtitle')}
            </p>
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
                  &ldquo;{t('home.testimonial1')}&rdquo;
                </p>
                <div className="flex items-center">
                  <div className="bg-primary/10 mr-3 flex h-10 w-10 items-center justify-center rounded-full">
                    <Users className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{t('home.testimonial1Name')}</p>
                    <p className="text-muted-foreground text-sm">
                      {t('home.testimonial1Title')}
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
                  &ldquo;{t('home.testimonial2')}&rdquo;
                </p>
                <div className="flex items-center">
                  <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
                    <Users className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium">{t('home.testimonial2Name')}</p>
                    <p className="text-muted-foreground text-sm">
                      {t('home.testimonial2Title')}
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
                  &ldquo;{t('home.testimonial3')}&rdquo;
                </p>
                <div className="flex items-center">
                  <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600/10">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{t('home.testimonial3Name')}</p>
                    <p className="text-muted-foreground text-sm">
                      {t('home.testimonial3Title')}
                    </p>
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
            {t('home.ctaTitle')}
          </h2>
          <p className="mb-12 text-xl text-white/80">{t('home.ctaSubtitle')}</p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white px-8 py-6 text-lg text-blue-600 hover:bg-white/90"
              asChild
            >
              <Link href="/signup">
                {t('home.getStarted')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white/80 bg-white/10 px-8 py-6 text-lg text-white backdrop-blur-sm hover:bg-white hover:text-blue-600"
              asChild
            >
              <Link href="/signin">{t('home.login')}</Link>
            </Button>
          </div>
          <p className="mt-8 text-sm text-white/60">{t('home.freeFeatures')}</p>
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
                {t('home.footerFeatures')}
              </Link>
              <Link
                href="#"
                className="hover:text-foreground transition-colors"
              >
                {t('home.footerPricing')}
              </Link>
              <Link
                href="#"
                className="hover:text-foreground transition-colors"
              >
                {t('home.footerHelp')}
              </Link>
              <Link
                href={`mailto:${t('home.contactEmail')}`}
                className="hover:text-foreground transition-colors"
              >
                {t('home.footerContact')}
              </Link>
            </div>
          </div>
          <div className="text-muted-foreground mt-8 border-t pt-8 text-center text-sm">
            <p>{t('home.footerCopyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
