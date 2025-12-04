"use client"

import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import type { BaseChartProps } from "@/lib/future-lens/types/chart-types"
import { ChartDefaults } from "./chart-config"
import { ChartColorsRaw } from "./chart-colors"
import { UnifiedTooltip } from "./unified-tooltip"
import { DesignTokens } from "@/lib/future-lens/design-tokens"

interface AreaChartProps extends BaseChartProps {
  smooth?: boolean
  stacked?: boolean
}

export function AreaChart({
  data,
  title,
  subtitle,
  showLegend = false,
  showGrid = true,
  valueFormatter = ChartDefaults.defaultFormatter,
  smooth = true,
  stacked = false,
}: AreaChartProps) {
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
          <RechartsAreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="areaGradient1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={ChartDefaults.colors[0]} stopOpacity={0.2} />
                <stop offset="100%" stopColor={ChartDefaults.colors[0]} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="areaGradient2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={ChartDefaults.colors[1]} stopOpacity={0.2} />
                <stop offset="100%" stopColor={ChartDefaults.colors[1]} stopOpacity={0} />
              </linearGradient>
            </defs>
            {showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={ChartColorsRaw.ui.grid}
              />
            )}
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
            <Tooltip
              content={<UnifiedTooltip />}
              cursor={{ stroke: ChartColorsRaw.ui.text.secondary, strokeWidth: 1, strokeDasharray: "4 4" }}
            />
            <Area
              type={smooth ? "monotone" : "linear"}
              dataKey="value"
              stroke={ChartDefaults.colors[0]}
              strokeWidth={3}
              fill="url(#areaGradient1)"
              activeDot={{ r: 5, strokeWidth: 0, fill: ChartDefaults.colors[0] }}
              animationDuration={ChartDefaults.animationDuration}
            />
            {data.some((item) => item.value2 !== undefined) && (
              <Area
                type={smooth ? "monotone" : "linear"}
                dataKey="value2"
                stroke={ChartDefaults.colors[1]}
                strokeWidth={3}
                fill="url(#areaGradient2)"
                activeDot={{ r: 5, strokeWidth: 0, fill: ChartDefaults.colors[1] }}
                animationDuration={ChartDefaults.animationDuration}
              />
            )}
          </RechartsAreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
