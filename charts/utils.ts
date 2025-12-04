import registry from "./registry.json"

// 类型定义
export interface ChartMeta {
  id: string
  component: string
  name: string
  nameEn: string
  keywords: string[]
  category: string
  dataFormat: "standard" | "custom"
  dataHint: string
  useCase: string
}

type ChartRegistry = Record<string, ChartMeta>

const chartRegistry = registry as ChartRegistry

/**
 * 关键词查找（AI 最常用）
 * @param keyword - 搜索关键词（支持中英文）
 * @returns 匹配的图表列表
 */
export function findChart(keyword: string): ChartMeta[] {
  const lowerKeyword = keyword.toLowerCase()
  return Object.values(chartRegistry).filter((chart) =>
    chart.keywords.some((k) => k.toLowerCase().includes(lowerKeyword)),
  )
}

/**
 * 语义搜索 - 在名称、关键词、用例中搜索
 * @param query - 搜索查询（支持中英文）
 * @returns 匹配的图表列表
 */
export function searchCharts(query: string): ChartMeta[] {
  const lowerQuery = query.toLowerCase()
  return Object.values(chartRegistry).filter(
    (chart) =>
      chart.keywords.some((k) => k.toLowerCase().includes(lowerQuery)) ||
      chart.name.toLowerCase().includes(lowerQuery) ||
      chart.nameEn.toLowerCase().includes(lowerQuery) ||
      chart.useCase.toLowerCase().includes(lowerQuery),
  )
}

/**
 * 分类查找
 * @param category - 图表分类
 * @returns 该分类下的所有图表
 */
export function getChartsByCategory(category: string): ChartMeta[] {
  return Object.values(chartRegistry).filter((chart) => chart.category === category)
}

/**
 * 组件名查找
 * @param componentName - React 组件名
 * @returns 图表元数据
 */
export function getChartInfo(componentName: string): ChartMeta | undefined {
  return Object.values(chartRegistry).find((chart) => chart.component === componentName)
}

/**
 * 获取所有分类
 * @returns 分类列表（去重）
 */
export function getAllCategories(): string[] {
  const categories = Object.values(chartRegistry).map((chart) => chart.category)
  return [...new Set(categories)]
}

/**
 * 获取所有图表
 * @returns 所有图表的元数据
 */
export function getAllCharts(): ChartMeta[] {
  return Object.values(chartRegistry)
}

/**
 * 按数据格式筛选
 * @param format - 'standard' 或 'custom'
 * @returns 匹配的图表列表
 */
export function getChartsByFormat(format: "standard" | "custom"): ChartMeta[] {
  return Object.values(chartRegistry).filter((chart) => chart.dataFormat === format)
}

// 分类显示名称映射（用于 UI 展示）
export const categoryNames: Record<string, { zh: string; en: string }> = {
  basic: { zh: "基础图表", en: "Basic Charts" },
  trend: { zh: "趋势分析", en: "Trend Analysis" },
  comparison: { zh: "对比分析", en: "Comparison" },
  distribution: { zh: "分布/占比", en: "Distribution" },
  relationship: { zh: "关系分析", en: "Relationship" },
  financial: { zh: "财务分析", en: "Financial" },
  saas: { zh: "SaaS指标", en: "SaaS Metrics" },
  strategy: { zh: "战略规划", en: "Strategy" },
}
