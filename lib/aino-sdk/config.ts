/**
 * AINO SDK 配置
 * 从环境变量或默认值读取配置
 */

export interface AINOConfig {
  apiKey: string
  baseUrl: string
  applicationId?: string
}

// 从环境变量读取配置，如果没有则使用默认值
export function getAINOConfig(): AINOConfig {
  // 优先从环境变量读取
  const apiKey = process.env.NEXT_PUBLIC_AINO_API_KEY || ''
  // 开发环境默认使用 localhost:3007，生产环境使用 core.metaio.cc:3007
  const defaultBaseUrl = process.env.NODE_ENV === 'production' 
    ? 'http://core.metaio.cc:3007' 
    : 'http://localhost:3007'
  const baseUrl = process.env.NEXT_PUBLIC_AINO_API_URL || defaultBaseUrl
  
  // 配置验证：开发环境不应该使用生产服务器
  if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
    if (baseUrl.includes('core.metaio.cc')) {
      console.warn('⚠️ [AINO Config] 开发环境不应该使用生产服务器！当前配置:', baseUrl)
      console.warn('💡 建议：使用 localhost:3007 或设置 NEXT_PUBLIC_AINO_API_URL=http://localhost:3007')
    }
  }
  
  // 清除旧的缓存数据（如果检测到问题）
  if (typeof window !== 'undefined') {
    // 检查是否有旧的 token 但认证失败的情况，清除所有缓存
    const hasOldAppId = localStorage.getItem('aino_application_id') === '817de16a-9cb9-4c30-b5e8-f8c92ce24f94'
    const hasToken = localStorage.getItem('aino_token')
    
    // 如果检测到旧的应用ID，清除所有相关缓存
    if (hasOldAppId) {
      console.log('🔄 检测到旧的应用ID，清除所有缓存数据')
      localStorage.removeItem('aino_token')
      localStorage.removeItem('aino_user')
      localStorage.removeItem('aino_application_id')
    }
    
    // 如果 token 存在但可能无效，也清除（让用户重新登录）
    // 这个逻辑可以通过检查 token 是否过期来实现，但为了简单，暂时不自动清除
  }
  
  // applicationId: 优先从环境变量，如果没有则尝试从localStorage获取，最后使用默认值
  let applicationId = process.env.NEXT_PUBLIC_AINO_APP_ID
  
  // 如果环境变量没有，尝试从localStorage获取（可能之前保存过）
  if (!applicationId && typeof window !== 'undefined') {
    const savedAppId = localStorage.getItem('aino_application_id')
    // 检查是否是旧的应用ID，如果是则更新为新ID
    if (savedAppId === '817de16a-9cb9-4c30-b5e8-f8c92ce24f94') {
      // 清除旧的应用ID，使用新的
      localStorage.removeItem('aino_application_id')
      console.log('🔄 检测到旧的应用ID，已清除，将使用新的应用ID')
    } else if (savedAppId) {
      applicationId = savedAppId
    }
  }
  
  // 如果还是没有，使用硬编码的默认应用ID（正式可用的key: app-35c7a96a756746ef）
  // 完整应用ID: 35c7a96a-7567-46ef-a29d-b03f8a7052a3
  // 对应key: app-35c7a96a756746ef
  if (!applicationId) {
    applicationId = '35c7a96a-7567-46ef-a29d-b03f8a7052a3'
    console.log('ℹ️ 使用默认应用配置（key: app-35c7a96a756746ef）')
    
    // 保存到localStorage，方便后续使用
    if (typeof window !== 'undefined') {
      localStorage.setItem('aino_application_id', applicationId)
    }
  }
  
  return {
    apiKey,
    baseUrl,
    applicationId,
  }
}

// Feature Flag: 是否使用真实 API（false 时使用 mock）
// 默认使用真实API，除非明确设置为false
export const USE_REAL_API = process.env.NEXT_PUBLIC_USE_REAL_API !== 'false'
