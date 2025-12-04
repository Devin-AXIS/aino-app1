"use client"

import { ConfigProvider } from "@/lib/future-lens/config-context"
import { AuthLanding } from "@/components/future-lens/views/auth-landing"

export default function AuthPage() {
  return (
    <ConfigProvider>
      <AuthLanding />
    </ConfigProvider>
  )
}
