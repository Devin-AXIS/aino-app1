/**
 * 卡片渲染器（统一使用 CardFactory）
 * 根据卡片数据动态渲染对应的卡片组件
 * 
 * @note 现在统一使用 CardFactory 管理所有卡片，保持架构清晰和轻量化
 */

"use client"

import type { CardInstance } from "@/lib/future-lens/types/card-types"
import { CardFactory } from "@/components/future-lens/cards/card-factory"

interface CardRendererProps {
  /** 卡片实例数据 */
  card: CardInstance
  /** 点击回调 */
  onClick?: () => void
}

/**
 * 卡片渲染器组件
 * 统一使用 CardFactory 渲染，支持所有卡片类型
 * 
 * @example
 * ```tsx
 * <CardRenderer card={cardInstance} />
 * ```
 */
export function CardRenderer({ card, onClick }: CardRendererProps) {
  // 统一使用 CardFactory，通过 componentName 自动查找并渲染
  return <CardFactory data={card} onClick={onClick} />
}

