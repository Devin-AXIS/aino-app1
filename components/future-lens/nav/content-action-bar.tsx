"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Star, ArrowUpRight, ImageIcon, Link2, MessageSquare, MoreHorizontal } from "lucide-react"
import { DesignTokens } from "@/lib/future-lens/design-tokens"
import { useAppConfig } from "@/lib/future-lens/config-context"
import { translations } from "@/lib/future-lens/i18n"
import { ModalDialog } from "@/components/future-lens/ds/modal-dialog"
import { cn } from "@/lib/utils"
import { SharedInputBase } from "../ai/shared-input-base"

export interface ContentActionBarProps {
  // 输入框
  placeholder?: string
  onSend?: (message: string) => void
  onVoiceInput?: () => void
  // 收藏
  bookmarked?: boolean
  onBookmark?: () => void
  // 分享
  shareUrl?: string
  shareTitle?: string
  onGenerateImage?: () => void
  className?: string
}

export function ContentActionBar({
  placeholder = "Ask AI...",
  onSend,
  onVoiceInput,
  bookmarked = false,
  onBookmark,
  shareUrl,
  shareTitle,
  onGenerateImage,
  className,
}: ContentActionBarProps) {
  const [inputValue, setInputValue] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isShareSheetOpen, setIsShareSheetOpen] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { language } = useAppConfig()
  const t = translations[language] || translations["zh"]

  const handleSend = () => {
    if (inputValue.trim() && onSend) {
      onSend(inputValue)
      setInputValue("")
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
    }
  }

  const handleVoiceInput = () => {
    setIsRecording(true)
    onVoiceInput?.()
    // 录音结束后重置状态
    setTimeout(() => {
      setIsRecording(false)
    }, 100)
  }

  const handleCopyLink = async () => {
    const url = shareUrl || window.location.href
    try {
      await navigator.clipboard.writeText(url)
      alert(t.share_copied || "Link copied")
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleSendSMS = () => {
    const url = shareUrl || window.location.href
    const text = shareTitle ? `${shareTitle} ${url}` : url
    window.location.href = `sms:?body=${encodeURIComponent(text)}`
  }

  const handleNativeShare = async () => {
    const url = shareUrl || window.location.href
    const title = shareTitle || document.title

    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: url,
        })
        setIsShareSheetOpen(false)
      } catch (err) {
        const error = err as Error
        // User cancelled share dialog - this is expected
        if (error.name === "AbortError") {
          return
        }
        // Permission denied or other error - fallback to copy link
        console.error("Native share failed:", error.message)
        handleCopyLink()
      }
    } else {
      // Browser doesn't support Web Share API - fallback to copy link
      handleCopyLink()
    }
  }

  const thirdPartyApps = [
    { id: "wechat", name: t.share_wechat || "WeChat", color: "bg-green-500" },
    { id: "moments", name: t.share_moments || "Moments", color: "bg-blue-500" },
    { id: "weibo", name: t.share_weibo || "Weibo", color: "bg-red-500" },
    { id: "qq", name: t.share_qq || "QQ", color: "bg-blue-600" },
    { id: "qzone", name: t.share_qzone || "Qzone", color: "bg-yellow-500" },
    { id: "douyin", name: t.share_douyin || "Douyin", color: "bg-black" },
  ]

  const handleThirdPartyShare = (appId: string) => {
    // 实际项目中这里会调用对应平台的 SDK
    setIsShareSheetOpen(false)
  }

  return (
    <>
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 flex justify-center items-center gap-4 px-6 z-50 pointer-events-none pb-[max(1rem,env(safe-area-inset-bottom))]",
          className,
        )}
      >
        <div className="flex items-center gap-4 pointer-events-auto w-full max-w-[600px]">
          {/* 使用 SharedInputBase 组件，确保样式和高度一致 */}
          <div className="flex-1 min-w-0">
            <SharedInputBase
              value={inputValue}
              onChange={setInputValue}
              onSubmit={handleSend}
              placeholder={placeholder}
              isRecording={isRecording}
              onStartRecording={onVoiceInput ? handleVoiceInput : undefined}
              onStopRecording={() => setIsRecording(false)}
              showMicButton={!!onVoiceInput}
              showSendButton={true}
              showVoiceModeButton={false}
              textareaRef={textareaRef}
            />
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* 收藏按钮 - 使用 Star 图标，高度与输入框一致 */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onBookmark}
              className={cn(
                "h-[44px] w-[44px] shrink-0",
                "rounded-[24px] flex items-center justify-center",
                "backdrop-blur-xl border border-border/50 shadow-sm",
                DesignTokens.transition.normal,
                bookmarked
                  ? "bg-blue-50 border-blue-200 text-blue-600"
                  : cn("bg-card/80 border-border/50", DesignTokens.text.secondary, "hover:bg-card/90"),
              )}
            >
              <Star size={18} strokeWidth={bookmarked ? 0 : 2} fill={bookmarked ? "currentColor" : "none"} />
            </motion.button>

            {/* 分享按钮 - 使用 ArrowUpRight 图标，高度与输入框一致 */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsShareSheetOpen(true)}
              className={cn(
                "h-[44px] w-[44px] shrink-0",
                "rounded-[24px] flex items-center justify-center",
                "bg-card/80 backdrop-blur-xl border border-border/50 shadow-sm",
                DesignTokens.text.secondary,
                "hover:bg-card/90 hover:text-primary",
                DesignTokens.transition.fast,
              )}
            >
              <ArrowUpRight size={18} strokeWidth={2} />
            </motion.button>
          </div>
        </div>
      </div>

      <ModalDialog isOpen={isShareSheetOpen} onClose={() => setIsShareSheetOpen(false)} variant="action-sheet">
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-4 gap-3">
            <button
              onClick={() => {
                onGenerateImage?.()
                setIsShareSheetOpen(false)
              }}
              className="flex flex-col items-center gap-1.5"
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-full",
                  "flex items-center justify-center",
                  "bg-card/70 backdrop-blur-xl",
                  "border border-border/50",
                  DesignTokens.text.secondary,
                  "hover:bg-card/90 hover:text-primary",
                  DesignTokens.transition.fast,
                  "active:scale-95",
                )}
              >
                <ImageIcon size={20} strokeWidth={2} />
              </div>
              <span className={cn("text-xs", DesignTokens.text.secondary)}>{t.share_generate_image || "Generate"}</span>
            </button>

            <button onClick={handleCopyLink} className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "w-12 h-12 rounded-full",
                  "flex items-center justify-center",
                  "bg-card/70 backdrop-blur-xl",
                  "border border-border/50",
                  DesignTokens.text.secondary,
                  "hover:bg-card/90 hover:text-primary",
                  DesignTokens.transition.fast,
                  "active:scale-95",
                )}
              >
                <Link2 size={20} strokeWidth={2} />
              </div>
              <span className={cn("text-xs", DesignTokens.text.secondary)}>{t.share_copy_link || "Copy Link"}</span>
            </button>

            <button onClick={handleSendSMS} className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "w-12 h-12 rounded-full",
                  "flex items-center justify-center",
                  "bg-card/70 backdrop-blur-xl",
                  "border border-border/50",
                  DesignTokens.text.secondary,
                  "hover:bg-card/90 hover:text-primary",
                  DesignTokens.transition.fast,
                  "active:scale-95",
                )}
              >
                <MessageSquare size={20} strokeWidth={2} />
              </div>
              <span className={cn("text-xs", DesignTokens.text.secondary)}>{t.share_send_sms || "Send SMS"}</span>
            </button>

            <button onClick={handleNativeShare} className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "w-12 h-12 rounded-full",
                  "flex items-center justify-center",
                  "bg-card/70 backdrop-blur-xl",
                  "border border-border/50",
                  DesignTokens.text.secondary,
                  "hover:bg-card/90 hover:text-primary",
                  DesignTokens.transition.fast,
                  "active:scale-95",
                )}
              >
                <MoreHorizontal size={20} strokeWidth={2} />
              </div>
              <span className={cn("text-xs", DesignTokens.text.secondary)}>{t.share_more || "More"}</span>
            </button>
          </div>

          <div className="border-t border-border/50" />

          <div className="overflow-x-auto -mx-4 px-4 scrollbar-hide">
            <div className="flex gap-3 min-w-max">
              {thirdPartyApps.map((app) => (
                <button
                  key={app.id}
                  onClick={() => handleThirdPartyShare(app.id)}
                  className="flex flex-col items-center gap-1.5 w-[72px]"
                >
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full",
                      "flex items-center justify-center",
                      app.color,
                      "text-white font-semibold text-lg",
                      DesignTokens.transition.fast,
                      "active:scale-95",
                    )}
                  >
                    {app.name.charAt(0)}
                  </div>
                  <span className={cn("text-xs text-center", DesignTokens.text.secondary)}>{app.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </ModalDialog>
    </>
  )
}
