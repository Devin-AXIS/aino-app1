"use client"

import { useState } from "react"
import { Bell, MessageCircle, Check } from "lucide-react"
import { motion } from "framer-motion"
import { DesignTokens } from "@/lib/future-lens/design-tokens"
import { useAppConfig } from "@/lib/future-lens/config-context"
import { translations } from "@/lib/future-lens/i18n"
import { CardBase } from "../ds/card-base"
import { ScrollHeaderContainer } from "../layout/scroll-header-container"
import { ScrollHeader } from "../layout/scroll-header"
import { AppBackground } from "../ds/app-background"

interface Notification {
  id: string
  type: "system" | "message"
  title: string
  content: string
  time: string
  isRead: boolean
}

interface NotificationsViewProps {
  onBack: () => void
}

// Mock notifications data
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "system",
    title: "系统更新",
    content: "FutureLens 新版本已发布，优化了 AI 分析能力",
    time: "5分钟前",
    isRead: false,
  },
  {
    id: "2",
    type: "message",
    title: "AI 助手回复",
    content: "您的市场分析报告已生成完毕",
    time: "1小时前",
    isRead: false,
  },
  {
    id: "3",
    type: "system",
    title: "功能上线",
    content: "全新数据可视化图表功能现已开放使用",
    time: "3小时前",
    isRead: false,
  },
  {
    id: "4",
    type: "message",
    title: "AI 助手消息",
    content: "检测到 3 个新的投资机会",
    time: "昨天",
    isRead: true,
  },
  {
    id: "5",
    type: "system",
    title: "账号安全",
    content: "您的密码已成功修改",
    time: "2天前",
    isRead: true,
  },
]

export function NotificationsView({ onBack }: NotificationsViewProps) {
  const { language, textScale } = useAppConfig()
  const t = translations[language] || translations.zh
  const fSize = (base: number) => `${base * textScale}px`

  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)
  const [activeTab, setActiveTab] = useState<"all" | "system" | "message">("all")

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
  }

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "all") return true
    return n.type === activeTab
  })

  const unreadCount = notifications.filter((n) => !n.isRead).length

  // 标签栏组件（集成到 ScrollHeader 内部）
  const NotificationTabs = () => (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
      <TabButton
        active={activeTab === "all"}
        onClick={() => setActiveTab("all")}
        label={t.notifications_all}
        count={notifications.length}
      />
      <TabButton
        active={activeTab === "system"}
        onClick={() => setActiveTab("system")}
        label={t.notifications_system}
        count={notifications.filter((n) => n.type === "system").length}
      />
      <TabButton
        active={activeTab === "message"}
        onClick={() => setActiveTab("message")}
        label={t.notifications_message}
        count={notifications.filter((n) => n.type === "message").length}
      />
    </div>
  )

  // 右侧操作按钮（自定义）
  const HeaderActions = unreadCount > 0 ? (
    <button
      onClick={handleMarkAllAsRead}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 transition-all active:scale-95 whitespace-nowrap"
      style={{ fontSize: fSize(12) }}
    >
      <Check size={14} className="flex-shrink-0" />
      <span className="font-medium">{t.notifications_mark_all_read}</span>
    </button>
  ) : undefined

  return (
    <div className="h-full flex flex-col relative">
      {/* 背景 */}
      <AppBackground />

      <ScrollHeaderContainer scrollContainerId="notifications-scroll-container">
        <ScrollHeader
          title={t.notifications_title}
          onBack={onBack}
          actions={HeaderActions}
          tabs={<NotificationTabs />}
        />
      </ScrollHeaderContainer>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-24 relative z-10" id="notifications-scroll-container">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Bell size={48} strokeWidth={1} className="mb-3 opacity-30" />
            <p className="text-sm">{t.notifications_empty}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
                textScale={textScale}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function TabButton({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean
  onClick: () => void
  label: string
  count: number
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap
        ${active ? "bg-primary text-primary-foreground shadow-sm" : "bg-secondary/50 text-muted-foreground hover:bg-secondary"}
      `}
    >
      {label} ({count})
    </button>
  )
}

function NotificationCard({
  notification,
  onMarkAsRead,
  textScale,
}: {
  notification: Notification
  onMarkAsRead: (id: string) => void
  textScale: number
}) {
  const fSize = (base: number) => `${base * textScale}px`

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <CardBase
        className={`cursor-pointer !p-3.5 ${!notification.isRead ? "border-l-4 border-l-primary" : ""}`}
        onClick={() => !notification.isRead && onMarkAsRead(notification.id)}
      >
      <div className="flex items-start gap-2">
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
            notification.type === "system" ? "bg-primary/10" : "bg-success/10"
          }`}
        >
          {notification.type === "system" ? (
            <Bell size={12} className="text-primary" />
          ) : (
            <MessageCircle size={12} className="text-success" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3
              className={`${DesignTokens.typography.title} flex-1 ${
                !notification.isRead ? "text-foreground" : "text-muted-foreground"
              }`}
              style={{ fontSize: fSize(13) }}
            >
              {notification.title}
            </h3>
            {!notification.isRead && <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />}
          </div>

          <p
            className={`${DesignTokens.typography.body} text-muted-foreground line-clamp-2 mb-0.5`}
            style={{ fontSize: fSize(12) }}
          >
            {notification.content}
          </p>

          <span
            className={`${DesignTokens.typography.caption} text-muted-foreground/60`}
            style={{ fontSize: fSize(10) }}
          >
            {notification.time}
          </span>
        </div>
      </div>
    </CardBase>
    </motion.div>
  )
}
