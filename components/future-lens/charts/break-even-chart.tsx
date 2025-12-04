"use client"
import { LineChart, Line, XAxis, ReferenceLine, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts"
import { UnifiedTooltip } from "./unified-tooltip"
import { ChartColorsRaw } from "./chart-colors"
import { ChartDefaults } from "./chart-config"

interface BreakEvenData {
  units: number
  cost: number
  revenue: number
}

interface BreakEvenChartProps {
  data?: BreakEvenData[]
  title?: string
  subtitle?: string
  height?: number
}

const defaultData: BreakEvenData[] = Array.from({ length: 10 }, (_, i) => ({
  units: i * 100,
  cost: 500 + i * 50,
  revenue: i * 120,
}))

/**
 * 盈亏平衡点图表组件
 * 用于展示成本、收入和盈亏平衡点
 *
 * @example
 * ```tsx
 * <BreakEvenChart
 *   data={[
 *     { units: 100, cost: 500, revenue: 120 },
 *     { units: 200, cost: 550, revenue: 240 },
 *   ]}
 *   title="Break Even Analysis"
 * />
 * ```
 */
export function BreakEvenChart({ data, title, subtitle, height = ChartDefaults.height }: BreakEvenChartProps) {
  const chartData = data || defaultData

  return (
    <div style={{ width: "100%", height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke={ChartColorsRaw.ui.grid}
            strokeOpacity={ChartDefaults.gridOpacity}
          />
          <Tooltip content={<UnifiedTooltip />} />
          <XAxis dataKey="units" hide />
          <Line
            type="monotone"
            dataKey="cost"
            stroke={ChartColorsRaw.semantic.danger}
            strokeWidth={2}
            dot={false}
            strokeDasharray="5 5"
            animationDuration={ChartDefaults.animationDuration}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke={ChartColorsRaw.semantic.success}
            strokeWidth={3}
            dot={false}
            animationDuration={ChartDefaults.animationDuration}
          />
          <ReferenceLine x={720} stroke={ChartColorsRaw.ui.text.primary} strokeDasharray="3 3" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
