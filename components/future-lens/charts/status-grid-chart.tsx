"use client"

import type React from "react"
import { ChartDefaults } from "./chart-config"
import { useAppConfig } from "@/lib/future-lens/config-context"

export interface StatusGridItem {
  /** 名称 */
  name: string
  /** 状态: critical(高风险), warning(警告), success(正常) */
  status: "critical" | "warning" | "success"
  /** 描述文本 */
  text: string
}

export interface StatusGridChartProps {
  /** 状态项目数据 */
  data: StatusGridItem[]
  /** 标题 */
  title?: string
  /** 副标题 */
  subtitle?: string
  /** 高度 */
  height?: number
}

/**
 * 状态网格图表组件
 * 用于展示多个项目的状态信息（2x2网格布局）
 *
 * @example
 * ```tsx
 * <StatusGridChart
 *   data={[
 *     { name: "项目A", status: "critical", text: "高风险" },
 *     { name: "项目B", status: "warning", text: "警告" },
 *     { name: "项目C", status: "success", text: "正常" },
 *   ]}
 * />
 * ```
 */
export function StatusGridChart({
  data,
  title,
  subtitle,
  height = ChartDefaults.height,
}: StatusGridChartProps) {
  const { textScale } = useAppConfig()
  const fSize = (base: number) => base * textScale

  return (
    <div style={{ width: "100%", minHeight: `${height}px` }}>
      {title && (
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        {data.map((item, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-xl border flex flex-col justify-between h-20 ${
              item.status === "critical"
                ? "bg-destructive/10 border-destructive/30"
                : item.status === "warning"
                  ? "bg-warning/10 border-warning/30"
                  : "bg-success/10 border-success/30"
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="font-bold text-foreground" style={{ fontSize: `${fSize(11)}px` }}>
                {item.name}
              </span>
              <div
                className={`w-2 h-2 rounded-full ${
                  item.status === "critical" ? "bg-destructive" : item.status === "warning" ? "bg-warning" : "bg-success"
                }`}
              />
            </div>
            <span
              className={`font-medium ${
                item.status === "critical" ? "text-destructive" : item.status === "warning" ? "text-warning" : "text-success"
              }`}
              style={{ fontSize: `${fSize(9)}px` }}
            >
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

