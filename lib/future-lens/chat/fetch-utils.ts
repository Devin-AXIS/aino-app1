/**
 * 聊天 API 请求工具函数
 * 参考 Vercel ai-chatbot 的错误处理机制
 */

import { ChatSDKError, type ErrorCode } from "./errors"

/**
 * 带错误处理的 fetch 函数
 * 参考 Vercel ai-chatbot 的 fetchWithErrorHandlers
 */
export async function fetchWithErrorHandlers(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  try {
    const response = await fetch(input, init)

    if (!response.ok) {
      // 尝试解析错误响应
      try {
        const errorData = await response.json()
        if (errorData.code) {
          throw new ChatSDKError(errorData.code as ErrorCode, errorData.cause)
        }
      } catch {
        // 如果无法解析 JSON，使用状态码推断错误类型
        const errorCode = getErrorCodeFromStatus(response.status)
        throw new ChatSDKError(errorCode)
      }
    }

    return response
  } catch (error: unknown) {
    // 检查网络错误
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      throw new ChatSDKError("offline:chat")
    }

    // 如果是 ChatSDKError，直接抛出
    if (error instanceof ChatSDKError) {
      throw error
    }

    // 其他错误
    throw new ChatSDKError("offline:chat", error instanceof Error ? error.message : String(error))
  }
}

/**
 * 根据 HTTP 状态码推断错误类型
 */
function getErrorCodeFromStatus(status: number): ErrorCode {
  switch (status) {
    case 400:
      return "bad_request:api"
    case 401:
      return "unauthorized:auth"
    case 403:
      return "forbidden:auth"
    case 404:
      return "not_found:chat"
    case 429:
      return "rate_limit:chat"
    case 503:
      return "offline:chat"
    default:
      return "offline:chat"
  }
}

/**
 * 通用的 fetcher 函数（用于 SWR 等）
 */
export const fetcher = async (url: string) => {
  const response = await fetchWithErrorHandlers(url)

  return response.json()
}

