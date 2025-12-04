"use client"
import { BarChart, Bar, XAxis, ReferenceLine, ResponsiveContainer, Tooltip, Cell, CartesianGrid } from "recharts"
import { UnifiedTooltip } from "./unified-tooltip"
import { ChartColorsRaw } from "./chart-colors"
import { ChartDefaults } from "./chart-config"

interface NdrBridgeData {
  name: string
  value: number
  fill: string
}

interface NdrBridgeChartProps {
  data?: NdrBridgeData[]
  title?: string
  subtitle?: string
  height?: number
}

const defaultData: NdrBridgeData[] = [
  { name: "Start", value: 100, fill: ChartColorsRaw.ui.axis },
  { name: "Expand", value: 15, fill: ChartColorsRaw.semantic.success },
  { name: "Churn", value: -5, fill: ChartColorsRaw.semantic.danger },
  { name: "Down", value: -2, fill: ChartColorsRaw.semantic.danger },
  { name: "End", value: 108, fill: ChartColorsRaw.series.primary },
]

/**
 * NDR 桥接图表组件
 * 用于展示净收入留存率（NDR）的分解和变化
 *
 * @example
 * ```tsx
 * <NdrBridgeChart
 *   data={[
 *     { name: "Start", value: 100, fill: ChartColorsRaw.ui.axis },
 *     { name: "Expand", value: 15, fill: ChartColorsRaw.semantic.success },
 *   ]}
 * />
 * ```
 */
export function NdrBridgeChart({ data, title, subtitle, height = ChartDefaults.height }: NdrBridgeChartProps) {
  const chartData = data || defaultData

  return (
    <div style={{ width: "100%", height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} barSize={18} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
          <ReferenceLine y={0} stroke={ChartColorsRaw.ui.grid} />
          <Bar
            dataKey="value"
            radius={[ChartDefaults.borderRadius / 2, ChartDefaults.borderRadius / 2, ChartDefaults.borderRadius / 2, ChartDefaults.borderRadius / 2]}
          >
            {chartData.map((entry, index) => (
              <Cell key={index} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export { NdrBridgeChart as NDRBridgeChart }
