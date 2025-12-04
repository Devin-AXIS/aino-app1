"use client"

import { memo, useMemo } from "react"
import { cn } from "@/lib/utils"
import { useConfig } from "@/lib/future-lens/config-context"
import { DesignTokens } from "@/lib/future-lens/design-tokens"
import { Reasoning, ReasoningTrigger, ReasoningContent } from "./message-reasoning"
import type { JSX } from "react"

interface MessageBubbleProps {
  type: "user" | "ai"
  content: string
  timestamp?: string
  className?: string
  reasoning?: string // 思维链内容
  isStreaming?: boolean // 是否正在流式输出
}

function MessageBubbleComponent({ type, content, timestamp, className, reasoning, isStreaming }: MessageBubbleProps) {
  const { textScale } = useConfig()
  const isUser = type === "user"

  // Simple markdown-like formatting without external dependencies
  // Memoized to avoid re-computation on every render
  const formattedContent = useMemo(() => {
    const lines = content.split("\n")
    return lines.map((line, i) => {
      // Headers
      if (line.startsWith("### ")) {
        return (
          <h3 key={i} className="text-base font-bold mb-2 mt-3 first:mt-0">
            {line.slice(4)}
          </h3>
        )
      }
      if (line.startsWith("## ")) {
        return (
          <h2 key={i} className="text-lg font-bold mb-2 mt-3 first:mt-0">
            {line.slice(3)}
          </h2>
        )
      }
      if (line.startsWith("# ")) {
        return (
          <h1 key={i} className="text-xl font-bold mb-3 mt-4 first:mt-0">
            {line.slice(2)}
          </h1>
        )
      }

      // Lists
      if (line.match(/^[*-]\s/)) {
        return (
          <li key={i} className="ml-5 list-disc pl-1">
            {line.slice(2)}
          </li>
        )
      }
      if (line.match(/^\d+\.\s/)) {
        return (
          <li key={i} className="ml-5 list-decimal pl-1">
            {line.replace(/^\d+\.\s/, "")}
          </li>
        )
      }

      // Code blocks
      if (line.startsWith("```")) {
        return null // Skip code block markers
      }

      // Empty lines
      if (line.trim() === "") {
        return <br key={i} />
      }

      // Regular paragraphs with inline code and bold
      const formattedLine = line
      const parts: JSX.Element[] = []
      let key = 0

      // Handle inline code `code`
      const codeRegex = /`([^`]+)`/g
      let lastIndex = 0
      let match

      while ((match = codeRegex.exec(formattedLine)) !== null) {
        if (match.index > lastIndex) {
          parts.push(<span key={key++}>{formattedLine.slice(lastIndex, match.index)}</span>)
        }
        parts.push(
          <code key={key++} className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
            {match[1]}
          </code>,
        )
        lastIndex = match.index + match[0].length
      }

      if (lastIndex < formattedLine.length) {
        parts.push(<span key={key++}>{formattedLine.slice(lastIndex)}</span>)
      }

      return (
        <p key={i} className={`${DesignTokens.typography.body} mb-3 last:mb-0`}>
          {parts.length > 0 ? parts : line}
        </p>
      )
    })
  }, [content])

  // 构建 parts 数组，确保顺序：reasoning 在前，text 在后
  const messageParts = useMemo(() => {
    const parts: Array<{ type: "reasoning" | "text"; content: string }> = []
    
    // 先添加思维链（如果有）
    if (reasoning && reasoning.trim().length > 0) {
      parts.push({ type: "reasoning", content: reasoning })
    }
    
    // 再添加文本内容（如果有）
    if (content && content.trim().length > 0) {
      parts.push({ type: "text", content })
    }
    
    return parts
  }, [reasoning, content])

  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start", className)}>
      {/* Message Content */}
      <div className={cn("flex flex-col gap-1", isUser ? "items-end max-w-[85%]" : "items-start w-full")}>
        {/* 按照 parts 顺序渲染 - 参考 Vercel 的实现 */}
        {messageParts.map((part, index) => {
          if (part.type === "reasoning") {
            // 思维链显示在最前面
            return (
              <div key={`reasoning-${index}`} className="mb-2">
                <Reasoning defaultOpen={true} isStreaming={isStreaming}>
                  <ReasoningTrigger />
                  <ReasoningContent>{part.content}</ReasoningContent>
                </Reasoning>
              </div>
            )
          }
          
          if (part.type === "text") {
            // 文本内容显示在思维链后面
            return (
              <div
                key={`text-${index}`}
                className={cn(
                  "relative",
                  isUser
                    ? "px-3 py-2 rounded-[1.25rem] bg-muted text-muted-foreground rounded-tr-sm"
                    : "bg-transparent p-0 w-full text-foreground",
                )}
              >
                {isUser ? (
                  <p
                    className={`${DesignTokens.typography.body} whitespace-pre-wrap`}
                    style={{ fontSize: `${14 * textScale}px` }}
                  >
                    {part.content}
                  </p>
                ) : (
                  <div className="markdown-content" style={{ fontSize: `${15 * textScale}px` }}>
                    {formattedContent}
                  </div>
                )}
              </div>
            )
          }
          
          return null
        })}

        {timestamp && isUser && (
          <span className="text-[10px] text-muted-foreground px-2" style={{ fontSize: `${10 * textScale}px` }}>
            {timestamp}
          </span>
        )}
      </div>
    </div>
  )
}

// Memoized component for performance optimization
export const MessageBubble = memo(MessageBubbleComponent, (prevProps, nextProps) => {
  return (
    prevProps.type === nextProps.type &&
    prevProps.content === nextProps.content &&
    prevProps.timestamp === nextProps.timestamp &&
    prevProps.className === nextProps.className &&
    prevProps.reasoning === nextProps.reasoning &&
    prevProps.isStreaming === nextProps.isStreaming
  )
})
