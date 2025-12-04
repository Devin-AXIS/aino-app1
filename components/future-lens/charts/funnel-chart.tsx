"use client"
import { ChartColorsRaw } from "./chart-colors"
import { ChartDefaults } from "./chart-config"
import { DesignTokens } from "@/lib/future-lens/design-tokens"
import { useLanguage } from "@/lib/future-lens/config-context"

interface FunnelChartProps {
  data?: Array<{
    label: string
    value: number
  }>
  title?: string
  subtitle?: string
  height?: number
}

/**
 * 漏斗图 - 转化分析
 * @example <FunnelChart data={[{label: "访问", value: 1000}, {label: "注册", value: 500}]} />
 */
export function FunnelChart({ data, title, subtitle, height = ChartDefaults.height }: FunnelChartProps) {
  const { t } = useLanguage()

  const defaultData = [
    { label: t("chart.visitors"), value: 10000 },
    { label: t("chart.signups"), value: 5000 },
    { label: t("chart.trials"), value: 2000 },
    { label: t("chart.customers"), value: 800 },
  ]

  const chartData = data || defaultData

  const maxValue = Math.max(...chartData.map((d) => d.value))

  const formatValue = (value: number) => {
    if (value >= 1000) return `${(value / 1000).toFixed(1)}k`
    return value.toString()
  }

  const colors = ChartDefaults.colors

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
      <div className="px-3" style={{ height: `${height}px` }}>
        <div className="flex flex-col justify-around h-full gap-2">
        {chartData.map((item, index) => {
          const percentage = (item.value / maxValue) * 100
          const nextPercentage = index < chartData.length - 1 ? (chartData[index + 1].value / item.value) * 100 : 0

          return (
            <div key={index} className="flex items-center gap-4">
              <div className="flex-1">
                <div
                  className="relative h-6 rounded-full transition-all duration-300 hover:opacity-90"
                  style={{
                    width: `${percentage}%`,
                    background: `linear-gradient(135deg, ${colors[index]}, ${colors[index]}dd)`,
                    minWidth: "100px",
                    boxShadow: "0 2px 8px -2px rgba(0,0,0,0.1)",
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-between px-3">
                    <span className="text-[10px] font-medium text-white">{item.label}</span>
                    <span className="text-[10px] font-semibold text-white tabular-nums">{formatValue(item.value)}</span>
                  </div>
                </div>
              </div>
              {nextPercentage > 0 && (
                <div className="w-10 text-right">
                  <span className="text-[9px] font-medium tabular-nums" style={{ color: ChartColorsRaw.ui.text.secondary }}>
                    {nextPercentage.toFixed(0)}%
                  </span>
                </div>
              )}
            </div>
          )
        })}
        </div>
      </div>
    </div>
  )
}
