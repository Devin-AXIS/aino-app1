"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { useAppConfig } from "@/lib/future-lens/config-context"

interface VerifyCodeStepProps {
  onSubmit: (code: string) => void
  onResend?: () => void
  countdown?: number
}

/**
 * 验证码输入步骤组件 - 完全独立，内部状态管理
 * 只在提交时通知父组件，输入过程中不触发任何父组件更新
 */
export function VerifyCodeStep({ onSubmit, onResend, countdown = 0 }: VerifyCodeStepProps) {
  const { language } = useAppConfig()
  const [code, setCode] = useState(["", "", "", "", "", ""])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value.slice(-1)
    setCode(newCode)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // 当所有6位都输入完成时，自动提交
    if (newCode.every((digit) => digit) && index === 5) {
      onSubmit(newCode.join(""))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="flex gap-2 justify-center">
        {code.map((digit, index) => (
          <motion.input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
            type="tel"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-10 h-10 md:w-12 md:h-12 text-center text-base md:text-lg font-semibold bg-muted/50 backdrop-blur-xl rounded-xl border border-border outline-none focus:border-primary focus:bg-muted/70 transition-all"
            autoFocus={index === 0}
            suppressHydrationWarning
          />
        ))}
      </div>
      {onResend && (
        <button
          onClick={onResend}
          disabled={countdown > 0}
          className={`text-sm ${
            countdown > 0
              ? "text-muted-foreground/50 cursor-not-allowed"
              : "text-muted-foreground hover:text-foreground"
          } transition-colors`}
          suppressHydrationWarning
        >
          <span suppressHydrationWarning>
            {countdown > 0 
              ? (language === "zh" ? `重新发送 ${countdown}s` : `Resend ${countdown}s`)
              : (language === "zh" ? "重新发送" : "Resend")
            }
          </span>
        </button>
      )}
    </div>
  )
}

