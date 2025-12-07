"use client"

import { useState, useEffect } from "react"
import { Sparkles, TrendingUp, ArrowUpRight } from "lucide-react"
import { CardBase } from "@/components/future-lens/ds/card-base"
import { useAppConfig } from "@/lib/future-lens/config-context"
import { DesignTokens } from "@/lib/future-lens/design-tokens"
import { ScrollableMomentumChart } from "@/components/future-lens/charts/scrollable-momentum-chart"
import { getReportWithCards, getCard } from "@/lib/future-lens/api/card-api-mock"
import type { ReportWithCards, ReportLayoutType, CardInstance } from "@/lib/future-lens/types/card-types"
import { TabsStickyLayout } from "../ai-report/layouts/tabs-sticky-layout"
import { SinglePageLayout } from "../ai-report/layouts/single-page-layout"
import { CardFactory } from "../cards/card-factory"

interface AIReportPageProps {
  reportId: string
  onBack: () => void
}

interface TopOverviewCardProps {
  title?: string
  summary?: string
  totalMarket?: string
  growth?: string
  momentumData?: Array<{ m: string; growth: number; cap: number; heat: number }>
}

export const TopOverviewCard = ({ 
  title, 
  summary, 
  totalMarket, 
  growth, 
  momentumData 
}: TopOverviewCardProps = {}) => {
  const { textScale } = useAppConfig()
  const fSize = (base: number) => base * textScale

  // 12个月数据（从props获取，如果没有则使用默认值）
  const defaultData = [
    { m: "Jan", growth: 35, cap: 30, heat: 45 },
    { m: "Feb", growth: 38, cap: 35, heat: 50 },
    { m: "Mar", growth: 42, cap: 42, heat: 48 },
    { m: "Apr", growth: 50, cap: 55, heat: 60 },
    { m: "May", growth: 58, cap: 68, heat: 65 },
    { m: "Jun", growth: 65, cap: 75, heat: 80 },
    { m: "Jul", growth: 72, cap: 82, heat: 85 },
    { m: "Aug", growth: 78, cap: 85, heat: 82 },
    { m: "Sep", growth: 85, cap: 88, heat: 90 },
    { m: "Oct", growth: 88, cap: 92, heat: 95 },
    { m: "Nov", growth: 92, cap: 95, heat: 88 },
    { m: "Dec", growth: 95, cap: 98, heat: 85 },
  ]
  const data = momentumData || defaultData

  // 如果没有传入title，使用默认值
  const displayTitle = title || "具身智能"
  // 如果没有传入summary，使用默认值
  const displaySummary = summary || "具身智能正处于从实验室走向商业试运营的关键临界点。尽管资本热度与技术指标均已突破历史高位，形成了强劲的供给侧推力，但供应链的国产化替代（特别是精密减速器与传感器）以及商业化闭环的验证仍有6-9个月的滞后期。建议重点关注掌握数据闭环的平台型企业，规避纯硬件堆料的同质化竞争风险。"
  const displayTotalMarket = totalMarket || "$12.5B"
  const displayGrowth = growth || "+42% YoY"

  return (
    <CardBase className="relative z-10 w-full mb-3 overflow-hidden group">
      {/* 内部光泽层 */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-transparent pointer-events-none" />
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"
        style={{ backgroundColor: "rgba(99, 102, 241, 0.1)" }}
      />

      {/* 1. Header & Market Size */}
      <div className="relative flex justify-between items-start mb-3">
        {/* Left: Title & Status */}
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span
              className={`${DesignTokens.text.secondary} font-bold uppercase tracking-widest`}
              style={{ fontSize: `${fSize(9)}px` }}
            >
              Live
            </span>
          </div>
          <h2
            className={`${DesignTokens.typography.title} drop-shadow-sm`}
            style={{ fontSize: `${fSize(16)}px`, lineHeight: "1.2" }}
          >
            {displayTitle}
          </h2>
        </div>

        {/* Right: Market Size */}
        <div className="text-right">
          <div
            className={`${DesignTokens.text.secondary} font-bold uppercase mb-0.5 tracking-wide`}
            style={{ fontSize: `${fSize(8)}px` }}
          >
            Total Market
          </div>
          <div className="flex items-baseline justify-end gap-1">
            <span
              className={`${DesignTokens.typography.title} tracking-tighter`}
              style={{ fontSize: `${fSize(18)}px` }}
            >
              {displayTotalMarket}
            </span>
          </div>
          <div
            className="font-bold flex items-center justify-end gap-0.5 mt-0.5"
            style={{ fontSize: `${fSize(10)}px`, color: "#10b981" }}
          >
            <TrendingUp size={11} /> {displayGrowth}
          </div>
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
            {displaySummary}
          </p>
        </div>
      </div>

      {/* 3. Advanced Scrollable Chart */}
      <div
        className={`relative ${DesignTokens.background.muted}/30 ${DesignTokens.radius.xl} ${DesignTokens.border.default} p-1 mt-4`}
        style={{
          borderColor: "rgba(255, 255, 255, 0.6)",
          boxShadow: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
        }}
      >
        <ScrollableMomentumChart data={data} height={160} pointWidth={80} />
      </div>

      {/* Bottom Hint */}
      <div className="flex justify-center mt-2 items-center gap-1 opacity-40">
        <div className={`w-1 h-1 rounded-full ${DesignTokens.background.muted}`} />
        <span
          className={`${DesignTokens.text.secondary} font-medium`}
          style={{ fontSize: `${fSize(9)}px` }}
        >
          Swipe for history
        </span>
        <div className={`w-1 h-1 rounded-full ${DesignTokens.background.muted}`} />
      </div>

    </CardBase>
  )
}


export function AIReportPage({ reportId, onBack }: AIReportPageProps) {
  const [reportData, setReportData] = useState<ReportWithCards | null>(null)
  const [topOverviewCardData, setTopOverviewCardData] = useState<CardInstance | null>(null)
  const [loading, setLoading] = useState(true)
  const { textScale } = useAppConfig()
  const fSize = (base: number) => base * textScale

  // 加载报告数据
  useEffect(() => {
    const loadReport = async () => {
      try {
        setLoading(true)
        const data = await getReportWithCards(reportId || "ai-industry-report-v1")
        setReportData(data)

        // 如果是企业分析报告或产品分析报告，单独加载顶部预览卡片（不在16张卡片里）
        if (reportId === "ai-company-report-v1") {
          try {
            const snapshotCard = await getCard("company-snapshot-001")
            setTopOverviewCardData(snapshotCard)
          } catch (error) {
            console.warn("[AIReportPage] 加载顶部预览卡片失败:", error)
          }
        } else if (reportId === "ai-product-report-v1") {
          try {
            const snapshotCard = await getCard("product-snapshot-001")
            setTopOverviewCardData(snapshotCard)
          } catch (error) {
            console.warn("[AIReportPage] 加载顶部预览卡片失败:", error)
          }
        }
      } catch (error) {
        console.error("[AIReportPage] 加载报告失败:", error)
      } finally {
        setLoading(false)
      }
    }

    loadReport()
  }, [reportId])

  // 根据布局类型渲染对应的布局组件
  const renderLayout = () => {
    if (loading || !reportData) {
      return (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <div className="text-sm">加载中...</div>
        </div>
      )
    }

    const layoutType: ReportLayoutType = reportData.layoutType || "tabs-sticky"
    
    // 根据报告类型选择顶部预览卡片
    let topOverviewCard: React.ReactNode
    if (reportId === "ai-company-report-v1" && topOverviewCardData) {
      // 企业分析报告：使用企业预览卡片
      topOverviewCard = <CardFactory data={topOverviewCardData} />
    } else if (reportId === "ai-product-report-v1" && topOverviewCardData) {
      // 产品分析报告：使用产品预览卡片
      topOverviewCard = <CardFactory data={topOverviewCardData} />
    } else {
      // 产业分析报告：使用产业预览卡片
      topOverviewCard = <TopOverviewCard />
    }

    // 根据布局类型选择对应的布局组件
    switch (layoutType) {
      case "tabs-sticky":
        return <TabsStickyLayout reportData={reportData} onBack={onBack} topOverviewCard={topOverviewCard} />
      case "single-page":
        return <SinglePageLayout reportData={reportData} onBack={onBack} topOverviewCard={topOverviewCard} />
      case "custom":
        // 自定义布局：根据 layoutComponent 动态加载
        // 这里可以扩展支持自定义布局组件
        console.warn(`[AIReportPage] 自定义布局暂未实现: ${reportData.layoutComponent}`)
        return <TabsStickyLayout reportData={reportData} onBack={onBack} topOverviewCard={topOverviewCard} />
      default:
        // 默认使用 tabs-sticky 布局
        return <TabsStickyLayout reportData={reportData} onBack={onBack} topOverviewCard={topOverviewCard} />
    }
  }

  return renderLayout()
}
