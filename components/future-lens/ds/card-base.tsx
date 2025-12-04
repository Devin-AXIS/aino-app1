"use client"

import type React from "react"
import { MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { GlassPanel } from "./glass-panel"
import { DesignTokens } from "@/lib/future-lens/design-tokens"

/**
 * 基础卡片组件，提供统一的卡片样式和交互
 * @example
 * ```tsx
 * <CardBase variant="default" title="标题" subtitle="副标题">
 *   内容
 * </CardBase>
 * ```
 */
interface CardBaseProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  variant?: "default" | "success" | "warning" | "error" | "info"
  title?: string
  subtitle?: string
  icon?: React.ComponentType<{ size?: number; strokeWidth?: number }>
  action?: React.ReactNode
}

export const CardBase = ({
  children,
  className,
  onClick,
  variant = "default",
  title,
  subtitle,
  icon: Icon,
  action,
  ...props
}: CardBaseProps) => {
  const variantStyles = {
    default: "hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.1)]",
    success:
      "shadow-[0_0_30px_-10px_rgba(16,185,129,0.15)] border-success/30 bg-success/5 hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.25)] hover:border-success/50",
    warning:
      "shadow-[0_0_30px_-10px_rgba(245,158,11,0.15)] border-warning/30 bg-warning/5 hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.25)] hover:border-warning/50",
    error:
      "shadow-[0_0_30px_-10px_rgba(244,63,94,0.15)] border-destructive/30 bg-destructive/5 hover:shadow-[0_0_30px_-5px_rgba(244,63,94,0.25)] hover:border-destructive/50",
    info: "shadow-[0_0_30px_-10px_rgba(59,130,246,0.15)] border-info/30 bg-info/5 hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.25)] hover:border-info/50",
  }

  return (
    <GlassPanel
      intensity="subtle"
      className={cn("rounded-[16px] p-3 mb-2 group transition-all duration-500", variantStyles[variant], className)}
      onClick={onClick}
      {...props}
    >
      {(title || subtitle || Icon) && (
        <div className="flex justify-between items-start mb-3">
          <div className="flex gap-2.5 items-center">
            {Icon && (
              <div className="p-2 rounded-2xl bg-muted/30 text-muted-foreground">
                <Icon size={18} strokeWidth={1.5} />
              </div>
            )}
            <div>
              {title && <h3 className={cn(DesignTokens.typography.title, "text-[15px] leading-none mb-1")}>{title}</h3>}
              {subtitle && <p className={cn(DesignTokens.typography.caption, "text-[12px] font-medium")}>{subtitle}</p>}
            </div>
          </div>
          {action ||
            ((title || subtitle || Icon) && (
              <button className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-muted/50 text-muted-foreground/50 transition-colors">
                <MoreHorizontal size={18} />
              </button>
            ))}
        </div>
      )}

      {children}
    </GlassPanel>
  )
}
