"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { GlassPanel } from "./glass-panel"
import { useConfig } from "@/lib/future-lens/config-context"
import { translations } from "@/lib/future-lens/i18n"
import { Z_INDEX, type ZIndexLevel } from "@/lib/future-lens/constants"
import { DesignTokens } from "@/lib/future-lens/design-tokens"

/**
 * 模态对话框组件，支持多种变体（默认、操作表、浮动卡片、聊天）
 * @example
 * ```tsx
 * <ModalDialog isOpen={open} onClose={() => setOpen(false)} title="标题">
 *   内容
 * </ModalDialog>
 * ```
 */
interface ModalDialogProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  icon?: React.ReactNode
  children: React.ReactNode
  variant?: "default" | "action-sheet" | "floating-card" | "chat"
  level?: ZIndexLevel
  zIndex?: number
}

export const ModalDialog = ({
  isOpen,
  onClose,
  title,
  icon,
  children,
  variant = "default",
  level = "MODAL", // Default to standard modal level
  zIndex,
}: ModalDialogProps) => {
  const { language } = useConfig()
  const t = translations[language] || translations["zh"]
  const [mounted, setMounted] = useState(false)

  const finalZIndex = zIndex ?? Z_INDEX[level]

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  const content = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with modern blur effect - fixed positioning */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-xl"
            style={{ 
              zIndex: finalZIndex,
              // 确保 backdrop 在最上层，不受父容器 backdropFilter 影响
              isolation: "isolate",
            }}
          />

          {/* Drawer Container - Aligned to bottom */}
          <div
            className="fixed inset-x-0 bottom-0 flex flex-col justify-end pointer-events-none h-full"
            style={{ 
              zIndex: finalZIndex + 10,
              // 确保 drawer 在最上层，不受父容器影响
              isolation: "isolate",
            }}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full pointer-events-auto"
            >
              {variant === "chat" ? (
                <div className="h-[92vh] w-full relative overflow-hidden flex flex-col">
                  {/* Background Layer with radial gradient glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-background" />
                  <div
                    className="absolute inset-0 opacity-40"
                    style={{
                      background: `
                        radial-gradient(circle at 30% 20%, rgba(139, 92, 246, 0.08) 0%, transparent 50%),
                        radial-gradient(circle at 70% 80%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
                        radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.04) 0%, transparent 70%)
                      `,
                    }}
                  />

                  {/* Frosted glass overlay */}
                  <div className="absolute inset-0 backdrop-blur-[80px] bg-card/60" />

                  {/* Content with soft shadow */}
                  <div className="relative z-10 h-full w-full flex flex-col rounded-t-[2rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.08)]">
                    {children}
                  </div>
                </div>
              ) : variant === "floating-card" ? (
                <div className="px-4 pb-6">
                  <GlassPanel
                    intensity="high"
                    className="rounded-3xl overflow-hidden shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.15)] bg-card/90"
                  >
                    {/* Handle Bar */}
                    <div className="flex justify-center pt-3 pb-2">
                      <div className="w-10 h-1 rounded-full bg-muted-foreground/20" />
                    </div>

                    {/* Content Area - Auto height based on content */}
                    <div className="px-6 pb-6 safe-area-bottom">
                      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
                        {children}
                      </div>
                    </div>
                  </GlassPanel>
                </div>
              ) : variant === "action-sheet" ? (
                <div className="px-4 pb-6">
                  <GlassPanel
                    intensity="high"
                    className="rounded-[2rem] overflow-hidden shadow-[0_8px_32px_-8px_rgba(0,0,0,0.12)] border-b bg-card/80 relative"
                  >
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      {/* Primary blue glow - top left */}
                      <div className="absolute top-[-10%] left-[10%] w-[70%] h-[70%] rounded-full bg-[radial-gradient(circle_at_center,rgba(180,210,235,0.5)_0%,rgba(200,220,240,0.25)_40%,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(30,58,88,0.3)_0%,rgba(45,55,75,0.15)_40%,transparent_70%)] blur-[80px]" />

                      {/* Secondary purple glow - bottom right */}
                      <div className="absolute bottom-[-15%] right-[5%] w-[65%] h-[65%] rounded-full bg-[radial-gradient(circle_at_center,rgba(200,220,240,0.5)_0%,rgba(210,225,240,0.25)_50%,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(45,55,75,0.35)_0%,rgba(38,50,70,0.18)_50%,transparent_70%)] blur-[70px]" />
                    </div>

                    {/* Handle Bar */}
                    <div className="flex justify-center pt-3 pb-2 relative z-10">
                      <div className="w-10 h-1 rounded-full bg-muted-foreground/20" />
                    </div>

                    {/* Content Area - Direct children, no inner card */}
                    <div className="px-6 pb-6 safe-area-bottom relative z-10">{children}</div>
                  </GlassPanel>
                </div>
              ) : (
                <GlassPanel
                  intensity="high"
                  className="rounded-t-[2rem] rounded-b-none overflow-hidden shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] border-b-0 bg-card/80 relative"
                >
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {/* Primary blue glow - top center */}
                    <div className="absolute top-[-5%] left-1/2 -translate-x-1/2 w-[75%] h-[75%] rounded-full bg-[radial-gradient(circle_at_center,rgba(180,210,235,0.5)_0%,rgba(200,220,240,0.25)_40%,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(30,58,88,0.3)_0%,rgba(45,55,75,0.15)_40%,transparent_70%)] blur-[80px]" />

                    {/* Secondary accent glow - bottom left */}
                    <div className="absolute bottom-[-10%] left-[20%] w-[65%] h-[65%] rounded-full bg-[radial-gradient(circle_at_center,rgba(210,225,240,0.45)_0%,rgba(200,220,240,0.2)_50%,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(38,50,70,0.28)_0%,rgba(45,55,75,0.15)_50%,transparent_70%)] blur-[70px]" />
                  </div>

                  {/* Header */}
                  <div className="relative z-10 px-6 pt-6 pb-2 flex items-start justify-between">
                    {/* Close Button (Left) */}
                    <button
                      onClick={onClose}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium pt-1"
                    >
                      {t.close}
                    </button>

                    {/* Center Icon + Title */}
                    <div className="flex flex-row items-center gap-2 absolute left-1/2 -translate-x-1/2 top-6">
                      {icon && <div className="text-foreground scale-90">{icon}</div>}
                      {title && (
                        <h3 className={`${DesignTokens.typography.title} text-base font-semibold text-foreground`}>
                          {title}
                        </h3>
                      )}
                    </div>

                    {/* Right Spacer for balance */}
                    <div className="w-8" />
                  </div>

                  {/* Content Area - Auto height based on content */}
                  <div className="p-6 pt-4 pb-10 safe-area-bottom relative z-10">
                    <div className="bg-card rounded-2xl shadow-sm border border-border p-6 min-h-[120px] text-muted-foreground text-sm leading-relaxed">
                      {children}
                    </div>
                  </div>
                </GlassPanel>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )

  if (!mounted) return null

  const portalContainer = document.getElementById("app-portal-container")
  if (portalContainer) {
    return createPortal(content, portalContainer)
  }

  return content
}
