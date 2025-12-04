"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { StickyTabs, StickyTabsHeader, StickyTabsContext } from "@/components/future-lens/ds/sticky-tabs"
import { DesignTokens } from "@/lib/future-lens/design-tokens"
import { AppBackground } from "@/components/future-lens/ds/app-background"
import { cn } from "@/lib/utils"
import { CardRenderer } from "@/components/future-lens/ai-report/card-renderer"
import { ContentActionBar } from "@/components/future-lens/nav/content-action-bar"
import { BottomFadeOverlay } from "@/components/future-lens/nav/bottom-fade-overlay"
import { motion } from "framer-motion"
import type { ReportWithCards, CardInstance } from "@/lib/future-lens/types/card-types"
import { getEventWithCards } from "@/lib/future-lens/api/event-api-mock"

interface EventDetailPageProps {
  eventId: string
  onBack: () => void
}

export function EventDetailPage({ eventId, onBack }: EventDetailPageProps) {
  const [eventData, setEventData] = useState<ReportWithCards | null>(null)
  const [activeTab, setActiveTab] = useState(0)
  const [showTabsInHeader, setShowTabsInHeader] = useState(false)
  const [selectedCard, setSelectedCard] = useState<CardInstance | null>(null)
  const [loading, setLoading] = useState(true)

  // 加载事件数据
  useEffect(() => {
    const loadEvent = async () => {
      try {
        setLoading(true)
        const data = await getEventWithCards(eventId || "event-001")
        setEventData(data)
      } catch (error) {
        console.error("[EventDetailPage] 加载事件失败:", error)
      } finally {
        setLoading(false)
      }
    }

    loadEvent()
  }, [eventId])

  // 动态获取标签页
  const tabs = eventData?.tabs?.map((tab) => tab.label) || []

  // 当标签页数量变化时，重置activeTab
  useEffect(() => {
    if (activeTab >= tabs.length) {
      setActiveTab(0)
    }
  }, [tabs.length, activeTab])

  // 获取当前标签页的卡片
  const getCurrentTabCards = (): CardInstance[] => {
    if (!eventData?.tabs || eventData.tabs.length === 0) return []
    const currentTab = eventData.tabs[activeTab]
    if (!currentTab) return []

    // 创建卡片映射表
    const cardsMap = new Map(eventData.cards.map((card) => [card.id, card]))

    // 严格按照cardIds顺序返回卡片
    return currentTab.cardIds
      .map((cardId) => cardsMap.get(cardId))
      .filter(Boolean) as CardInstance[]
  }

  if (loading || !eventData) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        <div className="text-sm">加载中...</div>
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
      {/* PC端移动端容器包装 */}
      <div className="min-h-screen w-full bg-background font-sans text-foreground md:flex md:justify-center md:items-center p-0 md:p-8">
        <div
          className={`relative w-full md:max-w-[390px] md:h-[844px] ${DesignTokens.mobile.viewportHeight} bg-background overflow-hidden shadow-2xl md:rounded-[40px] ring-8 ring-black/5`}
        >
          <AppBackground />
          
          <div className="relative z-10 h-full">
            <div className="h-full overflow-y-auto pb-20 scrollbar-hide" id="event-detail-scroll-container">
          {/* 简化的顶部栏：只显示标题和 Tab */}
          <div className="sticky top-0 left-0 right-0 z-30 bg-background/70 backdrop-blur-xl border-b border-border/50">
            {/* 标题行 - 降低高度 */}
            <div className={cn("relative flex items-center justify-between px-4 h-12", DesignTokens.mobile.safeTop)}>
              {/* Left: Back Button */}
              <div className="flex items-center w-12">
                <button
                  onClick={onBack}
                  className="p-2 -ml-2 text-foreground/80 hover:text-foreground active:scale-95 transition-all duration-300"
                >
                  <ChevronLeft size={20} />
                </button>
              </div>

              {/* Center: Title - 绝对居中 */}
              <div className="absolute left-0 right-0 flex justify-center pointer-events-none">
                <h1 className="text-[15px] font-semibold text-foreground pointer-events-auto">
                  {eventData.name}
                </h1>
              </div>

              {/* Right: More Button */}
              <div className="flex items-center justify-end gap-2 ml-auto w-12">
                <button className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-foreground hover:bg-muted/50 transition-colors">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="19" cy="12" r="1" />
                    <circle cx="5" cy="12" r="1" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Tab 切换栏 */}
            {tabs.length > 0 && (
              <div className="px-4 py-2 border-b border-border/30">
                <StickyTabsHeader />
              </div>
            )}
          </div>

          {/* 渐变光晕背景（AI感） */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[60%] rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08)_0%,rgba(96,165,250,0.04)_40%,transparent_70%)] blur-[100px]" />
            <div className="absolute top-[20%] right-[10%] w-[50%] h-[40%] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,154,158,0.06)_0%,rgba(255,182,193,0.03)_50%,transparent_70%)] blur-[80px]" />
          </div>

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
                {getCurrentTabCards().map((card) => {
                  const handleCardClick = () => {
                    setSelectedCard(card)
                  }
                  return <CardRenderer key={card.id} card={card} onClick={handleCardClick} />
                })}
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

        {/* ContentActionBar - 固定在底部，在滚动容器外 */}
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
          shareTitle={eventData.name}
        />

        {/* Bottom Fade Overlay - 下拉模糊效果 */}
        <BottomFadeOverlay />
          </div>
        </div>
      </div>
    </StickyTabsContext.Provider>
  )
}

