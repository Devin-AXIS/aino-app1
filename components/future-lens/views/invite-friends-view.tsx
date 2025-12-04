"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { MessageSquare, Copy, Share2, MoreHorizontal, Zap, Users } from "lucide-react"
import { useAppConfig } from "@/lib/future-lens/config-context"
import { translations } from "@/lib/future-lens/i18n"
import { BusinessSubpageShell } from "@/components/future-lens/layout/business-subpage-shell"
import { CardBase } from "@/components/future-lens/ds/card-base"
import { DesignTokens } from "@/lib/future-lens/design-tokens"
import { InviteListSheet } from "@/components/future-lens/views/invite-list-sheet"

// --- 1. ValueCrystal: Energy Crystal Visual ---
const ValueCrystal = () => {
  return (
    <div className="relative w-40 h-40 flex items-center justify-center">
      {/* Core glow - Using design tokens */}
      <div className="absolute inset-0 bg-emerald-500/30 dark:bg-emerald-400/20 blur-[60px] rounded-full animate-pulse" />

      {/* Rotating orbit 1 */}
      <motion.div
        className="absolute w-32 h-32 rounded-full border border-emerald-500/30 border-t-emerald-400/80 dark:border-emerald-400/20 dark:border-t-emerald-300/60"
        animate={{ rotate: 360, scale: [1, 1.05, 1] }}
        transition={{
          rotate: { duration: 20, ease: "linear", repeat: Number.POSITIVE_INFINITY },
          scale: { duration: 4, repeat: Number.POSITIVE_INFINITY },
        }}
      />
      {/* Rotating orbit 2 (reverse) */}
      <motion.div
        className="absolute w-24 h-24 rounded-full border border-teal-500/30 border-b-teal-400/80 dark:border-teal-400/20 dark:border-b-teal-300/60"
        animate={{ rotate: -360 }}
        transition={{ rotate: { duration: 15, ease: "linear", repeat: Number.POSITIVE_INFINITY } }}
      />

      {/* Center token symbol */}
      <motion.div
        className="relative w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-600 dark:from-emerald-500 dark:to-teal-700 rounded-2xl shadow-[0_10px_30px_-10px_rgba(16,185,129,0.5)] flex items-center justify-center border border-white/20 backdrop-blur-md"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      >
        <span className="text-3xl font-bold text-white font-mono">F</span>
        {/* Surface highlight */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent rounded-2xl" />
      </motion.div>
    </div>
  )
}

// --- 2. AvatarStack: Avatar Stacking Component ---
const AvatarStack = ({ avatars, total }: { avatars: string[]; total: number }) => {
  return (
    <div className="flex items-center -space-x-2">
      {avatars.map((src, i) => (
        <div
          key={i}
          className="relative w-6 h-6 rounded-full border border-white dark:border-slate-700 shadow-sm overflow-hidden bg-slate-200 dark:bg-slate-700"
        >
          <img src={src || "/placeholder.svg"} alt="User" className="w-full h-full object-cover" />
        </div>
      ))}
      <div className="relative w-6 h-6 rounded-full border border-white dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center shadow-sm z-10">
        <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400">+{total}</span>
      </div>
    </div>
  )
}

// --- 3. Main Page: Invite Page ---
interface InviteFriendsViewProps {
  onBack: () => void
}

export function InviteFriendsView({ onBack }: InviteFriendsViewProps) {
  const { language, textScale } = useAppConfig()
  const t = translations[language] || translations["zh"]
  const isZh = language === "zh"

  const [isInviteListOpen, setIsInviteListOpen] = useState(false)

  const fSize = (base: number) => `${base * textScale}px`

  // Mock avatar data
  const inviteAvatars = [
    "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    "https://i.pravatar.cc/150?u=a04258a2462d826712d",
  ]

  const mockFriends = [
    {
      id: "1",
      name: "张伟",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
      status: "registered" as const,
      joinedAt: "2024-01-15 14:30",
      invitedAt: "2024-01-10",
      points: 30,
    },
    {
      id: "2",
      name: "李娜",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
      status: "registered" as const,
      joinedAt: "2024-01-18 09:15",
      invitedAt: "2024-01-12",
      points: 30,
    },
    {
      id: "3",
      name: "王强",
      avatar: "https://i.pravatar.cc/150?u=a04258a2462d826712d",
      status: "pending" as const,
      invitedAt: "2024-01-20",
      points: 0,
    },
    {
      id: "4",
      name: "刘洋",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29027304d",
      status: "pending" as const,
      invitedAt: "2024-01-22",
      points: 0,
    },
    {
      id: "5",
      name: "陈静",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29028824d",
      status: "registered" as const,
      joinedAt: "2024-01-25 16:45",
      invitedAt: "2024-01-23",
      points: 30,
    },
  ]

  const totalPoints = mockFriends.reduce((sum, friend) => sum + friend.points, 0)

  return (
    <BusinessSubpageShell title={t.invite_page_title || "邀请好友"} onBack={onBack}>
      <div className="relative flex flex-col h-[calc(100vh-120px)] overflow-hidden">
        {/* "My Invites" badge in top right - Added click handler to open dialog */}
        <div
          className="absolute top-0 right-0 z-30 pl-1 pr-4 py-1.5 bg-card/60 backdrop-blur-xl border border-border/60 rounded-full flex items-center shadow-sm cursor-pointer hover:bg-card/80 transition-colors gap-3.5"
          onClick={() => setIsInviteListOpen(true)}
        >
          <AvatarStack avatars={inviteAvatars} total={5} />
          <div className="flex items-center gap-1.5">
            <span className={DesignTokens.typography.caption} style={{ fontSize: fSize(10) }}>
              {t.invite_my_invites || "我的记录"}
            </span>
            <div className="w-1 h-1 rounded-full bg-rose-500 animate-pulse" />
          </div>
        </div>

        {/* Core content area - 紧凑布局，不滚动 */}
        <div className="pt-14 pb-32">
          {/* 1. Number and Crystal Display */}
          <div className="flex justify-between items-start mb-3 relative">
            {/* Left: Large number - reduced size */}
            <div className="flex flex-col pt-0 z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-[42px] leading-[0.85] font-black text-foreground tracking-tighter"
              >
                150
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-[26px] leading-none font-bold text-emerald-600 dark:text-emerald-400 tracking-tighter mt-0.5 font-mono"
              >
                FUTU
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-1 px-2 py-0.5 bg-emerald-100/50 dark:bg-emerald-500/20 border border-emerald-100 dark:border-emerald-400/30 rounded font-bold text-emerald-700 dark:text-emerald-300 w-fit"
                style={{ fontSize: fSize(9) }}
              >
                ≈ $215.50 USD
              </motion.div>
            </div>

            {/* Right: 3D Energy Crystal - smaller scale */}
            <div className="absolute right-[-20px] top-[-20px] scale-[0.65] pointer-events-none select-none">
              <ValueCrystal />
            </div>
          </div>

          {/* 2. Title and Countdown */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-3"
          >
            <h2 className={`${DesignTokens.typography.title} mb-1 leading-snug`} style={{ fontSize: fSize(15) }}>
              {t.invite_title || "邀请好友加入 FutureLens"}
              <br />
              共筑
              <span className="text-emerald-600 dark:text-emerald-400 mx-1 relative inline-block">
                未来战略
                <svg
                  className="absolute w-full h-2 -bottom-0.5 left-0 text-emerald-200 dark:text-emerald-500/30 -z-10"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span>
              生态
            </h2>
          </motion.div>

          {/* 3. Rules Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-4">
            <CardBase className="mb-0">
              <div className="flex gap-2 mb-1.5">
                <div className="w-7 h-7 rounded-full bg-emerald-50 dark:bg-emerald-500/20 flex items-center justify-center flex-shrink-0 text-emerald-600 dark:text-emerald-400">
                  <Zap size={14 * textScale} fill="currentColor" />
                </div>
                <p
                  className={`${DesignTokens.typography.subtitle} leading-relaxed pt-0.5`}
                  style={{ fontSize: fSize(12) }}
                >
                  {t.invite_desc_1 || "每位受邀好友在限定时间内完成注册，并在 14天内 完成首次 AI 战略部署。"}
                </p>
              </div>

              <div className="pl-9">
                <div className="flex items-baseline gap-1 mb-1.5">
                  <span className={DesignTokens.typography.caption} style={{ fontSize: fSize(9) }}>
                    您可获得
                  </span>
                  <span
                    className="font-bold text-emerald-600 dark:text-emerald-400 font-mono"
                    style={{ fontSize: fSize(15) }}
                  >
                    30 FUTU
                  </span>
                </div>

                <div className="h-px w-full bg-border/60 mb-1.5" />

                <p className="text-muted-foreground/60 leading-relaxed" style={{ fontSize: fSize(8) }}>
                  *{t.invite_desc_2 || "每个周期最多获得 5 名好友的受邀奖励。"}
                  <br />
                  <span className="underline cursor-pointer hover:text-muted-foreground transition-colors decoration-border">
                    {t.invite_view_rules || "查看详细活动规则"}
                  </span>
                </p>
              </div>
            </CardBase>
          </motion.div>

          {/* 邀请码区域 - 放在 Rules Card 下面，极简设计，有设计感 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-4"
          >
            {/* 邀请码标题和数量限制 */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {isZh ? "邀请码" : "Invite Code"}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Users size={12} />
                <span>
                  {isZh ? "0/15" : "0/15"}
                </span>
              </div>
            </div>

            {/* 邀请码显示 - 有设计感的代号风格 */}
            <div className="relative">
              {/* 背景光晕效果 */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-cyan-500/5 rounded-2xl blur-xl" />
              
              {/* 邀请码卡片 */}
              <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-4 backdrop-blur-sm">
                {/* 邀请码文字 - 使用等宽字体，有设计感，字体稍小 */}
                <div className="flex items-center justify-center mb-3">
                  <div className="relative">
                    {/* 主邀请码 */}
                    <div className="text-center">
                      <div className="text-xl font-black tracking-[0.15em] text-slate-900 dark:text-white mb-1 font-mono">
                        FL-7X9K-2M4N
                      </div>
                      {/* 装饰性下划线 */}
                      <div className="h-0.5 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent mt-1.5" />
                    </div>
                    
                    {/* 微妙的背景图案 */}
                    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
                      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,currentColor_1px,transparent_1px)] bg-[length:8px_8px]" />
                    </div>
                  </div>
                </div>

                {/* 复制按钮 */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    // TODO: 复制邀请码
                    navigator.clipboard.writeText("FL-7X9K-2M4N")
                  }}
                  className="w-full py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <Copy size={14} />
                  <span>{isZh ? "复制邀请码" : "Copy Code"}</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 底部操作栏 - 固定在底部 */}
        <div className="fixed bottom-0 left-0 right-0 pt-4 pb-6 px-4 bg-background/80 backdrop-blur-xl border-t border-border/50 safe-area-bottom">
          <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
            {[
              {
                icon: MessageSquare,
                label: t.invite_share_wechat || "微信邀请",
                color: "text-emerald-600 dark:text-emerald-400",
              },
              { icon: Copy, label: t.invite_copy_code || "复制口令", color: "text-blue-600 dark:text-blue-400" },
              { icon: Share2, label: "生成海报", color: "text-indigo-600 dark:text-indigo-400" },
              { icon: MoreHorizontal, label: "更多", color: "text-muted-foreground" },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="flex flex-col items-center gap-2"
              >
                <CardBase className="w-14 h-14 rounded-[20px] p-0 mb-0 flex items-center justify-center hover:scale-105 hover:-translate-y-1 transition-all active:scale-95 group">
                  <item.icon
                    size={22 * textScale}
                    strokeWidth={1.8}
                    className={`${item.color} opacity-80 group-hover:opacity-100 transition-opacity`}
                  />
                </CardBase>
                <span className="font-medium text-muted-foreground" style={{ fontSize: fSize(9) }}>
                  {item.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <InviteListSheet
        isOpen={isInviteListOpen}
        onClose={() => setIsInviteListOpen(false)}
        friends={mockFriends}
        totalPoints={totalPoints}
      />
    </BusinessSubpageShell>
  )
}
