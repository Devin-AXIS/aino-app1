/**
 * 事件详情页专用布局组件
 * 
 * 特点：
 * - Tab1（当前报告）：事件卡片在前，任务卡片在后
 * - Tab2（历史事件）：任务趋势说明 + 事件列表
 * - 完全配置驱动
 */

"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ScrollHeaderContainer } from "@/components/future-lens/layout/scroll-header-container"
import { ScrollHeader } from "@/components/future-lens/layout/scroll-header"
import { StickyTabs, StickyTabsHeader, StickyTabsContext } from "@/components/future-lens/ds/sticky-tabs"
import { CardRenderer } from "../card-renderer"
import { ContentActionBar } from "@/components/future-lens/nav/content-action-bar"
import { BottomFadeOverlay } from "@/components/future-lens/nav/bottom-fade-overlay"
import type { ReportWithCards, CardInstance } from "@/lib/future-lens/types/card-types"
import { getTaskEventsList, getTaskIdFromEvent } from "@/lib/future-lens/api/task-event-api-mock"
import { CardBase } from "@/components/future-lens/ds/card-base"
import { DesignTokens } from "@/lib/future-lens/design-tokens"
import { useAppConfig } from "@/lib/future-lens/config-context"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

interface EventDetailLayoutProps {
  reportData: ReportWithCards & { taskSummaryCards?: CardInstance[] }
  onBack: () => void
}

export function EventDetailLayout({ reportData, onBack }: EventDetailLayoutProps) {
  const [activeTab, setActiveTab] = useState(0)
  const [showTabsInHeader, setShowTabsInHeader] = useState(false)
  const [taskEventsList, setTaskEventsList] = useState<any>(null)
  const { textScale } = useAppConfig()
  const fSize = (base: number, scale?: number) => base * (scale || textScale)

  // 动态获取标签页
  const tabs = reportData.tabs?.map((tab) => tab.label) || []

  // 获取任务ID
  const taskId = getTaskIdFromEvent(reportData.id) || null

  // 加载任务事件列表（用于历史事件Tab）
  useEffect(() => {
    if (taskId && activeTab === 1) {
      const loadTaskEvents = async () => {
        try {
          const data = await getTaskEventsList(taskId)
          setTaskEventsList(data)
        } catch (error) {
          console.error("[EventDetailLayout] 加载任务事件列表失败:", error)
        }
      }
      loadTaskEvents()
    }
  }, [taskId, activeTab])

  // 当标签页数量变化时，重置activeTab
  useEffect(() => {
    if (activeTab >= tabs.length) {
      setActiveTab(0)
    }
  }, [tabs.length, activeTab])

  // 获取当前标签页的卡片（Tab1：事件卡片 + 任务卡片）
  const getCurrentTabCards = (): CardInstance[] => {
    if (!reportData.tabs || reportData.tabs.length === 0) return []
    const currentTab = reportData.tabs[activeTab]
    if (!currentTab) return []

    // 创建卡片映射表
    const cardsMap = new Map(reportData.cards.map((card) => [card.id, card]))

    // 严格按照cardIds顺序返回事件卡片
    const eventCards = currentTab.cardIds
      .map((cardId) => cardsMap.get(cardId))
      .filter(Boolean) as CardInstance[]

    // Tab1（当前报告）：事件卡片 + 任务卡片
    if (activeTab === 0 && reportData.taskSummaryCards) {
      return [...eventCards, ...reportData.taskSummaryCards]
    }

    return eventCards
  }

  // 渲染Tab1内容（当前报告：事件卡片 + 任务卡片）
  const renderCurrentReportTab = () => {
    const cards = getCurrentTabCards()
    const eventCards = reportData.cards || []
    const taskCards = reportData.taskSummaryCards || []

    return (
      <div className="space-y-0">
        {/* 事件卡片（在前） */}
        {eventCards.map((card) => (
          <CardRenderer key={card.id} card={card} />
        ))}

        {/* 分隔线：事件卡片和任务卡片之间 */}
        {eventCards.length > 0 && taskCards.length > 0 && (
          <div className="my-4">
            <div className="flex items-center gap-3 mb-3">
              <Separator className="flex-1" />
              <span
                className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wider px-2"
                style={{ fontSize: `${fSize(10, textScale)}px` }}
              >
                任务上下文
              </span>
              <Separator className="flex-1" />
            </div>
          </div>
        )}

        {/* 任务卡片（在后） */}
        {taskCards.map((card) => (
          <CardRenderer key={card.id} card={card} />
        ))}
      </div>
    )
  }

  // 渲染Tab2内容（历史事件：任务趋势 + 事件列表）
  const renderHistoryEventsTab = () => {
    if (!taskEventsList) {
      return (
        <div className="flex items-center justify-center py-8 text-muted-foreground">
          <div className="text-sm">加载中...</div>
        </div>
      )
    }

    const { trendSummary, events } = taskEventsList
    const currentEventId = reportData.id

    return (
      <div className="space-y-4">
        {/* 任务趋势说明（顶部） */}
        {trendSummary && (
          <CardBase className="mb-3">
            <div className="mb-3">
              <h3
                className={cn(DesignTokens.typography.title, "mb-2")}
                style={{ fontSize: `${fSize(14, textScale)}px` }}
              >
                任务趋势分析
              </h3>
              <div className="text-xs text-muted-foreground/60 mb-2">{trendSummary.period}</div>
            </div>

            <div className="space-y-3">
              {/* 趋势总结 */}
              <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                <p
                  className="text-muted-foreground/80 leading-relaxed"
                  style={{ fontSize: `${fSize(12, textScale)}px` }}
                >
                  {trendSummary.summary}
                </p>
              </div>

              {/* 关键洞察 */}
              {trendSummary.insights && trendSummary.insights.length > 0 && (
                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-1.5">关键洞察</div>
                  <div className="space-y-1.5">
                    {trendSummary.insights.map((insight: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2">
                        <div className="w-1 h-1 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                        <p
                          className="text-muted-foreground/80 flex-1"
                          style={{ fontSize: `${fSize(12, textScale)}px` }}
                        >
                          {insight}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 建议 */}
              {trendSummary.recommendation && (
                <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="text-xs font-medium text-primary mb-1">建议</div>
                  <p
                    className="text-primary/80"
                    style={{ fontSize: `${fSize(12, textScale)}px` }}
                  >
                    {trendSummary.recommendation}
                  </p>
                </div>
              )}
            </div>
          </CardBase>
        )}

        {/* 事件列表（按时间倒序） */}
        {events && events.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground mb-2 px-1">
              所有事件（{events.length}个）
            </div>
            {events.map((event: any) => {
              const isCurrent = event.id === currentEventId
              return (
                <CardBase
                  key={event.id}
                  className={cn(
                    "mb-2 cursor-pointer transition-all",
                    isCurrent
                      ? "border-2 border-primary/30 bg-primary/5"
                      : "border border-border hover:border-primary/20"
                  )}
                  onClick={() => {
                    // TODO: 切换查看其他事件
                    console.log("Switch to event:", event.id)
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {isCurrent && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/20 text-primary">
                            当前
                          </span>
                        )}
                        <h4
                          className={cn(
                            "font-semibold",
                            isCurrent ? "text-primary" : "text-foreground"
                          )}
                          style={{ fontSize: `${fSize(13, textScale)}px` }}
                        >
                          {event.name}
                        </h4>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground/60">
                        <span>{new Date(event.createdAt).toLocaleString("zh-CN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                        <span>影响：{event.impact}</span>
                        <span>紧急度：{event.urgency}</span>
                      </div>
                    </div>
                  </div>
                </CardBase>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <StickyTabsContext.Provider
      value={{
        showInHeader: showTabsInHeader,
        tabs,
        activeTab,
        onTabChange: setActiveTab,
      }}
    >
      <div className="relative h-full">
        <div className="h-full overflow-y-auto pb-20 scrollbar-hide" id="event-detail-scroll-container">
          <ScrollHeaderContainer scrollContainerId="event-detail-scroll-container">
            <ScrollHeader
              title={reportData.name}
              onBack={onBack}
              tabs={tabs.length > 0 ? <StickyTabsHeader /> : undefined}
            />
          </ScrollHeaderContainer>

          <div className="relative z-10">
            <div className="px-5 pt-4">
              {/* 标签栏：初始在内容区域，滚动时融入顶部栏 */}
              {tabs.length > 0 && (
                <StickyTabs
                  tabs={tabs}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  scrollContainerId="event-detail-scroll-container"
                  className="mb-3"
                  onVisibilityChange={setShowTabsInHeader}
                />
              )}

              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Tab1: 当前报告（事件卡片 + 任务卡片） */}
                {activeTab === 0 && renderCurrentReportTab()}

                {/* Tab2: 历史事件（任务趋势 + 事件列表） */}
                {activeTab === 1 && renderHistoryEventsTab()}
              </motion.div>
            </div>

            <div className="text-center mt-10 mb-6 px-5">
              <div className="flex items-center justify-center gap-2 text-muted-foreground/50">
                <span className="font-bold uppercase tracking-widest text-xs">
                  FutureLens AI Strategy OS v1.0
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ContentActionBar - 输入、收藏、分享 */}
        <ContentActionBar
          placeholder="询问任何问题..."
          onSend={(message) => {
            console.log("Send message:", message)
          }}
          onVoiceInput={() => {
            console.log("Voice input")
          }}
          bookmarked={false}
          onBookmark={() => {
            console.log("Bookmark")
          }}
          shareUrl={typeof window !== "undefined" ? window.location.href : ""}
          shareTitle={reportData.name}
        />

        {/* Bottom Fade Overlay - 下拉模糊效果 */}
        <BottomFadeOverlay />
      </div>
    </StickyTabsContext.Provider>
  )
}

