# 卡片系统 API 规范

> **后端开发文档** - 本文档描述卡片系统的后端API接口规范，供AINO后端团队参考

## 概述

卡片系统采用**轻量化、AI友好、动态化**的设计原则：
- **报告配置**：只存储卡片ID引用，不存储完整数据
- **卡片实例**：独立存储，支持复用
- **扁平化数据**：便于AI生成和维护

## 数据模型

### 1. 卡片实例 (CardInstance)

```typescript
interface CardInstance {
  id: string                    // 卡片唯一ID，如 "industry-stack-001"
  templateId: CardTemplateId   // 卡片模板ID，如 "industry-stack"
  componentName: string        // 前端组件名称，如 "IndustryStackCard"
  data: Record<string, unknown>  // 卡片数据内容（扁平化，AI生成）
  metadata: {
    category: ReportCategory    // 所属报告类别
    tags: string[]            // 标签（便于搜索和分类）
    createdAt: string          // 创建时间（ISO 8601格式）
    updatedAt?: string         // 更新时间（可选）
  }
}
```

### 2. 报告配置 (ReportConfig)

```typescript
interface ReportConfig {
  id: string                    // 报告唯一ID，如 "ai-industry-report-v1"
  name: string                  // 报告名称
  category: ReportCategory      // 报告类别
  version: number               // 版本号
  tabs: Array<{
    id: string                  // 标签ID
    label: string               // 标签显示名称
    cardIds: string[]          // 卡片ID列表（只存ID，不存数据）
  }>
  metadata: {
    createdAt: string
    updatedAt: string
    totalCards: number
  }
}
```

### 3. 报告完整数据 (ReportWithCards)

```typescript
interface ReportWithCards extends ReportConfig {
  cards: CardInstance[]  // 卡片数据列表（按tabs中的cardIds顺序）
}
```

## API 接口规范

### 基础路径

```
/api/reports
/api/cards
```

### 1. 报告API

#### GET `/api/reports`

获取所有报告列表

**响应：**
```json
{
  "reports": [
    {
      "id": "ai-industry-report-v1",
      "name": "AI产业报告",
      "category": "industry",
      "version": 1,
      "metadata": {
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z",
        "totalCards": 16
      }
    }
  ]
}
```

#### GET `/api/reports/:id`

获取报告配置（不包含卡片数据）

**响应：**
```json
{
  "id": "ai-industry-report-v1",
  "name": "AI产业报告",
  "category": "industry",
  "version": 1,
  "tabs": [
    {
      "id": "structure",
      "label": "结构 & 趋势",
      "cardIds": ["industry-stack-001", "trend-radar-001", ...]
    }
  ],
  "metadata": {
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z",
    "totalCards": 16
  }
}
```

#### GET `/api/reports/:id/with-cards`

获取报告及其所有卡片数据（组合查询，推荐使用）

**响应：**
```json
{
  "id": "ai-industry-report-v1",
  "name": "AI产业报告",
  "category": "industry",
  "version": 1,
  "tabs": [...],
  "metadata": {...},
  "cards": [
    {
      "id": "industry-stack-001",
      "templateId": "industry-stack",
      "componentName": "IndustryStackCard",
      "data": {
        "title": "产业结构分层",
        "summary": "...",
        "levels": [...]
      },
      "metadata": {...}
    },
    ...
  ]
}
```

#### POST `/api/reports`

创建新报告（AI生成）

**请求体：**
```json
{
  "name": "AI产业报告",
  "category": "industry",
  "tabs": [
    {
      "id": "structure",
      "label": "结构 & 趋势",
      "cardIds": ["industry-stack-001", ...]
    }
  ]
}
```

**响应：**
```json
{
  "id": "ai-industry-report-v1",
  "name": "AI产业报告",
  ...
}
```

#### PUT `/api/reports/:id`

更新报告配置（如调整卡片顺序、添加/删除卡片）

**请求体：**
```json
{
  "tabs": [
    {
      "id": "structure",
      "label": "结构 & 趋势",
      "cardIds": ["industry-stack-001", "new-card-002", ...]  // 更新后的卡片ID列表
    }
  ],
  "version": 2
}
```

### 2. 卡片API

#### GET `/api/cards`

获取所有卡片（支持筛选）

**查询参数：**
- `category`: 按类别筛选，如 `?category=industry`
- `template`: 按模板筛选，如 `?template=industry-stack`
- `tags`: 按标签筛选，如 `?tags=产业结构,价值链`

**响应：**
```json
{
  "cards": [
    {
      "id": "industry-stack-001",
      "templateId": "industry-stack",
      "componentName": "IndustryStackCard",
      "data": {...},
      "metadata": {...}
    },
    ...
  ],
  "total": 16
}
```

#### GET `/api/cards/:id`

获取单个卡片数据

**响应：**
```json
{
  "id": "industry-stack-001",
  "templateId": "industry-stack",
  "componentName": "IndustryStackCard",
  "data": {
    "title": "产业结构分层",
    "summary": "...",
    "levels": [...]
  },
  "metadata": {
    "category": "industry",
    "tags": ["产业结构", "价值链"],
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

#### POST `/api/cards`

创建新卡片（AI生成）

**请求体：**
```json
{
  "templateId": "industry-stack",
  "componentName": "IndustryStackCard",
  "data": {
    "title": "产业结构分层",
    "summary": "...",
    "levels": [...]
  },
  "metadata": {
    "category": "industry",
    "tags": ["产业结构", "价值链"]
  }
}
```

**响应：**
```json
{
  "id": "industry-stack-002",  // 后端自动生成ID
  "templateId": "industry-stack",
  "componentName": "IndustryStackCard",
  "data": {...},
  "metadata": {
    "category": "industry",
    "tags": ["产业结构", "价值链"],
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

#### GET `/api/cards/:id/detail`

获取卡片详情内容（AI生成的深度分析文章）

**说明：**
- 详情内容由 AI 定时生成，包含 Markdown 文章、图表、列表等
- 内容动态更新，不存储在前端
- 支持标签切换（如果内容较多）

**响应：**
```json
{
  "tabs": [
    {
      "id": "analysis",
      "label": "深度分析",
      "content": [
        {
          "type": "markdown",
          "content": "# 标题\n\n这是 AI 生成的详细分析内容..."
        },
        {
          "type": "chart",
          "component": "StatusGridChart",
          "props": {
            "data": [...]
          }
        },
        {
          "type": "list",
          "listType": "companies",
          "data": [...]
        }
      ]
    }
  ]
}
```

**或者单页内容（无标签）：**
```json
{
  "content": [
    {
      "type": "markdown",
      "content": "# 标题\n\n内容..."
    },
    {
      "type": "chart",
      "component": "RadarChart",
      "props": {...}
    }
  ]
}
```

**内容块类型：**
- `markdown`: Markdown 文本内容
- `chart`: 数据图表（component 为图表组件名，props 为图表参数）
- `list`: 列表（listType: "companies" | "people" | "custom"）
- `image`: 图片
- `video`: 视频
- `card`: 嵌套卡片容器

#### PUT `/api/cards/:id`

更新卡片数据（动态化）

**请求体：**
```json
{
  "data": {
    "title": "更新后的标题",
    "summary": "更新后的摘要",
    ...
  },
  "metadata": {
    "tags": ["新标签"],
    "updatedAt": "2024-01-02T00:00:00Z"
  }
}
```

#### DELETE `/api/cards/:id`

删除卡片

**响应：**
```json
{
  "success": true,
  "message": "Card deleted"
}
```

## AI 生成流程示例

### 场景：AI生成一个新卡片并添加到报告

```typescript
// 1. AI分析用户需求
const userQuery = "分析AI产业的结构"

// 2. AI选择卡片模板
const templateId = "industry-stack"
const componentName = "IndustryStackCard"

// 3. AI生成卡片数据
const cardData = {
  title: "产业结构分层",
  summary: "...",  // AI生成
  levels: [...]    // AI生成或调用数据API
}

// 4. AI创建卡片实例
const newCard = await POST('/api/cards', {
  templateId: "industry-stack",
  componentName: "IndustryStackCard",
  data: cardData,
  metadata: {
    category: "industry",
    tags: ["产业结构", "价值链"]
  }
})

// 5. AI将卡片添加到报告
await PUT('/api/reports/ai-industry-report-v1', {
  tabs: [{
    id: "structure",
    label: "结构 & 趋势",
    cardIds: [...existingCards, newCard.id]  // 追加新卡片
  }],
  version: 2
})
```

## 数据存储建议

### 方案1：JSON文件 + 索引（轻量化，适合小规模）

```
data/
├── index.json                   # 全局索引
├── reports/
│   ├── ai-industry-report-v1.json
│   └── ai-company-report-v1.json
└── cards/
    ├── industry-stack-001.json
    ├── trend-radar-001.json
    └── ...
```

### 方案2：数据库（推荐，适合大规模）

**报告表 (reports)**
- `id` (PK)
- `name`
- `category`
- `version`
- `created_at`
- `updated_at`

**标签表 (report_tabs)**
- `id` (PK)
- `report_id` (FK)
- `tab_id`
- `label`
- `card_ids` (JSON数组)

**卡片表 (cards)**
- `id` (PK)
- `template_id`
- `component_name`
- `data` (JSON)
- `category`
- `tags` (JSON数组)
- `created_at`
- `updated_at`

## 注意事项

1. **卡片ID生成规则**：建议使用 `{templateId}-{序号}` 格式，如 `industry-stack-001`
2. **数据验证**：后端应验证 `data` 字段是否符合对应 `templateId` 的数据结构
3. **版本控制**：报告更新时应递增 `version` 字段
4. **错误处理**：所有API应返回标准错误格式：
   ```json
   {
     "error": "Card not found",
     "code": "CARD_NOT_FOUND"
   }
   ```
5. **性能优化**：`GET /api/reports/:id/with-cards` 应使用批量查询优化，避免N+1查询

## 前端Mock API参考

前端Mock API实现位于：`lib/future-lens/api/card-api-mock.ts`

后端实现时，应遵循相同的接口签名和数据结构。

