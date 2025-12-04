"use client"

import type { LucideIcon } from "lucide-react"
import { motion } from "framer-motion"
import { GlassPanel } from "../ds/glass-panel"
import { AIOrb } from "../ui/ai-orb"
import { DoubleStarIcon } from "../ui/double-star-icon"
import { cn } from "@/lib/utils"

export interface FloatingDockProps {
  items: { id: string; icon: LucideIcon; label?: string }[]
  activeId: string
  onTabChange: (id: string) => void
  onChatClick: () => void
  className?: string
}

export function FloatingDock({ items, activeId, onTabChange, onChatClick, className }: FloatingDockProps) {
  return (
    <div
      className={cn(
        "absolute bottom-0 left-0 right-0 flex justify-center items-center gap-4 px-6 z-50 pointer-events-none pb-[max(1rem,env(safe-area-inset-bottom))]",
        className,
      )}
    >
      <GlassPanel
        intensity="high"
        className="pointer-events-auto relative h-[60px] rounded-[30px] px-8 flex items-center shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] flex-1 max-w-[280px] justify-between"
      >
        {items.map((item) => {
          const isActive = activeId === item.id
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className="relative w-14 h-full flex flex-col items-center justify-center outline-none group"
            >
              <div
                className={cn(
                  "relative z-10 transition-all duration-300",
                  isActive ? "scale-105" : "group-hover:scale-105 opacity-50 hover:opacity-80",
                )}
              >
                <item.icon
                  size={22}
                  strokeWidth={2}
                  className={cn(
                    "transition-colors duration-300",
                    isActive ? "text-foreground" : "text-muted-foreground",
                  )}
                />
              </div>
              {isActive && (
                <motion.div
                  layoutId="nav-spot"
                  className="absolute bottom-2.5 w-1 h-1 bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                />
              )}
            </button>
          )
        })}
      </GlassPanel>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onChatClick}
        className="pointer-events-auto flex-shrink-0 group relative"
      >
        <div
          className="w-[60px] h-[60px] rounded-[30px] flex items-center justify-center relative overflow-hidden"
          style={{
            // 浅色背景，带微妙的暖色调
            background: "rgba(252, 250, 248, 0.95)",
            backdropFilter: "blur(30px) saturate(200%)",
            WebkitBackdropFilter: "blur(30px) saturate(200%)",
            // Neumorphic 风格阴影：内阴影 + 外阴影
            boxShadow: `
              inset 2px 2px 4px rgba(255, 255, 255, 0.8),
              inset -2px -2px 4px rgba(0, 0, 0, 0.05),
              0 4px 12px rgba(0, 0, 0, 0.06),
              0 2px 6px rgba(0, 0, 0, 0.03)
            `,
            border: "none",
          }}
        >
          {/* 顶部和左侧高光反射 */}
          <div
            className="absolute inset-0 rounded-[30px] pointer-events-none"
            style={{
              background: `
                linear-gradient(135deg, 
                  rgba(255, 255, 255, 0.7) 0%, 
                  rgba(255, 255, 255, 0.4) 25%, 
                  rgba(255, 255, 255, 0.2) 40%,
                  transparent 60%
                )
              `,
            }}
          />
          
          {/* 中心彩色光晕 - 蓝色到粉橙色（去掉紫色） */}
          <div
            className="absolute inset-0 rounded-[30px] pointer-events-none"
            style={{
              background: `
                radial-gradient(
                  circle at center,
                  rgba(59, 130, 246, 0.15) 0%,
                  rgba(96, 165, 250, 0.12) 30%,
                  rgba(255, 154, 158, 0.08) 50%,
                  transparent 75%
                )
              `,
              filter: "blur(8px)",
            }}
          />
          
          {/* 反射光晕层 */}
          <div
            className="absolute inset-0 rounded-[30px] pointer-events-none"
            style={{
              background: `
                radial-gradient(
                  circle at 30% 30%,
                  rgba(255, 255, 255, 0.4) 0%,
                  transparent 50%
                )
              `,
            }}
          />
          
          {/* SVG 渐变定义 - 蓝色到粉橙色渐变（去掉紫色） */}
          <svg width="0" height="0" style={{ position: "absolute" }}>
            <defs>
              <linearGradient id="double-star-gradient-dock" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(59, 130, 246, 1)" />
                <stop offset="50%" stopColor="rgba(96, 165, 250, 1)" />
                <stop offset="100%" stopColor="rgba(255, 154, 158, 1)" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* AI 图标 - 双星图标，蓝色到粉橙色渐变，带光晕和反射 */}
          <div 
            className="relative z-10"
            style={{
              filter: "drop-shadow(0 0 8px rgba(59, 130, 246, 0.6)) drop-shadow(0 0 4px rgba(255, 154, 158, 0.4)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))",
            }}
          >
            <DoubleStarIcon 
              size={32}
              style={{
                fill: "url(#double-star-gradient-dock)",
              }}
            />
          </div>
        </div>
      </motion.button>
    </div>
  )
}
