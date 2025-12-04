"use client"

import { useState } from "react"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"
import { DesignTokens } from "@/lib/future-lens/design-tokens"
import { ChartColors, ChartColorsRaw } from "./chart-colors"
import { UnifiedTooltip } from "./unified-tooltip"

export interface ScrollableMomentumData {
  m: string
  growth: number
  cap: number
  heat: number
}

export interface ScrollableMomentumChartProps {
  data: ScrollableMomentumData[]
  height?: number
  pointWidth?: number // 每个数据点的宽度，默认80px
  onLineToggle?: (lineKey: "growth" | "cap" | "heat", visible: boolean) => void
}

/**
 * 可滚动动量图 - 支持图例切换的多线图表
 * @example <ScrollableMomentumChart data={[{m: "Jan", growth: 20, cap: 15, heat: 10}]} />
 */
export function ScrollableMomentumChart({
  data,
  height = 160,
  pointWidth = 80,
  onLineToggle,
}: ScrollableMomentumChartProps) {
  // 控制哪些线可见
  const [visibleLines, setVisibleLines] = useState({
    growth: true,
    cap: true,
    heat: true,
  })

  // 切换线的可见性
  const toggleLine = (lineKey: "growth" | "cap" | "heat") => {
    const newVisible = !visibleLines[lineKey]
    setVisibleLines((prev) => ({
      ...prev,
      [lineKey]: newVisible,
    }))
    onLineToggle?.(lineKey, newVisible)
  }

  // 动态计算宽度
  const chartWidth = data.length * pointWidth

  return (
    <div className="w-full">
      {/* Chart Header with Legend */}
      <div className="flex justify-between items-center px-3 pt-3 mb-1">
        <span
          className={`${DesignTokens.text.secondary} font-bold uppercase tracking-wider`}
          style={{ fontSize: "9px" }}
        >
          12-Month Momentum
        </span>
        <div className="flex gap-1.5">
          <button
            onClick={() => toggleLine("growth")}
            className="flex items-center gap-1 cursor-pointer transition-opacity hover:opacity-80 active:scale-95"
            style={{ opacity: visibleLines.growth ? 1 : 0.3 }}
          >
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: ChartColorsRaw.context.growth }} />
            <span className={`${DesignTokens.text.secondary} font-bold`} style={{ fontSize: "10px" }}>
              增长
            </span>
          </button>
          <button
            onClick={() => toggleLine("cap")}
            className="flex items-center gap-1 cursor-pointer transition-opacity hover:opacity-80 active:scale-95"
            style={{ opacity: visibleLines.cap ? 1 : 0.3 }}
          >
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: ChartColorsRaw.context.capital }} />
            <span className={`${DesignTokens.text.secondary} font-bold`} style={{ fontSize: "10px" }}>
              资本
            </span>
          </button>
          <button
            onClick={() => toggleLine("heat")}
            className="flex items-center gap-1 cursor-pointer transition-opacity hover:opacity-80 active:scale-95"
            style={{ opacity: visibleLines.heat ? 1 : 0.3 }}
          >
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: ChartColorsRaw.context.heat }} />
            <span className={`${DesignTokens.text.secondary} font-bold`} style={{ fontSize: "10px" }}>
              热度
            </span>
          </button>
        </div>
      </div>

      {/* Chart Container */}
      <div className="flex h-[160px] relative">
        {/* Left: Fixed Y-Axis */}
        <div
          className={`w-8 h-full flex flex-col justify-between items-end pr-2 py-3 ${DesignTokens.text.secondary} font-bold select-none z-20`}
          style={{
            fontSize: "9px",
            background: "linear-gradient(to right, rgba(248, 250, 252, 0.9), transparent)",
          }}
        >
          <span>100</span>
          <span>75</span>
          <span>50</span>
          <span>25</span>
          <span>0</span>
        </div>

        {/* Right: Scrollable Area */}
        <div className="flex-1 relative overflow-hidden rounded-xl">
          {/* Left Fade Mask */}
          <div
            className="absolute left-0 top-0 bottom-0 w-6 z-10 pointer-events-none"
            style={{
              background: "linear-gradient(to right, rgba(248, 250, 252, 0.9), transparent)",
            }}
          />
          {/* Right Fade Mask */}
          <div
            className="absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
            style={{
              background: "linear-gradient(to left, rgba(248, 250, 252, 0.9), transparent)",
            }}
          />

          <div className="overflow-x-auto scrollbar-hide h-full pr-12">
            <div style={{ width: `${chartWidth}px`, height: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    {visibleLines.growth && (
                      <linearGradient id="gGrowth" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={ChartColorsRaw.context.growth} stopOpacity={0.2} />
                        <stop offset="100%" stopColor={ChartColorsRaw.context.growth} stopOpacity={0} />
                      </linearGradient>
                    )}
                    {visibleLines.cap && (
                      <linearGradient id="gCap" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={ChartColorsRaw.context.capital} stopOpacity={0.2} />
                        <stop offset="100%" stopColor={ChartColorsRaw.context.capital} stopOpacity={0} />
                      </linearGradient>
                    )}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={ChartColorsRaw.ui.grid} />
                  <XAxis
                    dataKey="m"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 600 }}
                    dy={10}
                    padding={{ left: 0, right: 0 }}
                  />
                  <Tooltip
                    content={<UnifiedTooltip />}
                    cursor={{ stroke: "#94a3b8", strokeWidth: 1, strokeDasharray: "4 4" }}
                  />

                  {/* Growth - 使用 context.growth 颜色 */}
                  {visibleLines.growth && (
                    <Area
                      type="monotone"
                      dataKey="growth"
                      stroke={ChartColorsRaw.context.growth}
                      strokeWidth={3}
                      fill="url(#gGrowth)"
                      activeDot={{ r: 5, strokeWidth: 0, fill: ChartColorsRaw.context.growth }}
                    />
                  )}

                  {/* Capital - 使用 context.capital 颜色 */}
                  {visibleLines.cap && (
                    <Area
                      type="monotone"
                      dataKey="cap"
                      stroke={ChartColorsRaw.context.capital}
                      strokeWidth={3}
                      fill="url(#gCap)"
                      activeDot={{ r: 5, strokeWidth: 0, fill: ChartColorsRaw.context.capital }}
                    />
                  )}

                  {/* Heat - 使用 context.heat 颜色 */}
                  {visibleLines.heat && (
                    <Line
                      type="monotone"
                      dataKey="heat"
                      stroke={ChartColorsRaw.context.heat}
                      strokeWidth={2}
                      dot={false}
                      strokeDasharray="4 4"
                      activeDot={{ r: 4, strokeWidth: 0, fill: ChartColorsRaw.context.heat }}
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}

