/**
 * 单页布局组件
 * 用于不需要标签页的报告类型
 * 
 * 布局特点：
 * - 无标签页
 * - 直接显示所有卡片
 * - 适合简单的报告类型
 */

"use client"

import { motion } from "framer-motion"
import { ScrollHeaderContainer } from "@/components/future-lens/layout/scroll-header-container"
import { ScrollHeader } from "@/components/future-lens/layout/scroll-header"
import { CardRenderer } from "../card-renderer"
import { ContentActionBar } from "@/components/future-lens/nav/content-action-bar"
import { BottomFadeOverlay } from "@/components/future-lens/nav/bottom-fade-overlay"
import type { ReportWithCards, CardInstance } from "@/lib/future-lens/types/card-types"

interface SinglePageLayoutProps {
  reportData: ReportWithCards
  onBack: () => void
  topOverviewCard?: React.ReactNode
}

export function SinglePageLayout({ reportData, onBack, topOverviewCard }: SinglePageLayoutProps) {
  // 获取所有卡片（按cardIds顺序）
  const getAllCards = (): CardInstance[] => {
    if (!reportData.cardIds || reportData.cardIds.length === 0) {
      // 如果没有cardIds，返回所有卡片
      return reportData.cards
    }

    // 创建卡片映射表
    const cardsMap = new Map(reportData.cards.map((card) => [card.id, card]))

    // 严格按照cardIds顺序返回卡片
    return reportData.cardIds
      .map((cardId) => cardsMap.get(cardId))
      .filter(Boolean) as CardInstance[]
  }

  return (
    <div className="h-full overflow-y-auto pb-20 scrollbar-hide" id="ai-report-scroll-container">
      <ScrollHeaderContainer scrollContainerId="ai-report-scroll-container">
        <ScrollHeader title={reportData.name} onBack={onBack} />
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {getAllCards().map((card) => (
              <CardRenderer key={card.id} card={card} />
            ))}
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
  )
}

