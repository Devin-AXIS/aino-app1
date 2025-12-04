"use client"
import { AreaChart, Area, XAxis, ReferenceLine, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts"
import { UnifiedTooltip } from "./unified-tooltip"
import { ChartColors, ChartColorsRaw } from "./chart-colors"
import { ChartDefaults } from "./chart-config"

interface JCurveData {
  name: string
  value: number
}

interface PeJCurveChartProps {
  data?: JCurveData[]
  title?: string
  subtitle?: string
  height?: number
}

const defaultData: JCurveData[] = [
  { name: "Y1", value: -20 },
  { name: "Y2", value: -35 },
  { name: "Y3", value: -15 },
  { name: "Y4", value: 10 },
  { name: "Y5", value: 45 },
  { name: "Y6", value: 80 },
  { name: "Y7", value: 120 },
]

/**
 * PE J 曲线图表组件
 * 用于展示私募股权投资的典型回报曲线（先下降后上升）
 *
 * @example
 * ```tsx
 * <PeJCurveChart
 *   data={[
 *     { name: "Y1", value: -20 },
 *     { name: "Y2", value: -35 },
 *     { name: "Y3", value: 10 },
 *   ]}
 *   title="PE J-Curve"
 * />
 * ```
 */
export function PeJCurveChart({ data, title, subtitle, height = ChartDefaults.height }: PeJCurveChartProps) {
  const chartData = data || defaultData

  return (
    <div style={{ width: "100%", height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="jCurveGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={ChartColorsRaw.series.primary} stopOpacity={0.4} />
              <stop offset="100%" stopColor={ChartColorsRaw.series.primary} stopOpacity={0} />
            </linearGradient>
          </defs>
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
          <ReferenceLine y={0} stroke={ChartColorsRaw.ui.grid} strokeDasharray="3 3" />
          <Tooltip content={<UnifiedTooltip />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke={ChartColorsRaw.series.primary}
            strokeWidth={3}
            fill="url(#jCurveGradient)"
            animationDuration={ChartDefaults.animationDuration}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export { PeJCurveChart as PEJCurveChart }
