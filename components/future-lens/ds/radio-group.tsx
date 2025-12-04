"use client"

import type React from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { DesignTokens } from "@/lib/future-lens/design-tokens"

interface RadioOption {
  value: string
  label: string
}

interface RadioGroupProps {
  label?: string
  options: RadioOption[]
  value?: string
  onChange?: (value: string) => void
  className?: string
}

export const RadioGroup: React.FC<RadioGroupProps> = ({ label, options, value, onChange, className }) => {
  const [selectedValue, setSelectedValue] = useState(value || "")

  const handleSelect = (optionValue: string) => {
    setSelectedValue(optionValue)
    onChange?.(optionValue)
  }

  return (
    <div className={cn("w-full", className)}>
      {label && <label className={`block mb-2 text-[13px] ${DesignTokens.typography.caption}`}>{label}</label>}

      <div className="space-y-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => handleSelect(option.value)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 rounded-[18px] transition-all duration-200",
              "bg-muted/30 backdrop-blur-sm hover:bg-muted/50",
              selectedValue === option.value && "bg-muted ring-2 ring-primary/20",
            )}
          >
            <div
              className={cn(
                "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all",
                selectedValue === option.value ? "border-primary bg-primary" : "border-muted-foreground/30",
              )}
            >
              {selectedValue === option.value && <div className="w-2 h-2 rounded-full bg-background" />}
            </div>
            <span className={`flex-1 text-left text-[15px] ${DesignTokens.typography.body}`}>{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
