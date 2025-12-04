"use client"

import { useAppConfig } from "@/lib/future-lens/config-context"

interface ChoiceOption {
  label: string
  value: string
  icon?: React.ReactNode
}

interface ChoiceStepProps {
  options: ChoiceOption[]
  onSelect: (value: string) => void
}

/**
 * 选择步骤组件 - 完全独立
 * 点击选项时立即通知父组件，无需提交按钮
 */
export function ChoiceStep({ options, onSelect }: ChoiceStepProps) {
  const { language } = useAppConfig()

  const handleClick = (value: string) => {
    onSelect(value)
  }

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-md px-4">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => handleClick(opt.value)}
          className="w-full px-6 py-3 rounded-xl text-gray-900 dark:text-gray-100 text-base font-medium hover:opacity-90 transition-all duration-300 active:scale-95 flex items-center justify-between relative"
          style={{
            // 白色背景，灰色边框，参考图片样式
            backgroundColor: "rgba(255, 255, 255, 1)",
            border: "1px solid rgba(0, 0, 0, 0.1)",
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
          }}
          suppressHydrationWarning
        >
          {/* 左侧：Logo/图标 */}
          {opt.icon && (
            <span className="w-6 h-6 flex items-center justify-center flex-shrink-0">
              {opt.icon}
            </span>
          )}
          {!opt.icon && <span className="w-6 h-6 flex-shrink-0" />}
          
          {/* 中间：文字居中 */}
          <span className="flex-1 text-center" suppressHydrationWarning>
            {opt.label}
          </span>
          
          {/* 右侧占位，确保文字居中 */}
          <span className="w-6 h-6 flex-shrink-0" />
        </button>
      ))}
    </div>
  )
}

