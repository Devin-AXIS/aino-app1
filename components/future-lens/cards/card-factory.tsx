"use client"

import React from "react"
import type { InsightData } from "@/lib/future-lens/types"
import { InsightCard } from "./insight-card"
import { registerCard, getCardComponent, type CardComponent } from "./card-registry"
import { motion } from "framer-motion"
import { AlertTriangle } from "lucide-react"

class CardErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Error logged to monitoring service in production
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 mb-3 rounded-[16px] bg-red-50 border border-red-100 flex items-center gap-3 text-red-800">
          <AlertTriangle size={16} />
          <span className="text-xs font-medium">Card unavailable</span>
        </div>
      )
    }

    return this.props.children
  }
}

const MotionWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </motion.div>
  )
}

// 导入初始化函数（确保注册表已初始化）
import "./card-registry-init"

/**
 * CardFactory - 卡片工厂组件（统一管理所有卡片）
 * 
 * 支持两种数据格式：
 * 1. InsightData（通过 type 查找）：用于通用卡片（trend, risk, discover等）
 * 2. CardInstance（通过 componentName 查找）：用于AI报告卡片（IndustryStackCard等）
 * 
 * @example
 * ```tsx
 * // InsightCard 数据
 * <CardFactory data={{ type: 'trend', headline: '...' }} />
 * 
 * // DiscoverCard 数据
 * <CardFactory data={{ type: 'discover', title: '...' }} />
 * 
 * // AI报告卡片数据
 * <CardFactory data={{ componentName: 'IndustryStackCard', data: {...} }} />
 * ```
 */
export const CardFactory = ({ data, onClick, taskName, showTaskName }: { data: InsightData | any; onClick?: () => void; taskName?: string; showTaskName?: boolean }) => {
  // 优先通过 componentName 查找（CardInstance 格式）
  const componentName = data?.componentName
  const cardType = data?.type || "default"
  let CardComponent: CardComponent | null = null
  
  if (componentName) {
    CardComponent = getCardComponent(componentName)
  }
  
  // 如果没有 componentName，则通过 type 查找（InsightData 格式）
  if (!CardComponent) {
    CardComponent = getCardComponent(cardType) || getCardComponent("default")
  }
  
  // 如果找到的是 CardInstance 格式，需要传递 data.data 而不是整个 data
  const cardData = componentName && data?.data ? data.data : data

  if (!CardComponent) {
    console.warn(`[CardFactory] 卡片类型 "${componentName || cardType}" 未注册，使用默认卡片`)
    return (
      <CardErrorBoundary>
        <MotionWrapper>
          <InsightCard data={data as InsightData} onClick={onClick} taskName={taskName} showTaskName={showTaskName} />
        </MotionWrapper>
      </CardErrorBoundary>
    )
  }

  // 如果组件是 InsightCard，传递额外的 props
  if (CardComponent === InsightCard) {
    return (
      <CardErrorBoundary>
        <MotionWrapper>
          <InsightCard data={cardData as InsightData} onClick={onClick} taskName={taskName} showTaskName={showTaskName} />
        </MotionWrapper>
      </CardErrorBoundary>
    )
  }

  return (
    <CardErrorBoundary>
      <MotionWrapper>
        <CardComponent data={cardData} onClick={onClick} />
      </MotionWrapper>
    </CardErrorBoundary>
  )
}

// 导出注册函数，方便外部使用
export { registerCard, getCardComponent, getRegisteredCardTypes, isCardRegistered } from "./card-registry"
