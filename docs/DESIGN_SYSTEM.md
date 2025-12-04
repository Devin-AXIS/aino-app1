# Future Lens 设计系统规范

## 核心原则

本项目采用"反向映射"策略，将 v0 (shadcn/ui) 的语义化变量**精确映射**到我们自定义的设计风格上。这样既能保持独特的视觉效果，又能享受 v0 设计系统的主题切换能力。

**重要：所有开发必须同时遵守 Future Lens 设计规范和 v0 设计系统规范。**

---

## 🎨 颜色使用规范

### ✅ 正确做法：使用语义化 Token

\`\`\`tsx
// ✅ 好的示例
<div className="bg-background text-foreground">
<div className="bg-muted text-muted-foreground">
<div className="border-border">
<button className="bg-primary text-primary-foreground">
<span className="text-destructive">风险</span>
<span className="text-success">机会</span>
\`\`\`

### ❌ 错误做法：硬编码颜色

\`\`\`tsx
// ❌ 不要这样做
<div className="bg-[#F8F9FB]">
<div className="bg-slate-100 text-slate-500">
<div className="border-slate-200">
<button className="bg-slate-900 text-white">
<span className="text-rose-500">风险</span>
<span className="text-emerald-500">机会</span>
\`\`\`

---

## 📐 排版系统规范

### 使用 DesignTokens.typography

**必须使用统一的排版 Token，禁止随意设置字体样式。**

\`\`\`tsx
import { DesignTokens } from '@/lib/future-lens/design-tokens'

// ✅ 正确：使用统一的排版 Token
<h1 className={DesignTokens.typography.title}>标题</h1>
<h2 className={DesignTokens.typography.subtitle}>副标题</h2>
<p className={DesignTokens.typography.body}>正文内容</p>
<span className={DesignTokens.typography.caption}>说明文字</span>
<button className={DesignTokens.typography.button}>按钮文字</button>

// ❌ 错误：随意设置字体样式
<h1 className="text-2xl font-bold">标题</h1>
<p className="text-base leading-6">正文</p>
\`\`\`

### 排版层级定义

| Token | 字号 | 字重 | 行高 | 字间距 | 用途 |
|-------|------|------|------|--------|------|
| `title` | 继承 | `font-bold` | `leading-snug` | `tracking-tight` | 卡片标题、页面标题 |
| `subtitle` | 继承 | `font-normal` | `leading-relaxed` | `tracking-normal` | 副标题、次要标题 |
| `body` | 继承 | 继承 | `leading-relaxed` | `tracking-normal` | 正文、描述文字 |
| `caption` | 继承 | `font-medium` | 继承 | `tracking-wide` | 标签、说明文字 |
| `button` | 继承 | `font-medium` | 继承 | `tracking-normal` | 按钮文字 |

**注意：字号由全局 `textScale` 动态控制，不在 Token 中硬编码。**

---

## 📋 完整 Token 映射表

### 基础颜色

| 语义 Token | 实际颜色 (Light) | 用途 |
|-----------|-----------------|------|
| `background` | `#f8f9fb` (Slate 50) | 应用底色 |
| `foreground` | `#0f172a` (Slate 900) | 主要文字 |
| `card` | `#ffffff` (White) | 卡片背景 |
| `card-foreground` | `#0f172a` | 卡片文字 |
| `muted` | `#f1f5f9` (Slate 100) | 次级背景/气泡 |
| `muted-foreground` | `#64748b` (Slate 500) | 次级文字 |
| `border` | `#e2e8f0` (Slate 200) | 边框 |
| `primary` | `#0f172a` (Slate 900) | 主要按钮/强调 |
| `primary-foreground` | `#ffffff` | 主要按钮文字 |
| `secondary` | `#f1f5f9` (Slate 100) | 次级按钮 |
| `secondary-foreground` | `#0f172a` | 次级按钮文字 |

### 状态颜色

| 语义 Token | 实际颜色 (Light) | 用途 |
|-----------|-----------------|------|
| `destructive` | `#ef4444` (Rose 500) | 危险/风险/删除 |
| `destructive-foreground` | `#ffffff` | 危险按钮文字 |
| `success` | `#10b981` (Emerald 500) | 成功/机会 |
| `success-foreground` | `#ffffff` | 成功按钮文字 |
| `warning` | `#f59e0b` (Amber 500) | 警告 |
| `warning-foreground` | `#ffffff` | 警告文字 |

### 透明度使用

\`\`\`tsx
// ✅ 推荐：使用透明度修饰符
<div className="bg-muted/50">       // 50% 透明度
<div className="bg-success/10">     // 10% 透明度（浅色背景）
<div className="text-destructive/80"> // 80% 不透明度
\`\`\`

---

## 🔧 组件开发规范

### 1. 新建组件时

\`\`\`tsx
import { DesignTokens } from '@/lib/future-lens/design-tokens'

// ✅ 从一开始就使用语义化 Token 和排版系统
export function MyNewComponent() {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <h3 className={DesignTokens.typography.title}>标题</h3>
      <p className={DesignTokens.typography.body}>正文内容</p>
      <span className={DesignTokens.typography.caption}>说明文字</span>
    </div>
  )
}
\`\`\`

### 2. 状态颜色

\`\`\`tsx
// ✅ 使用语义状态
const statusColors = {
  success: "text-success bg-success/10",
  warning: "text-warning bg-warning/10",
  error: "text-destructive bg-destructive/10",
}

// ❌ 不要硬编码
const statusColors = {
  success: "text-emerald-500 bg-emerald-50",
  warning: "text-amber-500 bg-amber-50",
  error: "text-rose-500 bg-rose-50",
}
\`\`\`

### 3. 边框与圆角

\`\`\`tsx
// ✅ 使用系统圆角（基于 --radius: 0.75rem）
<div className="rounded-xl">  // 16px (12px + 4px)
<div className="rounded-lg">  // 14px (12px + 2px)
<div className="rounded-md">  // 12px (基础 --radius)

// ✅ 边框使用语义变量
<div className="border border-border">
<div className="divide-y divide-border">
\`\`\`

### 4. 字间距（Letter Spacing）

\`\`\`tsx
// ✅ 使用 DesignTokens 中定义的 tracking
<h1 className={DesignTokens.typography.title}>  // tracking-tight
<p className={DesignTokens.typography.body}>    // tracking-normal
<span className={DesignTokens.typography.caption}>  // tracking-wide

// ❌ 不要随意设置
<h1 className="tracking-tighter">
<p className="tracking-wide">
\`\`\`

---

## 🎭 主题扩展能力

由于使用了语义化 Token，您现在可以轻松实现：

### 深色模式

`globals.css` 中已定义深色模式变量，所有组件会自动适配。

### 品牌主题

如果未来想换配色方案，只需修改 `globals.css` 中的变量值，全站生效。

---

## ✅ Code Review 清单

在提交代码前，请检查：

### 颜色
- [ ] 是否使用了 `bg-background` 而不是 `bg-[#F8F9FB]`？
- [ ] 是否使用了 `text-foreground` 而不是 `text-slate-900`？
- [ ] 是否使用了 `border-border` 而不是 `border-slate-200`？
- [ ] 状态颜色是否使用了 `text-destructive/success/warning`？
- [ ] 透明度是否使用了 `/50` `/10` 等修饰符？

### 排版
- [ ] 标题是否使用了 `DesignTokens.typography.title`？
- [ ] 正文是否使用了 `DesignTokens.typography.body`？
- [ ] 说明文字是否使用了 `DesignTokens.typography.caption`？
- [ ] 按钮文字是否使用了 `DesignTokens.typography.button`？
- [ ] 是否避免了随意设置 `text-xl`、`font-bold` 等样式？

### 圆角与间距
- [ ] 是否使用了 `rounded-xl/lg/md` 而不是 `rounded-[16px]`？
- [ ] 字间距是否通过 DesignTokens 统一管理？

---

## 🚀 快速参考

### 常用组合

\`\`\`tsx
// 卡片容器
className="bg-card border border-border rounded-xl p-4"

// 次级背景区域
className="bg-muted/50 rounded-lg p-3"

// 标题
className={DesignTokens.typography.title}

// 正文
className={DesignTokens.typography.body}

// 说明文字
className={DesignTokens.typography.caption}

// 成功状态
className="text-success bg-success/10 border-success/20"

// 危险状态
className="text-destructive bg-destructive/10 border-destructive/20"

// 主要按钮
className="bg-primary text-primary-foreground hover:bg-primary/90"

// 次级按钮
className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
\`\`\`

---

## 📞 需要帮助？

如果遇到不确定的情况：

1. 参考 `components/future-lens/` 中已有组件的实现
2. 查看 `lib/future-lens/design-tokens.tsx` 中的 Token 定义
3. 查看 `app/globals.css` 中的变量定义
4. 遵循"先语义化，再特殊化"的原则

**记住：视觉保持不变，但代码要规范！同时遵守 Future Lens 和 v0 的设计系统规范。**

---

## 📁 文件夹组织规范

### 核心原则

**禁止随意创建新文件夹。** 新增文件夹必须有充分理由，且需要满足以下条件之一。

### 现有文件夹结构

\`\`\`
components/future-lens/
├── ai/              - AI 交互相关（聊天、消息气泡）
├── auth/            - 认证相关（登录、验证码）
├── cards/           - 卡片系统（洞察卡片、工厂模式）
├── ds/              - 设计系统（基础 UI 组件库）
├── layout/          - 布局外壳（页面容器、顶部栏）
├── nav/             - 导航组件（底部导航栏）
├── ui/              - UI 原子组件（标签、图标）
└── views/           - 页面视图（所有业务页面及其子组件）
\`\`\`

### 文件放置规则

#### ✅ 正确做法

**1. 业务页面及其子组件 → `views/`**

\`\`\`tsx
// ✅ 页面主文件和相关组件都放在 views/
views/
├── invite-friends-view.tsx       // 主页面
├── invite-list-dialog.tsx        // 页面使用的对话框
├── invite-list-sheet.tsx         // 页面使用的底部弹窗
├── search-view.tsx               // 搜索页面
└── user-profile-view.tsx         // 用户资料页面
\`\`\`

**理由：** 页面的子组件和页面放在一起，便于查找和维护。

**2. 可复用的 UI 基础组件 → `ds/`**

\`\`\`tsx
// ✅ 通用 UI 组件放在 ds/
ds/
├── card-base.tsx          // 基础卡片
├── glass-panel.tsx        // 玻璃面板
├── action-button.tsx      // 操作按钮
├── modal-dialog.tsx       // 通用弹窗
└── text-input.tsx         // 文本输入框
\`\`\`

**理由：** 这些组件可以在多个页面复用，是设计系统的基础。

**3. 布局外壳组件 → `layout/`**

\`\`\`tsx
// ✅ 页面容器和布局组件放在 layout/
layout/
├── article-shell.tsx       // 文章页布局
├── settings-shell.tsx      // 设置页布局
├── scroll-header.tsx       // 滚动顶部栏
└── detail-view-shell.tsx   // 详情页外壳
\`\`\`

**理由：** 布局组件是页面的框架，单独管理。

#### ❌ 错误做法

**不要为单个功能创建独立文件夹**

\`\`\`tsx
// ❌ 错误：为邀请功能单独创建文件夹
components/future-lens/
├── invite/              // ❌ 只有 2 个组件，不需要
│   ├── invite-list-dialog.tsx
│   └── invite-list-sheet.tsx
└── ...

// ✅ 正确：放在 views/ 下
components/future-lens/
└── views/
    ├── invite-friends-view.tsx
    ├── invite-list-dialog.tsx
    └── invite-list-sheet.tsx
\`\`\`

### 什么时候可以创建新文件夹？

**必须同时满足以下条件：**

1. **组件数量 ≥ 5 个** - 少于 5 个组件不值得单独建文件夹
2. **功能独立且重要** - 是核心业务功能，不是次要功能
3. **组件高度相关** - 组件之间有强关联，形成一个子系统
4. **可能扩展** - 未来会继续增加更多相关组件

**示例：**

| 文件夹 | 组件数量 | 是否合理 | 理由 |
|--------|---------|---------|------|
| `ai/` | 5+ 个 | ✅ 合理 | AI 是核心功能，组件多，会持续扩展 |
| `cards/` | 8+ 个 | ✅ 合理 | 卡片系统是核心，有工厂模式，组件多 |
| `invite/` | 2 个 | ❌ 不合理 | 组件太少，不是核心功能 |

### AI 生成代码规范

**当 AI 需要新增页面或组件时：**

1. **先检查现有文件夹** - 看是否有合适的位置
2. **优先使用 `views/`** - 页面相关的都放这里
3. **不要随意创建新文件夹** - 除非满足上述 4 个条件
4. **记录理由** - 如果确实需要新文件夹，必须在代码注释中说明理由

**示例注释：**

\`\`\`tsx
/**
 * 新增文件夹: components/future-lens/analytics/
 * 
 * 理由:
 * 1. 包含 8 个分析相关组件（满足数量条件）
 * 2. 数据分析是核心功能（满足重要性条件）
 * 3. 组件高度相关，形成分析子系统（满足相关性条件）
 * 4. 未来会添加更多分析图表（满足扩展性条件）
 */
\`\`\`

### 重构指南

**如果发现组件放错位置：**

1. 评估影响范围（有多少文件引用了这个组件）
2. 移动文件到正确位置
3. 更新所有 import 路径
4. 测试所有受影响的页面
