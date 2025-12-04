"use client"
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts"
import { UnifiedTooltip } from "./unified-tooltip"
import { ChartColorsRaw } from "./chart-colors"
import { ChartDefaults } from "./chart-config"

interface UnitEconomicsData {
  name: string
  cac: number
  margin: number
}

interface UnitEconomicsChartProps {
  data?: UnitEconomicsData[]
  title?: string
  subtitle?: string
  height?: number
}

const defaultData: UnitEconomicsData[] = [
  { name: "Prod A", cac: 150, margin: 450 },
  { name: "Prod B", cac: 300, margin: 900 },
]

/**
 * 单位经济学图表组件
 * 用于展示客户获取成本（CAC）和利润率的堆叠对比
 *
 * @example
 * ```tsx
 * <UnitEconomicsChart
 *   data={[
 *     { name: "Prod A", cac: 150, margin: 450 },
 *     { name: "Prod B", cac: 300, margin: 900 },
 *   ]}
 *   title="Unit Economics"
 * />
 * ```
 */
export function UnitEconomicsChart({ data, title, subtitle, height = ChartDefaults.height }: UnitEconomicsChartProps) {
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
          <Bar dataKey="cac" stackId="a" fill={ChartColorsRaw.ui.grid} />
          <Bar
            dataKey="margin"
            stackId="a"
            fill={ChartColorsRaw.series.primary}
            radius={[ChartDefaults.borderRadius / 2, ChartDefaults.borderRadius / 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
