"use client"

import type React from "react"
import {
  FileText,
  PieChart,
  Layers,
  Users,
  MapPin,
  Target,
  Shield,
  GitCompare,
  Network,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Clock,
  Rocket,
  Sparkles,
  Building2,
  Calendar,
} from "lucide-react"
import { CardBase } from "@/components/future-lens/ds/card-base"
import { Timeline } from "@/components/future-lens/ds/timeline"
import { useAppConfig } from "@/lib/future-lens/config-context"
import { ChartDefaults } from "@/components/future-lens/charts/chart-config"
import { ChartColorsRaw } from "@/components/future-lens/charts/chart-colors"
import { SolidRadarChart } from "@/components/future-lens/charts/solid-radar-chart"
import { FinancialMetricsChart } from "@/components/future-lens/charts/financial-metrics-chart"
import { FinancialHealthGauge } from "@/components/future-lens/charts/financial-health-gauge"
import ReactMarkdown from "react-markdown"

// 导入共享组件
const AIAnalystHeader = ({ title, summary, icon: Icon = Sparkles }: { title: string; summary: string; icon?: React.ElementType }) => {
  const { textScale } = useAppConfig()
  const fSize = (base: number) => base * textScale

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2.5">
        <Icon size={16} className="text-primary flex-shrink-0" />
        <h3 className="font-bold text-foreground" style={{ fontSize: `${fSize(13)}px` }}>
          {title}
        </h3>
        <Sparkles size={12} className="text-primary fill-primary ml-auto flex-shrink-0" />
      </div>
      <div className="bg-muted/30 p-4 rounded-2xl border border-border/50">
        <div
          className="prose prose-sm max-w-none dark:prose-invert line-clamp-10 text-muted-foreground"
          style={{ fontSize: `${fSize(12)}px` }}
        >
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
              ul: ({ children }) => <ul className="my-2 ml-4 list-disc space-y-1">{children}</ul>,
              ol: ({ children }) => <ol className="my-2 ml-4 list-decimal space-y-1">{children}</ol>,
              li: ({ children }) => <li className="leading-relaxed">{children}</li>,
              strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
              em: ({ children }) => <em className="italic">{children}</em>,
            }}
          >
            {summary}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  )
}

const ActionButton = ({ text, onClick }: { text: string; onClick?: () => void }) => {
  const { textScale } = useAppConfig()
  const fSize = (base: number) => base * textScale

  return (
    <div
      className="mt-4 pt-3 border-t border-border/50 flex justify-between items-center group cursor-pointer"
      onClick={onClick}
    >
      <span
        className="font-bold text-muted-foreground/50 uppercase tracking-widest"
        style={{ fontSize: `${fSize(9)}px` }}
      >
        Deep Dive
      </span>
      <div
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/30 text-foreground font-bold group-hover:bg-primary/10 group-hover:text-primary transition-colors"
        style={{ fontSize: `${fSize(11)}px` }}
      >
        {text} <span style={{ fontSize: `${fSize(11)}px` }}>→</span>
      </div>
    </div>
  )
}

// 企业分析报告卡片组件
interface CompanyProfileCardProps {
  data: {
    title: string
    summary: string
    icon?: string
    metrics: Array<{ name: string; value: string }>
    actionText?: string
  }
  onClick?: () => void
}

export const CompanyProfileCard = ({ data, onClick }: CompanyProfileCardProps) => {
  const { textScale } = useAppConfig()
  const fSize = (base: number) => base * textScale
  const IconComponent = FileText

  return (
    <CardBase className="mb-3">
      <AIAnalystHeader title={data.title} icon={IconComponent} summary={data.summary} />
      <div className="grid grid-cols-2 gap-2">
        {data.metrics.map((m, i) => (
          <div key={i} className="p-2.5 rounded-xl border border-border/30 bg-muted/20">
            <div className="font-bold text-muted-foreground mb-1" style={{ fontSize: `${fSize(9)}px` }}>
              {m.name}
            </div>
            <div className="font-black text-foreground" style={{ fontSize: `${fSize(13)}px` }}>
              {m.value}
            </div>
          </div>
        ))}
      </div>
      <ActionButton text={data.actionText || "查看完整档案"} onClick={onClick} />
    </CardBase>
  )
}

interface BusinessMixCardProps {
  data: {
    title: string
    summary: string
    icon?: string
    businessLines: Array<{ name: string; percentage: number; growth: number; isCore: boolean }>
    actionText?: string
  }
  onClick?: () => void
}

export const BusinessMixCard = ({ data, onClick }: BusinessMixCardProps) => {
  const { textScale } = useAppConfig()
  const fSize = (base: number) => base * textScale
  const IconComponent = PieChart

  const colors = [
    ChartColorsRaw.series.primary,
    ChartColorsRaw.series.secondary,
    ChartColorsRaw.series.tertiary,
  ]

  return (
    <CardBase className="mb-3">
      <AIAnalystHeader title={data.title} icon={IconComponent} summary={data.summary} />
      <div className="flex flex-col gap-2">
        {data.businessLines.map((line, i) => {
          const color = colors[i % colors.length]
          return (
            <div key={i} className="p-2.5 rounded-xl border border-border/30 bg-muted/20">
              <div className="flex justify-between items-center mb-1.5">
                <span className="font-bold text-foreground" style={{ fontSize: `${fSize(11)}px` }}>
                  {line.name}
                </span>
                <span className="font-black" style={{ fontSize: `${fSize(13)}px`, color }}>
                  {line.percentage}%
                </span>
              </div>
              <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${line.percentage}%`, backgroundColor: color }}
                />
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-muted-foreground" style={{ fontSize: `${fSize(9)}px` }}>
                  {line.isCore ? "核心业务" : "拓展业务"}
                </span>
                <span className="font-bold text-success" style={{ fontSize: `${fSize(9)}px` }}>
                  +{line.growth}%
                </span>
              </div>
            </div>
          )
        })}
      </div>
      <ActionButton text={data.actionText || "查看业务详细分析"} onClick={onClick} />
    </CardBase>
  )
}

interface ProductTechMapCardProps {
  data: {
    title: string
    summary: string
    icon?: string
    products: Array<{ name: string; tech: string; status: string }>
    actionText?: string
  }
  onClick?: () => void
}

export const ProductTechMapCard = ({ data, onClick }: ProductTechMapCardProps) => {
  const { textScale } = useAppConfig()
  const fSize = (base: number) => base * textScale
  const IconComponent = Layers

  const statusColors: Record<string, string> = {
    成熟: ChartColorsRaw.semantic.success,
    发展中: ChartColorsRaw.semantic.warning,
    探索中: ChartColorsRaw.semantic.warning + "80",
  }

  return (
    <CardBase className="mb-3">
      <AIAnalystHeader title={data.title} icon={IconComponent} summary={data.summary} />
      <div className="flex flex-col gap-2">
        {data.products.map((p, i) => (
          <div key={i} className="p-2.5 rounded-xl border border-border/30 flex justify-between items-center">
            <div className="flex-1">
              <div className="font-bold text-foreground mb-0.5" style={{ fontSize: `${fSize(11)}px` }}>
                {p.name}
              </div>
              <div className="text-muted-foreground" style={{ fontSize: `${fSize(9)}px` }}>
                {p.tech}
              </div>
            </div>
            <div
              className="px-2 py-1 rounded-full font-bold"
              style={{
                fontSize: `${fSize(9)}px`,
                backgroundColor: statusColors[p.status] + "20",
                color: statusColors[p.status],
              }}
            >
              {p.status}
            </div>
          </div>
        ))}
      </div>
      <ActionButton text={data.actionText || "查看技术栈详情"} onClick={onClick} />
    </CardBase>
  )
}

interface CustomerUseCaseCardProps {
  data: {
    title: string
    summary: string
    icon?: string
    customerTypes: Array<{ type: string; percentage: number; maturity: string }>
    actionText?: string
  }
  onClick?: () => void
}

export const CustomerUseCaseCard = ({ data, onClick }: CustomerUseCaseCardProps) => {
  const { textScale } = useAppConfig()
  const fSize = (base: number) => base * textScale
  const IconComponent = Users

  const colors = [
    ChartColorsRaw.series.primary,
    ChartColorsRaw.series.secondary,
    ChartColorsRaw.series.tertiary,
    ChartColorsRaw.series.quaternary,
  ]

  return (
    <CardBase className="mb-3">
      <AIAnalystHeader title={data.title} icon={IconComponent} summary={data.summary} />
      <div className="flex flex-col gap-2">
        {data.customerTypes.map((ct, i) => {
          const color = colors[i % colors.length]
          return (
            <div key={i} className="p-2.5 rounded-xl border border-border/30 bg-muted/20">
              <div className="flex justify-between items-center mb-1.5">
                <span className="font-bold text-foreground" style={{ fontSize: `${fSize(11)}px` }}>
                  {ct.type}
                </span>
                <span className="font-black" style={{ fontSize: `${fSize(13)}px`, color }}>
                  {ct.percentage}%
                </span>
              </div>
              <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${ct.percentage}%`, backgroundColor: color }}
                />
              </div>
              <div className="mt-1">
                <span className="text-muted-foreground" style={{ fontSize: `${fSize(9)}px` }}>
                  成熟度: {ct.maturity}
                </span>
              </div>
            </div>
          )
        })}
      </div>
      <ActionButton text={data.actionText || "查看客户详细分析"} onClick={onClick} />
    </CardBase>
  )
}

interface OrgFootprintCardProps {
  data: {
    title: string
    summary: string
    icon?: string
    locations: Array<{ name: string; type: string; people: number; function: string }>
    actionText?: string
  }
  onClick?: () => void
}

export const OrgFootprintCard = ({ data, onClick }: OrgFootprintCardProps) => {
  const { textScale } = useAppConfig()
  const fSize = (base: number) => base * textScale
  const IconComponent = MapPin

  return (
    <CardBase className="mb-3">
      <AIAnalystHeader title={data.title} icon={IconComponent} summary={data.summary} />
      <div className="flex flex-col gap-2">
        {data.locations.map((loc, i) => (
          <div key={i} className="p-2.5 rounded-xl border border-border/30 bg-muted/20">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-foreground" style={{ fontSize: `${fSize(11)}px` }}>
                {loc.name}
              </span>
              <span className="font-black text-foreground" style={{ fontSize: `${fSize(13)}px` }}>
                {loc.people}人
              </span>
            </div>
            <div className="text-muted-foreground mb-0.5" style={{ fontSize: `${fSize(9)}px` }}>
              {loc.type} · {loc.function}
            </div>
          </div>
        ))}
      </div>
      <ActionButton text={data.actionText || "查看组织架构详情"} onClick={onClick} />
    </CardBase>
  )
}

interface IndustryPositioningCardProps {
  data: {
    title: string
    summary: string
    icon?: string
    position: string
    marketShare: number
    ranking: string
    metrics: Array<{ name: string; value: number | string }>
    actionText?: string
  }
  onClick?: () => void
}

export const IndustryPositioningCard = ({ data, onClick }: IndustryPositioningCardProps) => {
  const { textScale } = useAppConfig()
  const fSize = (base: number) => base * textScale
  const IconComponent = Target

  return (
    <CardBase className="mb-3">
      <AIAnalystHeader title={data.title} icon={IconComponent} summary={data.summary} />
      <div className="grid grid-cols-3 gap-2 mb-3">
        {data.metrics.map((m, i) => (
          <div key={i} className="p-2.5 rounded-xl border border-border/30 bg-muted/20 text-center">
            <div className="font-bold text-muted-foreground mb-1" style={{ fontSize: `${fSize(9)}px` }}>
              {m.name}
            </div>
            <div className="font-black text-foreground" style={{ fontSize: `${fSize(13)}px` }}>
              {m.value}
            </div>
          </div>
        ))}
      </div>
      <ActionButton text={data.actionText || "查看竞争格局分析"} onClick={onClick} />
    </CardBase>
  )
}

interface MoatMapCardProps {
  data: {
    title: string
    summary: string
    icon?: string
    advantages: Array<{ dimension: string; score: number; description: string }>
    actionText?: string
  }
  onClick?: () => void
}

export const MoatMapCard = ({ data, onClick }: MoatMapCardProps) => {
  const { textScale } = useAppConfig()
  const fSize = (base: number) => base * textScale
  const IconComponent = Shield

  const getColor = (score: number): string => {
    if (score >= 80) return ChartColorsRaw.semantic.success
    if (score >= 60) return ChartColorsRaw.semantic.warning
    return ChartColorsRaw.semantic.danger
  }

  return (
    <CardBase className="mb-3">
      <AIAnalystHeader title={data.title} icon={IconComponent} summary={data.summary} />
      <div className="flex flex-col gap-3">
        {data.advantages.map((adv, i) => {
          const color = getColor(adv.score)
          return (
            <div key={i} className="flex items-center gap-3">
              <div className="w-20 font-bold text-foreground text-right" style={{ fontSize: `${fSize(11)}px` }}>
                {adv.dimension}
              </div>
              <div className="flex-1 h-3 bg-muted/20 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${adv.score}%`, backgroundColor: color }}
                />
              </div>
              <div
                className="w-10 font-bold text-right"
                style={{ color, fontSize: `${fSize(11)}px`, fontWeight: 700 }}
              >
                {adv.score}
              </div>
            </div>
          )
        })}
      </div>
      <ActionButton text={data.actionText || "查看护城河详细分析"} onClick={onClick} />
    </CardBase>
  )
}

interface PeerComparisonCardProps {
  data: {
    title: string
    summary: string
    icon?: string
    peers: Array<{ name: string; dimension: string; comparison: string }>
    actionText?: string
  }
  onClick?: () => void
}

export const PeerComparisonCard = ({ data, onClick }: PeerComparisonCardProps) => {
  const { textScale } = useAppConfig()
  const fSize = (base: number) => base * textScale
  const IconComponent = GitCompare

  const comparisonColors: Record<string, string> = {
    优势: ChartColorsRaw.semantic.success,
    劣势: ChartColorsRaw.semantic.danger,
    持平: ChartColorsRaw.semantic.warning,
  }

  return (
    <CardBase className="mb-3">
      <AIAnalystHeader title={data.title} icon={IconComponent} summary={data.summary} />
      <div className="flex flex-col gap-2">
        {data.peers.map((peer, i) => (
          <div key={i} className="p-2.5 rounded-xl border border-border/30 bg-muted/20">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-foreground" style={{ fontSize: `${fSize(11)}px` }}>
                {peer.name}
              </span>
              <span
                className="px-2 py-0.5 rounded-full font-bold"
                style={{
                  fontSize: `${fSize(9)}px`,
                  backgroundColor: comparisonColors[peer.comparison] + "20",
                  color: comparisonColors[peer.comparison],
                }}
              >
                {peer.comparison}
              </span>
            </div>
            <div className="text-muted-foreground" style={{ fontSize: `${fSize(9)}px` }}>
              {peer.dimension}
            </div>
          </div>
        ))}
      </div>
      <ActionButton text={data.actionText || "查看竞品详细对比"} onClick={onClick} />
    </CardBase>
  )
}

interface EcosystemEmbeddingCardProps {
  data: {
    title: string
    summary: string
    icon?: string
    ecosystem: {
      upstream: string[]
      downstream: string[]
      horizontal: string[]
    }
    position: string
    actionText?: string
  }
  onClick?: () => void
}

export const EcosystemEmbeddingCard = ({ data, onClick }: EcosystemEmbeddingCardProps) => {
  const { textScale } = useAppConfig()
  const fSize = (base: number) => base * textScale
  const IconComponent = Network

  return (
    <CardBase className="mb-3">
      <AIAnalystHeader title={data.title} icon={IconComponent} summary={data.summary} />
      <div className="flex flex-col gap-2">
        <div className="p-2.5 rounded-xl border border-border/30 bg-muted/20">
          <div className="font-bold text-foreground mb-1" style={{ fontSize: `${fSize(11)}px` }}>
            上游
          </div>
          <div className="text-muted-foreground" style={{ fontSize: `${fSize(10)}px` }}>
            {data.ecosystem.upstream.join("、")}
          </div>
        </div>
        <div className="p-2.5 rounded-xl border border-border/30 bg-muted/20">
          <div className="font-bold text-foreground mb-1" style={{ fontSize: `${fSize(11)}px` }}>
            下游
          </div>
          <div className="text-muted-foreground" style={{ fontSize: `${fSize(10)}px` }}>
            {data.ecosystem.downstream.join("、")}
          </div>
        </div>
        <div className="p-2.5 rounded-xl border border-border/30 bg-muted/20">
          <div className="font-bold text-foreground mb-1" style={{ fontSize: `${fSize(11)}px` }}>
            横向
          </div>
          <div className="text-muted-foreground" style={{ fontSize: `${fSize(10)}px` }}>
            {data.ecosystem.horizontal.join("、")}
          </div>
        </div>
      </div>
      <ActionButton text={data.actionText || "查看生态网络详情"} onClick={onClick} />
    </CardBase>
  )
}

interface TalentCultureCardProps {
  data: {
    title: string
    summary: string
    icon?: string
    team: {
      background: string
      education: string
      culture: string
      turnover: string
    }
    actionText?: string
  }
  onClick?: () => void
}

export const TalentCultureCard = ({ data, onClick }: TalentCultureCardProps) => {
  const { textScale } = useAppConfig()
  const fSize = (base: number) => base * textScale
  const IconComponent = Users

  return (
    <CardBase className="mb-3">
      <AIAnalystHeader title={data.title} icon={IconComponent} summary={data.summary} />
      <div className="grid grid-cols-2 gap-2">
        <div className="p-2.5 rounded-xl border border-border/30 bg-muted/20">
          <div className="font-bold text-muted-foreground mb-1" style={{ fontSize: `${fSize(9)}px` }}>
            团队背景
          </div>
          <div className="font-bold text-foreground" style={{ fontSize: `${fSize(11)}px` }}>
            {data.team.background}
          </div>
        </div>
        <div className="p-2.5 rounded-xl border border-border/30 bg-muted/20">
          <div className="font-bold text-muted-foreground mb-1" style={{ fontSize: `${fSize(9)}px` }}>
            教育背景
          </div>
          <div className="font-bold text-foreground" style={{ fontSize: `${fSize(11)}px` }}>
            {data.team.education}
          </div>
        </div>
        <div className="p-2.5 rounded-xl border border-border/30 bg-muted/20">
          <div className="font-bold text-muted-foreground mb-1" style={{ fontSize: `${fSize(9)}px` }}>
            文化风格
          </div>
          <div className="font-bold text-foreground" style={{ fontSize: `${fSize(11)}px` }}>
            {data.team.culture}
          </div>
        </div>
        <div className="p-2.5 rounded-xl border border-border/30 bg-muted/20">
          <div className="font-bold text-muted-foreground mb-1" style={{ fontSize: `${fSize(9)}px` }}>
            流失率
          </div>
          <div className="font-bold text-foreground" style={{ fontSize: `${fSize(11)}px` }}>
            {data.team.turnover}
          </div>
        </div>
      </div>
      <ActionButton text={data.actionText || "查看人才详细分析"} onClick={onClick} />
    </CardBase>
  )
}

interface FinancialHealthCardProps {
  data: {
    title: string
    summary: string
    icon?: string
    healthScore: number
    financialData?: Array<{
      period: string
      cashFlow?: number
      yoyGrowth?: number
      revenue?: number
      grossMargin?: number
      netProfit?: number
    }>
    actionText?: string
  }
  onClick?: () => void
}

export const FinancialHealthCard = ({ data, onClick }: FinancialHealthCardProps) => {
  const { textScale } = useAppConfig()
  const fSize = (base: number) => base * textScale
  const IconComponent = TrendingUp

  return (
    <CardBase className="mb-3">
      <AIAnalystHeader title={data.title} icon={IconComponent} summary={data.summary} />
      
      {/* 核心财务图表 - 支持标签切换 */}
      {data.financialData && data.financialData.length > 0 && (
        <div>
          <FinancialMetricsChart
            data={data.financialData}
            height={ChartDefaults.height}
            metricTypes={[
              { id: "cashFlow", label: "经营现金流", showBar: true, showLine: true },
              { id: "revenue", label: "营收", showBar: true, showLine: true },
              { id: "grossMargin", label: "毛利率", showBar: false, showLine: true },
            ]}
          />
        </div>
      )}
      
      <ActionButton text={data.actionText || "查看财务详细分析"} onClick={onClick} />
    </CardBase>
  )
}

interface OwnershipCapitalCardProps {
  data: {
    title: string
    summary: string
    icon?: string
    ownership: {
      founders: number
      seriesA: number
      seriesB: number
      optionPool: number
    }
    valuation: string
    round: string
    actionText?: string
  }
  onClick?: () => void
}

export const OwnershipCapitalCard = ({ data, onClick }: OwnershipCapitalCardProps) => {
  const { textScale } = useAppConfig()
  const fSize = (base: number) => base * textScale
  const IconComponent = DollarSign

  const colors = [
    ChartColorsRaw.series.primary,
    ChartColorsRaw.series.secondary,
    ChartColorsRaw.series.tertiary,
    ChartColorsRaw.series.quaternary,
  ]

  const ownershipItems = [
    { label: "创始团队", value: data.ownership.founders },
    { label: "A轮", value: data.ownership.seriesA },
    { label: "B轮", value: data.ownership.seriesB },
    { label: "期权池", value: data.ownership.optionPool },
  ]

  return (
    <CardBase className="mb-3">
      <AIAnalystHeader title={data.title} icon={IconComponent} summary={data.summary} />
      <div className="flex flex-col gap-2 mb-3">
        {ownershipItems.map((item, i) => {
          const color = colors[i % colors.length]
          return (
            <div key={i} className="flex items-center gap-3">
              <div className="w-20 font-bold text-foreground text-right" style={{ fontSize: `${fSize(11)}px` }}>
                {item.label}
              </div>
              <div className="flex-1 h-3 bg-muted/20 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${item.value}%`, backgroundColor: color }}
                />
              </div>
              <div
                className="w-10 font-bold text-right"
                style={{ color, fontSize: `${fSize(11)}px`, fontWeight: 700 }}
              >
                {item.value}%
              </div>
            </div>
          )
        })}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="p-2.5 rounded-xl border border-border/30 bg-muted/20 text-center">
          <div className="font-bold text-muted-foreground mb-1" style={{ fontSize: `${fSize(9)}px` }}>
            估值
          </div>
          <div className="font-black text-foreground" style={{ fontSize: `${fSize(13)}px` }}>
            {data.valuation}
          </div>
        </div>
        <div className="p-2.5 rounded-xl border border-border/30 bg-muted/20 text-center">
          <div className="font-bold text-muted-foreground mb-1" style={{ fontSize: `${fSize(9)}px` }}>
            轮次
          </div>
          <div className="font-black text-foreground" style={{ fontSize: `${fSize(13)}px` }}>
            {data.round}
          </div>
        </div>
      </div>
      <ActionButton text={data.actionText || "查看股权详细分析"} onClick={onClick} />
    </CardBase>
  )
}

interface RiskRadarCardProps {
  data: {
    title: string
    summary: string
    icon?: string
    radarData: Array<{ subject: string; value: number }>
    actionText?: string
  }
  onClick?: () => void
}

export const RiskRadarCard = ({ data, onClick }: RiskRadarCardProps) => {
  const { textScale } = useAppConfig()
  const fSize = (base: number) => base * textScale
  const IconComponent = AlertTriangle

  return (
    <CardBase className="mb-3">
      <AIAnalystHeader title={data.title} icon={IconComponent} summary={data.summary} />
      <div style={{ width: "100%", height: `${ChartDefaults.height}px` }}>
        <SolidRadarChart
          data={data.radarData}
          height={ChartDefaults.height}
          fillColor={ChartColorsRaw.semantic.danger}
          strokeColor={ChartColorsRaw.semantic.danger}
        />
      </div>
      <ActionButton text={data.actionText || "查看风险详细分析"} onClick={onClick} />
    </CardBase>
  )
}

interface StrategicMovesCardProps {
  data: {
    title: string
    summary: string
    icon?: string
    timeline: Array<{ time: string; events: string[] }>
    actionText?: string
  }
  onClick?: () => void
}

export const StrategicMovesCard = ({ data, onClick }: StrategicMovesCardProps) => {
  const { textScale } = useAppConfig()
  const fSize = (base: number) => base * textScale
  const IconComponent = Clock

  return (
    <CardBase className="mb-3">
      <AIAnalystHeader title={data.title} icon={IconComponent} summary={data.summary} />
      <Timeline
        events={data.timeline?.map((t) => ({
          date: t.time,
          description: t.events?.join("、") || "",
        })) || []}
      />
      <ActionButton text={data.actionText || "查看战略详细分析"} onClick={onClick} />
    </CardBase>
  )
}

interface FutureGrowthCardProps {
  data: {
    title: string
    summary: string
    icon?: string
    growthEngines: Array<{ name: string; priority: string; timeline: string; target: string }>
    actionText?: string
  }
  onClick?: () => void
}

export const FutureGrowthCard = ({ data, onClick }: FutureGrowthCardProps) => {
  const { textScale } = useAppConfig()
  const fSize = (base: number) => base * textScale
  const IconComponent = Rocket

  const priorityColors: Record<string, string> = {
    主叙事: ChartColorsRaw.series.primary,
    次叙事: ChartColorsRaw.series.secondary,
    长期叙事: ChartColorsRaw.series.tertiary,
  }

  return (
    <CardBase className="mb-3">
      <AIAnalystHeader title={data.title} icon={IconComponent} summary={data.summary} />
      <div className="flex flex-col gap-2">
        {data.growthEngines.map((engine, i) => (
          <div key={i} className="p-2.5 rounded-xl border border-border/30 bg-muted/20">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-foreground" style={{ fontSize: `${fSize(11)}px` }}>
                {engine.name}
              </span>
              <span
                className="px-2 py-0.5 rounded-full font-bold"
                style={{
                  fontSize: `${fSize(9)}px`,
                  backgroundColor: priorityColors[engine.priority] + "20",
                  color: priorityColors[engine.priority],
                }}
              >
                {engine.priority}
              </span>
            </div>
            <div className="text-muted-foreground" style={{ fontSize: `${fSize(9)}px` }}>
              {engine.timeline} · {engine.target}
            </div>
          </div>
        ))}
      </div>
      <ActionButton text={data.actionText || "查看增长详细分析"} onClick={onClick} />
    </CardBase>
  )
}

interface AIExecutiveInsightCardProps {
  data: {
    title: string
    summary: string
    icon?: string
    insights: Array<{ title: string; content: string }>
    actionText?: string
  }
  onClick?: () => void
}

export const AIExecutiveInsightCard = ({ data, onClick }: AIExecutiveInsightCardProps) => {
  const { textScale } = useAppConfig()
  const fSize = (base: number) => base * textScale
  const IconComponent = Sparkles

  return (
    <div className="relative rounded-[24px] bg-foreground shadow-2xl p-5 mb-6 text-primary-foreground overflow-hidden">
      <div className="absolute top-0 right-0 w-56 h-56 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="relative z-10">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2 bg-primary/20 rounded-xl border border-primary/30">
            <IconComponent className="text-primary" size={18} />
          </div>
          <div>
            <h3 className="font-bold uppercase tracking-widest text-primary" style={{ fontSize: `${fSize(12)}px` }}>
              {data.title}
            </h3>
          </div>
        </div>

        <div
          className="font-medium leading-relaxed mb-5 border-l-2 border-primary pl-3.5"
          style={{ fontSize: `${fSize(13)}px` }}
        >
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
            }}
          >
            {data.summary}
          </ReactMarkdown>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {data.insights.map((insight, i) => (
            <div
              key={i}
              className="bg-primary-foreground/5 rounded-xl p-3 border border-primary-foreground/10 backdrop-blur-md"
            >
              <div className="font-bold uppercase mb-1 text-primary" style={{ fontSize: `${fSize(10)}px` }}>
                {insight.title}
              </div>
              <div className="text-primary-foreground/80" style={{ fontSize: `${fSize(11)}px` }}>
                {insight.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

