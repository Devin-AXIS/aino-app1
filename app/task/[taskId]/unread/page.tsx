"use client"

import { use } from "react"
import { ConfigProvider } from "@/lib/future-lens/config-context"
import { UnreadEventsPage } from "@/components/future-lens/views/unread-events-page"
import { useRouter } from "next/navigation"

export default function UnreadEventsRoute({ params }: { params: Promise<{ taskId: string }> }) {
  const router = useRouter()
  const { taskId } = use(params)

  return (
    <ConfigProvider>
      <UnreadEventsPage taskId={taskId} onBack={() => router.back()} />
    </ConfigProvider>
  )
}

