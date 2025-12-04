"use client"

import React from "react"
import { DesignTokens } from "@/lib/future-lens/design-tokens"
import { useAppConfig } from "@/lib/future-lens/config-context"

/**
 * CapsuleTabs - 胶囊式标签导航组件
 * 
 * @example
 * ```tsx
 * <CapsuleTabs
 *   tabs={["结构 & 趋势", "资金 & 生态", "战略 & 人物"]}
 *   activeTab={0}
 *   onTabChange={(index) => setActiveTab(index)}
 * />
 * ```
 */
interface CapsuleTabsProps {
  /** 标签列表 */
  tabs: string[]
  /** 当前激活的标签索引 */
  activeTab: number
  /** 标签切换回调 */
  onTabChange: (index: number) => void
  /** 是否粘性定位（sticky） */
  sticky?: boolean
  /** 自定义类名 */
  className?: string
}

export function CapsuleTabs({
  tabs,
  activeTab,
  onTabChange,
  sticky = false,
  className = "",
}: CapsuleTabsProps) {
  const { textScale } = useAppConfig()
  const fSize = (base: number) => base * textScale

  const containerClasses = sticky
    ? `sticky ${DesignTokens.mobile.safeTop} z-50 py-2 bg-background/90 backdrop-blur-md -mx-5 px-5 mb-3 ${className}`
    : `mb-3 ${className}`

  return (
    <div className={containerClasses}>
      <div className="flex p-1.5 bg-muted/50 rounded-2xl backdrop-blur-sm">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => onTabChange(idx)}
            className={`
              flex-1 py-2.5 font-bold rounded-xl transition-all duration-300
              ${
                activeTab === idx
                  ? "bg-card text-foreground shadow-md scale-100"
                  : "text-muted-foreground hover:text-foreground scale-95"
              }
            `}
            style={{ fontSize: `${fSize(11)}px` }}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  )
}

