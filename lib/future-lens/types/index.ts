/**
 * Future Lens 类型定义统一导出
 * 
 * 所有类型从这里导入，便于 AI 理解和生成代码
 * 
 * @example
 * ```typescript
 * import type { InsightData, CardType } from '@/lib/future-lens/types'
 * import type { ChartDataPoint, ChartConfig } from '@/lib/future-lens/types'
 * import type { CardInstance, ReportConfig } from '@/lib/future-lens/types'
 * ```
 */

// 核心业务类型
export type { CardType, InsightData, CardProps } from '../types'

// 卡片系统类型
export type {
  CardDataSource,
  CardTemplateId,
  ReportCategory,
  CardInstance,
  ReportConfig,
  ReportWithCards,
  CardRecommendation,
  ReportRecommendation,
  AIRecommendationResponse,
} from './card-types'

// 图表类型
export type {
  ChartDataPoint,
  ChartDataPointWithName, // 兼容旧格式
  MultiSeriesData,
  ChartConfig,
  LegendConfig,
  AxisConfig,
  TooltipConfig,
  RadarChartData,
  FunnelChartData,
  MatrixChartData,
  HeatmapData,
  ValuationData,
  StackedBarData,
  CombinationChartData,
  ChartEvent,
  ChartRef,
  BaseChartProps,
  ResponsiveChartProps,
} from './chart-types'

// 组件类型
export type {
  BaseComponentProps,
  InteractiveProps,
} from './component-types'

// 工具类型
export type {
  DeepReadonly,
  DeepPartial,
} from './util-types'

// 配置类型
export type { Language, TranslationKey } from '../i18n'

// 详情内容类型
export type {
  ContentBlock,
  MarkdownBlock,
  ChartBlock,
  ListBlock,
  ImageBlock,
  VideoBlock,
  CardBlock,
  TabContent,
  DetailContent,
} from './detail-content-types'

