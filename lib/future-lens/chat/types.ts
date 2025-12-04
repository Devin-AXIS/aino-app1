/**
 * 聊天相关的类型定义
 * 支持 OpenAI 格式和前端显示格式的转换
 */

// OpenAI 格式的消息
export type OpenAIMessage = {
  role: "user" | "assistant" | "system"
  content: string
}

// OpenAI 流式响应块
export type OpenAIStreamChunk = {
  id: string
  object: "chat.completion.chunk"
  created: number
  model: string
  choices: Array<{
    index: number
    delta: {
      role?: "assistant"
      content?: string
      reasoning?: string // 思维链（如果支持）
    }
    finish_reason?: string | null
  }>
}

// 前端消息格式
export type MessagePart =
  | { type: "text"; text: string }
  | { type: "file"; url: string; name: string; mediaType: string }
  | { type: "reasoning"; text: string } // 思维链

export type ChatMessage = {
  id: string
  role: "user" | "assistant" | "system"
  parts: MessagePart[]
  timestamp?: string
  reasoning?: string // 思维链（兼容旧格式）
  isStreaming?: boolean
}

// 流式数据块类型
export type StreamDataPart =
  | { type: "text-delta"; content: string }
  | { type: "reasoning-delta"; content: string }
  | { type: "message-start"; id: string }
  | { type: "message-end"; id: string }
  | { type: "error"; error: string }

// API 请求格式
export type ChatRequest = {
  messages: OpenAIMessage[]
  stream?: boolean
  model?: string
  temperature?: number
  max_tokens?: number
}

// API 响应格式（非流式）
export type ChatResponse = {
  id: string
  object: "chat.completion"
  created: number
  model: string
  choices: Array<{
    index: number
    message: {
      role: "assistant"
      content: string
      reasoning?: string
    }
    finish_reason: string
  }>
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

