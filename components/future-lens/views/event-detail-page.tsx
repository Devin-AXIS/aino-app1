"use client"

import { useState, useEffect } from "react"
import { DesignTokens } from "@/lib/future-lens/design-tokens"
import { AppBackground } from "@/components/future-lens/ds/app-background"
import type { ReportWithCards, CardInstance } from "@/lib/future-lens/types/card-types"
import { getEventWithCards } from "@/lib/future-lens/api/task-event-api-mock"
import { EventDetailLayout } from "@/components/future-lens/ai-report/layouts/event-detail-layout"

interface EventDetailPageProps {
  eventId: string
  onBack: () => void
  onEventChange?: (eventId: string) => void  // 事件切换回调
}

/**
 * 事件详情页面
 * 统一使用 TabsStickyLayout 布局组件，与报告页面保持一致
 * 完全通过配置驱动（config.json + cards/*.json）
 */
export function EventDetailPage({ eventId, onBack, onEventChange }: EventDetailPageProps) {
  const [eventData, setEventData] = useState<(ReportWithCards & { taskSummaryCards?: CardInstance[] }) | null>(null)
  const [loading, setLoading] = useState(true)

  // 加载事件数据（统一的数据加载方式，包含任务总结卡片）
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

  if (loading || !eventData) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        <div className="text-sm">加载中...</div>
      </div>
    )
  }

  // PC端移动端容器包装
  return (
    <div className="min-h-screen w-full bg-background font-sans text-foreground md:flex md:justify-center md:items-center p-0 md:p-8">
      <div
        className={`relative w-full md:max-w-[390px] md:h-[844px] ${DesignTokens.mobile.viewportHeight} bg-background overflow-hidden shadow-2xl md:rounded-[40px] ring-8 ring-black/5`}
      >
        <AppBackground />

        <div className="relative z-10 h-full">
          {/* 使用 EventDetailLayout，支持事件卡片在前、任务卡片在后 */}
          <EventDetailLayout 
            reportData={eventData} 
            onBack={onBack}
            onEventChange={onEventChange}
          />
        </div>
      </div>
    </div>
  )
}

