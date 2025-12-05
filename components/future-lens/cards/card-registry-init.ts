/**
 * 卡片注册表初始化
 * 在应用启动时自动注册所有默认卡片类型
 * 
 * @note 这个文件应该在应用入口处导入，确保卡片类型在首次使用前已注册
 */

import { InsightCard } from "./insight-card"
import { DiscoverCard } from "./discover-card"
import { registerCard } from "./card-registry"
import {
  IndustryStackCard,
  TrendRadarCard,
  StructuralShiftCard,
  TechTimelineCard,
  IndustryPaceCard,
  CapitalFlowCard,
  PlayerImpactCard,
  NarrativeCapitalCard,
  SupplyChainHealthCard,
  EcosystemMapCard,
  StrategyWindowCard,
  InfluencerCard,
  ScenarioCard,
  ShockSimulationCard,
  FactorWeightingCard,
  CapitalEcosystemCard,
  InsightCompressionCard,
  CompanySnapshotCard,
  CompanyProfileCard,
  BusinessMixCard,
  ProductTechMapCard,
  CustomerUseCaseCard,
  OrgFootprintCard,
  IndustryPositioningCard,
  MoatMapCard,
  PeerComparisonCard,
  EcosystemEmbeddingCard,
  TalentCultureCard,
  FinancialHealthCard,
  OwnershipCapitalCard,
  RiskRadarCard,
  StrategicMovesCard,
  FutureGrowthCard,
  AIExecutiveInsightCard,
  ProductSnapshotCard,
} from "../ai-report/report-cards"
import {
  UserProfileCard,
  CoreTasksCard,
  ExperienceJourneyCard,
  FeatureHeatmapCard,
  PersonalizationCard,
  ArchitectureOverviewCard,
  CapabilityEngineCard,
  DataIntegrationCard,
  PerformanceReliabilityCard,
  SecurityGovernanceCard,
  BusinessModelCard,
  UserGrowthCard,
  RetentionEngagementCard,
  ProductMoatCard,
  RoadmapRisksCard,
  AIProductInsightCard,
} from "../ai-report/product-cards"
import { ReportCard } from "../ai-report/report-card"
import {
  EventHeaderCard,
  EventCoreInsightCard,
  EventSignalMeterCard,
  EventMultiImpactCard,
  EventActionListCard,
  EventDecisionRecordCard,
  EventTimelineCard,
  EventHistoryCard,
  EventRelatedEntitiesCard,
  EventQuickReadCard,
  EventComparisonCard,
  EventTimelinePredictionCard,
  EventDecisionSupportCard,
} from "../event-detail/event-cards"
import {
  TaskMonitorScopeCard,
  TaskStatisticsCard,
  TaskTrendCard,
} from "../event-detail/task-summary-cards"

/**
 * 初始化卡片注册表
 * 注册所有卡片类型（通用卡片 + AI报告卡片 + 事件详情卡片）
 */
export function initCardRegistry() {
  // ===== 通用卡片（通过 type 注册）=====
  registerCard("trend", InsightCard)
  registerCard("risk", InsightCard)
  registerCard("opportunity", InsightCard)
  registerCard("general", InsightCard)
  registerCard("default", InsightCard)
  registerCard("discover", DiscoverCard)

  // ===== AI报告卡片（通过 componentName 注册）=====
  registerCard("IndustryStackCard", IndustryStackCard)
  registerCard("TrendRadarCard", TrendRadarCard)
  registerCard("StructuralShiftCard", StructuralShiftCard)
  registerCard("TechTimelineCard", TechTimelineCard)
  registerCard("IndustryPaceCard", IndustryPaceCard)
  registerCard("CapitalFlowCard", CapitalFlowCard)
  registerCard("PlayerImpactCard", PlayerImpactCard)
  registerCard("NarrativeCapitalCard", NarrativeCapitalCard)
  registerCard("SupplyChainHealthCard", SupplyChainHealthCard)
  registerCard("EcosystemMapCard", EcosystemMapCard)
  registerCard("StrategyWindowCard", StrategyWindowCard)
  registerCard("InfluencerCard", InfluencerCard)
  registerCard("ScenarioCard", ScenarioCard)
  registerCard("ShockSimulationCard", ShockSimulationCard)
  registerCard("FactorWeightingCard", FactorWeightingCard)
  registerCard("CapitalEcosystemCard", CapitalEcosystemCard)
  registerCard("InsightCompressionCard", InsightCompressionCard)
  registerCard("ReportCard", ReportCard)

  // ===== 企业分析报告卡片 =====
  registerCard("CompanySnapshotCard", CompanySnapshotCard)
  registerCard("CompanyProfileCard", CompanyProfileCard)
  registerCard("BusinessMixCard", BusinessMixCard)
  registerCard("ProductTechMapCard", ProductTechMapCard)
  registerCard("CustomerUseCaseCard", CustomerUseCaseCard)
  registerCard("OrgFootprintCard", OrgFootprintCard)
  registerCard("IndustryPositioningCard", IndustryPositioningCard)
  registerCard("MoatMapCard", MoatMapCard)
  registerCard("PeerComparisonCard", PeerComparisonCard)
  registerCard("EcosystemEmbeddingCard", EcosystemEmbeddingCard)
  registerCard("TalentCultureCard", TalentCultureCard)
  registerCard("FinancialHealthCard", FinancialHealthCard)
  registerCard("OwnershipCapitalCard", OwnershipCapitalCard)
  registerCard("RiskRadarCard", RiskRadarCard)
  registerCard("StrategicMovesCard", StrategicMovesCard)
  registerCard("FutureGrowthCard", FutureGrowthCard)
  registerCard("AIExecutiveInsightCard", AIExecutiveInsightCard)

  // ===== 产品分析报告卡片 =====
  registerCard("ProductSnapshotCard", ProductSnapshotCard)
  registerCard("UserProfileCard", UserProfileCard)
  registerCard("CoreTasksCard", CoreTasksCard)
  registerCard("ExperienceJourneyCard", ExperienceJourneyCard)
  registerCard("FeatureHeatmapCard", FeatureHeatmapCard)
  registerCard("PersonalizationCard", PersonalizationCard)
  registerCard("ArchitectureOverviewCard", ArchitectureOverviewCard)
  registerCard("CapabilityEngineCard", CapabilityEngineCard)
  registerCard("DataIntegrationCard", DataIntegrationCard)
  registerCard("PerformanceReliabilityCard", PerformanceReliabilityCard)
  registerCard("SecurityGovernanceCard", SecurityGovernanceCard)
  registerCard("BusinessModelCard", BusinessModelCard)
  registerCard("UserGrowthCard", UserGrowthCard)
  registerCard("RetentionEngagementCard", RetentionEngagementCard)
  registerCard("ProductMoatCard", ProductMoatCard)
  registerCard("RoadmapRisksCard", RoadmapRisksCard)
  registerCard("AIProductInsightCard", AIProductInsightCard)

  // ===== 事件详情页卡片 =====
  registerCard("EventHeaderCard", EventHeaderCard)
  registerCard("EventCoreInsightCard", EventCoreInsightCard)
  registerCard("EventSignalMeterCard", EventSignalMeterCard)
  registerCard("EventMultiImpactCard", EventMultiImpactCard)
  registerCard("EventActionListCard", EventActionListCard)
  registerCard("EventDecisionRecordCard", EventDecisionRecordCard)
  registerCard("EventTimelineCard", EventTimelineCard)
  registerCard("EventHistoryCard", EventHistoryCard)
  registerCard("EventRelatedEntitiesCard", EventRelatedEntitiesCard)
  // ===== 专业版AI分析卡片 =====
  registerCard("EventQuickReadCard", EventQuickReadCard)
  registerCard("EventComparisonCard", EventComparisonCard)
  registerCard("EventTimelinePredictionCard", EventTimelinePredictionCard)
  registerCard("EventDecisionSupportCard", EventDecisionSupportCard)
  // ===== 任务总结卡片 =====
  registerCard("TaskMonitorScopeCard", TaskMonitorScopeCard)
  registerCard("TaskStatisticsCard", TaskStatisticsCard)
  registerCard("TaskTrendCard", TaskTrendCard)
}

// 自动初始化（在模块加载时执行）
if (typeof window !== "undefined") {
  initCardRegistry()
}

