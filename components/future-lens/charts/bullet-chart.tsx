"use client"

import { ChartColorsRaw } from "./chart-colors"
import { ChartDefaults } from "./chart-config"
import { DesignTokens } from "@/lib/future-lens/design-tokens"

/**
 * 子弹图数据格式（特殊格式，不遵循标准 ChartDataPoint）
 */
interface BulletData {
  name: string
  actual: number
  target: number
  range: number
}

interface BulletChartProps {
  /** 子弹图数据（特殊格式） */
  data?: BulletData[]
  /** 图表标题 */
  title?: string
  /** 副标题 */
  subtitle?: string
  /** 图表高度 */
  height?: number
}

/**
 * 业绩子弹图 (Target Bullet)
 * 实际值 vs 目标值 vs 范围
 * 
 * @example
 * ```tsx
 * <BulletChart
 *   data={[
 *     { name: "Revenue", actual: 85, target: 100, range: 120 },
 *     { name: "Profit", actual: 25, target: 20, range: 30 },
 *   ]}
 *   title="Performance"
 * />
 * ```
 */
export function BulletChart({
  data = [
    { name: "Revenue", actual: 85, target: 100, range: 120 },
    { name: "Profit", actual: 25, target: 20, range: 30 },
  ],
  title,
  subtitle,
  height = ChartDefaults.height,
}: BulletChartProps) {
  return (
    <div className="w-full">
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
      <div style={{ width: "100%", height: `${height}px` }}>
      <div className="space-y-4 h-full">
      {data.map((item, idx) => (
        <div key={idx} className="relative h-9">
          <div
            className={`${DesignTokens.text.secondary} font-medium mb-1`}
            style={{ fontSize: ChartDefaults.fontSize.axis }}
          >
            <span>{item.name}</span>
            <span className="text-foreground">
              {item.actual} / {item.target}
            </span>
          </div>
          <div className="absolute top-5 left-0 w-full h-2.5 bg-muted/30 rounded-full overflow-hidden">
            <div
              className="absolute top-0 w-0.5 h-full bg-foreground z-20"
              style={{ left: `${(item.target / item.range) * 100}%` }}
            ></div>
          </div>

          <div
            className="absolute top-5 left-0 h-2.5 rounded-full z-10"
            style={{
              width: `${(item.actual / item.range) * 100}%`,
              backgroundColor: item.actual >= item.target ? ChartColorsRaw.semantic.success : ChartColorsRaw.series.primary,
            }}
          />
        </div>
      ))}
      </div>
      </div>
    </div>
  )
}
