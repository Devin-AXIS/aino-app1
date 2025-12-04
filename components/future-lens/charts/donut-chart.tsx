"use client"

import { PieChart, Pie, ResponsiveContainer, Cell } from "recharts"
import { Divide, type LucideIcon } from "lucide-react"
import { ChartColorsRaw } from "./chart-colors"
import { ChartDefaults } from "./chart-config"
import { DesignTokens } from "@/lib/future-lens/design-tokens"

interface DonutChartData {
  label: string
  value: number
}

interface DonutChartProps {
  /** 图表数据，统一格式 */
  data: DonutChartData[]
  /** 卡片标题 */
  title?: string
  /** 卡片副标题 */
  subtitle?: string
  /** 标题图标 */
  icon?: LucideIcon
  /** 中心显示的文本 */
  centerText?: string
  /** 自定义颜色数组 */
  colors?: string[]
  /** 显示图例 */
  showLegend?: boolean
}

/**
 * 圆环图表组件 - 极细甜甜圈
 */
export const DonutChart = ({
  data,
  title = "Revenue Mix",
  subtitle = "Segment Contribution",
  icon = Divide,
  centerText = "100%",
  colors = ChartDefaults.colors.slice(0, 3),
  showLegend = true,
}: DonutChartProps) => {
  const chartData = data.map((item) => ({ name: item.label, value: item.value }))

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
      <div className="flex items-center" style={{ height: `${ChartDefaults.height}px` }}>
        {/* 圆环图 */}
        <div className="w-[120px] h-[120px] relative flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                innerRadius={50}
                outerRadius={60}
                paddingAngle={8}
                dataKey="value"
                cornerRadius={10}
                stroke="none"
                label={false}  // 禁用默认标签，避免显示黑色文本
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-xl font-bold" style={{ color: ChartColorsRaw.ui.text.primary }}>{centerText}</span>
          </div>
        </div>

        {/* 图例 */}
        {showLegend && (
          <div className="flex-1 pl-4 space-y-3">
            {data.map((item, index) => (
              <div key={index} className="flex flex-col gap-1">
                <div className="flex justify-between items-center" style={{ fontSize: ChartDefaults.fontSize.legend }}>
                  <span className="flex items-center gap-1.5" style={{ color: ChartColorsRaw.ui.text.secondary, fontWeight: 600 }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />
                    {item.label}
                  </span>
                  <span style={{ color: ChartColorsRaw.ui.text.primary, fontWeight: 600 }}>{item.value}%</span>
                </div>
                <div className="w-full rounded-full h-0.5" style={{ backgroundColor: ChartColorsRaw.ui.grid }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${item.value}%`,
                      backgroundColor: colors[index % colors.length],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
