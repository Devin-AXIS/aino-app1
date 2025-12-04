"use client"

import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts"
import { UnifiedTooltip } from "./unified-tooltip"
import { type ChartSize, getChartSize } from "./chart-sizes"
import { useLanguage } from "@/lib/future-lens/config-context"
import { ChartColorsRaw } from "./chart-colors"
import { ChartDefaults } from "./chart-config"


interface CapitalStackChartProps {
  data?: Array<{
    name: string
    senior: number
    mezzanine: number
    equity: number
  }>
  title?: string
  subtitle?: string
  size?: ChartSize
}

/**
 * 资本结构堆叠图 - 展示资本层级分布
 * @example <CapitalStackChart data={[{name: "2024", senior: 40, mezzanine: 20, equity: 40}]} />
 */
export function CapitalStackChart({
  data = [
    { name: "2023", senior: 40, mezzanine: 20, equity: 40 },
    { name: "2024", senior: 35, mezzanine: 25, equity: 40 },
    { name: "2025", senior: 30, mezzanine: 30, equity: 40 },
  ],
  size = "medium",
}: CapitalStackChartProps) {
  const chartSize = getChartSize(size)
  const { t } = useLanguage()

  const heightValue = chartSize.height || ChartDefaults.height

  return (
    <div style={{ width: "100%", height: `${heightValue}px` }}>
      <div className="w-full space-y-2 h-full flex flex-col">
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barSize={chartSize.barSize} barGap={chartSize.barGap}>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: chartSize.fontSize, fill: ChartColorsRaw.ui.text.secondary, fontWeight: 500 }}
                dy={12}
              />
              <Tooltip content={<UnifiedTooltip />} cursor={{ fill: "transparent" }} />
              <Bar
                dataKey="senior"
                name={t("chart_data_senior")}
                stackId="a"
                fill={ChartColorsRaw.ui.grid}
                radius={[0, 0, chartSize.radius / 2, chartSize.radius / 2]}
              />
              <Bar
                dataKey="mezzanine"
                name={t("chart_data_mezzanine")}
                stackId="a"
                fill={ChartColorsRaw.ui.text.secondary}
                fillOpacity={0.4}
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="equity"
                name={t("chart_data_equity")}
                stackId="a"
                fill={ChartColorsRaw.series.primary}
                radius={[chartSize.radius, chartSize.radius, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-4 text-[11px] font-medium tracking-wide" style={{ color: ChartColorsRaw.ui.text.secondary }}>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ChartColorsRaw.ui.grid }}></div>
            <span>{t("chart_data_senior").toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ChartColorsRaw.ui.text.secondary, opacity: 0.4 }}></div>
            <span>{t("chart_data_mezzanine").toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ChartColorsRaw.series.primary }}></div>
            <span>{t("chart_data_equity").toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
