"use client"

import { useState } from "react"
import { Filter, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { DesignTokens } from "@/lib/future-lens/design-tokens"
import { AgentSelector } from "./agent-selector"
import { AgentTabs } from "./agent-tabs"
import { FilterActionSheet } from "./filter-action-sheet"
import { AddAgentDialog } from "./add-agent-dialog"
import { ManageAgentsDialog } from "./manage-agents-dialog"
import type { Agent, FilterState } from "@/lib/future-lens/types/agent-types"

interface DiscoverHeaderProps {
  agents: Agent[]
  activeAgentId: string
  onAgentChange: (agentId: string) => void
  onAddAgent: (agent: Omit<Agent, 'id'>) => void
  onAgentsChange?: (agents: Agent[]) => void
  viewMode: 'recommended' | 'all'
  onViewModeChange: (mode: 'recommended' | 'all') => void
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  onSearch?: () => void
}

/**
 * 发现页面主头部组件
 * 整合智能体选择器、推荐/全部标签、筛选/搜索功能
 */
export function DiscoverHeader({
  agents,
  activeAgentId,
  onAgentChange,
  onAddAgent,
  onAgentsChange,
  viewMode,
  onViewModeChange,
  filters,
  onFiltersChange,
  onSearch,
}: DiscoverHeaderProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isAddAgentOpen, setIsAddAgentOpen] = useState(false)
  const [isManageAgentsOpen, setIsManageAgentsOpen] = useState(false)

  const activeAgent = agents.find(a => a.id === activeAgentId)
  const filterFields = activeAgent?.config?.filterFields || []

  const handleAddAgent = (agent: Omit<Agent, 'id'>) => {
    // TODO: 保存到 localStorage 或后端
    const newAgent: Agent = {
      ...agent,
      id: `custom-${Date.now()}`,
    }
    // 这里需要更新 agents 列表，暂时先关闭对话框
    console.log('添加智能体:', newAgent)
  }

  const handleApplyFilters = () => {
    // 筛选逻辑已通过 onFiltersChange 更新
    console.log('应用筛选:', filters)
  }

  return (
    <div className="relative w-full">
      {/* 智能体选择器 */}
      <AgentSelector
        agents={agents}
        activeAgentId={activeAgentId}
        onAgentChange={onAgentChange}
        onAddAgent={() => setIsAddAgentOpen(true)}
        onManageAgents={() => setIsManageAgentsOpen(true)}
      />

      {/* 推荐/全部标签 + 筛选/搜索按钮 - 一行布局，与卡片对齐 */}
      <div className="flex items-center justify-between gap-3 px-5 pb-2">
        {/* 左侧：推荐/全部标签 - 完全靠左，与卡片对齐 */}
        <AgentTabs
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
        />

        {/* 右侧：筛选和搜索按钮 */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* 筛选按钮 */}
          <button
            onClick={() => setIsFilterOpen(true)}
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center",
              "text-muted-foreground hover:bg-secondary transition-all active:scale-95",
              "border border-transparent hover:border-border"
            )}
            aria-label="筛选"
          >
            <Filter size={18} strokeWidth={2} />
          </button>

          {/* 搜索按钮 - 参考首页设计 */}
          <button
            onClick={() => {
              if (onSearch) {
                onSearch()
              }
            }}
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center",
              "text-muted-foreground hover:bg-secondary transition-all active:scale-95",
              "border border-transparent hover:border-border"
            )}
            aria-label="搜索"
          >
            <Search size={18} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* 筛选 Action Sheet */}
      <FilterActionSheet
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filterFields={filterFields}
        filters={filters}
        onFiltersChange={onFiltersChange}
        onApply={handleApplyFilters}
      />

      {/* 管理智能体 Dialog（整合了添加功能） */}
      <ManageAgentsDialog
        isOpen={isManageAgentsOpen || isAddAgentOpen}
        onClose={() => {
          setIsManageAgentsOpen(false)
          setIsAddAgentOpen(false)
        }}
        agents={agents}
        onAgentsChange={onAgentsChange || (() => {})}
        onAddAgent={() => {
          // 这个回调现在在 ManageAgentsDialog 内部处理
        }}
        showAddForm={isAddAgentOpen}
      />
    </div>
  )
}

