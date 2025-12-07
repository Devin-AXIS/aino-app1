/**
 * API配置开关
 * 支持双模式：Mock API（默认） + 后端API（可选）
 * 
 * 根据完整方案文档：
 * - 前端继续使用Mock API（默认行为不变）
 * - 后端作为可选增强（前端可选择使用）
 * - 渐进式迁移：支持逐步迁移到后端API
 */

export interface APIConfig {
  /** 是否使用后端API（默认false，使用Mock API） */
  useBackendAPI: boolean
  /** 后端API地址 */
  backendApiUrl?: string
  /** 是否启用缓存 */
  enableCache: boolean
  /** 缓存TTL（秒） */
  cacheTTL: number
}

/**
 * 默认配置
 */
const defaultConfig: APIConfig = {
  useBackendAPI: true, // 默认使用后端API，真正从模块/目录读取数据
  backendApiUrl: undefined,
  enableCache: true,
  cacheTTL: 300, // 5分钟
}

let currentConfig: APIConfig = { ...defaultConfig }

/**
 * 获取当前API配置
 */
export function getAPIConfig(): APIConfig {
  // 从localStorage读取配置（如果存在）
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("aino_api_config")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        currentConfig = { ...defaultConfig, ...parsed }
      } catch (e) {
        console.error("解析API配置失败:", e)
      }
    }
  }
  return currentConfig
}

/**
 * 更新API配置
 */
export function setAPIConfig(config: Partial<APIConfig>) {
  currentConfig = { ...currentConfig, ...config }
  
  // 保存到localStorage
  if (typeof window !== "undefined") {
    localStorage.setItem("aino_api_config", JSON.stringify(currentConfig))
  }
}

/**
 * 重置为默认配置
 */
export function resetAPIConfig() {
  currentConfig = { ...defaultConfig }
  if (typeof window !== "undefined") {
    localStorage.removeItem("aino_api_config")
  }
}

