"use client"

import {
  ScatterChart as RechartsScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { ChartColorsRaw } from "./chart-colors"
import { ChartDefaults } from "./chart-config"
import { UnifiedTooltip } from "./unified-tooltip"
import { DesignTokens } from "@/lib/future-lens/design-tokens"

interface ScatterChartProps {
  data?: Array<{
    label: string
    x: number
    y: number
    size?: number
  }>
  title?: string
  subtitle?: string
  height?: number
  xLabel?: string
  yLabel?: string
}

/**
 * 散点图 - 相关性和分布分析
 * 用于市场规模vs增长率、风险vs回报等
 */
export function ScatterChart({
  data = [
    { label: "Product A", x: 65, y: 85, size: 500 },
    { label: "Product B", x: 45, y: 65, size: 300 },
    { label: "Product C", x: 80, y: 45, size: 800 },
    { label: "Product D", x: 25, y: 30, size: 200 },
    { label: "Product E", x: 55, y: 75, size: 400 },
  ],
  title = "Market Position",
  subtitle = "Size vs Growth",
  height = 300,
  xLabel = "Market Share",
  yLabel = "Growth Rate",
}: ScatterChartProps) {
  const chartData = data.map((item) => ({
    x: item.x,
    y: item.y,
    z: item.size || 400,
    name: item.label,
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
          <RechartsScatterChart margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={ChartColorsRaw.ui.grid} />
            <XAxis
              type="number"
              dataKey="x"
              name={xLabel}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: ChartDefaults.fontSize.axis, fill: ChartColorsRaw.ui.text.secondary, fontWeight: 600 }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name={yLabel}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: ChartDefaults.fontSize.axis, fill: ChartColorsRaw.ui.text.secondary, fontWeight: 600 }}
            />
            <ZAxis type="number" dataKey="z" range={[200, 1000]} />
            <Tooltip
              content={<UnifiedTooltip />}
              cursor={{ strokeDasharray: "3 3" }}
            />
          <Scatter data={chartData}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={ChartDefaults.colors[index % ChartDefaults.colors.length]}
                stroke="hsl(var(--background))"
                strokeWidth={2}
              />
            ))}
          </Scatter>
        </RechartsScatterChart>
      </ResponsiveContainer>
    </div>
    </div>
  )
}
