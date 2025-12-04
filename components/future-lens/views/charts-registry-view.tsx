"use client"

import { useState, useMemo, lazy, Suspense } from "react"
import { ChevronLeft, BarChart3, TrendingUp, PieChart, GitCompare, MoreVertical, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import registry from "@/charts/registry.json"
import { getChartsByCategory, getAllCategories } from "@/charts/utils"
import { generateMockData } from "@/charts/mock-data"
import { GlassPanel } from "../ds/glass-panel"
import type { ComponentType } from "react"
import type { LucideIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollHeaderContainer } from "@/components/future-lens/layout/scroll-header-container"
import { ScrollHeader } from "@/components/future-lens/layout/scroll-header"
import { AppBackground } from "../ds/app-background"

// 图表组件类型（懒加载的组件）
type LazyChartComponent = React.LazyExoticComponent<ComponentType<any>>

const chartComponents: Record<string, LazyChartComponent> = {
  AreaChart: lazy(() => import("../charts/area-chart").then((m) => ({ default: m.AreaChart }))),
  BarChart: lazy(() => import("../charts/bar-chart").then((m) => ({ default: m.BarChart }))),
  BreakEvenChart: lazy(() => import("../charts/break-even-chart").then((m) => ({ default: m.BreakEvenChart }))),
  BulletChart: lazy(() => import("../charts/bullet-chart").then((m) => ({ default: m.BulletChart }))),
  BurnRateChart: lazy(() => import("../charts/burn-rate-chart").then((m) => ({ default: m.BurnRateChart }))),
  CacPaybackChart: lazy(() => import("../charts/cac-payback-chart").then((m) => ({ default: m.CacPaybackChart }))),
  CapitalStackChart: lazy(() =>
    import("../charts/capital-stack-chart").then((m) => ({ default: m.CapitalStackChart })),
  ),
  CohortMatrix: lazy(() => import("../charts/cohort-matrix").then((m) => ({ default: m.CohortMatrix }))),
  CombinationChart: lazy(() => import("../charts/combination-chart").then((m) => ({ default: m.CombinationChart }))),
  CreditGauge: lazy(() => import("../charts/credit-gauge").then((m) => ({ default: m.CreditGauge }))),
  DonutChart: lazy(() => import("../charts/donut-chart").then((m) => ({ default: m.DonutChart }))),
  DupontBreakdown: lazy(() => import("../charts/dupont-breakdown").then((m) => ({ default: m.DupontBreakdown }))),
  FunnelChart: lazy(() => import("../charts/funnel-chart").then((m) => ({ default: m.FunnelChart }))),
  HorizontalBarChart: lazy(() =>
    import("../charts/horizontal-bar-chart").then((m) => ({ default: m.HorizontalBarChart })),
  ),
  InventoryTurnoverChart: lazy(() =>
    import("../charts/inventory-turnover-chart").then((m) => ({ default: m.InventoryTurnoverChart })),
  ),
  ScrollableMomentumChart: lazy(() =>
    import("../charts/scrollable-momentum-chart").then((m) => ({ default: m.ScrollableMomentumChart })),
  ),
  StatusGridChart: lazy(() =>
    import("../charts/status-grid-chart").then((m) => ({ default: m.StatusGridChart })),
  ),
  ProgressBarsChart: lazy(() =>
    import("../charts/progress-bars-chart").then((m) => ({ default: m.ProgressBarsChart })),
  ),
  MatrixChart: lazy(() => import("../charts/matrix-chart").then((m) => ({ default: m.MatrixChart }))),
  MultiLineChart: lazy(() => import("../charts/multi-line-chart").then((m) => ({ default: m.MultiLineChart }))),
  NdrBridgeChart: lazy(() => import("../charts/ndr-bridge-chart").then((m) => ({ default: m.NdrBridgeChart }))),
  ParetoChart: lazy(() => import("../charts/pareto-chart").then((m) => ({ default: m.ParetoChart }))),
  PeJCurveChart: lazy(() => import("../charts/pe-j-curve-chart").then((m) => ({ default: m.PeJCurveChart }))),
  PieChart: lazy(() => import("../charts/pie-chart").then((m) => ({ default: m.PieChart }))),
  PriceValueMatrix: lazy(() => import("../charts/price-value-matrix").then((m) => ({ default: m.PriceValueMatrix }))),
  RadarChart: lazy(() => import("../charts/radar-chart").then((m) => ({ default: m.RadarChart }))),
  SolidRadarChart: lazy(() => import("../charts/solid-radar-chart").then((m) => ({ default: m.SolidRadarChart }))),
  RiskRewardChart: lazy(() => import("../charts/risk-reward-chart").then((m) => ({ default: m.RiskRewardChart }))),
  RuleOf40Chart: lazy(() => import("../charts/rule-of-40-chart").then((m) => ({ default: m.RuleOf40Chart }))),
  SalesVelocityChart: lazy(() =>
    import("../charts/sales-velocity-chart").then((m) => ({ default: m.SalesVelocityChart })),
  ),
  ScatterChart: lazy(() => import("../charts/scatter-chart").then((m) => ({ default: m.ScatterChart }))),
  SensitivityHeatmap: lazy(() =>
    import("../charts/sensitivity-heatmap").then((m) => ({ default: m.SensitivityHeatmap })),
  ),
  SimpleCandleChart: lazy(() =>
    import("../charts/simple-candle-chart").then((m) => ({ default: m.SimpleCandleChart })),
  ),
  StackedBarChart: lazy(() => import("../charts/stacked-bar-chart").then((m) => ({ default: m.StackedBarChart }))),
  StrategyRoadmap: lazy(() => import("../charts/strategy-roadmap").then((m) => ({ default: m.StrategyRoadmap }))),
  TamSamSomChart: lazy(() => import("../charts/tam-sam-som-chart").then((m) => ({ default: m.TamSamSomChart }))),
  TechAdoptionCurve: lazy(() =>
    import("../charts/tech-adoption-curve").then((m) => ({ default: m.TechAdoptionCurve })),
  ),
  TornadoChart: lazy(() => import("../charts/tornado-chart").then((m) => ({ default: m.TornadoChart }))),
  TrendChart: lazy(() => import("../charts/trend-chart").then((m) => ({ default: m.TrendChart }))),
  UnitEconomicsChart: lazy(() =>
    import("../charts/unit-economics-chart").then((m) => ({ default: m.UnitEconomicsChart })),
  ),
  ValuationChart: lazy(() => import("../charts/valuation-chart").then((m) => ({ default: m.ValuationChart }))),
  ValuationFootballField: lazy(() =>
    import("../charts/valuation-football-field").then((m) => ({ default: m.ValuationFootballField })),
  ),
  ValueChainChart: lazy(() => import("../charts/value-chain-chart").then((m) => ({ default: m.ValueChainChart }))),
  WaterfallChart: lazy(() => import("../charts/waterfall-chart").then((m) => ({ default: m.WaterfallChart }))),
  WhaleCurveChart: lazy(() => import("../charts/whale-curve-chart").then((m) => ({ default: m.WhaleCurveChart }))),
}

const categoryIcons: Record<string, LucideIcon> = {
  basic: BarChart3,
  trend: TrendingUp,
  comparison: GitCompare,
  distribution: PieChart,
  relationship: GitCompare,
  financial: TrendingUp,
  saas: BarChart3,
  strategy: GitCompare,
}

const categoryLabels: Record<string, string> = {
  basic: "基础图表",
  trend: "趋势分析",
  comparison: "对比分析",
  distribution: "分布占比",
  relationship: "关系矩阵",
  financial: "财务分析",
  saas: "SaaS指标",
  strategy: "战略规划",
}

interface ChartsRegistryViewProps {
  onBack: () => void
}

export function ChartsRegistryView({ onBack }: ChartsRegistryViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [propertiesSheet, setPropertiesSheet] = useState<any>(null)

  const categories = getAllCategories()

  const filteredCharts = useMemo(() => {
    let charts = Object.values(registry)

    if (selectedCategory) {
      charts = charts.filter((chart) => chart.category === selectedCategory)
    }

    return charts
  }, [selectedCategory])

  const stats = {
    total: Object.keys(registry).length,
    categories: categories.length,
  }

  // Category Pills 组件（集成到 ScrollHeader 内部）
  const CategoryPills = () => (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
      <button
        onClick={() => setSelectedCategory(null)}
        className={`
          flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap
          ${
            selectedCategory === null
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
          }
        `}
      >
        全部 ({stats.total})
      </button>
      {categories.map((cat) => {
        const count = getChartsByCategory(cat).length
        return (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`
              flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap
              ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
              }
            `}
          >
            {categoryLabels[cat] || cat} ({count})
          </button>
        )
      })}
    </div>
  )

  return (
    <div className="h-full flex flex-col relative">
      {/* 背景 */}
      <AppBackground />

      <ScrollHeaderContainer scrollContainerId="charts-registry-scroll-container">
        <ScrollHeader title="数据图表" onBack={onBack} tabs={<CategoryPills />} />
      </ScrollHeaderContainer>

      {/* Chart List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 relative z-10" id="charts-registry-scroll-container">
        <div className="space-y-3 pb-24">
          {filteredCharts.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-sm">未找到匹配的图表</p>
              <p className="text-xs mt-1">请尝试其他分类</p>
            </div>
          ) : (
            filteredCharts.map((chart, index) => {
              const Icon = categoryIcons[chart.category] || BarChart3

              return (
                <motion.div
                  key={chart.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <GlassPanel intensity="medium" className="p-4 hover:bg-secondary/30 transition-colors">
                    {/* 标题和操作按钮 */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-foreground">{chart.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{chart.useCase}</p>
                      </div>
                      <button
                        onClick={() => setPropertiesSheet(chart)}
                        className="flex-shrink-0 p-1.5 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <MoreVertical size={16} />
                      </button>
                    </div>

                    <div className="w-full min-h-[200px]">
                      <Suspense
                        fallback={
                          <div className="flex items-center justify-center min-h-[200px]">
                            <div className="text-xs text-muted-foreground">加载中...</div>
                          </div>
                        }
                      >
                        {(() => {
                          const ChartComponent = chartComponents[chart.component]
                          if (!ChartComponent) {
                            console.log("[v0] 组件未找到:", chart.component)
                            return (
                              <div className="flex items-center justify-center min-h-[200px] text-xs text-muted-foreground">
                                组件未找到: {chart.component}
                              </div>
                            )
                          }
                          const mockData = generateMockData(chart.dataFormat, chart.dataHint || "")
                          console.log("[v0] 生成数据 for", chart.component, ":", mockData)

                          const isConfigObject =
                            mockData && typeof mockData === "object" && "data" in mockData && "lines" in mockData
                          const chartProps = isConfigObject ? mockData : { data: mockData }

                          return <ChartComponent {...chartProps} />
                        })()}
                      </Suspense>
                    </div>

                    {/* 底部元信息 */}
                    <div className="flex items-center gap-2 mt-3 text-[10px] text-muted-foreground">
                      <span className="font-mono truncate">{chart.component}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded flex-shrink-0 ${
                          chart.dataFormat === "standard"
                            ? "bg-green-500/10 text-green-600"
                            : "bg-amber-500/10 text-amber-600"
                        }`}
                      >
                        {chart.dataFormat === "standard" ? "标准" : "自定义"}
                      </span>
                    </div>
                  </GlassPanel>
                </motion.div>
              )
            })
          )}
        </div>
      </div>

      <AnimatePresence>
        {propertiesSheet && (
          <>
            {/* 背景遮罩 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPropertiesSheet(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* 属性面板 */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50"
            >
              <div className="bg-background border-t border-border rounded-t-3xl shadow-2xl max-h-[70vh] overflow-hidden flex flex-col">
                {/* 拖动指示器 */}
                <div className="flex-shrink-0 py-3 flex justify-center">
                  <div className="w-10 h-1 bg-border rounded-full" />
                </div>

                {/* 标题栏 */}
                <div className="flex-shrink-0 px-6 pb-4 flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-semibold">{propertiesSheet.name}</h2>
                    <p className="text-sm text-muted-foreground mt-1">{propertiesSheet.useCase}</p>
                  </div>
                  <button
                    onClick={() => setPropertiesSheet(null)}
                    className="flex-shrink-0 p-2 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* 内容区域 */}
                <div className="flex-1 overflow-y-auto px-6 pb-6">
                  <div className="space-y-4">
                    {/* 组件信息 */}
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground mb-2">组件名称</h4>
                      <p className="text-sm font-mono bg-secondary/50 px-3 py-2 rounded-lg">
                        {propertiesSheet.component}
                      </p>
                    </div>

                    {/* 分类 */}
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground mb-2">分类</h4>
                      <Badge variant="secondary" className="text-xs">
                        {categoryLabels[propertiesSheet.category]}
                      </Badge>
                    </div>

                    {/* 关键词 */}
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground mb-2">关键词</h4>
                      <div className="flex flex-wrap gap-2">
                        {propertiesSheet.keywords.map((keyword: string, i: number) => (
                          <span key={i} className="px-3 py-1.5 rounded-full bg-secondary/50 text-foreground text-xs">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* 数据格式 */}
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground mb-2">数据格式</h4>
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            propertiesSheet.dataFormat === "standard"
                              ? "bg-green-500/10 text-green-600"
                              : "bg-amber-500/10 text-amber-600"
                          }`}
                        >
                          {propertiesSheet.dataFormat === "standard" ? "标准格式" : "自定义格式"}
                        </span>
                      </div>
                      {propertiesSheet.dataHint && (
                        <pre className="text-xs font-mono bg-secondary/50 p-3 rounded-lg overflow-x-auto">
                          {propertiesSheet.dataHint}
                        </pre>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
