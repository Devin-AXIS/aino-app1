"use client"

import { ChartColorsRaw } from "./chart-colors"


/**
 * 留存热力矩阵 - 用户留存分析
 * 使用 CSS Grid 实现热力图效果
 */
export function CohortMatrix() {
  const cohorts = [
    { month: "Jan", ret: [100, 45, 38, 32, 28] },
    { month: "Feb", ret: [100, 48, 40, 35] },
    { month: "Mar", ret: [100, 50, 42] },
    { month: "Apr", ret: [100, 52] },
    { month: "May", ret: [100] },
  ]

  const getColor = (val: number) => {
    if (val === 100) return ChartColorsRaw.ui.grid
    if (val > 50) return ChartColorsRaw.series.primary
    if (val > 35) return `${ChartColorsRaw.series.primary}40`
    return "hsl(var(--background))"
  }

  return (
    <div style={{ width: "100%", height: "200px" }}>
      <div className="w-full h-full">
      <div className="overflow-x-auto">
        <div className="min-w-[300px]">
          {/* Header */}
          <div className="flex mb-2">
            <div className="w-12 text-[10px] text-muted-foreground/70 font-bold">Month</div>
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-1 text-center text-[10px] text-muted-foreground/70 font-bold">
                M+{i}
              </div>
            ))}
          </div>
          {/* Rows */}
          {cohorts.map((row, i) => (
            <div key={i} className="flex mb-1.5 items-center">
              <div className="w-12 text-xs font-medium text-muted-foreground">{row.month}</div>
              {row.ret.map((val, j) => (
                <div key={j} className="flex-1 px-0.5">
                  <div
                    className="h-8 rounded-lg flex items-center justify-center text-[10px] font-bold text-zinc-700 dark:text-zinc-800 transition-all hover:scale-105"
                    style={{ backgroundColor: getColor(val) }}
                  >
                    {val}%
                  </div>
                </div>
              ))}
              {/* 补齐空格 */}
              {Array.from({ length: 5 - row.ret.length }).map((_, k) => (
                <div key={k} className="flex-1 px-0.5">
                  <div className="h-8 rounded-lg bg-muted/20" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  )
}
