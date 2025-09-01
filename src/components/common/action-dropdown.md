# ActionDropdown 组件

基于 shadcn/ui 的高阶下拉菜单组件，用于减少代码重复并提供统一的交互体验。

## 特性

- 🎯 **统一接口**：通过配置数组快速创建下拉菜单
- 🔧 **灵活配置**：支持菜单项、分隔线、标签等多种类型
- 🎨 **样式一致**：基于 shadcn/ui 设计系统
- ⚡ **TypeScript**：完整的类型支持
- 🚀 **预设组件**：包含常用的图标触发器

## 基础用法

```tsx
import {
  ActionDropdown,
  IconTrigger,
} from '@/components/common/action-dropdown';
import { MoreHorizontal, Edit, Trash } from 'lucide-react';

const items = [
  {
    type: 'item' as const,
    label: '编辑',
    icon: Edit,
    onClick: () => console.log('编辑'),
  },
  {
    type: 'separator' as const,
  },
  {
    type: 'item' as const,
    label: '删除',
    icon: Trash,
    onClick: () => console.log('删除'),
    className: 'text-destructive',
  },
];

<ActionDropdown
  trigger={<IconTrigger icon={MoreHorizontal} />}
  items={items}
/>;
```

## 高级用法

### 自定义触发器

```tsx
<ActionDropdown
  trigger={<Button variant="outline">更多操作</Button>}
  items={items}
/>
```

### 用户菜单示例

```tsx
const userMenuItems = [
  {
    type: 'label' as const,
    label: '我的账户',
  },
  {
    type: 'separator' as const,
  },
  {
    type: 'item' as const,
    label: '个人设置',
    icon: Settings,
    onClick: () => router.push('/settings'),
  },
  {
    type: 'item' as const,
    label: '退出登录',
    icon: LogOut,
    onClick: handleLogout,
    className: 'text-destructive',
  },
];
```

### 加载状态

```tsx
<ActionDropdown
  trigger={
    <IconTrigger
      icon={MoreHorizontal}
      loading={isLoading}
      loadingIcon={Loader2}
      disabled={isLoading}
    />
  }
  items={items}
  disabled={isLoading}
/>
```

## API 参考

### ActionDropdown Props

| 参数             | 类型                         | 默认值 | 描述           |
| ---------------- | ---------------------------- | ------ | -------------- |
| trigger          | ReactNode                    | -      | 触发器元素     |
| items            | ActionDropdownItem[]         | -      | 菜单项配置数组 |
| align            | 'start' \| 'center' \| 'end' | 'end'  | 菜单对齐方式   |
| contentClassName | string                       | -      | 菜单内容样式类 |
| disabled         | boolean                      | false  | 是否禁用       |

### ActionDropdownItem

| 参数      | 类型                             | 描述                 |
| --------- | -------------------------------- | -------------------- |
| type      | 'item' \| 'separator' \| 'label' | 项目类型             |
| label     | ReactNode                        | 显示文本或自定义内容 |
| icon      | LucideIcon                       | 图标组件             |
| onClick   | () => void                       | 点击处理函数         |
| className | string                           | 自定义样式类         |
| disabled  | boolean                          | 是否禁用该项         |

### IconTrigger Props

| 参数        | 类型          | 默认值  | 描述             |
| ----------- | ------------- | ------- | ---------------- |
| icon        | LucideIcon    | -       | 显示的图标       |
| loading     | boolean       | false   | 是否显示加载状态 |
| loadingIcon | LucideIcon    | -       | 加载时的图标     |
| variant     | ButtonVariant | 'ghost' | 按钮样式变体     |
| size        | ButtonSize    | 'sm'    | 按钮尺寸         |
| className   | string        | -       | 自定义样式类     |
| disabled    | boolean       | false   | 是否禁用         |

## 迁移指南

### 从原生 DropdownMenu 迁移

**之前：**

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="sm">
      <MoreHorizontal className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem onClick={handleEdit}>
      <Edit className="mr-2 h-4 w-4" />
      编辑
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem onClick={handleDelete} className="text-destructive">
      <Trash className="mr-2 h-4 w-4" />
      删除
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

**现在：**

```tsx
<ActionDropdown
  trigger={<IconTrigger icon={MoreHorizontal} />}
  items={[
    {
      type: 'item',
      label: '编辑',
      icon: Edit,
      onClick: handleEdit,
    },
    { type: 'separator' },
    {
      type: 'item',
      label: '删除',
      icon: Trash,
      onClick: handleDelete,
      className: 'text-destructive',
    },
  ]}
/>
```

## 优势

1. **减少代码重复**：从 ~30 行减少到 ~15 行
2. **类型安全**：完整的 TypeScript 类型检查
3. **一致性**：统一的组件接口和样式
4. **可维护性**：集中的组件逻辑，易于修改和扩展
5. **可读性**：声明式的配置方式，代码更清晰
