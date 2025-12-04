"use client"

import { LiquidOrb, type LiquidOrbStatus } from "./liquid-orb"
import { LiquidText, type LiquidTextStatus } from "./liquid-text"
import { cn } from "@/lib/utils"

/**
 * LiquidDisplay - 最佳复用组合组件
 * 
 * 提供最简单、最直观的接口，适合任何场景
 * 
 * @example
 * // 最简单使用
 * <LiquidDisplay orbStatus="speaking" text="Hello" />
 * 
 * @example
 * // 完整控制
 * <LiquidDisplay 
 *   orbStatus="processing" 
 *   text="Loading..."
 *   textStatus="switching"
 * />
 * 
 * @example
 * // 只显示特效
 * <LiquidDisplay orbStatus="idle" />
 */
interface LiquidDisplayProps {
  // 特效
  orbStatus: LiquidOrbStatus
  orbClassName?: string
  
  // 文字（可选）
  text?: string
  lines?: string[]
  textStatus?: LiquidTextStatus
  showText?: boolean
  textClassName?: string
  
  // 布局
  className?: string
  gap?: "sm" | "md" | "lg" // 间距控制
}

export function LiquidDisplay({
  orbStatus,
  orbClassName,
  text,
  lines,
  textStatus = "visible",
  showText = true,
  textClassName,
  className,
  gap = "md",
}: LiquidDisplayProps) {
  const gapClass = {
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
  }[gap]

  return (
    <div
      className={cn(
        "relative w-full flex flex-col items-center justify-center",
        gapClass,
        className,
      )}
    >
      <LiquidOrb status={orbStatus} className={orbClassName} />
      
      {(text || lines) && (
        <LiquidText
          text={text}
          lines={lines}
          status={textStatus}
          showText={showText}
          className={textClassName}
        />
      )}
    </div>
  )
}
