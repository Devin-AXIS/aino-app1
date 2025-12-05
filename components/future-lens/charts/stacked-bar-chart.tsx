"use client"

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { ChartColorsRaw } from "./chart-colors"
import { ChartDefaults } from "./chart-config"
import { UnifiedTooltip } from "./unified-tooltip"
import { DesignTokens } from "@/lib/future-lens/design-tokens"
import { useAppConfig } from "@/lib/future-lens/config-context"
import { translations } from "@/lib/future-lens/i18n"

interface StackedBarChartProps {
  data?: Array<{
    label: string
    value: number
    value2?: number
    value3?: number
  }>
  title?: string
  subtitle?: string
  categories?: string[]
}

/**
 * 堆叠柱状图 - 多维度占比对比
 * @example <StackedBarChart data={[{label: "Q1", value: 30, value2: 20}]} />
 */
export function StackedBarChart({
  data = [
    { label: "Q1", value: 45, value2: 30, value3: 25 },
    { label: "Q2", value: 52, value2: 28, value3: 20 },
    { label: "Q3", value: 48, value2: 32, value3: 20 },
    { label: "Q4", value: 61, value2: 25, value3: 14 },
  ],
  title = "Revenue Structure",
  subtitle = "Stacked Analysis",
  categories = ["Product", "Service", "License"],
}: StackedBarChartProps) {
  const { language } = useAppConfig()

  const chartData = data.map((item) => {
    let name = item.label
    if (item.label.startsWith("Q")) {
      const quarterKey = `chart_data_q${item.label.slice(1).toLowerCase()}` as keyof typeof translations.zh
      const langTranslations = translations[language]
      if (langTranslations && quarterKey in langTranslations) {
        const translated = langTranslations[quarterKey]
        name = translated || item.label
      }
    }
    return {
      name,
      value1: item.value,
      value2: item.value2,
      value3: item.value3,
    }
  })

  const langTranslations = translations[language] || translations.zh
  const translatedCategories = [
    langTranslations.chart_data_product || "Product",
    langTranslations.chart_data_service || "Service",
    langTranslations.chart_data_license || "License",
  ]

  return (
    <div className="w-full">
      {/* 标题 */}
      {title && (
        <div className="flex justify-between items-center px-3 pt-3 mb-1">
          <span
            className={`${DesignTokens.text.secondary} font-bold uppercase tracking-wider`}
            style={{ fontSize: ChartDefaults.fontSize.title }}
          >
            {title}
          </span>
        </div>
      )}

      {/* 图表 */}
      <div style={{ width: "100%", height: `${ChartDefaults.height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            barSize={20}
            barGap={2}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={ChartColorsRaw.ui.grid} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: ChartColorsRaw.ui.text.secondary, fontWeight: 600 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: ChartColorsRaw.ui.text.secondary, fontSize: ChartDefaults.fontSize.axis, fontWeight: 600 }}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip content={<UnifiedTooltip />} cursor={{ fill: "transparent" }} />
            <Legend
              wrapperStyle={{ 
                fontSize: ChartDefaults.fontSize.legend, 
                paddingTop: "10px", 
                fontWeight: 600,
                color: ChartColorsRaw.ui.text.primary  // 使用调色板颜色，不使用纯黑色
              }}
              iconType="circle"
              iconSize={8}
              formatter={(value, entry: any) => {
                const index = entry.dataKey === "value1" ? 0 : entry.dataKey === "value2" ? 1 : 2
                return translatedCategories[index] || value
              }}
            />
            <Bar
              dataKey="value1"
              stackId="stack"
              fill={ChartColorsRaw.series.primary}
              radius={[0, 0, 6, 6]}
            />
            <Bar dataKey="value2" stackId="stack" fill={ChartColorsRaw.series.secondary} radius={[0, 0, 0, 0]} />
            <Bar
              dataKey="value3"
              stackId="stack"
              fill={ChartColorsRaw.series.tertiary}
              radius={[6, 6, 0, 0]}
            />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
