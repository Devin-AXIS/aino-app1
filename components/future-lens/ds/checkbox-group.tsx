"use client"

import type React from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { DesignTokens } from "@/lib/future-lens/design-tokens"
import { Check } from "lucide-react"

interface CheckboxOption {
  value: string
  label: string
}

interface CheckboxGroupProps {
  label?: string
  options: CheckboxOption[]
  value?: string[]
  onChange?: (values: string[]) => void
  className?: string
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ label, options, value = [], onChange, className }) => {
  const [selectedValues, setSelectedValues] = useState<string[]>(value)

  const handleToggle = (optionValue: string) => {
    const newValues = selectedValues.includes(optionValue)
      ? selectedValues.filter((v) => v !== optionValue)
      : [...selectedValues, optionValue]

    setSelectedValues(newValues)
    onChange?.(newValues)
  }

  return (
    <div className={cn("w-full", className)}>
      {label && <label className={`block mb-2 text-[13px] ${DesignTokens.typography.caption}`}>{label}</label>}

      <div className="space-y-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => handleToggle(option.value)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 rounded-[18px] transition-all duration-200",
              "bg-muted/30 backdrop-blur-sm hover:bg-muted/50",
              selectedValues.includes(option.value) && "bg-muted ring-2 ring-primary/20",
            )}
          >
            <div
              className={cn(
                "w-4 h-4 rounded-md border-2 flex items-center justify-center transition-all",
                selectedValues.includes(option.value) ? "border-primary bg-primary" : "border-muted-foreground/30",
              )}
            >
              {selectedValues.includes(option.value) && <Check size={12} className="text-white" />}
            </div>
            <span className={`flex-1 text-left text-[15px] ${DesignTokens.typography.body}`}>{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
