"use client"
import { Stars, ArrowUpRight, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import { useAppConfig } from "@/lib/future-lens/config-context"
import { translations } from "@/lib/future-lens/i18n"
import { CardBase } from "../ds/card-base"
import { DesignTokens } from "@/lib/future-lens/design-tokens"
import { cn } from "@/lib/utils"

interface TaskCardProps {
  taskId: string
  taskName: string
  latestEvent: {
    id: string
    type: string
    timeStr: string
    subheadline: string
    headline?: string
    impact: string
    isUnread?: boolean
  }
  unreadCount: number
  onClick?: () => void
  onViewUnread?: () => void
}

/**
 * 任务卡片组件
 * 显示任务的最新事件，并包含未读计数
 */
export function TaskCard({ taskId, taskName, latestEvent, unreadCount, onClick, onViewUnread }: TaskCardProps) {
  const { textScale, language } = useAppConfig()
  const t = translations[language] || translations["zh"]

  const themeColors = {
    trend: {
      actionBg: "bg-muted/30 border-border",
      iconColor: "text-muted-foreground",
      textColor: "text-foreground/80",
      glow: "after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] after:from-muted-foreground/10 after:via-transparent after:to-transparent after:rounded-lg after:pointer-events-none",
    },
    risk: {
      actionBg: "bg-muted/30 border-border",
      iconColor: "text-destructive",
      textColor: "text-foreground/80",
      glow: "after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] after:from-destructive/10 after:via-transparent after:to-transparent after:rounded-lg after:pointer-events-none",
    },
    opportunity: {
      actionBg: "bg-muted/30 border-border",
      iconColor: "text-success",
      textColor: "text-foreground/80",
      glow: "",
    },
    general: {
      actionBg: "bg-muted/30 border-border",
      iconColor: "text-muted-foreground",
      textColor: "text-foreground/80",
      glow: "",
    },
  }

  const theme = themeColors[latestEvent.type as keyof typeof themeColors] || themeColors.trend

  const fSize = (base: number) => `${base * textScale}px`

  // 处理点击：如果有多个未读，显示未读列表；否则直接进入事件详情
  const handleClick = () => {
    if (unreadCount >= 2 && onViewUnread) {
      onViewUnread()
    } else if (onClick) {
      onClick()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.995 }}
    >
      <CardBase className="p-5 mb-3 group cursor-pointer" onClick={handleClick}>
        <div className="relative z-20 flex flex-col gap-2">
          {/* 1. Header */}
          <div className="flex justify-between items-baseline h-5">
            <div className="flex items-baseline">
              {/* 任务名称（普通文本，无标签框） */}
              <span
                className={DesignTokens.typography.caption}
                style={{ fontSize: fSize(10) }}
              >
                {taskName}
              </span>
            </div>
            <span 
              className={DesignTokens.typography.caption} 
              style={{ fontSize: fSize(10) }}
            >
              {latestEvent.timeStr}
            </span>
          </div>

          {/* 2. Main Text */}
          <div className="-mt-0.5">
            <h3
              className={cn(DesignTokens.typography.title, "mb-0 leading-relaxed line-clamp-3")}
              style={{ fontSize: fSize(14), lineHeight: 1.5 }}
            >
              {latestEvent.subheadline || latestEvent.headline}
            </h3>
          </div>

          {/* 3. AI Action Footer */}
          <div
            className={cn(
              "relative rounded-lg border transition-colors duration-300 overflow-hidden",
              theme.actionBg,
              theme.glow
            )}
          >
            <div className="relative z-10 px-3 py-3 flex items-start gap-3">
              {/* Icon */}
              <div className="flex-shrink-0 pt-0.5">
                <Stars size={13 * textScale} className={theme.iconColor} fill="currentColor" fillOpacity={0.2} />
              </div>

              {/* Text */}
              <div className="flex-1">
                <div className="flex flex-col justify-center">
                  <span
                    className="font-bold text-muted-foreground/60 uppercase tracking-widest leading-none mb-1"
                    style={{ fontSize: fSize(9) }}
                  >
                    {t.strategy}
                  </span>
                  <span
                    className={cn("font-semibold leading-snug line-clamp-2 text-ellipsis overflow-hidden", theme.textColor)}
                    style={{ fontSize: fSize(13) }}
                  >
                    {latestEvent.impact}
                  </span>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex-shrink-0 self-center opacity-40 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight size={15 * textScale} className={theme.iconColor} />
              </div>
            </div>
          </div>

          {/* 4. 未读计数和查看未读按钮（新增） */}
          {unreadCount > 0 && (
            <div className="flex items-center justify-between pt-1 -mb-0.5">
              <div className="flex items-center gap-1.5">
                <div
                  className={cn(
                    "w-1.5 h-1.5 rounded-full shadow-sm animate-pulse flex-shrink-0",
                    latestEvent.type === "risk" ? "bg-destructive" : "bg-blue-700"
                  )}
                />
                <span className={DesignTokens.typography.caption} style={{ fontSize: fSize(10) }}>
                  {language === "zh" ? `未读 ${unreadCount} 条` : `${unreadCount} ${t.unread}`}
                </span>
              </div>
              {unreadCount >= 2 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onViewUnread?.()
                  }}
                  className={cn(DesignTokens.typography.caption, "flex items-center gap-1 text-primary hover:text-primary/80 transition-colors")}
                  style={{ fontSize: fSize(10) }}
                >
                  <span>{t.view_unread}</span>
                  <ChevronRight size={12} />
                </button>
              )}
            </div>
          )}
        </div>
      </CardBase>
    </motion.div>
  )
}

