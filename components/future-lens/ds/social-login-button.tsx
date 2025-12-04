"use client"

import { PillButton } from "./pill-button"
import type React from "react"

// Google 图标 SVG
export const GoogleIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
    <path
      d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
      fill="#4285F4"
    />
    <path
      d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
      fill="#34A853"
    />
    <path
      d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
      fill="#FBBC05"
    />
    <path
      d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
      fill="#EA4335"
    />
  </svg>
)

// 微信图标 SVG
export const WeChatIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 4.152-2.11 6.44-1.636.13-1.988-.665-3.897-2.133-5.303C13.666 2.958 11.285 2.188 8.691 2.188zm-1.7 5.7c.712 0 1.29.577 1.29 1.29s-.578 1.29-1.29 1.29-1.29-.577-1.29-1.29.578-1.29 1.29-1.29zm4.813 0c.712 0 1.29.577 1.29 1.29s-.578 1.29-1.29 1.29-1.29-.577-1.29-1.29.577-1.29 1.29-1.29z"
      fill="#07C160"
    />
    <path
      d="M18.405 5.155c-2.788 0-5.25 1.88-6.011 4.552-.11.384-.164.78-.164 1.188 0 .17.014.336.042.5-.687-.027-1.352-.197-1.993-.53-.496-.26-.784-.736-.784-1.258 0-.83.677-1.507 1.507-1.507.149 0 .293.024.432.065a8.262 8.262 0 0 1 4.69-1.392c.64 0 1.27.08 1.87.23.198-1.863-.48-3.65-1.835-4.99C13.666 2.958 11.285 2.188 8.691 2.188c-.276 0-.543.013-.811.05C10.13.756 13.897.108 17.437 1.299c3.54 1.19 6.063 4.48 6.063 8.23 0 2.212-1.17 4.203-3.002 5.55a.59.59 0 0 1-.213.665l.39 1.48c.019.07.048.141.048.213 0 .163-.13.295-.29.295a.326.326 0 0 1-.167-.054l-1.903-1.114a.864.864 0 0 0-.717-.098c.857-2.578-.157-4.972-1.932-6.446z"
      fill="#07C160"
    />
  </svg>
)

export type SocialProvider = "google" | "wechat" | "phone"

interface SocialLoginButtonProps {
  provider: SocialProvider
  onClick?: () => void
  disabled?: boolean
  className?: string
  label?: string
}

/**
 * SocialLoginButton - 社交登录按钮组件
 * 
 * 根据参考图（Spotify 风格）设计：
 * - 白色背景，灰色边框
 * - 左侧显示平台图标
 * - 右侧显示文字
 */
export function SocialLoginButton({
  provider,
  onClick,
  disabled = false,
  className,
  label,
}: SocialLoginButtonProps) {
  const getIcon = () => {
    switch (provider) {
      case "google":
        return <GoogleIcon size={18} />
      case "wechat":
        return <WeChatIcon size={18} />
      case "phone":
        return null // 手机号使用 Lucide 图标
      default:
        return null
    }
  }

  const getDefaultLabel = () => {
    switch (provider) {
      case "google":
        return "Continue with Google"
      case "wechat":
        return "Continue with WeChat"
      case "phone":
        return "Phone Registration"
      default:
        return ""
    }
  }

  return (
    <PillButton
      variant="secondary"
      icon={getIcon()}
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {label || getDefaultLabel()}
    </PillButton>
  )
}

