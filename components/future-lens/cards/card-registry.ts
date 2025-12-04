/**
 * 卡片注册系统
 * 支持动态注册卡片组件，类似图表注册系统
 * 
 * @example
 * ```tsx
 * import { registerCard } from '@/components/future-lens/cards/card-registry'
 * import { MyCustomCard } from './my-custom-card'
 * 
 * // 注册新卡片类型
 * registerCard('custom', MyCustomCard)
 * ```
 */

import type React from "react"
import type { InsightData } from "@/lib/future-lens/types"

export type CardComponent = React.ComponentType<{ data: InsightData | any; onClick?: () => void }>

export type CardRegistry = Record<string, CardComponent>

// 卡片注册表（可动态扩展）
// 支持两种注册方式：
// 1. 通过 type（如 'trend', 'discover'）注册 - 用于 InsightData
// 2. 通过 componentName（如 'IndustryStackCard'）注册 - 用于 CardInstance
const cardRegistry: CardRegistry = {}

/**
 * 注册卡片组件
 * @param type - 卡片类型（如 'trend', 'risk', 'discover'）
 * @param component - 卡片组件
 * 
 * @example
 * ```tsx
 * registerCard('discover', DiscoverCard)
 * ```
 */
export function registerCard(type: string, component: CardComponent): void {
  cardRegistry[type] = component
}

/**
 * 获取卡片组件
 * @param type - 卡片类型
 * @returns 卡片组件，如果未找到则返回 null
 */
export function getCardComponent(type: string): CardComponent | null {
  return cardRegistry[type] || null
}

/**
 * 获取所有已注册的卡片类型
 * @returns 卡片类型数组
 */
export function getRegisteredCardTypes(): string[] {
  return Object.keys(cardRegistry)
}

/**
 * 检查卡片类型是否已注册
 * @param type - 卡片类型
 * @returns 是否已注册
 */
export function isCardRegistered(type: string): boolean {
  return type in cardRegistry
}

/**
 * 导出注册表（只读）
 */
export function getCardRegistry(): Readonly<CardRegistry> {
  return { ...cardRegistry }
}

