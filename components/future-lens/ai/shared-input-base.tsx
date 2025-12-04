"use client"

import { useRef, useEffect } from "react"
import { Mic, ArrowUp, Check, AudioLines } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { AudioWaveform } from "./audio-waveform"

interface SharedInputBaseProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  placeholder?: string
  isRecording?: boolean
  onStartRecording?: () => void
  onStopRecording?: () => void
  showMicButton?: boolean
  showSendButton?: boolean
  showVoiceModeButton?: boolean
  isVoiceModeActive?: boolean
  onToggleVoiceMode?: () => void
  className?: string
  textareaRef?: React.RefObject<HTMLTextAreaElement>
}

/**
 * 共用的输入框基础组件
 * 用于对话输入框和语音输入步骤组件
 * 确保样式和交互完全一致
 */
export function SharedInputBase({
  value,
  onChange,
  onSubmit,
  placeholder = "询问任何问题",
  isRecording = false,
  onStartRecording,
  onStopRecording,
  showMicButton = true,
  showSendButton = true,
  showVoiceModeButton = false,
  isVoiceModeActive = false,
  onToggleVoiceMode,
  className,
  textareaRef: externalTextareaRef,
}: SharedInputBaseProps) {
  const internalTextareaRef = useRef<HTMLTextAreaElement>(null)
  const textareaRef = externalTextareaRef || internalTextareaRef

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      const scrollHeight = textareaRef.current.scrollHeight
      const maxHeight = 120
      textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`
    }
  }, [value])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (e.nativeEvent.isComposing) {
        return
      }
      if (e.shiftKey) {
        return
      }
      e.preventDefault()
      onSubmit()
    }
  }

  return (
    <div className={cn(
      "flex-1 rounded-[24px] bg-card/80 backdrop-blur-xl border border-border/50 transition-all duration-300",
      isRecording && "ring-2 ring-blue-500/20",
      "shadow-lg shadow-black/10 dark:shadow-white/5",
      className
    )}>
      <div className="flex items-center gap-2 px-3 py-2">
        {/* Input Area */}
        <div className="flex-1 flex items-center min-h-[28px] max-h-[120px] overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {isRecording ? (
            <div className="flex-1 flex items-center justify-center">
              <AudioWaveform isActive={true} />
            </div>
          ) : (
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              rows={1}
              className="flex-1 w-full resize-none bg-transparent text-foreground placeholder:text-muted-foreground/60 focus:outline-none caret-blue-500 py-1 text-[16px] leading-[1.5]"
              style={{ 
                minHeight: "24px",
                maxHeight: "120px",
              }}
            />
          )}
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {isRecording ? (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onStopRecording}
              className="h-7 w-7 rounded-full bg-foreground text-background flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              <Check size={16} strokeWidth={3} />
            </motion.button>
          ) : (
            <>
              {/* Mic Button - 当没有输入内容时显示 */}
              {!value.trim() && showMicButton && onStartRecording && (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={onStartRecording}
                  className="h-7 w-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <Mic size={18} strokeWidth={2} />
                </motion.button>
              )}
              
              {/* Send Button - 当有输入内容时显示 */}
              {value.trim() && showSendButton && (
                <motion.button
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onSubmit}
                  className="h-7 w-7 rounded-full bg-foreground text-background flex items-center justify-center hover:opacity-90 transition-opacity"
                >
                  <ArrowUp size={16} strokeWidth={3} />
                </motion.button>
              )}

              {/* Voice Mode Button - 语音通话按钮，只在没有输入内容时显示 */}
              {!value.trim() && showVoiceModeButton && onToggleVoiceMode && (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={onToggleVoiceMode}
                  className={cn(
                    "h-7 w-7 rounded-full flex items-center justify-center transition-colors",
                    isVoiceModeActive
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <AudioLines size={18} />
                </motion.button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

