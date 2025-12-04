"use client"

import { ConfigProvider } from "@/lib/future-lens/config-context"
import { AIReportPage } from "@/components/future-lens/views/ai-report-page"
import { useRouter } from "next/navigation"

export default function AIReportRoute({ params }: { params: { id: string } }) {
  const router = useRouter()

  return (
    <ConfigProvider>
      <AIReportPage reportId={params.id} onBack={() => router.back()} />
    </ConfigProvider>
  )
}
