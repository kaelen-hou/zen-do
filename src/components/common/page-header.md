# PageHeader 组件

高阶页面头部组件，用于统一页面标题、描述和操作按钮的展示，减少代码重复并保持设计一致性。

## 特性

- 🎯 **统一设计**：标准化的页面头部布局
- 🔧 **灵活操作**：支持多个操作按钮配置
- 🎨 **多种变体**：默认、卡片、简约三种样式
- 📱 **响应式**：适配不同屏幕尺寸
- ⚡ **TypeScript**：完整的类型支持
- 🚀 **预设组件**：包含返回按钮的快捷组件

## 基础用法

```tsx
import { PageHeader } from '@/components/common/page-header';
import { Settings, ArrowLeft } from 'lucide-react';

<PageHeader
  title="个人设置"
  description="管理您的个人资料和应用偏好设置"
  icon={Settings}
  actions={[
    {
      label: '返回',
      icon: ArrowLeft,
      variant: 'ghost',
      onClick: () => router.back(),
    },
  ]}
/>
```

## 变体样式

### 默认变体（default）

```tsx
<PageHeader
  title="任务列表"
  description="管理您的所有待办事项"
  variant="default"
/>
```

### 卡片变体（card）

```tsx
<PageHeader
  title="项目概览"
  description="查看项目的整体状态"
  variant="card"
/>
```

### 简约变体（minimal）

```tsx
<PageHeader
  title="快速创建"
  variant="minimal"
/>
```

## 操作按钮

### 多个操作按钮

```tsx
<PageHeader
  title="任务管理"
  actions={[
    {
      label: '工作台',
      icon: ArrowLeft,
      variant: 'ghost',
      href: '/dashboard',
    },
    {
      label: '添加任务',
      icon: Plus,
      variant: 'default',
      onClick: () => openModal(),
    },
    {
      label: '统计',
      icon: BarChart3,
      variant: 'outline',
      href: '/statistics',
    },
  ]}
/>
```

### 自定义操作区域

```tsx
<PageHeader title="高级功能">
  <CustomDropdown />
  <SearchInput />
</PageHeader>
```

## 预设组件

### BackHeader - 带返回功能的页面头部

```tsx
import { BackHeader } from '@/components/common/page-header';

<BackHeader
  title="编辑任务"
  description="修改任务详细信息"
  onBack={() => router.back()}
  backLabel="返回列表"
  actions={[
    {
      label: '保存',
      variant: 'default',
      onClick: handleSave,
    },
  ]}
/>
```

## API 参考

### PageHeader Props

| 参数 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| title | string | - | 页面标题 |
| description | string | - | 页面描述（可选） |
| icon | LucideIcon | - | 标题图标（可选） |
| actions | PageHeaderAction[] | [] | 操作按钮数组 |
| children | ReactNode | - | 自定义操作区域内容 |
| className | string | - | 自定义样式类 |
| variant | 'default' \| 'card' \| 'minimal' | 'default' | 显示变体 |

### PageHeaderAction

| 参数 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| label | string | - | 按钮文本 |
| icon | LucideIcon | - | 按钮图标（可选） |
| onClick | () => void | - | 点击处理函数 |
| href | string | - | 链接地址（使用 Next.js Link） |
| variant | ButtonVariant | 'outline' | 按钮样式变体 |
| size | ButtonSize | 'sm' | 按钮尺寸 |
| className | string | - | 自定义样式类 |
| disabled | boolean | false | 是否禁用 |

### BackHeader Props

| 参数 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| title | string | - | 页面标题 |
| description | string | - | 页面描述（可选） |
| onBack | () => void | - | 返回按钮点击处理函数 |
| backLabel | string | '返回' | 返回按钮文本 |
| actions | PageHeaderAction[] | [] | 额外操作按钮 |
| children | ReactNode | - | 自定义内容 |
| className | string | - | 自定义样式类 |

## 迁移指南

### 从重复的 CardHeader 迁移

**之前：**
```tsx
<div className="mb-6 flex items-center gap-4">
  <Button variant="outline" size="icon" asChild>
    <Link href="/dashboard">
      <ArrowLeft className="h-4 w-4" />
    </Link>
  </Button>
  <div>
    <h1 className="text-3xl font-bold">创建新任务</h1>
    <p className="text-muted-foreground">
      使用 AI 智能解析或手动创建任务来保持高效
    </p>
  </div>
</div>
```

**现在：**
```tsx
<PageHeader
  title="创建新任务"
  description="使用 AI 智能解析或手动创建任务来保持高效"
  icon={Plus}
  actions={[
    {
      label: '返回',
      icon: ArrowLeft,
      variant: 'outline',
      href: '/dashboard',
    },
  ]}
/>
```

## 设计模式

### 页面类型映射

| 页面类型 | 推荐变体 | 说明 |
| --- | --- | --- |
| 列表页面 | default | 需要多个操作按钮 |
| 表单页面 | default | 需要保存/返回按钮 |
| 详情页面 | card | 突出内容重要性 |
| 对话框/Modal | minimal | 简洁的标题显示 |

### 操作按钮优先级

| 优先级 | 变体 | 用途 |
| --- | --- | --- |
| 主要操作 | default | 保存、创建、提交等 |
| 次要操作 | outline | 编辑、删除、导出等 |
| 导航操作 | ghost | 返回、取消等 |

## 优势

1. **减少重复代码**：从 ~15 行减少到 ~8 行
2. **设计一致性**：统一的页面头部样式和布局
3. **类型安全**：完整的 TypeScript 类型检查
4. **易于维护**：集中的样式和逻辑管理
5. **灵活配置**：支持多种使用场景