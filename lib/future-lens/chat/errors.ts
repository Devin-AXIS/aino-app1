/**
 * 聊天相关的错误处理
 * 参考 Vercel ai-chatbot 的错误处理机制
 */

export type ErrorType = "bad_request" | "unauthorized" | "forbidden" | "not_found" | "rate_limit" | "offline"

export type Surface = "chat" | "api" | "stream" | "auth"

export type ErrorCode = `${ErrorType}:${Surface}`

export type ErrorVisibility = "response" | "log" | "none"

export const visibilityBySurface: Record<Surface, ErrorVisibility> = {
  chat: "response",
  api: "response",
  stream: "response",
  auth: "response",
}

export class ChatSDKError extends Error {
  type: ErrorType
  surface: Surface
  statusCode: number
  cause?: string

  constructor(errorCode: ErrorCode, cause?: string) {
    super()

    const [type, surface] = errorCode.split(":") as [ErrorType, Surface]

    this.type = type
    this.cause = cause
    this.surface = surface
    this.message = getMessageByErrorCode(errorCode)
    this.statusCode = getStatusCodeByType(this.type)
  }

  toResponse() {
    const code: ErrorCode = `${this.type}:${this.surface}`
    const visibility = visibilityBySurface[this.surface]

    const { message, cause, statusCode } = this

    if (visibility === "log") {
      console.error({
        code,
        message,
        cause,
      })

      return Response.json(
        { code: "", message: "Something went wrong. Please try again later." },
        { status: statusCode },
      )
    }

    return Response.json({ code, message, cause }, { status: statusCode })
  }
}

export function getMessageByErrorCode(errorCode: ErrorCode): string {
  switch (errorCode) {
    case "bad_request:api":
      return "请求无法处理，请检查输入后重试。"

    case "unauthorized:auth":
      return "您需要先登录才能继续。"
    case "forbidden:auth":
      return "您的账户无权访问此功能。"

    case "rate_limit:chat":
      return "您已达到每日消息上限，请稍后再试。"
    case "not_found:chat":
      return "未找到请求的对话，请检查对话 ID 后重试。"
    case "forbidden:chat":
      return "此对话属于其他用户，请检查对话 ID 后重试。"
    case "unauthorized:chat":
      return "您需要登录才能查看此对话，请登录后重试。"
    case "offline:chat":
      return "发送消息时出现问题，请检查网络连接后重试。"

    case "not_found:stream":
      return "未找到请求的流，请检查流 ID 后重试。"

    default:
      return "出现了问题，请稍后重试。"
  }
}

function getStatusCodeByType(type: ErrorType): number {
  switch (type) {
    case "bad_request":
      return 400
    case "unauthorized":
      return 401
    case "forbidden":
      return 403
    case "not_found":
      return 404
    case "rate_limit":
      return 429
    case "offline":
      return 503
    default:
      return 500
  }
}

