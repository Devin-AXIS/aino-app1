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
    <CardBase className="p-5 mb-3 cursor-pointer hover:bg-accent/5 transition-colors" onClick={onClick}>
      <div className="flex flex-col gap-4">
        {/* Header: Title + Category */}
        <div>
          <h3 className={`${DesignTokens.typography.title} mb-1 leading-tight`} style={{ fontSize: fSize(17) }}>
            {title}
          </h3>
          <p className={`${DesignTokens.typography.caption} text-muted-foreground`} style={{ fontSize: fSize(10) }}>
            {category}
          </p>
        </div>

        {/* Trend Section: Label + Chart + Growth */}
        <div className="flex items-center gap-3">
          {/* Left: Icon */}
          <TrendingUp size={14 * textScale} className="text-muted-foreground/60 flex-shrink-0" strokeWidth={2} />

          {/* Label */}
          <span
            className={`${DesignTokens.typography.body} text-muted-foreground/70 flex-shrink-0`}
            style={{ fontSize: fSize(10) }}
          >
            市场趋势
          </span>

          {/* Middle: Mini Chart */}
          <div className="h-8 w-32 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 1, right: 0, left: 0, bottom: 1 }}>
                <defs>
                  <linearGradient id={`discoverGradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={ChartColorsRaw.series.primary} stopOpacity={0.15} />
                    <stop offset="100%" stopColor={ChartColorsRaw.series.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={ChartColorsRaw.series.primary}
                  strokeWidth={1.2}
                  fill={`url(#discoverGradient-${title})`}
                  dot={false}
                  activeDot={false}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Right: Growth */}
          <span
            className={`${DesignTokens.typography.title} font-semibold flex-shrink-0 ${isPositive ? "text-success" : "text-destructive"}`}
            style={{ fontSize: fSize(15) }}
          >
            {growth}
          </span>
        </div>

        {/* Description */}
        <p
          className={`${DesignTokens.typography.subtitle} text-muted-foreground/90 leading-relaxed line-clamp-2`}
          style={{ fontSize: fSize(13) }}
        >
          {description}
        </p>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className={`${DesignTokens.typography.caption} px-3 py-1 rounded-full bg-secondary/60 text-foreground/70 border border-border/30`}
                style={{ fontSize: fSize(9) }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </CardBase>
  )
}
