/**
 * AI报告卡片详情页组件
 * 每个卡片对应的详情弹窗内容
 * 
 * @note 与 report-cards.tsx 对应，每个卡片组件都有对应的详情组件
 * 使用 ModalDialog 展示详情内容
 */

"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ModalDialog } from "@/components/future-lens/ds/modal-dialog"
import type { CardInstance } from "@/lib/future-lens/types/card-types"
import { DetailContentRenderer } from "./detail-content-renderer"
import { getCardDetail } from "@/lib/future-lens/api/card-api-mock"
import type { DetailContent } from "@/lib/future-lens/types/detail-content-types"

/**
 * 详情页组件 Props
 */
interface CardDetailProps {
  /** 卡片数据 */
  card: CardInstance
  /** 是否打开 */
  isOpen: boolean
  /** 关闭回调 */
  onClose: () => void
}

/**
 * 产业结构分层 - 详情页
 */
export function IndustryStackDetail({ card, isOpen, onClose }: CardDetailProps) {
  return (
    <ModalDialog isOpen={isOpen} onClose={onClose} title={card.data.title as string}>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {/* 详情内容 */}
          {card.data.summary as string}
        </p>
        {/* 可以添加更多详情内容：图表、列表、交互等 */}
      </div>
    </ModalDialog>
  )
}

/**
 * 核心趋势雷达 - 详情页
 */
export function TrendRadarDetail({ card, isOpen, onClose }: CardDetailProps) {
  return (
    <ModalDialog isOpen={isOpen} onClose={onClose} title={card.data.title as string}>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {card.data.summary as string}
        </p>
      </div>
    </ModalDialog>
  )
}

/**
 * 价值重心迁移 - 详情页
 */
export function StructuralShiftDetail({ card, isOpen, onClose }: CardDetailProps) {
  return (
    <ModalDialog isOpen={isOpen} onClose={onClose} title={card.data.title as string}>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {card.data.summary as string}
        </p>
      </div>
    </ModalDialog>
  )
}

/**
 * 技术突破时间轴 - 详情页
 */
export function TechTimelineDetail({ card, isOpen, onClose }: CardDetailProps) {
  return (
    <ModalDialog isOpen={isOpen} onClose={onClose} title={card.data.title as string}>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {card.data.summary as string}
        </p>
      </div>
    </ModalDialog>
  )
}

/**
 * 行业节奏指征 - 详情页
 */
export function IndustryPaceDetail({ card, isOpen, onClose }: CardDetailProps) {
  return (
    <ModalDialog isOpen={isOpen} onClose={onClose} title={card.data.title as string}>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {card.data.summary as string}
        </p>
      </div>
    </ModalDialog>
  )
}

/**
 * 资金流向追踪 - 详情页
 */
export function CapitalFlowDetail({ card, isOpen, onClose }: CardDetailProps) {
  return (
    <ModalDialog isOpen={isOpen} onClose={onClose} title={card.data.title as string}>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {card.data.summary as string}
        </p>
      </div>
    </ModalDialog>
  )
}

/**
 * 领军企业象限 - 详情页
 */
export function PlayerImpactDetail({ card, isOpen, onClose }: CardDetailProps) {
  const [detailContent, setDetailContent] = useState<DetailContent | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    if (isOpen && card.id) {
      setLoading(true)
      getCardDetail(card.id)
        .then((content) => {
          setDetailContent(content)
        })
        .catch((error) => {
          console.error("[PlayerImpactDetail] 加载详情失败:", error)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [isOpen, card.id])

  return (
    <ModalDialog isOpen={isOpen} onClose={onClose} title={card.data.title as string}>
      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <div className="text-sm">加载中...</div>
        </div>
      ) : detailContent ? (
        <DetailContentRenderer content={detailContent} activeTab={activeTab} onTabChange={setActiveTab} />
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{card.data.summary as string}</p>
        </div>
      )}
    </ModalDialog>
  )
}

/**
 * 叙事与资本共振 - 详情页
 */
export function NarrativeCapitalDetail({ card, isOpen, onClose }: CardDetailProps) {
  return (
    <ModalDialog isOpen={isOpen} onClose={onClose} title={card.data.title as string}>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {card.data.summary as string}
        </p>
      </div>
    </ModalDialog>
  )
}

/**
 * 供应链脆弱性 - 详情页
 */
export function SupplyChainHealthDetail({ card, isOpen, onClose }: CardDetailProps) {
  const [detailContent, setDetailContent] = useState<DetailContent | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    if (isOpen && card.id) {
      setLoading(true)
      getCardDetail(card.id)
        .then((content) => {
          setDetailContent(content)
        })
        .catch((error) => {
          console.error("[SupplyChainHealthDetail] 加载详情失败:", error)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [isOpen, card.id])

  return (
    <ModalDialog isOpen={isOpen} onClose={onClose} title={card.data.title as string}>
      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <div className="text-sm">加载中...</div>
        </div>
      ) : detailContent ? (
        <DetailContentRenderer content={detailContent} activeTab={activeTab} onTabChange={setActiveTab} />
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{card.data.summary as string}</p>
        </div>
      )}
    </ModalDialog>
  )
}

/**
 * 生态网络拓扑 - 详情页
 */
export function EcosystemMapDetail({ card, isOpen, onClose }: CardDetailProps) {
  return (
    <ModalDialog isOpen={isOpen} onClose={onClose} title={card.data.title as string}>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {card.data.summary as string}
        </p>
      </div>
    </ModalDialog>
  )
}

/**
 * 战略机遇窗口 - 详情页
 */
export function StrategyWindowDetail({ card, isOpen, onClose }: CardDetailProps) {
  return (
    <ModalDialog isOpen={isOpen} onClose={onClose} title={card.data.title as string}>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {card.data.summary as string}
        </p>
      </div>
    </ModalDialog>
  )
}

/**
 * 关键人物图谱 - 详情页
 */
export function InfluencerDetail({ card, isOpen, onClose }: CardDetailProps) {
  return (
    <ModalDialog isOpen={isOpen} onClose={onClose} title={card.data.title as string}>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {card.data.summary as string}
        </p>
      </div>
    </ModalDialog>
  )
}

/**
 * 未来情景推演 - 详情页
 */
export function ScenarioDetail({ card, isOpen, onClose }: CardDetailProps) {
  return (
    <ModalDialog isOpen={isOpen} onClose={onClose} title={card.data.title as string}>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {card.data.summary as string}
        </p>
      </div>
    </ModalDialog>
  )
}

/**
 * 风险传导模拟 - 详情页
 */
export function ShockSimulationDetail({ card, isOpen, onClose }: CardDetailProps) {
  return (
    <ModalDialog isOpen={isOpen} onClose={onClose} title={card.data.title as string}>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {card.data.summary as string}
        </p>
      </div>
    </ModalDialog>
  )
}

/**
 * 驱动因素权重 - 详情页
 */
export function FactorWeightingDetail({ card, isOpen, onClose }: CardDetailProps) {
  return (
    <ModalDialog isOpen={isOpen} onClose={onClose} title={card.data.title as string}>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {card.data.summary as string}
        </p>
      </div>
    </ModalDialog>
  )
}

/**
 * AI核心洞察压缩 - 详情页
 */
export function InsightCompressionDetail({ card, isOpen, onClose }: CardDetailProps) {
  return (
    <ModalDialog isOpen={isOpen} onClose={onClose} title={card.data.title as string}>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {card.data.summary as string}
        </p>
      </div>
    </ModalDialog>
  )
}

/**
 * 详情页组件映射表
 * 根据 componentName 查找对应的详情组件
 */
export const CARD_DETAIL_COMPONENTS: Record<string, React.ComponentType<CardDetailProps>> = {
  IndustryStackCard: IndustryStackDetail,
  TrendRadarCard: TrendRadarDetail,
  StructuralShiftCard: StructuralShiftDetail,
  TechTimelineCard: TechTimelineDetail,
  IndustryPaceCard: IndustryPaceDetail,
  CapitalFlowCard: CapitalFlowDetail,
  PlayerImpactCard: PlayerImpactDetail,
  NarrativeCapitalCard: NarrativeCapitalDetail,
  SupplyChainHealthCard: SupplyChainHealthDetail,
  EcosystemMapCard: EcosystemMapDetail,
  StrategyWindowCard: StrategyWindowDetail,
  InfluencerCard: InfluencerDetail,
  ScenarioCard: ScenarioDetail,
  ShockSimulationCard: ShockSimulationDetail,
  FactorWeightingCard: FactorWeightingDetail,
  InsightCompressionCard: InsightCompressionDetail,
}

/**
 * 获取卡片详情组件
 * @param componentName 卡片组件名称
 * @returns 详情组件，如果未找到则返回 null
 */
export function getCardDetailComponent(componentName: string): React.ComponentType<CardDetailProps> | null {
  return CARD_DETAIL_COMPONENTS[componentName] || null
}

