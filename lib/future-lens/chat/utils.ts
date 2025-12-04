/**
 * 聊天相关的工具函数
 * 处理消息格式转换、流式响应解析等
 */

import type { ChatMessage, MessagePart, OpenAIMessage, OpenAIStreamChunk, StreamDataPart } from "./types"

/**
 * 将前端消息格式转换为 OpenAI 格式
 */
export function toOpenAIFormat(messages: ChatMessage[]): OpenAIMessage[] {
  return messages.map((msg) => {
    // 提取所有文本部分
    const textParts = msg.parts.filter((part): part is Extract<MessagePart, { type: "text" }> => part.type === "text")
    const content = textParts.map((part) => part.text).join("\n")

    return {
      role: msg.role === "ai" ? "assistant" : msg.role,
      content,
    }
  })
}

/**
 * 将 OpenAI 格式转换为前端消息格式
 */
export function fromOpenAIFormat(
  openAIMessage: { role: "assistant"; content: string; reasoning?: string },
  id: string,
  timestamp?: string,
): ChatMessage {
  const parts: MessagePart[] = [{ type: "text", text: openAIMessage.content }]

  // 如果有思维链，添加到 parts
  if (openAIMessage.reasoning) {
    parts.unshift({ type: "reasoning", text: openAIMessage.reasoning })
  }

  return {
    id,
    role: "ai",
    parts,
    timestamp,
    reasoning: openAIMessage.reasoning, // 兼容旧格式
  }
}

/**
 * 解析 OpenAI 流式响应（SSE 格式）
 */
export async function* parseOpenAIStream(
  response: Response,
): AsyncGenerator<StreamDataPart, void, unknown> {
  if (!response.body) {
    throw new Error("Response body is null")
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ""

  try {
    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        break
      }

      buffer += decoder.decode(value, { stream: true })

      // 处理 SSE 格式：每行以 "data: " 开头
      const lines = buffer.split("\n")
      buffer = lines.pop() || "" // 保留最后一个不完整的行

      for (const line of lines) {
        const trimmedLine = line.trim()

        if (!trimmedLine || trimmedLine === "data: [DONE]") {
          continue
        }

        if (trimmedLine.startsWith("data: ")) {
          try {
            const jsonStr = trimmedLine.slice(6) // 移除 "data: " 前缀
            const chunk: OpenAIStreamChunk = JSON.parse(jsonStr)

            // 处理每个 choice
            for (const choice of chunk.choices) {
              const { delta, finish_reason } = choice

              // 文本增量
              if (delta.content) {
                yield {
                  type: "text-delta",
                  content: delta.content,
                }
              }

              // 思维链增量
              if (delta.reasoning) {
                yield {
                  type: "reasoning-delta",
                  content: delta.reasoning,
                }
              }

              // 消息结束
              if (finish_reason) {
                yield {
                  type: "message-end",
                  id: chunk.id,
                }
              }
            }
          } catch (error) {
            console.error("Failed to parse SSE chunk:", error, trimmedLine)
            yield {
              type: "error",
              error: "Failed to parse stream chunk",
            }
          }
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
}

/**
 * 解析 OpenAI 流式响应（JSON 流格式）
 * 如果后端使用 JSON 流而不是 SSE
 */
export async function* parseOpenAIJSONStream(
  response: Response,
): AsyncGenerator<StreamDataPart, void, unknown> {
  if (!response.body) {
    throw new Error("Response body is null")
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ""

  try {
    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        break
      }

      buffer += decoder.decode(value, { stream: true })

      // 处理 JSON 流：每行是一个 JSON 对象
      const lines = buffer.split("\n")
      buffer = lines.pop() || ""

      for (const line of lines) {
        const trimmedLine = line.trim()

        if (!trimmedLine) {
          continue
        }

        try {
          const chunk: OpenAIStreamChunk = JSON.parse(trimmedLine)

          for (const choice of chunk.choices) {
            const { delta, finish_reason } = choice

            if (delta.content) {
              yield {
                type: "text-delta",
                content: delta.content,
              }
            }

            if (delta.reasoning) {
              yield {
                type: "reasoning-delta",
                content: delta.reasoning,
              }
            }

            if (finish_reason) {
              yield {
                type: "message-end",
                id: chunk.id,
              }
            }
          }
        } catch (error) {
          console.error("Failed to parse JSON chunk:", error, trimmedLine)
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
}

/**
 * 从消息中提取文本内容
 */
export function getTextFromMessage(message: ChatMessage): string {
  return message.parts
    .filter((part): part is Extract<MessagePart, { type: "text" }> => part.type === "text")
    .map((part) => part.text)
    .join("")
}

/**
 * 从消息中提取思维链
 */
export function getReasoningFromMessage(message: ChatMessage): string | undefined {
  // 优先从 parts 中查找
  const reasoningPart = message.parts.find(
    (part): part is Extract<MessagePart, { type: "reasoning" }> => part.type === "reasoning",
  )

  if (reasoningPart) {
    return reasoningPart.text
  }

  // 兼容旧格式
  return message.reasoning
}

/**
 * 生成 UUID
 */
export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

