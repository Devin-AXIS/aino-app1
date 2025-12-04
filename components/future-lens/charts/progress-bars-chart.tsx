"use client"

import React from "react"
import { ChartColorsRaw } from "./chart-colors"
import { DesignTokens } from "@/lib/future-lens/design-tokens"

/**
 * ProgressBarsChart - 进度条图表组件
 * 用于展示多个指标的进度条，使用统一的图表颜色系统
 * 
 * @example
 * ```tsx
 * <ProgressBarsChart
 *   data={[
 *     { name: "技术", value: 91 },
 *     { name: "资本", value: 85 },
 *     { name: "舆论", value: 88 },
 *     { name: "商业", value: 58 },
 *   ]}
 * />
 * ```
 */
interface ProgressBarItem {
  name: string
  value: number
}

interface ProgressBarsChartProps {
  /** 指标数据 */
  data: ProgressBarItem[]
  /** 文本缩放比例 */
  textScale?: number
  /** 自定义类名 */
  className?: string
}

export function ProgressBarsChart({
  data,
  textScale = 1.0,
  className = "",
}: ProgressBarsChartProps) {
  const fSize = (base: number) => base * textScale

  // 颜色映射：使用图表颜色系统
  const getColor = (index: number): string => {
    const colors = [
      ChartColorsRaw.semantic.success,    // 绿色 - 技术
      ChartColorsRaw.context.capital,     // 靛蓝 - 资本
      ChartColorsRaw.context.heat,        // 粉红 - 舆论
      ChartColorsRaw.semantic.warning,    // 橙色 - 商业
    ]
    return colors[index % colors.length]
  }

  return (
    <div className={`grid grid-cols-2 gap-3.5 ${className}`}>
      {data.map((m, i) => {
        const color = getColor(i)
        return (
          <div key={i}>
            <div 
              className="flex justify-between font-bold text-foreground mb-1" 
              style={{ fontSize: `${fSize(11)}px` }}
            >
              <span>{m.name}</span>
              <span>{m.value}/100</span>
            </div>
            <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{ 
                  width: `${m.value}%`, 
                  backgroundColor: color 
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

