/**
 * Future Lens 组件系统统一导出
 * 
 * 提供所有组件的统一入口，便于 AI 和开发者使用
 * 
 * @example
 * ```tsx
 * // 设计系统组件
 * import { CardBase, GlassPanel, ActionButton } from '@/components/future-lens'
 * 
 * // 卡片系统
 * import { CardFactory, InsightCard, DiscoverCard } from '@/components/future-lens'
 * 
 * // 图表系统
 * import { AreaChart, BarChart, PieChart } from '@/components/future-lens'
 * ```
 */

// ========== 设计系统 (Design System) ==========
export { CardBase } from "./ds/card-base"
export { GlassPanel } from "./ds/glass-panel"
export { ActionButton } from "./ds/action-button"
export { ModalDialog } from "./ds/modal-dialog"
export { TextInput } from "./ds/text-input"
export { Select } from "./ds/select"
export { DatePicker } from "./ds/date-picker"
export { AppBackground } from "./ds/app-background"
export { Timeline } from "./ds/timeline"
export { MobileInput } from "./ds/mobile-input"
export { VerifyCodeInput } from "./ds/verify-code-input"
export { CascadePicker } from "./ds/cascade-picker"
export { RadioGroup } from "./ds/radio-group"
export { CheckboxGroup } from "./ds/checkbox-group"
export { TimePicker } from "./ds/time-picker"
export { PillButton } from "./ds/pill-button"
export { Switch } from "./ds/switch"
export { ChartView } from "./ds/chart-view"
export { StickyTabs } from "./ds/sticky-tabs"
export { CapsuleTabs } from "./ds/capsule-tabs"
export { PlayerList } from "./ds/player-list"
export type { PlayerItem } from "./ds/player-list"

// ========== 卡片系统 (Card System) ==========
export { CardFactory } from "./cards/card-factory"
export { InsightCard } from "./cards/insight-card"
export { DiscoverCard } from "./cards/discover-card"
export { CardRenderer } from "./ai-report/card-renderer"
export { registerCard, getCardComponent, getRegisteredCardTypes, isCardRegistered } from "./cards/card-registry"
export type { CardComponent } from "./cards/card-registry"

// ========== 图表系统 (Chart System) ==========
// 基础图表
export { AreaChart } from "./charts/area-chart"
export { BarChart } from "./charts/bar-chart"
export { PieChart } from "./charts/pie-chart"
export { DonutChart } from "./charts/donut-chart"
export { TrendChart } from "./charts/trend-chart"
export { ScatterChart } from "./charts/scatter-chart"
export { RadarChart } from "./charts/radar-chart"

// 高级图表
export { StackedBarChart } from "./charts/stacked-bar-chart"
export { CombinationChart } from "./charts/combination-chart"
export { FunnelChart } from "./charts/funnel-chart"
export { WaterfallChart } from "./charts/waterfall-chart"
export { MultiLineChart } from "./charts/multi-line-chart"
export { HorizontalBarChart } from "./charts/horizontal-bar-chart"
export { ScrollableMomentumChart } from "./charts/scrollable-momentum-chart"

// 业务图表
export { TrendChart } from "./charts/trend-chart"
export { BulletChart } from "./charts/bullet-chart"
export { CreditGauge } from "./charts/credit-gauge"
export { SimpleCandleChart } from "./charts/simple-candle-chart"
export { MatrixChart } from "./charts/matrix-chart"
export { ParetoChart } from "./charts/pareto-chart"
export { ValuationChart } from "./charts/valuation-chart"
export { ValuationFootballField } from "./charts/valuation-football-field"
export { SensitivityHeatmap } from "./charts/sensitivity-heatmap"
export { CapitalStackChart } from "./charts/capital-stack-chart"
export { RiskRewardChart } from "./charts/risk-reward-chart"
export { TechAdoptionCurve } from "./charts/tech-adoption-curve"
export { TornadoChart } from "./charts/tornado-chart"
export { CohortMatrix } from "./charts/cohort-matrix"
export { StrategyRoadmap } from "./charts/strategy-roadmap"
export { DupontBreakdown } from "./charts/dupont-breakdown"
export { BurnRateChart } from "./charts/burn-rate-chart"
export { TamSamSomChart } from "./charts/tam-sam-som-chart"
export { PeJCurveChart } from "./charts/pe-j-curve-chart"
export { PriceValueMatrix } from "./charts/price-value-matrix"
export { UnitEconomicsChart } from "./charts/unit-economics-chart"
export { BreakEvenChart } from "./charts/break-even-chart"
export { SalesVelocityChart } from "./charts/sales-velocity-chart"
export { RuleOf40Chart } from "./charts/rule-of-40-chart"
export { NdrBridgeChart } from "./charts/ndr-bridge-chart"
export { CacPaybackChart } from "./charts/cac-payback-chart"
export { WhaleCurveChart } from "./charts/whale-curve-chart"
export { ValueChainChart } from "./charts/value-chain-chart"
export { InventoryTurnoverChart } from "./charts/inventory-turnover-chart"

// 图表工具
export { UnifiedTooltip } from "./charts/unified-tooltip"
export { ChartEffects } from "./charts/chart-effects"
export { ChartDefaults } from "./charts/chart-config"
export { ChartColors, ChartColorsRaw } from "./charts/chart-colors"

// ========== 布局系统 (Layout System) ==========
export { ArticleShell } from "./layout/article-shell"
export { SettingsShell, SettingsItem } from "./layout/settings-shell"
export { BusinessSubpageShell } from "./layout/business-subpage-shell"
export { DetailViewShell } from "./layout/detail-view-shell"
export { ScrollHeader } from "./layout/scroll-header"
export { ScrollHeaderContainer } from "./layout/scroll-header-container"
export { ScrollTabs } from "./layout/scroll-tabs"

// ========== 导航系统 (Navigation System) ==========
export { FloatingDock } from "./nav/floating-dock"
export { ContentActionBar } from "./nav/content-action-bar"

// ========== UI 组件 (UI Components) ==========
export { AIOrb } from "./ui/ai-orb"
export { CategoryTag } from "./ui/category-tag"
export { NotificationBell } from "./ui/notification-bell"

// ========== AI 组件 (AI Components) ==========
export { ChatInput } from "./ai/chat-input"
export { MessageBubble } from "./ai/message-bubble"

// ========== 认证组件 (Auth Components) ==========
export { PhoneInput } from "./auth/phone-input"
export { VerifyCode } from "./auth/verify-code"

// ========== 类型导出 (Type Exports) ==========
export type { InsightData, CardType, CardProps } from "@/lib/future-lens/types"
export type { BaseChartProps, ChartDataPoint } from "@/lib/future-lens/types/chart-types"

