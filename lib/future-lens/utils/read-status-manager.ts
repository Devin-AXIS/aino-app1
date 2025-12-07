/**
 * 已读/未读状态管理工具
 * 使用 localStorage 持久化存储
 */

const STORAGE_KEY = "future-lens-read-status"

interface ReadStatus {
  [eventId: string]: {
    read: boolean
    readAt: string // ISO 8601 格式
  }
}

/**
 * 初始化默认已读状态（用于测试）
 * task-001: event-002, event-003 已读（1个未读：event-001）
 * task-002: event-006 已读（2个未读：event-004, event-005）
 * task-003: event-007, event-008 已读（0个未读）
 */
function getDefaultReadStatus(): ReadStatus {
  return {
    "event-002": {
      read: true,
      readAt: new Date().toISOString(),
    },
    "event-003": {
      read: true,
      readAt: new Date().toISOString(),
    },
    "event-006": {
      read: true,
      readAt: new Date().toISOString(),
    },
    "event-007": {
      read: true,
      readAt: new Date().toISOString(),
    },
    "event-008": {
      read: true,
      readAt: new Date().toISOString(),
    },
  }
}

/**
 * 获取所有已读状态
 */
export function getAllReadStatus(): ReadStatus {
  if (typeof window === "undefined") return getDefaultReadStatus()
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    // 如果已有存储，检查是否需要重置为默认状态（用于开发测试）
    // 可以通过 localStorage 设置 "reset-read-status" 来重置
    if (stored) {
      const shouldReset = localStorage.getItem("reset-read-status")
      if (shouldReset === "true") {
        localStorage.removeItem("reset-read-status")
        const defaultStatus = getDefaultReadStatus()
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultStatus))
        return defaultStatus
      }
      return JSON.parse(stored)
    }
    // 如果没有存储，返回默认已读状态
    const defaultStatus = getDefaultReadStatus()
    // 保存默认状态到 localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultStatus))
    return defaultStatus
  } catch (error) {
    console.error("[ReadStatusManager] 读取已读状态失败:", error)
    return getDefaultReadStatus()
  }
}

/**
 * 重置为默认已读状态（用于开发测试）
 */
export function resetToDefaultReadStatus(): void {
  if (typeof window === "undefined") return
  localStorage.setItem("reset-read-status", "true")
  const defaultStatus = getDefaultReadStatus()
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultStatus))
}

/**
 * 检查事件是否已读
 */
export function isEventRead(eventId: string): boolean {
  const status = getAllReadStatus()
  return status[eventId]?.read === true
}

/**
 * 标记事件为已读
 */
export function markEventAsRead(eventId: string): void {
  if (typeof window === "undefined") return
  
  try {
    const status = getAllReadStatus()
    status[eventId] = {
      read: true,
      readAt: new Date().toISOString(),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(status))
  } catch (error) {
    console.error("[ReadStatusManager] 标记已读失败:", error)
  }
}

/**
 * 批量标记事件为已读
 */
export function markEventsAsRead(eventIds: string[]): void {
  if (typeof window === "undefined") return
  
  try {
    const status = getAllReadStatus()
    const now = new Date().toISOString()
    
    eventIds.forEach((eventId) => {
      status[eventId] = {
        read: true,
        readAt: now,
      }
    })
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(status))
  } catch (error) {
    console.error("[ReadStatusManager] 批量标记已读失败:", error)
  }
}

/**
 * 标记事件为未读（用于测试或重置）
 */
export function markEventAsUnread(eventId: string): void {
  if (typeof window === "undefined") return
  
  try {
    const status = getAllReadStatus()
    delete status[eventId]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(status))
  } catch (error) {
    console.error("[ReadStatusManager] 标记未读失败:", error)
  }
}

/**
 * 获取任务的未读事件列表
 */
export function getUnreadEventsForTask(taskId: string, allEvents: Array<{ metadata?: { taskId?: string; eventId?: string } }>): string[] {
  const taskEvents = allEvents.filter(
    (event) => event.metadata?.taskId === taskId && event.metadata?.eventId
  )
  
  return taskEvents
    .map((event) => event.metadata?.eventId)
    .filter((eventId): eventId is string => {
      if (!eventId) return false
      return !isEventRead(eventId)
    })
}

/**
 * 获取任务的未读数量
 */
export function getUnreadCountForTask(taskId: string, allEvents: Array<{ metadata?: { taskId?: string; eventId?: string } }>): number {
  return getUnreadEventsForTask(taskId, allEvents).length
}

/**
 * 清除所有已读状态（用于测试）
 */
export function clearAllReadStatus(): void {
  if (typeof window === "undefined") return
  
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error("[ReadStatusManager] 清除已读状态失败:", error)
  }
}

