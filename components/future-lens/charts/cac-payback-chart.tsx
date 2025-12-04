"use client"
import { AreaChart, Area, XAxis, ReferenceLine, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts"
import { UnifiedTooltip } from "./unified-tooltip"
import { ChartColorsRaw } from "./chart-colors"
import { ChartDefaults } from "./chart-config"

interface CacPaybackData {
  month: number
  cash: number
}

interface CacPaybackChartProps {
  data?: CacPaybackData[]
  title?: string
  subtitle?: string
  height?: number
}

const defaultData: CacPaybackData[] = [
  { month: 0, cash: -500 },
  { month: 3, cash: -350 },
  { month: 6, cash: -200 },
  { month: 9, cash: -50 },
  { month: 12, cash: 100 },
  { month: 15, cash: 250 },
]

/**
 * CAC 回收期图表组件
 * 用于展示客户获取成本的回收周期和现金流变化
 *
 * @example
 * ```tsx
 * <CacPaybackChart
 *   data={[
 *     { month: 0, cash: -500 },
 *     { month: 12, cash: 100 },
 *   ]}
 * />
 * ```
 */
export function CacPaybackChart({ data, title, subtitle, height = ChartDefaults.height }: CacPaybackChartProps) {
  const chartData = data || defaultData

  return (
    <div style={{ width: "100%", height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="cacPaybackGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={ChartColorsRaw.semantic.success} stopOpacity={0.2} />
              <stop offset="100%" stopColor={ChartColorsRaw.semantic.success} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke={ChartColorsRaw.ui.grid}
            strokeOpacity={ChartDefaults.gridOpacity}
          />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: ChartDefaults.fontSize.axis,
              fill: ChartColorsRaw.ui.text.secondary,
              fontWeight: 600,
              fontFamily: ChartDefaults.fontFamily,
            }}
            dy={10}
          />
          <ReferenceLine y={0} stroke={ChartColorsRaw.ui.text.primary} strokeDasharray="3 3" />
          <ReferenceLine
            x={10}
            stroke={ChartColorsRaw.series.primary}
            label={{ value: "10 Mo", fill: ChartColorsRaw.series.primary, fontSize: ChartDefaults.fontSize.axis, position: "top" }}
          />
          <Tooltip content={<UnifiedTooltip />} />
          <Area
            type="monotone"
            dataKey="cash"
            stroke={ChartColorsRaw.semantic.success}
            strokeWidth={3}
            fill="url(#cacPaybackGradient)"
            animationDuration={ChartDefaults.animationDuration}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export { CacPaybackChart as CACPaybackChart }
