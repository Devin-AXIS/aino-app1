"use client"

import type React from "react"
import { motion } from "framer-motion"
import { ChevronLeft, MoreHorizontal } from "lucide-react"
import { GlassPanel } from "@/components/future-lens/ds/glass-panel"
import { cn } from "@/lib/utils"
import { ContentActionBar } from "@/components/future-lens/nav/content-action-bar"

interface DetailViewShellProps {
  /**
   * 页面标题（可选，显示在顶部中间或作为元数据）
   */
  title?: string
  /**
   * 标签列表（可选）
   */
  tabs?: string[]
  /**
   * 当前激活的标签索引
   */
  activeTab?: number
  /**
   * 标签切换回调
   */
  onTabChange?: (index: number) => void
  /**
   * 返回按钮点击回调
   */
  onBack?: () => void
  /**
   * 更多/操作按钮点击回调
   */
  onAction?: () => void
  /**
   * 主要内容区域
   */
  children: React.ReactNode
  /**
   * 自定义图标组件（如果不传则默认显示 AI Orb）
   */
  icon?: React.ReactNode
}

/**
 * DetailViewShell - 详情页布局组件
 * 
 * 提供统一的详情页布局，包含顶部导航、标签切换、内容区域和底部操作栏
 * 
 * @example
 * ```tsx
 * <DetailViewShell 
 *   title="洞察详情" 
 *   tabs={["概览", "分析", "讨论"]}
 *   activeTab={0}
 *   onTabChange={(index) => setActiveTab(index)}
 *   onBack={() => router.back()}
 * >
 *   <div>详情内容</div>
 * </DetailViewShell>
 * ```
 */
export function DetailViewShell({
  title,
  tabs = [],
  activeTab = 0,
  onTabChange,
  onBack,
  onAction,
  children,
  icon,
}: DetailViewShellProps) {
  return (
    <div className="flex flex-col h-full w-full relative overflow-hidden bg-background/0">
      {/* 1. 顶部导航栏 (Header) - Made absolute to reduce top space and added glass effect */}
      <header className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-3 z-50 pointer-events-none">
        <button
          onClick={onBack}
          className="pointer-events-auto p-2 text-muted-foreground hover:text-foreground active:scale-95 transition-all"
        >
          <ChevronLeft size={24} strokeWidth={2.5} />
          <span className="sr-only">Back</span>
        </button>

        {/* Moved icon here to align with Back/More buttons, and centered it. Added scale-90 to reduce size by ~10-15% */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto flex items-center justify-center scale-90">
          {title ? (
            <h1 className="text-sm font-medium text-muted-foreground tracking-wide uppercase bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
              {title}
            </h1>
          ) : (
            icon && <div className="text-foreground">{icon}</div>
          )}
        </div>

        <button
          onClick={onAction}
          className="pointer-events-auto p-2 text-muted-foreground hover:text-foreground active:scale-95 transition-all"
        >
          <MoreHorizontal size={24} strokeWidth={2.5} />
          <span className="sr-only">More</span>
        </button>
      </header>

      {/* 2. AI 助手区域 (AI Avatar Area) - Removed icon from here as it's now in header. Kept for tabs only. Reduced padding. */}
      <div className="flex flex-col items-center justify-center shrink-0 z-10 pb-2 pt-14">
        {/* Icon moved to header */}

        {/* 3. 标签切换 (Tabs) - 仅当有标签时显示 */}
        {tabs.length > 0 && (
          <div className="flex items-center gap-6 mt-0">
            {tabs.map((tab, index) => {
              const isActive = activeTab === index
              return (
                <button
                  key={tab}
                  onClick={() => onTabChange?.(index)}
                  className={cn(
                    "text-sm font-medium transition-all duration-300 relative px-1 py-1",
                    isActive ? "text-foreground scale-105" : "text-muted-foreground hover:text-foreground/80",
                  )}
                >
                  {tab}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                    />
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* 4. 内容容器 (Content Container) */}
      <div className="flex-1 relative z-0 overflow-hidden">
        <GlassPanel
          intensity="high"
          className="h-full w-full rounded-t-2xl border-t border-white/60 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col"
        >
          {/* 内部滚动区域 */}
          <div className="flex-1 overflow-y-auto p-6 pb-24">{children}</div>
        </GlassPanel>
      </div>

      <ContentActionBar
        placeholder="与 AI 讨论这个洞察..."
        onSend={(message) => console.log("[v0] Send message:", message)}
        onVoiceInput={() => console.log("[v0] Voice input")}
        onAddAttachment={() => console.log("[v0] Add attachment")}
        likeCount={42}
        onLike={() => console.log("[v0] Like")}
        onBookmark={() => console.log("[v0] Bookmark")}
        onShare={() => console.log("[v0] Share")}
      />
    </div>
  )
}
