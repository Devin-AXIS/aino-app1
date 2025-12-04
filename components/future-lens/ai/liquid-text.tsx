"use client"

import React from "react"
import { cn } from "@/lib/utils"

export type LiquidTextStatus = "hidden" | "visible" | "switching"

interface LiquidTextProps {
  // 核心接口：最简单、最直观
  text?: string // 单行文字（最常用）
  lines?: string[] // 多行文字
  status?: LiquidTextStatus // 状态，默认 "visible"
  showText?: boolean // 是否显示动画，默认 true
  className?: string
  // 性能优化：是否启用流光效果（idle 状态下可以禁用以提升输入性能）
  enableShimmer?: boolean // 默认 true
}

/**
 * LiquidText - 液态文字组件（最佳复用版本）
 * 
 * 完全独立的展示组件，无业务逻辑依赖
 * 
 * @example
 * // 最简单使用
 * <LiquidText text="Hello World" />
 * 
 * @example
 * // 多行文字
 * <LiquidText lines={["Line 1", "Line 2"]} />
 * 
 * @example
 * // 控制状态
 * <LiquidText text="Loading..." status="switching" />
 */
export function LiquidText({
  text,
  lines,
  status = "visible",
  showText = true,
  className,
  enableShimmer = true,
}: LiquidTextProps) {
  // 自动处理：优先使用 text，其次 lines
  const displayLines = React.useMemo(() => {
    if (text) return [text]
    if (lines && lines.length > 0) return lines
    return []
  }, [text, lines])

  // 如果没有内容，自动隐藏
  const finalStatus = displayLines.length === 0 ? "hidden" : status

  return (
    <div
      data-liquid-text
      className={cn(
        "relative z-10 w-full max-w-3xl px-4 text-center min-h-[100px] sm:min-h-[120px] flex flex-col items-center justify-center shrink-0",
        className,
      )}
      style={{
        // 性能优化：使用 CSS contain 隔离动画，减少重排范围
        contain: "layout style paint",
        // 确保没有边框或轮廓 - 覆盖全局样式
        border: "none",
        outline: "none",
        boxShadow: "none",
        backgroundColor: "transparent",
        // 移除所有可能的边框样式
        borderWidth: "0",
        borderStyle: "none",
        borderColor: "transparent",
      }}
      suppressHydrationWarning
    >
      {finalStatus === "switching" && (
        <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 text-sm tracking-[0.2em] uppercase animate-pulse">
          <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" />
          <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:100ms]" />
          <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:200ms]" />
        </div>
      )}

      {finalStatus !== "switching" && finalStatus !== "hidden" && (
        <div className="flex flex-col gap-2 items-center">
          {displayLines.map((line, idx) => (
            <h2
              key={`liquid-text-${idx}-${line.slice(0, 10)}`}
              className={cn(
                "font-light tracking-tight transition-all duration-700 ease-out leading-tight",
                showText ? "opacity-100 translate-y-0 blur-0" : "opacity-0 -translate-y-4 blur-md",
                // 性能优化：根据 enableShimmer 决定是否显示流光效果
                enableShimmer && "animate-text-shimmer bg-clip-text text-transparent",
                !enableShimmer && "text-foreground", // 不使用流光效果时使用普通文字颜色
                idx === 0 ? "text-2xl md:text-4xl" : "text-lg md:text-2xl",
              )}
              style={{
                transitionDelay: showText ? `${idx * 200}ms` : "0ms",
                // 性能优化：只在启用流光效果时设置背景相关样式
                ...(enableShimmer
                  ? {
                      backgroundSize: "200% auto",
                      backgroundImage:
                        idx === 0
                          ? "linear-gradient(120deg, #1f2937 0%, #374151 30%, #9ca3af 50%, #374151 70%, #1f2937 100%)"
                          : "linear-gradient(120deg, #6b7280 0%, #9ca3af 40%, #e5e7eb 50%, #9ca3af 60%, #6b7280 100%)",
                    }
                  : {}),
                // 性能优化：减少 GPU 加速，让浏览器自动优化
                willChange: "auto", // 移除 will-change，让浏览器决定
              }}
              suppressHydrationWarning
            >
              {line}
            </h2>
          ))}
        </div>
      )}
    </div>
  )
}
