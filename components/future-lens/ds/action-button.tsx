"use client"

import type React from "react"
import { Button as V0Button, buttonVariants } from "@/components/ui/button"
import type { VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

// 【代理层模式 - 按钮】
// 优先使用你的样式，底层复用 v0 的交互逻辑

/**
 * 操作按钮组件，支持图标、标签和发光效果
 * @example
 * ```tsx
 * <ActionButton icon={Plus} label="添加" glow />
 * ```
 */
type ButtonProps = React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }

interface ActionButtonProps extends Omit<ButtonProps, "children"> {
  icon?: LucideIcon
  label?: string
  glow?: boolean
  children?: React.ReactNode
}

export function ActionButton({
  className,
  glow,
  variant = "default",
  icon: Icon,
  label,
  children,
  onClick,
  ...props
}: ActionButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log("[v0] ActionButton clicked", { label, hasOnClick: !!onClick })
    onClick?.(e)
  }

  return (
    <V0Button
      className={cn(
        "rounded-full font-medium tracking-wide transition-transform active:scale-95",
        "bg-card/70 backdrop-blur-xl border border-border/50 text-foreground",
        // 自定义发光效果
        glow && "shadow-[0_0_20px_-5px_rgba(0,0,0,0.3)] hover:shadow-[0_0_25px_-5px_rgba(0,0,0,0.4)]",
        className,
      )}
      variant={variant}
      onClick={handleClick}
      {...props}
    >
      {Icon && <Icon size={16} className="mr-2" />}
      {label || children}
    </V0Button>
  )
}
