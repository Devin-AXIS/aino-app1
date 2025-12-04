"use client"

import { useAppConfig } from "@/lib/future-lens/config-context"
import { ChartDefaults } from "./chart-config"
import { ChartColorsRaw } from "./chart-colors"
import { DesignTokens } from "@/lib/future-lens/design-tokens"
import { cn } from "@/lib/utils"

export interface HorizontalBarChartData {
  /** 标签/名称 */
  label: string
  /** 数值 */
  value: number
}

export interface HorizontalBarChartProps {
  /** 图表数据 */
  data: HorizontalBarChartData[]
  /** 图表高度（自动计算，可选） */
  height?: number
  /** 条形高度 */
  barHeight?: number
  /** 条形间距 */
  gap?: number
  /** 条形颜色 */
  barColor?: string
  /** 背景颜色 */
  backgroundColor?: string
  /** 是否显示数值 */
  showValue?: boolean
  /** 自定义类名 */
  className?: string
}

/**
 * 水平条形图 - 横向对比分类数据
 * @example <HorizontalBarChart data={[{label: "A", value: 20}]} />
 */
export function HorizontalBarChart({
  data,
  height,
  barHeight = 14,
  gap = 12,
  barColor = ChartColorsRaw.series.primary,
  backgroundColor = ChartColorsRaw.ui.grid + "15",
  showValue = false,
  className,
}: HorizontalBarChartProps) {
  const { textScale } = useAppConfig()
  const fSize = (base: number) => base * textScale

  // 计算最大值用于百分比
  const maxValue = Math.max(...data.map((item) => item.value), 100)

  // 自动计算高度
  const calculatedHeight = height || data.length * (barHeight + gap) - gap + 20

  return (
    <div className={cn("w-full", className)} style={{ height: `${calculatedHeight}px` }}>
      <div className="space-y-3">
        {data.map((item, index) => {
          const percentage = (item.value / maxValue) * 100

          return (
            <div key={index} className="flex items-center gap-3">
              {/* 标签 */}
              <div
                className={cn(
                  DesignTokens.typography.body,
                  "font-semibold flex-shrink-0 min-w-[60px]"
                )}
                style={{ fontSize: `${fSize(11)}px`, color: ChartColorsRaw.ui.text.secondary }}
              >
                {item.label}
              </div>

              {/* 条形容器 */}
              <div className="flex-1 relative">
                {/* 背景条 - 毛玻璃效果 */}
                <div
                  className={cn(
                    "w-full rounded-full overflow-hidden",
                    DesignTokens.blur.input
                  )}
                  style={{
                    height: `${barHeight}px`,
                    backgroundColor: backgroundColor,
                  }}
                >
                  {/* 前景条 - 渐变 + 毛玻璃 + 柔和阴影 */}
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500 ease-out relative",
                      DesignTokens.blur.input
                    )}
                    style={{
                      width: `${percentage}%`,
                      background: `linear-gradient(90deg, ${barColor} 0%, ${barColor}dd 100%)`,
                      boxShadow: `
                        0 2px 12px ${barColor}25,
                        0 1px 4px ${barColor}40
                      `,
                    }}
                  />
                </div>

                {/* 数值标签（可选） */}
                {showValue && (
                  <div
                    className="absolute right-2 top-1/2 -translate-y-1/2 font-bold"
                    style={{
                      fontSize: `${fSize(10)}px`,
                      color: ChartColorsRaw.ui.text.primary,
                    }}
                  >
                    {item.value}%
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
