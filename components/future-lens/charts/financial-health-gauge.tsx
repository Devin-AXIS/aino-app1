"use client"

import { useAppConfig } from "@/lib/future-lens/config-context"
import { ChartColorsRaw } from "./chart-colors"
import { ChartDefaults } from "./chart-config"

export interface FinancialHealthGaugeProps {
  /** 健康度评分（0-100） */
  score: number
  /** 图表高度 */
  height?: number
}

/**
 * 财务健康度仪表盘
 * 用于展示财务健康度评分（0-100）
 * 
 * @example
 * ```tsx
 * <FinancialHealthGauge score={75} />
 * ```
 */
export function FinancialHealthGauge({
  score,
  height = 120,
}: FinancialHealthGaugeProps) {
  const { textScale } = useAppConfig()
  const fSize = (base: number) => base * textScale

  // 根据评分确定颜色
  const getColor = (score: number): string => {
    if (score >= 80) return ChartColorsRaw.semantic.success
    if (score >= 60) return ChartColorsRaw.semantic.warning
    return ChartColorsRaw.semantic.danger
  }

  // 计算圆弧路径
  const radius = 50
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  const color = getColor(score)

  return (
    <div className="flex flex-col items-center justify-center" style={{ height: `${height}px` }}>
      <div className="relative">
        {/* 背景圆环 */}
        <svg width={height} height={height} className="transform -rotate-90">
          <circle
            cx={height / 2}
            cy={height / 2}
            r={radius}
            fill="none"
            stroke={ChartColorsRaw.ui.grid}
            strokeWidth={8}
            strokeOpacity={0.2}
          />
          {/* 进度圆环 */}
          <circle
            cx={height / 2}
            cy={height / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={8}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 1s ease-in-out",
            }}
          />
        </svg>
        
        {/* 中心文字 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div
            className="font-black"
            style={{
              fontSize: `${fSize(32)}px`,
              color,
              lineHeight: 1,
            }}
          >
            {score}
          </div>
          <div
            className="font-bold text-muted-foreground mt-1"
            style={{
              fontSize: `${fSize(10)}px`,
            }}
          >
            /100
          </div>
        </div>
      </div>
      
      {/* 健康度标签 */}
      <div
        className="mt-3 font-bold"
        style={{
          fontSize: `${fSize(12)}px`,
          color,
        }}
      >
        {score >= 80 ? "优秀" : score >= 60 ? "良好" : "需关注"}
      </div>
    </div>
  )
}

