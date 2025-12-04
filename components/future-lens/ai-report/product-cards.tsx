"use client"

import type React from "react"
import {
  Users,
  Target,
  GitBranch,
  Zap,
  Sparkles,
  Layers,
  Network,
  Gauge,
  Shield,
  DollarSign,
  TrendingUp,
  Clock,
} from "lucide-react"
import { CardBase } from "@/components/future-lens/ds/card-base"
import { useAppConfig } from "@/lib/future-lens/config-context"
import { ChartDefaults } from "@/components/future-lens/charts/chart-config"
import { ChartColorsRaw } from "@/components/future-lens/charts/chart-colors"
import { PieChart } from "@/components/future-lens/charts/pie-chart"
import { HorizontalBarChart } from "@/components/future-lens/charts/horizontal-bar-chart"
import { ProgressBarsChart } from "@/components/future-lens/charts/progress-bars-chart"
import { RadarChart } from "@/components/future-lens/charts/radar-chart"
import { MultiLineChart } from "@/components/future-lens/charts/multi-line-chart"
import { StatusGridChart } from "@/components/future-lens/charts/status-grid-chart"
import ReactMarkdown from "react-markdown"

// 共享组件
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

// 产品分析报告卡片组件接口
interface ProductCardProps {
  data: {
    title: string
    summary: string
    icon?: string
    chartData?: any
    [key: string]: any
  }
  onClick?: () => void
}

// 1. 用户画像卡片 - 饼图
export const UserProfileCard = ({ data, onClick }: ProductCardProps) => {
  const { textScale } = useAppConfig()
  return (
    <CardBase className="mb-3">
      <AIAnalystHeader title={data.title} summary={data.summary} icon={Users} />
      {data.chartData && (
        <div className="mb-4">
          <PieChart
            data={data.chartData.map((item: any) => ({ label: item.label, value: item.value }))}
            height={180}
            showLegend={true}
          />
        </div>
      )}
      <ActionButton text={data.actionText || "查看用户详细分析"} onClick={onClick} />
    </CardBase>
  )
}

// 2. 核心任务卡片 - 水平条形图
export const CoreTasksCard = ({ data, onClick }: ProductCardProps) => {
  return (
    <CardBase className="mb-3">
      <AIAnalystHeader title={data.title} summary={data.summary} icon={Target} />
      {data.chartData && (
        <div className="mb-4">
          <HorizontalBarChart
            data={data.chartData.map((item: any) => ({ label: item.label, value: item.value }))}
            height={120}
            showValue={true}
          />
        </div>
      )}
      <ActionButton text={data.actionText || "查看场景详细分析"} onClick={onClick} />
    </CardBase>
  )
}

// 3. 体验路径卡片 - 进度条
export const ExperienceJourneyCard = ({ data, onClick }: ProductCardProps) => {
  return (
    <CardBase className="mb-3">
      <AIAnalystHeader title={data.title} summary={data.summary} icon={GitBranch} />
      {data.chartData && (
        <div className="mb-4">
          <ProgressBarsChart data={data.chartData} textScale={1.0} />
        </div>
      )}
      <ActionButton text={data.actionText || "查看体验详细分析"} onClick={onClick} />
    </CardBase>
  )
}

// 4. 功能热度卡片 - 水平条形图
export const FeatureHeatmapCard = ({ data, onClick }: ProductCardProps) => {
  return (
    <CardBase className="mb-3">
      <AIAnalystHeader title={data.title} summary={data.summary} icon={Zap} />
      {data.chartData && (
        <div className="mb-4">
          <HorizontalBarChart
            data={data.chartData.map((item: any) => ({ label: item.label, value: item.value }))}
            height={160}
            showValue={true}
          />
        </div>
      )}
      <ActionButton text={data.actionText || "查看功能详细分析"} onClick={onClick} />
    </CardBase>
  )
}

// 5. 个性化卡片 - 进度条
export const PersonalizationCard = ({ data, onClick }: ProductCardProps) => {
  return (
    <CardBase className="mb-3">
      <AIAnalystHeader title={data.title} summary={data.summary} icon={Sparkles} />
      {data.chartData && (
        <div className="mb-4">
          <ProgressBarsChart data={data.chartData} textScale={1.0} />
        </div>
      )}
      <ActionButton text={data.actionText || "查看交互详细分析"} onClick={onClick} />
    </CardBase>
  )
}

// 6. 技术架构卡片 - 状态网格
export const ArchitectureOverviewCard = ({ data, onClick }: ProductCardProps) => {
  return (
    <CardBase className="mb-3">
      <AIAnalystHeader title={data.title} summary={data.summary} icon={Layers} />
      {data.chartData && (
        <div className="mb-4">
          <StatusGridChart
            data={data.chartData.map((item: any) => ({
              name: item.label,
              status: item.status === "成熟" ? "success" : item.status === "发展中" ? "warning" : "critical",
              text: `${item.value}%`,
            }))}
            height={120}
          />
        </div>
      )}
      <ActionButton text={data.actionText || "查看架构详细分析"} onClick={onClick} />
    </CardBase>
  )
}

// 7. 能力引擎卡片 - 雷达图
export const CapabilityEngineCard = ({ data, onClick }: ProductCardProps) => {
  return (
    <CardBase className="mb-3">
      <AIAnalystHeader title={data.title} summary={data.summary} icon={Zap} />
      {data.chartData && (
        <div className="mb-4">
          <RadarChart
            data={data.chartData.map((item: any) => ({ subject: item.subject, value: item.value }))}
            height={200}
            fillColor={ChartColorsRaw.series.primary}
            fillOpacity={0.6}
          />
        </div>
      )}
      <ActionButton text={data.actionText || "查看能力详细分析"} onClick={onClick} />
    </CardBase>
  )
}

// 8. 数据集成卡片 - 状态网格
export const DataIntegrationCard = ({ data, onClick }: ProductCardProps) => {
  return (
    <CardBase className="mb-3">
      <AIAnalystHeader title={data.title} summary={data.summary} icon={Network} />
      {data.chartData && (
        <div className="mb-4">
          <StatusGridChart
            data={data.chartData.map((item: any) => ({
              name: item.label,
              status: item.status === "成熟" ? "success" : item.status === "发展中" ? "warning" : "critical",
              text: `${item.value}%`,
            }))}
            height={120}
          />
        </div>
      )}
      <ActionButton text={data.actionText || "查看集成详细分析"} onClick={onClick} />
    </CardBase>
  )
}

// 9. 性能可靠性卡片 - 进度条
export const PerformanceReliabilityCard = ({ data, onClick }: ProductCardProps) => {
  return (
    <CardBase className="mb-3">
      <AIAnalystHeader title={data.title} summary={data.summary} icon={Gauge} />
      {data.chartData && (
        <div className="mb-4">
          <ProgressBarsChart data={data.chartData} textScale={1.0} />
        </div>
      )}
      <ActionButton text={data.actionText || "查看性能详细分析"} onClick={onClick} />
    </CardBase>
  )
}

// 10. 安全合规卡片 - 状态网格
export const SecurityGovernanceCard = ({ data, onClick }: ProductCardProps) => {
  return (
    <CardBase className="mb-3">
      <AIAnalystHeader title={data.title} summary={data.summary} icon={Shield} />
      {data.chartData && (
        <div className="mb-4">
          <StatusGridChart
            data={data.chartData.map((item: any) => ({
              name: item.label,
              status: item.status === "成熟" ? "success" : item.status === "发展中" ? "warning" : "critical",
              text: `${item.value}%`,
            }))}
            height={120}
          />
        </div>
      )}
      <ActionButton text={data.actionText || "查看安全详细分析"} onClick={onClick} />
    </CardBase>
  )
}

// 11. 商业模式卡片 - 饼图
export const BusinessModelCard = ({ data, onClick }: ProductCardProps) => {
  return (
    <CardBase className="mb-3">
      <AIAnalystHeader title={data.title} summary={data.summary} icon={DollarSign} />
      {data.chartData && (
        <div className="mb-4">
          <PieChart
            data={data.chartData.map((item: any) => ({ label: item.label, value: item.value }))}
            height={180}
            showLegend={true}
          />
        </div>
      )}
      <ActionButton text={data.actionText || "查看商业模式详细分析"} onClick={onClick} />
    </CardBase>
  )
}

// 12. 用户增长卡片 - 多线折线图
export const UserGrowthCard = ({ data, onClick }: ProductCardProps) => {
  return (
    <CardBase className="mb-3">
      <AIAnalystHeader title={data.title} summary={data.summary} icon={TrendingUp} />
      {data.chartData && (
        <div className="mb-4">
          <MultiLineChart
            data={data.chartData.map((item: any) => ({
              label: item.label,
              value1: item.value1,
              value2: item.value2,
            }))}
            height={180}
            line1={{ name: "新用户", color: ChartColorsRaw.series.primary }}
            line2={{ name: "活跃用户", color: ChartColorsRaw.series.secondary }}
            showGrid={true}
          />
        </div>
      )}
      <ActionButton text={data.actionText || "查看增长详细分析"} onClick={onClick} />
    </CardBase>
  )
}

// 13. 留存粘性卡片 - 多线折线图
export const RetentionEngagementCard = ({ data, onClick }: ProductCardProps) => {
  return (
    <CardBase className="mb-3">
      <AIAnalystHeader title={data.title} summary={data.summary} icon={Target} />
      {data.chartData && (
        <div className="mb-4">
          <MultiLineChart
            data={data.chartData.map((item: any) => ({
              label: item.label,
              value1: item.value1,
              value2: item.value2,
            }))}
            height={180}
            line1={{ name: "留存率", color: ChartColorsRaw.series.primary }}
            line2={{ name: "活跃率", color: ChartColorsRaw.series.secondary }}
            showGrid={true}
          />
        </div>
      )}
      <ActionButton text={data.actionText || "查看留存详细分析"} onClick={onClick} />
    </CardBase>
  )
}

// 14. 产品护城河卡片 - 雷达图
export const ProductMoatCard = ({ data, onClick }: ProductCardProps) => {
  return (
    <CardBase className="mb-3">
      <AIAnalystHeader title={data.title} summary={data.summary} icon={Shield} />
      {data.chartData && (
        <div className="mb-4">
          <RadarChart
            data={data.chartData.map((item: any) => ({ subject: item.subject, value: item.value }))}
            height={200}
            fillColor={ChartColorsRaw.series.primary}
            fillOpacity={0.6}
          />
        </div>
      )}
      <ActionButton text={data.actionText || "查看护城河详细分析"} onClick={onClick} />
    </CardBase>
  )
}

// 15. 路线图风险卡片 - 水平条形图（风险值）
export const RoadmapRisksCard = ({ data, onClick }: ProductCardProps) => {
  return (
    <CardBase className="mb-3">
      <AIAnalystHeader title={data.title} summary={data.summary} icon={Clock} />
      {data.chartData && (
        <div className="mb-4">
          <HorizontalBarChart
            data={data.chartData.map((item: any) => ({ label: item.label, value: item.value }))}
            height={120}
            showValue={true}
            barColor={ChartColorsRaw.semantic.warning}
          />
        </div>
      )}
      <ActionButton text={data.actionText || "查看路线图详细分析"} onClick={onClick} />
    </CardBase>
  )
}

// 16. AI产品总评卡片 - 无图表，纯文本
export const AIProductInsightCard = ({ data, onClick }: ProductCardProps) => {
  return (
    <CardBase className="mb-3">
      <AIAnalystHeader title={data.title} summary={data.summary} icon={Sparkles} />
      <ActionButton text={data.actionText || "查看完整洞察报告"} onClick={onClick} />
    </CardBase>
  )
}
