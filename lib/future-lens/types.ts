export type CardType = "trend" | "risk" | "opportunity" | "general" | "discover"

/**
 * 统一的卡片数据格式
 * 支持所有卡片类型的字段（根据 type 使用对应字段）
 * 
 * @example
 * ```tsx
 * // InsightCard 数据
 * const insightData: InsightData = {
 *   id: 1,
 *   type: 'trend',
 *   timeStr: '2小时前',
 *   headline: '标题',
 *   subheadline: '副标题',
 *   impact: '影响描述',
 *   isUnread: true
 * }
 * 
 * // DiscoverCard 数据
 * const discoverData: InsightData = {
 *   id: 1,
 *   type: 'discover',
 *   title: '标题',
 *   category: '分类',
 *   description: '描述',
 *   growth: '+10%',
 *   tags: ['标签1'],
 *   trendData: [1, 2, 3]
 * }
 * ```
 */
export interface InsightData {
  id: string | number
  type: CardType
  
  // InsightCard 字段（trend, risk, opportunity, general 使用）
  timeStr?: string
  headline?: string
  subheadline?: string
  impact?: string
  isUnread?: boolean
  
  // DiscoverCard 字段（discover 使用）
  title?: string
  category?: string
  description?: string
  growth?: string
  tags?: string[]
  trendData?: number[]
}

export interface CardProps {
  data: InsightData
  scale?: number // For text scaling
}
