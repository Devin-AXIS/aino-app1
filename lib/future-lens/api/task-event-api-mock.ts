/**
 * 任务-事件系统 Mock API
 * 统一管理任务和事件的数据加载
 * 
 * 数据结构：
 * - tasks/task-XXX/ 包含任务配置、任务卡片、事件列表
 * - 每个事件属于某个任务
 * - 首页显示所有事件（跨任务）
 */

import type { CardInstance, ReportConfig, ReportWithCards } from "../types/card-types"
import task001Config from "@/data/tasks/task-001/config.json"
import event001Config from "@/data/tasks/task-001/events/event-001/config.json"
import eventsList001 from "@/data/tasks/task-001/events-list.json"

// 导入事件卡片
import eventHeader001 from "@/data/tasks/task-001/events/event-001/cards/event-header-001.json"
import eventQuickRead001 from "@/data/tasks/task-001/events/event-001/cards/event-quick-read-001.json"
import eventCoreInsight001 from "@/data/tasks/task-001/events/event-001/cards/event-core-insight-001.json"
import eventSignalMeter001 from "@/data/tasks/task-001/events/event-001/cards/event-signal-meter-001.json"
import eventComparison001 from "@/data/tasks/task-001/events/event-001/cards/event-comparison-001.json"
import eventMultiImpact001 from "@/data/tasks/task-001/events/event-001/cards/event-multi-impact-001.json"
import eventTimelinePrediction001 from "@/data/tasks/task-001/events/event-001/cards/event-timeline-prediction-001.json"
import eventActionList001 from "@/data/tasks/task-001/events/event-001/cards/event-action-list-001.json"
import eventDecisionSupport001 from "@/data/tasks/task-001/events/event-001/cards/event-decision-support-001.json"
import eventDecisionRecord001 from "@/data/tasks/task-001/events/event-001/cards/event-decision-record-001.json"
import eventTimeline001 from "@/data/tasks/task-001/events/event-001/cards/event-timeline-001.json"
import eventHistory001 from "@/data/tasks/task-001/events/event-001/cards/event-history-001.json"
import eventRelatedEntities001 from "@/data/tasks/task-001/events/event-001/cards/event-related-entities-001.json"

// 导入任务总结卡片
import taskMonitorScope001 from "@/data/tasks/task-001/summary-cards/task-monitor-scope-001.json"
import taskStatistics001 from "@/data/tasks/task-001/summary-cards/task-statistics-001.json"
import taskTrend001 from "@/data/tasks/task-001/summary-cards/task-trend-001.json"

// 事件卡片映射
const eventCardsMap: Record<string, CardInstance> = {
  "event-header-001": { ...(eventHeader001 as CardInstance), dataSource: "api" },
  "event-quick-read-001": { ...(eventQuickRead001 as CardInstance), dataSource: "ai-generated" },
  "event-core-insight-001": { ...(eventCoreInsight001 as CardInstance), dataSource: "ai-generated" },
  "event-signal-meter-001": { ...(eventSignalMeter001 as CardInstance), dataSource: "ai-generated" },
  "event-comparison-001": { ...(eventComparison001 as CardInstance), dataSource: "ai-generated" },
  "event-multi-impact-001": { ...(eventMultiImpact001 as CardInstance), dataSource: "ai-generated" },
  "event-timeline-prediction-001": { ...(eventTimelinePrediction001 as CardInstance), dataSource: "ai-generated" },
  "event-action-list-001": { ...(eventActionList001 as CardInstance), dataSource: "ai-generated" },
  "event-decision-support-001": { ...(eventDecisionSupport001 as CardInstance), dataSource: "ai-generated" },
  "event-decision-record-001": { ...(eventDecisionRecord001 as CardInstance), dataSource: "api" },
  "event-timeline-001": { ...(eventTimeline001 as CardInstance), dataSource: "api" },
  "event-history-001": { ...(eventHistory001 as CardInstance), dataSource: "ai-generated" },
  "event-related-entities-001": { ...(eventRelatedEntities001 as CardInstance), dataSource: "api" },
}

// 任务总结卡片映射
const taskSummaryCardsMap: Record<string, CardInstance> = {
  "task-monitor-scope-001": { ...(taskMonitorScope001 as CardInstance), dataSource: "api" },
  "task-statistics-001": { ...(taskStatistics001 as CardInstance), dataSource: "api" },
  "task-trend-001": { ...(taskTrend001 as CardInstance), dataSource: "ai-generated" },
}

/**
 * 获取任务配置
 */
export async function getTaskConfig(taskId: string): Promise<any> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  
  if (taskId === "task-001") {
    return task001Config
  }
  
  throw new Error(`Task not found: ${taskId}`)
}

/**
 * 获取事件配置（包含任务ID）
 */
export async function getEventConfig(eventId: string): Promise<ReportConfig> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  
  if (eventId === "event-001") {
    return event001Config as ReportConfig
  }
  
  throw new Error(`Event not found: ${eventId}`)
}

/**
 * 获取事件及其所有卡片数据（包含任务总结卡片）
 */
export async function getEventWithCards(eventId: string): Promise<ReportWithCards & { taskSummaryCards?: CardInstance[] }> {
  const eventConfig = await getEventConfig(eventId)
  
  // 获取事件卡片
  let allCardIds: string[] = []
  let taskSummaryCardIds: string[] = []
  
  if (eventConfig.layoutType === "single-page" && eventConfig.cardIds) {
    allCardIds = eventConfig.cardIds
  } else if (eventConfig.tabs && eventConfig.tabs.length > 0) {
    const currentTab = eventConfig.tabs[0] // 当前报告Tab
    allCardIds = currentTab.cardIds || []
    // 获取任务总结卡片ID（从tab配置中）
    taskSummaryCardIds = (currentTab as any).taskSummaryCardIds || []
  }
  
  // 按顺序获取所有事件卡片
  const eventCards = allCardIds.map((cardId) => eventCardsMap[cardId]).filter(Boolean) as CardInstance[]
  
  // 获取任务总结卡片
  const taskSummaryCards = taskSummaryCardIds
    .map((cardId) => taskSummaryCardsMap[cardId])
    .filter(Boolean) as CardInstance[]
  
  return {
    ...eventConfig,
    cards: eventCards,
    taskSummaryCards,
  }
}

/**
 * 获取任务的所有事件列表（用于历史事件Tab）
 */
export async function getTaskEventsList(taskId: string): Promise<any> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  
  if (taskId === "task-001") {
    return eventsList001
  }
  
  throw new Error(`Task not found: ${taskId}`)
}

/**
 * 获取所有事件（用于首页显示，跨任务）
 * 保持原有InsightCard格式：headline（事件标题）、subheadline（事件描述）、impact（AI建议）
 * 直接从已有卡片数据中提取，避免重复加载
 */
export async function getAllEvents(): Promise<CardInstance[]> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  
  // 从所有任务中收集事件，转换为首页卡片格式
  const eventsList = eventsList001 as any
  const allEvents: CardInstance[] = []
  
  for (const event of eventsList.events) {
    // 直接从已有卡片数据中提取信息（避免重复加载）
    let headline = event.name // 默认使用事件名称
    let subheadline = "" // 事件描述（发生了什么）
    let impact = "" // AI建议
    
    // 从核心结论卡中提取标题和副标题
    if (eventCoreInsight001 && event.id === "event-001") {
      const coreData = (eventCoreInsight001 as CardInstance).data
      if (coreData) {
        headline = coreData.title || headline
        subheadline = coreData.subtitle || subheadline
      }
    }
    
    // 从建议动作卡中提取AI建议（取第一条P1或P2建议）
    if (eventActionList001 && event.id === "event-001") {
      const actionData = (eventActionList001 as CardInstance).data
      if (actionData?.actions && actionData.actions.length > 0) {
        // 优先取P1，其次P2，最后取第一条
        const p1Action = actionData.actions.find((a: any) => a.priority === "P1")
        const p2Action = actionData.actions.find((a: any) => a.priority === "P2")
        const firstAction = actionData.actions[0]
        impact = (p1Action || p2Action || firstAction)?.text || ""
      }
    }
    
    // 如果没有建议动作，尝试从30秒速读卡中获取
    if (!impact && eventQuickRead001 && event.id === "event-001") {
      const quickData = (eventQuickRead001 as CardInstance).data
      if (quickData?.quickAdvice) {
        impact = quickData.quickAdvice
      }
    }
    
    // 如果没有从卡片中获取到subheadline，使用默认描述
    if (!subheadline) {
      subheadline = `竞品动态：${event.name}，需要关注其对市场的影响。`
    }
    
    // 如果没有从卡片中获取到impact，使用默认建议
    if (!impact) {
      impact = `建议：密切关注${event.name}的后续发展，评估对业务的影响并制定应对策略。`
    }
    
    // 确保标题不超过15个汉字
    const truncateHeadline = (text: string, maxLength: number = 15): string => {
      if (text.length <= maxLength) return text
      return text.slice(0, maxLength) + "..."
    }
    
    // 创建事件卡片（用于首页显示，保持原有InsightCard格式）
    const eventCard: CardInstance = {
      id: `event-card-${event.id}`,
      templateId: "event",
      componentName: "InsightCard",
      data: {
        id: event.id,
        type: event.urgency === "high" ? "risk" : event.urgency === "medium" ? "trend" : "general",
        timeStr: new Date(event.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        headline: truncateHeadline(headline),
        subheadline: subheadline,
        impact: impact,
        isUnread: event.status === "current",
      },
      metadata: {
        category: "event",
        tags: [eventsList.taskName],
        createdAt: event.createdAt,
        eventId: event.id,
        taskId: eventsList.taskId,
      },
    }
    allEvents.push(eventCard)
  }
  
  // 按时间倒序排列
  return allEvents.sort((a, b) => 
    new Date(b.metadata.createdAt).getTime() - new Date(a.metadata.createdAt).getTime()
  )
}

/**
 * 根据事件ID获取关联的任务ID
 */
export function getTaskIdFromEvent(eventId: string): string | null {
  // 从事件配置中获取taskId
  if (eventId === "event-001") {
    return "task-001"
  }
  return null
}

