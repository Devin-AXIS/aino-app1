"use client"

import { cn } from "@/lib/utils"

export type LiquidOrbStatus = "idle" | "breathing" | "thinking" | "speaking" | "processing"

interface LiquidOrbProps {
  status: LiquidOrbStatus
  className?: string
}

/**
 * 液态光球组件 - 根据状态显示不同的动画效果
 * - idle: 正常状态，轻微呼吸
 * - breathing: 呼吸状态，缓慢放大缩小
 * - thinking: 思考状态，缩小并旋转（更明显的效果）
 * - speaking: 说话状态，放大（更明显的效果）
 * - processing: 处理状态，快速旋转并缩小
 */
export function LiquidOrb({ status, className }: LiquidOrbProps) {
  return (
    <div
      data-liquid-orb
      className={cn(
        // 参考代码：只保留必要的布局样式，移除 z-10 和 contain
        // 再缩小 5%：247*0.95=235, 285*0.95=271, 428*0.95=407
        "relative w-[235px] h-[235px] sm:w-[271px] sm:h-[271px] md:w-[407px] md:h-[407px] max-h-[27vh] max-w-[27vh] mb-4 sm:mb-8 shrink-0 flex items-center justify-center",
        className,
      )}
      suppressHydrationWarning
    >
      <div
        className={cn(
          "relative w-full h-full transition-all duration-1000 ease-spring",
          // processing: 处理状态，更明显的旋转和缩小（增强版）
          status === "processing" && "scale-75 rotate-[360deg] animate-processing-orb",
          // speaking: 说话状态，放大（保持原样）
          status === "speaking" && "scale-110",
          // idle: 输入状态，使用轻微的呼吸动画
          status === "idle" && "scale-100 animate-idle-breathe",
          // breathing: 默认呼吸状态（保持原样）
          status === "breathing" && "scale-100",
          // thinking: 思考状态（保持原样）
          status === "thinking" && "scale-100",
        )}
        style={{
          // 恢复原始模糊效果，保持视觉效果
          filter: status === "idle" 
            ? "blur(20px) contrast(160%) brightness(1.2) saturate(130%)" // 保持与其他状态一致的视觉效果
            : "blur(20px) contrast(160%) brightness(1.2) saturate(130%)", // 原始效果
          mixBlendMode: "multiply",
          // 性能优化：使用 GPU 加速
          willChange: status === "processing" ? "transform" : status === "idle" ? "auto" : "transform",
          transform: status === "processing" ? "translateZ(0)" : status === "idle" ? undefined : "translateZ(0)",
          // 确保内层 div 也没有边框 - 使用所有可能的属性
          border: "none",
          outline: "none",
          boxShadow: "none",
          backgroundColor: "transparent",
          borderWidth: "0",
          borderStyle: "none",
          borderColor: "transparent",
          borderTop: "none",
          borderRight: "none",
          borderBottom: "none",
          borderLeft: "none",
          borderImage: "none",
          borderRadius: "0",
        } as React.CSSProperties}
        suppressHydrationWarning
      >
        {/* 三个液态球体 - 参考代码：使用 rounded-full 作为初始状态，动画会覆盖为有机形状 */}
        <div
          className={cn(
            "absolute top-[10%] left-[15%] w-[60%] h-[60%] bg-gradient-to-r from-cyan-300 to-blue-500 rounded-full opacity-90 mix-blend-multiply",
            status === "idle" ? "animate-morph-slow" : "animate-morph-slow",
          )}
          suppressHydrationWarning
        />
        <div
          className={cn(
            "absolute bottom-[10%] right-[15%] w-[60%] h-[60%] bg-gradient-to-l from-purple-300 to-pink-500 rounded-full animation-delay-2000 opacity-90 mix-blend-multiply",
            status === "idle" ? "animate-morph-slow" : "animate-morph-medium",
          )}
          suppressHydrationWarning
        />
        <div
          className={cn(
            "absolute top-[30%] left-[30%] w-[50%] h-[50%] bg-gradient-to-tr from-yellow-200 to-orange-400 rounded-full animation-delay-4000 opacity-90 mix-blend-multiply",
            status === "idle" ? "animate-morph-slow" : "animate-morph-fast",
          )}
          suppressHydrationWarning
        />
      </div>
      {/* 噪点纹理 - 参考代码：简化样式 */}
      <div
        className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none mix-blend-overlay"
        suppressHydrationWarning
      />
      {/* 动画样式已移到 globals.css，这里不需要了 */}
    </div>
  )
}

