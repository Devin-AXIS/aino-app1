"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, FileText, BarChart3, TrendingUp, Target, PieChart, LineChart } from "lucide-react"
import { GlassPanel } from "../ds/glass-panel"
import { DesignTokens } from "@/lib/future-lens/design-tokens"
import { useAppConfig } from "@/lib/future-lens/config-context"
import { translations } from "@/lib/future-lens/i18n"
import { TaskTemplateCard } from "./task-template-card"
import { cn } from "@/lib/utils"
import { createPortal } from "react-dom"
import { useEffect } from "react"
import { Z_INDEX } from "@/lib/future-lens/constants"

export interface TaskTemplate {
  id: string
  name: string
  purpose: string // 干嘛的（一句话说明任务在监控什么）
  benefit: string // 能帮你带来什么（站在用户收益的角度）
  icon: typeof FileText
  category: "chart" | "analysis" | "report" | "dashboard"
}

const taskTemplates: TaskTemplate[] = [
  {
    id: "chart-1",
    name: "图表 名称",
    description: "模板介绍",
    icon: BarChart3,
    category: "chart",
  },
  {
    id: "chart-2",
    name: "图表 名称",
    description: "模板介绍",
    icon: PieChart,
    category: "chart",
  },
  {
    id: "analysis-1",
    name: "图表 名称",
    description: "模板介绍",
    icon: TrendingUp,
    category: "analysis",
  },
  {
    id: "report-1",
    name: "图表 名称",
    description: "模板介绍",
    icon: FileText,
    category: "report",
  },
  {
    id: "dashboard-1",
    name: "图表 名称",
    description: "模板介绍",
    icon: Target,
    category: "dashboard",
  },
  {
    id: "chart-3",
    name: "图表 名称",
    description: "模板介绍",
    icon: LineChart,
    category: "chart",
  },
]

interface TaskTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectTemplate: (template: TaskTemplate) => void
}

export function TaskTemplateModal({ isOpen, onClose, onSelectTemplate }: TaskTemplateModalProps) {
  const { language } = useAppConfig()
  const t = translations[language] || translations["zh"]
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!mounted) return null

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - 不透明，看不见背景内容 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100]"
            style={{
              background: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 top-20 bottom-20 z-[101] pointer-events-none"
            style={{ zIndex: Z_INDEX.MODAL }}
          >
            <GlassPanel
              intensity="high"
              className="h-full pointer-events-auto rounded-3xl overflow-hidden"
              style={{
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(40px) saturate(200%)",
                WebkitBackdropFilter: "blur(40px) saturate(200%)",
                boxShadow: `
                  0 20px 60px -12px rgba(0, 0, 0, 0.15),
                  0 8px 24px -8px rgba(0, 0, 0, 0.1),
                  inset 0 1px 0 rgba(255, 255, 255, 0.6)
                `,
              }}
            >
              {/* Header */}
              <div className="flex items-center px-4 py-4 border-b border-border/50">
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors active:scale-95"
                >
                  <X size={18} strokeWidth={2} />
                </button>
              </div>

              {/* Scrollable Template List - 与内容对齐 */}
              <div className="flex-1 overflow-y-auto px-4 py-4" style={{ WebkitOverflowScrolling: "touch" }}>
                <div className="space-y-3">
                  {taskTemplates.map((template, index) => (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <TaskTemplateCard
                        template={template}
                        onClick={() => {
                          onSelectTemplate(template)
                          onClose()
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </GlassPanel>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )

  return createPortal(modalContent, document.body)
}
