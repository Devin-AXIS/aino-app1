"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  ComposedChart,
  Scatter,
  ErrorBar,
} from "recharts"
import { UnifiedTooltip } from "./unified-tooltip"
import { ChartColorsRaw } from "./chart-colors"
import { ChartDefaults } from "./chart-config"


type ValuationType = "football-field" | "multiples"

interface ValuationChartProps {
  type?: ValuationType
  data?: any
  currentPrice?: number
  height?: number
}

/**
 * 估值图表组件
 * 支持两种模式：足球场视图（football-field）和倍数视图（multiples）
 *
 * @example
 * ```tsx
 * <ValuationChart type="football-field" currentPrice={82} />
 * <ValuationChart type="multiples" />
 * ```
 */
export function ValuationChart({ type = "multiples", data, currentPrice = 82, height = ChartDefaults.height }: ValuationChartProps) {
  if (type === "football-field") {
    const footballData = data || [
      { name: "52-Wk Range", min: 45, max: 78 },
      { name: "Analyst Target", min: 65, max: 90 },
      { name: "Comparable Co.", min: 55, max: 82 },
      { name: "Precedent Trans.", min: 60, max: 88 },
      { name: "DCF (Perpetuity)", min: 70, max: 105 },
      { name: "DCF (Exit Mult.)", min: 75, max: 110 },
    ]

    return (
      <div style={{ width: "100%", height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={footballData} layout="vertical" barSize={14} margin={{ left: -20, right: 10, top: 10, bottom: 10 }}>
            <XAxis type="number" domain={[0, 120]} hide />
            <YAxis
              dataKey="name"
              type="category"
              width={130}
              tick={{
                fontSize: ChartDefaults.fontSize.axis,
                fill: ChartColorsRaw.ui.text.secondary,
                fontWeight: 600,
                fontFamily: ChartDefaults.fontFamily,
              }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<UnifiedTooltip />} cursor={{ fill: "hsl(var(--muted))" }} />
            <Bar
              dataKey={() => 120}
              data={footballData}
              fill="hsl(var(--muted))"
              radius={ChartDefaults.borderRadius / 2}
              barSize={14}
              isAnimationActive={false}
            />
            <Bar dataKey="min" stackId="a" fill="transparent" />
            <Bar
              dataKey={(d) => d.max - d.min}
              name="Valuation"
              stackId="a"
              fill={ChartColorsRaw.ui.text.primary}
              radius={ChartDefaults.borderRadius / 2}
            >
              {footballData.map((entry: any, index: number) => (
                <Cell key={index} fill={entry.name.includes("DCF") ? ChartColorsRaw.series.primary : ChartColorsRaw.series.tertiary} />
              ))}
            </Bar>
            <ReferenceLine
              x={currentPrice}
              stroke={ChartColorsRaw.series.primary}
              strokeDasharray="3 3"
              label={{
                position: "top",
                value: `Current: $${currentPrice}`,
                fill: ChartColorsRaw.series.primary,
                fontSize: ChartDefaults.fontSize.axis,
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  // Default to multiples view
  const multiplesData = data || [
    { name: "EV/Sales", min: 2, q1: 4, median: 6, q3: 8, max: 12 },
    { name: "EV/EBITDA", min: 8, q1: 12, median: 15, q3: 20, max: 25 },
    { name: "P/E", min: 15, q1: 20, median: 25, q3: 35, max: 45 },
  ]

  return (
    <div style={{ width: "100%", height: `${height}px` }}>
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={multiplesData} layout="vertical" margin={{ left: 20, top: 10, bottom: 10 }}>
          <XAxis type="number" hide />
          <YAxis
            dataKey="name"
            type="category"
            width={70}
            tick={{
              fontSize: ChartDefaults.fontSize.axis,
              fill: ChartColorsRaw.ui.text.secondary,
              fontWeight: 600,
              fontFamily: ChartDefaults.fontFamily,
            }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<UnifiedTooltip />} cursor={{ fill: "rgba(0,0,0,0.02)" }} />
          <Bar dataKey="max" fill="transparent" barSize={24}>
            <ErrorBar dataKey="min" width={0} strokeWidth={2} stroke={ChartColorsRaw.ui.text.secondary} />
          </Bar>
          <Scatter name="Median" dataKey="median" fill={ChartColorsRaw.series.primary} shape="circle" />
          <Scatter name="Us" dataKey={(d: any) => d.median * 1.1} fill={ChartColorsRaw.ui.text.primary} shape="diamond" />
        </ComposedChart>
      </ResponsiveContainer>
      <div
        className="flex justify-center gap-4 mt-2"
        style={{ fontSize: ChartDefaults.fontSize.legend, color: ChartColorsRaw.ui.text.secondary }}
      >
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ChartColorsRaw.series.primary }} />
          Industry Median
        </span>
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 rotate-45" style={{ backgroundColor: ChartColorsRaw.ui.text.primary }} />
          Our Company
        </span>
      </div>
    </div>
  )
}
