/**
 * 产业分析模块 API
 * 从后端模块/目录读取数据，实现三层配置体系
 * 
 * 数据流转：
 * 1. 主报告目录（industry-analysis-report）→ 获取 cardTemplateIds 配置
 * 2. 根据 cardTemplateIds，从对应的卡片目录读取 records
 * 3. 合并三层配置：类型模板 + 内容配置 + 用户个性化
 * 4. 生成卡片实例列表
 * 
 * 支持双模式：
 * - Mock API（默认）：使用本地JSON数据
 * - 后端API（可选）：从后端模块/目录读取
 */

import { apiRequest } from "@/lib/aino-sdk/sdk-instance"
import { getAINOConfig } from "@/lib/aino-sdk/config"
import { getAPIConfig } from "../config/api-config"
import { loadTypeTemplate } from "../config/type-template-loader"
import { mergeConfigs, extractContentConfig, getUserPersonalization } from "../config/config-merger"
import { loadCardData } from "../storage/storage-strategy"
import { isCardMigrated } from "../config/card-migration-config"
import type { CardInstance, ReportConfig, ReportWithCards } from "../types/card-types"
import { CARD_TEMPLATE_CONFIGS } from "../config/card-template-config"
import type { CardTemplateId } from "../types/card-types"
import { getReportWithCards as getMockReportWithCards, getCard as getMockCard } from "./card-api-mock"

/**
 * 目录信息（从后端获取）
 */
interface DirectoryInfo {
  id: string
  name: string
  slug: string
  config?: {
    isMasterReport?: boolean
    cardTemplateIds?: string[]
    [key: string]: any
  }
}

/**
 * 记录数据（从目录的 records 表读取）
 */
interface RecordData {
  id: string
  [key: string]: any
}

/**
 * 简单的内存缓存（用于提升性能）
 */
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5分钟缓存

/**
 * 从缓存获取数据
 */
function getFromCache(key: string): any | null {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }
  cache.delete(key)
  return null
}

/**
 * 保存数据到缓存
 */
function setCache(key: string, data: any): void {
  cache.set(key, { data, timestamp: Date.now() })
}

/**
 * 获取应用的模块列表
 */
async function getApplicationModules(applicationId: string) {
  // 优先使用 ApplicationService 的 API（这个API能正确返回modules表中的模块）
  // 这个API返回格式：{ success: true, data: { application: {...}, modules: [...] } }
  // 注意：这个API在 noAuth 模式下可能有问题，需要修复
  try {
    const response = await apiRequest(`/api/applications/${applicationId}/modules`)
    if (response.success && response.data) {
      // 处理不同的响应格式
      const modules = response.data.modules || response.data || []
      if (Array.isArray(modules) && modules.length > 0) {
        console.log(`[IndustryAnalysisAPI] ✅ 使用 /api/applications/{id}/modules API，获取到 ${modules.length} 个模块`)
        return modules
      }
    }
  } catch (error) {
    console.warn(`[IndustryAnalysisAPI] ⚠️ /api/applications/{id}/modules 失败，降级到 /api/modules/installed:`, error)
  }
  
  // 降级：使用 ModuleService 的 API（这个API查询modules和module_installs表）
  // 注意：这个API目前返回空数组，需要修复
  const response = await apiRequest(`/api/modules/installed?applicationId=${applicationId}`)
  if (!response.success) {
    throw new Error(response.error || "获取模块列表失败")
  }
  // 后端返回格式：{ success: true, data: { modules: [...], pagination: {...} } }
  const modules = response.data?.modules || response.modules || response.data?.data?.modules || 
                  (Array.isArray(response.data) ? response.data : [])
  
  // 详细打印所有模块信息，包括所有字段
  console.log(`[IndustryAnalysisAPI] ========== 模块列表详情 ==========`)
  console.log(`[IndustryAnalysisAPI] 完整响应对象:`, JSON.stringify(response, null, 2))
  console.log(`[IndustryAnalysisAPI] response.data:`, JSON.stringify(response.data, null, 2))
  console.log(`[IndustryAnalysisAPI] response.data?.modules:`, response.data?.modules)
  console.log(`[IndustryAnalysisAPI] response.modules:`, response.modules)
  console.log(`[IndustryAnalysisAPI] 获取到 ${modules.length} 个模块`)
  console.log(`[IndustryAnalysisAPI] 解析后的模块数组:`, modules)
  
  if (modules.length > 0) {
    console.log(`[IndustryAnalysisAPI] 所有模块的详细信息:`)
    modules.forEach((m: any, index: number) => {
      console.log(`[IndustryAnalysisAPI] 模块 #${index + 1}:`, {
        id: m.id,
        moduleKey: m.moduleKey,
        key: m.key,
        name: m.name,
        moduleName: m.moduleName,
        type: m.type,
        moduleType: m.moduleType,
        installStatus: m.installStatus,
        // 打印所有字段，看看还有什么
        allFields: Object.keys(m),
        fullObject: m
      })
    })
    
    // 打印所有可能的标识符
    console.log(`[IndustryAnalysisAPI] 所有模块的标识符列表:`)
    modules.forEach((m: any, index: number) => {
      const identifiers = [
        m.moduleKey && `moduleKey: "${m.moduleKey}"`,
        m.key && `key: "${m.key}"`,
        m.name && `name: "${m.name}"`,
        m.moduleName && `moduleName: "${m.moduleName}"`,
      ].filter(Boolean).join(', ')
      console.log(`[IndustryAnalysisAPI]   模块 #${index + 1}: ${identifiers || '无标识符'}`)
    })
  } else {
    console.warn(`[IndustryAnalysisAPI] ⚠️ 模块列表为空！`)
  }
  console.log(`[IndustryAnalysisAPI] =================================`)
  
  return modules
}

/**
 * 获取模块的目录列表
 */
async function getModuleDirectories(applicationId: string, moduleId: string) {
  const response = await apiRequest(
    `/api/directories?applicationId=${applicationId}&moduleId=${moduleId}`
  )
  if (!response.success) {
    throw new Error(response.error || "获取目录列表失败")
  }
  // 后端返回格式：{ success: true, data: { directories: [...] } }
  return response.data?.directories || response.data || []
}

/**
 * 获取目录的记录列表
 * 注意：后端API路径是 /api/records/:dirId?applicationId=xxx
 */
async function getDirectoryRecords(applicationId: string, directoryId: string) {
  const response = await apiRequest(
    `/api/records/${directoryId}?applicationId=${applicationId}&page=1&limit=100`
  )
  if (!response.success) {
    throw new Error(response.error || "获取记录列表失败")
  }
  // 后端返回格式：{ success: true, data: { records: [...] } } 或 { success: true, records: [...] }
  return response.data?.records || response.records || response.data || []
}

/**
 * 获取主报告记录（从 industry-analysis-report 目录）
 */
async function getMasterReportRecord(
  applicationId: string,
  reportDirectoryId: string,
  industry?: string
): Promise<RecordData | null> {
  const records = await getDirectoryRecords(applicationId, reportDirectoryId)
  // 如果指定了industry，通过industry字段或industry_name字段过滤
  if (industry && records.length > 0) {
    // 尝试多种匹配方式
    const filtered = records.filter((r: any) => {
      // 方式1：industry字段是多选数组，检查是否包含目标industry
      if (r.industry) {
        // 如果是数组，检查是否包含
        if (Array.isArray(r.industry)) {
          if (r.industry.includes(industry)) return true
        }
        // 如果是字符串（向后兼容），直接匹配
        else if (r.industry === industry) {
          return true
        }
      }
      // 方式2：匹配industry_name（支持多选数组和字符串格式）
      if (r.industry_name) {
        let industryNameArray: string[] = []
        // 如果是数组（多选），提取所有值
        if (Array.isArray(r.industry_name)) {
          industryNameArray = r.industry_name.filter((name: any) => name && typeof name === 'string')
        }
        // 如果是字符串（向后兼容），转换为数组
        else if (typeof r.industry_name === 'string') {
          industryNameArray = [r.industry_name]
        }
        
        // 检查数组中是否包含匹配的行业名称
        for (const name of industryNameArray) {
          const nameLower = name.toLowerCase()
          if (industry === "ai" && (nameLower.includes("ai") || name.includes("人工智能"))) return true
          if (industry === "blockchain" && (nameLower.includes("blockchain") || name.includes("区块链"))) return true
        }
      }
      return false
    })
    return filtered[0] || records[0] || null
  }
  return records[0] || null
}

/**
 * 将目录记录转换为卡片实例
 * 注意：后端返回的记录数据已经从 props 字段展开
 * 格式：{ id, _recordId, version, createdAt, updatedAt, ...props中的所有字段 }
 */
function recordToCardInstance(
  record: RecordData,
  templateId: CardTemplateId,
  directorySlug: string
): CardInstance {
  // 后端返回的记录数据已经从 props 展开
  // 使用 _recordId 作为记录主键ID（如果存在），否则使用 id
  const recordId = (record as any)._recordId || record.id

  // 获取时间信息（在函数开头定义，确保所有返回路径都能使用）
  // 优先使用 updatedAt（记录最后更新时间），如果没有则使用 createdAt
  // 后端返回的格式可能是：{ updatedAt: Date, updated_at: Date, ... } 或 { updatedAt: string, ... }
  const updatedAt = (record as any).updatedAt || (record as any).updated_at || (record as any).generated_at || (record as any).createdAt || record.created_at
  const createdAt = (record as any).generated_at || (record as any).createdAt || record.created_at || new Date().toISOString()
  
  // 如果 updatedAt 不存在，使用 createdAt（新创建的记录可能 updatedAt 等于 createdAt）
  const finalUpdatedAt = updatedAt || createdAt

  const templateConfig = CARD_TEMPLATE_CONFIGS[templateId]
  if (!templateConfig) {
    // 如果模板不存在，使用通用配置（降级处理）
    console.warn(`[IndustryAnalysisAPI] 卡片模板未找到: ${templateId}，使用通用配置`)
    return {
      id: `${templateId}-${recordId}`,
      templateId,
      componentName: "GenericCard", // 使用通用卡片组件
      dataSource: "api",
      data: {
        title: (record as any).title || templateId,
        summary: (record as any).summary || "",
        ...Object.keys(record).reduce((acc, key) => {
          const systemFields = ['id', '_recordId', '_isLocal', 'version', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy', 
                                'created_at', 'updated_at', 'created_by', 'updated_by', '__dirId', 'card_id', 'tags', 'ai_analysis']
          if (!systemFields.includes(key)) {
            acc[key] = (record as any)[key]
          }
          return acc
        }, {} as Record<string, any>),
        // 将时间信息添加到 data 中
        updatedAt: finalUpdatedAt,
        createdAt: createdAt,
      },
      metadata: {
        category: "industry",
        tags: [templateId, directorySlug],
        createdAt: createdAt,
        updatedAt: finalUpdatedAt,
      },
    }
  }

  // 从展开的记录中提取卡片数据
  // 支持多种字段名：summary/summary_text, chart_data/chartData, detail_content/detailContent
  // 后端可能返回 snake_case 或 camelCase，需要兼容两种格式
  const cardData: Record<string, any> = {
    // title 应该从 record.title 获取，不是 summary
    title: (record as any).title || record.summary || (record as any).summary_text || (record as any).report_title || "",
    summary: record.summary || (record as any).summary_text || "",
    icon: (record as any).icon || "",
    // 根据模板类型提取不同的数据字段（兼容 snake_case 和 camelCase）
    // 处理 JSON 字符串字段（如果后端返回的是字符串，需要解析）
    ...((record as any).levels && { 
      levels: typeof (record as any).levels === 'string' 
        ? JSON.parse((record as any).levels) 
        : (record as any).levels 
    }),
    ...((record as any).chart_data && { 
      chartData: typeof (record as any).chart_data === 'string'
        ? JSON.parse((record as any).chart_data)
        : (record as any).chart_data
    }),
    ...(record.chartData && { chartData: record.chartData }),
    ...((record as any).radar_data && { 
      radarData: typeof (record as any).radar_data === 'string'
        ? JSON.parse((record as any).radar_data)
        : (record as any).radar_data
    }),
    ...(record.radarData && { radarData: record.radarData }),
    ...((record as any).shift_data && { 
      shiftData: typeof (record as any).shift_data === 'string'
        ? JSON.parse((record as any).shift_data)
        : (record as any).shift_data
    }),
    ...((record as any).events && { 
      events: typeof (record as any).events === 'string'
        ? JSON.parse((record as any).events)
        : (record as any).events
    }),
    ...((record as any).metrics && { 
      metrics: typeof (record as any).metrics === 'string'
        ? JSON.parse((record as any).metrics)
        : (record as any).metrics
    }),
    ...((record as any).players && { 
      players: typeof (record as any).players === 'string'
        ? JSON.parse((record as any).players)
        : (record as any).players
    }),
    ...((record as any).items && { 
      items: typeof (record as any).items === 'string'
        ? JSON.parse((record as any).items)
        : (record as any).items
    }),
    ...((record as any).timeline && { 
      timeline: typeof (record as any).timeline === 'string'
        ? JSON.parse((record as any).timeline)
        : (record as any).timeline
    }),
    ...((record as any).people && { 
      people: typeof (record as any).people === 'string'
        ? JSON.parse((record as any).people)
        : (record as any).people
    }),
    ...((record as any).scenarios && { 
      scenarios: typeof (record as any).scenarios === 'string'
        ? JSON.parse((record as any).scenarios)
        : (record as any).scenarios
    }),
    ...((record as any).risks && { 
      risks: typeof (record as any).risks === 'string'
        ? JSON.parse((record as any).risks)
        : (record as any).risks
    }),
    ...((record as any).factors && { 
      factors: typeof (record as any).factors === 'string'
        ? JSON.parse((record as any).factors)
        : (record as any).factors
    }),
    ...((record as any).strategies && { 
      strategies: typeof (record as any).strategies === 'string'
        ? JSON.parse((record as any).strategies)
        : (record as any).strategies
    }),
    ...((record as any).chart_config && { 
      chartConfig: typeof (record as any).chart_config === 'string'
        ? JSON.parse((record as any).chart_config)
        : (record as any).chart_config
    }),
    ...((record as any).action_text && { actionText: (record as any).action_text }),
    ...(record.actionText && { actionText: record.actionText }),
    ...((record as any).detail_content && { detailContent: (record as any).detail_content }),
    ...(record.detailContent && { detailContent: record.detailContent }),
    // 保留所有其他业务字段（排除系统字段）
    ...Object.keys(record).reduce((acc, key) => {
      // 跳过系统字段和已处理的字段
      const systemFields = ['id', '_recordId', '_isLocal', 'version', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy', 
                            'created_at', 'updated_at', 'created_by', 'updated_by', '__dirId', 'card_id', 'tags', 'ai_analysis']
      const processedFields = ['summary', 'summary_text', 'report_title', 'title', 'icon', 'chart_data', 'chartData', 
                               'radar_data', 'radarData', 'shift_data', 'events', 'metrics', 'players', 'items', 
                               'timeline', 'people', 'scenarios', 'risks', 'factors', 'strategies', 'chart_config',
                               'action_text', 'actionText', 'detail_content', 'detailContent', 'levels']
      if (!systemFields.includes(key) && !processedFields.includes(key)) {
        // 如果是字符串且看起来像JSON，尝试解析
        const value = (record as any)[key]
        if (typeof value === 'string' && (value.startsWith('[') || value.startsWith('{'))) {
          try {
            acc[key] = JSON.parse(value)
          } catch {
            acc[key] = value
          }
        } else {
          acc[key] = value
        }
      }
      return acc
    }, {} as Record<string, any>),
  }

  // 构建卡片实例
  return {
    id: `${templateId}-${recordId}`,
    templateId,
    componentName: templateConfig.componentName,
    dataSource: "api",
    data: {
      ...cardData,
      // 将时间信息添加到 data 中，方便卡片组件使用
      updatedAt: finalUpdatedAt,
      createdAt: createdAt,
    },
    metadata: {
      category: "industry",
      tags: [templateId, directorySlug],
      createdAt: createdAt,
      updatedAt: updatedAt,
    },
  }
}

/**
 * 获取产业分析报告配置（从主报告目录）
 */
export async function getIndustryAnalysisReportConfig(
  applicationId: string,
  moduleKey: string = "industry-analysis",
  industry?: string
): Promise<ReportConfig> {
  // 1. 获取模块列表
  const modules = await getApplicationModules(applicationId)
  console.log(`[IndustryAnalysisAPI] 应用 ${applicationId} 的模块列表:`, modules.map((m: any) => ({ 
    id: m.id, 
    moduleKey: m.moduleKey, 
    moduleName: m.moduleName,
    key: m.key,
    name: m.name
  })))
  
  // 尝试多种方式查找模块：moduleKey、key、name
  const module = modules.find((m: any) => 
    m.moduleKey === moduleKey || 
    m.key === moduleKey || 
    m.name === moduleKey ||
    (m.moduleKey && m.moduleKey.startsWith(moduleKey)) // 支持带实例后缀的key，如 industry-analysis#1
  )
  
  if (!module) {
    const availableKeys = modules.map((m: any) => m.moduleKey || m.key || m.name).filter(Boolean)
    throw new Error(
      `模块未找到: ${moduleKey}\n` +
      `可用模块: ${availableKeys.length > 0 ? availableKeys.join(', ') : '无'}\n` +
      `请确保已导入产业分析模块到应用中。`
    )
  }
  
  console.log(`[IndustryAnalysisAPI] ✅ 找到模块:`, { 
    id: module.id, 
    moduleKey: module.moduleKey || module.key,
    moduleName: module.moduleName || module.name
  })

  // 2. 获取模块的目录列表
  const directories = await getModuleDirectories(applicationId, module.id)
  
  // 3. 找到主报告目录
  // 优先精确匹配，失败时尝试模糊匹配（处理带时间戳的 slug）
  let reportDirectory = directories.find(
    (d: DirectoryInfo) => d.slug === "industry-analysis-report" || d.config?.isMasterReport
  )
  
  if (!reportDirectory) {
    // 模糊匹配：查找 slug 中包含 "industry-analysis-report" 的目录
    reportDirectory = directories.find((d: DirectoryInfo) => 
      d.slug.includes("industry-analysis-report") || d.config?.isMasterReport
    )
  }
  if (!reportDirectory) {
    throw new Error("主报告目录未找到")
  }

  // 4. 获取主报告记录（支持按industry过滤）
  const reportRecord = await getMasterReportRecord(applicationId, reportDirectory.id, industry)
  
  // 5. 从目录配置或记录中获取 cardTemplateIds
  let cardTemplateIds =
    reportDirectory.config?.cardTemplateIds ||
    reportRecord?.report_config?.cardTemplateIds ||
    []

  // 如果后端没有配置cardTemplateIds，使用默认的17个卡片列表
  if (!cardTemplateIds || cardTemplateIds.length === 0) {
    console.log("[IndustryAnalysisAPI] ⚠️ 后端未配置cardTemplateIds，使用默认卡片列表")
    cardTemplateIds = [
      "industry-stack",
      "trend-radar",
      "structural-shift",
      "tech-timeline",
      "industry-pace",
      "capital-flow",
      "capital-ecosystem",
      "player-impact",
      "narrative-capital",
      "supply-chain-health",
      "ecosystem-map",
      "strategy-window",
      "influencer",
      "scenario",
      "shock-simulation",
      "factor-weighting",
      "insight-compression",
    ]
  }

  console.log(`[IndustryAnalysisAPI] 📋 卡片模板ID列表 (${cardTemplateIds.length}个):`, cardTemplateIds.join(', '))

  // 6. 解析主报告记录的其他字段
  let momentumData: Array<{ m: string; growth: number; cap: number; heat: number }> | undefined
  if (reportRecord?.momentum_data) {
    try {
      momentumData = typeof reportRecord.momentum_data === 'string' 
        ? JSON.parse(reportRecord.momentum_data) 
        : reportRecord.momentum_data
    } catch (e) {
      console.warn(`[IndustryAnalysisAPI] 解析momentum_data失败:`, e)
    }
  }

  // 7. 解析 report_config（完全配置驱动）
  let reportConfigData: any = {}
  if (reportRecord?.report_config) {
    try {
      reportConfigData = typeof reportRecord.report_config === 'string'
        ? JSON.parse(reportRecord.report_config)
        : reportRecord.report_config
    } catch (e) {
      console.warn(`[IndustryAnalysisAPI] 解析report_config失败:`, e)
    }
  }

  // 8. 确定 layoutType（优先从配置读取，否则默认）
  const layoutType = reportConfigData.layoutType || "tabs-sticky"
  console.log(`[IndustryAnalysisAPI] 📐 布局类型: ${layoutType} (${reportConfigData.layoutType ? '来自配置' : '使用默认'})`)

  // 9. 确定 tabs（优先从配置读取，否则按默认规则生成）
  let tabs: Array<{ id: string; label: string; cardIds: string[] }> | undefined
  
  if (reportConfigData.tabs && Array.isArray(reportConfigData.tabs) && reportConfigData.tabs.length > 0) {
    // 使用配置的 tabs
    console.log(`[IndustryAnalysisAPI] 📋 使用配置的 tabs (${reportConfigData.tabs.length} 个)`)
    tabs = reportConfigData.tabs.map((tab: any) => {
      // 处理 cardIds：如果是 templateId 格式，需要转换为 cardId 格式（与之前保持一致：使用 -001）
      const processedCardIds = (tab.cardIds || []).map((cardId: string) => {
        // 如果 cardId 是 templateId 格式（不包含 -），需要转换为 cardId 格式
        if (cardId && !cardId.includes('-')) {
          // templateId 格式，转换为 cardId 格式（使用 -001，与之前保持一致）
          return `${cardId}-001`
        }
        // 已经是 cardId 格式，直接返回
        return cardId
      })
      
      return {
        id: tab.id || `tab-${Math.random().toString(36).substr(2, 9)}`,
        label: tab.label || '未命名标签',
        cardIds: processedCardIds
      }
    })
  } else {
    // 使用默认规则生成 tabs（与之前保持一致：使用 -001）
    console.log(`[IndustryAnalysisAPI] 📋 使用默认规则生成 tabs`)
    tabs = [
      {
        id: "structure",
        label: "结构 & 趋势",
        cardIds: cardTemplateIds.slice(0, 5).map((id: string) => `${id}-001`),
      },
      {
        id: "capital",
        label: "资金 & 生态",
        cardIds: cardTemplateIds.slice(5, 11).map((id: string) => `${id}-001`),
      },
      {
        id: "strategy",
        label: "战略 & 人物",
        cardIds: cardTemplateIds.slice(11).map((id: string) => `${id}-001`),
      },
    ].filter((tab) => tab.cardIds.length > 0) // 过滤空标签页
  }

  // 10. 构建报告配置
  return {
    id: `industry-analysis-${applicationId}`,
    name: reportRecord?.report_title || "产业分析报告",
    summary: reportRecord?.summary || reportRecord?.report_summary || undefined,
    totalMarket: reportRecord?.total_market || undefined,
    growth: reportRecord?.growth || undefined,
    momentumData,
    category: "industry",
    version: 1,
    layoutType,
    tabs,
    metadata: {
      createdAt: reportRecord?.created_at || new Date().toISOString(),
      updatedAt: reportRecord?.updated_at || new Date().toISOString(),
      totalCards: cardTemplateIds.length,
    },
  }
}

/**
 * 获取产业分析报告及其所有卡片数据
 * 支持双模式：Mock API（默认） + 后端API（可选）
 */
export async function getIndustryAnalysisReportWithCards(
  applicationId: string,
  moduleKey: string = "industry-analysis",
  industry?: string
): Promise<ReportWithCards> {
  const config = getAPIConfig()

  // 如果有applicationId，默认使用后端API（真正从模块/目录读取数据）
  // 如果没有applicationId或明确禁用后端API，才使用Mock API
  const shouldUseBackendAPI = config.useBackendAPI !== false && !!applicationId

  if (!shouldUseBackendAPI) {
    console.log("[IndustryAnalysisAPI] 使用Mock API（无applicationId或已禁用后端API）")
    return getMockReportWithCards("ai-industry-report-v1")
  }

  // 检查缓存
  const cacheKey = `report_${applicationId}_${moduleKey}`
  const cached = getFromCache(cacheKey)
  if (cached) {
    console.log("[IndustryAnalysisAPI] 使用缓存数据")
    return cached
  }

  // 使用后端API
  console.log("[IndustryAnalysisAPI] 使用后端API" + (industry ? ` (产业: ${industry})` : ""))
  // 1. 获取报告配置（支持按industry过滤）
  const reportConfig = await getIndustryAnalysisReportConfig(applicationId, moduleKey, industry)

  // 2. 获取模块和目录信息（这里重复获取是为了确保模块存在，实际已经在getIndustryAnalysisReportConfig中获取过了）
  const modules = await getApplicationModules(applicationId)
  // 尝试多种方式查找模块：moduleKey、key、name
  const module = modules.find((m: any) => 
    m.moduleKey === moduleKey || 
    m.key === moduleKey || 
    m.name === moduleKey ||
    (m.moduleKey && m.moduleKey.startsWith(moduleKey)) // 支持带实例后缀的key，如 industry-analysis#1
  )
  
  if (!module) {
    const availableKeys = modules.map((m: any) => m.moduleKey || m.key || m.name).filter(Boolean)
    throw new Error(
      `模块未找到: ${moduleKey}\n` +
      `可用模块: ${availableKeys.length > 0 ? availableKeys.join(', ') : '无'}\n` +
      `请确保已导入产业分析模块到应用中。`
    )
  }

  const directories = await getModuleDirectories(applicationId, module.id)
  
  // 3. 获取所有卡片ID（从tabs中提取）
  const allCardIds = reportConfig.tabs?.flatMap((tab) => tab.cardIds) || []

  // 4. 加载类型模板（用于配置合并）
  const typeTemplate = await loadTypeTemplate("industry-analysis", applicationId)
  
  // 5. 获取主报告记录（用于提取内容配置，支持按industry过滤）
  const reportDirectory = directories.find(
    (d: DirectoryInfo) => d.slug === "industry-analysis-report" || d.config?.isMasterReport
  )
  const reportRecord = reportDirectory
    ? await getMasterReportRecord(applicationId, reportDirectory.id, industry)
    : null

  // 6. 提取内容配置
  const contentConfig = extractContentConfig(reportRecord)

  // 7. 获取用户个性化配置
  // 从localStorage获取当前用户ID
  let userId = "current-user"
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem("aino_user")
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        userId = user.userId || user.id || "current-user"
      } catch (e) {
        console.error("解析用户信息失败:", e)
      }
    }
  }
  const userPersonalization = await getUserPersonalization(applicationId, userId)

  // 8. 合并三层配置（如果类型模板存在）
  // 从 tabs 的 cardIds 中提取 templateId
  // 支持多种格式：
  // 1. ${templateId}-001 -> templateId
  // 2. ${templateId}-${industry} -> templateId (如 industry-stack-blockchain -> industry-stack)
  // 3. ${templateId}-${recordId} -> templateId
  let finalCardTemplateIds = reportConfig.tabs?.flatMap((tab) =>
    tab.cardIds.map((id: string) => {
      if (!id.includes('-')) {
        return id // 已经是 templateId
      }
      const parts = id.split('-')
      // 如果最后一部分是 '001'，去掉它
      if (parts[parts.length - 1] === '001') {
        return parts.slice(0, -1).join('-')
      }
      // 如果最后一部分是 industry（ai, blockchain），去掉它
      if (parts.length >= 2 && (parts[parts.length - 1] === 'ai' || parts[parts.length - 1] === 'blockchain')) {
        return parts.slice(0, -1).join('-')
      }
      // 否则，可能是 ${templateId}-${recordId} 格式，去掉最后一个部分
      if (parts.length >= 2) {
        return parts.slice(0, -1).join('-')
      }
      return id
    })
  ) || []

  console.log(`[IndustryAnalysisAPI] 🔍 从tabs提取的卡片模板ID (${finalCardTemplateIds.length}个):`, finalCardTemplateIds.join(', '))

  if (typeTemplate) {
    const mergedConfig = mergeConfigs(typeTemplate, contentConfig, userPersonalization)
    console.log(`[IndustryAnalysisAPI] 🔄 合并配置后的卡片模板ID (${mergedConfig.order.length}个):`, mergedConfig.order.join(', '))
    // 如果合并后的order为空或少于从tabs提取的ID数量，使用从tabs提取的ID
    // 这样可以确保所有17个卡片都被加载
    if (mergedConfig.order && mergedConfig.order.length >= finalCardTemplateIds.length) {
      finalCardTemplateIds = mergedConfig.order
    } else {
      console.warn(`[IndustryAnalysisAPI] ⚠️ 合并配置的order (${mergedConfig.order?.length || 0}个) 少于从tabs提取的ID (${finalCardTemplateIds.length}个)，使用从tabs提取的ID`)
    }
  }

  console.log(`[IndustryAnalysisAPI] ✅ 最终使用的卡片模板ID (${finalCardTemplateIds.length}个):`, finalCardTemplateIds.join(', '))

  // 9. 根据卡片ID，从对应的目录读取数据（渐进式迁移）
  // 优化：使用并行加载提升性能
  const cardLoadPromises = finalCardTemplateIds.map(async (templateId) => {
    const cardTemplateId = templateId as CardTemplateId
    
    // 检查卡片是否已迁移到后端
    if (!isCardMigrated(cardTemplateId)) {
      // 未迁移：使用Mock数据
      console.log(`[IndustryAnalysisAPI] 卡片 ${cardTemplateId} 使用Mock数据（未迁移）`)
      try {
        const mockCardId = `${cardTemplateId}-001`
        const mockCard = await getMockCard(mockCardId)
        if (mockCard) {
          return mockCard
        } else {
          console.warn(`[IndustryAnalysisAPI] Mock卡片未找到: ${mockCardId}`)
          return null
        }
      } catch (error) {
        console.error(`[IndustryAnalysisAPI] 加载Mock卡片失败: ${cardTemplateId}`, error)
        return null
      }
    }

    // 已迁移：从后端目录读取数据
    console.log(`[IndustryAnalysisAPI] 卡片 ${cardTemplateId} 使用后端数据（已迁移）`)
    
    // 找到对应的卡片目录
    // 优先精确匹配（slug = templateId）
    // 如果失败，尝试模糊匹配（slug 包含 templateId，用于处理带时间戳的 slug）
    let cardDirectory = directories.find((d: DirectoryInfo) => d.slug === templateId)
    
    if (!cardDirectory) {
      // 模糊匹配：查找 slug 中包含 templateId 的目录
      // 例如：industry-stack-card-xxx 匹配 industry-stack
      cardDirectory = directories.find((d: DirectoryInfo) => 
        d.slug.includes(templateId) || 
        d.slug.includes(`${templateId}-card`) ||
        d.slug.includes(`-${templateId}-`)
      )
    }
    
    if (!cardDirectory) {
      console.warn(`[IndustryAnalysisAPI] 卡片目录未找到: ${templateId}，降级到Mock数据`)
      // 降级：目录不存在时使用Mock数据
      try {
        const mockCardId = `${cardTemplateId}-001`
        const mockCard = await getMockCard(mockCardId)
        return mockCard || null
      } catch (error) {
        console.error(`[IndustryAnalysisAPI] 降级到Mock数据失败: ${cardTemplateId}`, error)
        return null
      }
    }

    // 读取该目录的记录（如果指定了industry，按industry过滤）
    try {
      let records = await getDirectoryRecords(applicationId, cardDirectory.id)
      
      // 调试：打印第一条记录的时间字段
      if (records.length > 0) {
        const firstRecord = records[0]
        console.log(`[IndustryAnalysisAPI] 卡片 ${templateId} 第一条记录时间字段:`, {
          updatedAt: (firstRecord as any).updatedAt,
          updated_at: (firstRecord as any).updated_at,
          createdAt: (firstRecord as any).createdAt,
          created_at: (firstRecord as any).created_at,
          generated_at: (firstRecord as any).generated_at,
          allKeys: Object.keys(firstRecord),
        })
      }
      
      // 如果指定了industry，通过card_id过滤（card_id格式：templateId-industry）
      // 注意：industry可能是数组（多选），使用第一个industry来匹配卡片
      if (industry && records.length > 0) {
        const targetCardId = `${templateId}-${industry}`
        records = records.filter((r: any) => {
          const cardId = String(r.card_id || "")
          // 匹配card_id完全等于targetCardId，或者card_id以targetCardId开头
          return cardId === targetCardId || cardId.startsWith(`${targetCardId}-`)
        })
        if (records.length === 0) {
          console.log(`[IndustryAnalysisAPI] 卡片 ${templateId} 未找到产业 ${industry} 的数据，使用第一条记录`)
          // 如果过滤后没有数据，重新获取所有记录并使用第一条（降级策略）
          const allRecords = await getDirectoryRecords(applicationId, cardDirectory.id)
          if (allRecords.length > 0) {
            records = [allRecords[0]]
          }
        }
      }
      if (records.length === 0) {
        console.warn(`[IndustryAnalysisAPI] 卡片目录无数据: ${templateId}，降级到Mock数据`)
        // 降级：无数据时使用Mock数据
        try {
          const mockCardId = `${cardTemplateId}-001`
          const mockCard = await getMockCard(mockCardId)
          return mockCard || null
        } catch (error) {
          console.error(`[IndustryAnalysisAPI] 降级到Mock数据失败: ${cardTemplateId}`, error)
          return null
        }
      }

      // 使用第一条记录（或根据业务逻辑选择）
      const record = records[0] as RecordData
      
      // 处理混合存储：如果数据在OSS，需要下载
      let cardData = record
      if (record.data_oss_url && !record.data) {
        const downloadedData = await loadCardData({
          data_oss_url: record.data_oss_url,
          metadata: record.metadata,
        })
        if (downloadedData) {
          cardData = { ...record, ...downloadedData }
        }
      }
      
      // 转换为卡片实例
      try {
        const cardInstance = recordToCardInstance(cardData, cardTemplateId, cardDirectory.slug)
        console.log(`[IndustryAnalysisAPI] ✅ 卡片 ${cardTemplateId} 从后端加载成功`)
        const summary = cardInstance.data.summary
        const levels = cardInstance.data.levels
        console.log(`[IndustryAnalysisAPI] 调试 - 转换后的卡片数据:`, JSON.stringify({
          title: cardInstance.data.title,
          summary: typeof summary === 'string' ? summary.substring(0, 100) : summary,
          icon: cardInstance.data.icon,
          hasLevels: !!levels,
          levelsCount: Array.isArray(levels) ? levels.length : 0,
          levels: levels
        }, null, 2))
        return cardInstance
      } catch (error) {
        console.error(`[IndustryAnalysisAPI] ❌ 转换卡片失败: ${cardTemplateId}，降级到Mock数据`, error)
        // 降级：转换失败时使用Mock数据
        try {
          const mockCardId = `${cardTemplateId}-001`
          const mockCard = await getMockCard(mockCardId)
          return mockCard || null
        } catch (mockError) {
          console.error(`[IndustryAnalysisAPI] 降级到Mock数据也失败: ${cardTemplateId}`, mockError)
          return null
        }
      }
    } catch (error) {
      console.error(`[IndustryAnalysisAPI] 读取目录记录失败: ${cardTemplateId}`, error)
      // 降级：读取失败时使用Mock数据
      try {
        const mockCardId = `${cardTemplateId}-001`
        const mockCard = await getMockCard(mockCardId)
        return mockCard || null
      } catch (mockError) {
        console.error(`[IndustryAnalysisAPI] 降级到Mock数据也失败: ${cardTemplateId}`, mockError)
        return null
      }
    }
  })

  // 并行加载所有卡片，过滤掉null值
  const loadedCards = await Promise.all(cardLoadPromises)
  const cards = loadedCards.filter((card): card is CardInstance => card !== null)

  console.log(`[IndustryAnalysisAPI] 📊 卡片加载统计:`)
  console.log(`  - 期望加载: ${finalCardTemplateIds.length} 个卡片`)
  console.log(`  - 实际加载: ${cards.length} 个卡片`)
  console.log(`  - 加载成功的卡片:`, cards.map(c => c.templateId).join(', '))
  const failedCards = finalCardTemplateIds.filter(tid => !cards.find(c => c.templateId === tid))
  if (failedCards.length > 0) {
    console.warn(`  - ⚠️ 加载失败的卡片:`, failedCards.join(', '))
  }

  // 更新tabs中的cardIds，使其与生成的卡片ID匹配
  // 因为后端生成的卡片ID格式是 ${templateId}-${recordId}
  // 而配置中的 cardIds 可能是：
  // 1. ${templateId}-001（默认格式）
  // 2. ${templateId}-${industry}（配置格式，如 industry-stack-blockchain）
  const updatedTabs = reportConfig.tabs?.map((tab) => {
    const updatedCardIds = tab.cardIds.map((oldCardId) => {
      // 从旧ID中提取templateId
      let templateId = oldCardId
      if (oldCardId.includes('-')) {
        const parts = oldCardId.split('-')
        // 如果最后一部分是 '001'，去掉它
        if (parts[parts.length - 1] === '001') {
          templateId = parts.slice(0, -1).join('-')
        } 
        // 如果最后一部分是 industry（ai, blockchain），去掉它
        else if (parts.length >= 2 && (parts[parts.length - 1] === 'ai' || parts[parts.length - 1] === 'blockchain')) {
          templateId = parts.slice(0, -1).join('-')
        }
        // 否则，可能是 ${templateId}-${recordId} 格式，去掉最后一个部分
        else if (parts.length >= 2) {
          templateId = parts.slice(0, -1).join('-')
        }
      }
      
      // 查找对应的卡片（按templateId匹配）
      const matchingCard = cards.find((card) => card.templateId === templateId)
      // 如果找到匹配的卡片，使用新ID；否则保留旧ID（降级到Mock数据的情况）
      if (matchingCard) {
        return matchingCard.id
      }
      
      // 如果没找到，可能是Mock数据，尝试使用 getMockCard
      // 但这里不应该调用异步函数，所以直接返回 oldCardId
      // Mock数据的匹配会在其他地方处理
      return oldCardId
    })
    console.log(`[IndustryAnalysisAPI] 📋 Tab "${tab.label}": ${updatedCardIds.length} 个卡片ID`)
    return {
      ...tab,
      cardIds: updatedCardIds,
    }
  })

  const result: ReportWithCards = {
    ...reportConfig,
    tabs: updatedTabs,
    cards,
  }

  // 保存到缓存
  setCache(cacheKey, result)

  return result
}

/**
 * 获取所有产业分析报告列表（从主报告目录获取所有记录）
 * 用于在Discover页面显示所有可用的产业分析报告
 */
export async function getIndustryAnalysisReportList(
  applicationId: string,
  moduleKey: string = "industry-analysis"
): Promise<Array<{
  id: string
  title: string
  category: string
  description: string
  growth?: string
  totalMarket?: string
  tags: string[]
  trendData?: number[]
  industry?: string
  isBackend: boolean
}>> {
  const config = getAPIConfig()
  
  // 如果未启用后端API，返回空数组（前端会使用Mock数据）
  if (!config.useBackendAPI) {
    console.log("[IndustryAnalysisAPI] 使用Mock模式，返回空列表")
    return []
  }

  try {
    // 1. 获取模块列表
    const modules = await getApplicationModules(applicationId)
    
    // 2. 找到产业分析模块
    const module = modules.find((m: any) => 
      m.moduleKey === moduleKey || 
      m.key === moduleKey || 
      m.name === moduleKey ||
      (m.moduleKey && m.moduleKey.startsWith(moduleKey))
    )
    
    if (!module) {
      console.warn(`[IndustryAnalysisAPI] 模块未找到: ${moduleKey}`)
      return []
    }

    // 3. 获取模块的目录列表
    const directories = await getModuleDirectories(applicationId, module.id)
    
    // 4. 找到主报告目录
    let reportDirectory = directories.find(
      (d: DirectoryInfo) => d.slug === "industry-analysis-report" || d.config?.isMasterReport
    )
    
    if (!reportDirectory) {
      reportDirectory = directories.find((d: DirectoryInfo) => 
        d.slug.includes("industry-analysis-report") || d.config?.isMasterReport
      )
    }
    
    if (!reportDirectory) {
      console.warn("[IndustryAnalysisAPI] 主报告目录未找到")
      return []
    }

    // 5. 获取主报告目录的所有记录（每个记录代表一个产业分析报告）
    let records = await getDirectoryRecords(applicationId, reportDirectory.id)
    
    // 过滤掉已删除的记录和无效记录
    records = records.filter((r: any) => {
      // 排除已删除的记录
      if (r.deletedAt || r.deleted_at) {
        return false
      }
      // 必须有industry字段（支持多选数组）或industry_name字段（也支持多选数组）
      const hasIndustry = !!r.industry && (
        Array.isArray(r.industry) ? r.industry.length > 0 : 
        typeof r.industry === 'string' ? r.industry.length > 0 : false
      )
      // industry_name 现在也是多选数组，需要检查数组或字符串格式
      const hasIndustryName = !!r.industry_name && (
        Array.isArray(r.industry_name) ? r.industry_name.length > 0 :
        typeof r.industry_name === 'string' ? r.industry_name.length > 0 : false
      )
      return hasIndustry || hasIndustryName
    })
    
    console.log(`[IndustryAnalysisAPI] 找到 ${records.length} 个有效产业分析报告`)
    
    // 6. 将记录转换为列表项格式
    // 支持多选 industries：一个报告可以在多个行业下显示
    const reportList: Array<{
      id: string
      title: string
      category: string
      description: string
      growth?: string
      totalMarket?: string
      tags: string[]
      trendData?: number[]
      industry?: string
      isBackend: boolean
    }> = []
    
    records.forEach((record: any) => {
      // 从记录中提取产业信息（支持多选）
      let industries: string[] = []
      
      if (record.industry) {
        // 如果是数组（多选），直接使用
        if (Array.isArray(record.industry)) {
          industries = record.industry.filter((ind: any) => ind && typeof ind === 'string')
        }
        // 如果是字符串（向后兼容），转换为数组
        else if (typeof record.industry === 'string') {
          industries = [record.industry]
        }
      }
      
      // 如果无法从industry字段获取，尝试从industry_name推断（向后兼容）
      if (industries.length === 0 && record.industry_name) {
        // industry_name 现在也是多选数组，需要处理数组和字符串格式
        let industryNameArray: string[] = []
        if (Array.isArray(record.industry_name)) {
          industryNameArray = record.industry_name.filter((name: any) => name && typeof name === 'string')
        } else if (typeof record.industry_name === 'string') {
          industryNameArray = [record.industry_name]
        }
        
        // 从 industry_name 数组推断 industry 值
        for (const name of industryNameArray) {
          const nameLower = name.toLowerCase()
          if (nameLower.includes('ai') || name.includes('人工智能')) {
            industries.push('ai')
          } else if (nameLower.includes('blockchain') || name.includes('区块链')) {
            industries.push('blockchain')
          }
        }
      }
      
      // 如果无法识别产业，跳过
      if (industries.length === 0) {
        console.warn(`[IndustryAnalysisAPI] 无法识别产业，跳过记录:`, record.id, record.report_title)
        return
      }
      
      // 提取 industryName 用于显示（支持数组和字符串格式）
      let industryName: string = '产业'
      if (record.industry_name) {
        if (Array.isArray(record.industry_name)) {
          industryName = record.industry_name[0] || '产业'
        } else if (typeof record.industry_name === 'string') {
          industryName = record.industry_name
        }
      }
      if (industryName === '产业') {
        industryName = record.report_title?.replace('产业分析报告', '').replace('分析报告', '').trim() || '产业'
      }
      const reportTitle = record.report_title || record.title || `${industryName}产业分析报告`
      const summary = record.summary || record.report_summary || record.description || `${industryName}产业相关分析数据。`
      
      // 从后端记录读取数据，如果没有则使用默认值
      let trendData = Array.from({ length: 10 }, () => Math.floor(Math.random() * 30) + 20)
      if (record.trend_data) {
        try {
          trendData = typeof record.trend_data === 'string' ? JSON.parse(record.trend_data) : record.trend_data
        } catch (e) {
          console.warn(`[IndustryAnalysisAPI] 解析trend_data失败:`, e)
        }
      }
      
      const growth = record.growth || `+${Math.floor(Math.random() * 20) + 70}%`
      const totalMarket = record.total_market || `$${(Math.random() * 10 + 5).toFixed(1)}B`
      
      // 解析tags，如果没有则生成默认tags
      let tags = ["产业报告", industryName, "17张卡片", "后端数据"]
      if (record.tags) {
        try {
          tags = typeof record.tags === 'string' ? JSON.parse(record.tags) : record.tags
        } catch (e) {
          console.warn(`[IndustryAnalysisAPI] 解析tags失败:`, e)
        }
      }
      
      // 为每个industry创建一个报告项（一个报告可以在多个行业下显示）
      industries.forEach((industry: string) => {
        reportList.push({
          id: `industry-analysis-backend-${record.id}-${industry}`,
          title: reportTitle,
          category: `产业分析 · 后端数据`,
          description: summary,
          growth,
          totalMarket,
          tags,
          trendData,
          industry,
          isBackend: true,
        })
      })
    })
    
    console.log(`[IndustryAnalysisAPI] 共 ${reportList.length} 个产业分析报告项（支持多选）:`, reportList.map(r => `${r.title} (${r.industry})`).join(', '))
    
    return reportList
  } catch (error) {
    console.error("[IndustryAnalysisAPI] 获取产业分析报告列表失败:", error)
    return []
  }
}

/**
 * 获取单个卡片数据（从目录records读取）
 */
export async function getIndustryAnalysisCard(
  applicationId: string,
  templateId: CardTemplateId,
  recordId?: string
): Promise<CardInstance | null> {
  // 1. 获取模块和目录信息
  const modules = await getApplicationModules(applicationId)
  const module = modules.find((m: any) => m.moduleKey === "industry-analysis")
  if (!module) {
    throw new Error("产业分析模块未找到")
  }

  const directories = await getModuleDirectories(applicationId, module.id)
  
  // 2. 找到对应的卡片目录
  // 优先精确匹配，失败时尝试模糊匹配
  let cardDirectory = directories.find((d: DirectoryInfo) => d.slug === templateId)
  
  if (!cardDirectory) {
    // 模糊匹配：查找 slug 中包含 templateId 的目录
    cardDirectory = directories.find((d: DirectoryInfo) => 
      d.slug.includes(templateId) || 
      d.slug.includes(`${templateId}-card`) ||
      d.slug.includes(`-${templateId}-`)
    )
  }
  
  if (!cardDirectory) {
    throw new Error(`卡片目录未找到: ${templateId}`)
  }

  // 3. 读取该目录的记录
  const records = await getDirectoryRecords(applicationId, cardDirectory.id)
  if (records.length === 0) {
    return null
  }

  // 4. 根据 recordId 选择记录，或使用第一条
  const record = recordId
    ? records.find((r: RecordData) => r.id === recordId)
    : records[0]

  if (!record) {
    return null
  }

  // 5. 转换为卡片实例
  return recordToCardInstance(record, templateId, cardDirectory.slug)
}

