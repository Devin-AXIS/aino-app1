"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { DesignTokens } from "@/lib/future-lens/design-tokens"
import { useAppConfig } from "@/lib/future-lens/config-context"
import { ModalDialog } from "../ds/modal-dialog"
import { GlassPanel } from "../ds/glass-panel"
import type { Agent } from "@/lib/future-lens/types/agent-types"

interface AddAgentDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (agent: Omit<Agent, 'id'>) => void
}

const AGENT_CATEGORIES = [
  { value: 'industry', label: '产业分析' },
  { value: 'enterprise', label: '企业分析' },
  { value: 'project', label: '项目分析' },
  { value: 'stock', label: '股票分析' },
]

/**
 * 添加智能体 Dialog 组件
 * 居中 Modal，毛玻璃效果
 */
export function AddAgentDialog({
  isOpen,
  onClose,
  onConfirm,
}: AddAgentDialogProps) {
  const { textScale } = useAppConfig()
  const fSize = (base: number) => base * textScale
  const [name, setName] = useState('')
  const [category, setCategory] = useState('industry')

  const handleConfirm = () => {
    if (!name.trim()) return
    
    onConfirm({
      name: name.trim(),
      type: 'custom',
      category,
      config: {
        defaultView: 'all'
      }
    })
    
    // 重置表单
    setName('')
    setCategory('industry')
    onClose()
  }

  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onClose}
      variant="default"
      title="添加智能体"
      icon={<Sparkles size={20} />}
    >
      <div className="space-y-6">
        {/* 智能体名称输入 */}
        <div className="space-y-2">
          <label
            className={cn(DesignTokens.typography.caption, "text-foreground font-medium")}
            style={{ fontSize: `${fSize(13)}px` }}
          >
            智能体名称
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="请输入智能体名称"
            className={cn(
              "w-full px-4 py-3 rounded-lg",
              DesignTokens.typography.body,
              "bg-card/60 backdrop-blur-md border border-border/50",
              "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
              "transition-all duration-200",
              DesignTokens.mobile.input
            )}
            style={{ fontSize: `${fSize(14)}px` }}
          />
        </div>

        {/* 分类选择 */}
        <div className="space-y-2">
          <label
            className={cn(DesignTokens.typography.caption, "text-foreground font-medium")}
            style={{ fontSize: `${fSize(13)}px` }}
          >
            分类
          </label>
          <div className="grid grid-cols-2 gap-2">
            {AGENT_CATEGORIES.map((cat) => {
              const isSelected = category === cat.value
              return (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={cn(
                    "px-4 py-3 rounded-lg text-left transition-all duration-200",
                    DesignTokens.typography.caption,
                    "border",
                    isSelected
                      ? "bg-primary/20 border-primary text-primary font-medium"
                      : "bg-card/60 backdrop-blur-sm border-border/50 text-foreground hover:border-border"
                  )}
                  style={{ fontSize: `${fSize(13)}px` }}
                >
                  {cat.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className={cn(
              "flex-1 px-4 py-3 rounded-lg",
              DesignTokens.typography.button,
              "bg-card/60 backdrop-blur-md border border-border/50 text-foreground",
              "hover:bg-card/80 transition-all duration-200"
            )}
            style={{ fontSize: `${fSize(14)}px` }}
          >
            取消
          </button>
          <button
            onClick={handleConfirm}
            disabled={!name.trim()}
            className={cn(
              "flex-1 px-4 py-3 rounded-lg",
              DesignTokens.typography.button,
              "bg-primary text-primary-foreground",
              "hover:bg-primary/90 transition-all duration-200",
              "shadow-md",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            style={{ fontSize: `${fSize(14)}px` }}
          >
            确认
          </button>
        </div>
      </div>
    </ModalDialog>
  )
}

