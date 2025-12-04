"use client"
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, ReferenceLine, ResponsiveContainer, Tooltip, Cell } from "recharts"
import { UnifiedTooltip } from "./unified-tooltip"
import { ChartColorsRaw } from "./chart-colors"
import { ChartDefaults } from "./chart-config"

interface RuleOf40Data {
  name: string
  x: number
  y: number
  z: number
}

interface RuleOf40ChartProps {
  data?: RuleOf40Data[]
  title?: string
  subtitle?: string
  height?: number
}

const defaultData: RuleOf40Data[] = [
  { name: "Us", x: 30, y: 20, z: 100 },
  { name: "Competitor A", x: 10, y: 10, z: 80 },
  { name: "High Growth", x: 50, y: -20, z: 120 },
  { name: "Cash Cow", x: 5, y: 45, z: 150 },
]

/**
 * 40法则图表组件
 * 用于展示增长率和利润率的组合分析（增长率 + 利润率 ≥ 40%）
 *
 * @example
 * ```tsx
 * <RuleOf40Chart
 *   data={[
 *     { name: "Us", x: 30, y: 20, z: 100 },
 *     { name: "Competitor A", x: 10, y: 10, z: 80 },
 *   ]}
 * />
 * ```
 */
export function RuleOf40Chart({ data, title = "Rule of 40", subtitle = "Growth vs Margin", height = ChartDefaults.height }: RuleOf40ChartProps) {
  const chartData = data || defaultData

  return (
    <div style={{ width: "100%", height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <XAxis
            type="number"
            dataKey="x"
            name="Growth"
            unit="%"
            tick={{
              fontSize: ChartDefaults.fontSize.axis,
              fill: ChartColorsRaw.ui.text.secondary,
              fontWeight: 600,
              fontFamily: ChartDefaults.fontFamily,
            }}
            axisLine={false}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Margin"
            unit="%"
            tick={{
              fontSize: ChartDefaults.fontSize.axis,
              fill: ChartColorsRaw.ui.text.secondary,
              fontWeight: 600,
              fontFamily: ChartDefaults.fontFamily,
            }}
            axisLine={false}
          />
          <ZAxis type="number" dataKey="z" range={[100, 400]} />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} content={<UnifiedTooltip />} />
          <ReferenceLine x={20} stroke={ChartColorsRaw.ui.grid} />
          <ReferenceLine y={20} stroke={ChartColorsRaw.ui.grid} />
          <Scatter name="Companies" data={chartData}>
            {chartData.map((entry, index) => (
              <Cell key={index} fill={entry.name === "Us" ? ChartColorsRaw.series.primary : ChartColorsRaw.ui.text.primary} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      <div
        className="absolute top-2 right-2 font-bold z-20"
        style={{ fontSize: ChartDefaults.fontSize.legend, color: ChartColorsRaw.ui.text.secondary }}
      >
        Elite (High Growth/Margin)
      </div>
    </div>
  )
}
