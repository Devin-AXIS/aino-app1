/**
 * 用户系统 API 封装层
 * 支持真实 API 和 Mock 数据切换
 */

import { apiRequest } from './sdk-instance'
import { USE_REAL_API } from './config'

// Mock 用户数据（作为 fallback）
const MOCK_USER = {
  id: 'mock-user-id',
  name: '测试用户',
  email: 'test@example.com',
  avatar: null,
  phone: null,
}

/**
 * 用户注册（手机号 + 验证码）
 * 测试阶段：验证码随便输入都通过
 */
export async function registerWithPhone(phone: string, code: string, userInfo?: { name?: string; email?: string }) {
  if (!USE_REAL_API) {
    // Mock 注册
    console.log('🔧 [Mock] 手机号注册:', phone, code)
    return {
      success: true,
      data: {
        ...MOCK_USER,
        phone,
        name: userInfo?.name || '新用户',
        email: userInfo?.email,
        token: 'mock-token',
      },
      message: '注册成功',
    }
  }

  try {
    const config = await import('./config').then(m => m.getAINOConfig())
    let applicationId = config.applicationId
    
    // 如果还是没有，使用硬编码的默认应用（正式可用的key: app-35c7a96a756746ef）
    // 完整应用ID: 35c7a96a-7567-46ef-a29d-b03f8a7052a3
    if (!applicationId) {
      applicationId = '35c7a96a-7567-46ef-a29d-b03f8a7052a3'
      console.log('✅ 使用默认应用ID:', applicationId, '(key: app-35c7a96a756746ef)')
      
      // 保存到localStorage，方便后续使用
      if (typeof window !== 'undefined') {
        localStorage.setItem('aino_application_id', applicationId)
      }
    }

    // 保存应用ID到localStorage，方便后续使用
    if (typeof window !== 'undefined' && applicationId) {
      localStorage.setItem('aino_application_id', applicationId)
    }

    // 测试阶段：验证码随便输入都通过
    console.log('🔧 [真实API] 验证码注册:', { phone, code, applicationId })

    // 处理密码：确保至少6位（验证码作为临时密码）
    const password = code.length >= 6 ? code : code.padEnd(6, '0')
    
    // 调用后端注册 API: POST /api/modules/system/user/register?applicationId=xxx
    const result = await apiRequest(
      `/api/modules/system/user/register?applicationId=${applicationId}`,
      {
        method: 'POST',
        body: JSON.stringify({
          phone_number: phone,
          // 测试阶段：使用验证码作为临时密码（至少6位）
          password: password, // 确保密码至少6位
          name: userInfo?.name,
          email: userInfo?.email,
        }),
      }
    )
    
    console.log('✅ 注册成功:', result)
    return result
  } catch (error: any) {
    console.error('注册失败:', error)
    
    // 如果是"手机号已存在"或"用户已注册"错误，说明用户已注册，应该尝试登录
    if (error.message && (error.message.includes('已存在') || error.message.includes('已注册'))) {
      // 不抛出错误，让调用方知道这是"用户已存在"的情况，可以尝试登录
      throw new Error('USER_EXISTS')
    }
    
    // 失败时返回 mock，避免应用崩溃
    if (!USE_REAL_API) {
      return {
        success: true,
        data: {
          ...MOCK_USER,
          phone,
          name: userInfo?.name || '新用户',
          email: userInfo?.email,
          token: 'mock-token',
        },
        message: '注册成功',
      }
    }
    throw error
  }
}

/**
 * 检查手机号是否已注册
 */
export async function checkPhoneExists(phone: string) {
  if (!USE_REAL_API) {
    // Mock 检查
    console.log('🔧 [Mock] 检查手机号是否已注册:', phone)
    return false
  }

  try {
    const config = await import('./config').then(m => m.getAINOConfig())
    const applicationId = config.applicationId
    if (!applicationId) {
      throw new Error('缺少应用ID配置，请设置 NEXT_PUBLIC_AINO_APP_ID')
    }

    // 调用后端检查接口: GET /api/modules/system/user/exists?applicationId=xxx&phone_number=xxx
    try {
      const result = await apiRequest(
        `/api/modules/system/user/exists?applicationId=${applicationId}&phone_number=${encodeURIComponent(phone)}`,
        {
          method: 'GET',
        }
      )
      return result.exists === true
    } catch (error) {
      // 如果接口不存在或出错，返回 false（允许注册）
      return false
    }
  } catch (error) {
    console.error('检查手机号失败:', error)
    // 失败时返回 false，允许注册
    return false
  }
}

/**
 * 用户登录（手机号 + 验证码）- 测试阶段，验证码随便输入都通过
 */
export async function loginWithPhoneAndCode(phone: string, code: string) {
  if (!USE_REAL_API) {
    // Mock 登录
    console.log('🔧 [Mock] 手机号+验证码登录:', phone, code)
    return {
      success: true,
      data: {
        ...MOCK_USER,
        phone,
        token: 'mock-token',
      },
    }
  }

  try {
    const config = await import('./config').then(m => m.getAINOConfig())
    let applicationId = config.applicationId
    
    // 如果没有配置应用ID，尝试从localStorage获取
    if (!applicationId && typeof window !== 'undefined') {
      applicationId = localStorage.getItem('aino_application_id') || undefined
    }
    
    // 如果还是没有，使用硬编码的默认应用（正式可用的key: app-35c7a96a756746ef）
    // 完整应用ID: 35c7a96a-7567-46ef-a29d-b03f8a7052a3
    if (!applicationId) {
      applicationId = '35c7a96a-7567-46ef-a29d-b03f8a7052a3'
      console.log('✅ 使用默认应用ID:', applicationId, '(key: app-35c7a96a756746ef)')
      
      // 保存到localStorage，方便后续使用
      if (typeof window !== 'undefined') {
        localStorage.setItem('aino_application_id', applicationId)
      }
    }

    // 处理密码：确保至少6位（验证码作为临时密码）
    // 注意：必须与注册时的处理逻辑完全一致
    const password = code.length >= 6 ? code : code.padEnd(6, '0')
    
    console.log('🔧 [真实API] 验证码登录:', { phone, code: code.substring(0, 1) + '****', passwordLength: password.length, applicationId })

    const result = await apiRequest(
      `/api/modules/system/user/login?applicationId=${applicationId}`,
      {
        method: 'POST',
        body: JSON.stringify({
          phone_number: phone,
          // 测试阶段：使用验证码作为临时密码（至少6位）
          password: password, // 确保密码至少6位，与注册时一致
        }),
      }
    )
    
    console.log('✅ 登录成功:', result)
    return result
  } catch (error: any) {
    // 如果是"手机号或密码错误"，这可能是正常的（用户未注册），让调用方尝试注册
    // 只在非预期错误时记录详细日志
    if (error.message && !error.message.includes('手机号或密码错误')) {
      console.error('登录失败:', error)
    } else {
      // 静默处理"手机号或密码错误"，这是预期的（用户可能未注册）
      console.log('ℹ️ 登录失败（用户可能未注册，将尝试注册）:', error.message)
    }
    
    // 失败时返回 mock，避免应用崩溃
    if (!USE_REAL_API) {
      return {
        success: true,
        data: {
          ...MOCK_USER,
          phone,
          token: 'mock-token',
        },
      }
    }
    
    // 真实 API 失败时，抛出错误让调用方处理（可能会尝试注册）
    throw error
  }
}

/**
 * 用户登录（手机号 + 密码）
 * 注意：当前后端支持密码登录
 */
export async function loginWithPhone(phone: string, password: string) {
  if (!USE_REAL_API) {
    // Mock 登录
    console.log('🔧 [Mock] 手机号登录:', phone)
    return {
      success: true,
      data: {
        ...MOCK_USER,
        phone,
        token: 'mock-token',
      },
    }
  }

  try {
    const config = await import('./config').then(m => m.getAINOConfig())
    const { apiRequest } = await import('./sdk-instance')
    
    // 调用后端登录 API: POST /api/modules/system/user/login?applicationId=xxx
    const applicationId = config.applicationId
    if (!applicationId) {
      throw new Error('缺少应用ID配置，请设置 NEXT_PUBLIC_AINO_APP_ID')
    }

    const result = await apiRequest(
      `/api/modules/system/user/login?applicationId=${applicationId}`,
      {
        method: 'POST',
        body: JSON.stringify({
          phone_number: phone,
          password: password,
        }),
      }
    )
    return result
  } catch (error) {
    console.error('登录失败:', error)
    // 失败时返回 mock，避免应用崩溃
    if (!USE_REAL_API) {
      return {
        success: true,
        data: {
          ...MOCK_USER,
          phone,
          token: 'mock-token',
        },
      }
    }
    throw error
  }
}

/**
 * 获取当前用户信息
 */
export async function getCurrentUser() {
  if (!USE_REAL_API) {
    // Mock 用户信息
    console.log('🔧 [Mock] 获取当前用户')
    return MOCK_USER
  }

  try {
    // TODO: 使用真实 API
    // const config = await import('./config').then(m => m.getAINOConfig())
    // const applicationId = config.applicationId
    // const user = await apiRequest(`/api/modules/system/user/current?applicationId=${applicationId}`)
    // return user
    
    // 临时：先返回 mock
    console.log('⚠️ 真实 API 暂未实现，使用 Mock')
    return MOCK_USER
  } catch (error) {
    console.error('获取用户信息失败:', error)
    // 失败时返回 mock，避免应用崩溃
    return MOCK_USER
  }
}

/**
 * 更新用户信息
 */
export async function updateUserInfo(data: { name?: string; avatar?: string; phone?: string; id?: string; email?: string }) {
  if (!USE_REAL_API) {
    // Mock 更新
    console.log('🔧 [Mock] 更新用户信息:', data)
    return {
      ...MOCK_USER,
      ...data,
    }
  }

  try {
    const config = await import('./config').then(m => m.getAINOConfig())
    let applicationId = config.applicationId
    
    // 如果还是没有，使用硬编码的默认应用
    if (!applicationId) {
      applicationId = '35c7a96a-7567-46ef-a29d-b03f8a7052a3'
    }

    // 从 localStorage 获取当前用户ID（应用用户的 UUID）
    let userId: string | null = null
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('aino_user')
      if (userStr) {
        try {
          const user = JSON.parse(userStr)
          console.log('🔍 updateUserInfo 从 localStorage 读取用户信息:', { 
            hasUserId: !!user.userId, 
            userId: user.userId,
            hasId: !!user.id,
            id: user.id,
            idIsUUID: user.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(user.id)
          })
          
          // 优先使用 userId（应用用户的 UUID），如果没有则使用 id（可能是业务数据中的 ID）
          // 如果 id 是 UUID 格式，则使用它；否则尝试从其他字段获取
          userId = user.userId || (user.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(user.id) ? user.id : null)
          
          // 如果还是找不到 UUID，记录详细警告信息
          if (!userId) {
            console.warn('⚠️ 未找到应用用户 UUID:', { 
              user: {
                userId: user.userId,
                id: user.id,
                phone: user.phone || user.phone_number,
                name: user.name
              }
            })
            
            // 如果 id 不是 UUID（可能是手机号），尝试通过手机号查找用户
            // 但这里我们无法直接查询，所以需要提示用户重新登录
            throw new Error('用户信息不完整，请重新登录')
          }
        } catch (e) {
          console.error('解析用户信息失败:', e)
          // 如果是我们抛出的错误，直接抛出
          if (e instanceof Error && e.message.includes('请重新登录')) {
            throw e
          }
          // 其他解析错误，也提示重新登录
          throw new Error('用户信息解析失败，请重新登录')
        }
      }
    }

    if (!userId) {
      console.error('❌ updateUserInfo 未找到用户ID，localStorage 中的用户信息:', 
        typeof window !== 'undefined' ? localStorage.getItem('aino_user') : 'N/A')
      throw new Error('未找到用户ID，请先登录')
    }

    // 调用后端更新用户业务数据 API: PATCH /api/modules/system/user/{userId}/business-data?applicationId=xxx
    const result = await apiRequest(
      `/api/modules/system/user/${userId}/business-data?applicationId=${applicationId}`,
      {
        method: 'PATCH',
        body: JSON.stringify({
          name: data.name,
          avatar: data.avatar,
          email: data.email,
          id: data.id,
        }),
      }
    )
    
    console.log('✅ 用户信息更新成功:', result)
    
    // 更新 localStorage 中的用户信息
    if (typeof window !== 'undefined' && result.data) {
      const userStr = localStorage.getItem('aino_user')
      if (userStr) {
        try {
          const user = JSON.parse(userStr)
          // 确保保留 userId 字段（应用用户的 UUID），因为后端返回的 result.data 可能不包含它
          const updatedUser = { 
            ...user, 
            ...result.data,
            userId: user.userId || result.data.userId || (user.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(user.id) ? user.id : null) || result.data.userId
          }
          console.log('🔍 updateUserInfo 更新 localStorage，保留 userId:', updatedUser.userId)
          localStorage.setItem('aino_user', JSON.stringify(updatedUser))
        } catch (e) {
          console.error('更新localStorage用户信息失败:', e)
        }
      }
    }
    
    return result
  } catch (error) {
    console.error('更新用户信息失败:', error)
    throw error
  }
}

// 兼容旧函数名
export const updateUser = updateUserInfo

/**
 * 发送验证码
 * 测试阶段：不发送真实短信，只返回成功
 * 后续接入真实短信服务后，这里会调用短信发送接口
 */
export async function sendVerificationCode(phone: string) {
  if (!USE_REAL_API) {
    // Mock 发送验证码
    console.log('🔧 [Mock] 发送验证码到:', phone)
    return {
      success: true,
      message: '验证码已发送（Mock）',
    }
  }

  try {
    const config = await import('./config').then(m => m.getAINOConfig())
    let applicationId = config.applicationId
    
    // 如果没有配置应用ID，尝试从localStorage获取
    if (!applicationId && typeof window !== 'undefined') {
      applicationId = localStorage.getItem('aino_application_id') || undefined
    }
    
    // 如果还是没有，使用硬编码的默认应用（正式可用的key: app-35c7a96a756746ef）
    // 完整应用ID: 35c7a96a-7567-46ef-a29d-b03f8a7052a3
    if (!applicationId) {
      applicationId = '35c7a96a-7567-46ef-a29d-b03f8a7052a3'
      console.log('✅ 使用默认应用ID:', applicationId, '(key: app-35c7a96a756746ef)')
      
      // 保存到localStorage，方便后续使用
      if (typeof window !== 'undefined') {
        localStorage.setItem('aino_application_id', applicationId)
      }
    }

    // 如果没有应用ID，在测试模式下仍然允许继续
    if (!applicationId) {
      console.warn('⚠️ 未配置应用ID，使用测试模式发送验证码')
      return {
        success: true,
        message: '验证码已发送（测试模式，验证码可任意输入）',
      }
    }

    // 测试阶段：不发送真实短信，只返回成功
    // 后续接入真实短信服务后，这里会调用短信发送接口
    console.log('🔧 [测试模式] 发送验证码到:', phone, '应用ID:', applicationId, '(测试阶段，不发送真实短信)')
    
    // TODO: 后续接入真实短信服务
    // const response = await fetch(`${config.baseUrl}/api/modules/system/user/send-code?applicationId=${applicationId}`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ phone_number: phone }),
    // })
    
    return {
      success: true,
      message: '验证码已发送（测试模式，验证码可任意输入）',
    }
  } catch (error) {
    console.error('发送验证码失败:', error)
    throw error
  }
}

/**
 * 修改密码（需要旧密码）
 */
export async function changePassword(oldPassword: string, newPassword: string) {
  if (!USE_REAL_API) {
    console.log('🔧 [Mock] 修改密码')
    return { success: true, message: '密码修改成功' }
  }

  try {
    const config = await import('./config').then(m => m.getAINOConfig())
    let applicationId = config.applicationId
    if (!applicationId) {
      applicationId = '35c7a96a-7567-46ef-a29d-b03f8a7052a3'
    }

    // 获取用户手机号
    let phone: string | null = null
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('aino_user')
      if (userStr) {
        try {
          const user = JSON.parse(userStr)
          phone = user.phone
        } catch (e) {
          console.error('解析用户信息失败:', e)
        }
      }
    }

    if (!phone) {
      throw new Error('请先登录')
    }

    // 检查 token 是否存在
    let token: string | null = null
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('aino_token')
      if (!token) {
        console.warn('⚠️ 未找到 token，可能需要重新登录')
        throw new Error('请先登录')
      }
    }

    console.log('🔑 修改密码:', { phone, hasToken: !!token, applicationId })

    const result = await apiRequest(
      `/api/modules/system/user/change-password?applicationId=${applicationId}`,
      {
        method: 'POST',
        body: JSON.stringify({
          phone_number: phone,
          old_password: oldPassword,
          new_password: newPassword,
        }),
      }
    )

    console.log('✅ 密码修改成功:', result)
    return result
  } catch (error: any) {
    console.error('修改密码失败:', error)
    throw error
  }
}

/**
 * 设置密码（首次设置，不需要旧密码）
 */
export async function setPassword(newPassword: string) {
  if (!USE_REAL_API) {
    console.log('🔧 [Mock] 设置密码')
    return { success: true, message: '密码设置成功' }
  }

  try {
    const config = await import('./config').then(m => m.getAINOConfig())
    let applicationId = config.applicationId
    if (!applicationId) {
      applicationId = '35c7a96a-7567-46ef-a29d-b03f8a7052a3'
    }

    // 获取用户手机号
    let phone: string | null = null
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('aino_user')
      if (userStr) {
        try {
          const user = JSON.parse(userStr)
          phone = user.phone
        } catch (e) {
          console.error('解析用户信息失败:', e)
        }
      }
    }

    if (!phone) {
      throw new Error('请先登录')
    }

    // 检查 token 是否存在
    let token: string | null = null
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('aino_token')
      if (!token) {
        console.warn('⚠️ 未找到 token，可能需要重新登录')
        throw new Error('请先登录')
      }
    }

    console.log('🔑 设置密码:', { phone, hasToken: !!token, applicationId })

    const result = await apiRequest(
      `/api/modules/system/user/change-password?applicationId=${applicationId}`,
      {
        method: 'POST',
        body: JSON.stringify({
          phone_number: phone,
          // 不提供 old_password，表示设置密码
          new_password: newPassword,
        }),
      }
    )

    console.log('✅ 密码设置成功:', result)
    return result
  } catch (error: any) {
    console.error('设置密码失败:', error)
    throw error
  }
}
