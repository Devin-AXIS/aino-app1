"use client"

import { Suspense } from "react"
import { ConfigProvider } from "@/lib/future-lens/config-context"
import { PhoneInput } from "@/components/future-lens/auth/phone-input"

function PhoneInputWrapper() {
  return <PhoneInput />
}

export default function PhoneAuthPage() {
  return (
    <ConfigProvider>
      <Suspense fallback={<div className="min-h-screen w-full bg-background flex items-center justify-center">Loading...</div>}>
        <PhoneInputWrapper />
      </Suspense>
    </ConfigProvider>
  )
}
