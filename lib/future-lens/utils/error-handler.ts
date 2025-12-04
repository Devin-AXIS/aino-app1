/**
 * 全局错误处理工具
 * 
 * 提供统一的错误捕获和上报机制
 * 
 * @example
 * ```typescript
 * import { errorHandler } from '@/lib/future-lens/utils/error-handler'
 * 
 * try {
 *   // 代码
 * } catch (error) {
 *   errorHandler.capture(error)
 * }
 * ```
 */

interface ErrorInfo {
  message: string
  stack?: string
  componentStack?: string
  timestamp: number
  url: string
  userAgent: string
}

class ErrorHandler {
  /**
   * 捕获错误
   */
  capture(error: Error, errorInfo?: React.ErrorInfo): void {
    const errorData: ErrorInfo = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: Date.now(),
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    }

    // 开发环境：输出到控制台
    if (process.env.NODE_ENV === 'development') {
      console.error('[ErrorHandler]', errorData)
    }

    // 生产环境：可以上报到错误监控服务
    // 例如：Sentry, LogRocket 等
    if (process.env.NODE_ENV === 'production') {
      // TODO: 集成错误监控服务
      // this.report(errorData)
    }
  }

  /**
   * 上报错误到监控服务
   */
  async report(errorData: ErrorInfo): Promise<void> {
    try {
      // 这里可以集成错误监控服务
      // 例如：fetch('/api/errors', { method: 'POST', body: JSON.stringify(errorData) })
      console.warn('[ErrorHandler] Error reporting not configured', errorData)
    } catch (reportError) {
      console.error('[ErrorHandler] Failed to report error', reportError)
    }
  }

  /**
   * 初始化全局错误监听
   */
  init(): void {
    if (typeof window === 'undefined') return

    // 捕获未处理的 JavaScript 错误
    window.addEventListener('error', (event) => {
      const error = event.error || new Error(event.message)
      this.capture(error)
    })

    // 捕获未处理的 Promise 拒绝
    window.addEventListener('unhandledrejection', (event) => {
      const error = event.reason instanceof Error 
        ? event.reason 
        : new Error(String(event.reason))
      this.capture(error)
    })
  }
}

export const errorHandler = new ErrorHandler()

// 自动初始化（仅在浏览器环境）
if (typeof window !== 'undefined') {
  errorHandler.init()
}

