# 组件展示规范

## 概述

所有新增的**公用组件**（`ds/`）和**数据图表组件**（`charts/`）都必须在对应的展示页面中展示出来，便于查看和使用。

## 展示页面

### 1. 设计系统展示页面
- **文件**：`components/future-lens/views/design-system-gallery.tsx`
- **用途**：展示所有 `ds/` 目录下的设计系统组件
- **分类**：
  - `containers`：容器组件（CardBase, GlassPanel等）
  - `basics`：基础组件（ActionButton, PlayerList, StickyTabs等）
  - `inputs`：输入组件（TextInput, Select, DatePicker等）
  - `navigation`：导航组件（FloatingDock等）
  - `feedback`：反馈组件（ModalDialog等）
  - `layout`：布局组件（ScrollHeader等）
  - `ai`：AI交互组件（ChatInput, MessageBubble等）

### 2. 数据图表展示页面
- **文件**：`components/future-lens/views/charts-registry-view.tsx`
- **用途**：展示所有 `charts/` 目录下的图表组件
- **分类**：通过 `charts/registry.json` 自动分类

## 添加新组件的步骤

### 步骤1：创建组件
在 `ds/` 或 `charts/` 目录下创建新组件。

### 步骤2：添加到展示页面

#### 如果是设计系统组件（`ds/`）：
1. 在 `design-system-gallery.tsx` 中导入组件
2. 在对应的分类中添加预览示例
3. 添加描述和使用说明

#### 如果是图表组件（`charts/`）：
1. 在 `charts/registry.json` 中添加组件信息
2. 在 `charts-registry-view.tsx` 的 `chartComponents` 中添加懒加载
3. 确保组件有 JSDoc 示例

### 步骤3：统一导出
在 `components/future-lens/index.ts` 中导出新组件。

## 示例

### 添加设计系统组件（PlayerList）

```tsx
// 1. 导入
import { PlayerList } from "../ds/player-list"

// 2. 在 "basics" 分类中添加预览
<div className="space-y-2">
  <Label>Player List (企业/玩家列表)</Label>
  <CardBase className={`${DesignTokens.layout.cardPadding}`}>
    <p className="text-sm text-slate-500 mb-4">
      用于展示多个企业/玩家的排名、影响力等信息。
    </p>
    <PlayerList
      players={[
        { name: "OpenAI", value: 98, type: "Brain", color: "bg-success" },
        { name: "Tesla", value: 92, type: "System", color: "bg-foreground" }
      ]}
    />
  </CardBase>
</div>
```

### 添加图表组件

```json
// charts/registry.json
{
  "id": "my-new-chart",
  "name": "My New Chart",
  "category": "trend",
  "description": "描述",
  "componentName": "MyNewChart"
}
```

```tsx
// charts-registry-view.tsx
const chartComponents: Record<string, LazyChartComponent> = {
  // ...
  MyNewChart: lazy(() => import("../charts/my-new-chart").then((m) => ({ default: m.MyNewChart }))),
}
```

## 检查清单

新增组件后，确保：
- [ ] 组件已创建
- [ ] 已添加到对应的展示页面
- [ ] 已添加到统一导出（`index.ts`）
- [ ] 有 JSDoc 示例（图表组件）
- [ ] 有使用说明（设计系统组件）

## 注意事项

1. **不要遗漏**：新增组件必须同时添加到展示页面
2. **保持更新**：如果组件接口变化，记得更新展示示例
3. **轻量化**：展示示例要简洁，不要过度复杂

