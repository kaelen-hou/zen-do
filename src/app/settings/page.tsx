'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ModeToggle } from '@/components/mode-toggle';
import { User, Camera, Save, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { user, updateUserProfile } = useAuth();
  const router = useRouter();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [isUpdating, setIsUpdating] = useState(false);

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
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回
        </Button>
        <h1 className="text-3xl font-bold">个人设置</h1>
        <p className="text-muted-foreground mt-2">
          管理您的个人资料和应用偏好设置
        </p>
      </div>

      <div className="grid gap-6">
        {/* 个人资料 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              个人资料
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 头像部分 */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                {user.photoURL ? (
                  <Image
                    className="h-20 w-20 rounded-full"
                    src={user.photoURL}
                    alt={user.displayName || '用户头像'}
                    width={80}
                    height={80}
                  />
                ) : (
                  <div className="bg-primary/10 flex h-20 w-20 items-center justify-center rounded-full">
                    <User className="text-primary/50 h-10 w-10" />
                  </div>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -right-2 -bottom-2 h-8 w-8 rounded-full p-0"
                  disabled
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <p className="font-medium">
                  {user.displayName || '未设置昵称'}
                </p>
                <p className="text-muted-foreground text-sm">{user.email}</p>
                <p className="text-muted-foreground mt-1 text-xs">
                  头像功能即将推出
                </p>
              </div>
            </div>

            <Separator />

            {/* 昵称编辑 */}
            <div className="space-y-2">
              <Label htmlFor="displayName">昵称</Label>
              <div className="flex space-x-2">
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder="请输入您的昵称"
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
                  {isUpdating ? '保存中...' : '保存'}
                </Button>
              </div>
            </div>

            {/* 邮箱 (只读) */}
            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                value={user.email || ''}
                disabled
                className="bg-muted"
              />
              <p className="text-muted-foreground text-xs">邮箱地址无法修改</p>
            </div>
          </CardContent>
        </Card>

        {/* 应用设置 */}
        <Card>
          <CardHeader>
            <CardTitle>应用设置</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 主题设置 */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">主题模式</Label>
                <p className="text-muted-foreground text-sm">
                  选择应用的外观主题
                </p>
              </div>
              <ModeToggle />
            </div>

            <Separator />

            {/* 语言设置 */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">语言</Label>
                <p className="text-muted-foreground text-sm">
                  选择应用界面语言
                </p>
              </div>
              <div className="text-muted-foreground text-sm">中文 (简体)</div>
            </div>
            <p className="text-muted-foreground text-xs">多语言支持即将推出</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
