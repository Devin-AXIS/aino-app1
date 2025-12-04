"use client"
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip, Cell } from "recharts"
import { UnifiedTooltip } from "./unified-tooltip"
import { ChartColorsRaw } from "./chart-colors"
import { ChartDefaults } from "./chart-config"

interface SalesVelocityData {
  name: string
  velocity: number
}

interface SalesVelocityChartProps {
  data?: SalesVelocityData[]
  title?: string
  subtitle?: string
  height?: number
}

const defaultData: SalesVelocityData[] = [
  { name: "Q1", velocity: 45 },
  { name: "Q2", velocity: 52 },
  { name: "Q3", velocity: 48 },
  { name: "Q4", velocity: 60 },
]

/**
 * 销售速度图表组件
 * 用于展示销售周期、转化速度等指标
 *
 * @example
 * ```tsx
 * <SalesVelocityChart
 *   data={[
 *     { name: "Q1", velocity: 45 },
 *     { name: "Q2", velocity: 52 },
 *   ]}
 *   title="Sales Velocity"
 * />
 * ```
 */
export function SalesVelocityChart({ data, title, subtitle, height = ChartDefaults.height }: SalesVelocityChartProps) {
  const chartData = data || defaultData

  return (
    <div style={{ width: "100%", height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} barSize={20} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="name"
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
          <Tooltip content={<UnifiedTooltip />} cursor={{ fill: "transparent" }} />
          <Bar dataKey="velocity" radius={[ChartDefaults.borderRadius / 2, ChartDefaults.borderRadius / 2, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={index} fill={index === chartData.length - 1 ? ChartColorsRaw.series.primary : ChartColorsRaw.ui.text.primary} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
