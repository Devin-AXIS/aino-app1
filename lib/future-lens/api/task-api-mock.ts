/**
 * 任务列表 Mock API
 * 模拟后端API接口，用于前端开发
 * 
 * 统一的数据结构和加载方式，与 reports 和 events 保持一致
 */

import type { CardInstance, ReportConfig, ReportWithCards } from "../types/card-types"
import taskListConfig from "@/data/tasks/task-list-config.json"
import task001 from "@/data/tasks/cards/task-001.json"
import task002 from "@/data/tasks/cards/task-002.json"
import task003 from "@/data/tasks/cards/task-003.json"

// 卡片数据映射
const taskCardsMap: Record<string, CardInstance> = {
  "task-001": { ...(task001 as CardInstance), dataSource: "api" },
  "task-002": { ...(task002 as CardInstance), dataSource: "api" },
  "task-003": { ...(task003 as CardInstance), dataSource: "api" },
}

/**
 * 获取任务列表配置
 */
export async function getTaskListConfig(): Promise<ReportConfig> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return taskListConfig as ReportConfig
}

/**
 * 获取任务列表及其所有卡片数据
 */
export async function getTaskListWithCards(): Promise<ReportWithCards> {
  const config = await getTaskListConfig()

  // 根据布局类型获取卡片ID列表
  let allCardIds: string[] = []

  if (config.layoutType === "single-page" && config.cardIds) {
    allCardIds = config.cardIds
  } else if (config.tabs && config.tabs.length > 0) {
    allCardIds = config.tabs.flatMap((tab) => tab.cardIds)
  }

  // 按顺序获取所有卡片
  const cards = allCardIds.map((cardId) => taskCardsMap[cardId]).filter(Boolean) as CardInstance[]

  return {
    ...config,
    cards,
  }
}

/**
 * 获取单个任务卡片数据
 */
export async function getTaskCard(cardId: string): Promise<CardInstance> {
  await new Promise((resolve) => setTimeout(resolve, 50))

  const card = taskCardsMap[cardId]
  if (!card) {
    throw new Error(`Task card not found: ${cardId}`)
  }

  return card
}

/**
 * 根据任务卡片获取关联的事件ID
 * 用于跳转到事件详情页
 */
export function getEventIdFromTask(card: CardInstance): string | null {
  return card.metadata?.eventId || null
}


