"use client"

/**
 * 产业分析报告路由页面
 * 使用后端模块/目录数据，支持完整的三层配置体系
 */

import { Suspense } from "react"
import { ConfigProvider } from "@/lib/future-lens/config-context"
import { IndustryAnalysisReportPage } from "@/components/future-lens/views/industry-analysis-report-page"
import { useRouter, useSearchParams } from "next/navigation"

function IndustryAnalysisContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // 从URL参数获取应用ID（可选）
  const applicationId = searchParams.get("applicationId") || undefined
  const moduleKey = searchParams.get("moduleKey") || "industry-analysis"
  // 从URL参数获取产业类型（可选：ai, blockchain等）
  const industry = searchParams.get("industry") || undefined

  // 调试：打印URL参数
  console.log('[IndustryAnalysisPage] URL参数:', {
    applicationId,
    moduleKey,
    industry,
    allParams: Object.fromEntries(searchParams.entries())
  })

  return (
    <ConfigProvider>
      <IndustryAnalysisReportPage
        applicationId={applicationId || undefined}
        moduleKey={moduleKey}
        industry={industry || undefined}
        onBack={() => router.back()}
      />
    </ConfigProvider>
  )
}

export default function IndustryAnalysisPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <div className="text-sm text-muted-foreground">正在加载...</div>
      </div>
    }>
      <IndustryAnalysisContent />
    </Suspense>
  )
}

