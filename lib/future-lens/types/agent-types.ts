/**
 * 智能体相关类型定义
 */
import type React from "react"

export interface Agent {
  id: string
  name: string
  icon?: string | React.ComponentType<any> | React.ReactNode
  type: 'system' | 'custom'  // 系统内置 vs 用户自定义
  category: string  // 产业分析、企业分析等
  config?: {
    filterFields?: FilterField[]  // 筛选字段配置
    defaultView?: 'recommended' | 'all'
  }
}

export interface FilterField {
  key: string
  label: string
  type: 'multiselect' | 'select' | 'range' | 'date'
  options?: Array<{label: string, value: string}>
}

export interface FilterState {
  [key: string]: string[] | string | [number, number] | null
}

