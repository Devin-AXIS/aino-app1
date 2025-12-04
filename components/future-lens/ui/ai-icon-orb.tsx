"use client"

import { cn } from "@/lib/utils"
import { Sparkles } from "lucide-react"

interface AIIconOrbProps {
  size?: number
  className?: string
}

/**
 * AI Icon Orb - 多色渐变边框 + 中间 Sparkles AI 图标
 * 多色渐变边框（蓝色到紫色），中间有 Sparkles 图标
 */
export function AIIconOrb({ size = 50, className }: AIIconOrbProps) {
  const borderWidth = 3
  const iconSize = size * 0.5
  
  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      {/* 外层渐变边框圆 */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `
            conic-gradient(
              from 0deg,
              rgba(59, 130, 246, 1) 0deg,
              rgba(99, 102, 241, 1) 90deg,
              rgba(147, 51, 234, 1) 180deg,
              rgba(168, 85, 247, 1) 270deg,
              rgba(59, 130, 246, 1) 360deg
            )
          `,
        }}
      />
      
      {/* 内层白色/透明背景，形成边框效果 */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          margin: `${borderWidth}px`,
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px) saturate(180%)",
          WebkitBackdropFilter: "blur(10px) saturate(180%)",
        }}
      />
      
      {/* 中间 AI 图标 - Sparkles */}
      <div className="relative z-10 flex items-center justify-center">
        <Sparkles
          size={iconSize}
          className="text-foreground"
          style={{
            filter: "drop-shadow(0 0 4px rgba(147, 197, 253, 0.4))",
          }}
        />
      </div>
    </div>
  )
}

