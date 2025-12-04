"use client"

import { useState } from "react"
import { CardDetailView } from "@/components/future-lens/ai-report/card-detail-view"
import type { CardInstance } from "@/lib/future-lens/types/card-types"

/**
 * 卡片详情页测试页面
 * 用于测试详情页的各种内容类型展示效果
 */
export default function CardDetailTestPage() {
  const [showDetail, setShowDetail] = useState(true)

  // 测试用的卡片数据
  const testCard: CardInstance = {
    id: "player-impact-001",
    templateId: "player-impact",
    componentName: "PlayerImpactCard",
    data: {
      title: "领军企业象限",
      summary: "具身智能领域头部企业竞争格局分析",
    },
    metadata: {
      createdAt: "2024-01-15",
      updatedAt: "2024-01-15",
    },
    dataSource: "api",
  }

  if (!showDetail) {
    return (
      <div className="flex items-center justify-center h-screen">
        <button
          onClick={() => setShowDetail(true)}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg"
        >
          打开详情页
        </button>
      </div>
    )
  }

  return (
    <CardDetailView
      card={testCard}
      onBack={() => setShowDetail(false)}
    />
  )
}

