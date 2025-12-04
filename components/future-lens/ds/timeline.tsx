"use client"

import { useAppConfig } from "@/lib/future-lens/config-context"
import { DesignTokens } from "@/lib/future-lens/design-tokens"
import { cn } from "@/lib/utils"

export interface TimelineEvent {
  /** 日期 */
  date: string
  /** 类别/标签 */
  category?: string
  /** 描述/标题 */
  description: string
  /** 是否高亮显示 */
  highlighted?: boolean
}

export interface TimelineProps {
  /** 时间线事件列表 */
  events: TimelineEvent[]
  /** 自定义类名 */
  className?: string
}

/**
 * 时间线组件 - 垂直时间线
 * 用于展示时间序列的事件、里程碑等
 * 
 * @example
 * ```tsx
 * <Timeline
 *   events={[
 *     { date: "2024.10", category: "硬件突破", description: "Figure 02 发布" },
 *     { date: "2025.01", category: "控制突破", description: "OpenAI RT-X 模型", highlighted: true },
 *   ]}
 * />
 * ```
 */
export function Timeline({ events, className }: TimelineProps) {
  const { textScale } = useAppConfig()
  const fSize = (base: number) => base * textScale

  return (
    <div className={cn("relative pl-3.5 space-y-5", className)}>
      {/* 垂直时间线 */}
      <div className="absolute left-[4px] top-2 bottom-2 w-[2px] bg-border" />

      {events.map((event, index) => (
        <div key={index} className="relative">
          {/* 时间线节点 */}
          <div
            className={cn(
              "absolute -left-[14px] top-1.5 w-2 h-2 rounded-full border-2 border-card shadow-sm",
              event.highlighted
                ? "bg-primary scale-125"
                : "bg-muted-foreground/30"
            )}
          />

          {/* 事件内容 */}
          <div className="flex justify-between items-start">
            <div>
              {/* 日期和类别 */}
              {(event.date || event.category) && (
                <div
                  className={cn(
                    DesignTokens.typography.caption,
                    "mb-0.5"
                  )}
                  style={{ fontSize: `${fSize(9)}px` }}
                >
                  {event.date && event.category
                    ? `${event.date} · ${event.category}`
                    : event.date || event.category}
                </div>
              )}

              {/* 描述 */}
              <div
                className={cn(
                  DesignTokens.typography.title,
                  event.highlighted ? "text-primary" : ""
                )}
                style={{ fontSize: `${fSize(13)}px` }}
              >
                {event.description}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

