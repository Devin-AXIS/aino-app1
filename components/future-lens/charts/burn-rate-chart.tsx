"use client"
import { ComposedChart, Line, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts"
import { UnifiedTooltip } from "./unified-tooltip"
import { ChartColorsRaw } from "./chart-colors"
import { ChartDefaults } from "./chart-config"

interface BurnRateChartProps {
  height?: number
}

/**
 * 烧钱率跑道图 - 现金流分析
 * 组合图：柱状表示月度支出，线表示资金余额
 *
 * @example
 * ```tsx
 * <BurnRateChart />
 * ```
 */
export function BurnRateChart({ height = ChartDefaults.height }: BurnRateChartProps) {
  const data = Array.from({ length: 12 }, (_, i) => ({
    name: `M${i + 1}`,
    burn: 150 + Math.random() * 50,
    cash: 3000 - i * 180,
  }))

  return (
    <div style={{ width: "100%", height: `${height}px` }}>
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke={ChartColorsRaw.ui.grid}
            strokeOpacity={ChartDefaults.gridOpacity}
          />
          <XAxis dataKey="name" hide />
          <YAxis yAxisId="left" hide />
          <YAxis yAxisId="right" orientation="right" hide />
          <Tooltip content={<UnifiedTooltip />} />

          <Line
            yAxisId="right"
            type="monotone"
            dataKey="cash"
            stroke={ChartColorsRaw.semantic.success}
            strokeWidth={2}
            dot={false}
            animationDuration={ChartDefaults.animationDuration}
          />

          <Bar
            yAxisId="left"
            dataKey="burn"
            fill={ChartColorsRaw.semantic.danger}
            fillOpacity={0.15}
            radius={[ChartDefaults.borderRadius / 4, ChartDefaults.borderRadius / 4, 0, 0]}
            barSize={12}
          />
        </ComposedChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-between px-4 mt-2 bg-rose-50 dark:bg-rose-950/30 rounded-xl py-3 border border-rose-100 dark:border-rose-900">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-rose-400 uppercase">Runway Left</span>
          <span className="text-lg font-black text-rose-600 dark:text-rose-500">14 Months</span>
        </div>
        <div className="text-right flex flex-col">
          <span className="text-[10px] font-bold text-rose-400 uppercase">Avg Burn</span>
          <span className="text-sm font-bold text-rose-600 dark:text-rose-500">-$185k/mo</span>
        </div>
      </div>
    </div>
  )
}
