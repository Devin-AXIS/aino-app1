"use client"

import type React from "react"
import { useState, useEffect, createContext, useContext } from "react"
import { cn } from "@/lib/utils"

/**
 * 滚动状态上下文
 * 用于在 ScrollHeaderContainer 的子组件之间共享滚动状态
 */
interface ScrollContextValue {
  isScrolled: boolean
  scrollContainerId: string
}

const ScrollContext = createContext<ScrollContextValue>({
  isScrolled: false,
  scrollContainerId: "scroll-container",
})

export const useScrollContext = () => useContext(ScrollContext)

interface ScrollHeaderContainerProps {
  /** 滚动容器 ID */
  scrollContainerId?: string
  /** 子组件 */
  children: React.ReactNode
  /** 自定义类名 */
  className?: string
}

/**
 * ScrollHeaderContainer - 滚动顶部栏容器组件
 * 
 * 统一管理滚动检测和透明背景效果，支持组合 Header、Tabs、扩展内容
 * 
 * @example
 * ```tsx
 * <ScrollHeaderContainer scrollContainerId="scroll-container">
 *   <ScrollHeader title="页面标题" onBack={onBack} />
 *   <ScrollTabs tabs={["标签1", "标签2"]} activeTab={0} onTabChange={setActiveTab} />
 * </ScrollHeaderContainer>
 * ```
 */
export function ScrollHeaderContainer({
  scrollContainerId = "scroll-container",
  children,
  className,
}: ScrollHeaderContainerProps) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const container = document.getElementById(scrollContainerId) || window

    const handleScroll = () => {
      const scrollTop = container === window ? window.scrollY : (container as HTMLElement).scrollTop
      setIsScrolled(scrollTop > 10)
    }

    container.addEventListener("scroll", handleScroll)
    // Trigger once to set initial state
    handleScroll()

    return () => {
      container.removeEventListener("scroll", handleScroll)
    }
  }, [scrollContainerId])

  return (
    <ScrollContext.Provider value={{ isScrolled, scrollContainerId }}>
      <div className={cn("sticky top-0 left-0 right-0 z-30", className)}>{children}</div>
    </ScrollContext.Provider>
  )
}

