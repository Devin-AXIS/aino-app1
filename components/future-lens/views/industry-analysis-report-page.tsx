"use client"

/**
 * 产业分析报告页面
 * 从后端模块/目录读取数据，实现完整的三层配置体系
 * 
 * 数据流转：
 * 1. 从主报告目录读取 cardTemplateIds 配置
 * 2. 根据 cardTemplateIds，从对应的卡片目录读取 records
 * 3. 合并三层配置：类型模板 + 内容配置 + 用户个性化
 * 4. 渲染卡片列表
 */

import { useState, useEffect } from "react"
import { useAppConfig } from "@/lib/future-lens/config-context"
import { getAINOConfig } from "@/lib/aino-sdk/config"
import { getIndustryAnalysisReportWithCards } from "@/lib/future-lens/api/industry-analysis-api"
import type { ReportWithCards } from "@/lib/future-lens/types/card-types"
import { TabsStickyLayout } from "../ai-report/layouts/tabs-sticky-layout"
import { SinglePageLayout } from "../ai-report/layouts/single-page-layout"
import { CardFactory } from "../cards/card-factory"
import { TopOverviewCard } from "./ai-report-page"

interface IndustryAnalysisReportPageProps {
  applicationId?: string
  moduleKey?: string
  industry?: string
  onBack?: () => void
}

export function IndustryAnalysisReportPage({
  applicationId,
  moduleKey = "industry-analysis",
  industry,
  onBack,
}: IndustryAnalysisReportPageProps) {
  const [reportData, setReportData] = useState<ReportWithCards | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { textScale } = useAppConfig()

  // 获取应用ID（优先使用props中的applicationId，其次从URL参数获取，最后使用配置中的默认值）
  const getApplicationId = () => {
    if (applicationId) return applicationId
    // 从URL参数获取
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const urlAppId = params.get('applicationId')
      if (urlAppId) return urlAppId
    }
    const config = getAINOConfig()
    return config.applicationId
  }

  // 加载报告数据
  useEffect(() => {
    const loadReport = async () => {
      try {
        setLoading(true)
        setError(null)

        const appId = getApplicationId()
        console.log(`[IndustryAnalysisReportPage] 使用的应用ID:`, appId)
        console.log(`[IndustryAnalysisReportPage] props.applicationId:`, applicationId)
        console.log(`[IndustryAnalysisReportPage] URL参数applicationId:`, typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('applicationId') : 'N/A')
        if (!appId) {
          throw new Error("应用ID未配置")
        }

        const data = await getIndustryAnalysisReportWithCards(appId, moduleKey, industry)
        setReportData(data)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "加载报告失败"
        setError(errorMessage)
        console.error("[IndustryAnalysisReportPage] 加载报告失败:", err)
      } finally {
        setLoading(false)
      }
    }

    loadReport()
  }, [applicationId, moduleKey, industry])

  // 渲染布局
  const renderLayout = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <div className="text-sm text-muted-foreground">正在加载产业分析报告...</div>
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-16 gap-4 px-4">
          <div className="text-4xl">⚠️</div>
          <div className="text-center">
            <div className="text-lg font-semibold text-destructive mb-2">加载失败</div>
            <div className="text-sm text-muted-foreground mb-4">{error}</div>
            <button
              onClick={() => {
                setError(null)
                setLoading(true)
                const appId = getApplicationId()
                if (appId) {
                  getIndustryAnalysisReportWithCards(appId, moduleKey)
                    .then((data) => {
                      setReportData(data)
                      setError(null)
                    })
                    .catch((err) => {
                      setError(err instanceof Error ? err.message : "加载报告失败")
                    })
                    .finally(() => {
                      setLoading(false)
                    })
                }
              }}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              重试
            </button>
          </div>
        </div>
      )
    }

    if (!reportData) {
      return (
        <div className="flex flex-col items-center justify-center py-16 gap-4 px-4">
          <div className="text-4xl">📊</div>
          <div className="text-center">
            <div className="text-lg font-semibold text-muted-foreground mb-2">报告数据为空</div>
            <div className="text-sm text-muted-foreground">
              请检查应用ID配置或联系管理员
            </div>
          </div>
        </div>
      )
    }

    const layoutType = reportData.layoutType || "tabs-sticky"
    // 从报告数据中提取标题和摘要，传递给TopOverviewCard
    // 提取产业名称（从报告标题中提取，如"AI产业分析报告" -> "AI产业"）
    let reportTitle = reportData.name || (industry === 'ai' ? 'AI产业' : industry === 'blockchain' ? '区块链产业' : '产业分析')
    // 如果标题包含"分析报告"，只取前面的部分
    if (reportTitle.includes('分析报告')) {
      reportTitle = reportTitle.replace('分析报告', '').trim()
    }
    const reportSummary = reportData.summary || (industry === 'ai' ? 'AI产业正处于快速发展期，技术创新和资本投入持续增长。' : industry === 'blockchain' ? '区块链产业正在从概念验证向实际应用转变。' : '')
    const totalMarket = reportData.totalMarket
    const growth = reportData.growth
    const momentumData = reportData.momentumData
    console.log('[IndustryAnalysisReportPage] TopOverviewCard数据:', { 
      reportTitle, 
      reportSummary: reportSummary.substring(0, 50),
      totalMarket,
      growth,
      momentumDataLength: momentumData?.length
    })
    const topOverviewCard = <TopOverviewCard 
      title={reportTitle} 
      summary={reportSummary}
      totalMarket={totalMarket}
      growth={growth}
      momentumData={momentumData}
    />

    // 根据布局类型选择对应的布局组件
    switch (layoutType) {
      case "tabs-sticky":
        return (
          <TabsStickyLayout
            reportData={reportData}
            onBack={onBack || (() => {})}
            topOverviewCard={topOverviewCard}
          />
        )
      case "single-page":
        return (
          <SinglePageLayout
            reportData={reportData}
            onBack={onBack || (() => {})}
            topOverviewCard={topOverviewCard}
          />
        )
      default:
        return (
          <TabsStickyLayout
            reportData={reportData}
            onBack={onBack || (() => {})}
            topOverviewCard={topOverviewCard}
          />
        )
    }
  }

  return renderLayout()
}

