"use client"

import { ConfigProvider } from "@/lib/future-lens/config-context"
import { AIReportPage } from "@/components/future-lens/views/ai-report-page"
import { useRouter } from "next/navigation"

export default function AIReportDemoPage() {
  const router = useRouter()
  
  return (
    <ConfigProvider>
      <AIReportPage reportId="ai-industry-report-v1" onBack={() => router.back()} />
    </ConfigProvider>
  )
}
