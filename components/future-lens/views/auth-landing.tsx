"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import { Smartphone } from "lucide-react"
import { LiquidAIAssistant, type AIAssistantStep } from "../ai/liquid-ai-assistant"
import { useAppConfig } from "@/lib/future-lens/config-context"
import { translations } from "@/lib/future-lens/i18n"
import { GoogleIcon, WeChatIcon } from "../ds/social-login-button"

export function AuthLanding() {
  const router = useRouter()
  const { language } = useAppConfig()
  const t = translations[language] || translations["zh"]

  // 使用 useMemo 确保 language 变化时 steps 重新创建
  const steps: Record<string, AIAssistantStep> = useMemo(() => ({
    welcome: {
      id: "welcome",
      type: "choice",
      getLines: () => [
        language === "zh" ? "欢迎来到 FutureLens" : "Welcome to FutureLens",
        language === "zh" ? "让我们开始注册吧" : "Let's get started",
      ],
      options: [
        {
          label: language === "zh" ? "Google" : "Google",
          value: "google",
          icon: <GoogleIcon size={18} />,
        },
        {
          label: language === "zh" ? "微信" : "WeChat",
          value: "wechat",
          icon: <WeChatIcon size={18} />,
        },
        {
          label: language === "zh" ? "手机号" : "Phone",
          value: "phone",
          icon: <Smartphone size={18} />,
        },
      ],
      next: null, // 选择后直接处理，不进入下一步
      onOptionSelect: (value: string) => {
        if (value === "google") {
          // TODO: 实现 Google OAuth 登录
          console.log("Google login")
          // router.push("/auth/google")
        } else if (value === "wechat") {
          // TODO: 实现微信登录
          console.log("WeChat login")
          // router.push("/auth/wechat")
        } else if (value === "phone") {
          // 跳转到手机号输入页
          router.push(`/auth/phone?fromAI=true`)
        }
      },
    },
    phone: {
      id: "phone",
      type: "text",
      getLines: () => [
        language === "zh" ? "请输入您的手机号" : "Please enter your phone number",
        language === "zh" ? "我们将发送验证码到您的手机" : "We'll send a verification code to your phone",
      ],
      next: null,
      onNext: (data) => {
        // 跳转到手机号输入页，传递数据
        const phoneNumber = data.phone || ""
        if (phoneNumber.length >= 11) {
          router.push(`/auth/phone?fromAI=true&phone=${encodeURIComponent(phoneNumber)}`)
        }
      },
    },
  }), [language, router])

  return (
    <LiquidAIAssistant
      steps={steps}
      initialStepId="welcome"
      onComplete={(data) => {
        // 如果完成流程，跳转到手机号输入页
        router.push(`/auth/phone?fromAI=true`)
      }}
      showNavigation={false}
      showMuteButton={true}
    />
  )
}
