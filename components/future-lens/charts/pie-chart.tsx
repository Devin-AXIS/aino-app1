"use client"

import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"
import type { BaseChartProps } from "@/lib/future-lens/types/chart-types"
import { ChartDefaults } from "./chart-config"
import { ChartColorsRaw } from "./chart-colors"
import { UnifiedTooltip } from "./unified-tooltip"
import { DesignTokens } from "@/lib/future-lens/design-tokens"

interface PieChartProps extends BaseChartProps {
  /** 是否显示为环形图 */
  donut?: boolean
}

export function PieChart({
  data,
  title,
  subtitle,
  showLegend = true,
  height = ChartDefaults.height,
  valueFormatter = ChartDefaults.defaultFormatter,
  donut = false,
}: PieChartProps) {
  const chartData = data.map((item) => ({
    name: item.label,
    value: item.value,
  }))

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
      <div style={{ width: "100%", height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={donut ? "60%" : 0}
              outerRadius="80%"
              paddingAngle={2}
              dataKey="value"
              label={false}  // 禁用默认标签，避免显示黑色文本
              animationDuration={ChartDefaults.animationDuration}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={ChartDefaults.colors[index % ChartDefaults.colors.length]} />
              ))}
            </Pie>
            <Tooltip content={<UnifiedTooltip />} />
            {showLegend && (
              <Legend
                verticalAlign="bottom"
                height={36}
                wrapperStyle={{
                  fontSize: ChartDefaults.fontSize.legend,
                  color: ChartColorsRaw.ui.text.secondary,
                  fontWeight: 600,
                }}
                iconType="circle"
              />
            )}
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
