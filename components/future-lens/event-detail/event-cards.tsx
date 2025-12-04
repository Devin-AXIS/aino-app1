"use client"

import type React from "react"
import { CardBase } from "@/components/future-lens/ds/card-base"
import { GlassPanel } from "@/components/future-lens/ds/glass-panel"
import { useAppConfig } from "@/lib/future-lens/config-context"
import { DesignTokens } from "@/lib/future-lens/design-tokens"
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Target,
  Clock,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Network,
  Building2,
  Package,
  Lightbulb,
  Activity,
  Calendar,
  Users,
} from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const fSize = (base: number, textScale: number) => base * textScale

/**
 * 1. 事件抬头区卡片
 */
export function EventHeaderCard({ data }: { data: any }) {
  const { textScale } = useAppConfig()
  const { taskSource, eventTime, importance } = data

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between gap-3">
        {/* 左侧：任务来源标签 */}
        <div className="flex-1">
          <GlassPanel intensity="subtle" className="px-3 py-1.5 inline-block">
            <span className="text-xs font-medium text-muted-foreground">{taskSource}</span>
          </GlassPanel>
          <div className="mt-1.5 text-[10px] text-muted-foreground/60">{eventTime}</div>
        </div>

        {/* 右侧：重要程度 */}
        <div className="flex items-center gap-1.5">
          <div
            className={cn(
              "w-1.5 h-1.5 rounded-full",
              importance === "非常重要" ? "bg-destructive" : importance === "重要" ? "bg-warning" : "bg-muted-foreground/40"
            )}
          />
          <span className="text-[10px] text-muted-foreground/60">{importance}</span>
        </div>
      </div>
    </div>
  )
}

/**
 * 2. 核心结论卡
 */
export function EventCoreInsightCard({ data }: { data: any }) {
  const { textScale } = useAppConfig()
  const { tags, title, subtitle, content } = data

  return (
    <CardBase className="mb-3 relative overflow-hidden">
      {/* 渐变光晕背景 */}
      <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-30 pointer-events-none"
        style={{ backgroundColor: "rgba(59, 130, 246, 0.15)" }}
      />

      <div className="relative z-10">
        {/* 事件类型标签 */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {tags?.map((tag: string, idx: number) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 主标题 */}
        <h2
          className={cn(DesignTokens.typography.title, "mb-2 font-bold leading-tight")}
          style={{ fontSize: `${fSize(16, textScale)}px` }}
        >
          {title}
        </h2>

        {/* 副标题 */}
        <p
          className="text-muted-foreground mb-3 leading-relaxed"
          style={{ fontSize: `${fSize(13, textScale)}px` }}
        >
          {subtitle}
        </p>

        {/* 正文 */}
        <div
          className="text-muted-foreground/80 leading-relaxed space-y-2"
          style={{ fontSize: `${fSize(12, textScale)}px` }}
        >
          {content?.map((para: string, idx: number) => (
            <p key={idx}>{para}</p>
          ))}
        </div>

        {/* AI 分析完成图标 */}
        <div className="mt-4 flex items-center justify-end gap-1.5">
          <Sparkles size={14} className="text-primary" />
          <span className="text-[10px] text-muted-foreground/60">AI 分析完成</span>
        </div>
      </div>
    </CardBase>
  )
}

/**
 * 3. 信号仪表条
 */
export function EventSignalMeterCard({ data }: { data: any }) {
  const { textScale } = useAppConfig()
  const { opportunityScore, riskScore, timeWindow } = data

  // 计算净倾向位置（0-100，50为中性）
  const netPosition = opportunityScore - riskScore + 50

  return (
    <CardBase className="mb-3">
      <div className="space-y-3">
        {/* 机会-风险仪表条 */}
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-muted-foreground/60">风险</span>
            <span className="text-[10px] text-muted-foreground/60">机会</span>
          </div>
          <div className="relative h-1.5 bg-muted/50 rounded-full overflow-hidden">
            {/* 风险区域（左侧红色渐变） */}
            <div className="absolute left-0 top-0 h-full w-1/2 bg-gradient-to-r from-destructive/20 to-transparent" />
            {/* 机会区域（右侧绿色渐变） */}
            <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-success/20 to-transparent" />
            {/* 当前位置指示器 */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-foreground border-2 border-background shadow-sm"
              style={{ left: `${netPosition}%`, transform: "translate(-50%, -50%)" }}
            />
          </div>
        </div>

        {/* 三项指标 */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-xs font-semibold text-foreground mb-0.5">
              机会强度：{opportunityScore}/100
            </div>
            <div className="flex items-center justify-center gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    i <= Math.round(opportunityScore / 20)
                      ? "bg-success"
                      : "bg-muted-foreground/20"
                  )}
                />
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-foreground mb-0.5">
              风险强度：{riskScore}/100
            </div>
            <div className="flex items-center justify-center gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    i <= Math.round(riskScore / 20)
                      ? "bg-destructive"
                      : "bg-muted-foreground/20"
                  )}
                />
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-foreground mb-0.5">时间尺度</div>
            <div className="text-[10px] text-muted-foreground/60">{timeWindow}</div>
          </div>
        </div>
      </div>
    </CardBase>
  )
}

/**
 * 4. 多维影响区
 */
export function EventMultiImpactCard({ data }: { data: any }) {
  const { textScale } = useAppConfig()
  const { dimensions, currentDimension, impactData } = data
  const [activeDimension, setActiveDimension] = useState(currentDimension || dimensions?.[0]?.id)

  const activeDim = dimensions?.find((d: any) => d.id === activeDimension)
  const activeImpact = impactData?.[activeDimension]

  return (
    <CardBase className="mb-3">
      {/* 维度标签 */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto scrollbar-hide pb-2">
        {dimensions?.map((dim: any) => {
          const isActive = activeDimension === dim.id
          return (
            <button
              key={dim.id}
              onClick={() => setActiveDimension(dim.id)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              )}
            >
              {dim.label}
            </button>
          )
        })}
      </div>

      {/* 影响图形（小雷达图） */}
      {activeImpact?.chartData && (
        <div className="mb-4 h-32 flex items-center justify-center bg-muted/20 rounded-xl">
          <div className="text-xs text-muted-foreground/60">雷达图占位</div>
        </div>
      )}

      {/* 文本说明 */}
      <div>
        <h4
          className={cn(DesignTokens.typography.title, "mb-2")}
          style={{ fontSize: `${fSize(13, textScale)}px` }}
        >
          在【{activeDim?.label}】上的影响
        </h4>
        <div
          className="text-muted-foreground/80 leading-relaxed space-y-2 mb-3"
          style={{ fontSize: `${fSize(12, textScale)}px` }}
        >
          {activeImpact?.analysis?.map((para: string, idx: number) => (
            <p key={idx}>{para}</p>
          ))}
        </div>

        {/* 局部建议 */}
        {activeImpact?.suggestions && activeImpact.suggestions.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border/50">
            <ul className="space-y-1.5">
              {activeImpact.suggestions.map((suggestion: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span
                    className="text-muted-foreground/70 flex-1"
                    style={{ fontSize: `${fSize(11, textScale)}px` }}
                  >
                    {suggestion}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </CardBase>
  )
}

/**
 * 5. 建议动作区
 */
export function EventActionListCard({ data }: { data: any }) {
  const { textScale } = useAppConfig()
  const { actions } = data

  return (
    <CardBase className="mb-3">
      <div className="flex items-center gap-2 mb-4">
        <Target size={16} className="text-primary" />
        <h3
          className={cn(DesignTokens.typography.title)}
          style={{ fontSize: `${fSize(14, textScale)}px` }}
        >
          AI 建议动作
        </h3>
      </div>

      <div className="space-y-3">
        {actions?.map((action: any, idx: number) => (
          <div
            key={idx}
            className="p-3 rounded-xl bg-muted/30 border border-border/50"
          >
            <div className="flex items-start gap-2">
              <span
                className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-bold flex-shrink-0",
                  action.priority === "P1"
                    ? "bg-destructive/20 text-destructive"
                    : action.priority === "P2"
                    ? "bg-warning/20 text-warning"
                    : "bg-muted-foreground/20 text-muted-foreground"
                )}
              >
                {action.priority}
              </span>
              <p
                className="text-muted-foreground/80 leading-relaxed flex-1"
                style={{ fontSize: `${fSize(12, textScale)}px` }}
              >
                {action.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </CardBase>
  )
}

/**
 * 6. 决策记录区
 */
export function EventDecisionRecordCard({ data }: { data: any }) {
  const { textScale } = useAppConfig()
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <CardBase className="mb-3">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between"
      >
        <h3
          className={cn(DesignTokens.typography.title)}
          style={{ fontSize: `${fSize(14, textScale)}px` }}
        >
          本次决策记录
        </h3>
        {isExpanded ? (
          <ChevronUp size={18} className="text-muted-foreground" />
        ) : (
          <ChevronDown size={18} className="text-muted-foreground" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-border/50 space-y-3">
              <div>
                <label className="text-[10px] text-muted-foreground/60 mb-1 block">决策结论</label>
                <div className="px-3 py-2 rounded-lg bg-muted/30 text-sm text-muted-foreground">
                  暂不动作
                </div>
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground/60 mb-1 block">责任人</label>
                <div className="px-3 py-2 rounded-lg bg-muted/30 text-sm text-muted-foreground">
                  张三
                </div>
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground/60 mb-1 block">目标时间</label>
                <div className="px-3 py-2 rounded-lg bg-muted/30 text-sm text-muted-foreground">
                  2025-12-10
                </div>
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground/60 mb-1 block">备注</label>
                <div className="px-3 py-2 rounded-lg bg-muted/30 text-sm text-muted-foreground/60">
                  需要进一步观察市场反应
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </CardBase>
  )
}

/**
 * 7. 事件脉络区
 */
export function EventTimelineCard({ data }: { data: any }) {
  const { textScale } = useAppConfig()
  const { timeline, sparkline } = data

  return (
    <CardBase className="mb-3">
      <div className="flex items-center justify-between mb-4">
        <h3
          className={cn(DesignTokens.typography.title)}
          style={{ fontSize: `${fSize(14, textScale)}px` }}
        >
          事件脉络 / 发生过程
        </h3>
        {sparkline && (
          <div className="flex items-center gap-2">
            <div className="w-16 h-8 bg-muted/30 rounded flex items-center justify-center">
              <Activity size={12} className="text-primary" />
            </div>
            <span className="text-[10px] text-muted-foreground/60">{sparkline.label}</span>
          </div>
        )}
      </div>

      {/* 时间线 */}
      <div className="relative pl-4 border-l border-border/50">
        {timeline?.map((item: any, idx: number) => (
          <div key={idx} className="mb-4 relative">
            {/* 时间线节点 */}
            <div className="absolute -left-[9px] top-0 w-2 h-2 rounded-full bg-primary border-2 border-background" />
            
            <div className="ml-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] text-muted-foreground/60">{item.time}</span>
                <span className="px-1.5 py-0.5 rounded bg-muted/50 text-[9px] text-muted-foreground">
                  {item.type}
                </span>
              </div>
              <p
                className="text-foreground font-medium mb-1"
                style={{ fontSize: `${fSize(12, textScale)}px` }}
              >
                {item.fact}
              </p>
              <p
                className="text-muted-foreground/70"
                style={{ fontSize: `${fSize(11, textScale)}px` }}
              >
                {item.meaning}
              </p>
            </div>
          </div>
        ))}
      </div>
    </CardBase>
  )
}

/**
 * 8. 类似历史事件区
 */
export function EventHistoryCard({ data }: { data: any }) {
  const { textScale } = useAppConfig()
  const { similarEvents } = data

  if (!similarEvents || similarEvents.length === 0) {
    return null
  }

  return (
    <CardBase className="mb-3">
      <h3
        className={cn(DesignTokens.typography.title, "mb-4")}
        style={{ fontSize: `${fSize(14, textScale)}px` }}
      >
        类似先例 / 参考案例
      </h3>

      <div className="space-y-3">
        {similarEvents.map((event: any, idx: number) => (
          <div
            key={idx}
            className="p-3 rounded-xl bg-muted/20 border border-border/30"
          >
            <div className="flex items-center justify-between mb-2">
              <h4
                className={cn(DesignTokens.typography.title)}
                style={{ fontSize: `${fSize(12, textScale)}px` }}
              >
                {event.title}
              </h4>
              <span className="text-[10px] text-muted-foreground/60">{event.time}</span>
            </div>
            <p
              className="text-muted-foreground/70 mb-2"
              style={{ fontSize: `${fSize(11, textScale)}px` }}
            >
              {event.description}
            </p>
            <div className="space-y-1">
              <div className="text-[10px] text-muted-foreground/60">
                <span className="font-medium">相同：</span>
                {event.similarities}
              </div>
              <div className="text-[10px] text-muted-foreground/60">
                <span className="font-medium">不同：</span>
                {event.differences}
              </div>
            </div>
          </div>
        ))}
      </div>
    </CardBase>
  )
}

/**
 * 9. 相关产业/企业/产品卡片
 */
export function EventRelatedEntitiesCard({ data }: { data: any }) {
  const { textScale } = useAppConfig()
  const { networkGraph, entities } = data

  return (
    <CardBase className="mb-3">
      <h3
        className={cn(DesignTokens.typography.title, "mb-4")}
        style={{ fontSize: `${fSize(14, textScale)}px` }}
      >
        相关产业 / 企业 / 产品
      </h3>

      {/* 小网络图 */}
      {networkGraph && (
        <div className="mb-4 h-32 bg-muted/20 rounded-xl flex items-center justify-center">
          <div className="text-xs text-muted-foreground/60">网络图占位</div>
        </div>
      )}

      {/* 实体卡片 */}
      <div className="grid grid-cols-2 gap-3">
        {entities?.map((entity: any, idx: number) => (
          <div
            key={idx}
            className="p-3 rounded-xl bg-muted/20 border border-border/30"
          >
            <div className="flex items-center gap-1.5 mb-2">
              {entity.type === "产业" && <Building2 size={12} className="text-primary" />}
              {entity.type === "企业" && <Users size={12} className="text-primary" />}
              {entity.type === "产品" && <Package size={12} className="text-primary" />}
              <span className="text-[9px] text-muted-foreground/60">{entity.type}</span>
            </div>
            <h4
              className={cn(DesignTokens.typography.title, "mb-1")}
              style={{ fontSize: `${fSize(12, textScale)}px` }}
            >
              {entity.name}
            </h4>
            <p
              className="text-muted-foreground/70 line-clamp-2"
              style={{ fontSize: `${fSize(10, textScale)}px` }}
            >
              {entity.role}
            </p>
          </div>
        ))}
      </div>
    </CardBase>
  )
}

