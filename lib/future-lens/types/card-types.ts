/**
 * 卡片系统类型定义
 * 结构清晰、语义化，便于AI理解和生成
 * 
 * @note 这是前端类型定义，后端API应遵循相同的数据结构
 */

/**
 * 卡片数据源类型
 * - "api": API对接好的（数据来自AINO，已有或可调用API获取）
 * - "ai-generated": AI即时生成的（AI根据用户问题实时生成）
 */
export type CardDataSource = "api" | "ai-generated"

/**
 * 卡片模板ID（完全动态，AI可以生成任意类型）
 * 
 * @note AI友好设计：
 * - 使用 string 类型，AI 可以生成任意 templateId
 * - 预定义卡片：如 "event-header", "event-core-insight" 等
 * - AI生成卡片：如 "event-competitor-price-comparison", "event-market-sentiment-analysis" 等
 * - 运行时验证：通过 card-registry 检查是否存在对应组件
 * - 降级处理：如果不存在，使用 GenericCard 或默认卡片
 * 
 * @example
 * ```typescript
 * // 预定义卡片
 * const predefinedCard: CardTemplateId = "event-header"
 * 
 * // AI生成的新卡片
 * const aiGeneratedCard: CardTemplateId = "event-competitor-price-comparison"
 * ```
 */
export type CardTemplateId = string

/**
 * 报告类别（语义化）
 */
export type ReportCategory = "industry" | "company" | "product" | "market" | "event" | "custom"

/**
 * 卡片实例数据（轻量化、扁平化）
 * AI生成时只需填充data字段
 * 
 * @example
 * ```typescript
 * // API对接的卡片
 * const apiCard: CardInstance = {
 *   id: "industry-stack-001",
 *   templateId: "industry-stack",
 *   componentName: "IndustryStackCard",
 *   dataSource: "api",
 *   data: { title: "...", levels: [...] },
 *   metadata: {
 *     category: "industry",
 *     tags: ["产业结构"],
 *     createdAt: "2024-01-01T00:00:00Z",
 *     apiEndpoint: "/api/aino/industry-structure",
 *     dataUpdatedAt: "2024-01-02T00:00:00Z"
 *   }
 * }
 * 
 * // AI生成的卡片
 * const aiCard: CardInstance = {
 *   id: "custom-insight-001",
 *   templateId: "insight-compression",
 *   componentName: "InsightCompressionCard",
 *   dataSource: "ai-generated",
 *   data: { title: "...", summary: "..." },
 *   metadata: {
 *     category: "industry",
 *     tags: ["AI生成"],
 *     createdAt: "2024-01-01T00:00:00Z",
 *     generatedReason: "用户询问公司财务分析",
 *     generatedQuery: "这个公司的财务分析"
 *   }
 * }
 * 
 * // 报告卡片
 * const reportCard: CardInstance = {
 *   id: "report-card-ai-industry-001",
 *   templateId: "report-card",
 *   componentName: "ReportCard",
 *   dataSource: "api",
 *   data: {
 *     reportId: "ai-industry-report-v1",
 *     title: "AI产业报告",
 *     summary: "...",
 *     cardCount: 16
 *   },
 *   metadata: {
 *     category: "industry",
 *     tags: ["产业报告", "全局分析"],
 *     createdAt: "2024-01-01T00:00:00Z"
 *   }
 * }
 * ```
 */
export interface CardInstance {
  /** 卡片唯一ID */
  id: string
  /** 卡片模板ID（对应前端组件） */
  templateId: CardTemplateId
  /** 前端组件名称（用于动态渲染） */
  componentName: string
  /** 数据来源（API对接 or AI生成） */
  dataSource: CardDataSource
  /** 卡片数据内容（扁平化，AI生成） */
  data: Record<string, unknown>
  /** 元数据（轻量化，只存必要信息） */
  metadata: {
    /** 所属报告类别 */
    category: ReportCategory
    /** 标签（便于搜索和分类） */
    tags: string[]
    /** 创建时间（ISO 8601格式） */
    createdAt: string
    /** 更新时间（可选） */
    updatedAt?: string
    /** API对接的卡片：数据API地址 */
    apiEndpoint?: string
    /** API对接的卡片：数据更新时间 */
    dataUpdatedAt?: string
    /** API对接的卡片：缓存时间（秒） */
    cacheTTL?: number
    /** AI生成的卡片：生成原因（用户问题） */
    generatedReason?: string
    /** AI生成的卡片：原始查询 */
    generatedQuery?: string
    /** 事件ID（用于事件卡片关联） */
    eventId?: string
    /** 任务ID（用于任务卡片关联） */
    taskId?: string
  }
}

/**
 * 报告布局类型（每个报告类型可以有自己独特的布局）
 */
export type ReportLayoutType = 
  | "tabs-sticky"        // 粘性标签页布局（如AI产业报告）
  | "tabs-static"        // 静态标签页布局
  | "single-page"        // 单页布局（无标签页）
  | "accordion"          // 手风琴布局
  | "custom"             // 自定义布局（通过layoutComponent指定）

/**
 * 报告配置（轻量化，只存引用）
 * 
 * @example
 * ```typescript
 * const report: ReportConfig = {
 *   id: "ai-industry-report-v1",
 *   name: "AI产业报告",
 *   category: "industry",
 *   version: 1,
 *   layoutType: "tabs-sticky",
 *   tabs: [
 *     {
 *       id: "structure",
 *       label: "结构 & 趋势",
 *       cardIds: ["industry-stack-001", "trend-radar-001"]
 *     }
 *   ],
 *   metadata: {
 *     createdAt: "2024-01-01T00:00:00Z",
 *     updatedAt: "2024-01-01T00:00:00Z",
 *     totalCards: 16
 *   }
 * }
 * ```
 */
export interface ReportConfig {
  /** 报告唯一ID */
  id: string
  /** 报告名称 */
  name: string
  /** 报告摘要/核心洞察 */
  summary?: string
  /** 总市场规模（如 "$12.5B"） */
  totalMarket?: string
  /** 增长率（如 "+42% YoY"） */
  growth?: string
  /** 12个月趋势数据（用于TopOverviewCard） */
  momentumData?: Array<{ m: string; growth: number; cap: number; heat: number }>
  /** 报告类别 */
  category: ReportCategory
  /** 版本号 */
  version: number
  /** 布局类型（决定使用哪种布局组件） */
  layoutType: ReportLayoutType
  /** 自定义布局组件名称（当layoutType为"custom"时使用） */
  layoutComponent?: string
  /** 标签页配置（扁平化，用于标签页布局类型，如 tabs-sticky, tabs-static） */
  tabs?: Array<{
    /** 标签ID */
    id: string
    /** 标签显示名称 */
    label: string
    /** 卡片ID列表（只存ID，不存数据） */
    cardIds: string[]
  }>
  /** 单页布局的卡片ID列表（当layoutType为"single-page"时使用） */
  cardIds?: string[]
  /** 元数据（轻量化） */
  metadata: {
    /** 创建时间 */
    createdAt: string
    /** 更新时间 */
    updatedAt: string
    /** 卡片总数 */
    totalCards: number
  }
}

/**
 * 报告完整数据（包含卡片数据）
 * 用于前端一次性获取报告和所有卡片
 */
export interface ReportWithCards extends ReportConfig {
  /** 卡片数据列表（按tabs中的cardIds顺序） */
  cards: CardInstance[]
}

/**
 * AI卡片推荐结果
 */
export interface CardRecommendation {
  /** 卡片ID（如果已有） */
  cardId?: string
  /** 卡片模板ID（如果需生成） */
  templateId?: CardTemplateId
  /** 数据来源 */
  dataSource: CardDataSource
  /** 推荐置信度（0-1） */
  confidence: number
  /** 推荐原因 */
  reason: string
  /** 是否需要生成新卡片 */
  requiresGeneration?: boolean
}

/**
 * AI报告推荐结果
 */
export interface ReportRecommendation {
  /** 报告ID */
  reportId: string
  /** 推荐置信度（0-1） */
  confidence: number
  /** 推荐原因 */
  reason: string
}

/**
 * AI推荐响应
 */
export interface AIRecommendationResponse {
  /** 推荐的卡片 */
  cards: CardRecommendation[]
  /** 推荐的报告 */
  reports: ReportRecommendation[]
  /** 建议生成的卡片（如果需AI生成） */
  suggestedGeneration?: {
    templateId: CardTemplateId
    dataSource: "ai-generated"
    requiresData: boolean
    dataQuery?: string
  }
}
