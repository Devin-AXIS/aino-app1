"use client"

import { useState, useRef, FormEvent } from "react"
import { useAppConfig } from "@/lib/future-lens/config-context"
import { MobileInput } from "../../ds/mobile-input"

interface PhoneInputStepProps {
  onSubmit: (data: { phone: string; countryCode: string }) => void
  initialPhone?: string
  initialCountryCode?: string
}

/**
 * 手机号输入步骤组件 - 完全独立，内部状态管理
 * 只在提交时通知父组件，输入过程中不触发任何父组件更新
 */
export function PhoneInputStep({
  onSubmit,
  initialPhone = "",
  initialCountryCode = "+86",
}: PhoneInputStepProps) {
  const { language } = useAppConfig()
  const [phone, setPhone] = useState(initialPhone)
  const [countryCode, setCountryCode] = useState(initialCountryCode)

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    setPhone(value)
  }

  const handleCountryCodeChange = (code: string) => {
    setCountryCode(code)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit({ phone, countryCode })
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <MobileInput
        countryCode={countryCode}
        onCountryCodeChange={handleCountryCodeChange}
        value={phone}
        onChange={handlePhoneChange}
        placeholder={language === "zh" ? "请输入手机号" : "Enter phone number"}
        maxLength={11}
      />
    </form>
  )
}

