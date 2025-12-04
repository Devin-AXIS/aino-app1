"use client"

import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from "recharts"
import { TrendingUp, ArrowUpRight, type LucideIcon } from "lucide-react"
import { ChartColorsRaw } from "./chart-colors"
import { ChartDefaults } from "./chart-config"
import { UnifiedTooltip } from "./unified-tooltip"
import { DesignTokens } from "@/lib/future-lens/design-tokens"

interface TrendChartData {
  label: string
  value: number
}

interface TrendChartProps {
  /** 图表数据，统一格式 */
  data: TrendChartData[]
  /** 卡片标题 */
  title?: string
  /** 卡片副标题 */
  subtitle?: string
  /** 标题图标 */
  icon?: LucideIcon
  /** 显示的数值 */
  displayValue?: string
  /** 增长百分比（如 "+12.5%"） */
  growth?: string
  /** 图表高度 */
  height?: number
}

/**
 * 趋势图表组件 - 极简曲线
 *
 * @example
 * \`\`\`tsx
 * <TrendChart
 *   data={[{ label: "Jan", value: 100 }, { label: "Feb", value: 120 }]}
 *   title="Revenue Growth"
 *   subtitle="YoY Comparison"
 *   displayValue="$413k"
 *   growth="+12.5%"
 * />
 * \`\`\`
 */
export const TrendChart = ({
  data,
  title = "Revenue Growth",
  subtitle = "YoY Comparison",
  icon = TrendingUp,
  displayValue = "$413k",
  growth,
  height = ChartDefaults.height,
}: TrendChartProps) => {
  const chartData = data.map((item) => ({ name: item.label, value: item.value }))

  return (
    <div className="w-full">
      {/* 标题 */}
      {title && (
        <div className="flex justify-between items-center px-3 pt-3 mb-1">
          <span
            className={`${DesignTokens.text.secondary} font-bold uppercase tracking-wider`}
            style={{ fontSize: ChartDefaults.fontSize.title }}
          >
            {title}
          </span>
        </div>
      )}

      {/* 数值显示区 */}
      {(displayValue || growth) && (
        <div className="flex items-end gap-3 px-3 pt-3 mb-2">
          {displayValue && (
            <span className="text-2xl font-light tracking-tight" style={{ color: ChartColorsRaw.ui.text.primary }}>
              {displayValue}
            </span>
          )}
          {growth && (
            <span
              className="text-xs font-medium flex items-center px-2 py-0.5 rounded-full"
              style={{
                color: ChartColorsRaw.semantic.success,
                backgroundColor: `${ChartColorsRaw.semantic.success}10`,
              }}
            >
              {growth} <ArrowUpRight size={10} className="ml-0.5" />
            </span>
          )}
        </div>
      )}

      {/* 图表区 */}
      <div style={{ height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="warmGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={ChartColorsRaw.series.primary} stopOpacity={0.2} />
                <stop offset="100%" stopColor={ChartColorsRaw.series.primary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: ChartDefaults.fontSize.axis, fill: ChartColorsRaw.ui.text.secondary, fontWeight: 600 }}
              dy={10}
              padding={{ left: 0, right: 0 }}
            />
            <Tooltip
              content={<UnifiedTooltip />}
              cursor={{ stroke: ChartColorsRaw.ui.text.secondary, strokeWidth: 1, strokeDasharray: "4 4" }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={ChartColorsRaw.series.primary}
              strokeWidth={3}
              fill="url(#warmGradient)"
              activeDot={{ r: 5, strokeWidth: 0, fill: ChartColorsRaw.series.primary }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
