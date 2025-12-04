"use client"
import { motion } from "framer-motion"
import { Users, Clock, CheckCircle2, HourglassIcon, TrendingUp } from "lucide-react"
import { ModalDialog } from "@/components/future-lens/ds/modal-dialog"
import { useAppConfig } from "@/lib/future-lens/config-context"
import { translations } from "@/lib/future-lens/i18n"
import { DesignTokens } from "@/lib/future-lens/design-tokens"
import { CardBase } from "@/components/future-lens/ds/card-base"

interface InvitedFriend {
  id: string
  name: string
  avatar: string
  status: "registered" | "pending" // 已注册 / 邀请中
  joinedAt?: string // 加入时间
  invitedAt: string // 邀请时间
  points: number // 获得积分
}

interface InviteListDialogProps {
  isOpen: boolean
  onClose: () => void
  friends: InvitedFriend[]
}

export function InviteListDialog({ isOpen, onClose, friends }: InviteListDialogProps) {
  const { language, textScale } = useAppConfig()
  const t = translations[language] || translations["zh"]

  const fSize = (base: number) => `${base * textScale}px`

  // 统计数据
  const registeredCount = friends.filter((f) => f.status === "registered").length
  const pendingCount = friends.filter((f) => f.status === "pending").length
  const totalPoints = friends.reduce((sum, f) => sum + f.points, 0)

  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onClose}
      title={t.invite_list_title || "我的邀请"}
      icon={<Users size={18} />}
      variant="default"
    >
      <div className="space-y-4">
        {/* 统计卡片 */}
        <div className="grid grid-cols-3 gap-2">
          <CardBase className="p-3 text-center">
            <div className="text-foreground font-bold mb-0.5" style={{ fontSize: fSize(16) }}>
              {friends.length}
            </div>
            <div className={DesignTokens.typography.caption} style={{ fontSize: fSize(9) }}>
              {t.invite_total || "总邀请"}
            </div>
          </CardBase>

          <CardBase className="p-3 text-center bg-emerald-50/50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30">
            <div className="text-emerald-600 dark:text-emerald-400 font-bold mb-0.5" style={{ fontSize: fSize(16) }}>
              {registeredCount}
            </div>
            <div className={DesignTokens.typography.caption} style={{ fontSize: fSize(9) }}>
              {t.invite_registered || "已注册"}
            </div>
          </CardBase>

          <CardBase className="p-3 text-center bg-amber-50/50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30">
            <div className="text-amber-600 dark:text-amber-400 font-bold mb-0.5" style={{ fontSize: fSize(16) }}>
              {totalPoints}
            </div>
            <div className={DesignTokens.typography.caption} style={{ fontSize: fSize(9) }}>
              {t.invite_points_earned || "已获积分"}
            </div>
          </CardBase>
        </div>

        {/* 好友列表 */}
        <div className="space-y-2 max-h-[320px] overflow-y-auto -mx-6 px-6 py-1">
          {friends.length === 0 ? (
            <div className="text-center py-8">
              <Users size={40} className="mx-auto mb-2 text-muted-foreground/30" />
              <p className={DesignTokens.typography.subtitle} style={{ fontSize: fSize(12) }}>
                {t.invite_no_friends || "还没有邀请好友"}
              </p>
            </div>
          ) : (
            friends.map((friend, index) => (
              <motion.div
                key={friend.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <CardBase className="p-3 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    {/* 头像 */}
                    <div className="relative">
                      <img
                        src={friend.avatar || "/placeholder.svg?height=40&width=40"}
                        alt={friend.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      {friend.status === "registered" && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-card flex items-center justify-center">
                          <CheckCircle2 size={10} className="text-white" />
                        </div>
                      )}
                    </div>

                    {/* 信息区域 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className={DesignTokens.typography.title} style={{ fontSize: fSize(13) }}>
                          {friend.name}
                        </h4>
                        {friend.status === "pending" && (
                          <span className="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 rounded-md flex items-center gap-1">
                            <HourglassIcon size={10} />
                            <span style={{ fontSize: fSize(8) }}>{t.invite_pending || "邀请中"}</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock size={11} />
                          <span style={{ fontSize: fSize(9) }}>
                            {friend.status === "registered"
                              ? friend.joinedAt
                              : `${t.invite_invited_at || "邀请于"} ${friend.invitedAt}`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 积分显示 */}
                    <div className="flex flex-col items-end">
                      {friend.points > 0 ? (
                        <>
                          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                            <TrendingUp size={12} />
                            <span style={{ fontSize: fSize(13) }}>+{friend.points}</span>
                          </div>
                          <span className={DesignTokens.typography.caption} style={{ fontSize: fSize(8) }}>
                            FUTU
                          </span>
                        </>
                      ) : (
                        <span className="text-muted-foreground/50" style={{ fontSize: fSize(10) }}>
                          {t.invite_pending_reward || "待奖励"}
                        </span>
                      )}
                    </div>
                  </div>
                </CardBase>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </ModalDialog>
  )
}
