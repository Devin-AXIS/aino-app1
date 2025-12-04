/**
 * 事件详情页 Mock API
 * 模拟后端API接口，用于前端开发
 */

import type { CardInstance, ReportConfig, ReportWithCards } from "../types/card-types"
import eventConfig from "@/data/events/event-001/config.json"
import eventHeader001 from "@/data/events/event-001/cards/event-header-001.json"
import eventCoreInsight001 from "@/data/events/event-001/cards/event-core-insight-001.json"
import eventSignalMeter001 from "@/data/events/event-001/cards/event-signal-meter-001.json"
import eventMultiImpact001 from "@/data/events/event-001/cards/event-multi-impact-001.json"
import eventActionList001 from "@/data/events/event-001/cards/event-action-list-001.json"
import eventDecisionRecord001 from "@/data/events/event-001/cards/event-decision-record-001.json"
import eventTimeline001 from "@/data/events/event-001/cards/event-timeline-001.json"
import eventHistory001 from "@/data/events/event-001/cards/event-history-001.json"
import eventRelatedEntities001 from "@/data/events/event-001/cards/event-related-entities-001.json"

// 卡片数据映射
const eventCardsMap: Record<string, CardInstance> = {
  "event-header-001": { ...(eventHeader001 as CardInstance), dataSource: "api" },
  "event-core-insight-001": { ...(eventCoreInsight001 as CardInstance), dataSource: "ai-generated" },
  "event-signal-meter-001": { ...(eventSignalMeter001 as CardInstance), dataSource: "ai-generated" },
  "event-multi-impact-001": { ...(eventMultiImpact001 as CardInstance), dataSource: "ai-generated" },
  "event-action-list-001": { ...(eventActionList001 as CardInstance), dataSource: "ai-generated" },
  "event-decision-record-001": { ...(eventDecisionRecord001 as CardInstance), dataSource: "api" },
  "event-timeline-001": { ...(eventTimeline001 as CardInstance), dataSource: "api" },
  "event-history-001": { ...(eventHistory001 as CardInstance), dataSource: "ai-generated" },
  "event-related-entities-001": { ...(eventRelatedEntities001 as CardInstance), dataSource: "api" },
}

/**
 * 获取事件配置
 */
export async function getEventConfig(eventId: string): Promise<ReportConfig> {
  await new Promise((resolve) => setTimeout(resolve, 100))

  if (!eventId || eventId === "") {
    return eventConfig as ReportConfig
  }

  if (eventId === "event-001") {
    return eventConfig as ReportConfig
  }

  return eventConfig as ReportConfig
}

/**
 * 获取事件及其所有卡片数据
 */
export async function getEventWithCards(eventId: string): Promise<ReportWithCards> {
  const event = await getEventConfig(eventId)

  // 根据布局类型获取卡片ID列表
  let allCardIds: string[] = []

  if (event.layoutType === "single-page" && event.cardIds) {
    allCardIds = event.cardIds
  } else if (event.tabs && event.tabs.length > 0) {
    allCardIds = event.tabs.flatMap((tab) => tab.cardIds)
  }

  // 按顺序获取所有卡片
  const cards = allCardIds.map((cardId) => eventCardsMap[cardId]).filter(Boolean) as CardInstance[]

  return {
    ...event,
    cards,
  }
}

/**
 * 获取单个事件卡片数据
 */
export async function getEventCard(cardId: string): Promise<CardInstance> {
  await new Promise((resolve) => setTimeout(resolve, 50))

  const card = eventCardsMap[cardId]
  if (!card) {
    throw new Error(`Event card not found: ${cardId}`)
  }

  return card
}

