/**
 * Future Lens 图表组件库
 *
 * 基于 Recharts 的可复用图表组件，保持白陶风格的视觉设计
 * 所有组件使用统一的数据格式：{ label: string, value: number }
 */

// 基础图表组件（可复用）
export { TrendChart } from "./trend-chart"
export { DonutChart } from "./donut-chart"
export { ProgressBarsChart } from "./progress-bars-chart"
export { WaterfallChart } from "./waterfall-chart"
export { StackedBarChart } from "./stacked-bar-chart"
export { ScatterChart } from "./scatter-chart"
export { FunnelChart } from "./funnel-chart"
export { CombinationChart } from "./combination-chart"

export { MatrixChart } from "./matrix-chart"
export { ValuationChart } from "./valuation-chart"
export { MarketAnalysisChart } from "./market-analysis-chart"

// 专业图表组件（场景特定）
export { SensitivityHeatmap } from "./sensitivity-heatmap"
export { SimpleCandleChart } from "./simple-candle-chart"
export { CapitalStackChart } from "./capital-stack-chart"
export { RiskRewardChart } from "./risk-reward-chart"
export { BulletChart } from "./bullet-chart"
export { TechAdoptionCurve } from "./tech-adoption-curve"
export { TornadoChart } from "./tornado-chart"
export { CohortMatrix } from "./cohort-matrix"
export { StrategyRoadmap } from "./strategy-roadmap"
export { CreditGauge } from "./credit-gauge"
export { DupontBreakdown } from "./dupont-breakdown"
export { BurnRateChart } from "./burn-rate-chart"

export { TamSamSomChart } from "./tam-sam-som-chart"
export { PeJCurveChart } from "./pe-j-curve-chart"
export { PriceValueMatrix } from "./price-value-matrix"
export { UnitEconomicsChart } from "./unit-economics-chart"
export { BreakEvenChart } from "./break-even-chart"
export { DebtMaturityChart } from "./debt-maturity-chart"
export { ValueChainChart } from "./value-chain-chart"
export { StatusGridChart } from "./status-grid-chart"
export type { StatusGridItem, StatusGridChartProps } from "./status-grid-chart"
export { ParetoChart } from "./pareto-chart"
export { InventoryTurnoverChart } from "./inventory-turnover-chart"
export { CacPaybackChart } from "./cac-payback-chart"
export { NdrBridgeChart } from "./ndr-bridge-chart"
export { WhaleCurveChart } from "./whale-curve-chart"
export { RuleOf40Chart } from "./rule-of-40-chart"
export { SalesVelocityChart } from "./sales-velocity-chart"

// 原有的基础图表（保留兼容性）
export { BarChart } from "./bar-chart"
export { PieChart } from "./pie-chart"
export { AreaChart } from "./area-chart"
export { HorizontalBarChart } from "./horizontal-bar-chart"
export type { HorizontalBarChartData, HorizontalBarChartProps } from "./horizontal-bar-chart"
export { MultiLineChart } from "./multi-line-chart"
export type { MultiLineChartData, MultiLineChartProps } from "./multi-line-chart"

// 配置和类型
export { ChartDefaults } from "./chart-config"
export { getChartSize } from "./chart-sizes"
export type { ChartSize } from "./chart-sizes"

// 类型导出
export type { TrendChartData, TrendChartProps } from "./trend-chart"
export type { DonutChartData, DonutChartProps } from "./donut-chart"
export type { WaterfallChartData, WaterfallChartProps } from "./waterfall-chart"


export { RadarChart } from "./radar-chart"
export type { RadarChartData, RadarChartProps } from "./radar-chart"
export { SolidRadarChart } from "./solid-radar-chart"
export type { SolidRadarData, SolidRadarChartProps } from "./solid-radar-chart"
export { PaymentRadarChart } from "./payment-radar-chart"
export type { PaymentRadarData, PaymentRadarChartProps } from "./payment-radar-chart"
export { CashFlowChart } from "./cash-flow-chart"
export type { CashFlowData, CashFlowChartProps } from "./cash-flow-chart"
export { FinancialMetricsChart } from "./financial-metrics-chart"
export type { FinancialMetricData, FinancialMetricsChartProps } from "./financial-metrics-chart"
export { FinancialHealthGauge } from "./financial-health-gauge"
export type { FinancialHealthGaugeProps } from "./financial-health-gauge"
