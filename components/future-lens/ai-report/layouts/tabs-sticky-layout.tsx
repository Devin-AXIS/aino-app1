/**
 * 粘性标签页布局组件
 * 用于AI产业报告等需要粘性标签页的报告类型
 * 
 * 布局特点：
 * - 标签页初始在内容区域
 * - 滚动时融入顶部栏
 * - 支持任意数量的标签页
 */

"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ScrollHeaderContainer } from "@/components/future-lens/layout/scroll-header-container"
import { ScrollHeader } from "@/components/future-lens/layout/scroll-header"
import { StickyTabs, StickyTabsHeader, StickyTabsContext } from "@/components/future-lens/ds/sticky-tabs"
import { CardRenderer } from "../card-renderer"
import { CardDetailView } from "../card-detail-view"
import { ContentActionBar } from "@/components/future-lens/nav/content-action-bar"
import { BottomFadeOverlay } from "@/components/future-lens/nav/bottom-fade-overlay"
import type { ReportWithCards, CardInstance } from "@/lib/future-lens/types/card-types"

interface TabsStickyLayoutProps {
  reportData: ReportWithCards
  onBack: () => void
  topOverviewCard?: React.ReactNode
}

export function TabsStickyLayout({ reportData, onBack, topOverviewCard }: TabsStickyLayoutProps) {
  const [activeTab, setActiveTab] = useState(0)
  const [showTabsInHeader, setShowTabsInHeader] = useState(false)
  const [selectedCard, setSelectedCard] = useState<CardInstance | null>(null)

  // 动态获取标签页（支持任意数量的标签页）
  const tabs = reportData.tabs?.map((tab) => tab.label) || []

  // 当标签页数量变化时，重置activeTab
  useEffect(() => {
    if (activeTab >= tabs.length) {
      setActiveTab(0)
    }
  }, [tabs.length, activeTab])

  // 获取当前标签页的卡片（严格按照cardIds顺序）
  const getCurrentTabCards = (): CardInstance[] => {
    if (!reportData.tabs || reportData.tabs.length === 0) return []
    const currentTab = reportData.tabs[activeTab]
    if (!currentTab) return []

    // 创建卡片映射表以提高查找效率
    const cardsMap = new Map(reportData.cards.map((card) => [card.id, card]))

    // 严格按照cardIds顺序返回卡片（100%保持原顺序）
    return currentTab.cardIds
      .map((cardId) => cardsMap.get(cardId))
      .filter(Boolean) as CardInstance[]
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
        <div className="h-full overflow-y-auto pb-20 scrollbar-hide" id="ai-report-scroll-container">
        <ScrollHeaderContainer scrollContainerId="ai-report-scroll-container">
          <ScrollHeader
            title={reportData.name}
            onBack={onBack}
            tabs={tabs.length > 0 ? <StickyTabsHeader /> : undefined}
          />
        </ScrollHeaderContainer>

        <div className="relative z-10">
          <div className="px-5">
            {topOverviewCard && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {topOverviewCard}
              </motion.div>
            )}

            {/* 标签栏：初始在内容区域，滚动时融入顶部栏（仅当有标签页时显示） */}
            {tabs.length > 0 && (
              <StickyTabs
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                scrollContainerId="ai-report-scroll-container"
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

        {/* 详情视图：内嵌在报告页内，非弹窗，覆盖层效果 */}
        {selectedCard && (
          <CardDetailView
            card={selectedCard}
            onBack={() => setSelectedCard(null)}
          />
        )}

        {/* ContentActionBar - 输入、收藏、分享 */}
        <ContentActionBar
          placeholder="询问任何问题..."
          onSend={(message) => {
            // TODO: 处理发送消息
            console.log("Send message:", message)
          }}
          onVoiceInput={() => {
            // TODO: 处理语音输入
            console.log("Voice input")
          }}
          bookmarked={false}
          onBookmark={() => {
            // TODO: 处理收藏
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

