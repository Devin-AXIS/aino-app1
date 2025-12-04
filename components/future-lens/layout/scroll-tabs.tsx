"use client"

import type React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { DesignTokens } from "@/lib/future-lens/design-tokens"
import { useScrollContext } from "./scroll-header-container"

interface ScrollTabsProps {
  /** 标签列表 */
  tabs: string[]
  /** 当前激活的标签索引 */
  activeTab: number
  /** 标签切换回调 */
  onTabChange: (index: number) => void
  /** 自定义类名 */
  className?: string
}

/**
 * ScrollTabs - 滚动标签栏组件
 * 
 * 固定在 ScrollHeader 下方，支持标签切换
 * 
 * @example
 * ```tsx
 * <ScrollTabs 
 *   tabs={["概览", "资本", "策略"]} 
 *   activeTab={0} 
 *   onTabChange={setActiveTab} 
 * />
 * ```
 */
export function ScrollTabs({ tabs, activeTab, onTabChange, className }: ScrollTabsProps) {
  const { isScrolled } = useScrollContext()

  return (
    <div
      className={cn(
        "transition-all duration-300",
        isScrolled ? "bg-background/70 backdrop-blur-xl border-b border-border/50" : "bg-transparent",
        className,
      )}
    >
      <div className={cn("px-4 py-2", DesignTokens.mobile.safeTop)}>
        <div className="flex p-1.5 bg-muted/50 rounded-2xl backdrop-blur-sm">
          {tabs.map((tab, idx) => {
            const isActive = activeTab === idx
            return (
              <button
                key={idx}
                onClick={() => onTabChange(idx)}
                className={cn(
                  "flex-1 py-2.5 font-bold rounded-xl transition-all duration-300",
                  isActive
                    ? "bg-card text-foreground shadow-md scale-100"
                    : "text-muted-foreground hover:text-foreground scale-95",
                )}
              >
                {tab}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

