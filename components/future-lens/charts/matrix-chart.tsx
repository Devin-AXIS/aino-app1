"use client"

import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, ResponsiveContainer, Tooltip, Cell } from "recharts"
import React from "react"
import { ChartColorsRaw } from "./chart-colors"


type MatrixType = "bcg" | "swot" | "correlation"

interface BCGData {
  x: number
  y: number
  z: number
  name: string
  label: string
}

interface SWOTData {
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
  threats: string[]
}

interface CorrelationData {
  assets: string[]
  corr: number[][]
}

interface MatrixChartProps {
  type?: MatrixType
  data?: BCGData[] | SWOTData | CorrelationData
  height?: number
}

/**
 * 矩阵图 - 支持BCG/SWOT/相关性分析
 * @example <MatrixChart type="bcg" data={[{x: 80, y: 90, z: 500, name: "Stars", label: "AI"}]} />
 */
export function MatrixChart({ type = "bcg", data, height = 240 }: MatrixChartProps) {
  if (type === "bcg") {
    const bcgData = (data as BCGData[]) || [
      { x: 80, y: 90, z: 500, name: "Stars", label: "AI Chips" },
      { x: 20, y: 80, z: 300, name: "Question", label: "Robotics" },
      { x: 85, y: 20, z: 800, name: "Cash Cows", label: "Cloud" },
      { x: 15, y: 15, z: 200, name: "Dogs", label: "Legacy HW" },
    ]

    return (
      <div style={{ width: "100%", height: "200px" }}>
        <div className="h-full w-full relative">
          {/* 背景四象限 */}
          <div className="absolute inset-4 grid grid-cols-2 grid-rows-2 gap-1 pointer-events-none">
            <div className="rounded-tl-[20px]" style={{ backgroundColor: `${ChartColorsRaw.series.primary}10` }} />
            <div className="bg-muted/30 rounded-tr-[20px]" />
            <div className="bg-muted/30 rounded-bl-[20px]" />
            <div className="bg-muted/50 rounded-br-[20px]" />
          </div>

          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <XAxis type="number" dataKey="x" hide domain={[0, 100]} />
              <YAxis type="number" dataKey="y" hide domain={[0, 100]} />
              <ZAxis type="number" dataKey="z" range={[400, 2000]} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-card px-3 py-2 rounded-lg shadow-lg text-xs border" style={{ borderColor: ChartColorsRaw.ui.grid }}>
                        <p className="font-bold mb-1" style={{ color: ChartColorsRaw.ui.text.primary }}>{payload[0].payload.label}</p>
                        <p className="text-muted-foreground">市场份额: {payload[0].value}%</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Scatter name="Products" data={bcgData}>
                {bcgData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? ChartColorsRaw.series.primary : index === 2 ? ChartColorsRaw.series.quinary : ChartColorsRaw.ui.grid}
                    stroke="hsl(var(--background))"
                    strokeWidth={3}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>

          {/* 象限标签 */}
          <div className="absolute top-6 left-6 text-[10px] font-bold uppercase tracking-widest" style={{ color: ChartColorsRaw.ui.text.muted }}>
            明星产品
          </div>
          <div className="absolute top-6 right-6 text-[10px] font-bold uppercase tracking-widest" style={{ color: ChartColorsRaw.ui.text.muted }}>
            问题产品
          </div>
          <div className="absolute bottom-6 left-6 text-[10px] font-bold uppercase tracking-widest" style={{ color: ChartColorsRaw.ui.text.muted }}>
            现金牛
          </div>
          <div className="absolute bottom-6 right-6 text-[10px] font-bold uppercase tracking-widest" style={{ color: ChartColorsRaw.ui.text.muted }}>
            瘦狗产品
          </div>
        </div>
      </div>
    )
  }

  if (type === "swot") {
    const swotData = (data as SWOTData) || {
      strengths: ["强大品牌", "技术领先", "高利润率"],
      weaknesses: ["规模有限", "成本高", "增长慢"],
      opportunities: ["AI应用", "新市场", "合作伙伴"],
      threats: ["竞争", "监管", "经济下行"],
    }

    const quadrants = [
      {
        title: "优势",
        items: swotData.strengths,
        bg: `${ChartColorsRaw.series.primary}10`,
        border: `${ChartColorsRaw.series.primary}30`,
        icon: "💪",
      },
      {
        title: "劣势",
        items: swotData.weaknesses,
        bg: "bg-muted/30",
        border: "border-border/50",
        icon: "⚠️",
      },
      {
        title: "机会",
        items: swotData.opportunities,
        bg: `${ChartColorsRaw.series.quinary}10`,
        border: `${ChartColorsRaw.series.quinary}30`,
        icon: "🎯",
      },
      {
        title: "威胁",
        items: swotData.threats,
        bg: "bg-muted/50",
        border: "border-border/50",
        icon: "⚡",
      },
    ]

    return (
      <div style={{ width: "100%", height: "200px" }}>
        <div className="grid grid-cols-2 gap-3 h-full">
          {quadrants.map((quadrant, index) => (
            <div
              key={index}
              className="border rounded-2xl p-4 transition-all hover:shadow-md"
              style={{ backgroundColor: quadrant.bg, borderColor: quadrant.border }}
            >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">{quadrant.icon}</span>
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wide">{quadrant.title}</h4>
            </div>
            <ul className="space-y-2">
              {quadrant.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start gap-2">
                  <span className="text-[10px] text-muted-foreground mt-0.5">•</span>
                  <span className="text-[11px] text-muted-foreground leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
        </div>
      </div>
    )
  }

  if (type === "correlation") {
    const corrData = (data as CorrelationData) || {
      assets: ["BTC", "ETH", "SPX", "GLD"],
      corr: [
        [1.0, 0.85, 0.4, 0.1],
        [0.85, 1.0, 0.45, 0.15],
        [0.4, 0.45, 1.0, -0.2],
        [0.1, 0.15, -0.2, 1.0],
      ],
    }

    return (
      <div className="flex flex-col h-[200px] justify-center items-center">
        <div className="grid grid-cols-5 gap-2 text-xs">
          <div className="w-8"></div>
          {corrData.assets.map((a) => (
            <div key={a} className="w-8 text-center text-muted-foreground font-bold">
              {a}
            </div>
          ))}

          {corrData.assets.map((rowAsset, i) => (
            <React.Fragment key={i}>
              <div className="w-8 text-right pr-2 text-muted-foreground font-bold self-center">{rowAsset}</div>
              {corrData.corr[i].map((val, j) => (
                <div
                  key={`${i}-${j}`}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-medium transition-transform hover:scale-110"
                  style={{
                    backgroundColor: val === 1 ? ChartColorsRaw.ui.grid : val > 0.5 ? ChartColorsRaw.series.primary : "#fff",
                    opacity: val === 1 ? 1 : Math.abs(val) + 0.2,
                    color: val > 0.5 && val !== 1 ? "#fff" : ChartColorsRaw.ui.text.secondary,
                  }}
                >
                  {val === 1 ? "-" : val}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    )
  }

  return null
}
