/**
 * 聊天消息类型定义
 * 支持多种内容类型：文本、Markdown、表格、HTML/CSS、图片、视频、卡片等
 */

import type { CardInstance } from "@/lib/future-lens/types/card-types"

/**
 * 消息内容部分类型
 */
export type MessagePart =
  | { type: "text"; text: string }
  | { type: "markdown"; content: string }
  | { type: "reasoning"; text: string }
  | { type: "image"; src: string; alt?: string; caption?: string }
  | { type: "video"; src: string; poster?: string; caption?: string }
  | { type: "table"; data: Array<Record<string, any>>; headers?: string[] }
  | { type: "html"; html: string; css?: string } // HTML+CSS 卡片
  | { type: "card"; cardData: CardInstance } // 自定义卡片

/**
 * 聊天消息
 */
export interface ChatMessage {
  id: string
  role: "user" | "ai" | "system"
  parts: MessagePart[]
  timestamp?: string
  reasoning?: string // 兼容旧格式
  isStreaming?: boolean
}

/**
 * 从旧格式转换到新格式
 */
export async function convertToNewFormat(oldMessage: {
  id: string
  type: "user" | "ai"
  content: string
  timestamp?: string
  reasoning?: string
  isStreaming?: boolean
}): Promise<ChatMessage> {
  const parts: MessagePart[] = []

  // 添加思维链（如果有）
  if (oldMessage.reasoning && oldMessage.reasoning.trim().length > 0) {
    parts.push({ type: "reasoning", text: oldMessage.reasoning })
  }

  // 添加文本内容
  if (oldMessage.content && oldMessage.content.trim().length > 0) {
    // 只有 AI 消息才解析表格和 HTML，用户消息直接显示为文本
    const isAI = oldMessage.type === "ai"
    
    if (isAI) {
      // AI 消息：动态导入内容检测工具，解析表格和 HTML
      const { detectContentType, parseMarkdownTable, extractHTMLCode } = await import("./content-detector")
      const contentType = detectContentType(oldMessage.content)

      switch (contentType) {
        case "table": {
          // 解析表格数据
          const tableData = parseMarkdownTable(oldMessage.content)
          if (tableData) {
            parts.push({
              type: "table",
              data: tableData.data,
              headers: tableData.headers,
            })
          } else {
            // 如果解析失败，作为 Markdown 处理（可能包含表格语法）
            parts.push({ type: "markdown", content: oldMessage.content })
          }
          break
        }

        case "html": {
          // 提取 HTML 代码
          const htmlCode = extractHTMLCode(oldMessage.content)
          if (htmlCode) {
            parts.push({
              type: "html",
              html: htmlCode.html,
              css: htmlCode.css,
            })
          } else {
            // 如果提取失败，作为 Markdown 处理
            parts.push({ type: "markdown", content: oldMessage.content })
          }
          break
        }

        case "markdown": {
          parts.push({ type: "markdown", content: oldMessage.content })
          break
        }

        default: {
          parts.push({ type: "text", text: oldMessage.content })
        }
      }
    } else {
      // 用户消息：直接作为文本显示，不解析表格和 HTML
      // 检测是否是 Markdown（简单检测）
      const isMarkdown = /^#{1,6}\s|^\*\s|^-\s|^\d+\.\s|```|\[.*\]\(.*\)|!\[.*\]\(.*\)/m.test(oldMessage.content)
      
      if (isMarkdown) {
        parts.push({ type: "markdown", content: oldMessage.content })
      } else {
        parts.push({ type: "text", text: oldMessage.content })
      }
    }
  }

  return {
    id: oldMessage.id,
    role: oldMessage.type === "ai" ? "ai" : "user",
    parts,
    timestamp: oldMessage.timestamp,
    reasoning: oldMessage.reasoning,
    isStreaming: oldMessage.isStreaming,
  }
}

/**
 * 从新格式转换到旧格式（向后兼容）
 */
export function convertToOldFormat(newMessage: ChatMessage): {
  id: string
  type: "user" | "ai"
  content: string
  timestamp?: string
  reasoning?: string
  isStreaming?: boolean
} {
  // 提取文本内容
  const textParts = newMessage.parts.filter((p): p is Extract<MessagePart, { type: "text" | "markdown" }> => 
    p.type === "text" || p.type === "markdown"
  )
  const content = textParts.map(p => p.type === "text" ? p.text : p.content).join("\n")

  // 提取思维链
  const reasoningPart = newMessage.parts.find((p): p is Extract<MessagePart, { type: "reasoning" }> => 
    p.type === "reasoning"
  )
  const reasoning = reasoningPart?.text || newMessage.reasoning

  return {
    id: newMessage.id,
    type: newMessage.role === "ai" ? "ai" : "user",
    content,
    timestamp: newMessage.timestamp,
    reasoning,
    isStreaming: newMessage.isStreaming,
  }
}

