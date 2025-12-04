"use client"
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts"
import { UnifiedTooltip } from "./unified-tooltip"
import { ChartColorsRaw } from "./chart-colors"
import { ChartDefaults } from "./chart-config"

interface ValueChainData {
  name: string
  value: number
}

interface ValueChainChartProps {
  data?: ValueChainData[]
  title?: string
  subtitle?: string
  height?: number
}

const defaultData: ValueChainData[] = [
  { name: "R&D", value: 15 },
  { name: "Mfg", value: 8 },
  { name: "Sales", value: 12 },
  { name: "Service", value: 25 },
]

/**
 * 价值链图表组件
 * 用于展示价值链各环节的价值贡献
 *
 * @example
 * ```tsx
 * <ValueChainChart
 *   data={[
 *     { name: "R&D", value: 15 },
 *     { name: "Mfg", value: 8 },
 *   ]}
 * />
 * ```
 */
export function ValueChainChart({ data, title, subtitle, height = ChartDefaults.height }: ValueChainChartProps) {
  const chartData = data || defaultData

  return (
    <div style={{ width: "100%", height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} barSize={20} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke={ChartColorsRaw.ui.grid}
            strokeOpacity={ChartDefaults.gridOpacity}
          />
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
          <Bar
            dataKey="value"
            fill={ChartColorsRaw.series.primary}
            radius={[ChartDefaults.borderRadius / 2, ChartDefaults.borderRadius / 2, ChartDefaults.borderRadius / 2, ChartDefaults.borderRadius / 2]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
