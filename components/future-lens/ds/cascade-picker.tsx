"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { DesignTokens } from "@/lib/future-lens/design-tokens"
import { ModalDialog } from "./modal-dialog"

export interface CascadeOption {
  value: string
  label: string
  children?: CascadeOption[]
}

interface CascadePickerProps {
  value?: string[]
  onChange?: (value: string[]) => void
  options: CascadeOption[]
  placeholder?: string
  label?: string
  error?: string
  className?: string
}

export function CascadePicker({
  value = [],
  onChange,
  options,
  placeholder = "请选择",
  label,
  error,
  className,
}: CascadePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentLevel, setCurrentLevel] = useState(0)
  const [selectedPath, setSelectedPath] = useState<string[]>(value)

  // Get display text
  const getDisplayText = () => {
    if (selectedPath.length === 0) return placeholder

    let current = options
    const labels: string[] = []

    for (const val of selectedPath) {
      const item = current.find((opt) => opt.value === val)
      if (item) {
        labels.push(item.label)
        current = item.children || []
      }
    }

    return labels.join(" / ")
  }

  // Get options for current level
  const getCurrentOptions = () => {
    let current = options

    for (let i = 0; i < currentLevel; i++) {
      const val = selectedPath[i]
      const item = current.find((opt) => opt.value === val)
      if (item?.children) {
        current = item.children
      }
    }

    return current
  }

  const handleSelect = (option: CascadeOption) => {
    const newPath = [...selectedPath.slice(0, currentLevel), option.value]
    setSelectedPath(newPath)

    if (option.children && option.children.length > 0) {
      // Has children, go to next level
      setCurrentLevel(currentLevel + 1)
    } else {
      // No children, selection complete
      onChange?.(newPath)
      setIsOpen(false)
      setCurrentLevel(0)
    }
  }

  const handleBack = () => {
    if (currentLevel > 0) {
      setCurrentLevel(currentLevel - 1)
      setSelectedPath(selectedPath.slice(0, currentLevel))
    }
  }

  const handleOpen = () => {
    setIsOpen(true)
    setCurrentLevel(0)
    setSelectedPath(value)
  }

  const handleClose = () => {
    setIsOpen(false)
    setCurrentLevel(0)
    setSelectedPath(value)
  }

  return (
    <>
      <div className={cn("w-full", className)}>
        {label && <label className={`block mb-1.5 text-[13px] ${DesignTokens.typography.caption}`}>{label}</label>}

        <button
          type="button"
          onClick={handleOpen}
          className={cn(
            "w-full flex items-center justify-between gap-2.5 px-4 py-2 rounded-[18px] min-h-[36px] transition-all duration-200",
            "bg-muted/50 backdrop-blur-sm hover:bg-muted text-left",
            error ? "ring-2 ring-destructive/50" : "ring-0",
          )}
        >
          <span
            className={cn(
              "text-[15px] flex-1",
              selectedPath.length === 0 ? "text-muted-foreground" : "text-foreground",
              DesignTokens.typography.body,
            )}
          >
            {getDisplayText()}
          </span>
          <ChevronRight size={16} className="text-muted-foreground flex-shrink-0" />
        </button>

        {error && <p className={`mt-1.5 text-[11px] ${DesignTokens.text.danger}`}>{error}</p>}
      </div>

      <ModalDialog isOpen={isOpen} onClose={handleClose} variant="action-sheet" level="OVERLAY">
        <div className="flex flex-col">
          {/* Header with breadcrumb */}
          <div className="flex items-center gap-2 mb-4">
            {currentLevel > 0 && (
              <button onClick={handleBack} className="p-1 -ml-1 hover:bg-muted rounded-lg transition-colors">
                <ChevronRight size={18} className="rotate-180 text-muted-foreground" />
              </button>
            )}
            <div className="flex items-center gap-1.5 flex-1">
              {selectedPath.slice(0, currentLevel + 1).map((_, index) => {
                const item = getCurrentItemAtLevel(options, selectedPath, index)
                return (
                  <span key={index} className="flex items-center gap-1.5">
                    {index > 0 && <ChevronRight size={12} className="text-muted-foreground/50" />}
                    <span className={`text-[13px] ${DesignTokens.typography.caption}`}>{item?.label || ""}</span>
                  </span>
                )
              })}
            </div>
          </div>

          {/* Options list */}
          <div className="flex flex-col gap-1 max-h-[50vh] overflow-y-auto">
            {getCurrentOptions().map((option) => {
              const isSelected = selectedPath[currentLevel] === option.value
              return (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  className={cn(
                    "flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors text-left",
                    isSelected ? "bg-primary/10" : "hover:bg-muted",
                  )}
                >
                  <span
                    className={cn(
                      "text-[15px]",
                      isSelected ? "text-primary font-medium" : "text-foreground",
                      DesignTokens.typography.body,
                    )}
                  >
                    {option.label}
                  </span>
                  {option.children && option.children.length > 0 && (
                    <ChevronRight size={16} className="text-muted-foreground" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </ModalDialog>
    </>
  )
}

// Helper function to get item at specific level
function getCurrentItemAtLevel(options: CascadeOption[], path: string[], level: number): CascadeOption | undefined {
  let current = options

  for (let i = 0; i <= level; i++) {
    const val = path[i]
    const item = current.find((opt) => opt.value === val)
    if (i === level) return item
    if (item?.children) {
      current = item.children
    }
  }

  return undefined
}
