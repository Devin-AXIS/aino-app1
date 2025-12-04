"use client"

import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from "recharts"
import { ChartColorsRaw } from "./chart-colors"


/**
 * 信用评分仪表盘 - 信用健康度
 * 极简半圆仪表盘设计
 */
export function CreditGauge() {
  const data = [{ name: "Score", value: 780, fill: ChartColorsRaw.series.primary }]

  return (
    <div style={{ width: "100%", height: "200px" }}>
      <div className="h-[180px] w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            innerRadius="80%"
            outerRadius="100%"
            barSize={15}
            data={data}
            startAngle={180}
            endAngle={0}
            cy="70%"
          >
            <PolarAngleAxis type="number" domain={[0, 850]} angleAxisId={0} tick={false} />
            <RadialBar background={{ fill: "hsl(var(--muted))" }} dataKey="value" cornerRadius={10} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 top-10 flex flex-col items-center justify-center pointer-events-none z-20">
          <span className="text-4xl font-black text-foreground tracking-tighter">780</span>
          <span className="text-sm font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full mt-2">
            AA+ Excellent
          </span>
        </div>
      </div>
    </div>
  )
}
