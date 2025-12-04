/**
 * 聊天流式响应 Hook
 * 用于处理与 Hono 后端的流式对话
 */

import { useState, useCallback, useRef, useEffect } from "react"
import type { ChatMessage, StreamDataPart } from "@/lib/future-lens/chat/types"
import { parseOpenAIStream, parseOpenAIJSONStream, fromOpenAIFormat, generateUUID } from "@/lib/future-lens/chat/utils"
import { fetchWithErrorHandlers } from "@/lib/future-lens/chat/fetch-utils"
import { ChatSDKError } from "@/lib/future-lens/chat/errors"

interface UseChatStreamOptions {
  apiEndpoint?: string
  onError?: (error: Error) => void
  onFinish?: (message: ChatMessage) => void
}

interface UseChatStreamReturn {
  sendMessage: (messages: ChatMessage[]) => Promise<void>
  isStreaming: boolean
  currentMessage: ChatMessage | null
  stop: () => void
}

export function useChatStream(options: UseChatStreamOptions = {}): UseChatStreamReturn {
  const { apiEndpoint = "/api/chat", onError, onFinish } = options

  const [isStreaming, setIsStreaming] = useState(false)
  const [currentMessage, setCurrentMessage] = useState<ChatMessage | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const messageIdRef = useRef<string | null>(null)

  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setIsStreaming(false)
  }, [])

  const sendMessage = useCallback(
    async (messages: ChatMessage[]) => {
      // 停止之前的请求
      stop()

      // 创建新的 AbortController
      const abortController = new AbortController()
      abortControllerRef.current = abortController

      setIsStreaming(true)

      // 生成新消息 ID
      const messageId = generateUUID()
      messageIdRef.current = messageId

      // 初始化消息
      const initialMessage: ChatMessage = {
        id: messageId,
        role: "ai",
        parts: [{ type: "text", text: "" }],
        isStreaming: true,
      }
      setCurrentMessage(initialMessage)

      try {
        // 转换消息格式为 OpenAI 格式
        const openAIMessages = messages.map((msg) => ({
          role: msg.role === "ai" ? "assistant" : msg.role,
          content: msg.parts
            .filter((part) => part.type === "text")
            .map((part) => part.text)
            .join("\n"),
        }))

        // 发送请求
        const response = await fetchWithErrorHandlers(apiEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: openAIMessages,
            stream: true,
          }),
          signal: abortController.signal,
        })

        // 检查响应类型（SSE 或 JSON 流）
        const contentType = response.headers.get("content-type") || ""
        const isSSE = contentType.includes("text/event-stream")
        const isJSONStream = contentType.includes("application/x-ndjson") || contentType.includes("application/json")

        // 解析流式响应
        const streamParser = isSSE ? parseOpenAIStream(response) : parseOpenAIJSONStream(response)

        let content = ""
        let reasoning = ""

        for await (const part of streamParser) {
          if (abortController.signal.aborted) {
            break
          }

          switch (part.type) {
            case "text-delta":
              content += part.content
              setCurrentMessage((prev) => {
                if (!prev) return prev
                return {
                  ...prev,
                  parts: [{ type: "text", text: content }],
                  isStreaming: true,
                }
              })
              break

            case "reasoning-delta":
              reasoning += part.content
              setCurrentMessage((prev) => {
                if (!prev) return prev
                const parts = prev.parts.filter((p) => p.type !== "reasoning")
                parts.unshift({ type: "reasoning", text: reasoning })
                return {
                  ...prev,
                  parts,
                  reasoning, // 兼容旧格式
                  isStreaming: true,
                }
              })
              break

            case "message-end":
              setIsStreaming(false)
              setCurrentMessage((prev) => {
                if (!prev) return prev
                const finalMessage: ChatMessage = {
                  ...prev,
                  isStreaming: false,
                  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                }
                onFinish?.(finalMessage)
                return finalMessage
              })
              break

            case "error":
              throw new Error(part.error)
          }
        }
      } catch (error) {
        setIsStreaming(false)
        setCurrentMessage(null)

        if (error instanceof ChatSDKError) {
          onError?.(error)
        } else if (error instanceof Error && error.name !== "AbortError") {
          onError?.(error)
        }
      } finally {
        abortControllerRef.current = null
      }
    },
    [apiEndpoint, onError, onFinish, stop],
  )

  // 清理函数
  useEffect(() => {
    return () => {
      stop()
    }
  }, [stop])

  return {
    sendMessage,
    isStreaming,
    currentMessage,
    stop,
  }
}

