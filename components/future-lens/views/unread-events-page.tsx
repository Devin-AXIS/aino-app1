"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { DesignTokens } from "@/lib/future-lens/design-tokens"
import { AppBackground } from "@/components/future-lens/ds/app-background"
import { CardRenderer } from "../ai-report/card-renderer"
import type { CardInstance } from "@/lib/future-lens/types/card-types"
import { getUnreadEventsForTask } from "@/lib/future-lens/api/task-event-api-mock"
import { markEventsAsRead } from "@/lib/future-lens/utils/read-status-manager"
import { CardBase } from "../ds/card-base"
import { cn } from "@/lib/utils"
import { useAppConfig } from "@/lib/future-lens/config-context"
import { translations } from "@/lib/future-lens/i18n"

interface UnreadEventsPageProps {
  taskId: string
  onBack: () => void
}

/**
 * 未读事件列表页
 * 显示任务的所有未读事件，使用首页相同的卡片样式
 */
export function UnreadEventsPage({ taskId, onBack }: UnreadEventsPageProps) {
  const router = useRouter()
  const { language } = useAppConfig()
  const t = translations[language] || translations["zh"]
  const [unreadEvents, setUnreadEvents] = useState<CardInstance[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEventIds, setSelectedEventIds] = useState<Set<string>>(new Set())

  // 加载未读事件列表
  useEffect(() => {
    const loadUnreadEvents = async () => {
      try {
        setLoading(true)
        const events = await getUnreadEventsForTask(taskId)
        setUnreadEvents(events)
      } catch (error) {
        console.error("[UnreadEventsPage] 加载未读事件失败:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUnreadEvents()
  }, [taskId])

  // 处理事件点击：直接进入事件详情页
  const handleEventClick = (eventId: string) => {
    router.push(`/event/${eventId}`)
  }

  // 切换选择状态
  const toggleSelect = (eventId: string) => {
    setSelectedEventIds((prev) => {
      const next = new Set(prev)
      if (next.has(eventId)) {
        next.delete(eventId)
      } else {
        next.add(eventId)
      }
      return next
    })
  }

  // 全选/取消全选
  const toggleSelectAll = () => {
    if (selectedEventIds.size === unreadEvents.length) {
      setSelectedEventIds(new Set())
    } else {
      setSelectedEventIds(new Set(unreadEvents.map((e) => e.metadata?.eventId || "").filter(Boolean)))
    }
  }

  // 一键全读
  const handleMarkAllAsRead = () => {
    const allEventIds = unreadEvents.map((e) => e.metadata?.eventId || "").filter(Boolean)
    markEventsAsRead(allEventIds)
    // 刷新页面或返回
    onBack()
  }

  // 标记选中为已读
  const handleMarkSelectedAsRead = () => {
    const selectedIds = Array.from(selectedEventIds)
    markEventsAsRead(selectedIds)
    // 从列表中移除已读事件
    setUnreadEvents((prev) => prev.filter((e) => !selectedIds.includes(e.metadata?.eventId || "")))
    setSelectedEventIds(new Set())
  }

  // PC端移动端容器包装
  return (
    <div className="min-h-screen w-full bg-background font-sans text-foreground md:flex md:justify-center md:items-center p-0 md:p-8">
      <div
        className={`relative w-full md:max-w-[390px] md:h-[844px] ${DesignTokens.mobile.viewportHeight} bg-background overflow-hidden shadow-2xl md:rounded-[40px] ring-8 ring-black/5`}
      >
        <AppBackground />

        <div className="relative z-10 h-full flex flex-col">
          {/* 顶部导航栏 */}
          <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border/50">
            <button
              onClick={onBack}
              className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-secondary transition-all active:scale-95"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className={cn(DesignTokens.typography.title, "font-semibold")} style={{ fontSize: "16px" }}>
              {language === "zh" ? "未读事件" : "Unread Events"}
            </h2>
            <div className="w-8" /> {/* 占位符，保持居中 */}
          </div>

          {/* 操作栏 */}
          {unreadEvents.length > 0 && (
            <div className="px-5 py-3 border-b border-border/50 flex items-center justify-between gap-2">
              <button
                onClick={toggleSelectAll}
                className="text-xs text-primary hover:text-primary/80 transition-colors"
              >
                {selectedEventIds.size === unreadEvents.length
                  ? language === "zh"
                    ? "取消全选"
                    : "Deselect All"
                  : language === "zh"
                    ? "全选"
                    : "Select All"}
              </button>
              <div className="flex items-center gap-2">
                {selectedEventIds.size > 0 && (
                  <button
                    onClick={handleMarkSelectedAsRead}
                    className="text-xs text-primary hover:text-primary/80 transition-colors"
                  >
                    {language === "zh" ? `标记已读 (${selectedEventIds.size})` : `Mark Read (${selectedEventIds.size})`}
                  </button>
                )}
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  <CheckCircle2 size={14} />
                  <span>{language === "zh" ? "一键全读" : "Mark All Read"}</span>
                </button>
              </div>
            </div>
          )}

          {/* 内容区域 */}
          <div className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
            {loading ? (
              <div className="flex items-center justify-center py-16 text-muted-foreground">
                <div className="text-sm">加载中...</div>
              </div>
            ) : unreadEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <CheckCircle2 size={48} className="mb-4 opacity-50" />
                <div className="text-sm">{language === "zh" ? "所有事件已读" : "All events read"}</div>
              </div>
            ) : (
              <div className="px-5 py-4 space-y-0">
                {unreadEvents.map((card) => {
                  const eventId = card.metadata?.eventId || ""
                  const isSelected = selectedEventIds.has(eventId)
                  // 从 metadata.tags 中获取任务名称（第一个 tag 就是任务名称）
                  const taskName = card.metadata?.tags?.[0] || ""

                  return (
                    <div key={card.id} className="relative mb-3">
                      {/* 选择框（可选） */}
                      {selectedEventIds.size > 0 && (
                        <div className="absolute left-2 top-2 z-10">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleSelect(eventId)
                            }}
                            className={cn(
                              "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                              isSelected
                                ? "bg-primary border-primary"
                                : "bg-background border-border hover:border-primary/50"
                            )}
                          >
                            {isSelected && <CheckCircle2 size={14} className="text-primary-foreground" />}
                          </button>
                        </div>
                      )}

                      {/* 事件卡片（使用首页相同的样式，但显示任务名称） */}
                      <div className={isSelected ? "opacity-60" : ""}>
                        <CardRenderer
                          card={card}
                          taskName={taskName}
                          showTaskName={true}
                          onClick={() => {
                            if (selectedEventIds.size === 0) {
                              // 没有选择模式，直接进入详情
                              handleEventClick(eventId)
                            } else {
                              // 选择模式，切换选择状态
                              toggleSelect(eventId)
                            }
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

