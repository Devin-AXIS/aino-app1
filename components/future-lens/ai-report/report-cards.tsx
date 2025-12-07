"use client"

import type React from "react"
import {
  ResponsiveContainer,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  AreaChart,
  Area,
} from "recharts"
import { RadarChart } from "@/components/future-lens/charts/radar-chart"
import { HorizontalBarChart } from "@/components/future-lens/charts/horizontal-bar-chart"
import { MultiLineChart } from "@/components/future-lens/charts/multi-line-chart"
import ReactMarkdown from "react-markdown"
import {
  TrendingUp,
  DollarSign,
  FileText,
  Gauge,
  Layers,
  GitBranch,
  Clock,
  Network,
  Users,
  Target,
  Zap,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  ArrowUpRight,
  Crosshair,
  Hand,
  Building2,
  PieChart,
  MapPin,
  Shield,
  GitCompare,
  Rocket,
  Calendar,
} from "lucide-react"
import { CardBase } from "@/components/future-lens/ds/card-base"
import { Timeline } from "@/components/future-lens/ds/timeline"
import { PlayerList } from "@/components/future-lens/ds/player-list"
import { useAppConfig } from "@/lib/future-lens/config-context"
import { DesignTokens } from "@/lib/future-lens/design-tokens"
import { ChartDefaults } from "@/components/future-lens/charts/chart-config"
import { ChartColorsRaw } from "@/components/future-lens/charts/chart-colors"
import { StatusGridChart } from "@/components/future-lens/charts/status-grid-chart"
import { ProgressBarsChart } from "@/components/future-lens/charts/progress-bars-chart"
import { SolidRadarChart } from "@/components/future-lens/charts/solid-radar-chart"

/**
 * 图标名称到图标组件的映射
 */
const iconMap: Record<string, React.ElementType> = {
  TrendingUp,
  DollarSign,
  FileText,
  Gauge,
  Layers,
  GitBranch,
  Clock,
  Network,
  Users,
  Target,
  Zap,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  Crosshair,
  Hand,
  Building2,
  PieChart,
  MapPin,
  Shield,
  GitCompare,
  Rocket,
  Calendar,
}

/**
 * 根据图标名称获取图标组件
 * @param iconName 图标名称（字符串）
 * @param defaultIcon 默认图标组件
 * @returns 图标组件
 */
function getIconComponent(iconName?: string, defaultIcon: React.ElementType = Layers): React.ElementType {
  if (!iconName) {
    return defaultIcon
  }
  // 支持大小写不敏感匹配
  const normalizedName = iconName.trim()
  const icon = iconMap[normalizedName] || iconMap[normalizedName.charAt(0).toUpperCase() + normalizedName.slice(1)]
  return icon || defaultIcon
}

const getChartColors = () => ({
  primary: "hsl(var(--chart-primary))",
  secondary: "hsl(var(--chart-secondary))",
  accent: "hsl(var(--info))",
  danger: "hsl(var(--destructive))",
  warning: "hsl(var(--warning))",
  success: "hsl(var(--success))",
  muted: "hsl(var(--muted-foreground))",
})

const AIAnalystHeader = ({
  title,
  summary,
  icon: Icon = Sparkles,
}: {
  title: string
  summary: string
  icon?: React.ElementType
}) => {
  const { textScale } = useAppConfig()
  const fSize = (base: number) => base * textScale

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2.5">
        <Icon size={16} className="text-primary flex-shrink-0" />
        <h3 className={DesignTokens.typography.title} style={{ fontSize: `${fSize(13)}px` }}>
          {title}
        </h3>
        <Zap size={12} className="text-primary fill-primary ml-auto flex-shrink-0" />
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

// 格式化更新时间：
// - 如果是本年，只显示"月日"（如"9月15日"）
// - 如果超过本年，显示"年月日"（如"2024年9月15日"）
function formatUpdateTime(date: Date | string | undefined): string {
  if (!date) {
    return ""
  }
  
  const now = new Date()
  const updateDate = new Date(date)
  
  // 检查日期是否有效
  if (isNaN(updateDate.getTime())) {
    return ""
  }
  
  const currentYear = now.getFullYear()
  const updateYear = updateDate.getFullYear()
  const updateMonth = updateDate.getMonth() + 1
  const updateDay = updateDate.getDate()
  
  // 如果是本年，只显示"月日"
  if (updateYear === currentYear) {
    return `${updateMonth}月${updateDay}日`
  }
  
  // 如果超过本年，显示"年月日"
  return `${updateYear}年${updateMonth}月${updateDay}日`
}

const ActionButton = ({ text, onClick, updatedAt }: { text: string; onClick?: () => void; updatedAt?: Date | string }) => {
  const { textScale } = useAppConfig()
  const fSize = (base: number) => base * textScale
  
  // 如果没有提供更新时间，使用模拟数据（3个月前）
  const defaultUpdateTime = updatedAt || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
  const updateTimeText = formatUpdateTime(defaultUpdateTime)
  
  // 如果没有时间文本，不显示更新时间
  if (!updateTimeText) {
    return (
      <div
        className="mt-4 pt-3 border-t border-border/50 flex justify-end items-center group cursor-pointer"
        onClick={onClick}
      >
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/30 text-foreground font-bold group-hover:bg-primary/10 group-hover:text-primary transition-colors"
          style={{ fontSize: `${fSize(11)}px` }}
        >
          {text} <ArrowUpRight size={11} />
        </div>
      </div>
    )
  }

  return (
    <div
      className="mt-4 pt-3 border-t border-border/50 flex justify-between items-center group cursor-pointer"
      onClick={onClick}
    >
      <span
        className="text-muted-foreground/60"
        style={{ fontSize: `${fSize(8)}px` }}
      >
        更新于 {updateTimeText}
      </span>
      <div
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/30 text-foreground font-bold group-hover:bg-primary/10 group-hover:text-primary transition-colors"
        style={{ fontSize: `${fSize(11)}px` }}
      >
        {text} <ArrowUpRight size={11} />
      </div>
    </div>
  )
}

interface IndustryStackCardProps {
  data: {
    title: string
    summary: string
    icon?: string
    levels: Array<{ name: string; description: string; color: string  }>
    actionText?: string
    updatedAt?: string | Date
    createdAt?: string | Date
  }
  onClick?: () => void
}

export const IndustryStackCard = ({ data, onClick }: IndustryStackCardProps) => {
  const { textScale } = useAppConfig()
  const fSize = (base: number) => base * textScale

  // 根据 data.icon 动态选择图标，如果没有则使用默认图标
  const IconComponent = getIconComponent(data.icon, Layers)

  return (
    <CardBase className="mb-3">
      <AIAnalystHeader
        title={data.title}
        icon={IconComponent}
        summary={data.summary}
      />
      <div className="flex flex-col gap-2">
        {data.levels.map((l, i) => (
          <div key={i} className={`p-2.5 rounded-xl border border-border/30 flex justify-between items-center ${l.color}`}>
            <span className="font-bold" style={{ fontSize: `${fSize(11)}px` }}>
              {l.name}
            </span>
            <span className="font-medium opacity-70" style={{ fontSize: `${fSize(9)}px` }}>
              {l.description}
            </span>
          </div>
        ))}
      </div>
      <ActionButton text={data.actionText || "查看各层级详细报告"} onClick={onClick} updatedAt={data.updatedAt || data.createdAt} />
    </CardBase>
  )
}

interface TrendRadarCardProps {
  data: {
    title: string
    summary: string
    icon?: string
    chartData: Array<{ subject: string; value: number  }>
    actionText?: string
  }
  onClick?: () => void
}

export const TrendRadarCard = ({ data, onClick }: TrendRadarCardProps) => {
  const { textScale } = useAppConfig()
  const fSize = (base: number) => base * textScale

  // 根据 data.icon 动态选择图标，如果没有则使用默认图标
  const IconComponent = getIconComponent(data.icon, TrendingUp)

  return (
    <CardBase className="mb-3">
      <AIAnalystHeader
        title={data.title}
        icon={IconComponent}
        summary={data.summary}
      />
      <div style={{ width: "100%", height: `${ChartDefaults.height}px` }}>
        <RadarChart data={data.chartData} height={ChartDefaults.height} />
      </div>
      <ActionButton text={data.actionText || "查看趋势演进预测"} onClick={onClick} updatedAt={(data as any).updatedAt || (data as any).createdAt} />
    </CardBase>
  )
}

interface StructuralShiftCardProps {
  data: {
    title: string
    summary: string
    icon?: string
    actionText?: string
    onClick?: () => void
}
  onClick?: () => void
}

export const StructuralShiftCard = ({ data, onClick }: StructuralShiftCardProps) => {
  const { textScale } = useAppConfig()
  const fSize = (base: number) => base * textScale

  // 根据 data.icon 动态选择图标，如果没有则使用默认图标
  const IconComponent = getIconComponent(data.icon, GitBranch)

  return (
    <CardBase className="mb-3">
      <AIAnalystHeader
        title={data.title}
        icon={IconComponent}
        summary={data.summary}
      />
      <div className="flex items-center justify-between bg-muted/30 p-3 rounded-2xl border border-dashed border-border mt-2">
        <div className="text-center opacity-50 scale-90">
          <div className="w-9 h-9 mx-auto bg-muted/50 rounded-full flex items-center justify-center mb-1.5">
            <Sparkles size={16} />
          </div>
          <div className="font-bold text-muted-foreground" style={{ fontSize: `${fSize(9)}px` }}>
            集成商主导
          </div>
        </div>
        <div className="flex-1 h-[2px] bg-gradient-to-r from-border to-primary mx-2 relative">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 font-bold text-muted-foreground/50"
            style={{ fontSize: `${fSize(8)}px` }}
          >
            VALUE SHIFT
          </div>
          <ArrowUpRight className="absolute right-0 top-1/2 -translate-y-1/2 text-primary" size={13} />
        </div>
        <div className="text-center scale-110">
          <div className="w-11 h-11 mx-auto bg-primary/15 rounded-full flex items-center justify-center text-primary mb-1.5 shadow-lg">
            <Zap size={18} />
          </div>
          <div className="font-bold text-primary" style={{ fontSize: `${fSize(9)}px` }}>
            模型定义
          </div>
        </div>
      </div>
      <ActionButton text={data.actionText || "查看价值链重构分析"} onClick={onClick} updatedAt={(data as any).updatedAt || (data as any).createdAt} />
    </CardBase>
  )
}

interface TechTimelineCardProps {
  data: {
    title: string
    summary: string
    icon?: string
    events: Array<{ date: string; category: string; description: string; highlighted: boolean }>
    actionText?: string
  }
  onClick?: () => void
}

export const TechTimelineCard = ({ data, onClick }: TechTimelineCardProps) => {
  // 根据 data.icon 动态选择图标，如果没有则使用默认图标
  const IconComponent = getIconComponent(data.icon, Clock)

  return (
    <CardBase className="mb-3">
      <AIAnalystHeader
        title={data.title}
        icon={IconComponent}
        summary={data.summary}
      />
      <Timeline events={data.events} />
      <ActionButton text={data.actionText || "查看完整技术路线图"} onClick={onClick} updatedAt={(data as any).updatedAt || (data as any).createdAt} />
    </CardBase>
  )
}

interface IndustryPaceCardProps {
  data: {
    title: string
    summary: string
    icon?: string
    metrics: Array<{ name: string; value: number; color: string }>
    actionText?: string
  }
  onClick?: () => void
}

export const IndustryPaceCard = ({ data, onClick }: IndustryPaceCardProps) => {
  const { textScale } = useAppConfig()
  const fSize = (base: number) => base * textScale

  // 根据 data.icon 动态选择图标，如果没有则使用默认图标
  const IconComponent = getIconComponent(data.icon, Gauge)

  return (
    <CardBase className="mb-3">
      <AIAnalystHeader
        title={data.title}
        icon={IconComponent}
        summary={data.summary}
      />
      <ProgressBarsChart 
        data={data.metrics.map(m => ({ name: m.name, value: m.value }))}
        textScale={textScale}
      />
      <ActionButton text={data.actionText || "查看行业周期定位"} onClick={onClick} updatedAt={(data as any).updatedAt || (data as any).createdAt} />
    </CardBase>
  )
}

interface CapitalFlowCardProps {
  data: {
    title: string
    summary: string
    icon?: string
    chartData: Array<{ label: string; value: number }>
    actionText?: string
  }
  onClick?: () => void
}

export const CapitalFlowCard = ({ data, onClick }: CapitalFlowCardProps) => {
  // 根据 data.icon 动态选择图标，如果没有则使用默认图标
  const IconComponent = getIconComponent(data.icon, Sparkles)

  return (
    <CardBase className="mb-3">
      <AIAnalystHeader
        title={data.title}
        icon={IconComponent}
        summary={data.summary}
      />
      <div className="mt-4">
        <HorizontalBarChart data={data.chartData} barHeight={14} gap={12} showValue={false} />
      </div>
      <ActionButton text={data.actionText || "查看融资事件列表"} onClick={onClick} updatedAt={(data as any).updatedAt || (data as any).createdAt} />
    </CardBase>
  )
}

interface PlayerImpactCardProps {
  data: {
    title: string
    summary: string
    icon?: string
    players: Array<{ name: string; value: number; type: string; color: string }>
    actionText?: string
  }
  onClick?: () => void
}

export const PlayerImpactCard = ({ data, onClick }: PlayerImpactCardProps) => {
  // 图标映射
  const IconComponent = getIconComponent(data.icon, Target)

  return (
    <CardBase className="mb-3">
      <AIAnalystHeader
        title={data.title}
        icon={IconComponent}
        summary={data.summary}
      />
      <div className="mt-2">
        <PlayerList players={data.players} />
      </div>
      <ActionButton text={data.actionText || "查看企业竞争力对比"} onClick={onClick} updatedAt={(data as any).updatedAt || (data as any).createdAt} />
    </CardBase>
  )
}

interface NarrativeCapitalCardProps {
  data: {
    title: string
    summary: string
    icon?: string
    chartData: Array<{ label: string; value1: number; value2: number }>
    chartConfig?: {
      line1: { name: string; color: string }
      line2: { name: string; color: string }
    }
    actionText?: string
  }
  onClick?: () => void
}

export const NarrativeCapitalCard = ({ data, onClick }: NarrativeCapitalCardProps) => {
  // 图标映射
  const IconComponent = getIconComponent(data.icon, FileText)

  return (
    <CardBase className="mb-3">
      <AIAnalystHeader
        title={data.title}
        icon={IconComponent}
        summary={data.summary}
      />
      <div className="mt-4">
        <MultiLineChart
          data={data.chartData}
          height={150}
          line1={{
            name: data.chartConfig?.line1.name || "社交媒体热度",
            color: data.chartConfig?.line1.color || ChartColorsRaw.series.secondary,
          }}
          line2={{
            name: data.chartConfig?.line2.name || "资本流入",
            color: data.chartConfig?.line2.color || ChartColorsRaw.series.primary,
          }}
          showGrid={true}
          showYAxis={false}
        />
      </div>
      <ActionButton text={data.actionText || "查看舆情分析报告"} onClick={onClick} updatedAt={(data as any).updatedAt || (data as any).createdAt} />
    </CardBase>
  )
}

interface SupplyChainHealthCardProps {
  data: {
    title: string
    summary: string
    icon?: string
    items: Array<{ name: string; status: "critical" | "warning" | "success"; text: string }>
    actionText?: string
  }
  onClick?: () => void
}

export const SupplyChainHealthCard = ({ data, onClick }: SupplyChainHealthCardProps) => {
  // 图标映射
  const IconComponent = getIconComponent(data.icon, Network)

  return (
    <CardBase className="mb-3">
      <AIAnalystHeader
        title={data.title}
        icon={IconComponent}
        summary={data.summary}
      />
      <div className="mt-2">
        <StatusGridChart data={data.items} />
      </div>
      <ActionButton text={data.actionText || "查看供应链深度地图"} onClick={onClick} updatedAt={(data as any).updatedAt || (data as any).createdAt} />
    </CardBase>
  )
}

interface EcosystemMapCardProps {
  data: {
    title: string
    summary: string
    icon?: string
    actionText?: string
  }
  onClick?: () => void
}

export const EcosystemMapCard = ({ data, onClick }: EcosystemMapCardProps) => {
  const { textScale } = useAppConfig()
  const fSize = (base: number) => base * textScale

  // 根据 data.icon 动态选择图标，如果没有则使用默认图标
  const IconComponent = getIconComponent(data.icon, GitBranch)

  return (
    <CardBase className="mb-3">
      <AIAnalystHeader
        title={data.title}
        icon={IconComponent}
        summary={data.summary}
      />
      <div className="relative h-[180px] w-full bg-muted/20 rounded-2xl border border-dashed border-border mt-2 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-card rounded-full shadow-lg flex flex-col items-center justify-center z-10 border-4 border-primary/20">
          <span className="font-bold text-primary" style={{ fontSize: `${fSize(9)}px` }}>
            Model OS
          </span>
        </div>
        <div
          className="absolute top-6 left-10 bg-card px-2 py-1 rounded shadow border border-border font-bold text-muted-foreground"
          style={{ fontSize: `${fSize(8)}px` }}
        >
          HW
        </div>
        <div
          className="absolute bottom-6 right-10 bg-card px-2 py-1 rounded shadow border border-border font-bold text-muted-foreground"
          style={{ fontSize: `${fSize(8)}px` }}
        >
          Apps
        </div>
        <div
          className="absolute top-6 right-10 bg-card px-2 py-1 rounded shadow border border-border font-bold text-muted-foreground"
          style={{ fontSize: `${fSize(8)}px` }}
        >
          Data
        </div>
        <div
          className="absolute bottom-6 left-10 bg-card px-2 py-1 rounded shadow border border-border font-bold text-muted-foreground"
          style={{ fontSize: `${fSize(8)}px` }}
        >
          Sim
        </div>

        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
          <line x1="50%" y1="50%" x2="20%" y2="20%" stroke="hsl(var(--primary))" strokeWidth="2" />
          <line x1="50%" y1="50%" x2="80%" y2="80%" stroke="hsl(var(--primary))" strokeWidth="2" />
          <line x1="50%" y1="50%" x2="80%" y2="20%" stroke="hsl(var(--primary))" strokeWidth="2" />
          <line x1="50%" y1="50%" x2="20%" y2="80%" stroke="hsl(var(--primary))" strokeWidth="2" />
        </svg>
      </div>
      <ActionButton text={data.actionText || "查看全景生态图谱"} onClick={onClick} updatedAt={(data as any).updatedAt || (data as any).createdAt} />
    </CardBase>
  )
}

interface StrategyWindowCardProps {
  data: {
    title: string
    summary: string
    icon?: string
    timeline: Array<{ label: string; text: string; color: string }>
    actionText?: string
  }
  onClick?: () => void
}

export const StrategyWindowCard = ({ data, onClick }: StrategyWindowCardProps) => {
  const { textScale } = useAppConfig()
  const fSize = (base: number) => base * textScale

  // 图标映射
  const IconComponent = getIconComponent(data.icon, Crosshair)

  return (
    <CardBase className="mb-3">
      <AIAnalystHeader
        title={data.title}
        icon={IconComponent}
        summary={data.summary}
      />
      <div className="flex justify-between items-center mt-4 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -z-10" />
        {data.timeline.map((p, i) => (
          <div key={i} className="flex flex-col items-center bg-card p-2 rounded-xl shadow-sm border border-border">
            <div className={`w-3 h-3 rounded-full mb-2 ${p.color}`} />
            <div className="font-bold text-foreground" style={{ fontSize: `${fSize(11)}px` }}>
              {p.label}
            </div>
            <div className="text-muted-foreground font-medium" style={{ fontSize: `${fSize(8)}px` }}>
              {p.text}
            </div>
          </div>
        ))}
      </div>
      <ActionButton text={data.actionText || "查看时间窗口推演"} onClick={onClick} updatedAt={(data as any).updatedAt || (data as any).createdAt} />
    </CardBase>
  )
}

interface InfluencerCardProps {
  data: {
    title: string
    summary: string
    icon?: string
    people: Array<{ name: string; title: string; role: string }>
    actionText?: string
  }
  onClick?: () => void
}

export const InfluencerCard = ({ data, onClick }: InfluencerCardProps) => {
  const { textScale } = useAppConfig()
  const fSize = (base: number) => base * textScale

  // 图标映射
  const IconComponent = getIconComponent(data.icon, Users)

  return (
    <CardBase className="mb-3">
      <AIAnalystHeader
        title={data.title}
        icon={IconComponent}
        summary={data.summary}
      />
      <div className="grid grid-cols-3 gap-3 mt-2">
        {data.people.map((p, i) => (
          <div
            key={i}
            className="flex flex-col items-center text-center bg-muted/30 rounded-xl p-3 border border-border"
          >
            <div
              className={`w-10 h-10 rounded-full mb-2 flex items-center justify-center text-white font-bold shadow-md ${i === 0 ? "bg-foreground" : i === 1 ? "bg-success" : "bg-primary"}`}
              style={{ fontSize: `${fSize(11)}px` }}
            >
              {p.name[0]}
            </div>
            <div className="font-bold text-foreground" style={{ fontSize: `${fSize(9)}px` }}>
              {p.name}
            </div>
            <div className="text-muted-foreground scale-90" style={{ fontSize: `${fSize(8)}px` }}>
              {p.title}
            </div>
          </div>
        ))}
      </div>
      <ActionButton text={data.actionText || "查看人物观点库"} onClick={onClick} updatedAt={(data as any).updatedAt || (data as any).createdAt} />
    </CardBase>
  )
}

interface ScenarioCardProps {
  data: {
    title: string
    summary: string
    icon?: string
    scenarios: Array<{ name: string; probability: number; color: string }>
    actionText?: string
  }
  onClick?: () => void
}

export const ScenarioCard = ({ data, onClick }: ScenarioCardProps) => {
  const { textScale } = useAppConfig()
  const fSize = (base: number) => base * textScale

  // 根据 data.icon 动态选择图标，如果没有则使用默认图标
  const IconComponent = getIconComponent(data.icon, GitBranch)

  const getScenarioStyle = (color: string) => {
    if (color === "primary") {
      return "bg-primary/10 rounded-lg border border-primary/30"
    }
    return "bg-card rounded-lg border border-border"
  }

  const getBarColor = (color: string) => {
    if (color === "primary") return "bg-primary"
    if (color === "success") return "bg-success"
    return "bg-muted-foreground"
  }

  return (
    <CardBase className="mb-3">
      <AIAnalystHeader
        title={data.title}
        icon={IconComponent}
        summary={data.summary}
      />
      <div className="flex flex-col gap-2 mt-2">
        {data.scenarios.map((s, i) => (
          <div key={i} className={`flex items-center gap-3 p-2 ${getScenarioStyle(s.color)}`}>
            <div className="font-bold text-muted-foreground w-16" style={{ fontSize: `${fSize(11)}px` }}>
              {s.name}
            </div>
            <div className={`flex-1 h-2 ${s.color === "primary" ? "bg-primary/20" : "bg-muted/30"} rounded-full overflow-hidden`}>
              <div className={`h-full ${getBarColor(s.color)}`} style={{ width: `${s.probability}%` }} />
            </div>
            <div className={`font-bold ${s.color === "primary" ? "text-primary" : "text-muted-foreground"}`} style={{ fontSize: `${fSize(11)}px` }}>
              {s.probability}%
            </div>
          </div>
        ))}
      </div>
      <ActionButton text={data.actionText || "查看详细推演参数"} onClick={onClick} updatedAt={(data as any).updatedAt || (data as any).createdAt} />
    </CardBase>
  )
}

interface ShockSimulationCardProps {
  data: {
    title: string
    summary: string
    icon?: string
    risks: Array<{ name: string; value: number; color: string }>
    actionText?: string
  }
  onClick?: () => void
}

export const ShockSimulationCard = ({ data, onClick }: ShockSimulationCardProps) => {
  const { textScale } = useAppConfig()
  const fSize = (base: number) => base * textScale

  // 图标映射
  const IconComponent = getIconComponent(data.icon, Network)

  // 使用统一颜色系统：根据风险值使用不同颜色
  // 风险值 0-40: 信息色（亮蓝色）- 低风险
  // 风险值 40-70: 警告色（金黄色 #FBB45C）- 中风险
  // 风险值 70-100: 危险色（粉红色）- 高风险
  const getRiskColor = (value: number): string => {
    if (value <= 40) {
      // 低风险：使用信息色（亮蓝色）
      return ChartColorsRaw.semantic.info  // #038DB2
    } else if (value <= 70) {
      // 中风险：使用警告色（金黄色 #FBB45C）
      return ChartColorsRaw.semantic.warning  // #FBB45C
    } else {
      // 高风险：使用危险色（粉红色）
      return ChartColorsRaw.semantic.danger  // #F9637C
    }
  }

  // 计算阴影强度（风险值越高，阴影越明显，但更柔和）
  const getShadowStyle = (value: number): React.CSSProperties => {
    const intensity = value / 100 // 0-1
    const opacity = Math.round(intensity * 25) // 0-25，更淡的阴影
    return {
      boxShadow: `0 2px 6px ${getRiskColor(value)}${opacity.toString(16).padStart(2, '0')}`,
    }
  }

  return (
    <CardBase className="mb-3">
      <AIAnalystHeader
        title={data.title}
        icon={IconComponent}
        summary={data.summary}
      />
      <div className="flex flex-col gap-3 mt-2">
        {data.risks.map((r, i) => {
          const riskColor = getRiskColor(r.value)
          const shadowStyle = getShadowStyle(r.value)
          
          return (
            <div key={i} className="flex items-center gap-3">
              <div className="w-20 font-bold text-foreground" style={{ fontSize: `${fSize(11)}px` }}>
                {r.name}
              </div>
              <div className="flex-1 h-3 bg-muted/20 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ 
                    width: `${r.value}%`, 
                    backgroundColor: riskColor,
                    ...shadowStyle
                  }}
                />
              </div>
              <div 
                className="w-10 font-bold text-right" 
                style={{ 
                  color: riskColor, 
                  fontSize: `${fSize(11)}px`,
                  fontWeight: 700
                }}
              >
                {r.value}%
              </div>
            </div>
          )
        })}
      </div>
      <ActionButton text={data.actionText || "查看压力测试报告"} onClick={onClick} updatedAt={(data as any).updatedAt || (data as any).createdAt} />
    </CardBase>
  )
}

interface FactorWeightingCardProps {
  data: {
    title: string
    summary: string
    icon?: string
    factors: Array<{ name: string; value: number; color: string }>
    actionText?: string
  }
  onClick?: () => void
}

export const FactorWeightingCard = ({ data, onClick }: FactorWeightingCardProps) => {
  const { textScale } = useAppConfig()
  const fSize = (base: number) => base * textScale

  // 图标映射
  const IconComponent = getIconComponent(data.icon, DollarSign)

  // 使用图表颜色系统为每个因素分配颜色
  // 根据权重值使用不同深浅的颜色（权重越高，颜色越深）
  const getFactorColor = (value: number, index: number): string => {
    // 使用图表系列颜色，根据索引循环使用
    const colors = [
      ChartColorsRaw.series.primary,      // 橙色 - 推理成本
      ChartColorsRaw.series.secondary,     // 蓝色 - 多模态
      ChartColorsRaw.series.tertiary,      // 紫色 - 供应链
      ChartColorsRaw.series.quaternary,    // 绿色 - 场景
      ChartColorsRaw.series.quinary,       // 琥珀色 - 泛化
    ]
    
    const baseColor = colors[index % colors.length]
    
    // 根据权重值调整颜色深浅（权重越高，颜色越深）
    // 使用 HSL 调整：权重高的降低亮度，增加饱和度
    // 权重 0-15: 很浅的颜色 (降低饱和度，提高亮度)
    // 权重 15-25: 浅颜色 (正常饱和度，较高亮度)
    // 权重 25+: 深颜色 (较高饱和度，较低亮度)
    
    // 将十六进制颜色转换为 HSL 进行调整
    // 简化处理：直接使用颜色，通过透明度或混合来调整深浅
    // 使用 CSS 的 opacity 或 filter 来调整
    
    if (value <= 15) {
      // 很浅的颜色，使用较低的不透明度
      return baseColor + "aa" // 约 67% 不透明度
    } else if (value <= 25) {
      // 浅颜色，使用中等不透明度
      return baseColor + "dd" // 约 87% 不透明度
    } else {
      // 深颜色，完全不透明
      return baseColor
    }
  }

  // 计算阴影强度（权重越高，阴影越明显）
  const getShadowStyle = (value: number, color: string): React.CSSProperties => {
    const intensity = value / 30 // 以30%为基准
    const opacity = Math.min(Math.round(intensity * 20), 20) // 0-20，柔和的阴影
    return {
      boxShadow: `0 2px 6px ${color}${opacity.toString(16).padStart(2, '0')}`,
    }
  }

  return (
    <CardBase className="mb-3">
      <AIAnalystHeader
        title={data.title}
        icon={IconComponent}
        summary={data.summary}
      />
      <div className="flex flex-col gap-3 pl-4">
        {data.factors.map((i, idx) => {
          const factorColor = getFactorColor(i.value, idx)
          const shadowStyle = getShadowStyle(i.value, factorColor)
          
          return (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-20 font-bold text-foreground text-right" style={{ fontSize: `${fSize(11)}px` }}>
                {i.name}
              </div>
              <div className="flex-1 h-3 bg-muted/20 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ 
                    width: `${i.value}%`, 
                    backgroundColor: factorColor,
                    ...shadowStyle
                  }}
                />
              </div>
              <div 
                className="w-10 font-bold text-right" 
                style={{ 
                  color: factorColor, 
                  fontSize: `${fSize(11)}px`,
                  fontWeight: 700
                }}
              >
                {i.value}%
              </div>
            </div>
          )
        })}
      </div>
      <ActionButton text={data.actionText || "查看完整因子模型"} onClick={onClick} updatedAt={(data as any).updatedAt || (data as any).createdAt} />
    </CardBase>
  )
}

interface InsightCompressionCardProps {
  data: {
    title: string
    summary: string
    icon?: string
    generatedAt?: string
    strategies: Array<{ type: string; label: string; text: string }>
  }
  onClick?: () => void
}

interface CapitalEcosystemCardProps {
  data: {
    title: string
    summary: string
    radarData: Array<{
      subject: string
      value: number
    }>
    actionText?: string
  }
  onClick?: () => void
}

export const CapitalEcosystemCard = ({ data, onClick }: CapitalEcosystemCardProps) => {
  const { textScale } = useAppConfig()
  const fSize = (base: number) => base * textScale

  // 图标映射
  const IconComponent = getIconComponent(data.icon, DollarSign)

  return (
    <CardBase className="mb-3">
      <AIAnalystHeader
        title={data.title}
        icon={IconComponent}
        summary={data.summary}
      />
      <div className="mt-2">
        <SolidRadarChart 
          data={data.radarData} 
          height={ChartDefaults.height}
          fillColor={ChartColorsRaw.context.capital}
          strokeColor={ChartColorsRaw.context.capital}
        />
      </div>
      <ActionButton text={data.actionText || "查看完整资金生态分析"} onClick={onClick} updatedAt={(data as any).updatedAt || (data as any).createdAt} />
    </CardBase>
  )
}

export const InsightCompressionCard = ({ data, onClick }: InsightCompressionCardProps) => {
  const { textScale } = useAppConfig()
  const fSize = (base: number) => base * textScale

  // 图标映射
  const IconComponent = getIconComponent(data.icon, Lightbulb)

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
            {data.generatedAt && (
              <div className="text-muted-foreground" style={{ fontSize: `${fSize(9)}px` }}>
                Generated at {data.generatedAt}
              </div>
            )}
          </div>
        </div>

        <p
          className="font-medium leading-relaxed mb-5 border-l-2 border-primary pl-3.5"
          style={{ fontSize: `${fSize(15)}px` }}
        >
          {data.summary}
        </p>

        <div className="grid grid-cols-2 gap-2.5">
          {data.strategies.map((s, i) => (
            <div key={i} className="bg-primary-foreground/5 rounded-xl p-3 border border-primary-foreground/10 backdrop-blur-md">
              <div
                className={`flex items-center gap-2 mb-1 ${s.type === "win" ? "text-success" : "text-destructive"} font-bold uppercase`}
                style={{ fontSize: `${fSize(10)}px` }}
              >
                {s.type === "win" ? <Hand size={11} /> : <AlertTriangle size={11} />} {s.label}
              </div>
              <div className="text-primary-foreground/80" style={{ fontSize: `${fSize(10)}px` }}>
                {s.text}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ========== 企业分析报告卡片组件 ==========

interface CompanySnapshotCardProps {
  data: {
    title: string
    summary: string
    icon?: string
    companyName: string
    tags: string[]
    metrics: Array<{ label: string; value: string; icon?: string }>
    actionText?: string
  }
  onClick?: () => void
}

export const CompanySnapshotCard = ({ data, onClick }: CompanySnapshotCardProps) => {
  const { textScale } = useAppConfig()
  const fSize = (base: number) => base * textScale
  const IconComponent = getIconComponent(data.icon, Building2)

  const iconMap: Record<string, React.ElementType> = {
    DollarSign,
    Users,
    TrendingUp,
    Calendar,
  }

  // 提取核心洞察文本
  const insightText = data.summary.split("\n\n").slice(1).join("\n\n").replace(/^·\s+/gm, "").trim()

  return (
    <CardBase className="relative z-10 w-full mb-3 overflow-hidden group">
      {/* 内部光泽层 */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-transparent pointer-events-none" />
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"
        style={{ backgroundColor: "rgba(99, 102, 241, 0.1)" }}
      />

      {/* 1. Header & Company Info */}
      <div className="relative flex justify-between items-start mb-3">
        {/* Left: Company Name & Tags */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span
              className={`${DesignTokens.text.secondary} font-bold uppercase tracking-widest`}
              style={{ fontSize: `${fSize(9)}px` }}
            >
              Company Profile
            </span>
          </div>
          <h2
            className={`${DesignTokens.typography.title} drop-shadow-sm mb-2`}
            style={{ fontSize: `${fSize(16)}px`, lineHeight: "1.2" }}
          >
            {data.companyName}
          </h2>
          <div className="flex items-center gap-1.5 flex-wrap">
            {data.tags.map((tag, i) => (
              <span
                key={i}
                className="inline-block px-2 py-0.5 rounded-md bg-primary/10 text-primary font-semibold"
                style={{ fontSize: `${fSize(9)}px` }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Right: Icon */}
        <div className="p-2 bg-card rounded-full shadow-sm border border-border">
          <IconComponent size={18} className="text-primary" />
        </div>
      </div>

      {/* 2. AI Core Insight */}
      <div className="relative mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={16} className="text-primary flex-shrink-0" />
          <h3 className={DesignTokens.typography.title} style={{ fontSize: `${fSize(13)}px` }}>
            核心洞察
          </h3>
        </div>
        <div className="bg-muted/30 p-4 rounded-2xl border border-border/50">
          <p
            className="text-muted-foreground leading-relaxed line-clamp-4"
            style={{ fontSize: `${fSize(12)}px` }}
          >
            <span className="font-semibold text-foreground">企业定位：</span>
            {insightText}
          </p>
        </div>
      </div>

      {/* 3. Key Metrics */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {data.metrics.map((m, i) => {
          const MetricIcon = m.icon ? iconMap[m.icon] || DollarSign : DollarSign
          return (
            <div
              key={i}
              className="flex flex-col items-center justify-center p-2.5 bg-card rounded-xl border border-border/30 shadow-sm"
            >
              <MetricIcon size={14} className="text-primary mb-1" />
              <span
                className="font-bold text-muted-foreground mb-0.5 text-center leading-tight"
                style={{ fontSize: `${fSize(8)}px` }}
              >
                {m.label}
              </span>
              <span
                className="font-black text-foreground text-center leading-tight"
                style={{ fontSize: `${fSize(13)}px` }}
              >
                {m.value}
              </span>
            </div>
          )
        })}
      </div>

    </CardBase>
  )
}

// 导入企业分析报告卡片组件
export {
  CompanyProfileCard,
  BusinessMixCard,
  ProductTechMapCard,
  CustomerUseCaseCard,
  OrgFootprintCard,
  IndustryPositioningCard,
  MoatMapCard,
  PeerComparisonCard,
  EcosystemEmbeddingCard,
  TalentCultureCard,
  FinancialHealthCard,
  OwnershipCapitalCard,
  RiskRadarCard,
  StrategicMovesCard,
  FutureGrowthCard,
  AIExecutiveInsightCard,
} from "./company-cards"

// 产品分析报告卡片组件（使用通用ReportCard作为占位，后续可优化）
interface ProductSnapshotCardProps {
  data: {
    title: string
    summary: string
    icon?: string
    productName: string
    tags: string[]
    metrics: Array<{ label: string; value: string; icon?: string }>
    actionText?: string
  }
  onClick?: () => void
}

export const ProductSnapshotCard = ({ data, onClick }: ProductSnapshotCardProps) => {
  const { textScale } = useAppConfig()
  const fSize = (base: number) => base * textScale
  const IconComponent = Layers

  const iconMap: Record<string, React.ElementType> = {
    DollarSign,
    Users,
    TrendingUp,
    Target,
    Zap,
  }

  // 提取核心洞察文本
  const insightText = data.summary.split("\n\n").slice(1).join("\n\n").replace(/^·\s+/gm, "").trim()

  return (
    <CardBase className="relative z-10 w-full mb-3 overflow-hidden group">
      {/* 内部光泽层 */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-transparent pointer-events-none" />
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"
        style={{ backgroundColor: "rgba(99, 102, 241, 0.1)" }}
      />

      {/* 1. Header & Product Info */}
      <div className="relative flex justify-between items-start mb-3">
        {/* Left: Product Name & Tags */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span
              className={`${DesignTokens.text.secondary} font-bold uppercase tracking-widest`}
              style={{ fontSize: `${fSize(9)}px` }}
            >
              Product Profile
            </span>
          </div>
          <h2
            className={`${DesignTokens.typography.title} drop-shadow-sm mb-2`}
            style={{ fontSize: `${fSize(16)}px`, lineHeight: "1.2" }}
          >
            {data.productName}
          </h2>
          <div className="flex items-center gap-1.5 flex-wrap">
            {data.tags.map((tag, i) => (
              <span
                key={i}
                className="inline-block px-2 py-0.5 rounded-md bg-primary/10 text-primary font-semibold"
                style={{ fontSize: `${fSize(9)}px` }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Right: Icon */}
        <div className="p-2 bg-card rounded-full shadow-sm border border-border">
          <IconComponent size={18} className="text-primary" />
        </div>
      </div>

      {/* 2. AI Core Insight */}
      <div className="relative mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={16} className="text-primary flex-shrink-0" />
          <h3 className={DesignTokens.typography.title} style={{ fontSize: `${fSize(13)}px` }}>
            核心洞察
          </h3>
        </div>
        <div className="bg-muted/30 p-4 rounded-2xl border border-border/50">
          <p
            className="text-muted-foreground leading-relaxed line-clamp-4"
            style={{ fontSize: `${fSize(12)}px` }}
          >
            <span className="font-semibold text-foreground">产品定位：</span>
            {insightText}
          </p>
        </div>
      </div>

      {/* 3. Key Metrics */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {data.metrics.map((m, i) => {
          const MetricIcon = m.icon ? iconMap[m.icon] || TrendingUp : TrendingUp
          return (
            <div
              key={i}
              className="flex flex-col items-center justify-center p-2.5 bg-card rounded-xl border border-border/30 shadow-sm"
            >
              <MetricIcon size={14} className="text-primary mb-1" />
              <span
                className="font-bold text-muted-foreground mb-0.5 text-center leading-tight"
                style={{ fontSize: `${fSize(8)}px` }}
              >
                {m.label}
              </span>
              <span
                className="font-black text-foreground text-center leading-tight"
                style={{ fontSize: `${fSize(13)}px` }}
              >
                {m.value}
              </span>
            </div>
          )
        })}
      </div>

    </CardBase>
  )
}
