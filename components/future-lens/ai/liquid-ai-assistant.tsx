"use client"

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react"
import { AppBackground } from "../ds/app-background"
import { useAppConfig } from "@/lib/future-lens/config-context"
import { cn } from "@/lib/utils"
import { LiquidOrb, type LiquidOrbStatus } from "./liquid-orb"
import { LiquidText, type LiquidTextStatus } from "./liquid-text"
import { StepInputRenderer } from "./step-inputs/step-input-renderer"

/**
 * 音效合成引擎
 */
const playSound = (type: "confirm" | "click" | "back" | "pop", isMuted: boolean) => {
  if (isMuted || typeof window === "undefined") return

  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContext) return

    const ctx = new AudioContext()
    const now = ctx.currentTime

    const createTone = (
      freq: number,
      type: OscillatorType = "sine",
      duration = 0.1,
      startTime = 0,
      volume = 0.05,
    ) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = type
      osc.frequency.setValueAtTime(freq, now + startTime)
      gain.gain.setValueAtTime(volume, now + startTime)
      gain.gain.exponentialRampToValueAtTime(0.001, now + startTime + duration)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now + startTime)
      osc.stop(now + startTime + duration)
    }

    if (type === "confirm") {
      createTone(800, "sine", 0.2, 0, 0.08)
      createTone(1200, "sine", 0.3, 0.05, 0.05)
    } else if (type === "click") {
      createTone(600, "triangle", 0.05, 0, 0.03)
    } else if (type === "back") {
      createTone(500, "sine", 0.15, 0, 0.05)
      createTone(300, "sine", 0.15, 0.05, 0.05)
    } else if (type === "pop") {
      createTone(300, "sine", 0.1, 0, 0.02)
      createTone(500, "sine", 0.15, 0.02, 0.02)
    }
  } catch (e) {
    // 静默失败
  }
}

/**
 * Liquid AI Assistant - 优化版
 * 
 * 核心特性：
 * 1. 完整的文字动画和AI特效
 * 2. 用户控制的TTS播放
 * 3. 性能优化的动画
 * 4. 多模态交互
 */

export type AIAssistantStatus = "idle" | "listening" | "processing" | "speaking"

export interface AIAssistantStep {
  id: string
  type: "text" | "phone" | "choice" | "slider" | "custom" | "verify" | "multi-select" | "voice" | "date"
  getLines: (data: Record<string, any>) => string[]
  options?: Array<{ label: string; value: string; icon?: React.ReactNode }>
  next?: string | null
  onNext?: (data: Record<string, any>) => void | boolean
  onOptionSelect?: (value: string, fieldName: string, data: Record<string, any>) => void
  // 验证码相关回调
  onVerifyCodeSubmit?: (code: string) => void
  onVerifyCodeResend?: () => void
  verifyCodeCountdown?: number
  // 多选相关
  maxSelections?: number
  // 语音输入相关
  placeholder?: string
  // 日期选择相关
  dateMode?: "single" | "range"
  // 自定义输入组件（向后兼容，用于特殊场景）
  // 可以是 ReactNode 或返回 ReactNode 的函数
  customInput?: React.ReactNode | ((data: Record<string, any>) => React.ReactNode)
}

interface LiquidAIAssistantProps {
  steps: Record<string, AIAssistantStep>
  initialStepId: string
  onComplete?: (data: Record<string, any>) => void
  className?: string
  showNavigation?: boolean
  showMuteButton?: boolean
}

export function LiquidAIAssistant({
  steps,
  initialStepId,
  onComplete,
  className,
  showNavigation = true,
  showMuteButton = true,
}: LiquidAIAssistantProps) {
  const { language, theme } = useAppConfig()
  const [status, setStatus] = useState<AIAssistantStatus>("idle")
  
  // 监听主题变化，动态更新背景
  const [isDark, setIsDark] = useState(false)
  
  useEffect(() => {
    const updateTheme = () => {
      if (theme === "dark") {
        setIsDark(true)
      } else if (theme === "light") {
        setIsDark(false)
      } else {
        // system
        setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches)
      }
    }
    
    updateTheme()
    
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      const handleChange = () => setIsDark(mediaQuery.matches)
      mediaQuery.addEventListener("change", handleChange)
      return () => mediaQuery.removeEventListener("change", handleChange)
    }
  }, [theme])
  const [isMuted, setIsMuted] = useState(false)
  const [currentStepId, setCurrentStepId] = useState(initialStepId)
  const [history, setHistory] = useState<string[]>([])
  const [userData, setUserData] = useState<Record<string, any>>({})
  const [fullMessageQueue, setFullMessageQueue] = useState<string[]>([])
  const [currentDisplayLines, setCurrentDisplayLines] = useState<string[]>([])
  const [pageIndex, setPageIndex] = useState(0)
  const [showText, setShowText] = useState(false)
  const [isPlayingTTS, setIsPlayingTTS] = useState(false)
  const isMounted = useRef(true)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  // 初始化 - 移除，改用下面的 useEffect 统一处理

  // 资源清理
  useEffect(() => {
    return () => {
      isMounted.current = false
      window.speechSynthesis?.cancel()
    }
  }, [])

  // TTS 播放函数 - 用户控制
  const speakText = useCallback(
    (text: string, onEndCallback?: () => void) => {
      if (isMuted || !("speechSynthesis" in window)) {
        setTimeout(() => onEndCallback?.(), 1500)
        return
      }

      window.speechSynthesis.cancel()
      setIsPlayingTTS(true)

      const utterance = new SpeechSynthesisUtterance(text)
      utteranceRef.current = utterance
      utterance.lang = language === "zh" ? "zh-CN" : "en-US"
      utterance.rate = 1.0

      const handleEnd = () => {
        utteranceRef.current = null
        setIsPlayingTTS(false)
        if (isMounted.current) {
          setTimeout(() => {
            onEndCallback?.()
          }, 300)
        }
      }

      utterance.onend = handleEnd
      utterance.onerror = handleEnd

      const safetyTimeout = setTimeout(() => {
        if (isMounted.current) {
          window.speechSynthesis.cancel()
          handleEnd()
        }
      }, 8000 + text.length * 200)

      window.speechSynthesis.speak(utterance)

      return () => clearTimeout(safetyTimeout)
    },
    [isMuted, language],
  )

  // 手动播放当前文本的TTS
  const handlePlayTTS = useCallback(() => {
    if (isPlayingTTS) {
      window.speechSynthesis.cancel()
      setIsPlayingTTS(false)
      return
    }

    const textToRead = currentDisplayLines.join(". ")
    if (textToRead) {
      speakText(textToRead)
    }
  }, [currentDisplayLines, isPlayingTTS, speakText])

  // 步骤管理
  const startStep = useCallback(
    (stepId: string) => {
      const step = steps[stepId]
      if (!step) return

      const lines = step.getLines(userData)
      setFullMessageQueue(lines)
      setPageIndex(0)

      // 如果是 choice 或 text 类型，直接设置为 idle 状态，让用户操作
      if (step.type === "choice" || step.type === "text" || step.type === "phone" || step.type === "verify") {
        setStatus("idle")
        setCurrentDisplayLines(lines)
        setShowText(true)
        return
      }

      // 其他类型（slider, custom, multi-select, voice, date）也设置为 idle
      if (step.type === "slider" || step.type === "custom" || step.type === "multi-select" || step.type === "voice" || step.type === "date") {
        setStatus("idle")
        setCurrentDisplayLines(lines)
        setShowText(true)
        return
      }

      // 默认情况：speaking 状态（带动画）
      setStatus("speaking")
      setCurrentDisplayLines(lines.slice(0, 2))
      setShowText(false)

      setTimeout(() => {
        setShowText(true)
        playSound("pop", isMuted)
      }, 300)
    },
    [steps, userData, isMuted],
  )

  // 初始化步骤 - 使用 ref 存储 steps 避免依赖变化
  const stepsRef = useRef(steps)
  useEffect(() => {
    stepsRef.current = steps
  }, [steps])

  // 获取当前步骤 - 使用 useMemo 确保在正确的时机计算
  const currentStep = useMemo(() => {
    return stepsRef.current[currentStepId]
  }, [currentStepId, steps])

  // 计算总步骤数和当前步骤索引
  const totalSteps = useMemo(() => {
    return Object.keys(stepsRef.current).length
  }, [steps])

  const currentStepIndex = useMemo(() => {
    // 当前步骤索引 = history长度 + 1（当前步骤）
    return history.length + 1
  }, [history.length])

  // 步骤初始化 - 统一处理所有步骤的显示逻辑
  const isFirstRender = useRef(true)
  const prevStepIdRef = useRef<string | null>(null)
  
  useEffect(() => {
    if (currentStepId && stepsRef.current[currentStepId]) {
      const step = stepsRef.current[currentStepId]
      if (!step) return

      // 如果步骤ID没有变化，且不是首次渲染，不重新初始化（避免输入时触发）
      // 这是关键：防止输入时触发步骤重新初始化，导致输入框重新创建
      if (!isFirstRender.current && prevStepIdRef.current === currentStepId) {
        return
      }
      
      prevStepIdRef.current = currentStepId

      // 首次渲染时显示思考特效
      if (isFirstRender.current) {
        isFirstRender.current = false
        setStatus("processing")
        setShowText(false)
        setTimeout(() => {
          // 思考特效后显示内容
          const lines = step.getLines(userData)
          setFullMessageQueue(lines)
          setPageIndex(0)
          const linesToShow = lines.slice(0, 2)
          setCurrentDisplayLines(linesToShow)
          setStatus("speaking")
          
          setTimeout(() => {
            setShowText(true)
            playSound("pop", isMuted)
          }, 300)

          // 如果是需要用户输入的步骤，在文字显示后切换到 idle
          if (step.type === "text" || step.type === "phone" || step.type === "verify" || step.type === "choice" || step.type === "slider" || step.type === "custom" || step.type === "multi-select" || step.type === "voice" || step.type === "date") {
            setTimeout(() => {
              setStatus("idle")
            }, 1500)
          }
        }, 1000)
        return
      }

      // 非首次渲染：从 processing 状态过渡到 speaking
      const lines = step.getLines(userData)
      setFullMessageQueue(lines)
      setPageIndex(0)

      // 参考代码：所有步骤都先设置为 speaking 状态（从 processing 过渡过来）
      setStatus("speaking")
      const linesToShow = lines.slice(0, 2)
      setCurrentDisplayLines(linesToShow)
      setShowText(false) // 先隐藏文字

      // 参考代码：延迟 300ms 后显示文字
      const textTimer = setTimeout(() => {
        setShowText(true) // 参考代码：直接设置 showText，触发动画
        playSound("pop", isMuted)
      }, 300)

      // 参考代码：如果是需要用户输入的步骤，在文字显示后切换到 idle
      if (step.type === "text" || step.type === "phone" || step.type === "verify" || step.type === "choice" || step.type === "slider" || step.type === "custom" || step.type === "multi-select" || step.type === "voice" || step.type === "date") {
        // 等待文字显示动画完成后再切换到 idle
        const idleTimer = setTimeout(() => {
          setStatus("idle")
          // showText 保持 true，文字继续显示并保留流光效果
        }, 1500)
        return () => {
          clearTimeout(textTimer)
          clearTimeout(idleTimer)
        }
      }

      return () => {
        clearTimeout(textTimer)
      }
    }
  }, [currentStepId, isMuted]) // 只依赖 currentStepId 和 isMuted，避免 userData 变化时触发重新初始化

  // 初始化第一个步骤 - 确保在组件挂载时正确初始化
  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
      window.speechSynthesis?.cancel()
    }
  }, [])

  // 移除实时监听 - 输入组件现在是独立的，只在提交时通知父组件

  // 处理输入提交 - 从输入组件接收数据
  const handleInputSubmit = useCallback((data: Record<string, any>) => {
    if (status !== "idle" || !currentStep) return

    // 对于多选步骤，只更新数据，不触发步骤切换
    // 用户需要点击"下一步"按钮来确认选择
    if (currentStep.type === "multi-select") {
      const newData = { ...userData, ...data }
      setUserData(newData)
      return // 不触发步骤切换
    }

    playSound("confirm", isMuted)

    // 更新 userData（合并新数据）
    const newData = { ...userData, ...data }
    setUserData(newData)
    setHistory((prev) => [...prev, currentStepId])

    // 如果没有下一步且有 onNext，先执行验证
    if (!currentStep.next && currentStep.onNext) {
      try {
        const result = currentStep.onNext(newData)
        if (result === false) {
          return // 验证失败，保持在 idle 状态
        }
      } catch (error) {
        return
      }
    }

    // 验证通过，显示思考特效后再切换
    setStatus("processing")
    setShowText(false)

    setTimeout(() => {
      if (currentStep.next) {
        // 有下一步：切换步骤
        setCurrentStepId(currentStep.next)
        if (currentStep.onNext) {
          setTimeout(() => {
            currentStep.onNext?.(newData)
          }, 500)
        }
      } else {
        // 没有下一步：执行 onComplete
        onComplete?.(newData)
      }
    }, 1000) // 思考特效持续时间
  }, [status, currentStep, currentStepId, userData, isMuted, onComplete])

  const handlePrev = () => {
    if (status !== "idle" || history.length === 0) return

    playSound("back", isMuted)

    const prevStepId = history[history.length - 1]
    setHistory((prev) => prev.slice(0, -1))

    // 显示思考特效后再切换
    setStatus("processing")
    setShowText(false)
    setTimeout(() => {
      setCurrentStepId(prevStepId)
    }, 1000) // 思考特效持续时间
  }

  // 处理下一步 - 用于底部导航按钮
  const handleNext = () => {
    if (status !== "idle" || !currentStep || !currentStep.next) return

    // 对于有独立输入组件的步骤，它们会自己处理提交
    // 这个按钮主要用于某些特殊情况或作为备用选项
    // 但为了安全，我们只允许在没有输入要求的步骤中使用
    if (currentStep.type === "choice" || currentStep.type === "slider") {
      // 这些步骤类型通常通过选项选择自动推进，但如果有下一步且没有选择，可以手动触发
      // 为了安全，我们不做任何操作，让用户通过选择选项来推进
      return
    }

    // 对于多选步骤，检查是否有选择
    if (currentStep.type === "multi-select") {
      const selectedValues = userData[currentStepId]
      if (!selectedValues || (Array.isArray(selectedValues) && selectedValues.length === 0)) {
        // 没有选择，不允许继续
        return
      }
    }

    // 对于其他步骤类型，如果有下一步，触发切换
    playSound("confirm", isMuted)
    setHistory((prev) => [...prev, currentStepId])
    setStatus("processing")
    setShowText(false)

    // 准备数据
    const newData = { ...userData }
    
    // 执行 onNext 回调（如果有）
    if (currentStep.onNext) {
      try {
        const result = currentStep.onNext(newData)
        if (result === false) {
          // 验证失败，保持在 idle 状态
          setStatus("idle")
          setShowText(true)
          return
        }
      } catch (error) {
        setStatus("idle")
        setShowText(true)
        return
      }
    }

    setTimeout(() => {
      setCurrentStepId(currentStep.next!)
    }, 1000) // 思考特效持续时间
  }

  const handleOptionSelect = (value: string, fieldName: string) => {
    if (!currentStep) return

    playSound("confirm", isMuted)

    const newData = { ...userData, [fieldName]: value }
    setUserData(newData)
    setHistory((prev) => [...prev, currentStepId])

    // 无论是否有下一步，都先显示思考特效
    setStatus("processing")
    setShowText(false)

    setTimeout(() => {
      if (currentStep.next) {
        // 有下一步：切换步骤
        setCurrentStepId(currentStep.next)
        // 延迟执行 onOptionSelect 回调
        if (currentStep.onOptionSelect) {
          setTimeout(() => {
            currentStep.onOptionSelect?.(value, fieldName, newData)
          }, 500)
        }
      } else {
        // 没有下一步：执行 onComplete
        onComplete?.(newData)
      }
    }, 1000) // 思考特效持续时间
  }

  const transitionToStep = (nextStepId: string) => {
    if (!nextStepId) {
      setStatus("idle")
      return
    }

    const nextStep = stepsRef.current[nextStepId]
    if (!nextStep) return

    window.speechSynthesis?.cancel()
    setIsPlayingTTS(false)

    // 参考代码：所有步骤切换都使用 processing 状态和特效
    setStatus("processing")
    setShowText(false) // 参考代码：隐藏文字
    setTimeout(() => {
      if (nextStepId) {
        setCurrentStepId(nextStepId)
        // 新步骤会在 useEffect 中自动处理文字状态
      } else {
        setStatus("idle")
      }
    }, 1000)
  }

  // 翻页控制
  const totalPages = Math.ceil(fullMessageQueue.length / 2)
  const handleNextPage = () => {
    if (pageIndex < totalPages - 1) {
      setShowText(false)
      setTimeout(() => {
        const nextIndex = pageIndex + 1
        const nextLines = fullMessageQueue.slice(nextIndex * 2, nextIndex * 2 + 2)
        setPageIndex(nextIndex)
        setCurrentDisplayLines(nextLines)
        setShowText(true)
        playSound("pop", isMuted)
      }, 300)
    }
  }

  const handlePrevPage = () => {
    if (pageIndex > 0) {
      setShowText(false)
      setTimeout(() => {
        const prevIndex = pageIndex - 1
        const prevLines = fullMessageQueue.slice(prevIndex * 2, prevIndex * 2 + 2)
        setPageIndex(prevIndex)
        setCurrentDisplayLines(prevLines)
        setShowText(true)
        playSound("pop", isMuted)
      }, 300)
    }
  }

  // currentStep 已在上面通过 useMemo 定义

  if (!currentStep) {
    return (
      <div
        className="relative w-full h-screen bg-background overflow-hidden font-sans flex flex-col items-center justify-center p-4"
        suppressHydrationWarning
      >
        <div className="relative z-10 flex items-center gap-2 text-gray-400 dark:text-gray-500 text-sm">
          <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" />
          <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:100ms]" />
          <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:200ms]" />
        </div>
      </div>
    )
  }

  return (
    <div
      data-liquid-ai-assistant
      className={cn(
        // 参考代码：使用 h-[100dvh] 替代 h-screen，适配手机浏览器地址栏
        "relative w-full h-[100dvh] overflow-hidden font-sans flex flex-col items-center justify-center p-4 touch-manipulation",
        className,
      )}
      style={{
        // 从下到上（10-15%）的渐变：深色只在底部10-15%，更均匀的渐变
        // 使用更平滑的过渡点，让渐变更均匀
        background: isDark
          ? "linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.75) 6%, rgba(15, 23, 42, 0.5) 9%, rgba(15, 23, 42, 0.25) 12%, rgba(30, 41, 59, 0.1) 14%, rgba(30, 41, 59, 0.05) 16%, rgba(30, 41, 59, 0.02) 18%, transparent 20%, transparent 100%)"
          : "linear-gradient(to top, rgba(15, 23, 42, 0.08) 0%, rgba(15, 23, 42, 0.06) 6%, rgba(15, 23, 42, 0.04) 9%, rgba(15, 23, 42, 0.02) 12%, rgba(15, 23, 42, 0.01) 14%, rgba(255, 255, 255, 0.3) 16%, rgba(255, 255, 255, 0.7) 18%, rgba(255, 255, 255, 0.95) 20%, rgba(255, 255, 255, 1) 100%)",
        // 增强毛玻璃效果和磨砂感
        backdropFilter: "blur(40px) saturate(200%)",
        WebkitBackdropFilter: "blur(40px) saturate(200%)",
      } as React.CSSProperties}
      suppressHydrationWarning
    >
      {/* 光晕效果 - 非常轻微，只在底部10-15% */}
      {/* 底部光晕 - 非常轻微，尺寸更小，更集中 */}
      <div
        className="absolute bottom-[-1%] left-[30%] w-[30%] h-[18%] rounded-full pointer-events-none"
        style={{
          background: isDark
            ? "radial-gradient(circle at center, rgba(30, 58, 88, 0.1) 0%, rgba(51, 51, 71, 0.05) 35%, transparent 60%)"
            : "radial-gradient(circle at center, rgba(30, 58, 88, 0.04) 0%, rgba(51, 51, 71, 0.015) 35%, transparent 60%)",
          filter: "blur(100px)",
          WebkitFilter: "blur(100px)",
        }}
      />
      {/* 右下光晕 - 非常轻微，尺寸更小，更集中 */}
      <div
        className="absolute bottom-[1%] right-[25%] w-[25%] h-[16%] rounded-full pointer-events-none"
        style={{
          background: isDark
            ? "radial-gradient(circle at center, rgba(41, 98, 128, 0.08) 0%, rgba(30, 58, 88, 0.04) 45%, transparent 70%)"
            : "radial-gradient(circle at center, rgba(41, 98, 128, 0.03) 0%, rgba(30, 58, 88, 0.015) 45%, transparent 70%)",
          filter: "blur(90px)",
          WebkitFilter: "blur(90px)",
        }}
      />

      {/* 1. 液态光球 - 使用独立组件，根据状态切换动画，往上移 */}
      <div className="relative -mt-8">
        <LiquidOrb
          status={
            status === "processing"
              ? "processing" // 处理/思考状态：快速旋转并缩小
              : status === "speaking"
                ? "speaking" // 说话状态：明显放大
                : status === "idle"
                  ? "idle" // 输入状态：轻微呼吸
                  : "breathing" // 默认呼吸状态
          }
        />
      </div>

      {/* 2. 文字展示 - 使用独立组件，最佳复用版本 */}
      <LiquidText
        lines={currentDisplayLines}
        status={
          status === "processing"
            ? "switching" // 切换状态：显示加载指示器
            : status === "speaking" || status === "idle"
              ? "visible" // 可见状态
              : "hidden" // 隐藏状态
        }
        showText={showText}
        enableShimmer={true} // 始终启用流光效果
      />

      {/* 分页指示器 */}
      {status === "speaking" && totalPages > 1 && (
        <div className={cn("mt-4 flex justify-center gap-2 transition-opacity duration-500", showText ? "opacity-100" : "opacity-0")}>
          {Array.from({ length: totalPages }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1 rounded-full transition-all duration-500",
                i === pageIndex ? "w-6 bg-foreground" : "w-1.5 bg-muted-foreground/30",
              )}
            />
          ))}
        </div>
      )}

      {/* 3. 统一输入区域 - 完全透明，直接显示在背景上 */}
      <div
        className={cn(
          "relative mt-6 md:mt-8 transition-all duration-700 w-full max-w-lg min-h-[80px] md:min-h-[100px] flex justify-center items-start",
          status === "idle" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        )}
        style={{
          pointerEvents: status === "idle" ? "auto" : "none",
          // 确保完全透明，没有背景色、边框或阴影
          background: "transparent",
          border: "none",
          boxShadow: "none",
        }}
        suppressHydrationWarning
      >
        {/* 使用统一的输入渲染器 - 所有输入组件都是独立的 */}
        <StepInputRenderer
          step={currentStep}
          onSubmit={handleInputSubmit}
          onOptionSelect={handleOptionSelect}
          userData={userData}
        />
      </div>

      {/* 步骤进度指示器 */}
      <div
        className={cn(
          "absolute bottom-20 md:bottom-24 left-0 right-0 flex justify-center transition-opacity duration-500",
          status === "idle" ? "opacity-100" : "opacity-60"
        )}
        suppressHydrationWarning
      >
        <div className="px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm border border-border/50">
          <span className="text-xs text-muted-foreground font-medium">
            {language === "zh" ? `第 ${currentStepIndex} 步 / 共 ${totalSteps} 步` : `Step ${currentStepIndex} / ${totalSteps}`}
          </span>
        </div>
      </div>

      {/* 4. 底部导航控制栏 - 上一步、语音开关、下一步 */}
      {/* 参考代码：始终显示，通过按钮的 opacity 控制可见性 */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 flex justify-center items-center gap-8 md:gap-12 transition-all duration-700 pointer-events-none pb-[max(1rem,env(safe-area-inset-bottom))] z-30",
          // 参考代码：始终显示导航栏，不依赖 status
          "opacity-100 translate-y-0",
        )}
        suppressHydrationWarning
      >
        {/* 上一步按钮 - 参考代码：总是渲染，通过 opacity 控制显示 */}
        <button
          onClick={handlePrev}
          disabled={history.length === 0 || status !== "idle"}
          className={cn(
            "p-3 rounded-full text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 pointer-events-auto",
            (history.length === 0 || status !== "idle") && "opacity-0 pointer-events-none",
          )}
          title={language === "zh" ? "上一步" : "Previous"}
          suppressHydrationWarning
        >
          <ChevronLeft size={24} />
        </button>

        {/* 声音开关 - 始终在中间 */}
        {showMuteButton && (
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="text-gray-300 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 transition-colors p-3 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 pointer-events-auto"
            title={isMuted ? (language === "zh" ? "取消静音" : "Unmute") : language === "zh" ? "静音" : "Mute"}
            suppressHydrationWarning
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        )}

        {/* 下一步按钮 - 参考代码：总是渲染，通过 opacity 控制显示 */}
        <button
          onClick={handleNext}
          disabled={!currentStep?.next || status !== "idle"}
          className={cn(
            "p-3 rounded-full text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 pointer-events-auto",
            (!currentStep?.next || status !== "idle") && "opacity-0 pointer-events-none",
          )}
          title={language === "zh" ? "下一步" : "Next"}
          suppressHydrationWarning
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* CSS 动画已移到 globals.css，这里不需要了 */}
    </div>
  )
}
