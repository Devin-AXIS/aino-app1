# AI卡片系统设计文档

## 概述

本系统实现了AI友好的卡片推荐和生成机制，支持两种数据源：
- **API对接**：数据来自AINO后端，已有或可调用API获取
- **AI生成**：AI根据用户问题实时生成卡片数据

## 核心设计

### 1. 数据源分类

每个卡片都有 `dataSource` 标识：
- `"api"`: API对接的卡片（数据来自AINO）
- `"ai-generated"`: AI生成的卡片（AI实时生成）

### 2. 卡片模板配置

`lib/future-lens/config/card-template-config.ts` 定义了所有卡片模板的配置：
- 数据源类型
- API配置（endpoint、缓存时间等）
- AI生成配置（是否需要数据、数据查询提示）
- 搜索关键词（用于AI推荐匹配）

### 3. 报告卡片统一

报告也作为卡片类型（`templateId: "report-card"`），统一接口：
- 单个卡片：用于回答具体问题
- 报告卡片：用于全局分析场景

## 使用示例

### AI推荐卡片

```typescript
import { recommendCards } from "@/lib/future-lens/api/ai-card-recommendation-mock"

// 用户问题
const query = "人工智能产业的产业结构什么样子"

// AI推荐
const result = await recommendCards(query)

// 返回结果
{
  cards: [
    {
      cardId: "industry-stack-001",
      dataSource: "api",
      confidence: 0.85,
      reason: "匹配'产业结构'关键词，找到已有卡片"
    }
  ],
  reports: []
}
```

### 全局分析场景

```typescript
const query = "给我一个人工智能产业的全局分析"

const result = await recommendCards(query)

// 返回结果
{
  cards: [],
  reports: [
    {
      reportId: "ai-industry-report-v1",
      confidence: 0.9,
      reason: "用户询问全局分析，匹配'产业'关键词"
    }
  ]
}
```

### AI生成新卡片

```typescript
import { generateCard } from "@/lib/future-lens/api/ai-card-recommendation-mock"

// 如果推荐结果中 requiresGeneration: true
const newCard = await generateCard(
  "insight-compression",
  "这个公司的财务分析",
  { /* 可选：如果模板需要数据，先调用数据API */ }
)
```

## AI决策流程

```
用户问题
  ↓
AI分析意图（单个问题 vs 全局分析）
  ↓
如果是全局分析 → 推荐报告卡片
  ↓
如果是单个问题：
  ├─ 搜索匹配的卡片模板
  ├─ 判断数据源
  │   ├─ API对接：
  │   │   ├─ 搜索已有卡片（缓存）
  │   │   └─ 如果没有 → 调用数据API → 创建/更新卡片
  │   └─ AI生成：
  │       ├─ 需要数据 → 先查数据API → AI生成数据 → 创建卡片
  │       └─ 不需要数据 → AI直接生成 → 创建卡片
  ↓
返回卡片ID或报告ID
```

## 后端API规范

### 1. AI推荐接口

```
POST /api/ai/recommend-cards
Content-Type: application/json

{
  "query": "用户问题",
  "context": {
    "previousCards": ["card-id-1", "card-id-2"],
    "conversationHistory": ["..."]
  }
}

Response:
{
  "cards": [
    {
      "cardId": "industry-stack-001",
      "dataSource": "api",
      "confidence": 0.85,
      "reason": "..."
    }
  ],
  "reports": [
    {
      "reportId": "ai-industry-report-v1",
      "confidence": 0.9,
      "reason": "..."
    }
  ],
  "suggestedGeneration": {
    "templateId": "insight-compression",
    "dataSource": "ai-generated",
    "requiresData": true,
    "dataQuery": "..."
  }
}
```

### 2. 生成卡片接口

```
POST /api/cards/generate
Content-Type: application/json

{
  "templateId": "insight-compression",
  "query": "用户问题",
  "data": { /* 可选：如果模板需要数据 */ }
}

Response:
{
  "id": "insight-compression-1234567890",
  "templateId": "insight-compression",
  "componentName": "InsightCompressionCard",
  "dataSource": "ai-generated",
  "data": { /* 卡片数据 */ },
  "metadata": { /* 元数据 */ }
}
```

## 前端集成

### 在AI对话中渲染卡片

```tsx
import { CardRenderer } from "@/components/future-lens/ai-report/card-renderer"
import { getCard } from "@/lib/future-lens/api/card-api-mock"

// 获取推荐结果后
const card = await getCard(result.cards[0].cardId)

// 渲染卡片
<CardRenderer card={card} />
```

### 渲染报告卡片

```tsx
import { ReportCard } from "@/components/future-lens/ai-report/report-card"

// 报告卡片数据
const reportCard: CardInstance = {
  id: "report-card-001",
  templateId: "report-card",
  componentName: "ReportCard",
  dataSource: "api",
  data: {
    reportId: "ai-industry-report-v1",
    title: "AI产业报告",
    summary: "...",
    cardCount: 16
  },
  metadata: { /* ... */ }
}

// 渲染
<CardRenderer card={reportCard} />
```

## 卡片模板配置示例

```typescript
// API对接的卡片
"industry-stack": {
  templateId: "industry-stack",
  componentName: "IndustryStackCard",
  dataSource: "api",
  apiConfig: {
    endpoint: "/api/aino/industry-structure",
    cacheTTL: 3600,
    refreshStrategy: "auto",
  },
  searchKeywords: ["产业结构", "价值链", "产业分层"],
  description: "展示产业的层次结构",
}

// AI生成的卡片
"insight-compression": {
  templateId: "insight-compression",
  componentName: "InsightCompressionCard",
  dataSource: "ai-generated",
  aiConfig: {
    requiresData: true,
    dataQuery: "需要综合分析多个数据源，提取核心洞察",
  },
  searchKeywords: ["核心洞察", "总结", "关键发现"],
  description: "AI生成的核心洞察总结卡片",
}
```

## 优势

1. **AI友好**：语义化配置，AI易于理解和生成
2. **轻量化**：最小化改动，只扩展必要部分
3. **统一接口**：报告和卡片统一处理
4. **可扩展**：易于添加新模板和配置
5. **类型安全**：完整的TypeScript类型定义

