# Future Lens 图表颜色系统使用指南

## 概述

Future Lens 图表颜色系统是一个统一的、低饱和度的、现代化的颜色系统，符合极简、毛玻璃设计思维。所有图表组件必须使用此颜色系统，不再使用硬编码颜色值或旧的 `CeramicColors`。

## 设计理念

- **低饱和度**：所有颜色都经过精心挑选，符合现代化、极简设计
- **语义化**：颜色具有明确的语义含义
- **深色模式适配**：自动适配浅色/深色模式
- **统一规范**：所有图表统一使用此颜色系统

## 颜色分类

### 1. 语义化颜色（Semantic Colors）

用于表达数据含义，自动适配深色模式：

```typescript
import { ChartColors } from '@/components/future-lens/charts/chart-colors'

// 成功/增长/正面数据 - 低饱和度绿色
ChartColors.semantic.success

// 危险/下降/负面数据 - 低饱和度红色
ChartColors.semantic.danger

// 警告/注意 - 低饱和度橙色
ChartColors.semantic.warning

// 信息/中性 - 低饱和度蓝色
ChartColors.semantic.info
```

**使用场景：**
- `success`: 增长趋势、达成目标、正向指标
- `danger`: 下降趋势、未达标、风险指标
- `warning`: 需要关注但不紧急的情况
- `info`: 中性数据、参考线、辅助信息

### 2. 数据系列颜色（Data Series Colors）

用于多系列图表，按优先级顺序使用：

```typescript
// 主系列 - 低饱和度橙色
ChartColors.series.primary

// 次系列 - 低饱和度蓝色
ChartColors.series.secondary

// 第三系列 - 低饱和度紫色
ChartColors.series.tertiary

// 第四系列 - 低饱和度绿色
ChartColors.series.quaternary

// 第五系列 - 低饱和度琥珀色
ChartColors.series.quinary
```

**使用场景：**
- 多系列图表（折线图、柱状图等）
- 按优先级顺序使用：`primary` → `secondary` → `tertiary` → `quaternary` → `quinary`
- 最多支持 5 个系列，超出使用循环

### 3. 特殊场景颜色（Context Colors）

用于特定业务场景，固定颜色值保证可读性：

```typescript
// 增长相关数据 - 低饱和度绿色
ChartColors.context.growth

// 资本相关数据 - 低饱和度靛蓝
ChartColors.context.capital

// 热度相关数据 - 低饱和度粉红
ChartColors.context.heat
```

**使用场景：**
- `growth`: 增长指标（如 ScrollableMomentumChart 的"增长"）
- `capital`: 资本相关数据（如 ScrollableMomentumChart 的"资本"）
- `heat`: 热度相关数据（如 ScrollableMomentumChart 的"热度"）

### 4. UI 元素颜色（UI Element Colors）

用于图表中的 UI 元素，自动适配深色模式：

```typescript
// 网格线颜色
ChartColors.ui.grid

// 坐标轴颜色
ChartColors.ui.axis

// 文字颜色
ChartColors.ui.text.primary
ChartColors.ui.text.secondary
ChartColors.ui.text.muted

// 背景颜色
ChartColors.ui.background
```

## 原始颜色值（ChartColorsRaw）

对于需要固定颜色值的场景（如 SVG 渐变），使用 `ChartColorsRaw`：

```typescript
import { ChartColorsRaw } from '@/components/future-lens/charts/chart-colors'

// 用于 SVG 渐变、硬编码场景
<linearGradient>
  <stop stopColor={ChartColorsRaw.series.primary} />
</linearGradient>
```

## 使用示例

### 示例 1：单系列图表（增长数据）

```tsx
import { ChartColors, ChartColorsRaw } from '@/components/future-lens/charts/chart-colors'

<Area
  type="monotone"
  dataKey="growth"
  stroke={ChartColorsRaw.semantic.success}  // 使用原始值用于 stroke
  fill="url(#growthGradient)"
/>

<defs>
  <linearGradient id="growthGradient">
    <stop stopColor={ChartColorsRaw.semantic.success} stopOpacity={0.2} />
    <stop stopColor={ChartColorsRaw.semantic.success} stopOpacity={0} />
  </linearGradient>
</defs>
```

### 示例 2：多系列图表

```tsx
<Line stroke={ChartColorsRaw.series.primary} dataKey="series1" />
<Line stroke={ChartColorsRaw.series.secondary} dataKey="series2" />
<Line stroke={ChartColorsRaw.series.tertiary} dataKey="series3" />
```

### 示例 3：特殊场景（ScrollableMomentumChart）

```tsx
// 增长
<Area stroke={ChartColorsRaw.context.growth} dataKey="growth" />

// 资本
<Area stroke={ChartColorsRaw.context.capital} dataKey="cap" />

// 热度
<Line stroke={ChartColorsRaw.context.heat} dataKey="heat" />
```

### 示例 4：UI 元素

```tsx
<CartesianGrid stroke={ChartColors.ui.grid} />
<XAxis tick={{ fill: ChartColors.ui.text.secondary }} />
```

## 迁移指南

### 从硬编码颜色迁移

**之前：**
```tsx
<Area stroke="#10b981" />
```

**之后：**
```tsx
import { ChartColorsRaw } from '@/components/future-lens/charts/chart-colors'
<Area stroke={ChartColorsRaw.semantic.success} />
```

### 从 CeramicColors 迁移

**之前：**
```tsx
import { CeramicColors } from './ceramic-colors'
<Area stroke={CeramicColors.primary} />
```

**之后：**
```tsx
import { ChartColorsRaw } from '@/components/future-lens/charts/chart-colors'
<Area stroke={ChartColorsRaw.series.primary} />
```

## 颜色值参考

### 语义化颜色
- `success`: `#10b981` (Emerald 500)
- `danger`: `#ef4444` (Red 500)
- `warning`: `#f59e0b` (Amber 500)
- `info`: `#3b82f6` (Blue 500)

### 数据系列颜色
- `primary`: `#f97316` (Orange 500)
- `secondary`: `#3b82f6` (Blue 500)
- `tertiary`: `#8b5cf6` (Violet 500)
- `quaternary`: `#10b981` (Emerald 500)
- `quinary`: `#f59e0b` (Amber 500)

### 特殊场景颜色
- `growth`: `#10b981` (Emerald 500)
- `capital`: `#6366f1` (Indigo 500)
- `heat`: `#ec4899` (Pink 500)

## 注意事项

1. **不要使用硬编码颜色值**：所有颜色必须通过 `ChartColors` 或 `ChartColorsRaw` 获取
2. **SVG 渐变使用原始值**：SVG 渐变需要使用 `ChartColorsRaw` 中的原始值
3. **CSS 变量用于样式**：UI 元素颜色使用 `ChartColors.ui.*`，它们会自动适配深色模式
4. **数据颜色保持固定**：数据系列颜色和特殊场景颜色在浅色/深色模式下保持一致，保证可读性
5. **语义化优先**：优先使用语义化颜色（`semantic.*`），只有在多系列图表时才使用 `series.*`

## 已迁移的组件

- ✅ `ScrollableMomentumChart`
- ✅ `PeJCurveChart`
- ✅ `BulletChart`
- ✅ `PriceValueMatrix`
- ✅ `TamSamSomChart`
- ✅ `ChartEffects`

## 待迁移的组件

所有其他图表组件需要逐步迁移到新的颜色系统。迁移时请参考本文档的使用指南。

