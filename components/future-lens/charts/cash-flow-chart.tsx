"use client"

import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts"
import { ChartColorsRaw } from "./chart-colors"
import { ChartDefaults } from "./chart-config"
import { UnifiedTooltip } from "./unified-tooltip"

export interface CashFlowData {
  /** 时间周期 */
  period: string
  /** 现金流金额（万元） */
  cashFlow: number
  /** 同比增长率（%） */
  yoyGrowth: number
}

export interface CashFlowChartProps {
  /** 现金流数据 */
  data: CashFlowData[]
  /** 图表高度 */
  height?: number
  /** 是否显示零线 */
  showZeroLine?: boolean
}

/**
 * 现金流图表 - 柱状图+折线图组合
 * 用于展示经营现金流、投资现金流、筹资现金流等财务数据
 * 
 * @example
 * ```tsx
 * <CashFlowChart
 *   data={[
 *     { period: "2024/H1", cashFlow: -59.07, yoyGrowth: 45.98 },
 *     { period: "2024/9M", cashFlow: 326.0, yoyGrowth: 334.12 },
 *   ]}
 * />
 * ```
 */
export function CashFlowChart({
  data,
  height = ChartDefaults.height,
  showZeroLine = true,
}: CashFlowChartProps) {
  const chartData = data.map((item) => ({
    period: item.period,
    cashFlow: item.cashFlow,
    yoyGrowth: item.yoyGrowth,
  }))

  // 格式化现金流显示
  const formatCashFlow = (value: number) => {
    if (value >= 10000) {
      return `${(value / 10000).toFixed(1)}亿`
    }
    return `${value.toFixed(1)}万`
  }

  // 格式化增长率显示
  const formatGrowth = (value: number) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`
  }

  return (
    <div style={{ width: "100%", height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
          <defs>
            <linearGradient id="cashFlowGradient" x1="0" y1="0" x2="0" y2="1">
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
          
          {/* 零线 */}
          {showZeroLine && (
            <ReferenceLine y={0} stroke={ChartColorsRaw.ui.text.secondary} strokeDasharray="2 2" strokeOpacity={0.3} />
          )}
          
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
          
          {/* 左Y轴：现金流 */}
          <YAxis
            yAxisId="left"
            axisLine={false}
            tickLine={false}
            tick={{ 
              fontSize: ChartDefaults.fontSize.axis, 
              fill: ChartColorsRaw.ui.text.secondary, 
              fontWeight: 600 
            }}
            tickFormatter={formatCashFlow}
          />
          
          {/* 右Y轴：增长率 */}
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
          
          <Tooltip 
            content={<UnifiedTooltip />}
            formatter={(value: number, name: string) => {
              if (name === "现金流") {
                return [formatCashFlow(value), "现金流（万元）"]
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
              paddingTop: "10px", 
              fontWeight: 600,
              color: ChartColorsRaw.ui.text.primary  // 使用调色板颜色，不使用纯黑色
            }} 
            iconType="square"
            iconSize={10}
          />
          
          {/* 现金流柱状图 */}
          <Bar
            yAxisId="left"
            dataKey="cashFlow"
            fill="url(#cashFlowGradient)"
            radius={[4, 4, 0, 0]}
            name="现金流（万元）"
          />
          
          {/* 同比增长折线图 */}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="yoyGrowth"
            stroke={ChartColorsRaw.series.secondary}
            strokeWidth={2.5}
            dot={{ r: 4, fill: ChartColorsRaw.series.secondary, strokeWidth: 2, stroke: "#ffffff" }}
            activeDot={{ r: 6, strokeWidth: 2, stroke: ChartColorsRaw.series.secondary }}
            name="同比增长（%）"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

