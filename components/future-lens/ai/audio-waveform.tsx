"use client"

import { cn } from "@/lib/utils"

interface AudioWaveformProps {
  isActive?: boolean
  className?: string
}

/**
 * 极简音频波形指示器 - 纯CSS动画，性能优化
 * 设计：9个元素，对称波形，中间高两边低，垂直居中对齐
 */
export function AudioWaveform({ isActive = false, className }: AudioWaveformProps) {
  // 9个元素的高度映射：两边短，中间高，对称
  const heightMap = [0.5, 0.75, 1, 1.25, 1.5, 1.25, 1, 0.75, 0.5] // rem单位
  
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-0.5 h-5",
        className
      )}
      suppressHydrationWarning
    >
      {heightMap.map((height, index) => {
        const isDot = index === 2 || index === 6 // 第3个和第7个是圆点
        const isShort = height <= 0.75 // 短的元素
        
        return (
          <div
            key={index}
            className={cn(
              "rounded-full bg-foreground/80 transition-all duration-300",
              isDot 
                ? "w-1 h-1" // 圆点
                : "w-0.5", // 竖条宽度
              isActive && `animate-waveform-${index + 1}`
            )}
            style={{
              height: isDot ? undefined : `${height * 0.75}rem`, // 竖条高度：6px, 9px, 12px, 15px, 18px, 15px, 12px, 9px, 6px
            }}
            suppressHydrationWarning
          />
        )
      })}
    </div>
  )
}

