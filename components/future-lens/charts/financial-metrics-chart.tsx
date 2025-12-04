"use client"

import { useState } from "react"
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts"
import { ChartColorsRaw } from "./chart-colors"
import { ChartDefaults } from "./chart-config"
import { UnifiedTooltip } from "./unified-tooltip"
import { cn } from "@/lib/utils"

export interface FinancialMetricData {
  /** 时间周期 */
  period: string
  /** 现金流金额（万元） */
  cashFlow?: number
  /** 同比增长率（%） */
  yoyGrowth?: number
  /** 营收（万元） */
  revenue?: number
  /** 毛利率（%） */
  grossMargin?: number
  /** 净利润（万元） */
  netProfit?: number
}

export interface FinancialMetricsChartProps {
  /** 财务数据 */
  data: FinancialMetricData[]
  /** 图表高度 */
  height?: number
  /** 可切换的指标类型 */
  metricTypes?: Array<{ id: string; label: string; showBar?: boolean; showLine?: boolean }>
}

/**
 * 财务指标图表 - 支持标签切换的柱状图+折线图组合
 * 可以切换不同的财务指标（现金流、营收、毛利率等）
 * 
 * @example
 * ```tsx
 * <FinancialMetricsChart
 *   data={[
 *     { period: "2024/H1", cashFlow: -59.07, yoyGrowth: 45.98 },
 *   ]}
 *   metricTypes={[
 *     { id: "cashFlow", label: "经营现金流", showBar: true, showLine: true },
 *     { id: "revenue", label: "营收", showBar: true, showLine: true },
 *   ]}
 * />
 * ```
 */
export function FinancialMetricsChart({
  data,
  height = ChartDefaults.height,
  metricTypes = [
    { id: "cashFlow", label: "经营现金流", showBar: true, showLine: true },
    { id: "revenue", label: "营收", showBar: true, showLine: true },
    { id: "grossMargin", label: "毛利率", showBar: false, showLine: true },
  ],
}: FinancialMetricsChartProps) {
  const [activeMetric, setActiveMetric] = useState(metricTypes[0]?.id || "cashFlow")

  const currentMetric = metricTypes.find((m) => m.id === activeMetric) || metricTypes[0]

  // 根据当前指标获取数据
  const getBarDataKey = () => {
    if (currentMetric.id === "cashFlow") return "cashFlow"
    if (currentMetric.id === "revenue") return "revenue"
    if (currentMetric.id === "netProfit") return "netProfit"
    return null
  }

  const getLineDataKey = () => {
    if (currentMetric.id === "cashFlow") return "yoyGrowth"
    if (currentMetric.id === "revenue") return "yoyGrowth"
    return null
  }

  const barDataKey = getBarDataKey()
  const lineDataKey = getLineDataKey()

  // 格式化显示
  const formatValue = (value: number, type: string) => {
    if (type === "cashFlow" || type === "revenue" || type === "netProfit") {
      if (Math.abs(value) >= 10000) {
        return `${(value / 10000).toFixed(1)}亿`
      }
      return `${value.toFixed(1)}万`
    }
    if (type === "grossMargin") {
      return `${value.toFixed(1)}%`
    }
    return `${value.toFixed(1)}%`
  }

  const formatGrowth = (value: number) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`
  }

  return (
    <div className="w-full">
      {/* 标签切换 - 紧凑样式 */}
      <div className="flex gap-1 mb-3 overflow-x-auto scrollbar-hide pb-1">
        {metricTypes.map((metric) => (
          <button
            key={metric.id}
            onClick={() => setActiveMetric(metric.id)}
            className={cn(
              "flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap",
              activeMetric === metric.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
            )}
          >
            {metric.label}
          </button>
        ))}
      </div>

      {/* 图表 */}
      <div style={{ width: "100%", height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
            <defs>
              <linearGradient id="financialGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={ChartColorsRaw.series.primary} stopOpacity={0.8} />
                <stop offset="100%" stopColor={ChartColorsRaw.series.primary} stopOpacity={0.2} />
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke={ChartColorsRaw.ui.grid} 
              strokeOpacity={0.1}
            />
            
            <ReferenceLine y={0} stroke={ChartColorsRaw.ui.text.secondary} strokeDasharray="2 2" strokeOpacity={0.3} />
            
            <XAxis
              dataKey="period"
              axisLine={false}
              tickLine={false}
              tick={{ 
                fontSize: ChartDefaults.fontSize.axis, 
                fill: ChartColorsRaw.ui.text.secondary, 
                fontWeight: 600 
              }}
              dy={10}
              padding={{ left: 0, right: 0 }}
            />
            
            {/* 左Y轴：主要指标 */}
            {currentMetric.showBar && barDataKey && (
              <YAxis
                yAxisId="left"
                axisLine={false}
                tickLine={false}
                tick={{ 
                  fontSize: ChartDefaults.fontSize.axis, 
                  fill: ChartColorsRaw.ui.text.secondary, 
                  fontWeight: 600 
                }}
                tickFormatter={(value) => formatValue(value, currentMetric.id)}
              />
            )}
            
            {/* 右Y轴：增长率 */}
            {currentMetric.showLine && lineDataKey && (
              <YAxis
                yAxisId="right"
                orientation="right"
                axisLine={false}
                tickLine={false}
                tick={{ 
                  fontSize: ChartDefaults.fontSize.axis, 
                  fill: ChartColorsRaw.ui.text.secondary, 
                  fontWeight: 600 
                }}
                tickFormatter={formatGrowth}
              />
            )}
            
            <Tooltip 
              content={<UnifiedTooltip />}
              formatter={(value: number, name: string) => {
                if (name === currentMetric.label) {
                  return [formatValue(value, currentMetric.id), currentMetric.label]
                }
                if (name === "同比增长") {
                  return [formatGrowth(value), "同比增长（%）"]
                }
                return [value, name]
              }}
            />
            
            <Legend 
              wrapperStyle={{ 
                fontSize: ChartDefaults.fontSize.legend, 
                paddingTop: "8px", 
                fontWeight: 600,
                color: ChartColorsRaw.ui.text.primary  // 使用调色板颜色，不使用纯黑色
              }} 
              iconType="square"
              iconSize={8}
            />
            
            {/* 柱状图 */}
            {currentMetric.showBar && barDataKey && (
              <Bar
                yAxisId="left"
                dataKey={barDataKey}
                fill="url(#financialGradient)"
                radius={[4, 4, 0, 0]}
                name={currentMetric.label}
              />
            )}
            
            {/* 折线图 */}
            {currentMetric.showLine && lineDataKey && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey={lineDataKey}
                stroke={ChartColorsRaw.series.secondary}
                strokeWidth={2.5}
                dot={{ r: 4, fill: ChartColorsRaw.series.secondary, strokeWidth: 2, stroke: "#ffffff" }}
                activeDot={{ r: 6, strokeWidth: 2, stroke: ChartColorsRaw.series.secondary }}
                name="同比增长（%）"
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

