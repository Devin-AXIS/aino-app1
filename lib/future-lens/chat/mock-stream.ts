/**
 * 模拟流式响应的工具函数
 * 用于在没有真实后端时展示流式效果
 */

import type { ChatMessage, MessagePart } from "./types"
import { generateUUID } from "./utils"

interface StreamOptions {
  onDelta?: (delta: string, type: "text" | "reasoning") => void
  onFinish?: (message: ChatMessage) => void
  onError?: (error: Error) => void
  speed?: number // 每个字符的延迟（毫秒）
}

/**
 * 模拟流式输出文本
 */
async function streamText(
  text: string,
  type: "text" | "reasoning",
  options: StreamOptions,
): Promise<string> {
  const { onDelta, speed = 20 } = options
  let output = ""

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    output += char

    if (onDelta) {
      onDelta(char, type)
    }

    // 控制流式速度
    await new Promise((resolve) => setTimeout(resolve, speed))
  }

  return output
}

/**
 * 模拟流式响应（包含思维链和消息内容）
 */
export async function mockStreamResponse(
  content: string,
  reasoning?: string,
  options: StreamOptions = {},
): Promise<ChatMessage> {
  const { onDelta, onFinish, onError } = options
  const messageId = generateUUID()
  const parts: MessagePart[] = []
  let textContent = ""
  let reasoningContent = ""

  try {
    // 先流式输出思维链（如果有）
    if (reasoning) {
      reasoningContent = await streamText(reasoning, "reasoning", {
        ...options,
        onDelta: (delta) => {
          reasoningContent += delta
          // 更新 parts
          const reasoningPart: MessagePart = { type: "reasoning", text: reasoningContent }
          const textPart: MessagePart = { type: "text", text: textContent }
          const currentParts = textContent ? [reasoningPart, textPart] : [reasoningPart]

          if (onDelta) {
            onDelta(delta, "reasoning")
          }

          // 触发更新
          const currentMessage: ChatMessage = {
            id: messageId,
            role: "ai",
            parts: currentParts,
            reasoning: reasoningContent,
            isStreaming: true,
          }

          // 可以在这里调用回调来更新 UI
          if (options.onDelta) {
            // 这里需要传递完整消息，但为了兼容，我们只传递增量
            // 实际使用时，应该在调用方维护消息状态
          }
        },
      })

      parts.push({ type: "reasoning", text: reasoningContent })
    }

    // 然后流式输出消息内容
    textContent = await streamText(content, "text", {
      ...options,
      onDelta: (delta) => {
        textContent += delta
        const currentParts: MessagePart[] = []

        if (reasoningContent) {
          currentParts.push({ type: "reasoning", text: reasoningContent })
        }
        currentParts.push({ type: "text", text: textContent })

        if (onDelta) {
          onDelta(delta, "text")
        }
      },
    })

    parts.push({ type: "text", text: textContent })

    const finalMessage: ChatMessage = {
      id: messageId,
      role: "ai",
      parts,
      reasoning: reasoningContent || undefined,
      isStreaming: false,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    if (onFinish) {
      onFinish(finalMessage)
    }

    return finalMessage
  } catch (error) {
    if (onError) {
      onError(error instanceof Error ? error : new Error(String(error)))
    }
    throw error
  }
}

/**
 * 更简单的流式输出函数，返回一个异步生成器
 */
export async function* streamTextGenerator(
  text: string,
  speed: number = 20,
): AsyncGenerator<string, void, unknown> {
  for (let i = 0; i < text.length; i++) {
    yield text[i]
    await new Promise((resolve) => setTimeout(resolve, speed))
  }
}

