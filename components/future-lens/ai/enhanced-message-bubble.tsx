/**
 * 增强版消息气泡组件
 * 支持完整的 Markdown、表格、HTML/CSS、图片、视频、卡片等
 * 参考 detail-content-renderer.tsx 的实现
 */

"use client"

import React, { memo, useMemo } from "react"
import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import remarkGfm from "remark-gfm"
import { cn } from "@/lib/utils"
import { useConfig } from "@/lib/future-lens/config-context"
import { DesignTokens } from "@/lib/future-lens/design-tokens"
import { Reasoning, ReasoningTrigger, ReasoningContent } from "./message-reasoning"
import { CardBase } from "@/components/future-lens/ds/card-base"
import { CardFactory } from "@/components/future-lens/cards/card-factory"
import { sanitizeHTML } from "@/lib/future-lens/utils/html-sanitizer"
import type { ChatMessage, MessagePart } from "@/lib/future-lens/chat/message-types"

interface EnhancedMessageBubbleProps {
  message: ChatMessage
  className?: string
}

function EnhancedMessageBubbleComponent({ message, className }: EnhancedMessageBubbleProps) {
  const { textScale } = useConfig()
  const isUser = message.role === "user"
  const fSize = (base: number) => base * textScale

  // 构建 parts 数组，确保顺序：reasoning 在前，其他内容在后
  const messageParts = useMemo(() => {
    const parts: MessagePart[] = []

    // 先添加思维链（如果有）
    const reasoningPart = message.parts.find((p): p is Extract<MessagePart, { type: "reasoning" }> => 
      p.type === "reasoning"
    )
    if (reasoningPart) {
      parts.push(reasoningPart)
    } else if (message.reasoning && message.reasoning.trim().length > 0) {
      // 兼容旧格式
      parts.push({ type: "reasoning", text: message.reasoning })
    }

    // 再添加其他内容（按顺序）
    const otherParts = message.parts.filter(p => p.type !== "reasoning")
    parts.push(...otherParts)

    return parts
  }, [message.parts, message.reasoning])

  // 渲染单个 part
  const renderPart = (part: MessagePart, index: number): React.ReactNode => {
    switch (part.type) {
      case "reasoning":
        return (
          <div key={`reasoning-${index}`} className="mb-3">
            <Reasoning defaultOpen={true} isStreaming={message.isStreaming}>
              <ReasoningTrigger />
              <ReasoningContent>{part.text}</ReasoningContent>
            </Reasoning>
          </div>
        )

      case "text":
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
            <p
              className={`${DesignTokens.typography.body} whitespace-pre-wrap`}
              style={{ fontSize: `${(isUser ? 14 : 15) * textScale}px` }}
            >
              {part.text}
            </p>
          </div>
        )

      case "markdown":
        // 安全清理 HTML 内容
        const sanitizedContent = sanitizeHTML(part.content)
        // 检测是否包含 SVG 或 HTML 标签（需要直接渲染）
        const containsSVG = /<svg[\s\S]*?<\/svg>/i.test(sanitizedContent)
        const containsHTMLTags = /<(div|span|section|article|header|footer|nav|aside|main|figure)[\s\S]*?>/i.test(sanitizedContent)

        // 如果包含 SVG 或复杂 HTML，使用 dangerouslySetInnerHTML 直接渲染（参考 AI 报告详情页）
        if (containsSVG || containsHTMLTags) {
          return (
            <div
              key={`markdown-${index}`}
              className="prose prose-sm max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
          )
        }

        return (
          <div key={`markdown-${index}`} className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                div: (props: any) => <div {...props} />,
                p: ({ children }) => (
                  <p className="mb-4 last:mb-0 leading-relaxed text-foreground" style={{ fontSize: `${fSize(14)}px` }}>
                    {children}
                  </p>
                ),
                h1: ({ children }) => (
                  <h1 className="text-xl font-bold mb-3 mt-6 first:mt-0 text-foreground" style={{ fontSize: `${fSize(18)}px` }}>
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-lg font-semibold mb-2 mt-5 first:mt-0 text-foreground" style={{ fontSize: `${fSize(16)}px` }}>
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-base font-semibold mb-2 mt-4 first:mt-0 text-foreground" style={{ fontSize: `${fSize(15)}px` }}>
                    {children}
                  </h3>
                ),
                ul: ({ children }) => <ul className="my-3 ml-5 list-disc space-y-2">{children}</ul>,
                ol: ({ children }) => <ol className="my-3 ml-5 list-decimal space-y-2">{children}</ol>,
                li: ({ children }) => (
                  <li className="leading-relaxed text-foreground" style={{ fontSize: `${fSize(14)}px` }}>
                    {children}
                  </li>
                ),
                strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                em: ({ children }) => <em className="italic">{children}</em>,
                pre: ({ children, ...props }) => {
                  const codeElement = React.Children.toArray(children).find(
                    (child) => React.isValidElement(child) && (child as React.ReactElement).type === "code"
                  ) as React.ReactElement<{ className?: string; children?: React.ReactNode }> | undefined

                  if (codeElement) {
                    const codeProps = codeElement.props
                    const language = codeProps.className?.replace("language-", "") || ""

                    return (
                      <CardBase className="p-0 my-4 overflow-hidden">
                        {language && (
                          <div className="text-xs text-muted-foreground px-4 pt-3 pb-2 font-mono uppercase border-b border-border/30">
                            {language}
                          </div>
                        )}
                        <pre className="text-sm font-mono p-4 m-0 text-foreground whitespace-pre-wrap break-words" {...props}>
                          {children}
                        </pre>
                      </CardBase>
                    )
                  }

                  return (
                    <CardBase className="p-0 my-4 overflow-hidden">
                      <pre className="text-sm font-mono p-4 m-0 text-foreground whitespace-pre-wrap break-words" {...props}>
                        {children}
                      </pre>
                    </CardBase>
                  )
                },
                code: ({ className, children, ...props }: { className?: string; children?: React.ReactNode }) => {
                  if (className?.startsWith("language-")) {
                    return (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    )
                  }
                  return (
                    <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                      {children}
                    </code>
                  )
                },
                blockquote: ({ children }) => (
                  <CardBase className="p-4 my-4 border-l-4 border-primary/30">
                    <blockquote className="text-foreground italic">{children}</blockquote>
                  </CardBase>
                ),
                img: ({ src, alt, ...props }) => (
                  <CardBase className="p-0 overflow-hidden my-4">
                    <img src={src} alt={alt || ""} className="w-full h-auto" {...props} />
                  </CardBase>
                ),
                video: ({ src, poster, controls, ...props }) => (
                  <CardBase className="p-0 overflow-hidden my-4">
                    <video
                      src={src}
                      poster={poster}
                      controls={controls !== false}
                      className="w-full h-auto"
                      {...props}
                    />
                  </CardBase>
                ),
                audio: ({ src, controls, ...props }) => (
                  <CardBase className="p-4 my-4">
                    <audio src={src} controls={controls !== false} className="w-full" {...props} />
                  </CardBase>
                ),
                a: ({ href, children, ...props }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                    {...props}
                  >
                    {children}
                  </a>
                ),
                // 表格支持：容器宽度固定（100%），内容可横向滚动
                table: ({ children }) => (
                  <div className="my-4 w-full" style={{ maxWidth: "100%", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
                    <CardBase className="p-0 w-full">
                      <div className="overflow-x-auto scrollbar-hide" style={{ WebkitOverflowScrolling: "touch" }}>
                        <table className="border-collapse text-sm w-full" style={{ minWidth: "600px" }}>{children}</table>
                      </div>
                    </CardBase>
                  </div>
                ),
                // SVG 支持 - 参考 AI 报告详情页的实现
                svg: (props: any) => React.createElement("svg", props),
                g: (props: any) => React.createElement("g", props),
                path: (props: any) => React.createElement("path", props),
                circle: (props: any) => React.createElement("circle", props),
                rect: (props: any) => React.createElement("rect", props),
                line: (props: any) => React.createElement("line", props),
                polyline: (props: any) => React.createElement("polyline", props),
                polygon: (props: any) => React.createElement("polygon", props),
                ellipse: (props: any) => React.createElement("ellipse", props),
                text: (props: any) => React.createElement("text", props),
                tspan: (props: any) => React.createElement("tspan", props),
                defs: (props: any) => React.createElement("defs", props),
                marker: (props: any) => React.createElement("marker", props),
                linearGradient: (props: any) => React.createElement("linearGradient", props),
                radialGradient: (props: any) => React.createElement("radialGradient", props),
                stop: (props: any) => React.createElement("stop", props),
                pattern: (props: any) => React.createElement("pattern", props),
                clipPath: (props: any) => React.createElement("clipPath", props),
                mask: (props: any) => React.createElement("mask", props),
                // SVG 动画支持
                animate: (props: any) => React.createElement("animate", props),
                animateTransform: (props: any) => React.createElement("animateTransform", props),
                animateMotion: (props: any) => React.createElement("animateMotion", props),
                set: (props: any) => React.createElement("set", props),
                // style 标签支持（用于 CSS 动画）
                style: (props: any) => React.createElement("style", props),
              }}
            >
              {part.content}
            </ReactMarkdown>
          </div>
        )

      case "image":
        return (
          <CardBase key={`image-${index}`} className="p-0 overflow-hidden my-4">
            <img src={part.src} alt={part.alt || ""} className="w-full h-auto" />
            {part.caption && (
              <div className="px-4 py-2 text-sm text-muted-foreground text-center border-t border-border/30">
                {part.caption}
              </div>
            )}
          </CardBase>
        )

      case "video":
        return (
          <CardBase key={`video-${index}`} className="p-0 overflow-hidden my-4">
            <video
              src={part.src}
              poster={part.poster}
              controls
              className="w-full h-auto"
            />
            {part.caption && (
              <div className="px-4 py-2 text-sm text-muted-foreground text-center border-t border-border/30">
                {part.caption}
              </div>
            )}
          </CardBase>
        )

      case "table":
        // 渲染表格数据 - 容器宽度固定（100%），内容可横向滚动
        const headers = part.headers || (part.data.length > 0 ? Object.keys(part.data[0]) : [])
        return (
          <div key={`table-${index}`} className="my-4 w-full" style={{ maxWidth: "100%", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <CardBase className="p-0 w-full">
              <div className="overflow-x-auto scrollbar-hide" style={{ WebkitOverflowScrolling: "touch" }}>
                <table className="border-collapse text-sm w-full" style={{ minWidth: "600px" }}>
                  <thead>
                    <tr className="border-b border-border/30">
                      {headers.map((header, i) => (
                        <th key={i} className="px-4 py-3 text-left font-semibold text-foreground whitespace-nowrap">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {part.data.map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-b border-border/10 hover:bg-muted/30">
                        {headers.map((header, colIndex) => (
                          <td key={colIndex} className="px-4 py-3 text-foreground whitespace-nowrap">
                            {String(row[header] ?? "")}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBase>
          </div>
        )

      case "html":
        // 渲染 HTML+CSS 卡片 - 支持 SVG 动画和 CSS 动画
        // 注意：CSS 中的 @keyframes 和动画属性都会被保留
        const sanitizedHTML = sanitizeHTML(part.html)
        const css = part.css ? sanitizeHTML(part.css) : ""
        return (
          <div 
            key={`html-${index}`} 
            className="my-4 w-full"
            style={{ 
              position: "relative", 
              zIndex: 0,
              contain: "layout style paint", // 限制定位作用域
              overflow: "hidden" // 防止内容溢出
            }}
          >
            {css && <style dangerouslySetInnerHTML={{ __html: css }} />}
            <div
              className="w-full"
              style={{ 
                position: "relative",
                isolation: "isolate", // 隔离样式作用域
                contain: "layout style paint" // 限制定位作用域
              }}
              dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
            />
          </div>
        )

      case "card":
        // 渲染自定义卡片
        return (
          <div key={`card-${index}`} className="my-4">
            <CardFactory data={part.cardData} />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start", className)}>
      <div className={cn("flex flex-col gap-1", isUser ? "items-end max-w-[85%]" : "items-start w-full")}>
        {/* 按照 parts 顺序渲染 */}
        {messageParts.map((part, index) => renderPart(part, index))}

        {message.timestamp && isUser && (
          <span className="text-[10px] text-muted-foreground px-2" style={{ fontSize: `${10 * textScale}px` }}>
            {message.timestamp}
          </span>
        )}
      </div>
    </div>
  )
}

export const EnhancedMessageBubble = memo(EnhancedMessageBubbleComponent, (prevProps, nextProps) => {
  return (
    prevProps.message.id === nextProps.message.id &&
    prevProps.message.parts === nextProps.message.parts &&
    prevProps.message.timestamp === nextProps.message.timestamp &&
    prevProps.message.reasoning === nextProps.message.reasoning &&
    prevProps.message.isStreaming === nextProps.message.isStreaming &&
    prevProps.className === nextProps.className
  )
})

