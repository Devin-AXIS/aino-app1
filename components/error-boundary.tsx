"use client"

import React from "react"
import { DesignTokens } from "@/lib/future-lens/design-tokens"
import { PillButton } from "@/components/future-lens/ds/pill-button"

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[v0] Error caught by boundary:", error, errorInfo)
    
    // 上报错误到全局错误处理器
    if (typeof window !== 'undefined') {
      import('@/lib/future-lens/utils/error-handler').then(({ errorHandler }) => {
        errorHandler.capture(error, errorInfo)
      }).catch(() => {
        // 如果导入失败，静默处理
      })
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen w-full bg-background flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center space-y-4">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className={`text-lg ${DesignTokens.typography.title} text-foreground`}>出现了一些问题</h2>
            <p className={`text-sm ${DesignTokens.typography.body} text-muted-foreground`}>
              抱歉，页面遇到了错误。请尝试刷新页面。
            </p>
            <div className="pt-4">
              <PillButton variant="primary" onClick={() => window.location.reload()}>
                刷新页面
              </PillButton>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
