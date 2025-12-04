import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ErrorBoundary } from "@/components/error-boundary"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const _geist = Geist({ 
  subsets: ["latin"],
  display: 'swap', // 防止字体加载阻塞渲染
  preload: true,   // 预加载字体
})
const _geistMono = Geist_Mono({ 
  subsets: ["latin"],
  display: 'swap', // 防止字体加载阻塞渲染
  preload: true,   // 预加载字体
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
}

export const metadata: Metadata = {
  title: "FutureLens - AI战略分析助手",
  description: "基于AI的产业趋势洞察与决策支持平台，提供实时市场分析、风险评估和机遇发现",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`} suppressHydrationWarning>
        <ErrorBoundary>
          {children}
          <Toaster />
        </ErrorBoundary>
        <Analytics />
        {/* Portal container for modals - fallback if not in MobileShell */}
        <div id="app-portal-container" />
      </body>
    </html>
  )
}
