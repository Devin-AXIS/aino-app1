"use client"

import type React from "react"

import { useState, useRef, useEffect, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Code, Briefcase, PenTool, TrendingUp, Heart, Globe, Sparkles, Zap, Target, Flame } from "lucide-react"
import { LiquidAIAssistant, type AIAssistantStep } from "../ai/liquid-ai-assistant"
import { useAppConfig } from "@/lib/future-lens/config-context"
import { translations } from "@/lib/future-lens/i18n"
import { useToast } from "@/hooks/use-toast"
import { AppBackground } from "../ds/app-background"
import { DesignTokens } from "@/lib/future-lens/design-tokens"

// 自定义验证码输入组件
function VerifyCodeInput({
  code,
  setCode,
  inputRefs,
  onComplete,
}: {
  code: string[]
  setCode: (code: string[]) => void
  inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>
  onComplete: () => void
}) {
  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value.slice(-1)
    setCode(newCode)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    if (newCode.every((digit) => digit) && index === 5) {
      onComplete()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  return (
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
        />
      ))}
    </div>
  )
}

export function VerifyCode() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { language } = useAppConfig()
  const t = translations[language] || translations["zh"]
  const [code, setCode] = useState(["", "", "", "", "", ""])
  const [countdown, setCountdown] = useState(60)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [phone, setPhone] = useState("")
  const { toast } = useToast()
  const fromAI = searchParams.get("fromAI") === "true"

  useEffect(() => {
    const phoneParam = searchParams.get("phone")
    if (phoneParam) {
      setPhone(phoneParam)
    }
  }, [searchParams])

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleComplete = () => {
    toast({
      title: language === "zh" ? "验证成功" : "Verification successful",
      description: language === "zh" ? "欢迎使用 FutureLens" : "Welcome to FutureLens",
    })
    setTimeout(() => {
      router.push("/?tab=profile&fromAuth=true")
    }, 500)
  }

  const handleResend = () => {
    if (countdown === 0) {
      toast({
        title: language === "zh" ? "验证码已发送" : "Code sent",
        description: language === "zh" ? "请查收短信验证码" : "Please check your SMS",
      })
      setCountdown(60)
    }
  }

  // 如果是从 AI 流程来的，使用 AI 交互
  if (fromAI) {
    // 使用 useMemo 确保 language 变化时 steps 重新创建
    const steps: Record<string, AIAssistantStep> = useMemo(() => ({
      verify: {
        id: "verify",
        type: "verify", // 使用新的 verify 类型
        getLines: () => [
          language === "zh" ? "请输入 6 位验证码" : "Enter 6-digit code",
          language === "zh" ? `已向 ${phone || "176******38"} 发送验证码` : `Code sent to ${phone || "176******38"}`,
        ],
        next: "name", // 验证码输入完成后，进入输入名字步骤
        onVerifyCodeSubmit: (code: string) => {
          // 验证码输入完成，继续下一步（输入名字）
          // 不直接调用 handleComplete，而是让流程继续
        },
        onVerifyCodeResend: handleResend,
        verifyCodeCountdown: countdown,
      },
      name: {
        id: "name",
        type: "text",
        getLines: () => [
          language === "zh" ? "太好了！验证成功" : "Great! Verification successful",
          language === "zh" ? "请告诉我们您的名字" : "Please tell us your name",
        ],
        next: "topics",
        placeholder: language === "zh" ? "请输入您的名字" : "Enter your name",
      },
      topics: {
        id: "topics",
        type: "slider", // 滑动选择
        getLines: () => [
          language === "zh" ? "最后一步" : "Last step",
          language === "zh" ? "选择您感兴趣的话题" : "Select topics you're interested in",
        ],
        options: [
          { label: language === "zh" ? "科技" : "Tech", value: "tech", icon: <Code size={24} /> },
          { label: language === "zh" ? "设计" : "Design", value: "design", icon: <PenTool size={24} /> },
          { label: language === "zh" ? "金融" : "Finance", value: "finance", icon: <TrendingUp size={24} /> },
          { label: language === "zh" ? "健康" : "Health", value: "health", icon: <Heart size={24} /> },
          { label: language === "zh" ? "商业" : "Business", value: "business", icon: <Briefcase size={24} /> },
          { label: language === "zh" ? "全球" : "Global", value: "global", icon: <Globe size={24} /> },
          { label: language === "zh" ? "创新" : "Innovation", value: "innovation", icon: <Sparkles size={24} /> },
          { label: language === "zh" ? "创业" : "Startup", value: "startup", icon: <Zap size={24} /> },
          { label: language === "zh" ? "投资" : "Investment", value: "investment", icon: <Target size={24} /> },
          { label: language === "zh" ? "趋势" : "Trends", value: "trends", icon: <Flame size={24} /> },
        ],
        next: null, // 选择话题后完成注册
        onOptionSelect: (value: string) => {
          // 选择话题后，完成注册流程
          handleComplete()
        },
      },
    }), [language, phone, countdown, handleResend, handleComplete])

    return (
      <LiquidAIAssistant
        steps={steps}
        initialStepId="verify"
        onComplete={handleComplete}
        showNavigation={true}
        showMuteButton={true}
      />
    )
  }

  // 传统界面（保留作为后备）
  return (
    <div className={`min-h-screen w-full ${DesignTokens.background.primary} font-sans flex justify-center items-center p-0 md:p-8`}>
      <div className={`relative w-full md:max-w-[390px] md:h-[844px] h-screen ${DesignTokens.background.primary} overflow-hidden shadow-2xl md:rounded-[40px] ring-8 ring-black/5`}>
        <AppBackground />
        <div className="relative z-10 flex flex-col h-full px-5 pt-16 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex-1 flex flex-col justify-center items-center -mt-20"
          >
            <h1 className={`text-xl ${DesignTokens.typography.title} mb-2`}>{t.auth_verify_title}</h1>
            <p className={`text-[13px] ${DesignTokens.typography.subtitle} mb-10`}>
              {t.auth_verify_sent} {phone || "176******38"} {t.auth_verify_sent_suffix}
            </p>
            <VerifyCodeInput code={code} setCode={setCode} inputRefs={inputRefs} onComplete={handleComplete} />
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              onClick={handleResend}
              disabled={countdown > 0}
              className={`mt-6 text-[13px] ${DesignTokens.typography.caption} ${
                countdown > 0
                  ? "text-muted-foreground/50 cursor-not-allowed"
                  : "text-muted-foreground hover:text-foreground"
              } transition-colors`}
            >
              {countdown > 0 ? `${t.auth_resend} ${countdown}s` : t.auth_resend}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
