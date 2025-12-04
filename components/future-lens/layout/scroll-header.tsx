"use client"

import type React from "react"
import { ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { DesignTokens } from "@/lib/future-lens/design-tokens"
import { useScrollContext } from "./scroll-header-container"

interface ScrollHeaderProps {
  title: string
  onBack?: () => void
  actions?: React.ReactNode
  className?: string
  alwaysShowTitle?: boolean
  /** 标签栏（可选，显示在标题下方） */
  tabs?: React.ReactNode
}

/**
 * ScrollHeader - 滚动顶部栏组件
 * 
 * 根据滚动位置自动显示/隐藏标题和背景，提供统一的页面头部体验
 * 必须在 ScrollHeaderContainer 内使用
 * 
 * @example
 * ```tsx
 * <ScrollHeaderContainer scrollContainerId="scroll-container">
 *   <ScrollHeader title="页面标题" onBack={() => router.back()} />
 * </ScrollHeaderContainer>
 * ```
 */
export function ScrollHeader({
  title,
  onBack,
  actions,
  className,
  alwaysShowTitle = false,
  tabs,
}: ScrollHeaderProps) {
  const { isScrolled } = useScrollContext()

  return (
    <header
      className={cn(
        "transition-all duration-300",
        isScrolled ? "bg-background/70 backdrop-blur-xl shadow-sm border-b border-border/50" : "bg-transparent",
        className,
      )}
    >
      {/* 标题行 */}
      <div className={cn("relative flex items-center justify-between px-4 h-14", DesignTokens.mobile.safeTop)}>
        {/* Left: Back Button */}
        <div className="flex items-center w-12">
          {onBack && (
            <button
              onClick={onBack}
              className={cn(
                "p-2 -ml-2 text-foreground/80 hover:text-foreground active:scale-95 transition-all duration-300",
                "opacity-100", // 永远显示返回按钮
              )}
            >
              <ChevronLeft size={24} />
            </button>
          )}
        </div>

        {/* Center: Title - 绝对居中 */}
        <div className="absolute left-0 right-0 flex justify-center pointer-events-none">
          <h1
            className={cn(
              DesignTokens.typography.title,
              "text-[17px] font-semibold text-foreground transition-opacity duration-300 pointer-events-auto",
              "opacity-100", // 永远显示标题
            )}
          >
            {title}
          </h1>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center justify-end gap-2 ml-auto">{actions}</div>
      </div>

      {/* 标签栏（显示在标题下方，完全融入顶部栏） */}
      {tabs && (
        <div className="px-4 py-2.5 border-b border-border/30">
          {tabs}
        </div>
      )}
    </header>
  )
}
