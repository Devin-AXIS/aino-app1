/**
 * 卡片系统 Mock API
 * 模拟后端API接口，用于前端开发
 * 
 * @note 
 * 1. 后端开发时，应实现相同的接口规范（详见 docs/CARD_SYSTEM_API.md）
 * 2. **详情内容（Markdown）由 AI 定时生成，通过 API 动态获取，不存储在前端**
 * 3. 前端的 `detail.json` 文件仅用于开发测试，生产环境应删除或通过 API 获取
 */

import type { CardInstance, ReportConfig, ReportWithCards } from "../types/card-types"
import type { DetailContent } from "../types/detail-content-types"
import reportConfig from "@/data/reports/ai-industry-report-v1/config.json"
import companyReportConfig from "@/data/reports/ai-company-report-v1/config.json"
import productReportConfig from "@/data/reports/ai-product-report-v1/config.json"
import industryStack001 from "@/data/reports/ai-industry-report-v1/cards/industry-stack-001.json"
import trendRadar001 from "@/data/reports/ai-industry-report-v1/cards/trend-radar-001.json"
import structuralShift001 from "@/data/reports/ai-industry-report-v1/cards/structural-shift-001.json"
import techTimeline001 from "@/data/reports/ai-industry-report-v1/cards/tech-timeline-001.json"
import industryPace001 from "@/data/reports/ai-industry-report-v1/cards/industry-pace-001.json"
import capitalFlow001 from "@/data/reports/ai-industry-report-v1/cards/capital-flow-001.json"
import capitalEcosystem001 from "@/data/reports/ai-industry-report-v1/cards/capital-ecosystem-001.json"
import playerImpact001 from "@/data/reports/ai-industry-report-v1/cards/player-impact-001.json"
import narrativeCapital001 from "@/data/reports/ai-industry-report-v1/cards/narrative-capital-001.json"
import supplyChainHealth001 from "@/data/reports/ai-industry-report-v1/cards/supply-chain-health-001.json"
import ecosystemMap001 from "@/data/reports/ai-industry-report-v1/cards/ecosystem-map-001.json"
import strategyWindow001 from "@/data/reports/ai-industry-report-v1/cards/strategy-window-001.json"
import influencer001 from "@/data/reports/ai-industry-report-v1/cards/influencer-001.json"
import scenario001 from "@/data/reports/ai-industry-report-v1/cards/scenario-001.json"
import shockSimulation001 from "@/data/reports/ai-industry-report-v1/cards/shock-simulation-001.json"
import factorWeighting001 from "@/data/reports/ai-industry-report-v1/cards/factor-weighting-001.json"
import insightCompression001 from "@/data/reports/ai-industry-report-v1/cards/insight-compression-001.json"
// 企业分析报告卡片
import companySnapshot001 from "@/data/reports/ai-company-report-v1/cards/company-snapshot-001.json"
import companyProfile001 from "@/data/reports/ai-company-report-v1/cards/company-profile-001.json"
import businessMix001 from "@/data/reports/ai-company-report-v1/cards/business-mix-001.json"
import productTechMap001 from "@/data/reports/ai-company-report-v1/cards/product-tech-map-001.json"
import customerUseCase001 from "@/data/reports/ai-company-report-v1/cards/customer-use-case-001.json"
import orgFootprint001 from "@/data/reports/ai-company-report-v1/cards/org-footprint-001.json"
import industryPositioning001 from "@/data/reports/ai-company-report-v1/cards/industry-positioning-001.json"
import moatMap001 from "@/data/reports/ai-company-report-v1/cards/moat-map-001.json"
import peerComparison001 from "@/data/reports/ai-company-report-v1/cards/peer-comparison-001.json"
import ecosystemEmbedding001 from "@/data/reports/ai-company-report-v1/cards/ecosystem-embedding-001.json"
import talentCulture001 from "@/data/reports/ai-company-report-v1/cards/talent-culture-001.json"
import financialHealth001 from "@/data/reports/ai-company-report-v1/cards/financial-health-001.json"
import ownershipCapital001 from "@/data/reports/ai-company-report-v1/cards/ownership-capital-001.json"
import riskRadar001 from "@/data/reports/ai-company-report-v1/cards/risk-radar-001.json"
import strategicMoves001 from "@/data/reports/ai-company-report-v1/cards/strategic-moves-001.json"
import futureGrowth001 from "@/data/reports/ai-company-report-v1/cards/future-growth-001.json"
import aiExecutiveInsight001 from "@/data/reports/ai-company-report-v1/cards/ai-executive-insight-001.json"
// 产品分析报告卡片
import productSnapshot001 from "@/data/reports/ai-product-report-v1/cards/product-snapshot-001.json"
import userProfile001 from "@/data/reports/ai-product-report-v1/cards/user-profile-001.json"
import coreTasks001 from "@/data/reports/ai-product-report-v1/cards/core-tasks-001.json"
import experienceJourney001 from "@/data/reports/ai-product-report-v1/cards/experience-journey-001.json"
import featureHeatmap001 from "@/data/reports/ai-product-report-v1/cards/feature-heatmap-001.json"
import personalization001 from "@/data/reports/ai-product-report-v1/cards/personalization-001.json"
import architectureOverview001 from "@/data/reports/ai-product-report-v1/cards/architecture-overview-001.json"
import capabilityEngine001 from "@/data/reports/ai-product-report-v1/cards/capability-engine-001.json"
import dataIntegration001 from "@/data/reports/ai-product-report-v1/cards/data-integration-001.json"
import performanceReliability001 from "@/data/reports/ai-product-report-v1/cards/performance-reliability-001.json"
import securityGovernance001 from "@/data/reports/ai-product-report-v1/cards/security-governance-001.json"
import businessModel001 from "@/data/reports/ai-product-report-v1/cards/business-model-001.json"
import userGrowth001 from "@/data/reports/ai-product-report-v1/cards/user-growth-001.json"
import retentionEngagement001 from "@/data/reports/ai-product-report-v1/cards/retention-engagement-001.json"
import productMoat001 from "@/data/reports/ai-product-report-v1/cards/product-moat-001.json"
import roadmapRisks001 from "@/data/reports/ai-product-report-v1/cards/roadmap-risks-001.json"
import aiProductInsight001 from "@/data/reports/ai-product-report-v1/cards/ai-product-insight-001.json"

// 卡片数据映射（添加dataSource标识）
const cardsMap: Record<string, CardInstance> = {
  "industry-stack-001": { ...(industryStack001 as CardInstance), dataSource: "api" },
  "trend-radar-001": { ...(trendRadar001 as CardInstance), dataSource: "api" },
  "structural-shift-001": { ...(structuralShift001 as CardInstance), dataSource: "ai-generated" },
  "tech-timeline-001": { ...(techTimeline001 as CardInstance), dataSource: "api" },
  "industry-pace-001": { ...(industryPace001 as CardInstance), dataSource: "api" },
  "capital-flow-001": { ...(capitalFlow001 as CardInstance), dataSource: "api" },
  "capital-ecosystem-001": { ...(capitalEcosystem001 as CardInstance), dataSource: "api" },
  "player-impact-001": { ...(playerImpact001 as CardInstance), dataSource: "api" },
  "narrative-capital-001": { ...(narrativeCapital001 as CardInstance), dataSource: "api" },
  "supply-chain-health-001": { ...(supplyChainHealth001 as CardInstance), dataSource: "api" },
  "ecosystem-map-001": { ...(ecosystemMap001 as CardInstance), dataSource: "ai-generated" },
  "strategy-window-001": { ...(strategyWindow001 as CardInstance), dataSource: "ai-generated" },
  "influencer-001": { ...(influencer001 as CardInstance), dataSource: "api" },
  "scenario-001": { ...(scenario001 as CardInstance), dataSource: "ai-generated" },
  "shock-simulation-001": { ...(shockSimulation001 as CardInstance), dataSource: "ai-generated" },
  "factor-weighting-001": { ...(factorWeighting001 as CardInstance), dataSource: "api" },
  "insight-compression-001": { ...(insightCompression001 as CardInstance), dataSource: "ai-generated" },
  // 企业分析报告卡片
  "company-snapshot-001": { ...(companySnapshot001 as CardInstance), dataSource: "api" },
  "company-profile-001": { ...(companyProfile001 as CardInstance), dataSource: "api" },
  "business-mix-001": { ...(businessMix001 as CardInstance), dataSource: "api" },
  "product-tech-map-001": { ...(productTechMap001 as CardInstance), dataSource: "api" },
  "customer-use-case-001": { ...(customerUseCase001 as CardInstance), dataSource: "api" },
  "org-footprint-001": { ...(orgFootprint001 as CardInstance), dataSource: "api" },
  "industry-positioning-001": { ...(industryPositioning001 as CardInstance), dataSource: "api" },
  "moat-map-001": { ...(moatMap001 as CardInstance), dataSource: "api" },
  "peer-comparison-001": { ...(peerComparison001 as CardInstance), dataSource: "api" },
  "ecosystem-embedding-001": { ...(ecosystemEmbedding001 as CardInstance), dataSource: "api" },
  "talent-culture-001": { ...(talentCulture001 as CardInstance), dataSource: "api" },
  "financial-health-001": { ...(financialHealth001 as CardInstance), dataSource: "api" },
  "ownership-capital-001": { ...(ownershipCapital001 as CardInstance), dataSource: "api" },
  "risk-radar-001": { ...(riskRadar001 as CardInstance), dataSource: "api" },
  "strategic-moves-001": { ...(strategicMoves001 as CardInstance), dataSource: "api" },
  "future-growth-001": { ...(futureGrowth001 as CardInstance), dataSource: "api" },
  "ai-executive-insight-001": { ...(aiExecutiveInsight001 as CardInstance), dataSource: "ai-generated" },
  // 产品分析报告卡片
  "product-snapshot-001": { ...(productSnapshot001 as CardInstance), dataSource: "api" },
  "user-profile-001": { ...(userProfile001 as CardInstance), dataSource: "api" },
  "core-tasks-001": { ...(coreTasks001 as CardInstance), dataSource: "api" },
  "experience-journey-001": { ...(experienceJourney001 as CardInstance), dataSource: "api" },
  "feature-heatmap-001": { ...(featureHeatmap001 as CardInstance), dataSource: "api" },
  "personalization-001": { ...(personalization001 as CardInstance), dataSource: "api" },
  "architecture-overview-001": { ...(architectureOverview001 as CardInstance), dataSource: "api" },
  "capability-engine-001": { ...(capabilityEngine001 as CardInstance), dataSource: "api" },
  "data-integration-001": { ...(dataIntegration001 as CardInstance), dataSource: "api" },
  "performance-reliability-001": { ...(performanceReliability001 as CardInstance), dataSource: "api" },
  "security-governance-001": { ...(securityGovernance001 as CardInstance), dataSource: "api" },
  "business-model-001": { ...(businessModel001 as CardInstance), dataSource: "api" },
  "user-growth-001": { ...(userGrowth001 as CardInstance), dataSource: "api" },
  "retention-engagement-001": { ...(retentionEngagement001 as CardInstance), dataSource: "api" },
  "product-moat-001": { ...(productMoat001 as CardInstance), dataSource: "api" },
  "roadmap-risks-001": { ...(roadmapRisks001 as CardInstance), dataSource: "api" },
  "ai-product-insight-001": { ...(aiProductInsight001 as CardInstance), dataSource: "ai-generated" },
}

/**
 * 获取报告配置
 * @param reportId 报告ID（如果为空或未找到，使用默认值）
 * @returns 报告配置
 */
export async function getReportConfig(reportId: string): Promise<ReportConfig> {
  // 模拟API延迟
  await new Promise((resolve) => setTimeout(resolve, 100))

  // 如果 reportId 为空、未定义，使用默认报告
  if (!reportId || reportId === "") {
    return reportConfig as ReportConfig
  }

  if (reportId === "ai-industry-report-v1") {
    return reportConfig as ReportConfig
  }

  if (reportId === "ai-company-report-v1") {
    return companyReportConfig as ReportConfig
  }

  if (reportId === "ai-product-report-v1") {
    return productReportConfig as ReportConfig
  }

  // 对于数字ID（如 "2"），也返回默认报告
  return reportConfig as ReportConfig
}

/**
 * 获取报告及其所有卡片数据（组合查询）
 * @param reportId 报告ID
 * @returns 报告配置和卡片数据
 */
export async function getReportWithCards(reportId: string): Promise<ReportWithCards> {
  const report = await getReportConfig(reportId)

  // 根据布局类型获取卡片ID列表
  let allCardIds: string[] = []
  
  if (report.layoutType === "single-page" && report.cardIds) {
    // 单页布局：使用 cardIds
    allCardIds = report.cardIds
  } else if (report.tabs && report.tabs.length > 0) {
    // 标签页布局：从所有标签页的 cardIds 中获取
    allCardIds = report.tabs.flatMap((tab) => tab.cardIds)
  }

  // 按顺序获取所有卡片
  const cards = allCardIds.map((cardId) => cardsMap[cardId]).filter(Boolean) as CardInstance[]

  return {
    ...report,
    cards,
  }
}

/**
 * 获取单个卡片数据
 * @param cardId 卡片ID
 * @returns 卡片数据
 */
export async function getCard(cardId: string): Promise<CardInstance> {
  // 模拟API延迟
  await new Promise((resolve) => setTimeout(resolve, 50))

  const card = cardsMap[cardId]
  if (!card) {
    throw new Error(`Card not found: ${cardId}`)
  }

  return card
}

/**
 * 批量获取卡片数据
 * @param cardIds 卡片ID数组
 * @returns 卡片数据数组
 */
export async function getCards(cardIds: string[]): Promise<CardInstance[]> {
  // 模拟API延迟
  await new Promise((resolve) => setTimeout(resolve, 100))

  return cardIds.map((cardId) => cardsMap[cardId]).filter(Boolean) as CardInstance[]
}

/**
 * 获取卡片详情内容
 * 
 * @note 这是 Mock 实现，实际应该调用后端 API
 * 详情内容由 AI 定时生成，通过 API 动态获取，不存储在前端
 * 
 * @param cardId 卡片ID
 * @returns 详情内容数据
 * 
 * @example 实际后端 API 调用示例：
 * ```typescript
 * const response = await fetch(`/api/cards/${cardId}/detail`)
 * const detail = await response.json()
 * return detail as DetailContent
 * ```
 */
export async function getCardDetail(cardId: string): Promise<DetailContent | null> {
  // TODO: 实际应该调用后端 API
  // const response = await fetch(`/api/cards/${cardId}/detail`)
  // if (!response.ok) return null
  // return await response.json() as DetailContent

  // Mock 实现（仅用于开发测试）
  await new Promise((resolve) => setTimeout(resolve, 50))

  // 开发环境：如果有本地 mock 数据，可以使用
  try {
    // 仅在开发环境使用本地 mock 数据
    if (process.env.NODE_ENV === "development") {
      const supplyChainHealthDetail = await import("@/data/reports/ai-industry-report-v1/cards/supply-chain-health-001/detail.json")
      const playerImpactDetail = await import("@/data/reports/ai-industry-report-v1/cards/player-impact-001/detail.json")
      
      const detailMap: Record<string, DetailContent> = {
        "supply-chain-health-001": supplyChainHealthDetail.default as DetailContent,
        "player-impact-001": playerImpactDetail.default as DetailContent,
      }

      const detail = detailMap[cardId]
      if (detail) {
        return detail
      }
    }
  } catch (error) {
    // Mock 数据不存在，忽略
  }

  // 生产环境或没有 mock 数据时，返回 null（实际应该调用 API）
  console.warn(`[getCardDetail] Mock 数据不存在: ${cardId}，实际应该调用后端 API`)
  return null
}

