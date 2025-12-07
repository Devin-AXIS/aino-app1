"use client"

import React, { useRef, useState } from "react"
import { motion } from "framer-motion"
import { Plus, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { DesignTokens } from "@/lib/future-lens/design-tokens"
import { useAppConfig } from "@/lib/future-lens/config-context"
import type { Agent } from "@/lib/future-lens/types/agent-types"

interface AgentSelectorProps {
  agents: Agent[]
  activeAgentId: string
  onAgentChange: (agentId: string) => void
  onAddAgent: () => void
  onManageAgents?: () => void
}

/**
 * 智能体选择器组件
 * 横向滚动的圆形图标 + 文字标签
 */
export function AgentSelector({
  agents,
  activeAgentId,
  onAgentChange,
  onAddAgent,
  onManageAgents,
}: AgentSelectorProps) {
  const { textScale } = useAppConfig()
  const fSize = (base: number) => base * textScale
  const longPressTimer = useRef<NodeJS.Timeout | null>(null)
  const [isLongPressing, setIsLongPressing] = useState(false)

  const handleTouchStart = () => {
    if (!onManageAgents) return
    longPressTimer.current = setTimeout(() => {
      setIsLongPressing(true)
      onManageAgents()
    }, 500) // 500ms 长按
  }

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
    setIsLongPressing(false)
  }

  return (
    <div className="relative w-full">
      {/* 智能体选择器 - 紧凑设计，无背景框 */}
      <div className={cn(
        "relative overflow-x-auto scrollbar-hide",
        DesignTokens.mobile.safeTop,
        "pb-2"
      )}>
        <div className="flex gap-2.5 px-5 min-w-max">
          {agents.map((agent) => {
            const isActive = agent.id === activeAgentId
            // 处理图标：可能是组件、字符串或 ReactNode
            let IconElement: React.ReactNode = null
            
            if (agent.icon) {
              if (typeof agent.icon === 'string') {
                // 字符串类型：直接显示
                IconElement = <span className="text-lg">{agent.icon}</span>
              } else if (React.isValidElement(agent.icon)) {
                // 已经是 React 元素
                IconElement = agent.icon
              } else if (typeof agent.icon === 'function') {
                // React 组件函数
                try {
                  const IconComponent = agent.icon as React.ComponentType<{ size?: number }>
                  IconElement = <IconComponent size={20} />
                } catch (e) {
                  // 如果渲染失败，使用默认图标
                  console.warn('图标组件渲染失败:', e)
                  IconElement = <Sparkles size={20} />
                }
              } else {
                // 其他情况（可能是对象），使用默认图标
                console.warn('不支持的图标类型:', typeof agent.icon, agent.icon)
                IconElement = <Sparkles size={20} />
              }
            } else {
              // 默认图标
              IconElement = <Sparkles size={20} />
            }

            return (
              <motion.button
                key={agent.id}
                onClick={() => onAgentChange(agent.id)}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "flex flex-col items-center gap-1.5 min-w-[60px]",
                  "transition-all duration-300"
                )}
              >
                {/* 圆形图标容器 - 更紧凑 */}
                <div className={cn(
                  "relative w-11 h-11 rounded-full",
                  "flex items-center justify-center",
                  "transition-all duration-300",
                  "border",
                  isActive
                    ? "bg-primary/10 border-primary shadow-md shadow-primary/20"
                    : "bg-transparent border-border/30 hover:border-border/50"
                )}>
                  {/* 图标 - 更小 */}
                  <div className={cn(
                    "flex items-center justify-center",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}>
                    {IconElement}
                  </div>
                  
                  {/* 选中指示点 */}
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary"
                    />
                  )}
                </div>

                {/* 文字标签 */}
                <span
                  className={cn(
                    DesignTokens.typography.caption,
                    "text-center whitespace-nowrap",
                    "transition-colors duration-300",
                    isActive
                      ? "text-primary font-semibold"
                      : "text-muted-foreground"
                  )}
                  style={{ fontSize: `${fSize(10.5)}px` }}
                >
                  {agent.name}
                </span>
              </motion.button>
            )
          })}

          {/* 添加智能体按钮 - 更紧凑 */}
          <motion.button
            onClick={onAddAgent}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleTouchStart}
            onMouseUp={handleTouchEnd}
            onMouseLeave={handleTouchEnd}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "flex flex-col items-center gap-1.5 min-w-[60px]",
              "transition-all duration-300",
              isLongPressing && "opacity-70"
            )}
          >
            <div className={cn(
              "relative w-11 h-11 rounded-full",
              "flex items-center justify-center",
              "bg-transparent border border-dashed border-border/30",
              "hover:border-primary/50 hover:bg-primary/5",
              "transition-all duration-300"
            )}>
              <Plus
                size={20}
                className="text-muted-foreground"
              />
            </div>
            <span
              className={cn(
                DesignTokens.typography.caption,
                "text-center whitespace-nowrap text-muted-foreground"
              )}
              style={{ fontSize: `${fSize(10.5)}px` }}
            >
              添加智能体
            </span>
          </motion.button>
        </div>
      </div>
    </div>
  )
}

