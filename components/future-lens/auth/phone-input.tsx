"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { LiquidAIAssistant, type AIAssistantStep } from "../ai/liquid-ai-assistant"
import { useAppConfig } from "@/lib/future-lens/config-context"
import { translations } from "@/lib/future-lens/i18n"
import { useToast } from "@/hooks/use-toast"
import { MobileInput } from "../ds/mobile-input"
import { sendVerificationCode } from "@/lib/aino-sdk/user-api"

export function PhoneInput() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { language } = useAppConfig()
  const t = translations[language] || translations["zh"]
  const [phone, setPhone] = useState("")
  const [countryCode, setCountryCode] = useState("+86")
  const { toast } = useToast()
  const fromAI = searchParams.get("fromAI") === "true"

  // 从 URL 参数获取已输入的手机号（如果从 auth-landing 跳转过来）
  useEffect(() => {
    const phoneParam = searchParams.get("phone")
    if (phoneParam && fromAI) {
      // 如果手机号有效，直接跳转到验证码页面（避免重复输入）
      if (phoneParam.length >= 11) {
        router.push(`/auth/verify?phone=${countryCode}${phoneParam}&fromAI=true`)
        return
      }
      // 否则预填充到输入框
      setPhone(phoneParam)
    }
  }, [searchParams, fromAI, countryCode, router])

  const handleNext = useCallback(
    async (data: Record<string, any>) => {
      const phoneNumber = data.phone || phone
      const finalCountryCode = data.countryCode || countryCode
      
      // 验证手机号格式
      if (phoneNumber.length < 11) {
        toast({
          title: language === "zh" ? "手机号格式错误" : "Invalid phone number",
          description: language === "zh" ? "请输入正确的手机号" : "Please enter a valid phone number",
          variant: "destructive",
        })
        return
      }

      // 发送验证码（不阻塞跳转，即使失败也跳转）
      try {
        await sendVerificationCode(phoneNumber)
        toast({
          title: language === "zh" ? "验证码已发送" : "Code sent",
          description: language === "zh" ? "请查收短信验证码（测试模式，可任意输入）" : "Please check your SMS (Test mode, any code works)",
        })
      } catch (error: any) {
        console.error("发送验证码失败:", error)
        // 即使发送失败，也继续跳转（测试阶段）
        toast({
          title: language === "zh" ? "提示" : "Notice",
          description: language === "zh" ? "验证码发送失败，但可以继续（测试模式）" : "Code send failed, but you can continue (Test mode)",
        })
      }
      
      // 跳转到验证码页面
      router.push(`/auth/verify?phone=${finalCountryCode}${phoneNumber}&fromAI=true`)
    },
    [phone, countryCode, router, language, toast],
  )

  // 使用 useCallback 稳定 onChange 处理函数，避免重新创建组件
  // 注意：输入组件现在是独立的，不再需要 CustomEvent 同步
  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    setPhone(value)
  }, [])

  const handleCountryCodeChange = useCallback((code: string) => {
    setCountryCode(code)
  }, [])

  // 使用新的独立输入组件架构
  const steps: Record<string, AIAssistantStep> = useMemo(
    () => ({
    phone: {
      id: "phone",
      type: "phone", // 使用新的 phone 类型
      getLines: () => [
        language === "zh" ? "请输入您的手机号" : "Please enter your phone number",
        language === "zh" ? "我们将发送验证码到您的手机" : "We'll send a verification code to your phone",
      ],
      next: null,
      onNext: (data) => {
        // 从输入组件接收数据
        const phoneNumber = data.phone || ""
        handleNext({ phone: phoneNumber, countryCode: data.countryCode || countryCode })
        return true
      },
    },
  }),
    [language, handleNext, countryCode], // 简化依赖
  )

  // 如果是从 AI 流程来的，使用 AI 交互；否则使用传统界面
  if (fromAI) {
    return (
      <LiquidAIAssistant
        steps={steps}
        initialStepId="phone"
        onComplete={(data) => {
          handleNext(data)
        }}
        showNavigation={true}
        showMuteButton={true}
      />
    )
  }

  // 传统界面（保留作为后备）
  return (
    <div className="min-h-screen w-full bg-background font-sans flex justify-center items-center p-0 md:p-8">
      <div className="relative w-full md:max-w-[390px] md:h-[844px] h-screen bg-background overflow-hidden shadow-2xl md:rounded-[40px] ring-8 ring-black/5">
        <div className="relative z-10 flex flex-col h-full px-5 pt-16 pb-8">
          <div className="flex-1 flex flex-col justify-center items-center -mt-20">
            <h1 className="text-xl font-semibold mb-10">{t.auth_phone_title}</h1>
            <div className="w-full max-w-sm">
              <div className="flex items-center gap-3 px-4 py-2 bg-muted/50 backdrop-blur-xl rounded-[18px] border border-border min-h-[36px]">
                <span className="text-[15px] text-muted-foreground flex-shrink-0">{countryCode}</span>
                <div className="w-px h-5 bg-border flex-shrink-0" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  placeholder={t.auth_phone_placeholder}
                  className="flex-1 bg-transparent outline-none text-[15px] text-foreground placeholder:text-muted-foreground/50"
                  maxLength={11}
                />
              </div>
            </div>
          </div>
          <button
            onClick={() => handleNext({ phone })}
            disabled={phone.length < 11}
            className="w-full py-3 px-6 rounded-full bg-primary text-primary-foreground font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t.auth_next_step}
          </button>
        </div>
      </div>
    </div>
  )
}
