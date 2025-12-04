"use client"

import type React from "react"
import { Share2, Heart } from "lucide-react"
import { ScrollHeader } from "@/components/future-lens/layout/scroll-header"
import { GlassPanel } from "@/components/future-lens/ds/glass-panel"
import { DesignTokens } from "@/lib/future-lens/design-tokens"
import { useAppConfig } from "@/lib/future-lens/config-context"

/**
 * ArticleShell - 文章/内容详情页布局
 *
 * 使用场景：
 * - Insight 详情页
 * - 文章内容页
 * - 任何需要展示内容并带有分享、点赞功能的页面
 *
 * 功能特点：
 * 1. 统一的顶部栏（带返回、标题、分享、点赞按钮）
 * 2. 统一的背景（自动支持深色模式）
 * 3. 统一的内容容器（GlassPanel）
 * 4. 自动支持字体缩放
 * 5. 自动处理安全区域
 *
 * 必须遵循的规范：
 * - 背景使用 DesignTokens.background.page
 * - 容器使用 GlassPanel
 * - 所有颜色使用语义化 token（支持深色模式）
 * - 字体大小支持缩放（使用 fSize）
 */

interface ArticleShellProps {
  /** 页面标题（显示在顶部栏） */
  title: string
  /** 返回按钮点击回调 */
  onBack?: () => void
  /** 分享按钮点击回调 */
  onShare?: () => void
  /** 点赞按钮点击回调 */
  onLike?: () => void
  /** 是否显示分享按钮（默认true） */
  showShare?: boolean
  /** 是否显示点赞按钮（默认true） */
  showLike?: boolean
  /** 是否已点赞 */
  isLiked?: boolean
  /** 内容区域 */
  children: React.ReactNode
  /** 内容区域额外样式 */
  contentClassName?: string
  /** 滚动容器ID（用于ScrollHeader） */
  scrollContainerId?: string
}

export function ArticleShell({
  title,
  onBack,
  onShare,
  onLike,
  showShare = true,
  showLike = true,
  isLiked = false,
  children,
  contentClassName = "",
  scrollContainerId = "article-scroll-container",
}: ArticleShellProps) {
  const { textScale } = useAppConfig()
  const fSize = (base: number) => `${base * textScale}px`

  return (
    <div className={DesignTokens.background.page}>
      {/* 顶部栏 - 使用现有的 ScrollHeader 组件 */}
      <ScrollHeader
        title={title}
        onBack={onBack}
        scrollContainerId={scrollContainerId}
        actions={
          <div className="flex items-center gap-2">
            {/* 分享按钮 */}
            {showShare && onShare && (
              <button
                onClick={onShare}
                className="p-2 rounded-full text-foreground/80 hover:bg-accent active:scale-95 transition-all"
                aria-label="分享"
              >
                <Share2 size={20} />
              </button>
            )}

            {/* 点赞按钮 */}
            {showLike && onLike && (
              <button
                onClick={onLike}
                className={`p-2 rounded-full transition-all active:scale-95 ${
                  isLiked ? "text-destructive bg-destructive/10" : "text-foreground/80 hover:bg-accent"
                }`}
                aria-label={isLiked ? "取消点赞" : "点赞"}
              >
                <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
              </button>
            )}
          </div>
        }
      />

      {/* 内容区域 */}
      <div
        id={scrollContainerId}
        className="h-screen overflow-y-auto"
        style={{
          paddingTop: DesignTokens.mobile.safeTop,
          paddingBottom: DesignTokens.mobile.safeBottom,
        }}
      >
        <div className="p-4 space-y-4">
          <GlassPanel intensity="subtle" className={contentClassName}>
            <div className="p-6" style={{ fontSize: fSize(15) }}>
              {children}
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  )
}
