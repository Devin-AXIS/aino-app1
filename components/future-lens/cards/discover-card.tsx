"use client"

import { AreaChart, Area, ResponsiveContainer } from "recharts"
import { TrendingUp } from "lucide-react"
import { CardBase } from "../ds/card-base"
import { DesignTokens } from "@/lib/future-lens/design-tokens"
import { ChartColorsRaw } from "../charts/chart-colors"
import { useAppConfig } from "@/lib/future-lens/config-context"
import type { InsightData } from "@/lib/future-lens/types"

/**
 * DiscoverCard - 发现卡片组件
 * 接受统一的 InsightData 格式
 * 
 * @example
 * ```tsx
 * <DiscoverCard
 *   data={{
 *     id: 1,
 *     type: 'discover',
 *     title: '标题',
 *     category: '分类',
 *     description: '描述',
 *     growth: '+10%',
 *     tags: ['标签1'],
 *     trendData: [1, 2, 3]
 *   }}
 * />
 * ```
 */
export const DiscoverCard = ({ data, onClick }: { data: InsightData; onClick?: () => void }) => {
  const { title, category, description, growth, tags = [], trendData = [] } = data
  const { textScale } = useAppConfig()
  const fSize = (base: number) => `${base * textScale}px`

  const isPositive = growth?.startsWith?.("+") ?? false

  const chartData = trendData.map((value, index) => ({
    name: index,
    value: value,
  }))

  // 数据验证
  if (!title || !category || !description || !growth) {
    console.warn("[DiscoverCard] 缺少必需字段", data)
    return null
  }

  return (
    <CardBase className="p-4 mb-3 cursor-pointer hover:bg-accent/5 transition-all duration-300 group hover:shadow-md" onClick={onClick} style={{ minHeight: "140px" }}>
      <div className="flex items-start gap-4 h-full">
        {/* Left: Content */}
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          {/* Header: Title Only */}
          <div>
            <h3 className={`${DesignTokens.typography.title} mb-0 leading-tight line-clamp-1 font-semibold`} style={{ fontSize: fSize(16) }}>
              {title}
            </h3>
          </div>

          {/* Description */}
          <p
            className={`${DesignTokens.typography.subtitle} text-muted-foreground/80 leading-relaxed line-clamp-2 flex-1`}
            style={{ fontSize: fSize(12) }}
          >
            {description}
          </p>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap mt-auto">
              {tags.slice(0, 2).map((tag, idx) => (
                <span
                  key={idx}
                  className={`${DesignTokens.typography.caption} px-2.5 py-1 rounded-md bg-primary/5 text-primary/80 border border-primary/10 font-medium`}
                  style={{ fontSize: fSize(9) }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right: Trend Chart + Growth */}
        <div className="flex flex-col items-end gap-2.5 flex-shrink-0">
          {/* Growth Badge with enhanced design */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/30 border border-border/50">
            <span
              className={`${DesignTokens.typography.title} font-bold ${isPositive ? "text-success" : "text-destructive"}`}
              style={{ fontSize: fSize(15) }}
            >
              {growth}
            </span>
          </div>

          {/* Mini Trend Chart with enhanced design */}
          <div className="h-14 w-28 flex-shrink-0 rounded-lg bg-muted/20 p-1.5 border border-border/30">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
                <defs>
                  <linearGradient id={`discoverGradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={isPositive ? ChartColorsRaw.semantic.success : ChartColorsRaw.semantic.danger} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={isPositive ? ChartColorsRaw.semantic.success : ChartColorsRaw.semantic.danger} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={isPositive ? ChartColorsRaw.semantic.success : ChartColorsRaw.semantic.danger}
                  strokeWidth={2}
                  fill={`url(#discoverGradient-${title})`}
                  dot={false}
                  activeDot={false}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </CardBase>
  )
}
