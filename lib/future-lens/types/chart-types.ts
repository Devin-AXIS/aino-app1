/**
 * 图表组件类型定义
 * 提供严格的类型约束，替代any类型使用
 * 
 * @note 统一使用 label/value 格式，便于 AI 生成和维护
 * 如需兼容旧代码，可使用 ChartDataPointWithName 类型
 */

// 图表数据点通用类型（统一格式：label/value）
export interface ChartDataPoint {
  /** 数据标签（如：月份、类别名称等） */
  label: string
  /** 主数值 */
  value: number
  /** 次要数值（用于对比图表，可选） */
  value2?: number
  /** 分类标识（用于堆叠图、分组图，可选） */
  category?: string
}

// 兼容旧格式（name/value）- 仅用于向后兼容
export interface ChartDataPointWithName {
  name: string
  value: number
  [key: string]: string | number
}

// 多系列图表数据类型
export interface MultiSeriesData {
  name: string
  [key: string]: string | number
}

// 图表配置通用类型
export interface ChartConfig {
  /** 图表数据 */
  data: ChartDataPoint[]
  /** 图表标题 */
  title?: string
  /** 副标题 */
  subtitle?: string
  /** 是否显示图例 */
  showLegend?: boolean
  /** 是否显示网格 */
  showGrid?: boolean
  /** 图表宽度 */
  width?: number
  /** 图表高度（像素） */
  height?: number
  /** 图表边距 */
  margin?: {
    top: number
    right: number
    bottom: number
    left: number
  }
  /** 数值格式化函数 */
  valueFormatter?: (value: number) => string
  /** 是否显示数值标签 */
  showValues?: boolean
}

// 图例配置类型
export interface LegendConfig {
  show?: boolean
  position?: "top" | "bottom" | "left" | "right"
  align?: "start" | "center" | "end"
}

// 坐标轴配置类型
export interface AxisConfig {
  show?: boolean
  label?: string
  tickFormat?: (value: number) => string
  domain?: [number, number]
}

// Tooltip配置类型
export interface TooltipConfig {
  show?: boolean
  formatter?: (value: number, name: string) => string
  position?: { x: number; y: number }
}

// 雷达图数据类型
export interface RadarChartData {
  subject: string
  value: number
  fullMark: number
}

// 漏斗图数据类型
export interface FunnelChartData {
  name: string
  value: number
  fill?: string
}

// 矩阵图数据类型
export interface MatrixChartData {
  x: string
  y: string
  value: number
}

// 热力图数据类型
export interface HeatmapData {
  x: string | number
  y: string | number
  value: number
}

// 估值图数据类型
export interface ValuationData {
  method: string
  value: number
  weight?: number
}

// 堆叠条形图数据类型
export interface StackedBarData {
  category: string
  [key: string]: string | number
}

// 组合图数据类型
export interface CombinationChartData {
  name: string
  bar?: number
  line?: number
  [key: string]: string | number | undefined
}

// 图表事件类型
export interface ChartEvent {
  type: "click" | "hover" | "mouseleave"
  data: ChartDataPoint | MultiSeriesData
  index: number
}

// 图表引用类型（用于访问图表实例）
export interface ChartRef {
  refresh: () => void
  exportImage: () => string
  getData: () => unknown[]
}

/**
 * 通用图表Props基类（简化版，提升AI友好度）
 * 所有图表组件应继承此接口，确保统一的API
 * 
 * @example
 * ```tsx
 * interface MyChartProps extends BaseChartProps {
 *   // 可添加特定于组件的额外属性
 *   customProp?: string
 * }
 * ```
 */
export interface BaseChartProps {
  /** 图表数据（统一使用 ChartDataPoint 格式：{label, value}） */
  data: ChartDataPoint[]
  /** 图表标题 */
  title?: string
  /** 副标题 */
  subtitle?: string
  /** 图表高度（像素，默认使用 ChartDefaults.height） */
  height?: number
  /** 自定义类名 */
  className?: string
  /** 是否显示图例 */
  showLegend?: boolean
  /** 是否显示网格 */
  showGrid?: boolean
  /** 数值格式化函数（默认使用 ChartDefaults.defaultFormatter） */
  valueFormatter?: (value: number) => string
}

// 响应式图表容器类型
export interface ResponsiveChartProps extends BaseChartProps {
  aspectRatio?: number
  minHeight?: number
  maxHeight?: number
}
