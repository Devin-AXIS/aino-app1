/**
 * 类型模板加载器
 * 根据完整方案文档实现：支持JSON文件（默认）+ 数据库（自定义）
 * 
 * 优先级：应用自定义模板 > 全局模板 > 默认模板
 * 
 * 存储位置：
 * - 默认模板：前端 JSON文件（`data/task-templates/`）
 * - 自定义模板：数据库 `task_type_templates` 表（JSONB）
 * - 存储大小：几KB，存数据库
 */

import { apiRequest } from "@/lib/aino-sdk/sdk-instance"
import { getAINOConfig } from "@/lib/aino-sdk/config"
import { getAPIConfig } from "./api-config"
import type { TypeTemplateConfig } from "./config-merger"

/**
 * 从JSON文件加载默认模板
 */
async function loadDefaultTemplate(templateId: string): Promise<TypeTemplateConfig | null> {
  try {
    // 动态导入JSON文件
    const template = await import(`@/data/task-templates/${templateId}.json`)
    return template.default as TypeTemplateConfig
  } catch (error) {
    console.warn(`[TypeTemplateLoader] 默认模板未找到: ${templateId}`, error)
    return null
  }
}

/**
 * 从数据库加载自定义模板
 */
async function loadCustomTemplate(
  applicationId: string,
  templateId: string
): Promise<TypeTemplateConfig | null> {
  const config = getAPIConfig()
  if (!config.useBackendAPI) {
    return null // 不使用后端API时，不加载数据库模板
  }

  try {
    const response = await apiRequest(
      `/api/card-driven/templates/${templateId}?applicationId=${applicationId}`
    )
    if (response.success && response.data) {
      return response.data.template_config as TypeTemplateConfig
    }
    // 如果API返回失败但没有抛出异常，说明模板不存在（404），这是正常的
    // 返回null，让系统使用默认模板
    return null
  } catch (error: any) {
    // 检查是否是模板不存在的错误（404）
    const isTemplateNotFound = 
      error?.isTemplateNotFound === true ||
      error?.status === 404 ||
      error?.message?.includes('404') ||
      error?.message?.includes('Template not found')
    
    if (isTemplateNotFound) {
      // 404错误是正常的（模板不存在，使用默认模板），不记录错误
      return null
    }
    
    // 检查其他404相关错误
    const errorMessage = error?.message || String(error) || ''
    const isNotFound = 
      errorMessage.includes('不存在') || 
      errorMessage.includes('not found') ||
      error?.response?.status === 404
    
    if (isNotFound) {
      // 其他404错误也是正常的
      return null
    }
    
    // 其他错误才警告（但不影响功能，继续使用默认模板）
    console.warn(`[TypeTemplateLoader] 加载自定义模板失败: ${templateId}`, errorMessage || error)
    return null
  }
}

/**
 * 加载全局模板（applicationId为NULL的模板）
 */
async function loadGlobalTemplate(templateId: string): Promise<TypeTemplateConfig | null> {
  const config = getAPIConfig()
  if (!config.useBackendAPI) {
    return null
  }

  try {
    const response = await apiRequest(`/api/card-driven/templates/${templateId}?global=true`)
    if (response.success && response.data) {
      return response.data.template_config as TypeTemplateConfig
    }
    return null
  } catch (error) {
    console.warn(`[TypeTemplateLoader] 加载全局模板失败: ${templateId}`, error)
    return null
  }
}

/**
 * 加载类型模板（按优先级）
 * 
 * 优先级：
 * 1. 应用自定义模板（数据库，applicationId不为NULL）
 * 2. 全局模板（数据库，applicationId为NULL）
 * 3. 默认模板（JSON文件）
 * 
 * @param templateId 模板ID（如 "industry-analysis"）
 * @param applicationId 应用ID（可选）
 * @returns 类型模板配置
 */
export async function loadTypeTemplate(
  templateId: string,
  applicationId?: string
): Promise<TypeTemplateConfig | null> {
  // 获取应用ID
  const appId = applicationId || getAINOConfig().applicationId

  // 1. 优先加载应用自定义模板
  if (appId) {
    const customTemplate = await loadCustomTemplate(appId, templateId)
    if (customTemplate) {
      console.log(`[TypeTemplateLoader] 使用应用自定义模板: ${templateId}`)
      return customTemplate
    }
  }

  // 2. 加载全局模板
  const globalTemplate = await loadGlobalTemplate(templateId)
  if (globalTemplate) {
    console.log(`[TypeTemplateLoader] 使用全局模板: ${templateId}`)
    return globalTemplate
  }

  // 3. 加载默认模板（JSON文件）
  const defaultTemplate = await loadDefaultTemplate(templateId)
  if (defaultTemplate) {
    console.log(`[TypeTemplateLoader] 使用默认模板: ${templateId}`)
    return defaultTemplate
  }

  console.error(`[TypeTemplateLoader] 模板未找到: ${templateId}`)
  return null
}

/**
 * 加载多个类型模板
 */
export async function loadTypeTemplates(
  templateIds: string[],
  applicationId?: string
): Promise<Record<string, TypeTemplateConfig>> {
  const templates: Record<string, TypeTemplateConfig> = {}

  await Promise.all(
    templateIds.map(async (id) => {
      const template = await loadTypeTemplate(id, applicationId)
      if (template) {
        templates[id] = template
      }
    })
  )

  return templates
}

