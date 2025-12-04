"use client"

import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { ChartColorsRaw } from "./chart-colors"
import { ChartDefaults } from "./chart-config"
import { UnifiedTooltip } from "./unified-tooltip"
import { DesignTokens } from "@/lib/future-lens/design-tokens"

interface CombinationChartProps {
  data?: Array<{
    label: string
    value: number
    value2: number
  }>
  title?: string
  subtitle?: string
  height?: number
  leftLabel?: string
  rightLabel?: string
}

/**
 * 组合图表 - 柱状图+折线图组合
 * @example <CombinationChart data={[{label: "Q1", value: 45, value2: 12}]} />
 */
export function CombinationChart({
  data = [
    { label: "Q1", value: 45, value2: 12 },
    { label: "Q2", value: 52, value2: 15 },
    { label: "Q3", value: 48, value2: 18 },
    { label: "Q4", value: 61, value2: 22 },
  ],
  title,
  subtitle,
  height = ChartDefaults.height,
  leftLabel = "Revenue ($M)",
  rightLabel = "Margin (%)",
}: CombinationChartProps) {
  const chartData = data.map((item) => ({
    name: item.label,
    revenue: item.value,
    margin: item.value2,
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
      <div style={{ width: "100%", height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={ChartColorsRaw.series.primary} stopOpacity={0.2} />
                <stop offset="100%" stopColor={ChartColorsRaw.series.primary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={ChartColorsRaw.ui.grid} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: ChartColorsRaw.ui.text.secondary, fontWeight: 600 }}
              dy={10}
              padding={{ left: 0, right: 0 }}
            />
            <YAxis
              yAxisId="left"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: ChartDefaults.fontSize.axis, fill: ChartColorsRaw.ui.text.secondary, fontWeight: 600 }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: ChartDefaults.fontSize.axis, fill: ChartColorsRaw.ui.text.secondary, fontWeight: 600 }}
            />
            <Tooltip content={<UnifiedTooltip />} />
            <Legend 
              wrapperStyle={{ 
                fontSize: ChartDefaults.fontSize.legend, 
                paddingTop: "10px", 
                fontWeight: 600,
                color: ChartColorsRaw.ui.text.primary  // 使用调色板颜色，不使用纯黑色
              }} 
              iconType="circle" 
              iconSize={8} 
            />
          <Bar yAxisId="left" dataKey="revenue" fill="url(#colorRevenue)" radius={[6, 6, 0, 0]} name={leftLabel} />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="margin"
            stroke={ChartColorsRaw.series.secondary}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0, fill: ChartColorsRaw.series.secondary }}
            name={rightLabel}
          />
        </ComposedChart>
      </ResponsiveContainer>
      </div>
    </div>
  )
}
