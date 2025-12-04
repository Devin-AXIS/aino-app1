/**
 * 卡片模板配置系统
 * 定义每个卡片模板的数据源类型、API配置等
 * 
 * @note AI友好：AI可以通过此配置了解哪些卡片是API对接的，哪些是AI生成的
 */

import type { CardTemplateId, CardDataSource } from "../types/card-types"

/**
 * 卡片模板配置
 */
export interface CardTemplateConfig {
  /** 模板ID */
  templateId: CardTemplateId
  /** 前端组件名称 */
  componentName: string
  /** 数据来源 */
  dataSource: CardDataSource
  /** API对接配置（当dataSource为"api"时） */
  apiConfig?: {
    /** AINO API地址 */
    endpoint: string
    /** 缓存时间（秒，默认3600） */
    cacheTTL?: number
    /** 刷新策略 */
    refreshStrategy?: "auto" | "manual"
  }
  /** AI生成配置（当dataSource为"ai-generated"时） */
  aiConfig?: {
    /** 是否需要先查数据 */
    requiresData: boolean
    /** 数据查询提示（帮助AI理解需要什么数据） */
    dataQuery?: string
  }
  /** 搜索关键词（用于AI推荐时匹配） */
  searchKeywords: string[]
  /** 描述（帮助AI理解卡片用途） */
  description: string
}

/**
 * 卡片模板配置表
 * AI可以通过此表了解每个卡片模板的特性
 */
export const CARD_TEMPLATE_CONFIGS: Record<CardTemplateId, CardTemplateConfig> = {
  // API对接的卡片（数据来自AINO）
  "industry-stack": {
    templateId: "industry-stack",
    componentName: "IndustryStackCard",
    dataSource: "api",
    apiConfig: {
      endpoint: "/api/aino/industry-structure",
      cacheTTL: 3600, // 1小时
      refreshStrategy: "auto",
    },
    searchKeywords: ["产业结构", "价值链", "产业分层", "行业结构"],
    description: "展示产业的层次结构，如应用层、执行层、决策层等",
  },
  "trend-radar": {
    templateId: "trend-radar",
    componentName: "TrendRadarCard",
    dataSource: "api",
    apiConfig: {
      endpoint: "/api/aino/trend-analysis",
      cacheTTL: 1800, // 30分钟
      refreshStrategy: "auto",
    },
    searchKeywords: ["趋势", "雷达图", "趋势分析", "行业趋势"],
    description: "雷达图展示多个趋势指标的强度",
  },
  "capital-flow": {
    templateId: "capital-flow",
    componentName: "CapitalFlowCard",
    dataSource: "api",
    apiConfig: {
      endpoint: "/api/aino/capital-flow",
      cacheTTL: 3600,
      refreshStrategy: "auto",
    },
    searchKeywords: ["资金流向", "融资", "资本", "投资"],
    description: "展示资金在不同领域的流向分布",
  },
  "player-impact": {
    templateId: "player-impact",
    componentName: "PlayerImpactCard",
    dataSource: "api",
    apiConfig: {
      endpoint: "/api/aino/player-analysis",
      cacheTTL: 3600,
      refreshStrategy: "auto",
    },
    searchKeywords: ["企业", "公司", "玩家", "竞争", "影响力"],
    description: "展示主要企业/玩家的影响力和竞争力",
  },
  "supply-chain-health": {
    templateId: "supply-chain-health",
    componentName: "SupplyChainHealthCard",
    dataSource: "api",
    apiConfig: {
      endpoint: "/api/aino/supply-chain",
      cacheTTL: 7200, // 2小时
      refreshStrategy: "auto",
    },
    searchKeywords: ["供应链", "脆弱性", "风险", "供应链健康"],
    description: "展示供应链各环节的健康状况和风险",
  },
  // AI生成的卡片（AI实时生成数据）
  "structural-shift": {
    templateId: "structural-shift",
    componentName: "StructuralShiftCard",
    dataSource: "ai-generated",
    aiConfig: {
      requiresData: false,
    },
    searchKeywords: ["价值迁移", "结构变化", "权力交接"],
    description: "展示行业价值重心的迁移趋势",
  },
  "insight-compression": {
    templateId: "insight-compression",
    componentName: "InsightCompressionCard",
    dataSource: "ai-generated",
    aiConfig: {
      requiresData: true,
      dataQuery: "需要综合分析多个数据源，提取核心洞察",
    },
    searchKeywords: ["核心洞察", "总结", "关键发现", "AI洞察"],
    description: "AI生成的核心洞察总结卡片",
  },
  // 其他卡片配置...
  "tech-timeline": {
    templateId: "tech-timeline",
    componentName: "TechTimelineCard",
    dataSource: "api",
    apiConfig: {
      endpoint: "/api/aino/tech-timeline",
      cacheTTL: 3600,
      refreshStrategy: "auto",
    },
    searchKeywords: ["技术突破", "时间轴", "技术路线"],
    description: "展示技术突破的时间轴",
  },
  "industry-pace": {
    templateId: "industry-pace",
    componentName: "IndustryPaceCard",
    dataSource: "api",
    apiConfig: {
      endpoint: "/api/aino/industry-pace",
      cacheTTL: 1800,
      refreshStrategy: "auto",
    },
    searchKeywords: ["行业节奏", "指征", "行业状态"],
    description: "展示行业节奏的各项指征",
  },
  "narrative-capital": {
    templateId: "narrative-capital",
    componentName: "NarrativeCapitalCard",
    dataSource: "api",
    apiConfig: {
      endpoint: "/api/aino/narrative-analysis",
      cacheTTL: 1800,
      refreshStrategy: "auto",
    },
    searchKeywords: ["叙事", "资本", "舆情", "社交媒体"],
    description: "展示叙事与资本的相关性分析",
  },
  "ecosystem-map": {
    templateId: "ecosystem-map",
    componentName: "EcosystemMapCard",
    dataSource: "ai-generated",
    aiConfig: {
      requiresData: true,
      dataQuery: "需要分析生态网络关系",
    },
    searchKeywords: ["生态", "网络", "拓扑", "生态格局"],
    description: "展示生态网络的拓扑结构",
  },
  "strategy-window": {
    templateId: "strategy-window",
    componentName: "StrategyWindowCard",
    dataSource: "ai-generated",
    aiConfig: {
      requiresData: false,
    },
    searchKeywords: ["战略窗口", "机遇", "时间窗口"],
    description: "展示战略机遇窗口期",
  },
  "influencer": {
    templateId: "influencer",
    componentName: "InfluencerCard",
    dataSource: "api",
    apiConfig: {
      endpoint: "/api/aino/influencer-analysis",
      cacheTTL: 3600,
      refreshStrategy: "auto",
    },
    searchKeywords: ["关键人物", "影响力", "人物图谱"],
    description: "展示关键人物及其影响力",
  },
  "scenario": {
    templateId: "scenario",
    componentName: "ScenarioCard",
    dataSource: "ai-generated",
    aiConfig: {
      requiresData: true,
      dataQuery: "需要基于数据进行情景推演",
    },
    searchKeywords: ["情景推演", "预测", "未来情景"],
    description: "展示未来可能的情景推演",
  },
  "shock-simulation": {
    templateId: "shock-simulation",
    componentName: "ShockSimulationCard",
    dataSource: "ai-generated",
    aiConfig: {
      requiresData: true,
      dataQuery: "需要风险数据进行模拟",
    },
    searchKeywords: ["风险", "压力测试", "风险传导"],
    description: "展示风险传导模拟结果",
  },
  "factor-weighting": {
    templateId: "factor-weighting",
    componentName: "FactorWeightingCard",
    dataSource: "api",
    apiConfig: {
      endpoint: "/api/aino/factor-analysis",
      cacheTTL: 3600,
      refreshStrategy: "auto",
    },
    searchKeywords: ["驱动因素", "权重", "因子分析"],
    description: "展示驱动因素的权重分析",
  },
  // 报告卡片（特殊类型）
  "report-card": {
    templateId: "report-card",
    componentName: "ReportCard",
    dataSource: "api",
    apiConfig: {
      endpoint: "/api/reports",
      cacheTTL: 7200,
      refreshStrategy: "manual",
    },
    searchKeywords: ["报告", "全局分析", "综合分析", "产业报告", "企业报告"],
    description: "指向完整报告的卡片，用于全局分析场景",
  },
}

/**
 * 获取卡片模板配置
 */
export function getCardTemplateConfig(templateId: CardTemplateId): CardTemplateConfig {
  return CARD_TEMPLATE_CONFIGS[templateId]
}

/**
 * 根据关键词搜索匹配的卡片模板
 * AI可以使用此函数根据用户问题找到合适的卡片模板
 */
export function searchCardTemplates(keywords: string[]): CardTemplateConfig[] {
  const lowerKeywords = keywords.map((k) => k.toLowerCase())
  
  return Object.values(CARD_TEMPLATE_CONFIGS)
    .map((config) => {
      const matches = config.searchKeywords.filter((keyword) =>
        lowerKeywords.some((k) => keyword.toLowerCase().includes(k) || k.includes(keyword.toLowerCase()))
      ).length
      
      return { config, score: matches }
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.config)
}

