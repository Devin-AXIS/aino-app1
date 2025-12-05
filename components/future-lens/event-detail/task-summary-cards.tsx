"use client"

import type React from "react"
import { CardBase } from "@/components/future-lens/ds/card-base"
import { useAppConfig } from "@/lib/future-lens/config-context"
import { DesignTokens } from "@/lib/future-lens/design-tokens"
import { Target, BarChart3, TrendingUp, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const fSize = (base: number, textScale: number) => base * textScale

/**
 * 1. 任务监控范围卡
 */
export function TaskMonitorScopeCard({ data }: { data: any }) {
  const { textScale } = useAppConfig()
  const { title, targets, keywords, channels } = data

  return (
    <CardBase className="mb-3">
      <div className="flex items-center gap-2 mb-3">
        <Target size={16} className="text-primary" />
        <h3
          className={cn(DesignTokens.typography.title)}
          style={{ fontSize: `${fSize(14, textScale)}px` }}
        >
          {title || "监控范围"}
        </h3>
      </div>

      <div className="space-y-3">
        {/* 监控目标 */}
        {targets && targets.length > 0 && (
          <div>
            <div className="text-xs font-medium text-muted-foreground mb-1.5">监控目标</div>
            <div className="flex flex-wrap gap-1.5">
              {targets.map((target: any, idx: number) => (
                <span
                  key={idx}
                  className="px-2 py-1 rounded-lg bg-primary/10 text-primary text-xs border border-primary/20"
                >
                  {target.name}
                  {target.type && <span className="text-muted-foreground/60 ml-1">({target.type})</span>}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 关键词 */}
        {keywords && keywords.length > 0 && (
          <div>
            <div className="text-xs font-medium text-muted-foreground mb-1.5">监控关键词</div>
            <div className="flex flex-wrap gap-1.5">
              {keywords.map((keyword: string, idx: number) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-muted/50 text-muted-foreground text-xs"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 监控渠道 */}
        {channels && channels.length > 0 && (
          <div>
            <div className="text-xs font-medium text-muted-foreground mb-1.5">监控渠道</div>
            <div className="flex flex-wrap gap-1.5">
              {channels.map((channel: string, idx: number) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-muted/30 text-muted-foreground text-xs"
                >
                  {channel}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </CardBase>
  )
}

/**
 * 2. 任务统计卡
 */
export function TaskStatisticsCard({ data }: { data: any }) {
  const { textScale } = useAppConfig()
  const { title, status, statusColor, statistics, eventBreakdown } = data

  const statusConfig = {
    "有变化": { icon: AlertCircle, color: "text-success", bg: "bg-success/10", border: "border-success/20" },
    "没变化": { icon: CheckCircle2, color: "text-muted-foreground", bg: "bg-muted/30", border: "border-border" },
  }

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig["没变化"]

  return (
    <CardBase className="mb-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <BarChart3 size={16} className="text-primary" />
          <h3
            className={cn(DesignTokens.typography.title)}
            style={{ fontSize: `${fSize(14, textScale)}px` }}
          >
            {title || "任务统计"}
          </h3>
        </div>
        <div className={cn("flex items-center gap-1.5 px-2 py-1 rounded-lg border", config.bg, config.border)}>
          <config.icon size={12} className={config.color} />
          <span className={cn("text-xs font-medium", config.color)}>{status}</span>
        </div>
      </div>

      <div className="space-y-3">
        {/* 统计数据 */}
        {statistics && (
          <div className="grid grid-cols-2 gap-3">
            <div className="p-2.5 rounded-lg bg-muted/30 border border-border/50">
              <div className="text-xs text-muted-foreground/60 mb-0.5">总事件数</div>
              <div className="text-lg font-bold text-foreground">{statistics.totalEvents}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-muted/30 border border-border/50">
              <div className="text-xs text-muted-foreground/60 mb-0.5">本周</div>
              <div className="text-lg font-bold text-foreground">{statistics.thisWeek}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-muted/30 border border-border/50">
              <div className="text-xs text-muted-foreground/60 mb-0.5">本月</div>
              <div className="text-lg font-bold text-foreground">{statistics.thisMonth}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-muted/30 border border-border/50">
              <div className="text-xs text-muted-foreground/60 mb-0.5">最近更新</div>
              <div className="text-sm font-medium text-foreground">{statistics.lastUpdate}</div>
            </div>
          </div>
        )}

        {/* 事件分级统计 */}
        {eventBreakdown && (
          <div>
            <div className="text-xs font-medium text-muted-foreground mb-1.5">事件分级</div>
            <div className="flex gap-2">
              <div className="flex-1 p-2 rounded-lg bg-destructive/10 border border-destructive/20">
                <div className="text-xs text-destructive/60 mb-0.5">高</div>
                <div className="text-sm font-bold text-destructive">{eventBreakdown.high}</div>
              </div>
              <div className="flex-1 p-2 rounded-lg bg-warning/10 border border-warning/20">
                <div className="text-xs text-warning/60 mb-0.5">中</div>
                <div className="text-sm font-bold text-warning">{eventBreakdown.medium}</div>
              </div>
              <div className="flex-1 p-2 rounded-lg bg-muted/50 border border-border">
                <div className="text-xs text-muted-foreground/60 mb-0.5">低</div>
                <div className="text-sm font-bold text-muted-foreground">{eventBreakdown.low}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </CardBase>
  )
}

/**
 * 3. 任务趋势卡
 */
export function TaskTrendCard({ data }: { data: any }) {
  const { textScale } = useAppConfig()
  const { title, period, summary, insights, recommendation } = data

  return (
    <CardBase className="mb-3">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp size={16} className="text-primary" />
        <h3
          className={cn(DesignTokens.typography.title)}
          style={{ fontSize: `${fSize(14, textScale)}px` }}
        >
          {title || "任务趋势"}
        </h3>
        {period && (
          <span className="text-xs text-muted-foreground/60 ml-auto">{period}</span>
        )}
      </div>

      <div className="space-y-3">
        {/* 趋势总结 */}
        {summary && (
          <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
            <p
              className="text-muted-foreground/80 leading-relaxed"
              style={{ fontSize: `${fSize(12, textScale)}px` }}
            >
              {summary}
            </p>
          </div>
        )}

        {/* 关键洞察 */}
        {insights && insights.length > 0 && (
          <div>
            <div className="text-xs font-medium text-muted-foreground mb-1.5">关键洞察</div>
            <div className="space-y-1.5">
              {insights.map((insight: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <p
                    className="text-muted-foreground/80 flex-1"
                    style={{ fontSize: `${fSize(12, textScale)}px` }}
                  >
                    {insight}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 建议 */}
        {recommendation && (
          <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/20">
            <div className="text-xs font-medium text-primary mb-1">建议</div>
            <p
              className="text-primary/80"
              style={{ fontSize: `${fSize(12, textScale)}px` }}
            >
              {recommendation}
            </p>
          </div>
        )}
      </div>
    </CardBase>
  )
}


