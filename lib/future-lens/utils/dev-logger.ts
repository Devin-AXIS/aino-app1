/**
 * 开发环境日志工具
 * 生产环境下自动移除，保持轻量
 */

export const isDev = process.env.NODE_ENV === "development"

export const devLog = isDev ? console.log : () => {}
export const devWarn = isDev ? console.warn : () => {}
export const devError = isDev ? console.error : () => {}

/**
 * 带标签的日志输出
 */
export const logger = {
  action: (...args: any[]) => devLog("[Action]", ...args),
  navigation: (...args: any[]) => devLog("[Navigation]", ...args),
  data: (...args: any[]) => devLog("[Data]", ...args),
  render: (...args: any[]) => devLog("[Render]", ...args),
}
