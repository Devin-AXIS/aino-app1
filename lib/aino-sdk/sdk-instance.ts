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
  // 在开发环境下，如果 URL 中没有 noAuth 参数且没有 token，添加 noAuth 参数
  let url = `${config.baseUrl}${endpoint}`
  let token: string | null = null
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('aino_token')
    // 开发环境下，如果没有 token，添加 noAuth 参数绕过认证
    if (!token && process.env.NODE_ENV !== 'production' && !url.includes('noAuth')) {
      url += (url.includes('?') ? '&' : '?') + 'noAuth=true'
    }
  }
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }
  
  // 优先使用用户 token（如果已登录）
  // 如果有用户 token，使用用户 token；否则使用 API Key
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  } else if (config.apiKey) {
    headers['Authorization'] = `Bearer ${config.apiKey}`
  }
  
  // 打印请求信息
  console.log('🔍 [apiRequest] 请求信息:', {
    url,
    method: options.method || 'GET',
    headers: Object.keys(headers),
  })
  
  const response = await fetch(url, {
    ...options,
    headers,
  })
  
  // 打印响应信息
  const traceId = response.headers.get('x-trace-id') || response.headers.get('x-request-id')
  const responseHeaders: Record<string, string> = {}
  response.headers.forEach((value, key) => {
    responseHeaders[key] = value
  })
  
  console.log('🔍 [apiRequest] 响应信息:', {
    status: response.status,
    statusText: response.statusText,
    traceId,
    headers: responseHeaders,
  })
  
  if (!response.ok) {
    // 如果是认证失败（401），且没有 noAuth 参数，尝试自动重试并添加 noAuth=true
    if (response.status === 401 && !url.includes('noAuth=true') && typeof window !== 'undefined') {
      const currentToken = localStorage.getItem('aino_token')
      if (currentToken) {
        console.warn('🔒 认证失败，清除无效的 token 并自动重试（添加 noAuth=true）')
        localStorage.removeItem('aino_token')
        localStorage.removeItem('aino_user')
        // 触发重新登录事件
        window.dispatchEvent(new CustomEvent('aino:auth:failed'))
      }
      
      // 自动重试，添加 noAuth=true
      const retryUrl = url + (url.includes('?') ? '&' : '?') + 'noAuth=true'
      console.log('🔄 [apiRequest] 自动重试（添加 noAuth=true）:', retryUrl)
      
      // 创建新的 headers，移除 Authorization
      const retryHeaders: HeadersInit = { ...headers }
      delete (retryHeaders as any).Authorization
      
      const retryResponse = await fetch(retryUrl, {
        ...options,
        headers: retryHeaders,
      })
      
      if (retryResponse.ok) {
        console.log('✅ [apiRequest] 自动重试成功')
        return retryResponse.json()
      }
    }
    
    let errorMessage = '请求失败'
    let responseBody: any = null
    try {
      const text = await response.text()
      console.log('🔍 [apiRequest] 响应 body (text):', text.substring(0, 500))
      responseBody = JSON.parse(text)
      // 后端可能返回 { success: false, error: "错误信息" } 或 { error: "错误信息" }
      // 确保 error 不是 undefined
      if (responseBody && typeof responseBody === 'object') {
        errorMessage = responseBody.error || responseBody.message || `HTTP ${response.status}: ${response.statusText}`
      } else {
        errorMessage = `HTTP ${response.status}: ${response.statusText || '请求失败'}`
      }
    } catch (e) {
      // 如果响应不是 JSON，使用状态文本
      errorMessage = `HTTP ${response.status}: ${response.statusText || '请求失败'}`
    }
    
    console.error('❌ [apiRequest] 请求失败:', {
      url,
      status: response.status,
      statusText: response.statusText,
      traceId,
      errorMessage,
      responseBody,
    })
    
    // 如果是认证失败（401），清除无效的 token 和用户信息
    if (response.status === 401 && typeof window !== 'undefined') {
      const currentToken = localStorage.getItem('aino_token')
      if (currentToken) {
        console.warn('🔒 认证失败，清除无效的 token 和用户信息')
        localStorage.removeItem('aino_token')
        localStorage.removeItem('aino_user')
        // 可选：触发重新登录事件
        window.dispatchEvent(new CustomEvent('aino:auth:failed'))
      }
    }
    
    throw new Error(errorMessage)
  }
  
  return response.json()
}
