# Future Lens 布局组件

## 概述

这些布局组件（Shell）提供了统一的页面结构，确保所有页面在视觉和交互上保持一致。它们是对现有设计系统组件的封装和组合，不是替代品。

---

## ArticleShell - 文章/内容页布局

### 使用场景
- Insight 详情页
- 文章内容页
- 任何需要展示内容并带有分享、点赞功能的页面

### 核心功能
- 统一的顶部栏（带返回、标题、分享、点赞按钮）
- 统一的背景（自动支持深色模式）
- 统一的内容容器（使用 GlassPanel）
- 自动支持字体缩放
- 自动处理 iPhone 安全区域

### 使用示例

\`\`\`tsx
import { ArticleShell } from "@/components/future-lens/layouts/article-shell"

export function MyArticlePage() {
  return (
    <ArticleShell
      title="文章标题"
      onBack={() => history.back()}
      onShare={() => handleShare()}
      onLike={() => handleLike()}
      isLiked={false}
    >
      {/* 只需要写内容部分 */}
      <h2>文章正文标题</h2>
      <p>文章内容...</p>
    </ArticleShell>
  )
}
\`\`\`

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | string | - | 页面标题 |
| onBack | () => void | - | 返回按钮回调 |
| onShare | () => void | - | 分享按钮回调 |
| onLike | () => void | - | 点赞按钮回调 |
| showShare | boolean | true | 是否显示分享按钮 |
| showLike | boolean | true | 是否显示点赞按钮 |
| isLiked | boolean | false | 是否已点赞 |
| children | ReactNode | - | 内容区域 |

---

## SettingsShell - 设置/功能页布局

### 使用场景
- 用户设置页面
- 邀请好友页面
- 账号管理页面
- 任何功能列表类页面

### 核心功能
- 统一的顶部栏（带返回、标题）
- 统一的背景（自动支持深色模式）
- 统一的功能列表容器
- 配套的 SettingsItem 组件（功能列表项）
- 自动支持字体缩放
- 自动处理安全区域

### 使用示例

\`\`\`tsx
import { SettingsShell, SettingsItem } from "@/components/future-lens/layouts/settings-shell"
import { Bell, User, LogOut } from 'lucide-react'

export function MySettingsPage() {
  return (
    <SettingsShell
      title="设置"
      onBack={() => history.back()}
    >
      {/* 功能列表项 */}
      <SettingsItem
        icon={<Bell size={20} />}
        label="通知设置"
        description="管理推送通知"
        onClick={() => handleNotifications()}
      />
      
      <SettingsItem
        icon={<User size={20} />}
        label="账号管理"
        onClick={() => handleAccount()}
      />
      
      <SettingsItem
        icon={<LogOut size={20} />}
        label="退出登录"
        showArrow={false}
        onClick={() => handleLogout()}
      />
    </SettingsShell>
  )
}
\`\`\`

### SettingsShell Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | string | - | 页面标题 |
| onBack | () => void | - | 返回按钮回调 |
| actions | ReactNode | - | 顶部栏右侧操作 |
| children | ReactNode | - | 内容区域 |

### SettingsItem Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| icon | ReactNode | - | 图标 |
| label | string | - | 标签文字 |
| description | string | - | 描述文字 |
| rightContent | ReactNode | - | 右侧内容（如开关） |
| onClick | () => void | - | 点击回调 |
| showArrow | boolean | true | 是否显示右箭头 |

---

## 设计规范

### 所有布局组件都遵循以下规范：

1. **背景** - 使用 `DesignTokens.background.page`
2. **容器** - 使用 `GlassPanel` 或 `CardBase`
3. **颜色** - 所有颜色使用语义化 token（支持深色模式）
4. **字体** - 支持用户设置的字体缩放
5. **间距** - 使用统一的间距系统（p-4, gap-3 等）
6. **安全区域** - 自动处理 iPhone 刘海和 Home 条

### 禁止的写法

\`\`\`tsx
// ❌ 不要直接写背景色
<div className="bg-white">

// ❌ 不要硬编码颜色
<div className="bg-[#F8F9FB]">

// ❌ 不要跳过布局组件自己写顶部栏（容易不统一）
<div className="sticky top-0">
  <button>返回</button>
  <h1>标题</h1>
</div>

// ✅ 正确：使用布局组件
<ArticleShell title="标题" onBack={...}>
  {/* 内容 */}
</ArticleShell>
\`\`\`

---

## 与现有组件的关系

### 布局组件内部使用的现有组件：
- `ScrollHeader` - 顶部栏
- `GlassPanel` - 玻璃容器
- `DesignTokens` - 设计系统变量
- `useAppConfig` - 配置上下文（字体缩放等）

### 布局组件不会替代：
- `CardBase` - 仍然用于卡片列表项
- `ActionButton` - 仍然用于操作按钮
- `MobileShell` - 仍然是主应用外壳

---

## 何时使用布局组件

### 推荐使用（AI 新增页面时）
- 新增内容详情页 → 用 `ArticleShell`
- 新增设置/功能页 → 用 `SettingsShell`

### 可以不用（现有页面）
- 现有页面不需要改成用布局组件
- 如果现有页面结构特殊，也可以不用

### 不要使用
- 首页（已有 MobileShell）
- 弹窗/对话框（用 ModalDialog）
- 列表项/卡片（用 CardBase）

---

## 扩展

### 如果需要新的布局类型
1. 参考 ArticleShell 或 SettingsShell 的结构
2. 使用现有的设计系统组件
3. 遵循统一的设计规范
4. 添加到此目录并更新 README

### 示例：创建列表页布局
\`\`\`tsx
export function ListShell({ title, onBack, children }) {
  return (
    <div className={DesignTokens.background.page}>
      <ScrollHeader title={title} onBack={onBack} />
      <div className="p-4 space-y-3">
        {children}
      </div>
    </div>
  )
}
