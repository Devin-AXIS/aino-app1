"use client"
import { motion } from "framer-motion"

/**
 * AIOrb - AI 标识球体组件
 * 
 * 用于显示 AI 状态的可视化标识，带有动画效果
 * 
 * @example
 * ```tsx
 * <AIOrb />
 * ```
 */
export const AIOrb = () => {
  return (
    <div className="relative w-9 h-9 flex items-center justify-center">
      {/* Core - Deep Slate/Blue */}
      <motion.div
        className="absolute w-4 h-4 rounded-full bg-primary blur-[1px] shadow-[0_0_12px_rgba(15,23,42,0.5)]"
        animate={{ scale: [1, 1.1, 1], opacity: [0.9, 1, 0.9] }}
        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      {/* Ring - Subtle Engineering Feel */}
      <motion.div
        className="absolute w-7 h-7 rounded-full border border-muted-foreground/40 opacity-60"
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />
      {/* Ambient - Very Subtle Cool Blue */}
      <motion.div
        className="absolute w-full h-full rounded-full bg-blue-900/5 blur-md"
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
      />
    </div>
  )
}
