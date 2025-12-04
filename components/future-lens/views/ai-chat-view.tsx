"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, MoreHorizontal, Trash2 } from "lucide-react"
import { AppBackground } from "../ds/app-background"
import { AIOrb } from "../ui/ai-orb"
import { EnhancedMessageBubble } from "../ai/enhanced-message-bubble"
import { LiquidOrb } from "../ai/liquid-orb"
import { LiquidText } from "../ai/liquid-text"
import { ChatInput } from "../ai/chat-input"
import { DesignTokens } from "@/lib/future-lens/design-tokens"
import { useAppConfig } from "@/lib/future-lens/config-context"
import { translations } from "@/lib/future-lens/i18n"
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom"
import { cn } from "@/lib/utils"
import type { ChatMessage } from "@/lib/future-lens/chat/message-types"
import { convertToNewFormat } from "@/lib/future-lens/chat/message-types"
import { ScrollHeaderContainer } from "@/components/future-lens/layout/scroll-header-container"
import { ScrollHeader } from "@/components/future-lens/layout/scroll-header"
import { BottomFadeOverlay } from "../nav/bottom-fade-overlay"

// 消息包装组件，处理异步转换
function MessageBubbleWrapper({ oldMessage }: { oldMessage: Message }) {
  const [chatMessage, setChatMessage] = useState<ChatMessage | null>(null)

  useEffect(() => {
    // 使用消息的关键字段作为依赖，确保流式更新时能正确响应
    convertToNewFormat(oldMessage).then(setChatMessage)
  }, [oldMessage.id, oldMessage.content, oldMessage.reasoning, oldMessage.isStreaming])

  if (!chatMessage) {
    // 加载中，显示简单文本（包括思维链）
    return (
      <div className="flex w-full">
        <div className="flex flex-col gap-1 w-full">
          {oldMessage.reasoning && oldMessage.reasoning.trim().length > 0 && (
            <div className="mb-3">
              <div className="px-3 py-2 rounded-lg bg-muted/50 border border-border">
                <p className="text-xs text-muted-foreground mb-1 font-medium">思考过程</p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{oldMessage.reasoning}</p>
              </div>
            </div>
          )}
          {oldMessage.content && oldMessage.content.trim().length > 0 && (
            <div className="px-3 py-2 rounded-[1.25rem] bg-muted text-muted-foreground">
              <p className="text-sm whitespace-pre-wrap">{oldMessage.content}</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return <EnhancedMessageBubble message={chatMessage} />
}

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: string
  reasoning?: string // 思维链内容
  isStreaming?: boolean // 是否正在流式输出
}

interface AIChatViewProps {
  onBack: () => void
  messages: Message[]
  onSendMessage: (text: string) => void
  onVoiceInput?: () => void
  isThinking?: boolean
  onClearHistory?: () => void
}

export function AIChatView({
  onBack,
  messages,
  onSendMessage,
  onVoiceInput,
  isThinking = false,
  onClearHistory,
}: AIChatViewProps) {
  const { language } = useAppConfig()
  const t = translations[language] || translations["zh"]
  const [showMenu, setShowMenu] = useState(false)

  // Use scroll-to-bottom hook for smooth auto-scrolling
  const { containerRef, endRef } = useScrollToBottom()

  return (
    <div
      className="relative w-full bg-background flex flex-col overflow-hidden overscroll-behavior-contain touch-pan-y"
      style={{
        height: "100dvh",
      }}
    >
      {/* Dynamic Background */}
      <AppBackground />

      <>
        {/* Scroll Header - 参考 AI 报告详情页的顶部样式 */}
        <ScrollHeaderContainer scrollContainerId="ai-chat-scroll-container">
          <ScrollHeader
            title="FutureLens AI"
            onBack={onBack}
            actions={
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-foreground hover:bg-secondary/80 active:scale-95 transition-all"
              >
                <MoreHorizontal size={20} strokeWidth={2} />
              </button>
            }
          />
        </ScrollHeaderContainer>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10, x: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10, x: 10 }}
              className="fixed top-16 right-4 w-48 bg-popover border border-border rounded-xl shadow-xl z-50 overflow-hidden"
            >
              <button
                onClick={() => {
                  onClearHistory?.()
                  setShowMenu(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-destructive hover:bg-muted transition-colors text-left"
              >
                <Trash2 size={16} />
                  <span>{"清除历史"}</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Content - Flex Grow with scroll isolation */}
        <div
          ref={containerRef}
          id="ai-chat-scroll-container"
          className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide relative z-10 touch-pan-y"
          style={{
            overscrollBehavior: "contain",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div className={cn(
            "min-h-full flex flex-col px-4 pt-4 pb-4",
            messages.length === 0 ? "justify-center" : "justify-end"
          )}>
            {/* Welcome State with Liquid Orb Effect */}
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center text-center p-8 w-full">
                {/* Liquid Orb Effect */}
                <LiquidOrb status="idle" className="mb-8" />
                
                {/* Welcome Text with Liquid Text Effect */}
                <LiquidText
                  text={language === "zh" ? "你好！我是 FutureLens AI 助手" : "Hello! I'm FutureLens AI Assistant"}
                  status="visible"
                  showText={true}
                  enableShimmer={true}
                  className="mb-2 min-h-[60px]"
                />
                <LiquidText
                  text={
                    language === "zh"
                      ? "有什么可以帮助你的吗？"
                      : "How can I help you today?"
                  }
                  status="visible"
                  showText={true}
                  enableShimmer={true}
                  className="min-h-[40px]"
                />
              </div>
            )}

            {/* Messages */}
            {messages.length > 0 && (
            <div className="space-y-6">
              {messages.map((msg) => {
                // 使用异步转换（需要处理 Promise）
                return <MessageBubbleWrapper key={msg.id} oldMessage={msg} />
              })}

              {isThinking && (
                <div className="flex items-center gap-3 text-muted-foreground text-xs pl-1 animate-in fade-in duration-300">
                  <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center">
                    <div className="animate-pulse opacity-60">
                      <AIOrb />
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="animate-pulse">Thinking</span>
                    <span className="inline-flex">
                      <span className="animate-bounce [animation-delay:0ms]">.</span>
                      <span className="animate-bounce [animation-delay:150ms]">.</span>
                      <span className="animate-bounce [animation-delay:300ms]">.</span>
                    </span>
                  </div>
                </div>
              )}

              {/* Invisible element to scroll to */}
              <div ref={endRef} className="min-h-[24px] min-w-[24px] shrink-0" />
            </div>
            )}
          </div>
        </div>

        {/* Input Area - Sticky bottom, 90%透明背景，悬浮效果 */}
        <div className="sticky bottom-0 z-30 w-full px-2 md:px-4 pt-2 pb-3 md:pb-4 flex-shrink-0 bg-background/10 backdrop-blur-xl"
          style={{
            paddingBottom: `calc(0.75rem + env(safe-area-inset-bottom, 0px))`,
          }}
        >
          <ChatInput
            placeholder={t.chat_placeholder}
            onSend={onSendMessage}
            onVoiceInput={onVoiceInput}
          />
        </div>

        {/* Bottom Fade Overlay - 下拉模糊效果 */}
        <BottomFadeOverlay />
      </>
    </div>
  )
}
