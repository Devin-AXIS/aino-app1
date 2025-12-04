import type React from "react"
import { cn } from "@/lib/utils"
import { DesignTokens } from "@/lib/future-lens/design-tokens"

/**
 * 毛玻璃面板组件，提供不同强度的玻璃态效果
 * @example
 * ```tsx
 * <GlassPanel intensity="medium">内容</GlassPanel>
 * ```
 */
interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  intensity?: "low" | "subtle" | "medium" | "high"
  className?: string
}

export const GlassPanel = ({ children, intensity = "medium", className, ...props }: GlassPanelProps) => {
  // Restoring the specific "AgenciQ" glass styles
  // low: used for cards (no glass effect)
  // medium: used for bubbles
  // high: used for nav bar

  const variants = {
    low: "bg-card border border-border/60 shadow-[0_4px_20px_-12px_rgba(0,0,0,0.06)]",
    subtle: "bg-card/80 backdrop-blur-lg border border-border/70 shadow-[0_4px_20px_-12px_rgba(0,0,0,0.08)]",
    medium: "bg-card/80 backdrop-blur-xl border border-border shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)]",
    high: "bg-card/90 backdrop-blur-2xl border border-border/80 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)]",
  }

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden transition-all duration-300",
        DesignTokens.radius.lg,
        variants[intensity],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
