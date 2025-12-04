"use client"

/**
 * SVG 滤镜效果组件 - 实现现代化毛玻璃质感的视觉效果
 * 使用统一的图表颜色系统
 */

import { ChartColorsRaw } from "./chart-colors"

export const ChartEffects = () => (
  <svg style={{ height: 0, width: 0, position: "absolute" }}>
    <defs>
      {/* 1. 极其柔和的弥散投影 (Ambient Shadow) - 使用主系列颜色 */}
      <filter id="ceramicShadow" height="200%" width="200%" x="-50%" y="-50%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="6" result="blur" />
        <feOffset in="blur" dx="0" dy="8" result="offsetBlur" />
        <feFlood floodColor="rgba(249, 115, 22, 0.15)" result="color" />
        <feComposite in="color" in2="offsetBlur" operator="in" result="shadow" />
        <feMerge>
          <feMergeNode in="shadow" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* 2. 细线条的渐变填充 (Gradient Stroke) - 使用系列颜色 */}
      <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor={ChartColorsRaw.series.primary} stopOpacity={0.8} />
        <stop offset="100%" stopColor={ChartColorsRaw.series.secondary} stopOpacity={0.8} />
      </linearGradient>

      {/* 3. 区域渐变 (Area Fill) - 极淡 - 使用主系列颜色 */}
      <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={ChartColorsRaw.series.primary} stopOpacity={0.15} />
        <stop offset="100%" stopColor={ChartColorsRaw.series.primary} stopOpacity={0} />
      </linearGradient>

      {/* 4. 蜡烛图渐变 (Candle Gradient) - 使用语义化颜色 */}
      <linearGradient id="candleUp" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={ChartColorsRaw.semantic.success} stopOpacity={0.8} />
        <stop offset="100%" stopColor={ChartColorsRaw.semantic.success} stopOpacity={0.4} />
      </linearGradient>
      <linearGradient id="candleDown" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={ChartColorsRaw.semantic.danger} stopOpacity={0.8} />
        <stop offset="100%" stopColor={ChartColorsRaw.semantic.danger} stopOpacity={0.4} />
      </linearGradient>
    </defs>
  </svg>
)
