"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { DesignTokens } from "@/lib/future-lens/design-tokens"
import { ModalDialog } from "./modal-dialog"

interface TimePickerProps {
  value?: string // Format: "HH:mm" (24-hour) or "hh:mm AM/PM" (12-hour)
  onChange?: (value: string) => void
  format?: "12h" | "24h"
  placeholder?: string
  label?: string
  error?: string
  className?: string
}

export function TimePicker({
  value,
  onChange,
  format = "12h",
  placeholder = "选择时间",
  label,
  error,
  className,
}: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Parse value or use defaults
  const parseTime = (timeStr?: string) => {
    if (!timeStr) {
      return format === "12h"
        ? { hour: 3, minute: 30, period: "PM" as const }
        : { hour: 15, minute: 30, period: "PM" as const }
    }

    if ((format === "12h" && timeStr.includes("AM")) || timeStr.includes("PM")) {
      const [time, period] = timeStr.split(" ")
      const [hour, minute] = time.split(":").map(Number)
      return { hour, minute, period: period as "AM" | "PM" }
    }

    const [hour, minute] = timeStr.split(":").map(Number)
    const period = hour >= 12 ? "PM" : "AM"
    const displayHour = format === "12h" ? hour % 12 || 12 : hour
    return { hour: displayHour, minute, period }
  }

  const { hour: initialHour, minute: initialMinute, period: initialPeriod } = parseTime(value)
  const [selectedHour, setSelectedHour] = useState(initialHour)
  const [selectedMinute, setSelectedMinute] = useState(initialMinute)
  const [selectedPeriod, setSelectedPeriod] = useState<"AM" | "PM">(initialPeriod)

  const hourScrollRef = useRef<HTMLDivElement>(null)
  const minuteScrollRef = useRef<HTMLDivElement>(null)
  const periodScrollRef = useRef<HTMLDivElement>(null)

  // Generate time options
  const hours = format === "12h" ? Array.from({ length: 12 }, (_, i) => i + 1) : Array.from({ length: 24 }, (_, i) => i)
  const minutes = Array.from({ length: 60 }, (_, i) => i)
  const periods = ["AM", "PM"] as const

  // Format display text
  const getDisplayText = () => {
    if (!value) return placeholder
    return value
  }

  // Handle confirm
  const handleConfirm = () => {
    let timeString: string
    if (format === "12h") {
      const hourStr = selectedHour.toString().padStart(2, "0")
      const minuteStr = selectedMinute.toString().padStart(2, "0")
      timeString = `${hourStr}:${minuteStr} ${selectedPeriod}`
    } else {
      const hour24 =
        selectedPeriod === "PM" && selectedHour !== 12
          ? selectedHour + 12
          : selectedPeriod === "AM" && selectedHour === 12
            ? 0
            : selectedHour
      timeString = `${hour24.toString().padStart(2, "0")}:${selectedMinute.toString().padStart(2, "0")}`
    }
    onChange?.(timeString)
    setIsOpen(false)
  }

  // Auto-scroll to selected value when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (hourScrollRef.current) {
          const hourIndex = hours.indexOf(selectedHour)
          hourScrollRef.current.scrollTop = hourIndex * 48 - 96 // Center the selected item
        }
        if (minuteScrollRef.current) {
          minuteScrollRef.current.scrollTop = selectedMinute * 48 - 96
        }
        if (periodScrollRef.current && format === "12h") {
          const periodIndex = periods.indexOf(selectedPeriod)
          periodScrollRef.current.scrollTop = periodIndex * 48 - 48
        }
      }, 100)
    }
  }, [isOpen, selectedHour, selectedMinute, selectedPeriod, format, hours, periods])

  const ScrollColumn = ({
    items,
    selectedValue,
    onSelect,
    scrollRef,
    formatItem = (item) => item.toString().padStart(2, "0"),
  }: {
    items: readonly any[]
    selectedValue: any
    onSelect: (value: any) => void
    scrollRef: React.RefObject<HTMLDivElement>
    formatItem?: (item: any) => string
  }) => (
    <div
      ref={scrollRef}
      className="relative h-[240px] overflow-y-auto scrollbar-hide snap-y snap-mandatory touch-pan-y overscroll-contain overflow-x-hidden"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {/* Top padding for centering */}
      <div className="h-[96px]" />

      {items.map((item) => {
        const isSelected = item === selectedValue
        return (
          <button
            key={item}
            type="button"
            onClick={() => onSelect(item)}
            className={cn(
              "w-full h-[48px] flex items-center justify-center transition-all snap-center",
              DesignTokens.typography.body,
              isSelected
                ? "text-foreground text-[20px] font-semibold scale-110"
                : "text-muted-foreground/40 text-[14px] hover:text-muted-foreground/60",
            )}
          >
            {formatItem(item)}
          </button>
        )
      })}

      {/* Bottom padding for centering */}
      <div className="h-[96px]" />
    </div>
  )

  return (
    <div className={cn("w-full", className)}>
      {label && <label className={`block mb-1.5 text-[13px] ${DesignTokens.typography.caption}`}>{label}</label>}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={cn(
          "w-full flex items-center justify-between gap-2.5 px-4 py-2 rounded-[18px] min-h-[36px] transition-all duration-200",
          "bg-muted/50 backdrop-blur-sm hover:bg-muted text-left",
          error ? "ring-2 ring-destructive/50" : "ring-0",
        )}
      >
        <span
          className={cn(
            "text-[15px] flex-1",
            !value ? "text-muted-foreground" : "text-foreground",
            DesignTokens.typography.body,
          )}
        >
          {getDisplayText()}
        </span>
        <Clock size={16} className="text-muted-foreground flex-shrink-0" />
      </button>

      {error && <p className={`mt-1.5 text-[11px] ${DesignTokens.text.danger}`}>{error}</p>}

      {/* Time Picker Modal */}
      <ModalDialog isOpen={isOpen} onClose={() => setIsOpen(false)} variant="action-sheet">
        <div className="space-y-4">
          {/* Time Columns Container */}
          <div className="flex items-center justify-center gap-4 relative">
            {/* Center highlight bar */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[48px] bg-muted/20 rounded-xl pointer-events-none z-0" />

            {/* Hour Column */}
            <div className="flex-1 relative z-10">
              <ScrollColumn
                items={hours}
                selectedValue={selectedHour}
                onSelect={setSelectedHour}
                scrollRef={hourScrollRef}
              />
            </div>

            {/* Minute Column */}
            <div className="flex-1 relative z-10">
              <ScrollColumn
                items={minutes}
                selectedValue={selectedMinute}
                onSelect={setSelectedMinute}
                scrollRef={minuteScrollRef}
              />
            </div>

            {/* Period Column (AM/PM) */}
            {format === "12h" && (
              <>
                <div className="w-4" />
                <div className="flex-1 relative z-10">
                  <ScrollColumn
                    items={periods}
                    selectedValue={selectedPeriod}
                    onSelect={setSelectedPeriod}
                    scrollRef={periodScrollRef}
                    formatItem={(item) => item}
                  />
                </div>
              </>
            )}

            {/* Separator */}
            <div className={`text-[20px] font-semibold text-foreground ${DesignTokens.typography.body}`}>:</div>
          </div>

          {/* Confirm Button */}
          <button
            type="button"
            onClick={handleConfirm}
            className={cn(
              "w-full py-3 rounded-full transition-all",
              "bg-primary text-primary-foreground font-medium hover:bg-primary/90",
              DesignTokens.typography.button,
            )}
          >
            确认
          </button>
        </div>
      </ModalDialog>
    </div>
  )
}
