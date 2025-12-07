"use client"

import React from "react"
import { ChartColorsRaw } from "./chart-colors"
import { ChartDefaults } from "./chart-config"
import { fSize } from "@/lib/future-lens/config-context"
import { GlassPanel } from "../ds/glass-panel"
import type { ChartDataPoint } from "@/lib/future-lens/types/chart-types"

/**
 * Venn Diagram 数据点类型
 */
export interface VennDiagramPoint {
  /** 点的编号 */
  id: number
  /** 点的标题 */
  title: string
  /** 点的描述 */
  description: string
  /** 所属的圆圈（'left' | 'right'） */
  circle: "left" | "right"
}

/**
 * Venn Diagram 组件 Props
 */
export interface VennDiagramProps {
  /** 左侧圆圈的数据点 */
  leftPoints?: VennDiagramPoint[]
  /** 右侧圆圈的数据点 */
  rightPoints?: VennDiagramPoint[]
  /** 左侧圆圈标签 */
  leftLabel?: string
  /** 右侧圆圈标签 */
  rightLabel?: string
  /** 重叠区域标签 */
  overlapLabel?: string
  /** 图表高度 */
  height?: number
  /** 图表标题 */
  title?: string
  /** 副标题 */
  subtitle?: string
}

/**
 * Venn Diagram 组件
 * 用于展示两个集合的关系和重叠部分
 * 
 * @example
 * ```tsx
 * <VennDiagram
 *   leftPoints={[
 *     { id: 1, title: "优势", description: "我们的核心竞争优势", circle: "left" },
 *     { id: 2, title: "机会", description: "市场增长机会", circle: "left" },
 *   ]}
 *   rightPoints={[
 *     { id: 1, title: "挑战", description: "面临的主要挑战", circle: "right" },
 *     { id: 2, title: "风险", description: "潜在风险因素", circle: "right" },
 *   ]}
 *   leftLabel="优势"
 *   rightLabel="挑战"
 *   overlapLabel="平衡点"
 * />
 * ```
 */
export function VennDiagram({
  leftPoints = [],
  rightPoints = [],
  leftLabel = "集合 A",
  rightLabel = "集合 B",
  overlapLabel = "交集",
  height = ChartDefaults.height + 100,
  title,
  subtitle,
}: VennDiagramProps) {
  // 圆圈配置
  const centerX = 400
  const centerY = height / 2
  const radius = 140
  const circleDistance = 100 // 两个圆心之间的距离

  // 左侧圆圈中心
  const leftCenterX = centerX - circleDistance / 2
  const leftCenterY = centerY

  // 右侧圆圈中心
  const rightCenterX = centerX + circleDistance / 2
  const rightCenterY = centerY

  // 颜色配置
  const leftColor = ChartColorsRaw.series.quinary // 橙色
  const rightColor = ChartColorsRaw.series.quaternary // 粉红色（接近紫色）
  const overlapColor = ChartColorsRaw.series.tertiary // 深蓝色（重叠区域）

  // 点的位置计算
  const getPointPosition = (index: number, total: number, circle: "left" | "right") => {
    const angleStep = Math.PI / (total + 1)
    const startAngle = Math.PI / 2 - (angleStep * total) / 2
    const angle = startAngle + angleStep * (index + 1)
    
    const distance = 200 // 点到圆心的距离
    const centerX = circle === "left" ? leftCenterX : rightCenterX
    const centerY = circle === "left" ? leftCenterY : rightCenterY
    
    const x = centerX + Math.cos(angle) * distance
    const y = centerY + Math.sin(angle) * distance
    
    return { x, y, angle }
  }

  return (
    <div style={{ width: "100%", height: `${height}px`, position: "relative" }}>
      <GlassPanel intensity="medium" className="w-full h-full p-6">
        {/* 标题 */}
        {title && (
          <div className="mb-4">
            <h3 style={{ fontSize: fSize(ChartDefaults.fontSize.title), fontWeight: 600, color: ChartColorsRaw.ui.text.primary }}>
              {title}
            </h3>
            {subtitle && (
              <p style={{ fontSize: fSize(ChartDefaults.fontSize.axis), color: ChartColorsRaw.ui.text.secondary, marginTop: 4 }}>
                {subtitle}
              </p>
            )}
          </div>
        )}

        <svg width="100%" height={height - (title ? 60 : 0)} viewBox={`0 0 800 ${height - (title ? 60 : 0)}`}>
          <defs>
            {/* 左侧圆圈渐变 */}
            <linearGradient id="leftCircleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={leftColor} stopOpacity={0.15} />
              <stop offset="100%" stopColor={leftColor} stopOpacity={0.05} />
            </linearGradient>

            {/* 右侧圆圈渐变 */}
            <linearGradient id="rightCircleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={rightColor} stopOpacity={0.15} />
              <stop offset="100%" stopColor={rightColor} stopOpacity={0.05} />
            </linearGradient>

            {/* 重叠区域渐变 */}
            <linearGradient id="overlapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={overlapColor} stopOpacity={0.25} />
              <stop offset="100%" stopColor={overlapColor} stopOpacity={0.1} />
            </linearGradient>
          </defs>

          {/* 左侧圆圈 */}
          <circle
            cx={leftCenterX}
            cy={leftCenterY}
            r={radius}
            fill="url(#leftCircleGradient)"
            stroke={leftColor}
            strokeWidth={2}
            strokeOpacity={0.6}
          />

          {/* 右侧圆圈 */}
          <circle
            cx={rightCenterX}
            cy={rightCenterY}
            r={radius}
            fill="url(#rightCircleGradient)"
            stroke={rightColor}
            strokeWidth={2}
            strokeOpacity={0.6}
          />

          {/* 重叠区域（使用 clipPath） */}
          <defs>
            <clipPath id="leftCircleClip">
              <circle cx={leftCenterX} cy={leftCenterY} r={radius} />
            </clipPath>
            <clipPath id="rightCircleClip">
              <circle cx={rightCenterX} cy={rightCenterY} r={radius} />
            </clipPath>
          </defs>
          <g clipPath="url(#leftCircleClip)">
            <circle
              cx={rightCenterX}
              cy={rightCenterY}
              r={radius}
              fill="url(#overlapGradient)"
              stroke={overlapColor}
              strokeWidth={2}
              strokeOpacity={0.4}
            />
          </g>

          {/* 圆圈标签 */}
          <text
            x={leftCenterX}
            y={leftCenterY}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{
              fontSize: fSize(ChartDefaults.fontSize.axis),
              fontWeight: 600,
              fill: ChartColorsRaw.ui.text.primary,
            }}
          >
            {leftLabel}
          </text>

          <text
            x={rightCenterX}
            y={rightCenterY}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{
              fontSize: fSize(ChartDefaults.fontSize.axis),
              fontWeight: 600,
              fill: ChartColorsRaw.ui.text.primary,
            }}
          >
            {rightLabel}
          </text>

          <text
            x={centerX}
            y={centerY}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{
              fontSize: fSize(ChartDefaults.fontSize.axis),
              fontWeight: 600,
              fill: ChartColorsRaw.ui.text.secondary,
            }}
          >
            {overlapLabel}
          </text>

          {/* 左侧点 */}
          {leftPoints.map((point, index) => {
            const pos = getPointPosition(index, leftPoints.length, "left")
            return (
              <g key={`left-${point.id}`}>
                {/* 连接线 */}
                <line
                  x1={pos.x}
                  y1={pos.y}
                  x2={leftCenterX + Math.cos(pos.angle) * radius}
                  y2={leftCenterY + Math.sin(pos.angle) * radius}
                  stroke={leftColor}
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  strokeOpacity={0.4}
                />
                {/* 点 */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={14}
                  fill={leftColor}
                  stroke={ChartColorsRaw.ui.background}
                  strokeWidth={2}
                />
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{
                    fontSize: fSize(10),
                    fontWeight: 600,
                    fill: ChartColorsRaw.ui.background,
                  }}
                >
                  {point.id}
                </text>
                {/* 文本 */}
                <foreignObject
                  x={pos.x < leftCenterX ? pos.x - 180 : pos.x + 20}
                  y={pos.y - 30}
                  width={160}
                  height={60}
                >
                  <div
                    style={{
                      fontSize: fSize(ChartDefaults.fontSize.axis),
                      fontWeight: 600,
                      color: ChartColorsRaw.ui.text.primary,
                      marginBottom: 4,
                    }}
                  >
                    {point.title}
                  </div>
                  <div
                    style={{
                      fontSize: fSize(ChartDefaults.fontSize.legend),
                      color: ChartColorsRaw.ui.text.secondary,
                      lineHeight: 1.4,
                    }}
                  >
                    {point.description}
                  </div>
                </foreignObject>
              </g>
            )
          })}

          {/* 右侧点 */}
          {rightPoints.map((point, index) => {
            const pos = getPointPosition(index, rightPoints.length, "right")
            return (
              <g key={`right-${point.id}`}>
                {/* 连接线 */}
                <line
                  x1={pos.x}
                  y1={pos.y}
                  x2={rightCenterX + Math.cos(pos.angle) * radius}
                  y2={rightCenterY + Math.sin(pos.angle) * radius}
                  stroke={rightColor}
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  strokeOpacity={0.4}
                />
                {/* 点 */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={14}
                  fill={rightColor}
                  stroke={ChartColorsRaw.ui.background}
                  strokeWidth={2}
                />
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{
                    fontSize: fSize(10),
                    fontWeight: 600,
                    fill: ChartColorsRaw.ui.background,
                  }}
                >
                  {point.id}
                </text>
                {/* 文本 */}
                <foreignObject
                  x={pos.x < rightCenterX ? pos.x - 180 : pos.x + 20}
                  y={pos.y - 30}
                  width={160}
                  height={60}
                >
                  <div
                    style={{
                      fontSize: fSize(ChartDefaults.fontSize.axis),
                      fontWeight: 600,
                      color: ChartColorsRaw.ui.text.primary,
                      marginBottom: 4,
                    }}
                  >
                    {point.title}
                  </div>
                  <div
                    style={{
                      fontSize: fSize(ChartDefaults.fontSize.legend),
                      color: ChartColorsRaw.ui.text.secondary,
                      lineHeight: 1.4,
                    }}
                  >
                    {point.description}
                  </div>
                </foreignObject>
              </g>
            )
          })}
        </svg>
      </GlassPanel>
    </div>
  )
}

