# AI 动态卡片系统设计讨论

> 目标：让 AI 根据任务和事件内容，自动决定卡片数量、种类，甚至创建新卡片类型

---

## 🎯 核心需求

### 用户需求
1. **每个任务的卡片数量和种类都不一样**
   - 任务A可能需要：监控范围、统计、趋势（3张）
   - 任务B可能需要：监控范围、统计、趋势、规则、洞察（5张）
   - 任务C可能需要：监控范围、统计（2张）

2. **每个事件的卡片数量和种类也不一样**
   - 事件A可能需要：13张卡片（当前竞品事件）
   - 事件B可能需要：8张卡片（简单事件）
   - 事件C可能需要：20张卡片（复杂事件）

3. **可能还需要根据任务需求新写卡片**
   - AI 分析内容后，发现需要新的卡片类型
   - 例如：需要"竞品价格对比卡"、"市场情绪分析卡"等

4. **AI 根据内容自动决定**
   - AI 分析任务/事件内容
   - AI 决定需要哪些卡片
   - AI 决定卡片数量
   - AI 决定卡片顺序
   - AI 可能创建新卡片类型

---

## 📊 当前架构分析

### ✅ 当前架构的优势

1. **配置驱动**
   ```json
   {
     "cardIds": ["event-header-001", "event-quick-read-001", ...]
   }
   ```
   - ✅ 卡片顺序由配置决定
   - ✅ 卡片数量由配置决定
   - ✅ 易于 AI 生成配置

2. **卡片注册系统**
   ```typescript
   registerCard("EventHeaderCard", EventHeaderCard)
   ```
   - ✅ 支持动态注册
   - ✅ 支持运行时查找

3. **卡片工厂模式**
   ```typescript
   <CardFactory data={cardInstance} />
   ```
   - ✅ 统一渲染接口
   - ✅ 支持未知卡片类型（降级到默认卡片）

### ⚠️ 当前架构的限制

1. **卡片类型硬编码**
   ```typescript
   export type CardTemplateId =
     | "event-header"
     | "event-core-insight"
     | ...
   ```
   - ❌ 类型系统限制，无法动态扩展
   - ❌ AI 无法创建新类型（TypeScript 编译时检查）

2. **卡片组件硬编码**
   ```typescript
   // card-registry-init.ts
   registerCard("EventHeaderCard", EventHeaderCard)
   ```
   - ❌ 新卡片需要手动注册
   - ❌ 新卡片需要手动创建组件

3. **配置验证**
   - ❌ 如果 AI 生成不存在的 `templateId`，会降级到默认卡片
   - ❌ 没有验证机制

---

## 🚀 解决方案设计

### 方案1：完全动态类型系统（推荐）

#### 核心思路
- **移除硬编码的 CardTemplateId 类型**
- **使用字符串类型，运行时验证**
- **支持 AI 生成任意卡片类型**

#### 实现方式

**1. 类型系统改造**
```typescript
// ❌ 当前（硬编码）
export type CardTemplateId = "event-header" | "event-core-insight" | ...

// ✅ 改造后（动态）
export type CardTemplateId = string  // 任意字符串，AI 可以生成
```

**2. 卡片注册系统增强**
```typescript
// 支持运行时动态注册
export function registerCard(
  templateId: string,  // 任意字符串
  component: CardComponent
): void {
  cardRegistry[templateId] = component
}

// AI 可以生成新的 templateId
// 例如："event-competitor-price-comparison-001"
```

**3. 卡片组件生成**
```typescript
// 方案A：AI 生成组件代码（需要编译）
// 方案B：使用通用卡片组件 + 配置驱动（推荐）

// 通用卡片组件
export function GenericCard({ data, config }: { 
  data: any, 
  config: CardConfig 
}) {
  // 根据 config 动态渲染
  // config 包含：布局、字段映射、样式等
}
```

**4. AI 生成流程**
```
1. AI 分析任务/事件内容
2. AI 决定需要的卡片类型和数量
3. AI 生成配置：
   {
     "cardIds": [
       "event-header-001",
       "event-competitor-price-comparison-001",  // 新类型
       "event-market-sentiment-001"  // 新类型
     ]
   }
4. AI 生成卡片数据：
   {
     "id": "event-competitor-price-comparison-001",
     "templateId": "event-competitor-price-comparison",  // 新类型
     "componentName": "GenericCard",  // 使用通用组件
     "data": { ... },
     "config": {  // 卡片配置
       "layout": "comparison",
       "fields": ["competitor", "price", "trend"],
       "chart": "bar-chart"
     }
   }
```

#### 优势
- ✅ 完全动态，AI 可以生成任意卡片类型
- ✅ 不需要修改 TypeScript 类型定义
- ✅ 不需要手动创建组件（使用通用组件）
- ✅ 配置驱动，易于 AI 生成

#### 挑战
- ⚠️ 需要通用卡片组件（支持多种布局）
- ⚠️ 需要卡片配置系统（定义布局、字段映射）
- ⚠️ 需要验证机制（确保配置有效）

---

### 方案2：卡片模板系统（备选）

#### 核心思路
- **预定义卡片模板库**
- **AI 从模板库中选择**
- **支持模板组合和定制**

#### 实现方式

**1. 卡片模板库**
```typescript
// 定义卡片模板
interface CardTemplate {
  id: string
  name: string
  description: string
  category: string[]
  requiredFields: string[]
  optionalFields: string[]
  defaultLayout: string
  supportedCharts: string[]
}

// 模板库
const cardTemplates: CardTemplate[] = [
  {
    id: "comparison",
    name: "对比分析卡",
    description: "用于对比多个实体的数据",
    category: ["event", "task"],
    requiredFields: ["entities", "metrics"],
    optionalFields: ["chart", "insights"],
    defaultLayout: "comparison",
    supportedCharts: ["bar-chart", "line-chart"]
  },
  // ... 更多模板
]
```

**2. AI 选择模板**
```
1. AI 分析内容
2. AI 从模板库中选择合适的模板
3. AI 生成卡片数据（填充模板字段）
```

#### 优势
- ✅ 有模板约束，质量更可控
- ✅ 不需要通用组件（使用模板对应的组件）
- ✅ 易于验证（模板定义清晰）

#### 挑战
- ⚠️ 模板库需要维护
- ⚠️ 如果 AI 需要新模板，还是需要手动创建
- ⚠️ 灵活性较低

---

## 🎨 推荐方案：混合方案

### 核心设计

**1. 三层卡片系统**
```
Layer 1: 预定义卡片（高性能、特定功能）
  - EventHeaderCard
  - EventCoreInsightCard
  - ...

Layer 2: 通用卡片（灵活、配置驱动）
  - GenericCard（支持多种布局）
  - ChartCard（支持多种图表）
  - TextCard（支持多种文本布局）

Layer 3: AI 生成卡片（完全动态）
  - AI 可以生成任意 templateId
  - 使用通用卡片组件渲染
  - 通过配置定义布局和字段
```

**2. AI 决策流程**
```
1. AI 分析任务/事件内容
2. AI 决定卡片策略：
   - 优先使用预定义卡片（如果匹配）
   - 其次使用通用卡片（如果匹配）
   - 最后创建新卡片（使用通用卡片 + 配置）
3. AI 生成配置和数据
```

**3. 卡片配置系统**
```typescript
interface CardConfig {
  layout: "comparison" | "list" | "grid" | "chart" | "text" | "custom"
  fields: {
    [key: string]: {
      type: "text" | "number" | "chart" | "list" | "custom"
      label: string
      position: string
      style?: any
    }
  }
  chart?: {
    type: "bar" | "line" | "pie" | "radar" | "custom"
    data: any
  }
  style?: {
    theme?: "default" | "highlight" | "warning" | "success"
    size?: "small" | "medium" | "large"
  }
}
```

---

## 📋 实施步骤

### Phase 1: 类型系统改造（低风险）
1. 将 `CardTemplateId` 改为 `string` 类型
2. 移除硬编码的类型检查
3. 添加运行时验证

### Phase 2: 通用卡片组件（中风险）
1. 创建 `GenericCard` 组件
2. 支持多种布局（comparison, list, grid, chart, text）
3. 支持配置驱动

### Phase 3: 卡片配置系统（中风险）
1. 定义 `CardConfig` 接口
2. 实现配置解析和验证
3. 实现配置到组件的映射

### Phase 4: AI 集成（高风险）
1. AI 决策逻辑（选择卡片类型）
2. AI 生成配置和数据
3. AI 创建新卡片类型

---

## ⚠️ 风险评估

### 技术风险
- **低风险**：类型系统改造（只是类型定义）
- **中风险**：通用卡片组件（需要设计好）
- **高风险**：AI 集成（需要测试和验证）

### 功能风险
- **低风险**：现有卡片继续工作（向后兼容）
- **中风险**：新卡片可能渲染不正确（需要降级处理）
- **高风险**：AI 生成错误配置（需要验证机制）

---

## 🎯 建议

### 立即执行（Phase 1）
- ✅ 类型系统改造（低风险，不影响现有功能）
- ✅ 添加运行时验证（提升安全性）

### 短期规划（Phase 2-3）
- ⏸️ 通用卡片组件（需要设计）
- ⏸️ 卡片配置系统（需要设计）

### 长期规划（Phase 4）
- ⏸️ AI 集成（需要 AI 能力）

---

## 💡 关键问题

### Q1: AI 如何知道有哪些卡片类型？
**A**: 
- 提供卡片类型文档（AI 可读取）
- 提供卡片模板库（AI 可查询）
- AI 可以生成新类型（使用通用组件）

### Q2: 如果 AI 生成不存在的卡片类型怎么办？
**A**: 
- 降级到通用卡片组件
- 如果通用卡片也无法渲染，降级到默认卡片
- 记录错误日志，用于优化

### Q3: 如何保证 AI 生成的卡片质量？
**A**: 
- 配置验证（确保配置有效）
- 降级机制（确保总能渲染）
- 用户反馈（AI 学习优化）

---

## 📝 总结

### 可行性
- ✅ **完全可行**：当前架构已经支持大部分需求
- ✅ **需要改造**：类型系统和通用卡片组件
- ✅ **AI 友好**：配置驱动，易于 AI 生成

### 建议
1. **先改造类型系统**（低风险，立即执行）
2. **再设计通用卡片组件**（中风险，需要设计）
3. **最后集成 AI**（高风险，需要测试）

### 原则
- ✅ 保持轻量化
- ✅ 配置驱动
- ✅ 向后兼容
- ✅ 降级处理

