/**
 * 流式处理工具函数
 * 参考 Vercel ai-chatbot 的实现思路，优化流式更新性能
 */

/**
 * 节流函数 - 参考 Vercel 的 experimental_throttle
 * 限制函数执行频率，避免过于频繁的更新
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let lastCall = 0
  let timeoutId: NodeJS.Timeout | null = null

  return function throttled(...args: Parameters<T>) {
    const now = Date.now()
    const timeSinceLastCall = now - lastCall

    if (timeSinceLastCall >= delay) {
      lastCall = now
      func(...args)
    } else {
      // 如果距离上次调用时间不够，延迟执行
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      timeoutId = setTimeout(() => {
        lastCall = Date.now()
        func(...args)
        timeoutId = null
      }, delay - timeSinceLastCall)
    }
  }
}

/**
 * 批量更新工具
 * 将多个更新合并，减少 React 重新渲染次数
 */
export class BatchUpdater<T> {
  private updates: T[] = []
  private timeoutId: NodeJS.Timeout | null = null
  private readonly delay: number
  private readonly callback: (updates: T[]) => void

  constructor(callback: (updates: T[]) => void, delay: number = 50) {
    this.callback = callback
    this.delay = delay
  }

  add(update: T) {
    this.updates.push(update)

    if (!this.timeoutId) {
      this.timeoutId = setTimeout(() => {
        this.flush()
      }, this.delay)
    }
  }

  flush() {
    if (this.updates.length > 0) {
      this.callback(this.updates)
      this.updates = []
    }
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
      this.timeoutId = null
    }
  }

  destroy() {
    this.flush()
  }
}

/**
 * 流式文本生成器（优化版）
 * 参考 Vercel 的平滑流式输出，支持节流和批量更新
 */
export async function* streamTextOptimized(
  text: string,
  options: {
    speed?: number // 每个字符的基础延迟
    throttle?: number // 节流延迟（毫秒）
    chunkSize?: number // 每次更新的字符数
  } = {},
): AsyncGenerator<string, void, unknown> {
  const { speed = 10, throttle: throttleDelay = 100, chunkSize = 1 } = options

  let buffer = ""
  let lastYield = Date.now()

  for (let i = 0; i < text.length; i += chunkSize) {
    const chunk = text.slice(i, i + chunkSize)
    buffer += chunk

    const now = Date.now()
    const timeSinceLastYield = now - lastYield

    // 如果达到节流延迟，或者缓冲区积累了一定内容，就 yield
    if (timeSinceLastYield >= throttleDelay || buffer.length >= 10) {
      yield buffer
      buffer = ""
      lastYield = now
    }

    // 基础延迟
    await new Promise((resolve) => setTimeout(resolve, speed))
  }

  // 输出剩余内容
  if (buffer.length > 0) {
    yield buffer
  }
}

/**
 * 智能流式更新
 * 结合节流和批量更新，优化性能
 */
export function createStreamUpdater<T>(
  updateFn: (value: T) => void,
  options: {
    throttle?: number
    batchDelay?: number
  } = {},
): (value: T) => void {
  const { throttle: throttleDelay = 100, batchDelay = 50 } = options

  // 使用节流限制更新频率
  const throttledUpdate = throttle(updateFn, throttleDelay)

  // 使用批量更新合并多次调用
  const batchUpdater = new BatchUpdater<T>((updates) => {
    // 取最后一个更新（最新的值）
    if (updates.length > 0) {
      throttledUpdate(updates[updates.length - 1])
    }
  }, batchDelay)

  return (value: T) => {
    batchUpdater.add(value)
  }
}

