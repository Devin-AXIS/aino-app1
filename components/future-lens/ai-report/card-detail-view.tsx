/**
 * 卡片详情视图组件
 * 
 * 特点：
 * - 内嵌在报告页内，非弹窗
 * - 毛玻璃顶部栏（透明度 30-40%），可看见背景
 * - 背景使用 AppBackground（首页同款）
 * - 滚动时顶部栏收进去（非 fixed）
 * - 支持标签切换（Overview, Details, Sources）
 */

"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, MoreHorizontal } from "lucide-react"
import { AppBackground } from "@/components/future-lens/ds/app-background"
import { DetailContentRenderer } from "./detail-content-renderer"
import type { CardInstance } from "@/lib/future-lens/types/card-types"
import type { DetailContent } from "@/lib/future-lens/types/detail-content-types"
import { getCardDetail } from "@/lib/future-lens/api/card-api-mock"

interface CardDetailViewProps {
  /** 卡片数据 */
  card: CardInstance
  /** 返回回调 */
  onBack: () => void
}

/**
 * 卡片详情视图
 * 
 * 标签从 JSON 配置中动态读取（detailContent.tabs）
 * 如果没有 tabs，则不显示标签栏
 * 
 * @example
 * ```tsx
 * <CardDetailView 
 *   card={cardInstance}
 *   onBack={() => setShowDetail(false)}
 * />
 * ```
 */
export function CardDetailView({ card, onBack }: CardDetailViewProps) {
  const [activeTab, setActiveTab] = useState(0)
  const [detailContent, setDetailContent] = useState<DetailContent | null>(null)
  const [loading, setLoading] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // 从 detailContent 中提取标签列表
  const tabs = detailContent?.tabs?.map((tab) => tab.label) || []

  // 加载详情内容
  useEffect(() => {
    if (card.id) {
      setLoading(true)
      getCardDetail(card.id)
        .then((content) => {
          setDetailContent(content)
          // 如果有标签，重置 activeTab 为 0
          if (content?.tabs && content.tabs.length > 0) {
            setActiveTab(0)
          }
        })
        .catch((error) => {
          console.error("[CardDetailView] 加载详情失败:", error)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [card.id])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 z-50 overflow-hidden"
      >
        {/* 背景：首页同款 AppBackground */}
        <div className="absolute inset-0">
          <AppBackground />
        </div>

        {/* 内容区域：从底部滑入 */}
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="relative h-full flex flex-col"
        >
          {/* 顶部栏：相对于容器固定，毛玻璃效果，透明度 30-40% */}
          <header className="absolute top-0 left-0 right-0 z-50 pointer-events-none">
            {/* 毛玻璃背景：透明度 30-40%，可看见背景 */}
            <div
              className="backdrop-blur-xl border-b border-border/30 bg-white/35 dark:bg-slate-900/35"
            >
                {/* 顶部导航 */}
                <div className="flex items-center justify-between px-4 py-3">
                  <button
                    onClick={onBack}
                    className="pointer-events-auto p-2 text-foreground/80 hover:text-foreground active:scale-95 transition-all rounded-full hover:bg-foreground/10"
                  >
                    <X size={20} strokeWidth={2.5} />
                    <span className="sr-only">关闭</span>
                  </button>

                  {/* 标题：居中 */}
                  <h1 className="absolute left-1/2 -translate-x-1/2 text-sm font-semibold text-foreground pointer-events-auto">
                    {card.data.title as string || "详情"}
                  </h1>

                  <button
                    onClick={() => console.log("More actions")}
                    className="pointer-events-auto p-2 text-foreground/80 hover:text-foreground active:scale-95 transition-all"
                  >
                    <MoreHorizontal size={24} strokeWidth={2.5} />
                    <span className="sr-only">更多</span>
                  </button>
                </div>

                {/* 标签切换：从 JSON 配置中动态读取 */}
                {tabs.length > 0 && (
                  <div className={`flex items-center gap-6 px-4 pb-3 overflow-x-auto scrollbar-hide ${
                    tabs.length <= 3 ? 'justify-center' : 'justify-start'
                  }`}>
                    {detailContent?.tabs?.map((tab, index) => {
                      const isActive = activeTab === index
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(index)}
                          className={`pointer-events-auto text-sm font-medium transition-all duration-300 relative px-1 py-1 whitespace-nowrap flex-shrink-0 ${
                            isActive
                              ? "text-foreground scale-105"
                              : "text-foreground/60 hover:text-foreground/80"
                          }`}
                        >
                          {tab.label}
                          {isActive && (
                            <motion.div
                              layoutId="activeTabIndicator"
                              className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                            />
                          )}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </header>

          {/* 滚动内容区域 */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto scrollbar-hide pt-20"
          >
            <div className="px-5 pb-20">
              {loading ? (
                <div className="flex items-center justify-center py-16 text-muted-foreground">
                  <div className="text-sm">加载中...</div>
                </div>
              ) : detailContent ? (
                <DetailContentRenderer
                  content={detailContent}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                />
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">{card.data.summary as string}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

