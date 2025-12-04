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

export interface SolidRadarData {
  /** 维度名称 */
  subject: string
  /** 数值 */
  value: number
}

export interface SolidRadarChartProps {
  /** 雷达图数据 */
  data: SolidRadarData[]
  /** 图表高度 */
  height?: number
  /** 填充颜色 */
  fillColor?: string
  /** 描边颜色 */
  strokeColor?: string
  /** 是否显示网格 */
  showGrid?: boolean
}

/**
 * 实心雷达图 - 多维度数据展示
 * 使用实心填充，弱化网格线，增强阴影效果
 * 
 * @example
 * ```tsx
 * <SolidRadarChart
 *   data={[
 *     { subject: "仓储物流", value: 90 },
 *     { subject: "制造工厂", value: 85 },
 *   ]}
 * />
 * ```
 */
export function SolidRadarChart({
  data,
  height = ChartDefaults.height,
  fillColor = ChartColorsRaw.series.primary,
  strokeColor = ChartColorsRaw.series.primary,
  showGrid = true,
}: SolidRadarChartProps) {
  return (
    <div style={{ width: "100%", height: `${height}px` }}>
      <div className="w-full relative h-full">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <defs>
              {/* 阴影效果 */}
              <filter id="solidRadarShadow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feOffset in="blur" dx="0" dy="3" result="offsetBlur" />
                <feFlood floodColor={strokeColor} floodOpacity="0.25" />
                <feComposite in2="offsetBlur" operator="in" />
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* 弱化的网格线 */}
            {showGrid && (
              <PolarGrid
                stroke={ChartColorsRaw.ui.grid}
                strokeWidth={0.5}
                strokeOpacity={0.08}
                strokeDasharray="2 4"
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

            {/* 实心填充雷达图 - 无边框 */}
            <Radar
              name="数值"
              dataKey="value"
              stroke="none"
              fill={fillColor}
              fillOpacity={0.7}
              strokeWidth={0}
              filter="url(#solidRadarShadow)"
              animationDuration={ChartDefaults.animationDuration}
              dot={false}
              activeDot={false}
            />
          </RechartsRadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

