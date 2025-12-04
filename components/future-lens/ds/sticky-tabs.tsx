"use client"

import type React from "react"
import { useState, useEffect, useRef, createContext, useContext } from "react"
import { cn } from "@/lib/utils"
import { DesignTokens } from "@/lib/future-lens/design-tokens"

/**
 * StickyTabs Context - 用于在 ScrollHeaderContainer 内显示标签栏
 */
interface StickyTabsContextValue {
  showInHeader: boolean
  tabs: string[]
  activeTab: number
  onTabChange: (index: number) => void
}

const StickyTabsContext = createContext<StickyTabsContextValue | null>(null)

export const useStickyTabsContext = () => useContext(StickyTabsContext)

// 导出 Context 以便外部使用
export { StickyTabsContext }

interface StickyTabsProps {
  /** 标签列表 */
  tabs: string[]
  /** 当前激活的标签索引 */
  activeTab: number
  /** 标签切换回调 */
  onTabChange: (index: number) => void
  /** 滚动容器 ID（用于检测滚动位置） */
  scrollContainerId?: string
  /** 自定义类名 */
  className?: string
  /** 可见性变化回调（当标签栏滚动到顶部时调用） */
  onVisibilityChange?: (showInHeader: boolean) => void
}

/**
 * StickyTabs - 粘性标签栏组件（胶囊式，融入顶部栏）
 * 
 * 初始在内容区域，滚动时融入顶部栏（成为 ScrollHeader 的一部分）
 * 标签栏直接显示在 ScrollHeader 下方，作为顶部栏的一部分
 * 
 * @example
 * ```tsx
 * <ScrollHeaderContainer scrollContainerId="scroll-container">
 *   <ScrollHeader title="页面标题" onBack={onBack} />
 *   <StickyTabsHeader />
 * </ScrollHeaderContainer>
 * <StickyTabs
 *   tabs={["职业数据", "具备能力", "相关岗位"]}
 *   activeTab={0}
 *   onTabChange={setActiveTab}
 *   scrollContainerId="scroll-container"
 * />
 * ```
 */
export function StickyTabs({
  tabs,
  activeTab,
  onTabChange,
  scrollContainerId,
  className,
  onVisibilityChange,
}: StickyTabsProps) {
  const placeholderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!scrollContainerId || !placeholderRef.current || !onVisibilityChange) return

    const container = document.getElementById(scrollContainerId)
    if (!container) return

    const placeholder = placeholderRef.current

    const handleScroll = () => {
      const placeholderRect = placeholder.getBoundingClientRect()
      const headerHeight = 56 // ScrollHeader 高度

      // 当占位标签栏的顶部 <= ScrollHeader 高度时，显示顶部标签栏
      const placeholderTop = placeholderRect.top
      onVisibilityChange(placeholderTop <= headerHeight)
    }

    container.addEventListener("scroll", handleScroll)
    requestAnimationFrame(handleScroll)

    return () => {
      container.removeEventListener("scroll", handleScroll)
    }
  }, [scrollContainerId, onVisibilityChange])

  // 胶囊式标签按钮（复用样式）
  const TabButton = ({ tab, idx, isActive }: { tab: string; idx: number; isActive: boolean }) => (
    <button
      onClick={() => onTabChange(idx)}
      className={cn(
        "flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap",
        isActive
          ? "bg-primary text-primary-foreground shadow-sm"
          : "bg-secondary/50 text-muted-foreground hover:bg-secondary",
      )}
    >
      {tab}
    </button>
  )

  return (
    <>
      {/* 占位标签栏（初始位置，在内容区域） */}
      <div ref={placeholderRef} className={cn("w-full px-4 py-2.5", className)}>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 justify-center">
          {tabs.map((tab, idx) => (
            <TabButton key={idx} tab={tab} idx={idx} isActive={activeTab === idx} />
          ))}
        </div>
      </div>
    </>
  )
}

/**
 * StickyTabsHeader - 在 ScrollHeader 内使用的标签栏组件
 * 直接显示在标题下方，作为顶部栏的一部分
 */
export function StickyTabsHeader() {
  const context = useStickyTabsContext()

  // 如果没有 context，不显示
  if (!context) return null
  
  // 当占位标签栏滚动出视野时，始终显示顶部标签栏
  if (!context.showInHeader) return null

  const TabButton = ({ tab, idx, isActive }: { tab: string; idx: number; isActive: boolean }) => (
    <button
      onClick={() => context.onTabChange(idx)}
      className={cn(
        "flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap",
        isActive
          ? "bg-primary text-primary-foreground shadow-sm"
          : "bg-secondary/50 text-muted-foreground hover:bg-secondary",
      )}
    >
      {tab}
    </button>
  )

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 justify-center">
      {context.tabs.map((tab, idx) => (
        <TabButton key={idx} tab={tab} idx={idx} isActive={context.activeTab === idx} />
      ))}
    </div>
  )
}

