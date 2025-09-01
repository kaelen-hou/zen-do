'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ModeToggle } from '@/components/mode-toggle';
import { LanguageSwitcher } from '@/components/language-switcher';
import { PageHeader } from '@/components/common/page-header';
import { User, Camera, Save, ArrowLeft, Settings } from 'lucide-react';
import { AvatarUploadDialog } from '@/components/avatar-upload-dialog';

export default function SettingsPage() {
  const { user, updateUserProfile } = useAuth();
  const t = useTranslations();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleCancel = () => {
    // 获取当前URL中的locale，确保导航到正确的语言版本
    const currentPath = window.location.pathname;
    const currentLocale = currentPath.startsWith('/en') ? 'en' : 'zh';
    window.location.href = `/${currentLocale}/dashboard`;
  };

  const handleUpdateProfile = async () => {
    if (!displayName.trim()) return;

    setIsUpdating(true);
    try {
      await updateUserProfile(displayName);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <PageHeader
        title={t('settings.title')}
        description={t('settings.description')}
        icon={Settings}
        actions={[
          {
            label: t('common.cancel'),
            icon: ArrowLeft,
            variant: 'ghost',
            onClick: handleCancel,
          },
        ]}
      />

      <div className="grid gap-6">
        {/* 个人资料 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {t('settings.profile')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 头像部分 */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                {user.photoURL ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    className="h-20 w-20 rounded-full border-2 border-gray-200 object-cover"
                    src={user.photoURL}
                    alt={user.displayName || '用户头像'}
                  />
                ) : (
                  <div className="bg-primary/10 flex h-20 w-20 items-center justify-center rounded-full">
                    <User className="text-primary/50 h-10 w-10" />
                  </div>
                )}
                <AvatarUploadDialog>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -right-2 -bottom-2 h-8 w-8 rounded-full p-0"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </AvatarUploadDialog>
              </div>
              <div>
                <p className="font-medium">
                  {user.displayName || '未设置昵称'}
                </p>
                <p className="text-muted-foreground text-sm">{user.email}</p>
                <p className="text-muted-foreground mt-1 text-xs">
                  {t('settings.avatarClickHint')}
                </p>
              </div>
            </div>

            <Separator />

            {/* 昵称编辑 */}
            <div className="space-y-2">
              <Label htmlFor="displayName">{t('settings.nickname')}</Label>
              <div className="flex space-x-2">
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder={t('settings.nicknamePlaceholder')}
                />
                <Button
                  onClick={handleUpdateProfile}
                  disabled={
                    isUpdating ||
                    !displayName.trim() ||
                    displayName === user.displayName
                  }
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isUpdating ? t('settings.saving') : t('settings.save')}
                </Button>
              </div>
            </div>

            {/* 邮箱 (只读) */}
            <div className="space-y-2">
              <Label htmlFor="email">{t('settings.email')}</Label>
              <Input
                id="email"
                value={user.email || ''}
                disabled
                className="bg-muted"
              />
              <p className="text-muted-foreground text-xs">
                {t('settings.emailReadonly')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 应用设置 */}
        <Card>
          <CardHeader>
            <CardTitle>{t('settings.appSettings')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 主题设置 */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">{t('settings.themeMode')}</Label>
                <p className="text-muted-foreground text-sm">
                  {t('settings.themeModeDesc')}
                </p>
              </div>
              <ModeToggle />
            </div>

            <Separator />

            {/* 语言设置 */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">{t('settings.language')}</Label>
                <p className="text-muted-foreground text-sm">
                  {t('settings.languageDesc')}
                </p>
              </div>
              <LanguageSwitcher />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
