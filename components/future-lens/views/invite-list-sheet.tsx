"use client"

import { ModalDialog } from "@/components/future-lens/ds/modal-dialog"
import { useAppConfig } from "@/lib/future-lens/config-context"
import { translations } from "@/lib/future-lens/i18n"
import { Users, CheckCircle2, Clock, Sparkles } from "lucide-react"

interface InvitedFriend {
  id: string
  name: string
  avatar: string
  status: "registered" | "pending"
  joinedAt?: string
  points: number
}

interface InviteListSheetProps {
  isOpen: boolean
  onClose: () => void
  friends: InvitedFriend[]
  totalPoints: number
}

export function InviteListSheet({ isOpen, onClose, friends, totalPoints }: InviteListSheetProps) {
  const { language, textScale } = useAppConfig()
  const t = translations[language] || translations.zh
  const fSize = (size: number) => Math.round(size * textScale)

  const registeredCount = friends.filter((f) => f.status === "registered").length
  const pendingCount = friends.filter((f) => f.status === "pending").length

  return (
    <ModalDialog isOpen={isOpen} onClose={onClose} variant="action-sheet">
      <div className="pb-2">
        {/* Header Stats */}
        <div className="px-6 py-4 border-b border-border/50">
          <h3 className={`font-bold text-foreground mb-3`} style={{ fontSize: fSize(17) }}>
            {t.invite_list_title}
          </h3>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Users size={fSize(14)} className="text-muted-foreground" />
              <span className="text-muted-foreground" style={{ fontSize: fSize(12) }}>
                {t.invite_list_total || "总邀请"}: <span className="text-foreground font-medium">{friends.length}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={fSize(14)} className="text-emerald-500" />
              <span className="text-muted-foreground" style={{ fontSize: fSize(12) }}>
                {t.invite_list_registered || "已注册"}:{" "}
                <span className="text-foreground font-medium">{registeredCount}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles size={fSize(14)} className="text-emerald-500" />
              <span className="text-muted-foreground" style={{ fontSize: fSize(12) }}>
                <span className="text-foreground font-medium">{totalPoints}</span> {t.invite_points_unit || "积分"}
              </span>
            </div>
          </div>
        </div>

        {/* Friends List */}
        <div className="max-h-[400px] overflow-y-auto">
          {friends.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Users size={fSize(40)} className="text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground" style={{ fontSize: fSize(13) }}>
                {t.invite_list_empty || "还没有邀请好友"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              {friends.map((friend) => (
                <div
                  key={friend.id}
                  className="px-6 py-3.5 flex items-center gap-3 hover:bg-muted/30 transition-colors"
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div
                      className="rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold"
                      style={{ width: fSize(40), height: fSize(40), fontSize: fSize(15) }}
                    >
                      {friend.name.charAt(0).toUpperCase()}
                    </div>
                    {friend.status === "registered" && (
                      <div className="absolute -bottom-0.5 -right-0.5 bg-emerald-500 rounded-full p-0.5">
                        <CheckCircle2 size={fSize(10)} className="text-white" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-medium text-foreground truncate" style={{ fontSize: fSize(14) }}>
                        {friend.name}
                      </span>
                      {friend.status === "pending" && (
                        <span
                          className="flex items-center gap-1 text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-500/10 px-1.5 py-0.5 rounded"
                          style={{ fontSize: fSize(10) }}
                        >
                          <Clock size={fSize(10)} />
                          {t.invite_status_pending || "邀请中"}
                        </span>
                      )}
                    </div>
                    {friend.joinedAt && (
                      <p className="text-muted-foreground truncate" style={{ fontSize: fSize(11) }}>
                        {t.invite_joined_at || "加入时间"}: {friend.joinedAt}
                      </p>
                    )}
                  </div>

                  {/* Points */}
                  {friend.points > 0 && (
                    <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-500 font-medium">
                      <Sparkles size={fSize(14)} />
                      <span style={{ fontSize: fSize(13) }}>+{friend.points}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ModalDialog>
  )
}
