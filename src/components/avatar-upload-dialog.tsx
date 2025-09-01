'use client';

import React, { useState, useRef } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useGlobalLoading } from '@/stores/useGlobalLoading';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

interface AvatarUploadDialogProps {
  children: React.ReactNode;
  className?: string;
}

export function AvatarUploadDialog({
  children,
  className,
}: AvatarUploadDialogProps) {
  const t = useTranslations();
  const { user, updateUserProfile } = useAuth();
  const { setLoading } = useGlobalLoading();
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 验证文件类型
      if (!file.type.startsWith('image/')) {
        alert(t('settings.fileTypeError'));
        return;
      }

      // 验证文件大小 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(t('settings.fileSizeError'));
        return;
      }

      setSelectedFile(file);

      // 创建预览
      const reader = new FileReader();
      reader.onload = e => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user || !storage) return;

    setLoading(true, t('settings.uploading'));

    try {
      // 创建文件引用
      const fileRef = ref(
        storage,
        `avatars/${user.uid}/${Date.now()}-${selectedFile.name}`
      );

      // 上传文件
      const snapshot = await uploadBytes(fileRef, selectedFile);

      // 获取下载URL
      const downloadURL = await getDownloadURL(snapshot.ref);

      // 更新用户资料
      await updateUserProfile(user.displayName || '', downloadURL);

      // 关闭对话框并重置状态
      setOpen(false);
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error('Upload failed:', error);
      alert(t('settings.uploadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className={className}>
        {children}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {t('settings.uploadAvatar')}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-6">
          {/* 当前头像或预览 */}
          <div className="relative">
            <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-gray-200">
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt={t('settings.profile')}
                  className="h-full w-full object-cover"
                />
              ) : user?.photoURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.photoURL}
                  alt={t('settings.profile')}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="bg-primary text-primary-foreground flex h-full w-full items-center justify-center text-2xl font-bold">
                  {user?.displayName?.charAt(0) ||
                    user?.email?.charAt(0) ||
                    'U'}
                </div>
              )}
            </div>

            {/* 选择文件按钮 */}
            {!selectedFile && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-primary text-primary-foreground hover:bg-primary/90 absolute -right-2 -bottom-2 flex h-8 w-8 items-center justify-center rounded-full shadow-lg transition-colors"
              >
                <Camera className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* 文件选择 */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* 操作按钮 */}
          {!selectedFile ? (
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
              variant="outline"
            >
              <Upload className="mr-2 h-4 w-4" />
              {t('settings.selectImage')}
            </Button>
          ) : (
            <div className="flex w-full space-x-3">
              <Button
                onClick={handleCancel}
                variant="outline"
                className="flex-1"
              >
                <X className="mr-2 h-4 w-4" />
                {t('common.cancel')}
              </Button>
              <Button onClick={handleUpload} className="flex-1">
                {t('settings.uploadAvatar')}
              </Button>
            </div>
          )}

          <p className="text-muted-foreground text-center text-sm">
            {t('settings.supportedFormats')}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
