"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback, memo } from "react"
import { Plus, Mic, AudioLines, ArrowUp, Check, ImageIcon, Camera, FileText, Globe, X } from "lucide-react"
import { AudioWaveform } from "./audio-waveform"
import { cn } from "@/lib/utils"
import { useConfig } from "@/lib/future-lens/config-context"
import { translations } from "@/lib/future-lens/i18n"
import { motion, AnimatePresence } from "framer-motion"
import { ModalDialog } from "../ds/modal-dialog"
// Removed useKeyboardAware - keyboard handling is now done via CSS layout

interface ChatInputProps {
  onSend?: (message: string) => void
  onSendWithAttachments?: (message: string, attachments: Array<{ type: "image" | "video" | "file"; url: string; name?: string }>) => void
  onVoiceInput?: () => void
  onFileUpload?: () => void
  placeholder?: string
  className?: string
}

function ChatInputComponent({ onSend, onVoiceInput, onFileUpload, placeholder, className }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isVoiceModeActive, setIsVoiceModeActive] = useState(false)
  const [showAttachments, setShowAttachments] = useState(false)
  const [isWebSearchEnabled, setIsWebSearchEnabled] = useState(true)
  const { language, textScale } = useConfig()
  const t = translations[language] || translations["zh"]
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSend = useCallback(() => {
    if (message.trim()) {
      onSend?.(message)
      setMessage("")
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
    }
  }, [message, onSend])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      // Don't submit if IME composition is in progress
      if (e.nativeEvent.isComposing) {
        return
      }

      if (e.shiftKey) {
        // Allow newline with Shift+Enter
        return
      }

      // Submit on Enter (without Shift)
      e.preventDefault()
      handleSend()
    }
  }, [handleSend])

  const toggleRecording = useCallback(() => {
    setIsRecording((prev) => {
      if (!prev) {
        setMessage("")
      }
      return !prev
    })
  }, [])

  const confirmRecording = useCallback(() => {
    setIsRecording(false)
    onVoiceInput?.()
  }, [onVoiceInput])

  const toggleVoiceMode = useCallback(() => {
    setIsVoiceModeActive((prev) => !prev)
  }, [])

  const handleAttachmentClick = useCallback(() => {
    setShowAttachments(true)
    onFileUpload?.()
  }, [onFileUpload])

  // Auto-resize textarea - using CSS field-sizing for better performance
  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to get correct scrollHeight
      textareaRef.current.style.height = "auto"
      const scrollHeight = textareaRef.current.scrollHeight
      // Set max height to 160px (about 6 lines)
      const maxHeight = 160
      textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`
    }
  }, [message])

  return (
    <>
      {/* Hidden file input - for direct file selection if needed */}
      <input
        className="pointer-events-none fixed -top-4 -left-4 size-0.5 opacity-0"
        multiple
        ref={fileInputRef}
        tabIndex={-1}
        type="file"
        onChange={(e) => {
          // Handle file selection if needed
          if (e.target.files && e.target.files.length > 0) {
            onFileUpload?.()
          }
        }}
      />

      {/* 参考 ChatGPT：➕在外部，输入框和按钮在一个容器内 */}
      <div className={cn("flex items-center gap-2 w-full", className)}>
        {/* Left: Plus Button (Attachments) - 悬浮在外面，增强悬浮感 */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowAttachments(true)}
          className="flex-shrink-0 h-[44px] w-[44px] rounded-full bg-card/80 backdrop-blur-xl border border-border/50 text-foreground shadow-lg shadow-black/10 dark:shadow-white/5 flex items-center justify-center hover:bg-card/90 transition-colors"
          aria-label={t.attach_file}
          type="button"
        >
          <Plus size={22} strokeWidth={2} />
        </motion.button>

        {/* Center: Input Container - 输入框和按钮都在这个容器内，使用毛玻璃效果，悬浮感 */}
        <div className={cn(
          "flex-1 rounded-[24px] bg-card/80 backdrop-blur-xl border border-border/50 transition-all duration-300",
          isRecording && "ring-2 ring-blue-500/20",
          "shadow-lg shadow-black/10 dark:shadow-white/5"
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
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholder || "询问任何问题"}
                  rows={1}
                  className="flex-1 w-full resize-none bg-transparent text-foreground placeholder:text-muted-foreground/60 focus:outline-none caret-blue-500 py-1 text-[16px] leading-[1.5]"
                  style={{ 
                    minHeight: "24px",
                    maxHeight: "120px",
                  }}
                />
              )}
            </div>

            {/* Right: Action Buttons - 在输入框容器内 */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {isRecording ? (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={confirmRecording}
                  className="h-7 w-7 rounded-full bg-foreground text-background flex items-center justify-center hover:opacity-90 transition-opacity"
                >
                  <Check size={16} strokeWidth={3} />
                </motion.button>
              ) : (
                <>
                  {/* Mic Button - 当没有输入内容时显示 */}
                  {!message.trim() && (
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={toggleRecording}
                      className="h-7 w-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      aria-label={t.voice_input}
                    >
                      <Mic size={18} strokeWidth={2} />
                    </motion.button>
                  )}
                  
                  {/* Send Button - 当有输入内容时显示 */}
                  {message.trim() && (
                    <motion.button
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleSend}
                      className="h-7 w-7 rounded-full bg-foreground text-background flex items-center justify-center hover:opacity-90 transition-opacity"
                    >
                      <ArrowUp size={16} strokeWidth={3} />
                    </motion.button>
                  )}

                  {/* Voice Mode Button - 语音通话按钮，只在没有输入内容时显示 */}
                  {!message.trim() && (
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={toggleVoiceMode}
                      className={cn(
                        "h-7 w-7 rounded-full flex items-center justify-center transition-colors",
                        isVoiceModeActive
                          ? "bg-foreground text-background"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                      aria-label="Voice Mode"
                    >
                      <AudioLines size={18} />
                    </motion.button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Attachment Action Sheet */}
      <ModalDialog
        isOpen={showAttachments}
        onClose={() => setShowAttachments(false)}
        variant="action-sheet"
        level="OVERLAY"
      >
        <div className="flex flex-col gap-5 pt-1">
          {/* Header */}
          <div className="flex items-center justify-between px-1">
            <h3 className="text-base font-medium text-foreground">{t.source}</h3>
            <button
              onClick={() => setShowAttachments(false)}
              className="p-1.5 rounded-full bg-muted text-muted-foreground hover:bg-secondary transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Media Buttons Row - Scaled down 30% */}
          <div className="grid grid-cols-3 gap-3 px-1">
            <AttachmentButton icon={<ImageIcon size={20} strokeWidth={1.5} />} label={t.image} />
            <AttachmentButton icon={<Camera size={20} strokeWidth={1.5} />} label={t.camera} />
            <AttachmentButton icon={<FileText size={20} strokeWidth={1.5} />} label={t.file} />
          </div>

          {/* Search Options List */}
          <div className="flex flex-col gap-1">
            <SearchOptionItem
              icon={<Globe size={16} />}
              title={t.web_search}
              subtitle={t.search_internet}
              isEnabled={isWebSearchEnabled}
              onToggle={() => setIsWebSearchEnabled(!isWebSearchEnabled)}
              activeColor="bg-teal-600"
            />
          </div>
        </div>
      </ModalDialog>
    </>
  )
}

// Memoized component for performance optimization
export const ChatInput = memo(ChatInputComponent, (prevProps, nextProps) => {
  return (
    prevProps.placeholder === nextProps.placeholder &&
    prevProps.className === nextProps.className
  )
})

function AttachmentButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex flex-col items-center gap-1.5 group">
      <div className="w-full aspect-[4/3] rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-secondary transition-colors border border-border/50">
        {icon}
      </div>
      <span className="text-[11px] text-muted-foreground font-medium">{label}</span>
    </button>
  )
}

function SearchOptionItem({
  icon,
  title,
  subtitle,
  isEnabled,
  onToggle,
  activeColor = "bg-primary",
}: {
  icon: React.ReactNode
  title: string
  subtitle: string
  isEnabled: boolean
  onToggle: () => void
  activeColor?: string
}) {
  return (
    <div className="flex items-center justify-between py-2.5 px-1 group cursor-pointer" onClick={onToggle}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-secondary transition-colors">
          {icon}
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-foreground">{title}</span>
          <span className="text-[10px] text-muted-foreground">{subtitle}</span>
        </div>
      </div>

      {/* Custom Switch - Scaled down */}
      <div
        className={cn(
          "w-10 h-6 rounded-full relative transition-colors duration-300 ease-in-out",
          isEnabled ? activeColor : "bg-input",
        )}
      >
        <motion.div
          className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm"
          animate={{ x: isEnabled ? 16 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </div>
    </div>
  )
}
