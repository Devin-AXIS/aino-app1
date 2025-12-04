"use client"

import { useState } from "react"
import { TrendingUp, PieChartIcon, Briefcase, Target } from "lucide-react"
import { useAppConfig } from "@/lib/future-lens/config-context"
import { translations } from "@/lib/future-lens/i18n"
import { ScrollHeader } from "../layout/scroll-header"
import { ChartEffects } from "../charts/chart-effects"
import { TrendChart } from "../charts/trend-chart"
import { DonutChart } from "../charts/donut-chart"
import { WaterfallChart } from "../charts/waterfall-chart"
import { StackedBarChart } from "../charts/stacked-bar-chart"
import { ScatterChart } from "../charts/scatter-chart"
import { FunnelChart } from "../charts/funnel-chart"
import { CombinationChart } from "../charts/combination-chart"
import { MatrixChart } from "../charts/matrix-chart"
import { ValuationChart } from "../charts/valuation-chart"
import { MarketAnalysisChart } from "../charts/market-analysis-chart"
import { ValuationFootballField } from "../charts/valuation-football-field"
import { SensitivityHeatmap } from "../charts/sensitivity-heatmap"
import { SimpleCandleChart } from "../charts/simple-candle-chart"
import { CapitalStackChart } from "../charts/capital-stack-chart"
import { BCGMatrix } from "../charts/bcg-matrix"
import { RiskRewardChart } from "../charts/risk-reward-chart"
import { BulletChart } from "../charts/bullet-chart"
import { TechAdoptionCurve } from "../charts/tech-adoption-curve"
import { TornadoChart } from "../charts/tornado-chart"
import { CohortMatrix } from "../charts/cohort-matrix"
import { StrategyRoadmap } from "../charts/strategy-roadmap"
import { CreditGauge } from "../charts/credit-gauge"
import { DupontBreakdown } from "../charts/dupont-breakdown"
import { BurnRateChart } from "../charts/burn-rate-chart"
import { TamSamSomChart } from "../charts/tam-sam-som-chart"
import { PeJCurveChart } from "../charts/pe-j-curve-chart"
import { PriceValueMatrix } from "../charts/price-value-matrix"
import { UnitEconomicsChart } from "../charts/unit-economics-chart"
import { BreakEvenChart } from "../charts/break-even-chart"
import { ScenarioFanChart } from "../charts/scenario-fan-chart"
import { DebtMaturityChart } from "../charts/debt-maturity-chart"
import { ValueChainChart } from "../charts/value-chain-chart"
import { ParetoChart } from "../charts/pareto-chart"
import { InventoryTurnoverChart } from "../charts/inventory-turnover-chart"
import { CacPaybackChart } from "../charts/cac-payback-chart"
import { NdrBridgeChart } from "../charts/ndr-bridge-chart"
import { WhaleCurveChart } from "../charts/whale-curve-chart"
import { RuleOf40Chart } from "../charts/rule-of-40-chart"
import { SalesVelocityChart } from "../charts/sales-velocity-chart"

// 模拟数据
const trendData = [
  { label: "Jan", value: 320 },
  { label: "Feb", value: 340 },
  { label: "Mar", value: 380 },
  { label: "Apr", value: 420 },
  { label: "May", value: 450 },
]

const donutData = [
  { label: "Advisory", value: 45 },
  { label: "Trading", value: 30 },
  { label: "Wealth", value: 25 },
]

const waterfallData = [
  { label: "Revenue", value: 100 },
  { label: "COGS", value: -30 },
  { label: "Opex", value: -20 },
  { label: "Other", value: -5 },
]

const stackedData = [
  { label: "Q1", value: 45, value2: 30, value3: 25 },
  { label: "Q2", value: 52, value2: 28, value3: 20 },
  { label: "Q3", value: 48, value2: 32, value3: 20 },
  { label: "Q4", value: 61, value2: 25, value3: 14 },
]

const scatterData = [
  { label: "Product A", x: 65, y: 85, size: 500 },
  { label: "Product B", x: 45, y: 65, size: 300 },
  { label: "Product C", x: 80, y: 45, size: 800 },
  { label: "Product D", x: 25, y: 30, size: 200 },
  { label: "Product E", x: 55, y: 75, size: 400 },
]

const funnelData = [
  { label: "Visitors", value: 10000 },
  { label: "Sign Ups", value: 5000 },
  { label: "Trials", value: 2000 },
  { label: "Customers", value: 800 },
]

const comboData = [
  { label: "Q1", value: 45, value2: 12 },
  { label: "Q2", value: 52, value2: 15 },
  { label: "Q3", value: 48, value2: 18 },
  { label: "Q4", value: 61, value2: 22 },
]

interface ChartsGalleryProps {
  onBack?: () => void
}

export function ChartsGallery({ onBack }: ChartsGalleryProps) {
  const [activeCategory, setActiveCategory] = useState("trend")
  const { language } = useAppConfig()
  const t = translations[language] || translations["zh"]

  const categories = [
    { id: "trend", label: t.chart_category_trend, icon: TrendingUp },
    { id: "structure", label: t.chart_category_structure, icon: PieChartIcon },
    { id: "financial", label: t.chart_category_financial, icon: Briefcase },
    { id: "strategy", label: t.chart_category_strategy, icon: Target },
    { id: "professional", label: t.chart_category_professional, icon: Briefcase },
    { id: "saas", label: t.chart_category_saas, icon: Target },
  ]

  return (
    <div className="h-full overflow-hidden pt-20 relative bg-background">
      <ChartEffects />

      <div className="absolute inset-0 opacity-30 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(249,115,22,0.05),transparent_50%)]" />

      <ScrollHeader title={t.charts_gallery} onBack={onBack} scrollContainerId="charts-scroll-container" />

      <div id="charts-scroll-container" className="h-full overflow-y-auto pb-32 scrollbar-hide">
        {/* Category Tabs */}
        <div className="sticky top-0 z-10 backdrop-blur-xl bg-background/80 border-b border-border/50">
          <div className="flex gap-2 px-6 py-3 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => {
              const Icon = cat.icon
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
                    transition-all duration-200
                    ${
                      activeCategory === cat.id
                        ? "bg-foreground text-background"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }
                  `}
                >
                  <Icon size={16} />
                  {cat.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Chart Display */}
        <div className="px-5 py-6 space-y-6 max-w-lg mx-auto">
          {activeCategory === "trend" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <TrendChart data={trendData} />
              <CombinationChart data={comboData} />
              <StackedBarChart data={stackedData} />
            </div>
          )}

          {activeCategory === "structure" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <DonutChart data={donutData} />
              <FunnelChart data={funnelData} />
              <WaterfallChart data={waterfallData} />
            </div>
          )}

          {activeCategory === "financial" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <ValuationFootballField />
              <SensitivityHeatmap />
              <SimpleCandleChart />
              <CapitalStackChart />
            </div>
          )}

          {activeCategory === "strategy" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <MatrixChart type="swot" />
              <ScatterChart data={scatterData} />
              <BCGMatrix />
              <RiskRewardChart />
              <BulletChart />
              <MatrixChart type="correlation" />
            </div>
          )}

          {activeCategory === "professional" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <TechAdoptionCurve />
              <MarketAnalysisChart type="depth" />
              <TornadoChart />
              <CohortMatrix />
              <StrategyRoadmap />
              <ValuationChart type="multiples" />
              <CreditGauge />
              <MarketAnalysisChart type="share" />
              <DupontBreakdown />
              <BurnRateChart />
            </div>
          )}

          {activeCategory === "saas" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <TamSamSomChart />
              <PriceValueMatrix />
              <ScenarioFanChart />
              <ValueChainChart />
              <ParetoChart />
              <PeJCurveChart />
              <BreakEvenChart />
              <DebtMaturityChart />
              <CacPaybackChart />
              <WhaleCurveChart />
              <UnitEconomicsChart />
              <InventoryTurnoverChart />
              <NdrBridgeChart />
              <RuleOf40Chart />
              <SalesVelocityChart />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
