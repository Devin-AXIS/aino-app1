"use client"

import type React from "react"

import { ScrollHeader } from "./scroll-header"

interface BusinessSubpageShellProps {
  title: string
  onBack: () => void
  children?: React.ReactNode
}

/**
 * BusinessSubpageShell - 业务子页面布局组件
 * 
 * 提供统一的业务子页面布局，包含固定的顶部栏和可滚动内容区域
 * 
 * @example
 * ```tsx
 * <BusinessSubpageShell title="个人档案" onBack={() => router.back()}>
 *   <div>页面内容</div>
 * </BusinessSubpageShell>
 * ```
 */
export function BusinessSubpageShell({ title, onBack, children }: BusinessSubpageShellProps) {
  const scrollContainerId = `subpage-scroll-${title.replace(/\s+/g, "-").toLowerCase()}`

  return (
    <div id={scrollContainerId} className="h-full overflow-y-auto">
      <ScrollHeader title={title} onBack={onBack} scrollContainerId={scrollContainerId} alwaysShowTitle />

      <div className="px-5 py-6">{children}</div>
    </div>
  )
}
