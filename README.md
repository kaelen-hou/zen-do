# ZenDo - 现代化任务管理应用

这是一个基于 [Next.js](https://nextjs.org) 构建的现代化任务管理应用，集成了 Firebase 后端服务，使用 TypeScript 和 Tailwind CSS 开发。

## 🚀 开始使用

首先，安装依赖并运行开发服务器：

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm run dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看应用。

您可以通过修改 `app/page.tsx` 来编辑页面。文件保存后页面会自动更新。

## 🛠️ 技术栈

- **框架**: Next.js 15.5.2 配合 App Router 和 Turbopack
- **React**: 19.1.0 使用客户端组件提供交互性
- **后端**: Firebase 完整集成 - 认证、Firestore、存储、云函数
- **样式**: Tailwind CSS 4.x 配合自定义色彩系统
- **UI 组件**: shadcn/ui 完整集成，支持深色模式
- **状态管理**: Zustand 5.0.8
- **表单处理**: React Hook Form 7.62.0
- **TypeScript**: 严格模式启用
- **图标**: Lucide React

## ✨ 功能特性

- 🔐 **用户认证**: 支持邮箱密码和 Google OAuth 登录
- 📱 **响应式设计**: 适配所有设备尺寸
- 🎨 **深色模式**: 完整的深浅主题切换
- 🌏 **中文本地化**: 完整的中文用户界面
- ⚡ **实时同步**: Firebase 实时数据库集成
- 📎 **文件附件**: 支持任务文件上传
- 🏷️ **优先级管理**: 可视化的任务优先级系统
- 👥 **用户头像**: 头像下拉菜单和个人信息管理

## 📁 项目结构

```
zen-do/
├── app/                    # Next.js App Router
│   ├── dashboard/         # 仪表板页面
│   ├── signin/           # 登录页面
│   ├── signup/           # 注册页面
│   ├── add-task/         # 添加任务页面
│   └── tasks/            # 任务列表页面
├── components/             # React 组件
│   ├── ui/               # shadcn/ui 组件
│   └── user-avatar-dropdown.tsx
├── contexts/              # React Context
│   └── AuthContext.tsx   # 认证上下文
├── lib/                   # 工具和配置
│   ├── firebase.ts       # Firebase 配置
│   └── utils.ts          # 工具函数
├── types/                 # TypeScript 类型定义
└── .claude/              # Claude Code 配置
```

## 🚀 部署

### Vercel 部署（推荐）

最简单的部署方式是使用 Next.js 创建者提供的 [Vercel 平台](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)。

查看 [Next.js 部署文档](https://nextjs.org/docs/app/building-your-application/deploying) 了解更多详情。

### Firebase 配置

1. 在 [Firebase Console](https://console.firebase.google.com/) 创建新项目
2. 启用 Authentication 和 Firestore Database
3. 复制配置信息到 `.env.local` 文件
4. 详细设置请参考 `FIREBASE_SETUP.md`

## 📚 学习资源

要了解更多关于项目使用的技术，请查看以下资源：

- [Next.js 文档](https://nextjs.org/docs) - 学习 Next.js 功能和 API
- [Firebase 文档](https://firebase.google.com/docs) - Firebase 服务和集成
- [Tailwind CSS](https://tailwindcss.com/docs) - 实用优先的 CSS 框架
- [shadcn/ui](https://ui.shadcn.com/) - 现代化 React 组件库

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License
