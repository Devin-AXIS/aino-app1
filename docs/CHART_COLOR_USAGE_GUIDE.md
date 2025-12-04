# Future Lens 图表颜色使用指南

## 概述

Future Lens 图表颜色系统基于统一调色板（VIDEOINFOGRAPHICA.COM/COLORS #17），包含**6个基础颜色**和**6个扩展颜色**，共**12个系列颜色**，完全覆盖所有使用场景。

## 调色板基础6色

| 颜色 | 色值 | 名称 | 主要用途 |
|------|------|------|----------|
| 🟦 | `#038DB2` | 亮蓝色 | 主系列、信息、收入 |
| 🟩 | `#45AAB4` | 青绿色 | 次系列、增长、成功 |
| 🔵 | `#206491` | 深蓝色 | 第三系列、资本、深度分析 |
| 🌸 | `#F9637C` | 粉红色 | 第四系列、危险、热度 |
| 🟠 | `#FE7A66` | 橙色 | 第五系列、利润、警告 |
| 🟨 | `#FBB45C` | 金黄色 | 第六系列、市场、高亮 |

## 颜色分类和使用场景

### 1. 语义化颜色（Semantic Colors）

用于表达数据含义，自动适配深色模式。

| 颜色 | 色值 | 使用场景 | 示例 |
|------|------|----------|------|
| `success` | `#45AAB4` | 增长趋势、达成目标、正向指标、盈利数据 | 营收增长曲线、用户增长柱状图、达成率指标 |
| `danger` | `#F9637C` | 下降趋势、未达标、风险指标、亏损数据 | 流失率趋势、风险预警、亏损数据 |
| `warning` | `#FBB45C` | 需要关注但不紧急、波动数据、待确认信息 | 波动指标、待审核数据、异常提醒 |
| `info` | `#038DB2` | 中性数据、参考线、辅助信息、基准值 | 参考线、基准值、辅助指标 |

**代码示例：**
```tsx
// 增长数据使用 success
<Area stroke={ChartColors.semantic.success} fill={ChartColors.semantic.success} />

// 下降数据使用 danger
<Line stroke={ChartColors.semantic.danger} />

// 警告数据使用 warning
<Bar fill={ChartColors.semantic.warning} />

// 参考线使用 info
<ReferenceLine stroke={ChartColors.semantic.info} />
```

### 2. 数据系列颜色（Data Series Colors）

用于多系列图表，按优先级顺序使用。包含**基础6色 + 扩展6色 = 12个系列**。

#### 基础6色（直接使用调色板）

| 系列 | 颜色 | 色值 | 使用场景 |
|------|------|------|----------|
| `primary` | 亮蓝色 | `#038DB2` | 最重要的数据系列（如：主要产品线、核心指标） |
| `secondary` | 青绿色 | `#45AAB4` | 次要数据系列（如：次要产品、对比数据） |
| `tertiary` | 深蓝色 | `#206491` | 第三重要系列（如：历史数据、参考系列） |
| `quaternary` | 粉红色 | `#F9637C` | 第四系列（如：预测数据、辅助指标） |
| `quinary` | 橙色 | `#FE7A66` | 第五系列（如：背景数据、次要对比） |
| `senary` | 金黄色 | `#FBB45C` | 第六系列（如：补充数据、额外维度） |

#### 扩展6色（基于基础颜色生成浅色变体）

| 系列 | 颜色 | 色值 | 使用场景 |
|------|------|------|----------|
| `septenary` | 亮蓝色浅色 | `#1AA8C2` | 第七系列（复杂多系列图表） |
| `octonary` | 青绿色浅色 | `#5DB8C4` | 第八系列（复杂多系列图表） |
| `nonary` | 深蓝色浅色 | `#3A7AA1` | 第九系列（复杂多系列图表） |
| `denary` | 粉红色浅色 | `#FF7A8C` | 第十系列（复杂多系列图表） |
| `undenary` | 橙色浅色 | `#FF9A86` | 第十一系列（复杂多系列图表） |
| `duodenary` | 金黄色浅色 | `#FFC966` | 第十二系列（复杂多系列图表） |

**使用原则：**
1. **按优先级顺序使用**：`primary` → `secondary` → `tertiary` → ...
2. **最多12个系列**：基础6色 + 扩展6色，支持复杂多系列图表
3. **循环使用**：超过12个系列时，从 `primary` 开始循环

**代码示例：**
```tsx
// 多系列折线图
<Line dataKey="revenue" stroke={ChartColors.series.primary} />      // 营收 - 主系列
<Line dataKey="cost" stroke={ChartColors.series.secondary} />       // 成本 - 次系列
<Line dataKey="profit" stroke={ChartColors.series.tertiary} />      // 利润 - 第三系列

// 复杂多系列图表（6+系列）
const colors = ChartDefaults.colors; // 包含12个颜色
data.map((item, index) => (
  <Bar key={index} fill={colors[index % colors.length]} />
))
```

### 3. 特殊场景颜色（Context Colors）

用于特定业务场景，复用系列颜色以保证一致性。

| 颜色 | 色值 | 使用场景 | 示例 |
|------|------|----------|------|
| `growth` | `#45AAB4` | 增长相关（营收增长、用户增长、市场扩张） | 增长趋势图、增长率指标 |
| `capital` | `#206491` | 资本相关（融资、估值、投资回报） | 融资轮次图、估值曲线 |
| `heat` | `#F9637C` | 热度相关（热门产品、趋势话题、活跃度） | 热门产品排行、趋势热度图 |
| `revenue` | `#038DB2` | 收入相关（营收、销售额、订阅收入） | 营收图表、销售额趋势 |
| `profit` | `#FE7A66` | 利润相关（净利润、毛利率、盈利能力） | 利润分析图、毛利率趋势 |
| `market` | `#FBB45C` | 市场相关（市场份额、竞争分析、市场定位） | 市场份额图、竞争分析 |

**代码示例：**
```tsx
// 增长场景
<Area fill={ChartColors.context.growth} />  // 增长数据

// 资本场景
<Bar fill={ChartColors.context.capital} />  // 融资数据

// 收入场景
<Line stroke={ChartColors.context.revenue} />  // 营收数据
```

## 完整颜色映射表

### 所有6个基础颜色都被使用

| 基础颜色 | 使用位置 | 说明 |
|----------|----------|------|
| `#038DB2` 亮蓝色 | `series.primary`<br>`semantic.info`<br>`context.revenue` | 主系列、信息、收入 |
| `#45AAB4` 青绿色 | `series.secondary`<br>`semantic.success`<br>`context.growth` | 次系列、成功、增长 |
| `#206491` 深蓝色 | `series.tertiary`<br>`context.capital` | 第三系列、资本 |
| `#F9637C` 粉红色 | `series.quaternary`<br>`semantic.danger`<br>`context.heat` | 第四系列、危险、热度 |
| `#FE7A66` 橙色 | `series.quinary`<br>`context.profit` | 第五系列、利润 |
| `#FBB45C` 金黄色 | `series.senary`<br>`semantic.warning`<br>`context.market` | 第六系列、警告、市场 |

## 最佳实践

### 1. 选择颜色类型

- **语义化颜色**：用于表达数据含义（增长/下降/警告/信息）
- **系列颜色**：用于多系列图表，按优先级顺序使用
- **场景颜色**：用于特定业务场景（增长/资本/收入等）

### 2. 多系列图表颜色分配

```tsx
// ✅ 正确：按优先级顺序使用
const series = [
  { name: "主要产品", color: ChartColors.series.primary },
  { name: "次要产品", color: ChartColors.series.secondary },
  { name: "历史数据", color: ChartColors.series.tertiary },
]

// ❌ 错误：跳过优先级
const series = [
  { name: "主要产品", color: ChartColors.series.primary },
  { name: "次要产品", color: ChartColors.series.tertiary }, // 跳过了 secondary
]
```

### 3. 语义化使用

```tsx
// ✅ 正确：使用语义化颜色表达含义
<Line stroke={ChartColors.semantic.success} />  // 增长数据
<Bar fill={ChartColors.semantic.danger} />      // 下降数据

// ❌ 错误：用系列颜色表达含义
<Line stroke={ChartColors.series.primary} />     // 不明确是增长还是下降
```

### 4. 场景颜色使用

```tsx
// ✅ 正确：使用场景颜色
<Area fill={ChartColors.context.growth} />       // 增长场景
<Bar fill={ChartColors.context.revenue} />      // 收入场景

// ❌ 错误：用系列颜色替代场景颜色
<Area fill={ChartColors.series.secondary} />    // 不明确是增长场景
```

## 总结

- ✅ **6个基础颜色全部使用**：每个颜色都有明确的用途
- ✅ **扩展到12个系列颜色**：支持复杂多系列图表
- ✅ **6个特殊场景颜色**：覆盖常见业务场景
- ✅ **4个语义化颜色**：表达数据含义
- ✅ **完整的使用场景说明**：每个颜色都有明确的使用指南

总共：**4个语义化 + 12个系列 + 6个场景 = 22个颜色定义**，完全覆盖所有图表使用场景。

