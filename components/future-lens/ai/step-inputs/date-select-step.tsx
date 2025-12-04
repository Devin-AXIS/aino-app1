"use client"

import { useState } from "react"
import { DatePicker } from "../../ds/date-picker"

interface DateSelectStepProps {
  onSelect: (date: Date) => void
  placeholder?: string
  mode?: "single" | "range"
}

/**
 * 日期选择步骤组件 - 完全独立，内部状态管理
 * 适配AI流程的视觉和交互风格，使用DatePicker的弹窗功能
 */
export function DateSelectStep({ onSelect, placeholder = "选择日期", mode = "single" }: DateSelectStepProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()

  const handleDateChange = (value: Date | Date[] | { start: Date; end: Date } | undefined) => {
    if (mode === "single" && value instanceof Date) {
      setSelectedDate(value)
      onSelect(value)
    } else if (mode === "range" && value && typeof value === "object" && "start" in value) {
      // 对于范围选择，可以选择开始日期
      setSelectedDate(value.start)
      onSelect(value.start)
    }
  }

  return (
    <DatePicker
      mode={mode}
      value={selectedDate}
      onChange={handleDateChange}
      placeholder={placeholder}
    />
  )
}

