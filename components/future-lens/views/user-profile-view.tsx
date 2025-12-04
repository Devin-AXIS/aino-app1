"use client"

import { useState } from "react"
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

  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false)
  const [isMobileBindOpen, setIsMobileBindOpen] = useState(false) // Added Mobile Bind state
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false) // Added Change Password state
  const [isNotificationSettingsOpen, setIsNotificationSettingsOpen] = useState(false) // New state for notification settings modal
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
              onClick={() => router.push("/auth")}
              className="w-11 h-11 rounded-full bg-gradient-to-tr from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700 p-0.5 ring-1 ring-border shadow-xl shadow-slate-300/40 dark:shadow-none group-hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                <div className="w-full h-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-lg">
                  👾
                </div>
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
              Devin
            </h2>
            <p className={`${DesignTokens.typography.caption} text-muted-foreground`} style={{ fontSize: fSize(13) }}>
              @Future_Architect
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
                  {t.profile_future_coin}
                </p>
                {/* Reduced base font size from 32 to 26 to prevent layout overflow on mobile */}
                <h3 className="font-bold text-foreground tabular-nums tracking-tight" style={{ fontSize: fSize(26) }}>
                  2,450.00
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
              onClick={() => openSubModal(setIsChangePasswordOpen)}
            >
              <div className="flex items-center gap-3">
                <Lock size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium">{t.settings_password}</span>
              </div>
              <ChevronRight size={14} className="text-muted-foreground" />
            </div>
          </div>

          {/* Logout Button */}
          <button className="w-full p-3.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 font-medium flex items-center justify-center gap-2 transition-colors mt-2">
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
          <div className="relative group cursor-pointer">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700 p-1 ring-2 ring-border shadow-xl">
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                <div className="text-4xl">👾</div>
              </div>
            </div>
            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="text-white" />
            </div>
            <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-1.5 rounded-full shadow-lg">
              <Camera size={14} />
            </div>
          </div>

          {/* Form Fields */}
          <div className="w-full space-y-4">
            <TextInput label={t.settings_name} placeholder="Devin" icon={<User size={16} />} defaultValue="Devin" />

            <div className="pt-2 flex gap-3">
              <PillButton variant="secondary" className="flex-1" onClick={() => setIsEditProfileOpen(false)}>
                {t.settings_cancel}
              </PillButton>
              <PillButton variant="primary" className="flex-1" onClick={() => setIsEditProfileOpen(false)}>
                {t.settings_save}
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

      <ModalDialog isOpen={isChangePasswordOpen} onClose={() => setIsChangePasswordOpen(false)} variant="action-sheet">
        <div className="flex flex-col gap-6 pt-4 pb-8 w-full">
          <div className="space-y-4">
            <TextInput
              leftIcon={<KeyRound size={16} />}
              type="password"
              placeholder={t.settings_old_password_placeholder}
              className="bg-secondary/30"
            />
            <TextInput
              leftIcon={<Lock size={16} />}
              type="password"
              placeholder={t.settings_new_password_placeholder}
              className="bg-secondary/30"
            />
            <TextInput
              leftIcon={<Lock size={16} />}
              type="password"
              placeholder={t.settings_confirm_password_placeholder}
              className="bg-secondary/30"
            />
            <div className="pt-2">
              <PillButton
                variant="primary"
                className="w-full h-11 flex-shrink-0"
                onClick={() => setIsChangePasswordOpen(false)}
              >
                {t.settings_save_password}
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
