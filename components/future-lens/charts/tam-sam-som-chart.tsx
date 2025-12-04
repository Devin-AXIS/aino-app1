"use client"
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from "recharts"
import { UnifiedTooltip } from "./unified-tooltip"
import { ChartColors, ChartColorsRaw } from "./chart-colors"
import { ChartDefaults } from "./chart-config"

interface TamSamSomData {
  name: string
  value: number
  fill: string
}

interface TamSamSomChartProps {
  data?: TamSamSomData[]
  title?: string
  subtitle?: string
  height?: number
}

const defaultData: TamSamSomData[] = [
  { name: "TAM", value: 100, fill: ChartColorsRaw.ui.grid },
  { name: "SAM", value: 45, fill: ChartColorsRaw.ui.axis },
  { name: "SOM", value: 15, fill: ChartColorsRaw.series.primary },
]

/**
 * TAM/SAM/SOM 市场分析图表组件
 * 用于展示总可寻址市场（TAM）、可服务市场（SAM）和目标市场（SOM）
 *
 * @example
 * ```tsx
 * <TamSamSomChart
 *   data={[
 *     { name: "TAM", value: 100, fill: ChartColorsRaw.ui.grid },
 *     { name: "SAM", value: 45, fill: ChartColorsRaw.ui.axis },
 *     { name: "SOM", value: 15, fill: ChartColorsRaw.series.primary },
 *   ]}
 * />
 * ```
 */
export function TamSamSomChart({ data, title, subtitle, height = ChartDefaults.height + 60 }: TamSamSomChartProps) {
  const chartData = data || defaultData

  return (
    <div style={{ width: "100%", height: `${height}px` }} className="relative">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart innerRadius="20%" outerRadius="100%" barSize={24} data={chartData}>
            <RadialBar background dataKey="value" cornerRadius={20} />
            <Tooltip content={<UnifiedTooltip />} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute top-4 right-4 flex flex-col gap-2 text-xs" style={{ color: ChartColorsRaw.ui.text.primary }}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ChartColorsRaw.ui.grid }} />
            TAM: $10B
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ChartColorsRaw.ui.text.secondary }} />
            SAM: $4.5B
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ChartColorsRaw.series.primary }} />
            SOM: $1.5B
          </div>
        </div>
    </div>
  )
}

export { TamSamSomChart as TAMSAMSOMChart }
