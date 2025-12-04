"use client"

import { useState } from "react"
import { Calendar, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { DesignTokens } from "@/lib/future-lens/design-tokens"
import { ModalDialog } from "./modal-dialog"

export type DatePickerMode = "single" | "range" | "multiple"

/**
 * 日期选择器组件，支持单日、范围和多选模式
 * @example
 * ```tsx
 * <DatePicker mode="single" value={date} onChange={setDate} />
 * ```
 */
interface DatePickerProps {
  mode?: DatePickerMode
  value?: Date | Date[] | { start: Date; end: Date }
  onChange?: (value: Date | Date[] | { start: Date; end: Date } | undefined) => void
  placeholder?: string
  label?: string
  error?: string
  className?: string
}

export function DatePicker({
  mode = "single",
  value,
  onChange,
  placeholder = "选择日期",
  label,
  error,
  className,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [rangeStart, setRangeStart] = useState<Date | null>(null)

  // Format display text
  const getDisplayText = () => {
    if (!value) return placeholder

    if (mode === "single" && value instanceof Date) {
      return formatDate(value)
    }

    if (mode === "range" && value && typeof value === "object" && "start" in value && "end" in value) {
      return `${formatDate(value.start)} - ${formatDate(value.end)}`
    }

    if (mode === "multiple" && Array.isArray(value)) {
      if (value.length === 0) return placeholder
      if (value.length === 1) return formatDate(value[0])
      return `${formatDate(value[0])} 等 ${value.length} 个日期`
    }

    return placeholder
  }

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}`
  }

  // Generate calendar days
  const getDaysInMonth = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startWeekday = firstDay.getDay()

    const days: (Date | null)[] = []

    // Add empty cells for days before month starts
    for (let i = 0; i < startWeekday; i++) {
      days.push(null)
    }

    // Add all days in month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }

  const isDateInRange = (date: Date) => {
    if (mode !== "range" || !value || typeof value !== "object" || !("start" in value && "end" in value)) {
      return false
    }
    return date > value.start && date < value.end
  }

  const isDateRangeStart = (date: Date) => {
    if (mode !== "range" || !value || typeof value !== "object" || !("start" in value)) {
      return false
    }
    return isSameDay(date, value.start)
  }

  const isDateRangeEnd = (date: Date) => {
    if (mode !== "range" || !value || typeof value !== "object" || !("end" in value)) {
      return false
    }
    return isSameDay(date, value.end)
  }

  const isDateSelected = (date: Date) => {
    if (!value) return false

    if (mode === "single" && value instanceof Date) {
      return isSameDay(date, value)
    }

    if (mode === "multiple" && Array.isArray(value)) {
      return value.some((d) => isSameDay(d, date))
    }

    if (mode === "range" && value && typeof value === "object" && "start" in value && "end" in value) {
      return isSameDay(date, value.start) || isSameDay(date, value.end)
    }

    return false
  }

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    )
  }

  const handleDateClick = (date: Date) => {
    if (mode === "single") {
      onChange?.(date)
      setIsOpen(false)
    } else if (mode === "multiple") {
      const currentDates = Array.isArray(value) ? value : []
      const existingIndex = currentDates.findIndex((d) => isSameDay(d, date))

      if (existingIndex >= 0) {
        const newDates = currentDates.filter((_, i) => i !== existingIndex)
        onChange?.(newDates)
      } else {
        const newDates = [...currentDates, date]
        onChange?.(newDates)
      }
    } else if (mode === "range") {
      if (!rangeStart) {
        setRangeStart(date)
      } else {
        const start = date < rangeStart ? date : rangeStart
        const end = date < rangeStart ? rangeStart : date
        onChange?.({ start, end })
        setRangeStart(null)
        setIsOpen(false)
      }
    }
  }

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const monthNames = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
  const weekDays = ["日", "一", "二", "三", "四", "五", "六"]
  const days = getDaysInMonth(currentYear, currentMonth)

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
        <Calendar size={16} className="text-muted-foreground flex-shrink-0" />
      </button>

      {error && <p className={`mt-1.5 text-[11px] ${DesignTokens.text.danger}`}>{error}</p>}

      {/* Calendar Modal - 使用更高的 z-index 层级，确保在 LiquidAIAssistant 之上 */}
      <ModalDialog isOpen={isOpen} onClose={() => setIsOpen(false)} variant="action-sheet" level="OVERLAY">
        <div className="space-y-4">
          {/* Month/Year Selector */}
          <div className="flex items-center justify-between px-2">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
              aria-label="上一月"
            >
              <ChevronRight size={20} className="rotate-180 text-foreground" />
            </button>

            <div className={`${DesignTokens.typography.title} text-base font-semibold`}>
              {currentYear}年 {monthNames[currentMonth]}
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
              aria-label="下一月"
            >
              <ChevronRight size={20} className="text-foreground" />
            </button>
          </div>

          {/* Week Days Header */}
          <div className="grid grid-cols-7 gap-1 px-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className={`text-center py-2 text-[13px] ${DesignTokens.typography.caption} text-muted-foreground font-medium`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 px-2">
            {days.map((date, index) => {
              if (!date) {
                return <div key={`empty-${index}`} className="aspect-square" />
              }

              const isSelected = isDateSelected(date)
              const isInRange = isDateInRange(date)
              const isRangeStart = isDateRangeStart(date)
              const isRangeEnd = isDateRangeEnd(date)
              const isToday = isSameDay(date, new Date())
              const isCurrentMonth = date.getMonth() === currentMonth

              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDateClick(date)
                  }}
                  className={cn(
                    "aspect-square rounded-full flex items-center justify-center text-[15px] transition-all relative",
                    DesignTokens.typography.body,
                    // Selected state (single or multiple mode, or range endpoints)
                    isSelected && mode !== "range"
                      ? "bg-primary text-primary-foreground font-medium scale-100"
                      : isSelected && mode === "range"
                        ? "bg-primary text-primary-foreground font-medium z-10"
                        : // In range (between start and end)
                          isInRange
                          ? "bg-muted text-foreground"
                          : // Today indicator
                            isToday && !isSelected
                            ? "bg-muted/50 text-foreground font-medium"
                            : // Default states
                              isCurrentMonth
                              ? "hover:bg-muted/30 text-foreground"
                              : "text-muted-foreground/40",
                  )}
                >
                  {date.getDate()}
                </button>
              )
            })}
          </div>

          {/* Mode hint */}
          {mode === "multiple" && (
            <p className={`text-center text-[12px] ${DesignTokens.typography.caption} text-muted-foreground pt-2`}>
              可选择多个日期
            </p>
          )}
          {mode === "range" && !rangeStart && (
            <p className={`text-center text-[12px] ${DesignTokens.typography.caption} text-muted-foreground pt-2`}>
              请选择开始日期
            </p>
          )}
          {mode === "range" && rangeStart && (
            <p className={`text-center text-[12px] ${DesignTokens.typography.caption} text-muted-foreground pt-2`}>
              请选择结束日期
            </p>
          )}
        </div>
      </ModalDialog>
    </div>
  )
}
