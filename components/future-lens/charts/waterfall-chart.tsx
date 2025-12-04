"use client"

import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Briefcase, type LucideIcon } from "lucide-react"
import { ChartColorsRaw } from "./chart-colors"
import { ChartDefaults } from "./chart-config"
import { UnifiedTooltip } from "./unified-tooltip"
import { DesignTokens } from "@/lib/future-lens/design-tokens"

interface WaterfallChartData {
  label: string
  value: number
  start?: number
  type?: "base" | "inc" | "dec"
}

interface WaterfallChartProps {
  data: WaterfallChartData[]
  title?: string
  subtitle?: string
  icon?: LucideIcon
}

/**
 * 瀑布图 - 财务桥接分析
 * @example <WaterfallChart data={[{label: "收入", value: 100, type: "base"}, {label: "成本", value: -30, type: "dec"}]} />
 */
export const WaterfallChart = ({
  data,
  title = "Profitability",
  subtitle = "EBITDA Bridge",
  icon = Briefcase,
}: WaterfallChartProps) => {
  const chartData = data.map((item) => ({
    name: item.label,
    value: item.value,
    start: item.start || 0,
    type: item.type || "base",
  }))

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
          <BarChart data={chartData} barSize={20} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: ChartColorsRaw.ui.text.secondary, fontWeight: 600 }}
              dy={10}
            />
            <Tooltip content={<UnifiedTooltip />} cursor={{ fill: "transparent" }} />

          <Bar dataKey="start" stackId="a" fill="transparent" />

          <Bar
            dataKey="value"
            stackId="a"
            radius={[ChartDefaults.borderRadius, ChartDefaults.borderRadius, ChartDefaults.borderRadius, ChartDefaults.borderRadius]}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={index}
                fill={
                  entry.type === "base"
                    ? ChartColorsRaw.ui.text.primary
                    : entry.type === "dec"
                      ? ChartColorsRaw.semantic.danger
                      : ChartColorsRaw.semantic.success
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      </div>
    </div>
  )
}
