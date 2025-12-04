"use client"

import { useState, useRef, useEffect } from "react"
import { SharedInputBase } from "../shared-input-base"

interface VoiceInputStepProps {
  onSubmit: (text: string) => void
  placeholder?: string
}

/**
 * 语音输入步骤组件 - 完全独立，内部状态管理
 * 直接使用对话输入框的共用基础组件，确保样式完全一致
 */
export function VoiceInputStep({ onSubmit, placeholder = "说话或输入..." }: VoiceInputStepProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [text, setText] = useState("")
  const [isSupported, setIsSupported] = useState(false)
  const recognitionRef = useRef<any>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // 检查浏览器是否支持语音识别
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (SpeechRecognition) {
      setIsSupported(true)
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = "zh-CN"

      recognition.onresult = (event: any) => {
        try {
          if (event.results && event.results.length > 0 && event.results[0][0]) {
            const transcript = event.results[0][0].transcript
            setText(transcript)
            setIsRecording(false)
          }
        } catch (error) {
          console.warn("Error processing speech recognition result:", error)
          setIsRecording(false)
        }
      }

      recognition.onerror = (event: any) => {
        // 清除之前的延迟
        if (errorTimeoutRef.current) {
          clearTimeout(errorTimeoutRef.current)
        }
        
        // 静默处理权限错误，不显示在控制台
        if (event.error === "not-allowed") {
          // 权限被拒绝，延迟重置状态，让用户能看到录音状态
          errorTimeoutRef.current = setTimeout(() => {
            setIsRecording(false)
          }, 500)
          return
        }
        
        // 其他错误立即重置
        setIsRecording(false)
        
        // 其他错误才记录
        if (event.error !== "aborted" && event.error !== "no-speech") {
          console.warn("Speech recognition error:", event.error)
        }
      }

      recognition.onend = () => {
        setIsRecording(false)
      }

      recognitionRef.current = recognition
    }
    
    // Cleanup
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current)
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (error) {
          // Ignore cleanup errors
        }
        recognitionRef.current = null
      }
    }
  }, [])

  // Auto-resize 由 SharedInputBase 内部处理

  const handleStartRecording = () => {
    if (!recognitionRef.current) {
      console.warn("Speech recognition not available")
      return
    }
    
    if (isRecording) {
      return
    }

    // 清除之前的延迟
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current)
      errorTimeoutRef.current = null
    }

    try {
      // 先停止之前的识别（如果存在）
      try {
        recognitionRef.current.stop()
      } catch (e) {
        // 忽略停止错误，可能已经停止了
      }
      
      // 立即设置状态并开始识别
      setIsRecording(true)
      setText("")
      
      // 使用 requestAnimationFrame 确保状态更新后再开始
      requestAnimationFrame(() => {
        if (recognitionRef.current) {
          try {
            recognitionRef.current.start()
          } catch (error: any) {
            // 静默处理常见错误
            const errorName = error?.name || ""
            const errorMessage = error?.message || ""
            
            // 如果是权限错误，延迟重置状态，让用户能看到录音状态
            if (
              errorMessage.includes("not-allowed") ||
              errorMessage.includes("permission")
            ) {
              errorTimeoutRef.current = setTimeout(() => {
                setIsRecording(false)
              }, 500)
              return
            }
            
            // 忽略这些常见错误：已经在运行
            if (
              errorName === "InvalidStateError" ||
              errorMessage.includes("already started")
            ) {
              setIsRecording(false)
              return
            }
            
            // 其他错误才记录
            console.warn("Error starting speech recognition:", error)
            setIsRecording(false)
          }
        }
      })
    } catch (error) {
      console.error("Error starting speech recognition:", error)
      setIsRecording(false)
    }
  }

  const handleStopRecording = () => {
    if (!recognitionRef.current || !isRecording) {
      return
    }

    try {
      recognitionRef.current.stop()
      setIsRecording(false)
    } catch (error) {
      console.error("Error stopping speech recognition:", error)
      setIsRecording(false)
    }
  }

  const handleSubmit = () => {
    if (text.trim()) {
      onSubmit(text.trim())
      setText("")
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
    }
  }

  return (
    <div className="w-full">
      {/* 直接使用对话输入框的共用基础组件，确保样式完全一致 */}
      <SharedInputBase
        value={text}
        onChange={setText}
        onSubmit={handleSubmit}
        placeholder={placeholder}
        isRecording={isRecording}
        onStartRecording={isSupported ? handleStartRecording : undefined}
        onStopRecording={handleStopRecording}
        showMicButton={isSupported}
        showSendButton={true}
        showVoiceModeButton={false}
        textareaRef={textareaRef}
      />
    </div>
  )
}

