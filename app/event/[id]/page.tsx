"use client"

import { use } from "react"
import { ConfigProvider } from "@/lib/future-lens/config-context"
import { EventDetailPage } from "@/components/future-lens/views/event-detail-page"
import { useRouter } from "next/navigation"

export default function EventDetailRoute({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)

  return (
    <ConfigProvider>
      <EventDetailPage eventId={id} onBack={() => router.back()} />
    </ConfigProvider>
  )
}

