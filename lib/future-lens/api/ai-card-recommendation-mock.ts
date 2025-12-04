/**
 * AI卡片推荐 Mock API
 * 模拟AI根据用户问题推荐卡片和报告
 * 
 * @note 后端实现时，应遵循相同的接口规范
 */

import type {
  AIRecommendationResponse,
  CardRecommendation,
  ReportRecommendation,
  CardInstance,
} from "../types/card-types"
import { searchCardTemplates, getCardTemplateConfig } from "../config/card-template-config"
import { getCard, getCards } from "./card-api-mock"
import { getReportConfig } from "./card-api-mock"

/**
 * AI推荐卡片和报告
 * 
 * @param query 用户问题
 * @param context 对话上下文（可选）
 * @returns 推荐的卡片和报告
 * 
 * @example
 * ```typescript
 * const result = await recommendCards("人工智能产业的产业结构什么样子")
 * // 返回：{ cards: [{ cardId: "industry-stack-001", ... }], reports: [] }
 * ```
 */
export async function recommendCards(
  query: string,
  context?: { previousCards?: string[]; conversationHistory?: string[] }
): Promise<AIRecommendationResponse> {
  // 模拟API延迟
  await new Promise((resolve) => setTimeout(resolve, 200))

  const lowerQuery = query.toLowerCase()
  const recommendations: AIRecommendationResponse = {
    cards: [],
    reports: [],
  }

  // 1. 分析用户意图：判断是单个问题还是全局分析
  const isGlobalAnalysis = 
    lowerQuery.includes("全局") ||
    lowerQuery.includes("整体") ||
    lowerQuery.includes("全面") ||
    lowerQuery.includes("综合分析") ||
    lowerQuery.includes("完整分析")

  // 2. 如果是全局分析，推荐报告
  if (isGlobalAnalysis) {
    // 提取行业/类别关键词
    if (lowerQuery.includes("产业") || lowerQuery.includes("行业")) {
      recommendations.reports.push({
        reportId: "ai-industry-report-v1",
        confidence: 0.9,
        reason: "用户询问全局分析，匹配'产业'关键词",
      })
    }
    // 可以继续添加其他报告类型的匹配逻辑
  }

  // 3. 如果是单个问题，推荐卡片
  if (!isGlobalAnalysis || recommendations.reports.length === 0) {
    // 提取关键词
    const keywords = extractKeywords(query)
    
    // 搜索匹配的卡片模板
    const matchedTemplates = searchCardTemplates(keywords)
    
    // 为每个匹配的模板生成推荐
    for (const template of matchedTemplates.slice(0, 3)) {
      // 判断数据源
      if (template.dataSource === "api") {
        // API对接：尝试搜索已有卡片
        const existingCard = await searchExistingCard(template.templateId, keywords)
        
        if (existingCard) {
          recommendations.cards.push({
            cardId: existingCard.id,
            dataSource: "api",
            confidence: 0.85,
            reason: `匹配'${keywords.join(", ")}'关键词，找到已有卡片`,
          })
        } else {
          // 没有已有卡片，建议调用API获取最新数据
          recommendations.cards.push({
            templateId: template.templateId,
            dataSource: "api",
            confidence: 0.75,
            reason: `匹配'${keywords.join(", ")}'关键词，建议调用API获取最新数据`,
            requiresGeneration: true,
          })
        }
      } else {
        // AI生成：建议生成新卡片
        recommendations.cards.push({
          templateId: template.templateId,
          dataSource: "ai-generated",
          confidence: 0.8,
          reason: `匹配'${keywords.join(", ")}'关键词，建议AI生成卡片`,
          requiresGeneration: true,
        })
      }
    }

    // 如果AI生成的卡片需要数据，添加建议
    const aiGeneratedCards = recommendations.cards.filter(
      (c) => c.dataSource === "ai-generated" && c.requiresGeneration
    )
    
    if (aiGeneratedCards.length > 0) {
      const template = getCardTemplateConfig(aiGeneratedCards[0].templateId!)
      if (template.aiConfig?.requiresData) {
        recommendations.suggestedGeneration = {
          templateId: aiGeneratedCards[0].templateId!,
          dataSource: "ai-generated",
          requiresData: true,
          dataQuery: template.aiConfig.dataQuery,
        }
      }
    }
  }

  return recommendations
}

/**
 * 提取用户问题中的关键词
 */
function extractKeywords(query: string): string[] {
  const keywords: string[] = []
  const lowerQuery = query.toLowerCase()

  // 行业相关
  if (lowerQuery.includes("产业") || lowerQuery.includes("行业")) keywords.push("产业")
  if (lowerQuery.includes("结构")) keywords.push("结构")
  if (lowerQuery.includes("趋势")) keywords.push("趋势")
  if (lowerQuery.includes("资金") || lowerQuery.includes("融资") || lowerQuery.includes("资本")) keywords.push("资金")
  if (lowerQuery.includes("企业") || lowerQuery.includes("公司")) keywords.push("企业")
  if (lowerQuery.includes("供应链")) keywords.push("供应链")
  if (lowerQuery.includes("技术")) keywords.push("技术")
  if (lowerQuery.includes("风险")) keywords.push("风险")
  if (lowerQuery.includes("战略")) keywords.push("战略")
  if (lowerQuery.includes("人物") || lowerQuery.includes("影响")) keywords.push("人物")

  return keywords.length > 0 ? keywords : ["分析"]
}

/**
 * 搜索已有卡片（Mock实现）
 * 实际后端应该根据templateId和关键词搜索数据库
 */
async function searchExistingCard(
  templateId: string,
  keywords: string[]
): Promise<CardInstance | null> {
  // Mock: 根据templateId返回对应的卡片
  // 实际应该从数据库搜索
  const cardIdMap: Record<string, string> = {
    "industry-stack": "industry-stack-001",
    "trend-radar": "trend-radar-001",
    "capital-flow": "capital-flow-001",
    "player-impact": "player-impact-001",
    "supply-chain-health": "supply-chain-health-001",
  }

  const cardId = cardIdMap[templateId]
  if (!cardId) return null

  try {
    return await getCard(cardId)
  } catch {
    return null
  }
}

/**
 * 生成新卡片（AI生成流程）
 * 
 * @param templateId 卡片模板ID
 * @param query 用户问题
 * @param data 可选：如果模板需要数据，先调用数据API获取
 * @returns 新创建的卡片
 */
export async function generateCard(
  templateId: string,
  query: string,
  data?: Record<string, unknown>
): Promise<CardInstance> {
  // 模拟API延迟
  await new Promise((resolve) => setTimeout(resolve, 300))

  const config = getCardTemplateConfig(templateId as any)
  
  // 这里应该调用后端API创建卡片
  // POST /api/cards
  // 实际实现时，后端会：
  // 1. 如果requiresData，先调用AINO数据API
  // 2. AI生成卡片数据
  // 3. 创建卡片实例
  // 4. 返回卡片ID

  // Mock实现：返回一个示例卡片
  return {
    id: `${templateId}-${Date.now()}`,
    templateId: templateId as any,
    componentName: config.componentName,
    dataSource: config.dataSource,
    data: data || {
      title: "AI生成的卡片",
      summary: `基于问题"${query}"生成的内容`,
    },
    metadata: {
      category: "industry",
      tags: ["AI生成"],
      createdAt: new Date().toISOString(),
      generatedReason: query,
      generatedQuery: query,
    },
  }
}

