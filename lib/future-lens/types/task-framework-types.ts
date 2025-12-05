/**
 * 任务框架系统类型定义
 * 
 * 设计理念：
 * - 任务有基本框架（约束），确保AI不会写乱
 * - 卡片数量和种类完全由AI决定（自由度）
 * - 配置驱动，轻量化，AI友好
 */

/**
 * 监控范围配置
 */
export interface MonitorScope {
  targets: string[]      // 监控目标
  keywords: string[]     // 监控关键词
  channels: string[]     // 监控渠道
}

/**
 * 任务规则配置
 */
export interface TaskRules {
  alertLevels: {
    high: string[]
    medium: string[]
    low: string[]
  }
  updateFrequency: string
}

/**
 * 任务总结卡片框架
 * AI可以决定：
 * - 卡片数量（1-5张）
 * - 卡片种类（可以使用现有，也可以创建新类型）
 * - 卡片顺序
 */
export interface TaskSummaryCardFramework {
  /** 卡片ID列表（AI填充，可以为空） */
  cardIds?: string[]
}

/**
 * 事件框架
 * 定义事件的基本结构和约束
 */
export interface EventFramework {
  /** 必须包含的卡片（可选，用于约束） */
  requiredCards?: string[]
  /** 
   * 其他卡片完全由AI决定：
   * - 卡片数量：1-50张都可以
   * - 卡片种类：现有卡片或新卡片
   * - 卡片顺序：AI决定
   */
}

/**
 * 任务框架
 * 用户定义基本结构，AI填充卡片
 */
export interface TaskFramework {
  /** 监控范围（必须，用户定义） */
  monitorScope: MonitorScope
  /** 任务规则（必须，用户定义） */
  rules: TaskRules
  /** 任务总结卡片框架（可选，AI填充） */
  summaryCardFramework?: TaskSummaryCardFramework
  /** 事件框架（必须，用户定义） */
  eventFramework: EventFramework
}

/**
 * 任务配置（完整）
 */
export interface TaskConfig {
  /** 任务ID */
  id: string
  /** 任务名称 */
  name: string
  /** 任务类别 */
  category: string
  /** 版本号 */
  version: number
  /** 任务描述 */
  description?: string
  /** 任务框架（用户定义 + AI填充） */
  framework: TaskFramework
  /** 元数据 */
  metadata: {
    createdAt: string
    updatedAt: string
    status: "active" | "paused" | "archived"
    totalEvents?: number
    /** 是否由AI生成 */
    aiGenerated?: boolean
  }
}

/**
 * 事件卡片框架
 * AI完全决定卡片数量和种类
 */
export interface EventCardFramework {
  /** 卡片ID列表（AI生成，完全由AI决定） */
  cardIds: string[]
}

/**
 * 事件框架配置
 */
export interface EventFrameworkConfig {
  /** 卡片框架（AI填充） */
  cardFramework: EventCardFramework
  /** 任务总结卡片ID列表（可选，AI填充） */
  taskSummaryCardIds?: string[]
}

/**
 * 事件配置（完整）
 */
export interface EventConfig {
  /** 事件ID */
  id: string
  /** 事件名称 */
  name: string
  /** 事件类别 */
  category: string
  /** 关联任务ID */
  taskId: string
  /** 版本号 */
  version: number
  /** 布局类型 */
  layoutType: "tabs-sticky" | "tabs-static" | "single-page" | "custom"
  /** 标签页配置（如果使用标签页布局） */
  tabs?: Array<{
    id: string
    label: string
    /** 卡片ID列表（AI生成） */
    cardIds: string[]
    /** 任务总结卡片ID列表（可选，AI填充） */
    taskSummaryCardIds?: string[]
  }>
  /** 单页布局的卡片ID列表（如果使用单页布局） */
  cardIds?: string[]
  /** 元数据 */
  metadata: {
    createdAt: string
    updatedAt: string
    totalCards: number
    urgency?: string
    impact?: string
    /** 是否由AI生成 */
    aiGenerated?: boolean
  }
}

