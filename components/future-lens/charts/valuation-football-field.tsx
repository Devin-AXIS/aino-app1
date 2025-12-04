"use client"

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts"
import { UnifiedTooltip } from "./unified-tooltip"
import { ChartColorsRaw } from "./chart-colors"
import { ChartDefaults } from "./chart-config"

interface ValuationFootballFieldProps {
  height?: number
}

/**
 * 投行专用：估值足球场 (Valuation Football Field)
 * 用于展示不同估值方法（DCF, 交易可比, 上市可比）得出的股价区间
 *
 * @example
 * ```tsx
 * <ValuationFootballField />
 * ```
 */
export const ValuationFootballField = ({ height = ChartDefaults.height }: ValuationFootballFieldProps) => {
  const data = [
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
        <BarChart data={data} layout="vertical" barSize={14} margin={{ left: -20, right: 10, top: 10, bottom: 10 }}>
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

          {/* 背景轨道 */}
          <Bar
            dataKey={() => 120}
            fill="hsl(var(--muted))"
            radius={ChartDefaults.borderRadius / 2}
            barSize={14}
            isAnimationActive={false}
          />

          {/* 透明柱子垫高 min */}
          <Bar dataKey="min" stackId="a" fill="transparent" />
          <Bar
            dataKey={(d) => d.max - d.min}
            name="Valuation"
            stackId="a"
            fill={ChartColorsRaw.ui.text.primary}
            radius={ChartDefaults.borderRadius / 2}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.name.includes("DCF") ? ChartColorsRaw.series.primary : ChartColorsRaw.series.tertiary} />
            ))}
          </Bar>

          {/* 当前股价标线 */}
          <ReferenceLine
            x={82}
            stroke={ChartColorsRaw.series.primary}
            strokeDasharray="3 3"
            label={{
              position: "top",
              value: "Current: $82",
              fill: ChartColorsRaw.series.primary,
              fontSize: ChartDefaults.fontSize.axis,
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
