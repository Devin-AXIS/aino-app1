"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GripVertical, ChevronUp, ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { DesignTokens } from "@/lib/future-lens/design-tokens"
import { useAppConfig } from "@/lib/future-lens/config-context"
import { ModalDialog } from "../ds/modal-dialog"
import type { Agent } from "@/lib/future-lens/types/agent-types"
import { DEFAULT_AGENTS, loadCustomAgents, saveCustomAgents, saveAgentsOrder, saveFollowedAgents as saveFollowedAgentsUtil } from "@/lib/future-lens/data/default-agents"
import React from "react"
import { Sparkles } from "lucide-react"

interface ManageAgentsDialogProps {
  isOpen: boolean
  onClose: () => void
  agents: Agent[]
  onAgentsChange: (agents: Agent[]) => void
  onAddAgent: () => void
  showAddForm?: boolean
}

/**
 * 管理智能体 Dialog 组件
 * 参考"市场排序设置"弹窗，轻量交互，支持排序和关注
 */
export function ManageAgentsDialog({
  isOpen,
  onClose,
  agents,
  onAgentsChange,
  onAddAgent,
  showAddForm = false,
}: ManageAgentsDialogProps) {
  const { textScale } = useAppConfig()
  const fSize = (base: number) => base * textScale
  
  // 关注状态（从 localStorage 加载）
  const [followedAgents, setFollowedAgents] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set()
    try {
      const saved = localStorage.getItem('followed-agents')
      if (saved) {
        const ids = JSON.parse(saved)
        return new Set(ids)
      }
    } catch (e) {
      console.error('加载关注状态失败:', e)
    }
    // 默认关注所有系统智能体
    return new Set(DEFAULT_AGENTS.map(a => a.id))
  })

  // 排序后的智能体列表（关注的在前面）
  const [sortedAgents, setSortedAgents] = useState<Agent[]>([])
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  

  // 初始化排序列表
  useEffect(() => {
    if (isOpen) {
      // 加载排序顺序（从 localStorage）
      let order: string[] = []
      try {
        const saved = localStorage.getItem('agents-order')
        if (saved) {
          order = JSON.parse(saved)
        }
      } catch (e) {
        console.error('加载排序顺序失败:', e)
      }

      // 合并系统智能体和自定义智能体
      const allAgents = [...DEFAULT_AGENTS, ...loadCustomAgents()]
      
      // 如果有保存的顺序，按顺序排列
      if (order.length > 0) {
        const orderedAgents: Agent[] = []
        const agentMap = new Map(allAgents.map(a => [a.id, a]))
        
        // 先按保存的顺序添加
        order.forEach(id => {
          const agent = agentMap.get(id)
          if (agent) {
            orderedAgents.push(agent)
            agentMap.delete(id)
          }
        })
        
        // 添加剩余的新智能体
        agentMap.forEach(agent => orderedAgents.push(agent))
        
        setSortedAgents(orderedAgents)
      } else {
        setSortedAgents(allAgents)
      }
      
      // 如果是从"添加智能体"按钮打开的，自动显示添加表单
      // 通过检查 onAddAgent 是否被调用来判断
      // 这里我们通过 props 传递一个标志，或者直接在这里处理
    }
  }, [isOpen, agents])
  

  // 保存排序顺序
  const saveOrder = (newOrder: Agent[]) => {
    try {
      const order = newOrder.map(a => a.id)
      saveAgentsOrder(order)
      // 通知父组件更新智能体列表
      onAgentsChange(newOrder)
    } catch (e) {
      console.error('保存排序顺序失败:', e)
    }
  }

  // 保存关注状态
  const saveFollowedAgents = (followed: Set<string>) => {
    try {
      saveFollowedAgentsUtil(followed)
      // 通知父组件更新（触发重新加载）
      const allAgents = [...DEFAULT_AGENTS, ...loadCustomAgents()]
      onAgentsChange(allAgents)
    } catch (e) {
      console.error('保存关注状态失败:', e)
    }
  }

  // 切换关注状态
  const toggleFollow = (agentId: string) => {
    const newFollowed = new Set(followedAgents)
    if (newFollowed.has(agentId)) {
      newFollowed.delete(agentId)
    } else {
      newFollowed.add(agentId)
    }
    setFollowedAgents(newFollowed)
    saveFollowedAgents(newFollowed)
  }

  // 上移
  const moveUp = (index: number) => {
    if (index === 0) return
    const newAgents = [...sortedAgents]
    const [moved] = newAgents.splice(index, 1)
    newAgents.splice(index - 1, 0, moved)
    setSortedAgents(newAgents)
    saveOrder(newAgents)
  }

  // 下移
  const moveDown = (index: number) => {
    if (index === sortedAgents.length - 1) return
    const newAgents = [...sortedAgents]
    const [moved] = newAgents.splice(index, 1)
    newAgents.splice(index + 1, 0, moved)
    setSortedAgents(newAgents)
    saveOrder(newAgents)
  }

  // 拖动处理
  const handleDragStart = (index: number) => {
    setDragIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (dragIndex === null || dragIndex === index) return
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (dragIndex === null || dragIndex === dropIndex) return

    const newAgents = [...sortedAgents]
    const [moved] = newAgents.splice(dragIndex, 1)
    newAgents.splice(dropIndex, 0, moved)
    
    setSortedAgents(newAgents)
    saveOrder(newAgents)
    setDragIndex(null)
    setDragOverIndex(null)
  }

  const handleDragEnd = () => {
    setDragIndex(null)
    setDragOverIndex(null)
  }


  // 恢复默认
  const handleReset = () => {
    const defaultAgents = [...DEFAULT_AGENTS, ...loadCustomAgents()]
    setSortedAgents(defaultAgents)
    saveOrder(defaultAgents)
    const defaultFollowed = new Set(DEFAULT_AGENTS.map(a => a.id))
    setFollowedAgents(defaultFollowed)
    saveFollowedAgents(defaultFollowed)
  }


  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onClose}
      variant="action-sheet"
      title="管理智能体"
    >
      <div className="flex flex-col h-full">
        {/* 顶部操作栏 */}
        <div className="flex items-center justify-between px-1 pb-2 border-b border-border/50">
          <h3
            className={cn(DesignTokens.typography.body, "text-foreground font-semibold")}
            style={{ fontSize: `${fSize(16)}px` }}
          >
            管理智能体
          </h3>
          <button
            onClick={handleReset}
            className={cn(
              DesignTokens.typography.caption,
              "text-muted-foreground hover:text-foreground transition-colors"
            )}
            style={{ fontSize: `${fSize(12)}px` }}
          >
            恢复默认
          </button>
        </div>

        {/* 智能体列表 */}
        <div className="flex-1 overflow-y-auto py-1 space-y-1">
          <AnimatePresence>
            {sortedAgents.map((agent, index) => {
              const isFollowed = followedAgents.has(agent.id)
              // 处理图标：可能是组件、字符串或 ReactNode
              let IconElement: React.ReactNode = null
              if (agent.icon) {
                if (typeof agent.icon === 'string') {
                  // 字符串类型：使用默认图标，后续可以扩展支持 iconMap
                  IconElement = <Sparkles size={18} className="text-foreground/70" />
                } else if (React.isValidElement(agent.icon)) {
                  IconElement = agent.icon
                } else if (typeof agent.icon === 'function') {
                  const IconComponent = agent.icon as React.ComponentType<{ size?: number; className?: string }>
                  IconElement = <IconComponent size={18} className="text-foreground/70" />
                } else {
                  IconElement = <Sparkles size={18} className="text-foreground/70" />
                }
              } else {
                IconElement = <Sparkles size={18} className="text-foreground/70" />
              }
              const isDragging = dragIndex === index
              const isDragOver = dragOverIndex === index

              return (
                <motion.div
                  key={agent.id}
                  layout
                  initial={false}
                  animate={{
                    opacity: isDragging ? 0.5 : 1,
                    scale: isDragging ? 0.95 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2.5 rounded-lg",
                    "bg-card/60 backdrop-blur-sm border border-border/30",
                    "transition-all duration-200",
                    isDragOver && "border-primary/50 bg-primary/5",
                    isDragging && "cursor-grabbing",
                    !isDragging && "cursor-grab hover:bg-card/80"
                  )}
                >
                  {/* 拖动图标 */}
                  <div className="flex-shrink-0 text-muted-foreground/50">
                    <GripVertical size={18} />
                  </div>

                  {/* 关注开关 */}
                  <button
                    onClick={() => toggleFollow(agent.id)}
                    className={cn(
                      "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center",
                      "transition-all duration-200",
                      isFollowed
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted border border-border text-muted-foreground hover:bg-muted/80"
                    )}
                  >
                    {isFollowed && <Check size={14} />}
                  </button>

                  {/* 智能体信息 */}
                  <div className="flex-1 flex items-center gap-3 min-w-0">
                    {IconElement && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted/40 flex items-center justify-center">
                        {IconElement}
                      </div>
                    )}
                    <span
                      className={cn(
                        DesignTokens.typography.body,
                        "text-foreground truncate",
                        !isFollowed && "opacity-60"
                      )}
                      style={{ fontSize: `${fSize(14)}px` }}
                    >
                      {agent.name}
                    </span>
                    {agent.type === 'custom' && (
                      <span
                        className={cn(
                          DesignTokens.typography.caption,
                          "text-muted-foreground/60 px-2 py-0.5 rounded bg-muted/40"
                        )}
                        style={{ fontSize: `${fSize(10)}px` }}
                      >
                        自定义
                      </span>
                    )}
                  </div>

                  {/* 排序按钮 */}
                  <div className="flex-shrink-0 flex flex-col gap-0.5">
                    <button
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                      className={cn(
                        "w-6 h-6 flex items-center justify-center rounded",
                        "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                        "transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                      )}
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      onClick={() => moveDown(index)}
                      disabled={index === sortedAgents.length - 1}
                      className={cn(
                        "w-6 h-6 flex items-center justify-center rounded",
                        "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                        "transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                      )}
                    >
                      <ChevronDown size={14} />
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* 底部操作按钮 */}
        <div className="pt-3 border-t border-border/50">
          <button
            onClick={onClose}
            className={cn(
              "w-full px-4 py-3 rounded-lg",
              DesignTokens.typography.button,
              "bg-primary text-primary-foreground",
              "hover:bg-primary/90 transition-all duration-200",
              "shadow-md"
            )}
            style={{ fontSize: `${fSize(15)}px` }}
          >
            完成
          </button>
        </div>
      </div>
    </ModalDialog>
  )
}

