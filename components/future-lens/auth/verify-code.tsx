"use client"

import type React from "react"

import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Code, Briefcase, PenTool, TrendingUp, Heart, Globe, Sparkles, Zap, Target, Flame, BookOpen } from "lucide-react"
import { LiquidAIAssistant, type AIAssistantStep } from "../ai/liquid-ai-assistant"
import { useAppConfig } from "@/lib/future-lens/config-context"
import { translations } from "@/lib/future-lens/i18n"
import { useToast } from "@/hooks/use-toast"
import { AppBackground } from "../ds/app-background"
import { DesignTokens } from "@/lib/future-lens/design-tokens"
import { 
  loginWithPhoneAndCode, 
  registerWithPhone, 
  checkPhoneExists,
  sendVerificationCode,
  updateUserInfo
} from "@/lib/aino-sdk/user-api"

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
  const [phoneNumber, setPhoneNumber] = useState("") // 纯手机号（不含国家代码）
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const fromAI = searchParams.get("fromAI") === "true"

  // 传统界面：验证码输入完成后自动触发（但不在AI流程中使用）
  // AI流程通过 onVerifyCodeSubmit 处理

  useEffect(() => {
    const phoneParam = searchParams.get("phone")
    if (phoneParam) {
      setPhone(phoneParam)
      // 提取纯手机号（去掉国家代码）
      const phoneWithoutCode = phoneParam.replace(/^\+\d+/, "")
      setPhoneNumber(phoneWithoutCode)
      
      // 自动发送验证码
      handleSendCode(phoneWithoutCode)
    }
  }, [searchParams])

  // 发送验证码
  const handleSendCode = async (phoneNum: string) => {
    try {
      await sendVerificationCode(phoneNum)
      toast({
        title: language === "zh" ? "验证码已发送" : "Code sent",
        description: language === "zh" ? "请查收短信验证码（测试模式，可任意输入）" : "Please check your SMS (Test mode, any code works)",
      })
      setCountdown(60)
    } catch (error) {
      console.error("发送验证码失败:", error)
      toast({
        title: language === "zh" ? "发送失败" : "Failed",
        description: language === "zh" ? "验证码发送失败，请重试" : "Failed to send code, please try again",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // 执行登录/注册（只调用API，不跳转）
  const handleLoginOrRegister = useCallback(async (verificationCode: string) => {
    if (!phoneNumber) {
      return { success: false, error: language === "zh" ? "手机号不能为空" : "Phone number is required" }
    }

    try {
      let result
      
      // 测试阶段策略：先尝试登录，如果失败再注册
      try {
        // 先尝试登录
        result = await loginWithPhoneAndCode(phoneNumber, verificationCode)
        if (result.success) {
          return { success: true, isLogin: true, data: result.data }
        }
      } catch (loginError: any) {
        // 登录失败（可能是用户未注册），静默处理，尝试注册
        // 不显示"手机号或密码错误"这种预期错误
        const isExpectedError = loginError.message?.includes('手机号或密码错误') || 
                                loginError.message?.includes('密码错误')
        if (!isExpectedError) {
          console.log('登录失败，尝试注册:', loginError.message)
        }
        
        // 尝试注册
        try {
          result = await registerWithPhone(phoneNumber, verificationCode)
          if (result.success) {
            return { success: true, isLogin: false, data: result.data }
          }
        } catch (registerError: any) {
          // 如果注册时发现用户已存在，再次尝试登录（可能密码已更新）
          if (registerError.message === 'USER_EXISTS' || registerError.message?.includes('已注册') || registerError.message?.includes('已存在')) {
            console.log('⚠️ 用户已注册，重新尝试登录...')
            try {
              // 再次尝试登录（后端可能已自动更新密码）
              result = await loginWithPhoneAndCode(phoneNumber, verificationCode)
              if (result.success) {
                return { success: true, isLogin: true, data: result.data }
              }
            } catch (retryLoginError: any) {
              return { success: false, error: language === "zh" ? "该手机号已注册，请使用正确的验证码登录" : "This phone number is already registered" }
            }
          }
          return { success: false, error: registerError.message || loginError.message || '登录/注册失败' }
        }
      }

      if (!result || !result.success) {
        return { success: false, error: result?.error || '登录/注册失败，请重试' }
      }

      // 保存用户信息和 token
      if (result.data) {
        const userData = {
          ...result.data,
          // 确保 userId 字段存在（应用用户的 UUID）
          // 优先使用 userId，如果没有则判断 id 是否为 UUID
          userId: result.data.userId || (result.data.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(result.data.id) ? result.data.id : null),
        }
        if (typeof window !== "undefined") {
          console.log('🔍 handleLoginOrRegister 保存用户信息到 localStorage:', { 
            userId: userData.userId, 
            id: userData.id, 
            name: userData.name,
            phone: userData.phone || userData.phone_number 
          })
          localStorage.setItem("aino_user", JSON.stringify(userData))
          if (userData.token) {
            localStorage.setItem("aino_token", userData.token)
          }
        }
      }

      // 返回结果，保留 isLogin 字段
      return { success: true, isLogin: result.isLogin || false, data: result.data }
    } catch (error: any) {
      console.error("登录/注册失败:", error)
      return { success: false, error: error?.message || error?.error || (language === "zh" ? "请重试" : "Please try again") }
    }
  }, [phoneNumber, language])

  // 完成整个流程（在所有步骤完成后调用）
  const handleComplete = useCallback(async (userData?: Record<string, any>) => {
    // 所有步骤完成，跳转到主页
    setTimeout(() => {
      router.push("/?tab=profile&fromAuth=true")
    }, 500)
  }, [router])

  const handleResend = async () => {
    if (countdown === 0 && phoneNumber) {
      await handleSendCode(phoneNumber)
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
        onVerifyCodeSubmit: async (codeStr: string) => {
          // 验证码输入完成，执行登录/注册
          const verificationCode = codeStr || code.join("")
          if (verificationCode.length === 6) {
            // 更新 state 中的验证码
            setCode(verificationCode.split(""))
            // 执行登录/注册
            const result = await handleLoginOrRegister(verificationCode)
            if (!result.success) {
              toast({
                title: language === "zh" ? "验证码错误" : "Invalid code",
                description: result.error || (language === "zh" ? "请重试" : "Please try again"),
                variant: "destructive",
              })
              return false // 阻止进入下一步
            } else {
              // 登录/注册成功，保存用户信息
              if (result.data) {
                if (typeof window !== "undefined") {
                  // 确保 userId 字段存在（应用用户的 UUID）
                  // 注意：result.data.id 可能是业务数据中的 id（手机号），不是应用用户的 UUID
                  // 所以必须使用 result.data.userId（应用用户的 UUID）
                  const userData = {
                    ...result.data,
                    // 优先使用 userId（应用用户的 UUID），如果没有则判断 id 是否为 UUID
                    userId: result.data.userId || (result.data.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(result.data.id) ? result.data.id : null),
                  }
                  console.log('🔍 保存用户信息到 localStorage:', { 
                    userId: userData.userId, 
                    id: userData.id, 
                    name: userData.name,
                    phone: userData.phone || userData.phone_number 
                  })
                  localStorage.setItem("aino_user", JSON.stringify(userData))
                  if (result.data.token) {
                    localStorage.setItem("aino_token", result.data.token)
                  }
                }
              }
              
              // 如果是登录（用户已存在），直接跳转到主页，不进入注册流程
              if (result.isLogin) {
                toast({
                  title: language === "zh" ? "登录成功" : "Login successful",
                  description: language === "zh" ? "欢迎回来" : "Welcome back",
                })
                // 直接跳转，不进入下一步
                setTimeout(() => {
                  router.push("/?tab=profile&fromAuth=true")
                }, 500)
                return false // 阻止进入下一步（name步骤）
              } else {
                // 如果是注册（新用户），继续进入注册流程（name、topics等）
                toast({
                  title: language === "zh" ? "验证成功" : "Verification successful",
                  description: language === "zh" ? "请继续完成注册" : "Please continue registration",
                })
              }
            }
          }
          return true // 允许进入下一步（注册流程）
        },
        onVerifyCodeResend: handleResend,
        verifyCodeCountdown: countdown,
      },
      name: {
        id: "name",
        type: "text",
        getLines: () => [
          language === "zh" ? "请输入您的姓名" : "Please enter your name",
          language === "zh" ? "这将帮助我们更好地为您服务" : "This will help us serve you better",
        ],
        next: "topics", // 输入名字后进入行业选择
        onNext: async (data: Record<string, any>) => {
          // 名字输入完成，更新用户信息
          // 注意：这里需要等待注册完成并保存用户信息到 localStorage 后才能更新
          const nameValue = (data?.name || data?.text || (typeof data === 'string' ? data : '')) as string
          if (nameValue && typeof nameValue === 'string' && nameValue.trim()) {
            try {
              // 检查是否有用户信息
              if (typeof window !== 'undefined') {
                const userStr = localStorage.getItem('aino_user')
                if (userStr) {
                  try {
                    const user = JSON.parse(userStr)
                    console.log('🔍 注册时输入名字，当前用户信息:', { userId: user.userId, id: user.id, phone: user.phone })
                    
                    // 优先使用 userId（应用用户的 UUID），如果没有则尝试从 id 判断
                    let userId = user.userId
                    if (!userId && user.id) {
                      // 如果 id 是 UUID 格式，使用它
                      if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(user.id)) {
                        userId = user.id
                      }
                    }
                    
                    if (userId) {
                      console.log('🔍 准备更新用户姓名:', { userId, name: nameValue.trim() })
                      try {
                        await updateUserInfo({ name: nameValue.trim() })
                        console.log('✅ 用户姓名更新成功:', nameValue.trim())
                        
                        // 更新 localStorage 中的用户信息
                        const updatedUser = { 
                          ...user, 
                          name: { zh: nameValue.trim(), en: nameValue.trim() },
                          userId: userId, // 确保 userId 字段存在
                        }
                        localStorage.setItem('aino_user', JSON.stringify(updatedUser))
                      } catch (updateError: any) {
                        console.error('❌ 更新用户姓名失败:', updateError)
                        // 即使更新失败，也更新 localStorage 中的名字，至少前端能显示
                        const updatedUser = { 
                          ...user, 
                          name: { zh: nameValue.trim(), en: nameValue.trim() },
                          userId: userId,
                        }
                        localStorage.setItem('aino_user', JSON.stringify(updatedUser))
                        throw updateError // 重新抛出错误，让 toast 显示
                      }
                    } else {
                      console.warn('⚠️ 未找到应用用户 UUID，无法更新姓名到后端:', { user })
                      // 即使没有 UUID，也更新 localStorage 中的名字，至少前端能显示
                      const updatedUser = { 
                        ...user, 
                        name: { zh: nameValue.trim(), en: nameValue.trim() },
                      }
                      localStorage.setItem('aino_user', JSON.stringify(updatedUser))
                    }
                  } catch (parseError) {
                    console.error('解析用户信息失败:', parseError)
                  }
                } else {
                  console.warn('⚠️ 未找到用户信息，姓名将在注册时保存')
                }
              }
            } catch (error) {
              console.error('更新用户姓名失败:', error)
              // 不阻止流程继续，但记录错误
              toast({
                title: language === "zh" ? "提示" : "Notice",
                description: language === "zh" ? "姓名更新失败，但可以继续使用" : "Name update failed, but you can continue",
                variant: "destructive",
              })
            }
          }
          return true
        },
      },
      topics: {
        id: "topics",
        type: "choice",
        getLines: () => [
          language === "zh" ? "请选择您感兴趣的行业" : "Please select your industry",
          language === "zh" ? "这将帮助我们为您推荐更相关的内容" : "This will help us recommend more relevant content",
        ],
        options: [
          { label: language === "zh" ? "科技" : "Technology", value: "tech", icon: <Zap className="w-5 h-5" /> },
          { label: language === "zh" ? "金融" : "Finance", value: "finance", icon: <TrendingUp className="w-5 h-5" /> },
          { label: language === "zh" ? "教育" : "Education", value: "education", icon: <BookOpen className="w-5 h-5" /> },
          { label: language === "zh" ? "医疗" : "Healthcare", value: "healthcare", icon: <Heart className="w-5 h-5" /> },
          { label: language === "zh" ? "其他" : "Other", value: "other", icon: <Globe className="w-5 h-5" /> },
        ],
        next: null, // 最后一步，完成后调用 onComplete
        onOptionSelect: async (value: string) => {
          // 行业选择完成（暂时不调用API，直接通过）
          return true
        },
      },
    }), [language, phone, countdown, handleResend, handleLoginOrRegister, handleComplete, code, toast])

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
            <VerifyCodeInput 
              code={code} 
              setCode={setCode} 
              inputRefs={inputRefs} 
              onComplete={async () => {
                // 传统界面：验证码输入完成后，执行登录/注册，然后跳转
                const verificationCode = code.join("")
                if (verificationCode.length === 6) {
                  const result = await handleLoginOrRegister(verificationCode)
                  if (result.success) {
                    toast({
                      title: language === "zh" ? "登录成功" : "Login successful",
                      description: language === "zh" ? "欢迎回来" : "Welcome back",
                    })
                    setTimeout(() => {
                      router.push("/?tab=profile&fromAuth=true")
                    }, 500)
                  } else {
                    toast({
                      title: language === "zh" ? "验证码错误" : "Invalid code",
                      description: result.error || (language === "zh" ? "请重试" : "Please try again"),
                      variant: "destructive",
                    })
                  }
                }
              }} 
            />
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
