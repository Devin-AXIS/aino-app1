"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { DesignTokens } from "@/lib/future-lens/design-tokens"

interface MultiSelectOption {
  label: string
  value: string
  icon?: React.ReactNode
}

interface MultiSelectStepProps {
  options: MultiSelectOption[]
  onSelect?: (values: string[]) => void
  onSubmit?: (values: string[]) => void
  maxSelections?: number
}

/**
 * 多选步骤组件 - 完全独立，内部状态管理
 * 适配AI流程的视觉和交互风格
 * 选择时只更新内部状态，不立即提交，需要用户点击"下一步"按钮确认
 */
export function MultiSelectStep({ options, onSelect, onSubmit, maxSelections }: MultiSelectStepProps) {
  const [selectedValues, setSelectedValues] = useState<string[]>([])

  const handleToggle = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : maxSelections && selectedValues.length >= maxSelections
        ? selectedValues // 已达到最大选择数
        : [...selectedValues, value]

    setSelectedValues(newValues)
    // 只更新状态，不立即提交（可选：通知父组件更新数据但不切换步骤）
    onSelect?.(newValues)
  }

  return (
    <div className="w-full space-y-2">
      {options.map((option) => {
        const isSelected = selectedValues.includes(option.value)
        const isDisabled = maxSelections 
          ? !isSelected && selectedValues.length >= maxSelections 
          : false

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => handleToggle(option.value)}
            disabled={isDisabled}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
              "border-2",
              isSelected
                ? "bg-primary/10 border-primary text-foreground"
                : "bg-muted/30 border-border/50 text-muted-foreground hover:bg-muted/50 hover:border-border",
              isDisabled && "opacity-50 cursor-not-allowed",
              "active:scale-[0.98]"
            )}
            suppressHydrationWarning
          >
            {/* Checkbox */}
            <div
              className={cn(
                "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0",
                isSelected
                  ? "border-primary bg-primary"
                  : "border-muted-foreground/30 bg-transparent"
              )}
            >
              {isSelected && <Check size={14} className="text-white" strokeWidth={3} />}
            </div>

            {/* Icon */}
            {option.icon && (
              <div className={cn(
                "text-inherit opacity-80",
                isSelected && "opacity-100"
              )}>
                {option.icon}
              </div>
            )}

            {/* Label */}
            <span
              className={cn(
                DesignTokens.typography.body,
                "flex-1 text-left text-[15px] font-medium"
              )}
              suppressHydrationWarning
            >
              {option.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

