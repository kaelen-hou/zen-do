# CLAUDE.md

此文件为 Claude Code (claude.ai/code) 提供在此代码库中工作的指导。

## 开发命令
- 包管理器：pnpm
- `pnpm run dev` - 使用 Turbopack 启动开发服务器
- `pnpm run build` - 使用 Turbopack 进行生产构建
- `pnpm run start` - 启动生产服务器
- `pnpm run lint` - 运行 ESLint 检查代码质量
- `pnpm run lint:fix` - 自动修复可修复的 ESLint 错误
- `pnpm run format` - 使用 Prettier 格式化代码
- `pnpm run format:check` - 检查代码格式是否符合 Prettier 规范
- `pnpm run typecheck` - 运行 TypeScript 类型检查
- `pnpm run check` - 运行完整检查（类型、lint、格式）

## 架构概览

这是一个基于 Next.js 15 的待办事项应用程序，集成了 Firebase 后端，使用 TypeScript 和 Tailwind CSS 构建。

### 技术栈
- **框架**: Next.js 15.5.2 配合 App Router 和 Turbopack
- **React**: 19.1.0 使用客户端组件提供交互性
- **Firebase**: 完整集成 (v12.2.1) - 认证、Firestore、存储、实时数据库、云函数、分析
- **状态管理**: Zustand 5.0.8 用于客户端状态管理
- **表单处理**: React Hook Form 7.62.0
- **样式系统**: Tailwind CSS 4.x 配合自定义待办事项色彩系统
- **工具库**: date-fns 用于日期处理，react-firebase-hooks 用于 Firebase 集成
- **图标库**: lucide-react

### 关键目录
- `/app/` - Next.js App Router，layout.tsx 包装 AuthProvider
- `/contexts/` - React 上下文，主要是用于 Firebase 认证的 AuthContext.tsx
- `/lib/` - 工具和配置，包括 firebase.ts 设置
- `/types/` - TypeScript 类型定义：Todo、User、Priority、Status、UserPresence
- `/components/`、`/hooks/`、`/stores/` - 规划的模块化架构

### 认证系统
- 基于 Context 的认证，使用在 layout.tsx 中包装整个应用的 AuthContext
- Firebase Auth 支持邮箱/密码和 Google OAuth 登录
- 用户类型包含 uid、email、displayName、photoURL
- 首页 (app/page.tsx) 自动将已认证用户重定向到 /dashboard
- Google 登录使用弹窗模式（signInWithPopup），提供优秀的用户体验

### Firebase 配置
- 所有 Firebase 服务在 lib/firebase.ts 中初始化
- 使用 Next.js 环境变量进行配置
- 服务：auth（认证）、db（Firestore）、storage（存储）、realtimeDb（实时数据库）、functions（云函数）、analytics（分析）
- Analytics 仅在浏览器环境中加载并带有功能检测

### 样式系统
- Tailwind CSS 配合完整的自定义色彩调色板
- 优先级颜色：priority-low（绿色）、priority-medium（黄色）、priority-high（红色）、priority-urgent（深红色）
- 状态颜色：status-todo（灰色）、status-in-progress（蓝色）、status-done（绿色）、status-archived（浅灰色）
- 主题颜色：primary（蓝色）、secondary（紫色），加上 success/warning/error/info 变体
- 通过 CSS 自定义属性和 prefers-color-scheme 支持深色模式

### TypeScript 配置
- 启用严格模式，目标为 ES2017
- 路径别名：`@/*` 映射到项目根目录
- 使用 Next.js TypeScript 插件的现代模块解析

### 当前开发状态
- 核心基础设施完成：Firebase 设置、认证上下文、类型定义、样式系统
- 认证系统已实现：登录、注册、仪表板配合 Firebase Auth
- 任务管理已实现：
  * 使用表单验证的任务创建（zod + react-hook-form）
  * 任务列表和显示，带有优先级/状态徽章
  * Firestore 集成的 CRUD 操作
  * 路由：/dashboard、/signin、/signup、/add-task、/tasks
- UI 组件：完整的 shadcn/ui 集成，支持深色模式
- 用户界面：完整的营销主页，包含中文本地化
- 用户体验：头像下拉菜单、Google 弹窗登录、响应式设计
- Components、hooks、stores 目录遵循模块化模式

### 重要提醒指令
按照用户要求执行任务，不多不少。
除非绝对必要，否则不要创建文件。
总是优先编辑现有文件而不是创建新文件。
除非用户明确要求，否则不要主动创建文档文件（*.md）或 README 文件。
- 任务执行完成后,运行 check, build 脚本,确保项目编译成功