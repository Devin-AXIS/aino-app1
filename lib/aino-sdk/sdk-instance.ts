/**
 * AINO SDK 单例
 * 统一管理 SDK 实例，避免重复初始化
 * 
 * 注意：在 Next.js 客户端组件中，直接使用 fetch 避免构建问题
 */

import { getAINOConfig } from './config'

// 在客户端组件中，直接使用 fetch，不导入 SDK 类
// 这样可以避免 Next.js 构建时的模块导出问题
export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const config = getAINOConfig()
  const url = `${config.baseUrl}${endpoint}`
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }
  
  // 优先使用用户 token（如果已登录）
  let token: string | null = null
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('aino_token')
  }
  
  // 如果有用户 token，使用用户 token；否则使用 API Key
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  } else if (config.apiKey) {
    headers['Authorization'] = `Bearer ${config.apiKey}`
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  })
  
  if (!response.ok) {
    let errorMessage = '请求失败'
    try {
      const error = await response.json()
      // 后端可能返回 { success: false, error: "错误信息" } 或 { error: "错误信息" }
      errorMessage = error.error || error.message || `HTTP ${response.status}: ${response.statusText}`
    } catch {
      // 如果响应不是 JSON，使用状态文本
      errorMessage = `HTTP ${response.status}: ${response.statusText || '请求失败'}`
    }
    throw new Error(errorMessage)
  }
  
  return response.json()
}
