"use client"

import { Suspense } from "react"
import { ConfigProvider } from "@/lib/future-lens/config-context"
import { VerifyCode } from "@/components/future-lens/auth/verify-code"

function VerifyCodeWrapper() {
  return <VerifyCode />
}

export default function VerifyAuthPage() {
  return (
    <ConfigProvider>
      <Suspense fallback={<div className="min-h-screen w-full bg-background flex items-center justify-center">Loading...</div>}>
        <VerifyCodeWrapper />
      </Suspense>
    </ConfigProvider>
  )
}
