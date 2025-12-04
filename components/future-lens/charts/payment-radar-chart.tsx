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

export interface PaymentRadarData {
  /** 维度名称 */
  subject: string
  /** 付费能力/意愿 */
  payment: number
  /** 落地成熟度 */
  maturity: number
  /** 商业化程度 */
  commercialization: number
}

export interface PaymentRadarChartProps {
  /** 雷达图数据 */
  data: PaymentRadarData[]
  /** 图表高度 */
  height?: number
}

/**
 * 付费雷达图 - 展示场景的付费能力、落地成熟度和商业化程度
 * 优化设计：弱化线框，增强阴影效果
 * 
 * @example
 * ```tsx
 * <PaymentRadarChart
 *   data={[
 *     { subject: "仓储物流", payment: 90, maturity: 85, commercialization: 80 },
 *     { subject: "制造工厂", payment: 85, maturity: 80, commercialization: 75 },
 *   ]}
 * />
 * ```
 */
export function PaymentRadarChart({
  data,
  height = ChartDefaults.height,
}: PaymentRadarChartProps) {
  // 转换数据格式：为每个系列创建独立的数据数组
  const paymentData = data.map((d) => ({ subject: d.subject, value: d.payment }))
  const maturityData = data.map((d) => ({ subject: d.subject, value: d.maturity }))
  const commercializationData = data.map((d) => ({ subject: d.subject, value: d.commercialization }))

  return (
    <div style={{ width: "100%", height: `${height}px` }}>
      <div className="w-full relative h-full">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <defs>
              {/* 付费能力 - 蓝色渐变 */}
              <linearGradient id="paymentGlassFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={ChartColorsRaw.context.capital} stopOpacity={0.4} />
                <stop offset="50%" stopColor={ChartColorsRaw.context.capital} stopOpacity={0.2} />
                <stop offset="100%" stopColor={ChartColorsRaw.context.capital} stopOpacity={0.1} />
              </linearGradient>
              
              {/* 落地成熟度 - 绿色渐变 */}
              <linearGradient id="maturityGlassFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={ChartColorsRaw.semantic.success} stopOpacity={0.4} />
                <stop offset="50%" stopColor={ChartColorsRaw.semantic.success} stopOpacity={0.2} />
                <stop offset="100%" stopColor={ChartColorsRaw.semantic.success} stopOpacity={0.1} />
              </linearGradient>
              
              {/* 商业化程度 - 橙色渐变 */}
              <linearGradient id="commercializationGlassFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={ChartColorsRaw.semantic.warning} stopOpacity={0.4} />
                <stop offset="50%" stopColor={ChartColorsRaw.semantic.warning} stopOpacity={0.2} />
                <stop offset="100%" stopColor={ChartColorsRaw.semantic.warning} stopOpacity={0.1} />
              </linearGradient>

              {/* 阴影效果 - 付费能力 */}
              <filter id="paymentShadow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feOffset in="blur" dx="0" dy="2" result="offsetBlur" />
                <feFlood floodColor={ChartColorsRaw.context.capital} floodOpacity="0.3" />
                <feComposite in2="offsetBlur" operator="in" />
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* 阴影效果 - 落地成熟度 */}
              <filter id="maturityShadow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feOffset in="blur" dx="0" dy="2" result="offsetBlur" />
                <feFlood floodColor={ChartColorsRaw.semantic.success} floodOpacity="0.3" />
                <feComposite in2="offsetBlur" operator="in" />
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* 阴影效果 - 商业化程度 */}
              <filter id="commercializationShadow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feOffset in="blur" dx="0" dy="2" result="offsetBlur" />
                <feFlood floodColor={ChartColorsRaw.semantic.warning} floodOpacity="0.3" />
                <feComposite in2="offsetBlur" operator="in" />
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* 弱化的网格线 */}
            <PolarGrid
              stroke={ChartColorsRaw.ui.grid}
              strokeWidth={0.5}
              strokeOpacity={0.1}
              strokeDasharray="2 4"
            />

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

            {/* 付费能力系列 */}
            <Radar
              name="付费能力"
              dataKey="payment"
              stroke={ChartColorsRaw.context.capital}
              fill="url(#paymentGlassFill)"
              fillOpacity={1}
              strokeWidth={2.5}
              filter="url(#paymentShadow)"
              animationDuration={ChartDefaults.animationDuration}
              dot={{ r: 3, fill: ChartColorsRaw.context.capital, strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 5, fill: ChartColorsRaw.context.capital, strokeWidth: 2, stroke: "#fff" }}
            />

            {/* 落地成熟度系列 */}
            <Radar
              name="落地成熟度"
              dataKey="maturity"
              stroke={ChartColorsRaw.semantic.success}
              fill="url(#maturityGlassFill)"
              fillOpacity={1}
              strokeWidth={2.5}
              filter="url(#maturityShadow)"
              animationDuration={ChartDefaults.animationDuration}
              dot={{ r: 3, fill: ChartColorsRaw.semantic.success, strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 5, fill: ChartColorsRaw.semantic.success, strokeWidth: 2, stroke: "#fff" }}
            />

            {/* 商业化程度系列 */}
            <Radar
              name="商业化程度"
              dataKey="commercialization"
              stroke={ChartColorsRaw.semantic.warning}
              fill="url(#commercializationGlassFill)"
              fillOpacity={1}
              strokeWidth={2.5}
              filter="url(#commercializationShadow)"
              animationDuration={ChartDefaults.animationDuration}
              dot={{ r: 3, fill: ChartColorsRaw.semantic.warning, strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 5, fill: ChartColorsRaw.semantic.warning, strokeWidth: 2, stroke: "#fff" }}
            />
          </RechartsRadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

