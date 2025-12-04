"use client"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts"
import { ChartColorsRaw } from "./chart-colors"


/**
 * 战略路线图 - 极简甘特图
 * 展示战略里程碑和时间规划
 */
export function StrategyRoadmap() {
  const tasks = [
    { name: "R&D Phase 1", start: 0, duration: 4, type: "tech" },
    { name: "Market Pilot", start: 3, duration: 3, type: "biz" },
    { name: "Global Scale", start: 5, duration: 7, type: "biz" },
    { name: "IPO Prep", start: 9, duration: 3, type: "fin" },
  ]

  return (
    <div style={{ width: "100%", height: "200px" }}>
      <div className="w-full space-y-2">
        <div className="h-[180px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={tasks} layout="vertical" barSize={20}>
              <XAxis type="number" hide domain={[0, 12]} />
              <YAxis
                dataKey="name"
                type="category"
                width={90}
                tick={{ fontSize: 10, fill: ChartColorsRaw.ui.text.secondary, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip cursor={{ fill: "transparent" }} content={() => null} />

              {/* 隐形占位 */}
              <Bar dataKey="start" stackId="a" fill="transparent" />

              {/* 实际进度条 */}
              <Bar dataKey="duration" stackId="a" radius={[10, 10, 10, 10]}>
                {tasks.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={
                      entry.type === "tech"
                        ? ChartColorsRaw.ui.text.primary
                        : entry.type === "biz"
                          ? ChartColorsRaw.series.primary
                          : ChartColorsRaw.series.secondary
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* 背景竖线表示季度 */}
          <div className="absolute inset-0 flex justify-between px-[90px] pointer-events-none opacity-20">
            <div className="border-r border-dashed border-muted-foreground h-full" />
            <div className="border-r border-dashed border-muted-foreground h-full" />
            <div className="border-r border-dashed border-muted-foreground h-full" />
          </div>
        </div>
        <div className="flex justify-end gap-3 px-4 text-[10px] text-muted-foreground/70 font-medium">
          <span>Q1</span>
          <span>Q2</span>
          <span>Q3</span>
          <span>Q4</span>
        </div>
      </div>
    </div>
  )
}
