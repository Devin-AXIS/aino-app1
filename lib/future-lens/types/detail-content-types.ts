/**
 * 详情页内容类型定义
 * 支持动态内容渲染，包括 Markdown、图表、列表、图片、视频等
 * 
 * @note 详情内容由后端 API 动态提供，不存储在前端
 * - AI 定时生成 Markdown 内容
 * - 图表和列表数据通过 API 获取
 * - 前端只定义类型和渲染逻辑
 */

import type { StatusGridItem } from "@/components/future-lens/charts/status-grid-chart"

/**
 * 内容块类型
 */
export type ContentBlock =
  | MarkdownBlock
  | ChartBlock
  | ListBlock
  | ImageBlock
  | VideoBlock
  | CardBlock

/**
 * Markdown 文本块
 */
export interface MarkdownBlock {
  type: "markdown"
  content: string
}

/**
 * 图表块
 */
export interface ChartBlock {
  type: "chart"
  /** 图表组件名称（如 "StatusGridChart", "RadarChart" 等） */
  component: string
  /** 图表组件的 props */
  props: Record<string, any>
  /** 可选标题 */
  title?: string
  /** 可选副标题 */
  subtitle?: string
}

/**
 * 列表块
 */
export interface ListBlock {
  type: "list"
  /** 列表类型：companies(企业), people(人员), custom(自定义) */
  listType: "companies" | "people" | "custom"
  /** 列表数据 */
  data: Array<Record<string, any>>
  /** 可选标题 */
  title?: string
}

/**
 * 图片块
 */
export interface ImageBlock {
  type: "image"
  /** 图片 URL */
  src: string
  /** 替代文本 */
  alt?: string
  /** 图片说明 */
  caption?: string
}

/**
 * 视频块
 */
export interface VideoBlock {
  type: "video"
  /** 视频 URL */
  src: string
  /** 视频封面图 */
  poster?: string
  /** 视频说明 */
  caption?: string
}

/**
 * 卡片块（用于包裹其他内容块）
 */
export interface CardBlock {
  type: "card"
  /** 卡片标题 */
  title?: string
  /** 卡片内容 */
  content: ContentBlock[]
}

/**
 * 标签页内容
 */
export interface TabContent {
  /** 标签 ID */
  id: string
  /** 标签显示名称 */
  label: string
  /** 标签内容块列表 */
  content: ContentBlock[]
}

/**
 * 详情页内容结构
 */
export interface DetailContent {
  /** 可选：顶部标签（如果内容很多需要切换） */
  tabs?: TabContent[]
  /** 或者直接内容（无标签时） */
  content?: ContentBlock[]
}

