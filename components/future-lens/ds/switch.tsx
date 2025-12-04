"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface SwitchProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

export function Switch({ checked, onCheckedChange, disabled, className }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "w-[44px] h-[24px] rounded-full p-1 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        checked ? "bg-primary" : "bg-slate-200 dark:bg-slate-700",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
    >
      <motion.div
        layout
        transition={{
          type: "spring",
          stiffness: 700,
          damping: 30,
        }}
        className={cn(
          "w-[16px] h-[16px] rounded-full bg-background shadow-sm pointer-events-none",
          checked ? "ml-auto" : "ml-0",
        )}
      />
    </button>
  )
}
