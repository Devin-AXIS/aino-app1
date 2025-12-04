"use client"

import { useState, useRef, FormEvent } from "react"
import { useAppConfig } from "@/lib/future-lens/config-context"

interface TextInputStepProps {
  onSubmit: (value: string) => void
  placeholder?: string
  initialValue?: string
}

/**
 * 文本输入步骤组件 - 完全独立，内部状态管理
 * 只在提交时通知父组件，输入过程中不触发任何父组件更新
 */
export function TextInputStep({ onSubmit, placeholder, initialValue = "" }: TextInputStepProps) {
  const { language } = useAppConfig()
  const [value, setValue] = useState(initialValue)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (value.trim()) {
      onSubmit(value.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full flex items-center justify-center group px-4">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder || (language === "zh" ? "请输入..." : "Type your answer...")}
        className="w-full bg-transparent text-center text-xl md:text-2xl text-foreground placeholder:text-muted-foreground/50 outline-none border-b border-border transition-colors py-2 font-light focus:text-foreground focus:border-foreground/50 caret-pink-500"
        autoFocus
        suppressHydrationWarning
      />
    </form>
  )
}

