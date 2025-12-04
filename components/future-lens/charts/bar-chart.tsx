"use client"

import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { BaseChartProps } from "@/lib/future-lens/types/chart-types"
import { ChartDefaults } from "./chart-config"
import { ChartColorsRaw } from "./chart-colors"
import { UnifiedTooltip } from "./unified-tooltip"
import { DesignTokens } from "@/lib/future-lens/design-tokens"

interface BarChartProps extends BaseChartProps {
  horizontal?: boolean
}

export function BarChart({
  data,
  title,
  subtitle,
  showLegend = false,
  showGrid = true,
  valueFormatter = ChartDefaults.defaultFormatter,
  horizontal = false,
}: BarChartProps) {
  const chartData = data.map((item) => ({
    name: item.label,
    value: item.value,
    value2: item.value2,
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
          <RechartsBarChart
            data={chartData}
            layout={horizontal ? "vertical" : "horizontal"}
            margin={{ top: 10, right: 10, left: horizontal ? 60 : 0, bottom: 0 }}
          >
            {showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={ChartColorsRaw.ui.grid}
              />
            )}
            {horizontal ? (
              <>
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: ChartDefaults.fontSize.axis, fill: ChartColorsRaw.ui.text.secondary, fontWeight: 600 }}
                  tickFormatter={valueFormatter}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: ChartDefaults.fontSize.axis, fill: ChartColorsRaw.ui.text.secondary, fontWeight: 600 }}
                />
              </>
            ) : (
              <>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: ChartColorsRaw.ui.text.secondary, fontWeight: 600 }}
                  dy={10}
                  padding={{ left: 0, right: 0 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: ChartDefaults.fontSize.axis, fill: ChartColorsRaw.ui.text.secondary, fontWeight: 600 }}
                  tickFormatter={valueFormatter}
                />
              </>
            )}
            <Tooltip
              content={<UnifiedTooltip />}
              cursor={{ fill: "transparent" }}
            />
            <Bar
              dataKey="value"
              fill={ChartDefaults.colors[0]}
              radius={[6, 6, 0, 0]}
              animationDuration={ChartDefaults.animationDuration}
            />
            {data.some((item) => item.value2 !== undefined) && (
              <Bar
                dataKey="value2"
                fill={ChartDefaults.colors[1]}
                radius={[6, 6, 0, 0]}
                animationDuration={ChartDefaults.animationDuration}
              />
            )}
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
