"use client"
import { LineChart, Line, XAxis, ReferenceLine, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts"
import { UnifiedTooltip } from "./unified-tooltip"
import { ChartColorsRaw } from "./chart-colors"
import { ChartDefaults } from "./chart-config"

interface WhaleCurveData {
  name: string
  profit: number
}

interface WhaleCurveChartProps {
  data?: WhaleCurveData[]
  title?: string
  subtitle?: string
  height?: number
}

const defaultData: WhaleCurveData[] = [
  { name: "0%", profit: 0 },
  { name: "20%", profit: 150 },
  { name: "50%", profit: 180 },
  { name: "80%", profit: 160 },
  { name: "100%", profit: 100 },
]

/**
 * 鲸鱼曲线图表组件
 * 用于展示客户利润贡献的累积分布曲线
 *
 * @example
 * ```tsx
 * <WhaleCurveChart
 *   data={[
 *     { name: "0%", profit: 0 },
 *     { name: "20%", profit: 150 },
 *   ]}
 * />
 * ```
 */
export function WhaleCurveChart({ data, title, subtitle, height = ChartDefaults.height }: WhaleCurveChartProps) {
  const chartData = data || defaultData

  return (
    <div style={{ width: "100%", height: `${height}px` }}>
      <div className="w-full space-y-2">
        <div style={{ height: `${height}px`, width: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
              <Tooltip content={<UnifiedTooltip />} />
              <ReferenceLine
                y={100}
                stroke={ChartColorsRaw.ui.grid}
                strokeDasharray="3 3"
                label={{ value: "100% Profit", fontSize: ChartDefaults.fontSize.legend, fill: ChartColorsRaw.ui.text.secondary }}
              />
              <Line
                type="monotone"
                dataKey="profit"
                stroke={ChartColorsRaw.series.primary}
                strokeWidth={3}
                dot={{ r: 4, fill: "#fff", stroke: ChartColorsRaw.series.primary, strokeWidth: 2 }}
                animationDuration={ChartDefaults.animationDuration}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-between px-2" style={{ fontSize: ChartDefaults.fontSize.legend, color: ChartColorsRaw.ui.text.secondary }}>
          <span>Most Profitable</span>
          <span className="text-rose-500">Value Destroyers</span>
        </div>
      </div>
    </div>
  )
}
