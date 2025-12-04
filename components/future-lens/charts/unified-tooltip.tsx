"use client"

import { DesignTokens } from "@/lib/future-lens/design-tokens"
import { ChartColorsRaw } from "./chart-colors"
import { ChartDefaults } from "./chart-config"

/**
 * 统一的图表 Tooltip 组件
 * 参考 ScrollableMomentumChart 的设计
 */
export const UnifiedTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className={`${DesignTokens.background.card} ${DesignTokens.blur.input} px-3 py-2 ${DesignTokens.radius.xl} ${DesignTokens.shadow.lg} ${DesignTokens.border.default} text-xs`}
        style={{ zIndex: DesignTokens.zIndex.alert }}
      >
        {label && (
          <p className={`${DesignTokens.text.secondary} font-semibold mb-1`} style={{ fontSize: ChartDefaults.fontSize.tooltip }}>
            {label}
          </p>
        )}
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-0.5">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: entry.color || entry.stroke }}
            />
            <span className={`${DesignTokens.text.primary} font-bold`} style={{ fontSize: ChartDefaults.fontSize.tooltipValue }}>
              {entry.name}: {entry.value}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

