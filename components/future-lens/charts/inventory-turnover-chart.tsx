"use client"
import { ComposedChart, Bar, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts"
import { UnifiedTooltip } from "./unified-tooltip"
import { ChartColorsRaw } from "./chart-colors"
import { ChartDefaults } from "./chart-config"

interface InventoryData {
  name: string
  inventory: number
  turnover: number
}

interface InventoryTurnoverChartProps {
  data?: InventoryData[]
  title?: string
  subtitle?: string
  height?: number
}

const defaultData: InventoryData[] = [
  { name: "Q1", inventory: 500, turnover: 4.2 },
  { name: "Q2", inventory: 550, turnover: 4.0 },
  { name: "Q3", inventory: 480, turnover: 4.5 },
  { name: "Q4", inventory: 450, turnover: 4.8 },
]

/**
 * 库存周转率图表组件
 * 用于展示库存量和周转率的组合对比
 *
 * @example
 * ```tsx
 * <InventoryTurnoverChart
 *   data={[
 *     { name: "Q1", inventory: 500, turnover: 4.2 },
 *     { name: "Q2", inventory: 550, turnover: 4.0 },
 *   ]}
 * />
 * ```
 */
export function InventoryTurnoverChart({ data, title, subtitle, height = ChartDefaults.height }: InventoryTurnoverChartProps) {
  const chartData = data || defaultData

  return (
    <div style={{ width: "100%", height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
          <YAxis yAxisId="left" hide />
          <YAxis yAxisId="right" orientation="right" hide domain={[0, 6]} />
          <Tooltip content={<UnifiedTooltip />} />
          <Bar
            yAxisId="left"
            dataKey="inventory"
            fill={ChartColorsRaw.ui.grid}
            barSize={18}
            radius={[ChartDefaults.borderRadius / 2, ChartDefaults.borderRadius / 2, ChartDefaults.borderRadius / 2, ChartDefaults.borderRadius / 2]}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="turnover"
            stroke={ChartColorsRaw.series.primary}
            strokeWidth={2}
            dot={{ r: 3, fill: ChartColorsRaw.series.primary }}
            animationDuration={ChartDefaults.animationDuration}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
