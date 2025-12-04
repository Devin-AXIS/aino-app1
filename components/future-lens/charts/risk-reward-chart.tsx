"use client"

import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, ResponsiveContainer, Tooltip, Cell, ReferenceLine } from "recharts"
import { UnifiedTooltip } from "./unified-tooltip"
import { ChartColorsRaw } from "./chart-colors"
import { ChartDefaults } from "./chart-config"

interface RiskRewardChartProps {
  data?: Array<{
    x: number
    y: number
    z: number
    name: string
  }>
  title?: string
  subtitle?: string
  height?: number
}

/**
 * 风险回报图表组件
 * 用于展示不同资产的风险-回报关系
 *
 * @example
 * ```tsx
 * <RiskRewardChart
 *   data={[
 *     { x: 5, y: 4, z: 100, name: "Bonds" },
 *     { x: 12, y: 8, z: 200, name: "Large Cap" },
 *   ]}
 * />
 * ```
 */
export function RiskRewardChart({
  data = [
    { x: 5, y: 4, z: 100, name: "Bonds" },
    { x: 12, y: 8, z: 200, name: "Large Cap" },
    { x: 18, y: 12, z: 150, name: "Small Cap" },
    { x: 25, y: 15, z: 80, name: "Crypto" },
    { x: 8, y: 6, z: 300, name: "REITs" },
  ],
  height = ChartDefaults.height,
}: RiskRewardChartProps) {
  return (
    <div style={{ width: "100%", height: `${height}px` }}>
      <div className="h-full w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
            <XAxis
              type="number"
              dataKey="x"
              name="Risk"
              tick={{
                fontSize: ChartDefaults.fontSize.axis,
                fill: ChartColorsRaw.ui.text.secondary,
                fontWeight: 600,
                fontFamily: ChartDefaults.fontFamily,
              }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Return"
              tick={{
                fontSize: ChartDefaults.fontSize.axis,
                fill: ChartColorsRaw.ui.text.secondary,
                fontWeight: 600,
                fontFamily: ChartDefaults.fontFamily,
              }}
              axisLine={false}
              tickLine={false}
            />
            <ZAxis type="number" dataKey="z" range={[100, 800]} />
            <Tooltip content={<UnifiedTooltip />} cursor={{ strokeDasharray: "3 3" }} />

            <ReferenceLine
              segment={[
                { x: 0, y: 2 },
                { x: 30, y: 16 },
              ]}
              stroke={ChartColorsRaw.ui.grid}
              strokeDasharray="3 3"
            />

            <Scatter name="Assets" data={data}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === 3 ? ChartColorsRaw.series.primary : ChartColorsRaw.ui.grid} fillOpacity={0.7} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
        <div
          className="absolute bottom-2 right-2"
          style={{ fontSize: ChartDefaults.fontSize.legend, color: ChartColorsRaw.ui.text.secondary }}
        >
          Standard Deviation (Risk) →
        </div>
        <div
          className="absolute top-2 left-2"
          style={{ fontSize: ChartDefaults.fontSize.legend, color: ChartColorsRaw.ui.text.secondary }}
        >
          Expected Return ↑
        </div>
      </div>
    </div>
  )
}
