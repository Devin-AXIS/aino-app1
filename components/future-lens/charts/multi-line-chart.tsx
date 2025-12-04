"use client"

import { LineChart as RechartsLineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts"
import { ChartDefaults } from "./chart-config"
import { ChartColorsRaw } from "./chart-colors"
import { UnifiedTooltip } from "./unified-tooltip"

export interface MultiLineChartData {
  /** X 轴标签 */
  label: string
  /** 第一条线的数值 */
  value1: number
  /** 第二条线的数值 */
  value2: number
  /** 可选的第三条线 */
  value3?: number
  /** 可选的第四条线 */
  value4?: number
}

export interface MultiLineChartProps {
  /** 图表数据 */
  data: MultiLineChartData[]
  /** 图表高度 */
  height?: number
  /** 第一条线的配置 */
  line1?: {
    name: string
    color?: string
    strokeWidth?: number
    strokeDasharray?: string
  }
  /** 第二条线的配置 */
  line2?: {
    name: string
    color?: string
    strokeWidth?: number
    strokeDasharray?: string
  }
  /** 是否显示网格 */
  showGrid?: boolean
  /** 是否显示 Y 轴 */
  showYAxis?: boolean
}

/**
 * 多线折线图 - 展示相关性、多指标对比
 * @example <MultiLineChart data={[{label: "Week 1", value1: 20, value2: 25}]} line1={{name: "A"}} line2={{name: "B"}} />
 */
export function MultiLineChart({
  data,
  height = ChartDefaults.height,
  line1 = { name: "Series 1" },
  line2 = { name: "Series 2" },
  showGrid = true,
  showYAxis = false,
}: MultiLineChartProps) {
  const chartData = data.map((item) => ({
    name: item.label,
    value1: item.value1,
    value2: item.value2,
    value3: item.value3,
    value4: item.value4,
  }))

  const line1Color = line1.color || ChartColorsRaw.series.primary
  const line2Color = line2.color || ChartColorsRaw.series.secondary
  const line3Color = ChartColorsRaw.series.tertiary
  const line4Color = ChartColorsRaw.series.quaternary

  return (
    <div style={{ width: "100%", height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          {showGrid && (
            <CartesianGrid
              stroke={ChartColorsRaw.ui.grid}
              strokeWidth={1}
              strokeOpacity={0.2}
              strokeDasharray="3 3"
              vertical={false}
            />
          )}

          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: ChartDefaults.fontSize.axis,
              fill: ChartColorsRaw.ui.text.secondary,
              fontWeight: 600,
              fontFamily: ChartDefaults.fontFamily,
            }}
            dy={10}
            padding={{ left: 0, right: 0 }}
          />

          {showYAxis && (
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: ChartDefaults.fontSize.axis,
                fill: ChartColorsRaw.ui.text.secondary,
                fontWeight: 600,
                fontFamily: ChartDefaults.fontFamily,
              }}
              tickFormatter={ChartDefaults.defaultFormatter}
            />
          )}

          <Tooltip content={<UnifiedTooltip />} cursor={{ stroke: ChartColorsRaw.ui.grid, strokeWidth: 1, strokeDasharray: "4 4" }} />

          {/* 第一条线 */}
          <Line
            type="monotone"
            dataKey="value1"
            name={line1.name}
            stroke={line1Color}
            strokeWidth={line1.strokeWidth || 2.5}
            strokeDasharray={line1.strokeDasharray}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 2, stroke: line1Color, fill: "#fff" }}
            animationDuration={ChartDefaults.animationDuration}
          />

          {/* 第二条线 */}
          <Line
            type="monotone"
            dataKey="value2"
            name={line2.name}
            stroke={line2Color}
            strokeWidth={line2.strokeWidth || 2.5}
            strokeDasharray={line2.strokeDasharray}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 2, stroke: line2Color, fill: "#fff" }}
            animationDuration={ChartDefaults.animationDuration}
          />

          {/* 第三条线（可选） */}
          {data.some((item) => item.value3 !== undefined) && (
            <Line
              type="monotone"
              dataKey="value3"
              name="Series 3"
              stroke={line3Color}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, stroke: line3Color, fill: "#fff" }}
              animationDuration={ChartDefaults.animationDuration}
            />
          )}

          {/* 第四条线（可选） */}
          {data.some((item) => item.value4 !== undefined) && (
            <Line
              type="monotone"
              dataKey="value4"
              name="Series 4"
              stroke={line4Color}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, stroke: line4Color, fill: "#fff" }}
              animationDuration={ChartDefaults.animationDuration}
            />
          )}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  )
}

