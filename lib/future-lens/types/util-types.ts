import type React from "react"
/**
 * 工具类型定义
 * 提供高级TypeScript类型工具
 */

// 深度只读
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}

// 深度部分
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// 提取Promise返回类型
export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T

// 提取数组元素类型
export type ArrayElement<T> = T extends (infer U)[] ? U : never

// 必需的属性
export type RequiredKeys<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>

// 可选的属性
export type OptionalKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// 值类型
export type ValueOf<T> = T[keyof T]

// 函数类型提取
export type FunctionType<T> = T extends (...args: infer A) => infer R ? (...args: A) => R : never

// 非空类型
export type NonNullableFields<T> = {
  [P in keyof T]: NonNullable<T[P]>
}

// 条件类型：提取特定类型的键
export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never
}[keyof T]

// 互斥类型（只能有其中一个）
export type XOR<T, U> = T | U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }

// 安全的字符串字面量类型
export type StringLiteral<T> = T extends string ? (string extends T ? never : T) : never

// 数字范围类型（用于限制数字范围）
export type Range<N extends number, Result extends number[] = []> = Result["length"] extends N
  ? Result[number]
  : Range<N, [...Result, Result["length"]]>

// API响应类型
export interface ApiResponse<T> {
  data: T
  status: number
  message: string
}

export interface ApiError {
  code: string
  message: string
  details?: unknown
}

export type ApiResult<T> = { success: true; data: T } | { success: false; error: ApiError }

// 分页类型
export interface PaginationParams {
  page: number
  pageSize: number
  total?: number
}

export interface PaginatedData<T> {
  items: T[]
  pagination: Required<PaginationParams>
}

// 排序类型
export type SortOrder = "asc" | "desc"

export interface SortParams<T> {
  field: keyof T
  order: SortOrder
}

// 筛选类型
export type FilterOperator = "eq" | "ne" | "gt" | "gte" | "lt" | "lte" | "in" | "contains"

export interface FilterParams<T> {
  field: keyof T
  operator: FilterOperator
  value: unknown
}

// 事件处理类型
export type EventHandler<T = void> = (event: T) => void

export type AsyncEventHandler<T = void> = (event: T) => Promise<void>

// 配置类型守卫
export type ConfigWithDefaults<T, D> = {
  [K in keyof T]: K extends keyof D ? NonNullable<T[K]> : T[K]
}

// 样式类型
export interface StyleProps {
  style?: React.CSSProperties
  className?: string
}

// 主题类型
export interface ThemeColors {
  primary: string
  secondary: string
  success: string
  warning: string
  error: string
  info: string
}

export interface ThemeSpacing {
  xs: string
  sm: string
  md: string
  lg: string
  xl: string
}

// 响应式断点类型
export type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl"

export type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>
