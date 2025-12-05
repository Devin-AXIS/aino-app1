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
 * 卡片模板ID（语义化，AI易理解）
 * 对应前端的卡片组件名称
 */
export type CardTemplateId =
  | "industry-stack"        // 产业结构分层
  | "trend-radar"           // 核心趋势雷达
  | "structural-shift"      // 价值重心迁移
  | "tech-timeline"         // 技术突破时间轴
  | "industry-pace"         // 行业节奏指征
  | "capital-flow"          // 资金流向追踪
  | "player-impact"         // 领军企业象限
  | "narrative-capital"     // 叙事与资本共振
  | "supply-chain-health"   // 供应链脆弱性
  | "ecosystem-map"         // 生态网络拓扑
  | "strategy-window"        // 战略机遇窗口
  | "influencer"            // 关键人物图谱
  | "scenario"              // 未来情景推演
  | "shock-simulation"      // 风险传导模拟
  | "factor-weighting"      // 驱动因素权重
  | "insight-compression"   // AI核心洞察压缩
  | "report-card"           // 报告卡片（指向整个报告）
  // 企业分析报告卡片模板
  | "company-snapshot"      // 企业一屏总览
  | "company-profile"       // 公司基础档案
  | "business-mix"          // 业务结构 & 收入构成
  | "product-tech-map"      // 产品 & 技术栈地图
  | "customer-use-case"     // 客户 & 使用场景分布
  | "org-footprint"         // 组织 & 地理布局
  | "industry-positioning"  // 行业位置 & 市场份额
  | "moat-map"              // 护城河 & 关键优势结构
  | "peer-comparison"       // 竞品对标卡
  | "ecosystem-embedding"   // 生态嵌入度 & 合作网络
  | "talent-culture"        // 人才 & 文化画像
  | "financial-health"      // 财务健康度 & 现金流
  | "ownership-capital"     // 股权结构 & 资金来源
  | "risk-radar"            // 风险雷达
  | "strategic-moves"       // 战略动作时间线
  | "future-growth"         // 未来增长引擎
  | "ai-executive-insight"   // AI 总评洞察卡
  // 产品分析报告卡片模板
  | "product-snapshot"       // 产品一屏总览
  | "user-profile"           // 用户画像 & 核心人群
  | "core-tasks"             // 核心任务 & 使用场景
  | "experience-journey"     // 体验路径 & 关键流程
  | "feature-heatmap"        // 功能使用热度 & 模块权重
  | "personalization"        // 个性化 & 交互风格
  | "architecture-overview"  // 技术架构总览
  | "capability-engine"      // 能力引擎 & 算法逻辑
  | "data-integration"        // 数据 & 集成能力
  | "performance-reliability" // 性能 & 可靠性画像
  | "security-governance"     // 安全、合规 & 运维控制
  | "business-model"         // 商业模式 & 付费点
  | "user-growth"            // 用户增长 & 渠道结构
  | "retention-engagement"   // 留存、粘性 & 习惯养成
  | "product-moat"           // 产品护城河 & 可复制性
  | "roadmap-risks"          // 路线图 & 风险点
  | "ai-product-insight"      // AI 产品总评卡
  // 事件详情页卡片模板
  | "event-header"            // 事件抬头区
  | "event-core-insight"      // 核心结论卡
  | "event-signal-meter"      // 信号仪表条
  | "event-multi-impact"      // 多维影响区
  | "event-action-list"       // 建议动作区
  | "event-decision-record"   // 决策记录区
  | "event-timeline"          // 事件脉络区
  | "event-history"           // 类似历史事件区
  | "event-related-entities" // 相关产业/企业/产品
  | "event-quick-read"       // 30秒速读卡片（专业版）
  | "event-comparison"       // 对比分析卡片（专业版）
  | "event-timeline-prediction" // 时间线预测卡片（专业版）
  | "event-decision-support"    // 决策支持卡片（专业版）

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
