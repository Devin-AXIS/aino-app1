/**
 * 积分系统 API 封装层
 */

import { apiRequest } from './sdk-instance'
import { getAINOConfig } from './config'

/**
 * 获取当前用户的积分账户
 */
export async function getCurrentUserPointsAccount(pointsType: string = 'points') {
  try {
    const config = getAINOConfig()
    const applicationId = config.applicationId
    
    if (!applicationId) {
      throw new Error('缺少应用ID配置')
    }

    // 从 localStorage 获取当前用户ID（应用用户的 UUID）
    let userId: string | null = null
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('aino_user')
      if (userStr) {
        try {
          const user = JSON.parse(userStr)
          // 优先使用 userId（应用用户的 UUID）
          userId = user.userId || (user.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(user.id) ? user.id : null)
        } catch (e) {
          console.error('解析用户信息失败:', e)
        }
      }
    }

    // 检查是否有 token，如果没有 token 则直接返回默认值（未登录状态）
    let token: string | null = null
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('aino_token')
    }
    
    if (!userId || !token) {
      // 未登录或没有用户ID，返回默认值，不抛出错误
      return {
        balance: 0,
        totalEarned: 0,
        totalSpent: 0,
        pointsName: '积分',
        pointsNameI18n: { zh: '积分', en: 'Points' },
        pointsType: pointsType,
      }
    }

    // 调用后端 API: GET /api/operations-center/points/accounts?applicationId=xxx&userId=xxx&pointsType=xxx
    const result = await apiRequest(
      `/api/operations-center/points/accounts?applicationId=${applicationId}&userId=${userId}&pointsType=${pointsType}&page=1&limit=1`,
      {
        method: 'GET',
      }
    )

    if (result.success && result.data && result.data.accounts && result.data.accounts.length > 0) {
      return result.data.accounts[0] // 返回第一个积分账户
    }

    // 如果没有积分账户，返回默认值
    return {
      balance: 0,
      totalEarned: 0,
      totalSpent: 0,
      pointsName: '积分',
      pointsNameI18n: { zh: '积分', en: 'Points' }, // 默认中英文名称
      pointsType: pointsType,
    }
  } catch (error: any) {
    // 如果是认证失败，静默处理，不输出错误日志（避免控制台噪音）
    const isAuthError = error?.message?.includes('认证失败') || error?.message?.includes('未找到用户ID')
    if (!isAuthError) {
      console.error('获取积分账户失败:', error)
    }
    // 失败时返回默认值，避免影响其他功能
    return {
      balance: 0,
      totalEarned: 0,
      totalSpent: 0,
      pointsName: '积分',
      pointsNameI18n: { zh: '积分', en: 'Points' }, // 默认中英文名称
      pointsType: pointsType,
    }
  }
}

