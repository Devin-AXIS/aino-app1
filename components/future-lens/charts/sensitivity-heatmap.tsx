"use client"

import React from "react"
import { ChartColorsRaw } from "./chart-colors"


/**
 * 战略专用：敏感性分析热力表 (Sensitivity Heatmap)
 * 展示关键假设（如WACC vs 增长率）变化对估值的影响
 */
export const SensitivityHeatmap = () => {
  const xLabels = ["1.5%", "2.0%", "2.5%", "3.0%", "3.5%"]
  const yLabels = ["8.0%", "8.5%", "9.0%", "9.5%", "10.0%"]
  const matrix = [
    [120, 125, 130, 138, 145],
    [110, 115, 120, 126, 132],
    [102, 106, 110, 115, 120],
    [95, 98, 102, 106, 110],
    [88, 92, 95, 98, 102],
  ]

  return (
    <div style={{ width: "100%", height: "200px" }}>
      <div className="flex flex-col h-full justify-center">
        <div className="flex justify-between text-[10px] text-muted-foreground mb-2 px-6">
          <span>WACC (↓)</span>
          <span>Perpetuity Growth Rate (→)</span>
        </div>
        <div className="grid grid-cols-6 gap-1.5 text-xs">
          <div className="text-muted-foreground font-medium"></div>
          {xLabels.map((label) => (
            <div key={label} className="text-center text-muted-foreground">
              {label}
            </div>
          ))}

          {matrix.map((row, i) => (
            <React.Fragment key={i}>
              <div className="flex items-center justify-end pr-2 text-muted-foreground">{yLabels[i]}</div>
              {row.map((val, j) => {
                const intensity = (val - 80) / (145 - 80)
                const isCenter = i === 2 && j === 2
                return (
                  <div
                    key={j}
                    className={`
                      h-8 rounded-lg flex items-center justify-center font-medium transition-all hover:scale-110 cursor-default
                      ${isCenter ? "ring-2 z-10" : ""}
                    `}
                    style={{
                      // 使用新的主系列颜色（亮蓝色 #038DB2）的 RGB 值
                      backgroundColor: `rgba(3, 141, 178, ${intensity * 0.8 + 0.1})`,
                      color: intensity > 0.6 ? "#fff" : ChartColorsRaw.ui.text.secondary,
                      ...(isCenter ? { ringColor: ChartColorsRaw.ui.text.primary } : {}),
                    }}
                  >
                    {val}
                  </div>
                )
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}
