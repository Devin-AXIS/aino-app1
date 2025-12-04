/**
 * 详情内容渲染器
 * 
 * @note 详情内容由后端 API 动态提供，不存储在前端
 * - Markdown 内容：AI 定时生成
 * - 图表数据：通过 API 获取
 * - 列表数据：通过 API 获取
 * 
 * 前端只负责：
 * 1. 定义类型（DetailContent, ContentBlock）
 * 2. 渲染组件（DetailContentRenderer）
 * 3. 调用 API 获取内容
 */

"use client"

import React, { Suspense, lazy } from "react"
import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import remarkGfm from "remark-gfm"
import type { ContentBlock, DetailContent } from "@/lib/future-lens/types/detail-content-types"
import { CardBase } from "@/components/future-lens/ds/card-base"
import { PlayerList } from "@/components/future-lens/ds/player-list"
import { DesignTokens } from "@/lib/future-lens/design-tokens"
import { useAppConfig } from "@/lib/future-lens/config-context"
import { sanitizeHTML } from "@/lib/future-lens/utils/html-sanitizer"

// 图表组件懒加载映射
const chartComponents: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {
  StatusGridChart: lazy(() =>
    import("@/components/future-lens/charts/status-grid-chart").then((m) => ({ default: m.StatusGridChart })),
  ),
  RadarChart: lazy(() => import("@/components/future-lens/charts/radar-chart").then((m) => ({ default: m.RadarChart }))),
  HorizontalBarChart: lazy(() =>
    import("@/components/future-lens/charts/horizontal-bar-chart").then((m) => ({ default: m.HorizontalBarChart })),
  ),
  MultiLineChart: lazy(() =>
    import("@/components/future-lens/charts/multi-line-chart").then((m) => ({ default: m.MultiLineChart })),
  ),
  AreaChart: lazy(() => import("@/components/future-lens/charts/area-chart").then((m) => ({ default: m.AreaChart }))),
  BarChart: lazy(() => import("@/components/future-lens/charts/bar-chart").then((m) => ({ default: m.BarChart }))),
  PieChart: lazy(() => import("@/components/future-lens/charts/pie-chart").then((m) => ({ default: m.PieChart }))),
  DonutChart: lazy(() => import("@/components/future-lens/charts/donut-chart").then((m) => ({ default: m.DonutChart }))),
  TrendChart: lazy(() => import("@/components/future-lens/charts/trend-chart").then((m) => ({ default: m.TrendChart }))),
  WaterfallChart: lazy(() =>
    import("@/components/future-lens/charts/waterfall-chart").then((m) => ({ default: m.WaterfallChart })),
  ),
  StackedBarChart: lazy(() =>
    import("@/components/future-lens/charts/stacked-bar-chart").then((m) => ({ default: m.StackedBarChart })),
  ),
  ScatterChart: lazy(() =>
    import("@/components/future-lens/charts/scatter-chart").then((m) => ({ default: m.ScatterChart })),
  ),
  FunnelChart: lazy(() => import("@/components/future-lens/charts/funnel-chart").then((m) => ({ default: m.FunnelChart }))),
  CombinationChart: lazy(() =>
    import("@/components/future-lens/charts/combination-chart").then((m) => ({ default: m.CombinationChart })),
  ),
  MatrixChart: lazy(() => import("@/components/future-lens/charts/matrix-chart").then((m) => ({ default: m.MatrixChart }))),
  ValuationChart: lazy(() =>
    import("@/components/future-lens/charts/valuation-chart").then((m) => ({ default: m.ValuationChart })),
  ),
  SensitivityHeatmap: lazy(() =>
    import("@/components/future-lens/charts/sensitivity-heatmap").then((m) => ({ default: m.SensitivityHeatmap })),
  ),
  SimpleCandleChart: lazy(() =>
    import("@/components/future-lens/charts/simple-candle-chart").then((m) => ({ default: m.SimpleCandleChart })),
  ),
  CapitalStackChart: lazy(() =>
    import("@/components/future-lens/charts/capital-stack-chart").then((m) => ({ default: m.CapitalStackChart })),
  ),
  RiskRewardChart: lazy(() =>
    import("@/components/future-lens/charts/risk-reward-chart").then((m) => ({ default: m.RiskRewardChart })),
  ),
  BulletChart: lazy(() => import("@/components/future-lens/charts/bullet-chart").then((m) => ({ default: m.BulletChart }))),
  TechAdoptionCurve: lazy(() =>
    import("@/components/future-lens/charts/tech-adoption-curve").then((m) => ({ default: m.TechAdoptionCurve })),
  ),
  TornadoChart: lazy(() => import("@/components/future-lens/charts/tornado-chart").then((m) => ({ default: m.TornadoChart }))),
  CohortMatrix: lazy(() => import("@/components/future-lens/charts/cohort-matrix").then((m) => ({ default: m.CohortMatrix }))),
  StrategyRoadmap: lazy(() =>
    import("@/components/future-lens/charts/strategy-roadmap").then((m) => ({ default: m.StrategyRoadmap })),
  ),
  CreditGauge: lazy(() => import("@/components/future-lens/charts/credit-gauge").then((m) => ({ default: m.CreditGauge }))),
  DupontBreakdown: lazy(() =>
    import("@/components/future-lens/charts/dupont-breakdown").then((m) => ({ default: m.DupontBreakdown })),
  ),
  BurnRateChart: lazy(() =>
    import("@/components/future-lens/charts/burn-rate-chart").then((m) => ({ default: m.BurnRateChart })),
  ),
  TamSamSomChart: lazy(() =>
    import("@/components/future-lens/charts/tam-sam-som-chart").then((m) => ({ default: m.TamSamSomChart })),
  ),
  PeJCurveChart: lazy(() => import("@/components/future-lens/charts/pe-j-curve-chart").then((m) => ({ default: m.PeJCurveChart }))),
  PriceValueMatrix: lazy(() =>
    import("@/components/future-lens/charts/price-value-matrix").then((m) => ({ default: m.PriceValueMatrix })),
  ),
  UnitEconomicsChart: lazy(() =>
    import("@/components/future-lens/charts/unit-economics-chart").then((m) => ({ default: m.UnitEconomicsChart })),
  ),
  BreakEvenChart: lazy(() =>
    import("@/components/future-lens/charts/break-even-chart").then((m) => ({ default: m.BreakEvenChart })),
  ),
  InventoryTurnoverChart: lazy(() =>
    import("@/components/future-lens/charts/inventory-turnover-chart").then((m) => ({ default: m.InventoryTurnoverChart })),
  ),
  NdrBridgeChart: lazy(() =>
    import("@/components/future-lens/charts/ndr-bridge-chart").then((m) => ({ default: m.NdrBridgeChart })),
  ),
  WhaleCurveChart: lazy(() =>
    import("@/components/future-lens/charts/whale-curve-chart").then((m) => ({ default: m.WhaleCurveChart })),
  ),
  RuleOf40Chart: lazy(() =>
    import("@/components/future-lens/charts/rule-of-40-chart").then((m) => ({ default: m.RuleOf40Chart })),
  ),
  SalesVelocityChart: lazy(() =>
    import("@/components/future-lens/charts/sales-velocity-chart").then((m) => ({ default: m.SalesVelocityChart })),
  ),
  ValuationFootballField: lazy(() =>
    import("@/components/future-lens/charts/valuation-football-field").then((m) => ({ default: m.ValuationFootballField })),
  ),
  ValueChainChart: lazy(() =>
    import("@/components/future-lens/charts/value-chain-chart").then((m) => ({ default: m.ValueChainChart })),
  ),
  ParetoChart: lazy(() => import("@/components/future-lens/charts/pareto-chart").then((m) => ({ default: m.ParetoChart }))),
  CacPaybackChart: lazy(() =>
    import("@/components/future-lens/charts/cac-payback-chart").then((m) => ({ default: m.CacPaybackChart })),
  ),
  ScrollableMomentumChart: lazy(() =>
    import("@/components/future-lens/charts/scrollable-momentum-chart").then((m) => ({ default: m.ScrollableMomentumChart })),
  ),
}

/**
 * 渲染单个内容块
 */
function renderContentBlock(block: ContentBlock, index: number, textScale: number): React.ReactNode {
  const fSize = (base: number) => base * textScale

  switch (block.type) {
    case "markdown": {
      // 安全清理 HTML 内容（防止 XSS）
      const sanitizedContent = sanitizeHTML(block.content)

      // 检测是否包含 SVG 标签
      const containsSVG = /<svg[\s\S]*?<\/svg>/i.test(sanitizedContent)
      
      // 如果包含 SVG，使用 dangerouslySetInnerHTML 直接渲染（已通过 sanitizeHTML 清理）
      if (containsSVG) {
        return (
          <div 
            key={index} 
            className="prose prose-sm max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        )
      }

      // 纯文字内容不使用卡片容器，直接渲染
      return (
        <div key={index} className="prose prose-sm max-w-none dark:prose-invert">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              // div 标签支持：确保 HTML div 被正确渲染（用于数据流程图等）
              div: (props: any) => {
                // 直接传递所有属性，包括 style、className、children 等
                return <div {...props} />
              },
              p: ({ children }) => (
                <p className="mb-4 last:mb-0 leading-relaxed text-foreground" style={{ fontSize: `${fSize(14)}px` }}>
                  {children}
                </p>
              ),
              h1: ({ children }) => (
                <h1 className="text-xl font-bold mb-3 mt-6 first:mt-0 text-foreground" style={{ fontSize: `${fSize(18)}px` }}>
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-lg font-semibold mb-2 mt-5 first:mt-0 text-foreground" style={{ fontSize: `${fSize(16)}px` }}>
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-base font-semibold mb-2 mt-4 first:mt-0 text-foreground" style={{ fontSize: `${fSize(15)}px` }}>
                  {children}
                </h3>
              ),
              ul: ({ children }) => <ul className="my-3 ml-5 list-disc space-y-2">{children}</ul>,
              ol: ({ children }) => <ol className="my-3 ml-5 list-decimal space-y-2">{children}</ol>,
              li: ({ children }) => (
                <li className="leading-relaxed text-foreground" style={{ fontSize: `${fSize(14)}px` }}>
                  {children}
                </li>
              ),
              strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
              em: ({ children }) => <em className="italic">{children}</em>,
              // 代码块：pre 标签处理
              pre: ({ children, ...props }) => {
                // react-markdown 会将代码块包装在 <pre><code className="language-xxx"> 中
                // 我们需要提取 code 元素来获取语言信息
                const codeElement = React.Children.toArray(children).find(
                  (child) => React.isValidElement(child) && (child as React.ReactElement).type === "code"
                ) as React.ReactElement<{ className?: string; children?: React.ReactNode }> | undefined

                if (codeElement) {
                  const codeProps = codeElement.props
                  const language = codeProps.className?.replace("language-", "") || ""
                  
                  return (
                    <CardBase className="p-0 my-4 overflow-hidden">
                      {language && (
                        <div className="text-xs text-muted-foreground px-4 pt-3 pb-2 font-mono uppercase border-b border-border/30">
                          {language}
                        </div>
                      )}
                      <pre className="text-sm font-mono p-4 m-0 text-foreground whitespace-pre-wrap break-words" {...props}>
                        {children}
                      </pre>
                    </CardBase>
                  )
                }

                // 如果没有 code 元素，直接渲染 children
                return (
                  <CardBase className="p-0 my-4 overflow-hidden">
                    <pre className="text-sm font-mono p-4 m-0 text-foreground whitespace-pre-wrap break-words" {...props}>
                      {children}
                    </pre>
                  </CardBase>
                )
              },
              // 代码：code 标签处理（代码块和内联代码）
              code: ({ className, children, ...props }: { className?: string; children?: React.ReactNode }) => {
                // 如果是代码块中的 code（有 language- 前缀），保持原样让 pre 处理
                if (className?.startsWith("language-")) {
                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                }
                // 内联代码
                return (
                  <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                    {children}
                  </code>
                )
              },
              blockquote: ({ children }) => (
                <CardBase className="p-4 my-4 border-l-4 border-primary/30">
                  <blockquote className="text-foreground italic">
                    {children}
                  </blockquote>
                </CardBase>
              ),
              // HTML 标签支持：图片、视频等使用卡片容器
              img: ({ src, alt, ...props }) => (
                <CardBase className="p-0 overflow-hidden my-4">
                  <img
                    src={src}
                    alt={alt || ""}
                    className="w-full h-auto"
                    {...props}
                  />
                </CardBase>
              ),
              video: ({ src, poster, controls, ...props }) => (
                <CardBase className="p-0 overflow-hidden my-4">
                  <video
                    src={src}
                    poster={poster}
                    controls={controls !== false}
                    className="w-full h-auto"
                    {...props}
                  />
                </CardBase>
              ),
              audio: ({ src, controls, ...props }) => (
                <CardBase className="p-4 my-4">
                  <audio
                    src={src}
                    controls={controls !== false}
                    className="w-full"
                    {...props}
                  />
                </CardBase>
              ),
              canvas: (props) => (
                <CardBase className="p-4 my-4">
                  <canvas
                    className="w-full max-w-full"
                    {...(props as React.CanvasHTMLAttributes<HTMLCanvasElement>)}
                  />
                </CardBase>
              ),
              a: ({ href, children, ...props }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                  {...props}
                >
                  {children}
                </a>
              ),
              // 表格支持：使用卡片容器包裹，支持横向滚动（类似 ChatGPT）
              table: ({ children }) => (
                <div className="my-4 -mx-5 px-5 overflow-x-auto scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
                  <div className="inline-block min-w-full">
                    <CardBase className="p-0">
                      <table className="w-full border-collapse text-sm min-w-[600px]">
                        {children}
                      </table>
                    </CardBase>
                  </div>
                </div>
              ),
              // SVG 标签支持：让 React 识别 SVG 元素
              // 注意：必须正确处理 children 和所有属性，否则 React 会报错
              // 使用 React.createElement 确保正确创建 SVG 元素
              svg: (props: any) => React.createElement("svg", props),
              g: (props: any) => React.createElement("g", props),
              path: (props: any) => React.createElement("path", props),
              circle: (props: any) => React.createElement("circle", props),
              rect: (props: any) => React.createElement("rect", props),
              line: (props: any) => React.createElement("line", props),
              polyline: (props: any) => React.createElement("polyline", props),
              polygon: (props: any) => React.createElement("polygon", props),
              ellipse: (props: any) => React.createElement("ellipse", props),
              text: (props: any) => React.createElement("text", props),
              tspan: (props: any) => React.createElement("tspan", props),
              defs: (props: any) => React.createElement("defs", props),
              marker: (props: any) => React.createElement("marker", props),
              linearGradient: (props: any) => React.createElement("linearGradient", props),
              radialGradient: (props: any) => React.createElement("radialGradient", props),
              stop: (props: any) => React.createElement("stop", props),
              pattern: (props: any) => React.createElement("pattern", props),
              clipPath: (props: any) => React.createElement("clipPath", props),
              mask: (props: any) => React.createElement("mask", props),
              // style 标签支持
              style: (props: any) => React.createElement("style", props),
              thead: ({ children }) => (
                <thead className="bg-muted/50">{children}</thead>
              ),
              tbody: ({ children }) => (
                <tbody>{children}</tbody>
              ),
              tr: ({ children }) => (
                <tr className="border-b border-border/50 hover:bg-muted/20 transition-colors">{children}</tr>
              ),
              th: ({ children }) => (
                <th className="px-4 py-3 text-left font-semibold text-foreground whitespace-nowrap" style={{ fontSize: `${fSize(13)}px` }}>
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="px-4 py-3 text-foreground/80 whitespace-nowrap" style={{ fontSize: `${fSize(13)}px` }}>
                  {children}
                </td>
              ),
            }}
          >
            {sanitizedContent}
          </ReactMarkdown>
        </div>
      )
    }

    case "chart": {
      const ChartComponent = chartComponents[block.component]
      if (!ChartComponent) {
        return (
          <div key={index} className="p-4 bg-destructive/10 border border-destructive/30 rounded-xl">
            <p className="text-sm text-destructive">图表组件未找到: {block.component}</p>
          </div>
        )
      }

      return (
        <div key={index} className="space-y-2">
          {block.title && (
            <h3 className="text-sm font-semibold text-foreground" style={{ fontSize: `${fSize(14)}px` }}>
              {block.title}
            </h3>
          )}
          {block.subtitle && (
            <p className="text-xs text-muted-foreground" style={{ fontSize: `${fSize(12)}px` }}>
              {block.subtitle}
            </p>
          )}
          <CardBase className="p-4">
            <Suspense fallback={<div className="h-40 flex items-center justify-center text-xs text-muted-foreground">加载中...</div>}>
              <ChartComponent {...block.props} />
            </Suspense>
          </CardBase>
        </div>
      )
    }

    case "list": {
      if (block.listType === "companies") {
        // 转换为 PlayerList 格式
        const players = block.data.map((item) => ({
          name: item.name || item.title || "",
          value: item.value || item.score || 0,
          type: item.type || item.category || "",
          color: item.color || "bg-primary",
        }))

        return (
          <div key={index} className="space-y-2">
            {block.title && (
              <h3 className="text-sm font-semibold text-foreground" style={{ fontSize: `${fSize(14)}px` }}>
                {block.title}
              </h3>
            )}
            <CardBase className="p-4">
              <PlayerList players={players} />
            </CardBase>
          </div>
        )
      }

      // 自定义列表
      return (
        <div key={index} className="space-y-2">
          {block.title && (
            <h3 className="text-sm font-semibold text-foreground" style={{ fontSize: `${fSize(14)}px` }}>
              {block.title}
            </h3>
          )}
          <CardBase className="p-4">
            <div className="space-y-3">
              {block.data.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                  {item.name && (
                    <span className="font-semibold text-foreground" style={{ fontSize: `${fSize(13)}px` }}>
                      {item.name}
                    </span>
                  )}
                  {item.description && (
                    <span className="text-muted-foreground flex-1" style={{ fontSize: `${fSize(12)}px` }}>
                      {item.description}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardBase>
        </div>
      )
    }

    case "image": {
      return (
        <div key={index} className="space-y-2">
          <CardBase className="p-0 overflow-hidden">
            <img src={block.src} alt={block.alt || ""} className="w-full h-auto" />
            {block.caption && (
              <div className="p-3 border-t border-border/50">
                <p className="text-xs text-muted-foreground text-center" style={{ fontSize: `${fSize(11)}px` }}>
                  {block.caption}
                </p>
              </div>
            )}
          </CardBase>
        </div>
      )
    }

    case "video": {
      return (
        <div key={index} className="space-y-2">
          <CardBase className="p-0 overflow-hidden">
            <video src={block.src} poster={block.poster} controls className="w-full h-auto" />
            {block.caption && (
              <div className="p-3 border-t border-border/50">
                <p className="text-xs text-muted-foreground text-center" style={{ fontSize: `${fSize(11)}px` }}>
                  {block.caption}
                </p>
              </div>
            )}
          </CardBase>
        </div>
      )
    }

    case "card": {
      return (
        <CardBase key={index} className="p-4">
          {block.title && (
            <h3 className="text-sm font-semibold text-foreground mb-3" style={{ fontSize: `${fSize(14)}px` }}>
              {block.title}
            </h3>
          )}
          <div className="space-y-4">
            {block.content.map((subBlock, subIndex) => renderContentBlock(subBlock, subIndex, textScale))}
          </div>
        </CardBase>
      )
    }

    default:
      return null
  }
}

interface DetailContentRendererProps {
  /** 详情内容数据 */
  content: DetailContent
  /** 当前激活的标签索引（如果有标签） */
  activeTab?: number
  /** 标签切换回调 */
  onTabChange?: (index: number) => void
}

/**
 * 详情内容渲染器
 * 支持动态渲染 Markdown、图表、列表、图片、视频等内容
 */
export function DetailContentRenderer({ content, activeTab = 0, onTabChange }: DetailContentRendererProps) {
  const { textScale } = useAppConfig()

  // 如果有标签，显示标签切换
  const hasTabs = content.tabs && content.tabs.length > 0
  const currentContent = hasTabs ? content.tabs?.[activeTab]?.content : content.content

  if (!currentContent) {
    return <div className="text-sm text-muted-foreground">暂无内容</div>
  }

  return (
    <div className="space-y-6">
      {/* 注意：标签切换已移至 CardDetailView 顶部，这里不再显示，避免重复 */}
      {/* 内容块列表 */}
      <div className="space-y-6">
        {currentContent.map((block, index) => renderContentBlock(block, index, textScale))}
      </div>
    </div>
  )
}

