# 图表颜色系统批量迁移指南

## 迁移步骤

### 1. 替换导入
```typescript
// 旧
import { CeramicColors } from "./ceramic-colors"

// 新
import { ChartColorsRaw } from "./chart-colors"
import { ChartDefaults } from "./chart-config"
import { ChartContainer } from "./chart-container"
```

### 2. 替换颜色使用

#### CeramicColors.primary → ChartColorsRaw.series.primary
#### CeramicColors.secondary → ChartColorsRaw.series.secondary
#### CeramicColors.tertiary → ChartColorsRaw.series.tertiary
#### CeramicColors.success → ChartColorsRaw.semantic.success
#### CeramicColors.danger → ChartColorsRaw.semantic.danger
#### CeramicColors.dark → ChartColorsRaw.ui.text.primary
#### CeramicColors.text.secondary → ChartColorsRaw.ui.text.secondary
#### CeramicColors.text.muted → ChartColorsRaw.ui.text.muted

### 3. 添加 ChartContainer 包装

```tsx
// 旧
<div className="h-[200px] w-full">
  <ResponsiveContainer>...</ResponsiveContainer>
</div>

// 新
<ChartContainer title={title} subtitle={subtitle} height={200}>
  <ResponsiveContainer>...</ResponsiveContainer>
</ChartContainer>
```

### 4. 替换硬编码颜色

所有硬编码的颜色值（如 `#10b981`, `#f97316` 等）都应该替换为 `ChartColorsRaw` 中的对应值。

## 待迁移文件列表

- [ ] combination-chart.tsx
- [ ] dupont-breakdown.tsx
- [ ] break-even-chart.tsx
- [ ] inventory-turnover-chart.tsx
- [ ] sales-velocity-chart.tsx
- [ ] rule-of-40-chart.tsx
- [ ] ndr-bridge-chart.tsx
- [ ] unit-economics-chart.tsx
- [ ] waterfall-chart.tsx
- [ ] stacked-bar-chart.tsx
- [ ] trend-chart.tsx
- [ ] strategy-roadmap.tsx
- [ ] tornado-chart.tsx
- [ ] whale-curve-chart.tsx
- [ ] cac-payback-chart.tsx
- [ ] value-chain-chart.tsx
- [ ] funnel-chart.tsx
- [ ] valuation-football-field.tsx
- [ ] burn-rate-chart.tsx
- [ ] valuation-chart.tsx
- [ ] tech-adoption-curve.tsx
- [ ] credit-gauge.tsx
- [ ] scenario-fan-chart.tsx
- [ ] scatter-chart.tsx

