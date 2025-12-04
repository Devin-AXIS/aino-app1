"use client"

import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, ReferenceLine, ResponsiveContainer, Tooltip, Cell } from "recharts"
import { UnifiedTooltip } from "./unified-tooltip"
import { ChartColors, ChartColorsRaw } from "./chart-colors"
import { ChartDefaults } from "./chart-config"

interface MatrixData {
  name: string
  x: number
  y: number
  z: number
}

interface PriceValueMatrixProps {
  data?: MatrixData[]
  title?: string
  subtitle?: string
  height?: number
}

const defaultData: MatrixData[] = [
  { name: "Budget", x: 20, y: 30, z: 100 },
  { name: "Premium", x: 80, y: 85, z: 200 },
  { name: "Average", x: 50, y: 50, z: 150 },
  { name: "Us", x: 60, y: 90, z: 180 },
]

/**
 * 价格价值矩阵图表组件
 * 用于展示产品在价格-价值坐标系中的定位
 *
 * @example
 * ```tsx
 * <PriceValueMatrix
 *   data={[
 *     { name: "Us", x: 60, y: 90, z: 180 },
 *     { name: "Competitor", x: 50, y: 50, z: 150 },
 *   ]}
 * />
 * ```
 */
export function PriceValueMatrix({ data, title, subtitle, height = ChartDefaults.height }: PriceValueMatrixProps) {
  const chartData = data || defaultData

  return (
    <div style={{ width: "100%", height: `${height}px` }}>
      <div className="h-full w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <XAxis
              type="number"
              dataKey="x"
              name="Price"
              hide
              domain={[0, 100]}
              tick={{
                fontSize: ChartDefaults.fontSize.axis,
                fill: ChartColorsRaw.ui.text.secondary,
                fontWeight: 600,
                fontFamily: ChartDefaults.fontFamily,
              }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Value"
              hide
              domain={[0, 100]}
              tick={{
                fontSize: ChartDefaults.fontSize.axis,
                fill: ChartColorsRaw.ui.text.secondary,
                fontWeight: 600,
                fontFamily: ChartDefaults.fontFamily,
              }}
            />
            <ZAxis type="number" dataKey="z" range={[100, 600]} />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} content={<UnifiedTooltip />} />
            <ReferenceLine
              segment={[
                { x: 0, y: 0 },
                { x: 100, y: 100 },
              ]}
              stroke={ChartColorsRaw.ui.grid}
              strokeDasharray="3 3"
            />
            <Scatter name="Competitors" data={chartData}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.name === "Us" ? ChartColorsRaw.series.primary : ChartColorsRaw.ui.text.secondary} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
        <div
          className="absolute bottom-2 right-2 font-bold uppercase"
          style={{ fontSize: ChartDefaults.fontSize.legend, color: ChartColorsRaw.ui.text.secondary }}
        >
          High Price
        </div>
        <div
          className="absolute top-2 right-2 font-bold uppercase"
          style={{ fontSize: ChartDefaults.fontSize.legend, color: ChartColorsRaw.ui.text.secondary }}
        >
          High Value
        </div>
      </div>
    </div>
  )
}
