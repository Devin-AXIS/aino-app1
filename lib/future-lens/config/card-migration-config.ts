/**
 * 卡片迁移配置
 * 支持渐进式迁移：一个卡片一个卡片地对接后端
 * 
 * 策略：
 * - 已迁移的卡片：从后端目录读取数据
 * - 未迁移的卡片：继续使用Mock数据
 * - 可以逐个卡片地迁移，不影响其他卡片
 */

import type { CardTemplateId } from "../types/card-types"

/**
 * 卡片迁移状态
 */
export interface CardMigrationStatus {
  /** 卡片模板ID */
  templateId: CardTemplateId
  /** 是否已迁移到后端（true=使用后端数据，false=使用Mock数据） */
  migrated: boolean
  /** 迁移时间（可选） */
  migratedAt?: string
  /** 备注（可选） */
  note?: string
}

/**
 * 产业分析模块卡片迁移配置
 * 
 * 默认：所有卡片都使用Mock数据
 * 逐步迁移：将 migrated 设置为 true，该卡片就会从后端读取
 */
export const INDUSTRY_ANALYSIS_CARD_MIGRATION: Record<CardTemplateId, CardMigrationStatus> = {
  // 第一个卡片：产业堆叠分析（先迁移这个作为示例）
  "industry-stack": {
    templateId: "industry-stack",
    migrated: true, // ✅ 已启用：从后端读取数据
    note: "第一个迁移的卡片，后端有数据",
  },
  
  // 所有卡片都已迁移到后端API
  "trend-radar": {
    templateId: "trend-radar",
    migrated: true,
    note: "已迁移 - 从后端读取",
  },
  "structural-shift": {
    templateId: "structural-shift",
    migrated: true,
    note: "已迁移 - 从后端读取",
  },
  "tech-timeline": {
    templateId: "tech-timeline",
    migrated: true,
    note: "已迁移 - 从后端读取",
  },
  "industry-pace": {
    templateId: "industry-pace",
    migrated: true,
    note: "已迁移 - 从后端读取",
  },
  "capital-flow": {
    templateId: "capital-flow",
    migrated: true,
    note: "已迁移 - 从后端读取",
  },
  "capital-ecosystem": {
    templateId: "capital-ecosystem",
    migrated: true,
    note: "已迁移 - 从后端读取",
  },
  "player-impact": {
    templateId: "player-impact",
    migrated: true,
    note: "已迁移 - 从后端读取",
  },
  "narrative-capital": {
    templateId: "narrative-capital",
    migrated: true,
    note: "已迁移 - 从后端读取",
  },
  "supply-chain-health": {
    templateId: "supply-chain-health",
    migrated: true,
    note: "已迁移 - 从后端读取",
  },
  "ecosystem-map": {
    templateId: "ecosystem-map",
    migrated: true,
    note: "已迁移 - 从后端读取",
  },
  "strategy-window": {
    templateId: "strategy-window",
    migrated: true,
    note: "已迁移 - 从后端读取",
  },
  "influencer": {
    templateId: "influencer",
    migrated: true,
    note: "已迁移 - 从后端读取",
  },
  "scenario": {
    templateId: "scenario",
    migrated: true,
    note: "已迁移 - 从后端读取",
  },
  "shock-simulation": {
    templateId: "shock-simulation",
    migrated: true,
    note: "已迁移 - 从后端读取",
  },
  "factor-weighting": {
    templateId: "factor-weighting",
    migrated: true,
    note: "已迁移 - 从后端读取",
  },
  "insight-compression": {
    templateId: "insight-compression",
    migrated: true,
    note: "已迁移 - 从后端读取",
  },
}

/**
 * 检查卡片是否已迁移
 */
export function isCardMigrated(templateId: CardTemplateId): boolean {
  const status = INDUSTRY_ANALYSIS_CARD_MIGRATION[templateId]
  return status?.migrated || false
}

/**
 * 标记卡片为已迁移
 */
export function markCardAsMigrated(templateId: CardTemplateId, note?: string) {
  if (INDUSTRY_ANALYSIS_CARD_MIGRATION[templateId]) {
    INDUSTRY_ANALYSIS_CARD_MIGRATION[templateId] = {
      ...INDUSTRY_ANALYSIS_CARD_MIGRATION[templateId],
      migrated: true,
      migratedAt: new Date().toISOString(),
      note: note || INDUSTRY_ANALYSIS_CARD_MIGRATION[templateId].note,
    }
  }
}

/**
 * 标记卡片为未迁移（回退到Mock）
 */
export function markCardAsNotMigrated(templateId: CardTemplateId) {
  if (INDUSTRY_ANALYSIS_CARD_MIGRATION[templateId]) {
    INDUSTRY_ANALYSIS_CARD_MIGRATION[templateId] = {
      ...INDUSTRY_ANALYSIS_CARD_MIGRATION[templateId],
      migrated: false,
      migratedAt: undefined,
    }
  }
}

/**
 * 获取所有已迁移的卡片列表
 */
export function getMigratedCards(): CardTemplateId[] {
  return Object.values(INDUSTRY_ANALYSIS_CARD_MIGRATION)
    .filter((status) => status.migrated)
    .map((status) => status.templateId)
}

/**
 * 获取所有未迁移的卡片列表
 */
export function getNotMigratedCards(): CardTemplateId[] {
  return Object.values(INDUSTRY_ANALYSIS_CARD_MIGRATION)
    .filter((status) => !status.migrated)
    .map((status) => status.templateId)
}

