"use client"
import { LineChart, Line, XAxis, ResponsiveContainer, Tooltip, ReferenceLine, CartesianGrid } from "recharts"
import { UnifiedTooltip } from "./unified-tooltip"
import { ChartColorsRaw } from "./chart-colors"
import { ChartDefaults } from "./chart-config"

interface TechAdoptionCurveProps {
  height?: number
}

/**
 * 技术采用曲线图表组件
 * 用于展示技术采用的生命周期（创新者、早期采用者、早期大众、晚期大众）
 *
 * @example
 * ```tsx
 * <TechAdoptionCurve />
 * ```
 */
export function TechAdoptionCurve({ height = ChartDefaults.height }: TechAdoptionCurveProps) {
  const data = Array.from({ length: 20 }, (_, i) => {
    const x = i - 10
    const sigmoid = 100 / (1 + Math.exp(-0.5 * x))
    return { name: `Y${i + 1}`, value: Number(sigmoid.toFixed(1)) }
  })

  return (
    <div style={{ width: "100%", height: `${height}px` }}>
      <div className="w-full space-y-2">
        <div style={{ height: `${height - 30}px`, width: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={ChartColorsRaw.ui.grid}
                strokeOpacity={ChartDefaults.gridOpacity}
              />
              <XAxis dataKey="name" hide />
              <Tooltip
                content={<UnifiedTooltip />}
                cursor={{ stroke: ChartColorsRaw.series.secondary, strokeWidth: 1, strokeDasharray: "4 4" }}
              />
              <ReferenceLine
                x="Y10"
                stroke={ChartColorsRaw.series.primary}
                strokeDasharray="3 3"
                label={{
                  position: "insideTopLeft",
                  value: "Inflection Point",
                  fill: ChartColorsRaw.series.primary,
                  fontSize: ChartDefaults.fontSize.axis,
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={ChartColorsRaw.ui.text.primary}
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: ChartColorsRaw.series.primary, stroke: "#fff", strokeWidth: 2 }}
                animationDuration={ChartDefaults.animationDuration}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div
          className="flex justify-between px-2 font-bold uppercase tracking-widest"
          style={{ fontSize: ChartDefaults.fontSize.legend, color: ChartColorsRaw.ui.text.secondary }}
        >
          <span>Innovators</span>
          <span>Early Adopters</span>
          <span>Early Majority</span>
          <span>Laggards</span>
        </div>
      </div>
    </div>
  )
}
