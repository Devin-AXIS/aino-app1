"use client"

import { ChartColorsRaw } from "./chart-colors"


/**
 * 杜邦分析拆解 - ROE 驱动因素
 * 横向条形图拆解：ROE = Net Margin × Asset Turnover × Leverage
 */
export function DupontBreakdown() {
  const data = [
    { name: "Net Margin", value: 18.5, benchmark: 15, unit: "%" },
    { name: "Asset Turn.", value: 0.85, benchmark: 0.9, unit: "x" },
    { name: "Fin. Lev.", value: 2.1, benchmark: 2.0, unit: "x" },
  ]

  return (
    <div style={{ width: "100%", height: "200px" }}>
      <div className="w-full space-y-2">
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-3xl font-light text-foreground">33.0%</span>
          <span className="text-xs font-bold text-muted-foreground/70 uppercase tracking-wider">Return on Equity</span>
        </div>
        <div className="space-y-5">
          {data.map((item, idx) => (
            <div key={idx}>
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span className="text-muted-foreground">{item.name}</span>
                <span className="text-foreground font-bold">
                  {item.value}
                  {item.unit}{" "}
                  <span className="text-muted-foreground/50 font-normal">
                    / {item.benchmark}
                    {item.unit}
                  </span>
                </span>
              </div>
              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                {/* 实际值 */}
                <div
                  className="absolute top-0 left-0 h-full rounded-full"
                  style={{
                    width: `${(item.value / (item.value * 1.5)) * 100}%`,
                    backgroundColor: ChartColorsRaw.ui.text.primary,
                  }}
                />
                {/* 标杆值 (Marker) */}
                <div
                  className="absolute top-0 w-1 h-full z-10"
                  style={{
                    left: `${(item.benchmark / (item.value * 1.5)) * 100}%`,
                    backgroundColor: ChartColorsRaw.series.primary,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export { DupontBreakdown as DuPontBreakdown }
