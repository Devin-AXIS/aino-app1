"use client"

import { BarChart, Bar, Tooltip, ResponsiveContainer, Cell, ErrorBar } from "recharts"
import { ChartColorsRaw } from "./chart-colors"
import { ChartDefaults } from "./chart-config"
import { UnifiedTooltip } from "./unified-tooltip"
import { DesignTokens } from "@/lib/future-lens/design-tokens"

/**
 * K线图数据格式（特殊格式，不遵循标准 ChartDataPoint）
 */
interface CandleData {
  name: number
  open: number
  close: number
  high: number
  low: number
}

interface SimpleCandleChartProps {
  /** K线图数据（特殊格式） */
  data?: CandleData[]
  /** 图表标题 */
  title?: string
  /** 副标题 */
  subtitle?: string
  /** 图表高度 */
  height?: number
}

/**
 * K线图组件
 * 用于展示股票、期货等金融产品的价格走势
 * 
 * @example
 * ```tsx
 * <SimpleCandleChart
 *   data={[
 *     { name: 0, open: 100, close: 105, high: 108, low: 98 },
 *     { name: 1, open: 105, close: 102, high: 107, low: 101 },
 *   ]}
 *   title="Price Trend"
 * />
 * ```
 */
export function SimpleCandleChart({
  data = Array.from({ length: 20 }, (_, i) => {
    const base = 100 + Math.sin(i / 2) * 20 + i
    const open = base + Math.random() * 10 - 5
    const close = base + Math.random() * 10 - 5
    return {
      name: i,
      open,
      close,
      high: Math.max(open, close) + Math.random() * 5,
      low: Math.min(open, close) - Math.random() * 5,
    }
  }),
  title,
  subtitle,
  height = ChartDefaults.height,
}: SimpleCandleChartProps) {
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
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={12} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <Tooltip
              content={<UnifiedTooltip />}
              cursor={{ fill: "transparent" }}
            />

          <Bar dataKey="high" fill="transparent">
            <ErrorBar dataKey="high" width={0} strokeWidth={1} stroke={ChartColorsRaw.ui.text.secondary} />
          </Bar>

          <Bar dataKey="close" stackId="a" fill="transparent" />
          <Bar dataKey={(d) => Math.abs(d.open - d.close)} stackId="b" radius={[2, 2, 2, 2]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.close > entry.open ? ChartColorsRaw.semantic.success : ChartColorsRaw.semantic.danger} fillOpacity={0.8} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      </div>
    </div>
  )
}
