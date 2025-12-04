"use client"

import { cn } from "@/lib/utils"

interface BottomFadeOverlayProps {
  className?: string
  height?: string
}

/**
 * 底部渐变模糊遮罩组件 - 公用能力
 * 用于所有页面的底部导航区域，提供下拉时的模糊渐变效果
 * 
 * @example
 * ```tsx
 * <BottomFadeOverlay />
 * ```
 */
export function BottomFadeOverlay({ className, height = "h-40" }: BottomFadeOverlayProps) {
  return (
    <div
      className={cn(
        "absolute bottom-0 left-0 w-full pointer-events-none z-20",
        "bg-gradient-to-t from-background via-background/90 to-transparent",
        height,
        className
      )}
    />
  )
}

