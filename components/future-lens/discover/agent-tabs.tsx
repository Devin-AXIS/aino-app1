"use client"

import { cn } from "@/lib/utils"
import { DesignTokens } from "@/lib/future-lens/design-tokens"
import { useAppConfig } from "@/lib/future-lens/config-context"

interface AgentTabsProps {
  viewMode: 'recommended' | 'all'
  onViewModeChange: (mode: 'recommended' | 'all') => void
}

/**
 * 推荐/全部标签切换组件
 * 紧凑的胶囊式设计，参考 CapsuleTabs
 */
export function AgentTabs({
  viewMode,
  onViewModeChange,
}: AgentTabsProps) {
  const { textScale } = useAppConfig()
  const fSize = (base: number) => base * textScale

  return (
    <div className="flex p-1 bg-muted/40 rounded-xl backdrop-blur-sm flex-shrink-0">
      <button
        onClick={() => onViewModeChange('recommended')}
        className={cn(
          "flex-1 py-1.5 px-3 rounded-lg font-medium transition-all duration-200 min-w-0",
          viewMode === 'recommended'
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
        style={{ fontSize: `${fSize(11)}px` }}
      >
        推荐
      </button>
      <button
        onClick={() => onViewModeChange('all')}
        className={cn(
          "flex-1 py-1.5 px-3 rounded-lg font-medium transition-all duration-200 min-w-0",
          viewMode === 'all'
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
        style={{ fontSize: `${fSize(11)}px` }}
      >
        全部
      </button>
    </div>
  )
}

