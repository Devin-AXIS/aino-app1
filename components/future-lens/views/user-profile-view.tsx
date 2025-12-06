"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import {
  Settings,
  Bell,
  FileText,
  ChevronRight,
  LayoutGrid,
  Sparkles,
  Zap,
  LogOut,
  Smartphone,
  Lock,
  User,
  Camera,
  KeyRound,
  PenLine,
  Palette,
  Check,
  BarChart3,
} from "lucide-react"
import { GlassPanel } from "../ds/glass-panel"
import { DesignTokens } from "@/lib/future-lens/design-tokens"
import { AIOrb } from "../ui/ai-orb"
import { useAppConfig } from "@/lib/future-lens/config-context"
import { translations } from "@/lib/future-lens/i18n"
import { useToast } from "@/hooks/use-toast"
import { changePassword, setPassword, updateUserInfo } from "@/lib/aino-sdk/user-api"
import { getCurrentUserPointsAccount } from "@/lib/aino-sdk/points-api"
import { ModalDialog } from "../ds/modal-dialog"
import { TextInput } from "../ds/text-input"
import { MobileInput } from "../ds/mobile-input"
import { VerifyCodeInput } from "../ds/verify-code-input"
import { PillButton } from "../ds/pill-button"
import { Switch } from "../ds/switch"
import { UpgradeDialog } from "../membership/upgrade-dialog"

interface UserProfileViewProps {
  onNavigate: (tabId: string) => void
  onOpenArchive: () => void
  onOpenInvite: () => void
  onOpenCharts?: () => void // Added charts callback prop
}

export function UserProfileView({ onNavigate, onOpenArchive, onOpenInvite, onOpenCharts }: UserProfileViewProps) {
  const router = useRouter()
  const { language, setLanguage, textScale, setTextScale, theme, setTheme } = useAppConfig() // Added theme and setTheme
  const t = translations[language] || translations["zh"]
  const { toast } = useToast()

  // 从 localStorage 读取用户信息
  const [userInfo, setUserInfo] = useState<{ name?: string; phone?: string; email?: string; hasPassword?: boolean; id?: string } | null>(null)
  // 积分账户信息
  const [pointsBalance, setPointsBalance] = useState<number>(0)
  const [pointsName, setPointsName] = useState<string>('积分') // 积分名称，默认为"积分"
  
  // 辅助函数：从 i18n 对象中提取姓名
  const getNameFromI18n = (name: any, currentLanguage: string): string => {
    if (!name) return ''
    if (typeof name === 'string') return name
    if (typeof name === 'object' && name !== null) {
      // 如果是 i18n 对象 { zh: "...", en: "..." }
      return name[currentLanguage] || name.zh || name.en || ''
    }
    return ''
  }
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('aino_user')
      if (userStr) {
        try {
          const user = JSON.parse(userStr)
          // 处理姓名：可能是字符串或 i18n 对象
          const userName = getNameFromI18n(user.name, language) || user.phone || '用户'
          // 检查用户是否有密码（从用户信息中判断，或者默认为false，因为注册时使用验证码作为临时密码）
          // 注意：这里假设如果用户没有明确设置密码，hasPassword 为 false
          // 实际应该从后端获取，但为了简化，我们假设注册用户默认没有设置密码
          setUserInfo({
            name: userName,
            phone: user.phone,
            email: user.email,
            hasPassword: user.hasPassword !== undefined ? user.hasPassword : false, // 默认没有设置密码
            id: user.id || user.phone, // 用户ID，默认是手机号
          })
          
          // 获取积分账户信息
          const userId = user.userId || (user.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(user.id) ? user.id : null)
          if (userId) {
            getCurrentUserPointsAccount('points').then((account) => {
              setPointsBalance(account.balance || 0)
              // 使用真实的积分名称，优先使用 i18n 格式，根据当前语言显示
              if (account.pointsNameI18n) {
                const currentLang = (language === 'zh' || (language as string) === 'zh-CN') ? 'zh' : 'en'
                setPointsName(account.pointsNameI18n[currentLang] || account.pointsNameI18n.zh || account.pointsName || '积分')
              } else {
                setPointsName(account.pointsName || '积分')
              }
            }).catch((error) => {
              console.error('获取积分账户失败:', error)
              // 失败时保持默认值
              setPointsBalance(0)
              setPointsName('积分')
            })
          }
        } catch (e) {
          console.error('解析用户信息失败:', e)
        }
      }
    }
  }, [language]) // 添加 language 依赖，当语言切换时重新解析

  // 刷新积分余额的函数
  const refreshPointsBalance = async () => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('aino_user')
      if (userStr) {
        try {
          const user = JSON.parse(userStr)
          const userId = user.userId || (user.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(user.id) ? user.id : null)
          if (userId) {
            try {
              const account = await getCurrentUserPointsAccount('points')
              setPointsBalance(account.balance || 0)
              // 同时更新积分名称，优先使用 i18n 格式
              if (account.pointsNameI18n) {
                const currentLang = (language === 'zh' || language === 'zh-CN') ? 'zh' : 'en'
                setPointsName(account.pointsNameI18n[currentLang] || account.pointsNameI18n.zh || account.pointsName || '积分')
              } else {
                setPointsName(account.pointsName || '积分')
              }
            } catch (error) {
              console.error('刷新积分余额失败:', error)
            }
          }
        } catch (e) {
          console.error('解析用户信息失败:', e)
        }
      }
    }
  }

  // 定期刷新积分余额（每30秒）
  useEffect(() => {
    const interval = setInterval(() => {
      refreshPointsBalance()
    }, 30000) // 30秒刷新一次

    return () => clearInterval(interval)
  }, [])

  // 当页面获得焦点时刷新积分余额
  useEffect(() => {
    const handleFocus = () => {
      refreshPointsBalance()
    }
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false)
  const [isMobileBindOpen, setIsMobileBindOpen] = useState(false) // Added Mobile Bind state
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false) // Added Change Password state
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [isNotificationSettingsOpen, setIsNotificationSettingsOpen] = useState(false) // New state for notification settings modal
  
  // 编辑个人资料的状态
  const [editName, setEditName] = useState("")
  const [editAvatar, setEditAvatar] = useState("")
  const [editId, setEditId] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  // 打开编辑个人资料时，初始化表单数据
  useEffect(() => {
    if (isEditProfileOpen && userInfo) {
      setEditName(userInfo.name || '')
      setEditId(userInfo.id || userInfo.phone || '')
      // 从localStorage获取头像
      if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem('aino_user')
        if (userStr) {
          try {
            const user = JSON.parse(userStr)
            setEditAvatar(user.avatar || '')
            setEditId(user.id || user.phone || '')
          } catch (e) {
            console.error('解析用户信息失败:', e)
          }
        }
      }
    }
  }, [isEditProfileOpen, userInfo])
  const [isPersonalizationOpen, setIsPersonalizationOpen] = useState(false) // Added personalization state

  const [notifySystem, setNotifySystem] = useState(true)
  const [notifyFollowing, setNotifyFollowing] = useState(true)
  const [notifyAssistant, setNotifyAssistant] = useState(true)

  const openSubModal = (setter: (val: boolean) => void) => {
    setIsSettingsOpen(false)
    setTimeout(() => setter(true), 100) // Small delay to allow exit animation
  }

  // Helper for consistent dynamic sizing matching InsightCard
  const fSize = (base: number) => {
    // For large text (20px+), limit scaling to avoid layout breaking
    if (base >= 20) {
      return `${base * Math.min(textScale, 1.05)}px`
    }
    return `${base * textScale}px`
  }

  return (
    <div className="h-full overflow-y-auto pt-20 pb-32 scrollbar-hide">
      {/* Header Section - Clickable to edit profile */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-6 mb-8 px-5"
      >
        <div className="flex items-center gap-4 group">
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditProfileOpen(true)}
              className="w-11 h-11 rounded-full bg-gradient-to-tr from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700 p-0.5 ring-1 ring-border shadow-xl shadow-slate-300/40 dark:shadow-none group-hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                {(() => {
                  // 从localStorage获取头像
                  if (typeof window !== 'undefined') {
                    const userStr = localStorage.getItem('aino_user')
                    if (userStr) {
                      try {
                        const user = JSON.parse(userStr)
                        if (user.avatar) {
                          return <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        }
                      } catch (e) {
                        // 忽略解析错误
                      }
                    }
                  }
                  return (
                    <div className="w-full h-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-lg">
                      👾
                    </div>
                  )
                })()}
              </div>
            </motion.button>
            <div className="absolute -bottom-0.5 -right-0.5 bg-background rounded-full p-0.5 shadow-sm pointer-events-none">
              <div className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-background" />
            </div>
          </div>

          <div className="flex-1">
            <h2
              className={`${DesignTokens.typography.title} font-bold text-foreground transition-colors`}
              style={{ fontSize: fSize(20) }}
            >
              {userInfo?.name || '用户'}
            </h2>
            <p className={`${DesignTokens.typography.caption} text-muted-foreground`} style={{ fontSize: fSize(13) }}>
              {userInfo?.id ? `@${userInfo.id}` : userInfo?.phone ? `@${userInfo.phone}` : '@Future_Architect'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Membership/Asset Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <GlassPanel
          intensity="high"
          className={`w-full min-h-[200px] h-auto rounded-2xl ${DesignTokens.layout.cardPadding} relative overflow-hidden group cursor-pointer`}
          onClick={() => setIsUpgradeDialogOpen(true)}
        >
          {/* Background Decorative Elements - Restored depth with a subtle Blue/Cyan gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent dark:from-blue-400/10 dark:via-cyan-400/5" />
          <div className="absolute -right-8 -bottom-8 opacity-[0.08] text-blue-500/30 transform rotate-12 group-hover:scale-110 transition-transform duration-700">
            <AIOrb size={120} />
          </div>

          <div className="relative z-10 flex flex-col h-full min-h-[160px] justify-between gap-6">
            <div className="flex justify-between items-start">
              <div>
                <p
                  className="font-medium text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-2"
                  style={{ fontSize: fSize(10) }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                  {pointsName}
                </p>
                {/* Reduced base font size from 32 to 26 to prevent layout overflow on mobile */}
                <h3 className="font-bold text-foreground tabular-nums tracking-tight" style={{ fontSize: fSize(26) }}>
                  {pointsBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h3>
              </div>
              {/* Redesigned Member Level to be premium "Titanium" style */}
              <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 shadow-sm">
                <div className="p-0.5 rounded-full bg-slate-900 dark:bg-white">
                  <Sparkles size={8} className="text-white dark:text-slate-900 fill-current" />
                </div>
                <span className="text-slate-700 dark:text-slate-200 font-bold uppercase tracking-wide text-[10px]">
                  {t.profile_pro_member}
                </span>
              </div>
            </div>

            {/* Redesigned bottom section */}
            <div className="flex items-end justify-between">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Zap size={12} className="fill-current opacity-60" />
                  <span className="font-medium uppercase tracking-wider" style={{ fontSize: fSize(10) }}>
                    {t.profile_impact_score}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {/* Reduced base font size from 22 to 18 for better fit */}
                  <span className="font-bold text-foreground tabular-nums leading-none" style={{ fontSize: fSize(18) }}>
                    892
                  </span>
                  {/* Progress bar with subtle cyan accent */}
                  <div className="w-16 h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-900 dark:bg-slate-100 w-[70%] rounded-full" />
                  </div>
                </div>
              </div>

              {/* Invite button restored to the "pill with arrow" style */}
              <button
                onClick={onOpenInvite}
                className="group flex items-center gap-3 pl-4 pr-1.5 py-1.5 rounded-full bg-white/50 dark:bg-black/20 border border-white/60 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/10 transition-all active:scale-95 backdrop-blur-sm"
              >
                <span className="text-foreground/80 font-medium" style={{ fontSize: fSize(11) }}>
                  {t.profile_invite_friends}
                </span>
                <div className="w-7 h-7 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm text-foreground">
                  <ChevronRight size={14} />
                </div>
              </button>
            </div>
          </div>
        </GlassPanel>
      </motion.div>

      {/* Toolbar Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h3
          className={`${DesignTokens.typography.caption} font-bold uppercase tracking-widest text-muted-foreground mb-3 px-1`}
          style={{ fontSize: fSize(10) }}
        >
          {t.profile_toolbar}
        </h3>

        <div className="grid grid-cols-1 gap-2.5">
          {/* Added "Future Design" button at the top of the toolbar */}
          <GlassPanel
            intensity="medium"
            className="flex items-center gap-3.5 p-3.5 rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer group border-primary/20"
            onClick={() => onNavigate("components")}
          >
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300 shadow-sm">
              <LayoutGrid size={18} strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-foreground" style={{ fontSize: fSize(14) }}>
                Future Design
              </h4>
              <p className="text-muted-foreground" style={{ fontSize: fSize(11) }}>
                View Design System Gallery
              </p>
            </div>
            <ChevronRight
              size={14}
              className="text-muted-foreground opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
            />
          </GlassPanel>

          {/* Added "Charts Gallery" button */}
          {onOpenCharts && (
            <GlassPanel
              intensity="medium"
              className="flex items-center gap-3.5 p-3.5 rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer group border-primary/20"
              onClick={onOpenCharts}
            >
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300 shadow-sm">
                <BarChart3 size={18} strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground" style={{ fontSize: fSize(14) }}>
                  {t.charts_gallery}
                </h4>
                <p className="text-muted-foreground" style={{ fontSize: fSize(11) }}>
                  View Chart Components
                </p>
              </div>
              <ChevronRight
                size={14}
                className="text-muted-foreground opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
              />
            </GlassPanel>
          )}

          <GlassPanel
            intensity="low"
            className="flex items-center gap-3.5 p-3.5 rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer group"
            onClick={() => setIsPersonalizationOpen(true)}
          >
            <div className="w-9 h-9 rounded-full bg-background flex items-center justify-center text-foreground group-hover:scale-110 transition-transform duration-300 shadow-sm">
              <Palette size={18} strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-foreground" style={{ fontSize: fSize(14) }}>
                {t.settings_personalization}
              </h4>
              <p className="text-muted-foreground" style={{ fontSize: fSize(11) }}>
                {t.settings_personalization_desc}
              </p>
            </div>
            <ChevronRight
              size={14}
              className="text-muted-foreground opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
            />
          </GlassPanel>

          {/* Archive Item */}
          {[{ icon: FileText, label: t.profile_archive, desc: t.profile_archive_desc }].map((item, i) => (
            <GlassPanel
              key={item.label}
              intensity="low"
              className="flex items-center gap-3.5 p-3.5 rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer group"
              onClick={onOpenArchive}
            >
              <div className="w-9 h-9 rounded-full bg-background flex items-center justify-center text-foreground group-hover:scale-110 transition-transform duration-300 shadow-sm">
                <item.icon size={18} strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground" style={{ fontSize: fSize(14) }}>
                  {item.label}
                </h4>
                <p className="text-muted-foreground" style={{ fontSize: fSize(11) }}>
                  {item.desc}
                </p>
              </div>
              <ChevronRight
                size={14}
                className="text-muted-foreground opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
              />
            </GlassPanel>
          ))}

          {/* Settings Item - Opens Modal */}
          <GlassPanel
            intensity="low"
            className="flex items-center gap-3.5 p-3.5 rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer group"
            onClick={() => setIsSettingsOpen(true)}
          >
            <div className="w-9 h-9 rounded-full bg-background flex items-center justify-center text-foreground group-hover:scale-110 transition-transform duration-300 shadow-sm">
              <Settings size={18} strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-foreground" style={{ fontSize: fSize(14) }}>
                {t.profile_settings}
              </h4>
              <p className="text-muted-foreground" style={{ fontSize: fSize(11) }}>
                {t.profile_settings_desc}
              </p>
            </div>
            <ChevronRight
              size={14}
              className="text-muted-foreground opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
            />
          </GlassPanel>
        </div>
      </motion.div>

      {/* Settings Modal - Removed Personalization entry from Settings */}
      <ModalDialog
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        variant="action-sheet"
        title={t.settings_title}
      >
        <div className="flex flex-col gap-6 pt-2">
          {/* Section 1: Account */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">
              {t.settings_account}
            </h4>

            <div
              className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border/50 cursor-pointer hover:bg-secondary/50 transition-colors"
              onClick={() => openSubModal(setIsEditProfileOpen)}
            >
              <div className="flex items-center gap-3">
                <PenLine size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium">{t.settings_edit_profile}</span>
              </div>
              <ChevronRight size={14} className="text-muted-foreground" />
            </div>

            <div
              className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border/50 cursor-pointer hover:bg-secondary/50 transition-colors"
              onClick={() => openSubModal(setIsMobileBindOpen)}
            >
              <div className="flex items-center gap-3">
                <Smartphone size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium">{t.settings_phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">138****8888</span>
                <ChevronRight size={14} className="text-muted-foreground" />
              </div>
            </div>

            <div
              className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border/50 cursor-pointer hover:bg-secondary/50 transition-colors"
              onClick={() => openSubModal(setIsNotificationSettingsOpen)}
            >
              <div className="flex items-center gap-3">
                <Bell size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium">{t.settings_notifications}</span>
              </div>
              <ChevronRight size={14} className="text-muted-foreground" />
            </div>
          </div>

          {/* Section 2: Security */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">
              {t.settings_security}
            </h4>
            <div
              className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border/50 cursor-pointer hover:bg-secondary/50 transition-colors"
              onClick={() => {
                setOldPassword("")
                setNewPassword("")
                setConfirmPassword("")
                setPasswordError("")
                openSubModal(setIsChangePasswordOpen)
              }}
            >
              <div className="flex items-center gap-3">
                <Lock size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium">
                  {userInfo?.hasPassword 
                    ? (language === "zh" ? "修改密码" : "Change Password")
                    : (language === "zh" ? "设置密码" : "Set Password")
                  }
                </span>
              </div>
              <ChevronRight size={14} className="text-muted-foreground" />
            </div>
          </div>

          {/* Logout Button */}
          <button 
            onClick={() => {
              // 清除所有登录相关的 localStorage 数据
              if (typeof window !== 'undefined') {
                localStorage.removeItem('aino_token')
                localStorage.removeItem('aino_user')
                localStorage.removeItem('aino_application_id')
                // 清除用户信息状态
                setUserInfo(null)
                // 跳转到登录页面
                router.push('/auth')
              }
            }}
            className="w-full p-3.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 font-medium flex items-center justify-center gap-2 transition-colors mt-2"
          >
            <LogOut size={16} />
            {t.settings_logout}
          </button>
        </div>
      </ModalDialog>

      <ModalDialog
        isOpen={isPersonalizationOpen}
        onClose={() => setIsPersonalizationOpen(false)}
        variant="action-sheet"
        title={t.settings_personalization}
      >
        <div className="flex flex-col gap-3 pt-2">
          {/* Language Selection */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-muted-foreground px-1">{t.settings_language}</h4>
            <div className="grid grid-cols-2 gap-2">
              {(["zh-CN", "en"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`p-2.5 rounded-xl border transition-all ${
                    language === lang
                      ? "bg-primary/10 border-primary text-primary font-medium"
                      : "bg-secondary/30 border-border/50 text-foreground hover:bg-secondary/50"
                  }`}
                >
                  {lang === "zh-CN" ? "简体中文" : "English"}
                </button>
              ))}
            </div>
          </div>

          {/* Text Scale Selection */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-muted-foreground px-1">{t.settings_text_scale}</h4>
            <div className="grid grid-cols-3 gap-2">
              {([0.9, 1.05, 1.1] as const).map((scale) => (
                <button
                  key={scale}
                  onClick={() => setTextScale(scale)}
                  className={`p-2.5 rounded-xl border transition-all flex items-center justify-center gap-2 ${
                    textScale === scale
                      ? "bg-primary/10 border-primary text-primary font-medium"
                      : "bg-secondary/30 border-border/50 text-foreground hover:bg-secondary/50"
                  }`}
                >
                  {textScale === scale && <Check size={16} strokeWidth={2.5} />}
                  {scale === 0.9
                    ? t.settings_text_small
                    : scale === 1.05
                      ? t.settings_text_default
                      : t.settings_text_large}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Selection */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-muted-foreground px-1">{t.settings_theme}</h4>
            <div className="grid grid-cols-3 gap-2">
              {(["light", "dark", "system"] as const).map((themeOption) => (
                <button
                  key={themeOption}
                  onClick={() => setTheme(themeOption)}
                  className={`p-2.5 rounded-xl border transition-all ${
                    theme === themeOption
                      ? "bg-primary/10 border-primary text-primary font-medium"
                      : "bg-secondary/30 border-border/50 text-foreground hover:bg-secondary/50"
                  }`}
                >
                  {themeOption === "light"
                    ? t.settings_theme_light
                    : themeOption === "dark"
                      ? t.settings_theme_dark
                      : t.settings_theme_system}
                </button>
              ))}
            </div>
          </div>

          {/* Design System Entry */}
          <div
            className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border/50 cursor-pointer hover:bg-secondary/50 transition-colors mt-2"
            onClick={() => {
              setIsPersonalizationOpen(false)
              onNavigate("components")
            }}
          >
            <div className="flex items-center gap-3">
              <LayoutGrid size={16} className="text-muted-foreground" />
              <span className="text-sm font-medium">Future Design</span>
            </div>
            <ChevronRight size={14} className="text-muted-foreground" />
          </div>
        </div>
      </ModalDialog>

      {/* Edit Profile Modal */}
      <ModalDialog isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} variant="action-sheet">
        <div className="flex flex-col items-center gap-6 pt-4">
          {/* Avatar Upload */}
          <div className="relative group">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="avatar-upload"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  // 验证文件大小（最大5MB）
                  if (file.size > 5 * 1024 * 1024) {
                    toast({
                      title: language === "zh" ? "文件过大" : "File too large",
                      description: language === "zh" ? "图片大小不能超过5MB" : "Image size must be less than 5MB",
                      variant: "destructive",
                    })
                    return
                  }
                  
                  // 转换为base64用于预览和上传
                  const reader = new FileReader()
                  reader.onloadend = () => {
                    const base64String = reader.result as string
                    setEditAvatar(base64String)
                  }
                  reader.readAsDataURL(file)
                }
              }}
            />
            <label
              htmlFor="avatar-upload"
              className="relative group cursor-pointer block"
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700 p-1 ring-2 ring-border shadow-xl">
                <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                  {editAvatar ? (
                    <img src={editAvatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-4xl">👾</div>
                  )}
                </div>
              </div>
              <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <Camera className="text-white" />
              </div>
              <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-1.5 rounded-full shadow-lg pointer-events-none">
                <Camera size={14} />
              </div>
            </label>
          </div>

          {/* Form Fields */}
          <div className="w-full space-y-4">
            <TextInput
              label={t.settings_name}
              placeholder={language === "zh" ? "请输入姓名" : "Enter your name"}
              icon={<User size={16} />}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
            <TextInput
              label={language === "zh" ? "个人ID" : "User ID"}
              placeholder={language === "zh" ? "请输入个人ID" : "Enter your ID"}
              icon={<User size={16} />}
              value={editId}
              onChange={(e) => setEditId(e.target.value)}
            />

            <div className="pt-2 flex gap-3">
              <PillButton
                variant="secondary"
                className="flex-1"
                onClick={() => setIsEditProfileOpen(false)}
                disabled={isSaving}
              >
                {t.settings_cancel}
              </PillButton>
              <PillButton
                variant="primary"
                className="flex-1"
                onClick={async () => {
                  if (!editName.trim()) {
                    toast({
                      title: language === "zh" ? "姓名不能为空" : "Name cannot be empty",
                      description: language === "zh" ? "请输入您的姓名" : "Please enter your name",
                      variant: "destructive",
                    })
                    return
                  }

                  if (!editId.trim()) {
                    toast({
                      title: language === "zh" ? "个人ID不能为空" : "User ID cannot be empty",
                      description: language === "zh" ? "请输入您的个人ID" : "Please enter your ID",
                      variant: "destructive",
                    })
                    return
                  }

                  setIsSaving(true)
                  try {
                    // 调用API更新用户信息
                    await updateUserInfo({
                      name: editName.trim(),
                      avatar: editAvatar || undefined,
                      id: editId.trim(),
                    })

                    // 更新localStorage中的用户信息
                    if (typeof window !== 'undefined') {
                      const userStr = localStorage.getItem('aino_user')
                      if (userStr) {
                        try {
                          const user = JSON.parse(userStr)
                          // 确保保留 userId 字段（应用用户的 UUID），这是关键字段，不能丢失
                          const updatedUser = {
                            ...user,
                            name: { zh: editName.trim(), en: editName.trim() },
                            avatar: editAvatar || user.avatar,
                            id: editId.trim(),
                            userId: user.userId || (user.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(user.id) ? user.id : null),
                          }
                          console.log('🔍 user-profile-view 更新 localStorage，保留 userId:', updatedUser.userId)
                          localStorage.setItem('aino_user', JSON.stringify(updatedUser))
                        } catch (e) {
                          console.error('更新localStorage失败:', e)
                        }
                      }
                    }

                    // 重新从localStorage读取用户信息以刷新UI
                    if (typeof window !== 'undefined') {
                      const updatedUserStr = localStorage.getItem('aino_user')
                      if (updatedUserStr) {
                        try {
                          const updatedUser = JSON.parse(updatedUserStr)
                          const userName = getNameFromI18n(updatedUser.name, language) || updatedUser.phone || '用户'
                          setUserInfo({
                            name: userName,
                            phone: updatedUser.phone,
                            email: updatedUser.email,
                            hasPassword: updatedUser.hasPassword !== undefined ? updatedUser.hasPassword : false,
                            id: updatedUser.id || updatedUser.phone,
                          })
                        } catch (e) {
                          console.error('解析更新后的用户信息失败:', e)
                        }
                      }
                    }

                    toast({
                      title: language === "zh" ? "保存成功" : "Saved",
                      description: language === "zh" ? "个人信息已更新" : "Profile updated successfully",
                    })

                    setIsEditProfileOpen(false)
                  } catch (error: any) {
                    console.error('更新用户信息失败:', error)
                    toast({
                      title: language === "zh" ? "保存失败" : "Save failed",
                      description: error.message || (language === "zh" ? "请重试" : "Please try again"),
                      variant: "destructive",
                    })
                  } finally {
                    setIsSaving(false)
                  }
                }}
                disabled={isSaving}
              >
                {isSaving ? (language === "zh" ? "保存中..." : "Saving...") : t.settings_save}
              </PillButton>
            </div>
          </div>
        </div>
      </ModalDialog>

      <ModalDialog isOpen={isMobileBindOpen} onClose={() => setIsMobileBindOpen(false)} variant="action-sheet">
        <div className="flex flex-col gap-6 pt-4 pb-8 w-full">
          <div className="space-y-4">
            <MobileInput
              label={t.settings_mobile_input}
              placeholder={t.settings_mobile_placeholder}
              className="bg-secondary/30"
              autoFocus
            />

            <VerifyCodeInput
              label={t.settings_verify_code}
              placeholder={t.settings_code_placeholder}
              className="bg-secondary/30"
              onSendCode={() => console.log("Send code")}
            />
          </div>

          <PillButton onClick={() => setIsMobileBindOpen(false)}>{t.settings_bind_submit}</PillButton>
        </div>
      </ModalDialog>

      <ModalDialog 
        isOpen={isChangePasswordOpen} 
        onClose={() => {
          setIsChangePasswordOpen(false)
          setOldPassword("")
          setNewPassword("")
          setConfirmPassword("")
          setPasswordError("")
        }} 
        variant="action-sheet"
        title={userInfo?.hasPassword 
          ? (language === "zh" ? "修改密码" : "Change Password")
          : (language === "zh" ? "设置密码" : "Set Password")
        }
      >
        <div className="flex flex-col gap-6 pt-4 pb-8 w-full">
          <div className="space-y-4">
            {/* 只有已设置密码的用户才需要输入旧密码 */}
            {userInfo?.hasPassword && (
              <TextInput
                leftIcon={<KeyRound size={16} />}
                type="password"
                placeholder={language === "zh" ? "请输入旧密码" : "Enter old password"}
                className="bg-secondary/30"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            )}
            <TextInput
              leftIcon={<Lock size={16} />}
              type="password"
              placeholder={language === "zh" ? "请输入新密码（至少6位）" : "Enter new password (min 6 characters)"}
              className="bg-secondary/30"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <TextInput
              leftIcon={<Lock size={16} />}
              type="password"
              placeholder={language === "zh" ? "请确认新密码" : "Confirm new password"}
              className="bg-secondary/30"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {passwordError && (
              <div className="text-sm text-red-500 px-1">{passwordError}</div>
            )}
            <div className="pt-2">
              <PillButton
                variant="primary"
                className="w-full h-11 flex-shrink-0"
                onClick={async () => {
                  setPasswordError("")
                  
                  // 验证输入
                  if (userInfo?.hasPassword && !oldPassword) {
                    setPasswordError(language === "zh" ? "请输入旧密码" : "Please enter old password")
                    return
                  }
                  if (!newPassword || newPassword.length < 6) {
                    setPasswordError(language === "zh" ? "新密码至少6位" : "New password must be at least 6 characters")
                    return
                  }
                  if (newPassword !== confirmPassword) {
                    setPasswordError(language === "zh" ? "两次输入的密码不一致" : "Passwords do not match")
                    return
                  }

                  try {
                    if (userInfo?.hasPassword) {
                      // 修改密码
                      await changePassword(oldPassword, newPassword)
                    } else {
                      // 设置密码
                      await setPassword(newPassword)
                      // 更新用户信息，标记已设置密码
                      setUserInfo(prev => prev ? { ...prev, hasPassword: true } : null)
                    }
                    
                    // 成功提示
                    toast({
                      title: language === "zh" ? "成功" : "Success",
                      description: userInfo?.hasPassword 
                        ? (language === "zh" ? "密码修改成功" : "Password changed successfully")
                        : (language === "zh" ? "密码设置成功" : "Password set successfully"),
                    })
                    
                    // 关闭对话框
                    setIsChangePasswordOpen(false)
                    setOldPassword("")
                    setNewPassword("")
                    setConfirmPassword("")
                  } catch (error: any) {
                    setPasswordError(error.message || (language === "zh" ? "操作失败，请重试" : "Operation failed, please try again"))
                  }
                }}
              >
                {userInfo?.hasPassword 
                  ? (language === "zh" ? "保存密码" : "Save Password")
                  : (language === "zh" ? "设置密码" : "Set Password")
                }
              </PillButton>
            </div>
          </div>
        </div>
      </ModalDialog>

      <ModalDialog
        isOpen={isNotificationSettingsOpen}
        onClose={() => setIsNotificationSettingsOpen(false)}
        variant="action-sheet"
      >
        <div className="flex flex-col gap-4 pt-2 pb-8 w-full">
          {/* System Alerts */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30 border border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-foreground shadow-sm">
                <Settings size={16} />
              </div>
              <span className="text-sm font-medium">{t.settings_notify_system}</span>
            </div>
            <Switch checked={notifySystem} onCheckedChange={setNotifySystem} />
          </div>

          {/* Following Updates */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30 border border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-foreground shadow-sm">
                <User size={16} />
              </div>
              <span className="text-sm font-medium">{t.settings_notify_following}</span>
            </div>
            <Switch checked={notifyFollowing} onCheckedChange={setNotifyFollowing} />
          </div>

          {/* Assistant Messages */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30 border border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-foreground shadow-sm">
                <Sparkles size={16} />
              </div>
              <span className="text-sm font-medium">{t.settings_notify_assistant}</span>
            </div>
            <Switch checked={notifyAssistant} onCheckedChange={setNotifyAssistant} />
          </div>
        </div>
      </ModalDialog>

      {/* Personalization Settings Modal */}
      {/* <ModalDialog isOpen={isPersonalizationOpen} onClose={() => setIsPersonalizationOpen(false)} variant="full-screen">
        <PersonalizationSettingsView />
      </ModalDialog> */}

      {/* Upgrade Dialog */}
      <UpgradeDialog
        isOpen={isUpgradeDialogOpen}
        onClose={() => setIsUpgradeDialogOpen(false)}
      />
    </div>
  )
}
