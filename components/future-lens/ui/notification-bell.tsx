"use client"

import { Bell } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface NotificationBellProps {
  unreadCount: number
  onClick: () => void
}

/**
 * NotificationBell - 通知铃铛组件
 * 
 * 显示未读通知数量，支持动画效果
 * 
 * @example
 * ```tsx
 * <NotificationBell unreadCount={5} onClick={() => console.log('Open notifications')} />
 * ```
 */
export function NotificationBell({ unreadCount, onClick }: NotificationBellProps) {
  const hasUnread = unreadCount > 0

  return (
    <button
      onClick={onClick}
      className="relative w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground bg-card/70 backdrop-blur-xl border border-border/50 hover:bg-card/90 transition-all active:scale-95"
    >
      <Bell size={18} strokeWidth={2} />

      <AnimatePresence>
        {hasUnread && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-destructive flex items-center justify-center"
          >
            <span className="text-[10px] font-bold text-white leading-none">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  )
}
