"use client"

import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from "recharts"
import { ChartColorsRaw } from "./chart-colors"
import { ChartDefaults } from "./chart-config"
import { UnifiedTooltip } from "./unified-tooltip"
import { DesignTokens } from "@/lib/future-lens/design-tokens"

interface ParetoData {
  name: string
  value: number
}

interface ParetoChartProps {
  data?: ParetoData[]
  title?: string
  subtitle?: string
}

const defaultData: ParetoData[] = [
  { name: "A", value: 400 },
  { name: "B", value: 300 },
  { name: "C", value: 150 },
  { name: "Other", value: 150 },
]

export function ParetoChart({ data, title = "Concentration", subtitle = "Top Customers" }: ParetoChartProps) {
  const chartData = data || defaultData

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

      {/* 图表 */}
      <div style={{ width: "100%", height: `${ChartDefaults.height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barSize={16} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
    </div>
  )
}
