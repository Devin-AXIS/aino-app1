"use client"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine } from "recharts"
import { UnifiedTooltip } from "./unified-tooltip"
import { ChartColorsRaw } from "./chart-colors"
import { ChartDefaults } from "./chart-config"

interface TornadoChartProps {
  height?: number
}

/**
 * 龙卷风图 - 风险敏感度分析
 * 展示不同变量对结果的影响幅度（左负右正）
 *
 * @example
 * ```tsx
 * <TornadoChart />
 * ```
 */
export function TornadoChart({ height = ChartDefaults.height }: TornadoChartProps) {
  const data = [
    { name: "Exch. Rate", low: -15, high: 18 },
    { name: "Mat. Cost", low: -12, high: 10 },
    { name: "Labor", low: -8, high: 6 },
    { name: "Tax", low: -4, high: 3 },
  ]

  return (
    <div style={{ width: "100%", height: `${height}px` }}>
      <div className="w-full space-y-2">
        <div style={{ height: `${height - 30}px`, width: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              barSize={18}
              stackOffset="sign"
              margin={{ left: -20, right: 10, top: 5, bottom: 5 }}
            >
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                width={40}
                tick={{
                  fontSize: ChartDefaults.fontSize.axis,
                  fill: ChartColorsRaw.ui.text.secondary,
                  fontWeight: 600,
                  fontFamily: ChartDefaults.fontFamily,
                }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<UnifiedTooltip />} cursor={{ fill: "transparent" }} />
              <ReferenceLine x={0} stroke={ChartColorsRaw.ui.text.muted} />
              <Bar
                dataKey="low"
                name="Downside"
                fill={ChartColorsRaw.ui.text.secondary}
                radius={[ChartDefaults.borderRadius / 4, 0, 0, ChartDefaults.borderRadius / 4]}
              />
              <Bar
                dataKey="high"
                name="Upside"
                fill={ChartColorsRaw.series.primary}
                radius={[0, ChartDefaults.borderRadius / 4, ChartDefaults.borderRadius / 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div
          className="flex justify-center gap-4 font-bold uppercase tracking-wider"
          style={{ fontSize: ChartDefaults.fontSize.legend, color: ChartColorsRaw.ui.text.secondary }}
        >
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ChartColorsRaw.ui.text.secondary }} />
            Negative Impact
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ChartColorsRaw.series.primary }} />
            Positive Impact
          </div>
        </div>
      </div>
    </div>
  )
}
