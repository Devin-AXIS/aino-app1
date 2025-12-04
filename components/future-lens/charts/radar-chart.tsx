"use client"

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart as RechartsRadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { ChartDefaults } from "./chart-config"
import { ChartColorsRaw } from "./chart-colors"
import { UnifiedTooltip } from "./unified-tooltip"


export interface RadarChartData {
  /** 维度名称 */
  subject: string
  /** 数值 */
  value: number
  /** 可选：最大值（用于归一化） */
  fullMark?: number
}

export interface RadarChartProps {
  /** 雷达图数据 */
  data: RadarChartData[]
  /** 图表高度 */
  height?: number
  /** 填充颜色 */
  fillColor?: string
  /** 填充透明度 */
  fillOpacity?: number
  /** 描边颜色 */
  strokeColor?: string
  /** 描边宽度 */
  strokeWidth?: number
  /** 是否显示网格 */
  showGrid?: boolean
  /** 数值格式化函数 */
  valueFormatter?: (value: number) => string
}

/**
 * 雷达图 - 多维度对比分析
 * @example <RadarChart data={[{subject: "A", value: 80}]} />
 */
export function RadarChart({
  data,
  height = ChartDefaults.height,
  fillColor = ChartDefaults.colors[0],
  fillOpacity = 0.4,
  strokeColor = ChartDefaults.colors[0],
  strokeWidth = 3,
  showGrid = true,
  valueFormatter = ChartDefaults.defaultFormatter,
}: RadarChartProps) {
  return (
    <div style={{ width: "100%", height: `${height}px` }}>
      <div className="w-full relative h-full">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadarChart data={data} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
            <defs>
              <linearGradient id="radarGlassFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={strokeColor} stopOpacity={0.3} />
                <stop offset="50%" stopColor={strokeColor} stopOpacity={0.15} />
                <stop offset="100%" stopColor={strokeColor} stopOpacity={0.05} />
              </linearGradient>
              <filter id="radarGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {showGrid && (
              <PolarGrid
                stroke={ChartColorsRaw.ui.grid}
                strokeWidth={1}
                strokeOpacity={0.2}
                strokeDasharray="3 3"
              />
            )}

            <PolarAngleAxis
              dataKey="subject"
              tick={{
                fill: ChartColorsRaw.ui.text.secondary,
                fontSize: ChartDefaults.fontSize.axis,
                fontWeight: 600,
                fontFamily: ChartDefaults.fontFamily,
              }}
            />

            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={false}
              axisLine={false}
            />

            <Tooltip content={<UnifiedTooltip />} />

            <Radar
              name="Score"
              dataKey="value"
              stroke={strokeColor}
              fill="url(#radarGlassFill)"
              fillOpacity={1}
              strokeWidth={strokeWidth}
              filter="url(#radarGlow)"
              animationDuration={ChartDefaults.animationDuration}
              dot={{ r: 3, fill: strokeColor, strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 5, fill: strokeColor, strokeWidth: 2, stroke: "#fff" }}
            />
          </RechartsRadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
