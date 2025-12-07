/**
 * 三层配置合并逻辑
 * 根据完整方案文档实现：类型模板 + 内容配置 + 用户个性化
 * 
 * 合并优先级：
 * 1. 类型模板（Type Template）：定义基础框架和约束
 * 2. 内容配置（Content Config）：AI根据内容生成，可扩展卡片
 * 3. 用户个性化（User Personalization）：用户可覆盖、调整、隐藏
 */

import type { ReportConfig } from "../types/card-types"
import type { CardTemplateId } from "../types/card-types"

/**
 * 类型模板配置（系统级，语义化配置）
 */
export interface TypeTemplateConfig {
  id: string
  name: string
  configMode: "personalization" | "content-driven"
  framework: {
    requiredCards?: CardTemplateId[] // 必须包含的卡片
    optionalCards?: CardTemplateId[] // 可选卡片
    defaultCardCount?: number // 默认卡片数量
  }
  contentDrivenRules?: {
    // 内容驱动规则（产业分析模式）
    industryMapping?: Record<string, CardTemplateId[]> // 行业映射到卡片
    companySizeMapping?: Record<string, CardTemplateId[]> // 企业规模映射
  }
}

/**
 * 内容配置（数据级，AI生成）
 */
export interface ContentConfig {
  industry?: string // 行业
  companySize?: string // 企业规模
  generatedCardConfig?: {
    // AI生成的卡片配置
    cards: CardTemplateId[]
    order: CardTemplateId[]
    importance: Record<CardTemplateId, number> // 重要性评分
  }
}

/**
 * 用户个性化配置（用户级）
 */
export interface UserPersonalizationConfig {
  cardCount?: number // 用户选择的卡片数量
  cardSelection?: {
    selected: CardTemplateId[] // 用户选择的卡片
    order: CardTemplateId[] // 用户调整的顺序
    hidden: CardTemplateId[] // 用户隐藏的卡片
  }
  displayPreferences?: {
    layoutType?: "tabs-sticky" | "single-page" | "accordion"
    [key: string]: any
  }
}

/**
 * 合并后的配置
 */
export interface MergedConfig {
  cards: CardTemplateId[]
  order: CardTemplateId[]
  layoutType: string
  tabs?: Array<{
    id: string
    label: string
    cardIds: string[]
  }>
}

/**
 * 合并三层配置
 * 
 * @param typeTemplate 类型模板配置
 * @param contentConfig 内容配置（可选）
 * @param userPersonalization 用户个性化配置（可选）
 * @returns 合并后的配置
 */
export function mergeConfigs(
  typeTemplate: TypeTemplateConfig,
  contentConfig?: ContentConfig,
  userPersonalization?: UserPersonalizationConfig
): MergedConfig {
  let finalCards: CardTemplateId[] = []
  let finalOrder: CardTemplateId[] = []

  // ===== 第一步：根据配置模式选择基础卡片 =====
  if (typeTemplate.configMode === "content-driven") {
    // 内容驱动模式（产业分析）
    if (contentConfig?.generatedCardConfig) {
      // 使用AI生成的内容配置
      finalCards = contentConfig.generatedCardConfig.cards
      finalOrder = contentConfig.generatedCardConfig.order || finalCards
    } else if (contentConfig?.industry && typeTemplate.contentDrivenRules?.industryMapping) {
      // 根据行业映射生成卡片
      const industryCards = typeTemplate.contentDrivenRules.industryMapping[contentConfig.industry] || []
      finalCards = [...(typeTemplate.framework.requiredCards || []), ...industryCards]
      finalOrder = finalCards
    } else {
      // 使用默认框架
      finalCards = typeTemplate.framework.requiredCards || []
      finalOrder = finalCards
    }
  } else {
    // 个性化模式（任务类）
    finalCards = [
      ...(typeTemplate.framework.requiredCards || []),
      ...(typeTemplate.framework.optionalCards || []),
    ]
    finalOrder = finalCards
  }

  // ===== 第二步：应用用户个性化 =====
  if (userPersonalization) {
    // 用户选择卡片
    if (userPersonalization.cardSelection?.selected && userPersonalization.cardSelection.selected.length > 0) {
      finalCards = userPersonalization.cardSelection.selected
    }

    // 用户调整顺序
    if (userPersonalization.cardSelection?.order && userPersonalization.cardSelection.order.length > 0) {
      finalOrder = userPersonalization.cardSelection.order.filter((id) =>
        finalCards.includes(id)
      )
      // 添加用户未排序的卡片
      const unorderedCards = finalCards.filter(
        (id) => !finalOrder.includes(id)
      )
      finalOrder = [...finalOrder, ...unorderedCards]
    }

    // 用户隐藏卡片
    if (userPersonalization.cardSelection?.hidden && userPersonalization.cardSelection.hidden.length > 0) {
      finalCards = finalCards.filter(
        (id) => !userPersonalization.cardSelection?.hidden?.includes(id)
      )
      finalOrder = finalOrder.filter(
        (id) => !userPersonalization.cardSelection?.hidden?.includes(id)
      )
    }

    // 用户选择卡片数量
    if (userPersonalization.cardCount && userPersonalization.cardCount < finalCards.length) {
      // 根据重要性排序，选择前N张
      if (contentConfig?.generatedCardConfig?.importance) {
        const sortedByImportance = [...finalCards].sort(
          (a, b) =>
            (contentConfig.generatedCardConfig!.importance[b] || 0) -
            (contentConfig.generatedCardConfig!.importance[a] || 0)
        )
        finalCards = sortedByImportance.slice(0, userPersonalization.cardCount)
        finalOrder = finalOrder.filter((id) => finalCards.includes(id))
      } else {
        // 没有重要性评分，直接截取
        finalCards = finalCards.slice(0, userPersonalization.cardCount)
        finalOrder = finalOrder.filter((id) => finalCards.includes(id))
      }
    }
  }

  // ===== 第三步：构建标签页配置（产业分析使用tabs-sticky布局）=====
  const layoutType =
    userPersonalization?.displayPreferences?.layoutType || "tabs-sticky"

  let tabs: Array<{ id: string; label: string; cardIds: string[] }> | undefined

  if (layoutType === "tabs-sticky" && finalCards.length > 0) {
    // 产业分析报告的标签页分组
    tabs = [
      {
        id: "structure",
        label: "结构 & 趋势",
        cardIds: finalOrder.slice(0, 5).map((id) => `${id}-001`),
      },
      {
        id: "capital",
        label: "资金 & 生态",
        cardIds: finalOrder.slice(5, 11).map((id) => `${id}-001`),
      },
      {
        id: "strategy",
        label: "战略 & 人物",
        cardIds: finalOrder.slice(11).map((id) => `${id}-001`),
      },
    ].filter((tab) => tab.cardIds.length > 0) // 过滤空标签页
  }

  return {
    cards: finalCards,
    order: finalOrder,
    layoutType,
    tabs,
  }
}

/**
 * 从报告记录中提取内容配置
 */
export function extractContentConfig(record: any): ContentConfig | undefined {
  if (!record) return undefined

  return {
    industry: record.industry_name,
    companySize: record.company_size,
    generatedCardConfig: record.content_config
      ? {
          cards: record.content_config.cards || [],
          order: record.content_config.order || [],
          importance: record.content_config.importance || {},
        }
      : undefined,
  }
}

/**
 * 从用户偏好中提取个性化配置
 * 支持从后端API获取，如果失败则降级到localStorage
 */
export async function getUserPersonalization(
  applicationId: string,
  userId: string,
  taskId?: string
): Promise<UserPersonalizationConfig | undefined> {
  // 尝试从后端API获取用户个性化配置
  try {
    const { apiRequest } = await import("@/lib/aino-sdk/sdk-instance")
    const { getAPIConfig } = await import("./api-config")
    const apiConfig = getAPIConfig()
    
    // 如果启用了后端API，尝试从后端获取
    if (apiConfig.useBackendAPI) {
      const taskIdParam = taskId || "industry-analysis"
      const response = await apiRequest(
        `/api/modules/system/user/${userId}/personalization?applicationId=${applicationId}&taskId=${taskIdParam}`,
        {
          method: "GET",
        }
      )
      
      if (response.success && response.data?.personalization) {
        console.log("[getUserPersonalization] 从后端API获取成功")
        // 同时更新localStorage作为缓存
        if (typeof window !== "undefined") {
          const key = `user_personalization_${applicationId}_${userId}_${taskIdParam}`
          localStorage.setItem(key, JSON.stringify(response.data.personalization))
        }
        return response.data.personalization
      }
    }
  } catch (error: any) {
    // 检查是否是404错误（用户个性化配置不存在）
    const isNotFound = 
      error?.isPersonalizationNotFound === true ||
      error?.isNotFound === true ||
      error?.status === 404 ||
      error?.message?.includes('404') ||
      error?.message?.includes('Personalization not found')
    
    if (isNotFound) {
      // 404错误是正常的（用户个性化配置不存在，使用默认配置），不记录警告
      // 直接降级到localStorage
    } else {
      // 其他错误才警告
      console.warn("[getUserPersonalization] 后端API获取失败，降级到localStorage:", error?.message || error)
    }
  }

  // 降级：从localStorage读取（开发测试用或后端API不可用时）
  if (typeof window !== "undefined") {
    const taskIdParam = taskId || "industry-analysis"
    const key = `user_personalization_${applicationId}_${userId}_${taskIdParam}`
    const stored = localStorage.getItem(key)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        console.log("[getUserPersonalization] 从localStorage读取成功")
        return parsed
      } catch (e) {
        console.error("解析用户个性化配置失败:", e)
      }
    }
  }

  return undefined
}

/**
 * 保存用户个性化配置
 * 支持保存到后端API，如果失败则降级到localStorage
 */
export async function saveUserPersonalization(
  applicationId: string,
  userId: string,
  personalization: UserPersonalizationConfig,
  taskId?: string
): Promise<boolean> {
  // 先保存到localStorage（作为缓存）
  if (typeof window !== "undefined") {
    const taskIdParam = taskId || "industry-analysis"
    const key = `user_personalization_${applicationId}_${userId}_${taskIdParam}`
    try {
      localStorage.setItem(key, JSON.stringify(personalization))
      console.log("[saveUserPersonalization] 已保存到localStorage")
    } catch (e) {
      console.error("保存用户个性化配置到localStorage失败:", e)
    }
  }

  // 尝试保存到后端API
  try {
    const { apiRequest } = await import("@/lib/aino-sdk/sdk-instance")
    const { getAPIConfig } = await import("./api-config")
    const apiConfig = getAPIConfig()
    
    // 如果启用了后端API，尝试保存到后端
    if (apiConfig.useBackendAPI) {
      const taskIdParam = taskId || "industry-analysis"
      const response = await apiRequest(
        `/api/modules/system/user/${userId}/personalization?applicationId=${applicationId}&taskId=${taskIdParam}`,
        {
          method: "PUT",
          body: JSON.stringify({ personalization }),
        }
      )
      
      if (response.success) {
        console.log("[saveUserPersonalization] 已保存到后端API")
        return true
      } else {
        console.warn("[saveUserPersonalization] 后端API保存失败，已保存到localStorage")
        return false
      }
    }
  } catch (error) {
    // 后端API失败，但已保存到localStorage
    console.warn("[saveUserPersonalization] 后端API保存失败，已保存到localStorage:", error)
    return false
  }

  // 如果未启用后端API，只保存到localStorage
  return true
}

