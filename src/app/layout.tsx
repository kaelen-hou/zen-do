import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/components/theme-provider';

export const metadata: Metadata = {
  title: {
    default: 'ZenDo - 现代化任务管理应用',
    template: '%s | ZenDo',
  },
  description: '基于 Next.js 和 Firebase 构建的现代化任务管理应用，支持智能任务解析、实时同步和多设备访问',
  keywords: ['任务管理', '待办事项', 'Todo', '生产力工具', 'Next.js', 'Firebase'],
  authors: [{ name: 'ZenDo Team' }],
  creator: 'ZenDo',
  publisher: 'ZenDo',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://zendo.notiving.com'),
  openGraph: {
    title: 'ZenDo - 现代化任务管理应用',
    description: '高效管理任务，智能解析内容，实现更好的生产力',
    url: 'https://zendo.notiving.com',
    siteName: 'ZenDo',
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZenDo - 现代化任务管理应用',
    description: '高效管理任务，智能解析内容，实现更好的生产力',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification=your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
