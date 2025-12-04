/**
 * 组件通用类型定义
 * 提供可复用的组件Props类型
 */

import type { ReactNode } from "react"

// 基础组件Props
export interface BaseComponentProps {
  className?: string
  children?: ReactNode
}

// 可交互组件Props
export interface InteractiveProps extends BaseComponentProps {
  onClick?: () => void
  onHover?: () => void
  disabled?: boolean
}

// 表单控件通用Props
export interface FormControlProps {
  value?: string | number
  onChange?: (value: string | number) => void
  placeholder?: string
  disabled?: boolean
  error?: string
  required?: boolean
}

// 卡片组件Props
export interface CardProps extends BaseComponentProps {
  title?: string
  subtitle?: string
  icon?: ReactNode
  actions?: ReactNode
  footer?: ReactNode
}

// 模态框组件Props
export interface ModalProps extends BaseComponentProps {
  open: boolean
  onClose: () => void
  title?: string
  footer?: ReactNode
  width?: string | number
  centered?: boolean
}

// 列表项Props
export interface ListItemProps extends InteractiveProps {
  title: string
  subtitle?: string
  icon?: ReactNode
  rightContent?: ReactNode
  divider?: boolean
}

// 标签页Props
export interface TabProps {
  label: string
  value: string
  icon?: ReactNode
  disabled?: boolean
}

export interface TabsProps extends BaseComponentProps {
  tabs: TabProps[]
  value: string
  onChange: (value: string) => void
  variant?: "default" | "pills" | "underline"
}

// 按钮Props
export interface ButtonProps extends InteractiveProps {
  variant?: "default" | "primary" | "secondary" | "ghost" | "danger"
  size?: "sm" | "md" | "lg"
  loading?: boolean
  icon?: ReactNode
  fullWidth?: boolean
}

// 输入框Props
export interface InputProps extends FormControlProps {
  type?: "text" | "number" | "email" | "password" | "tel"
  prefix?: ReactNode
  suffix?: ReactNode
  maxLength?: number
  autoFocus?: boolean
}

// 选择器Props
export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

export interface SelectProps extends FormControlProps {
  options: SelectOption[]
  multiple?: boolean
  searchable?: boolean
  clearable?: boolean
}

// 日期选择器Props
export interface DatePickerProps extends FormControlProps {
  format?: string
  minDate?: Date
  maxDate?: Date
  showTime?: boolean
}

// 页面布局Props
export interface PageLayoutProps extends BaseComponentProps {
  header?: ReactNode
  sidebar?: ReactNode
  footer?: ReactNode
  maxWidth?: string | number
}

// 详情视图Props
export interface DetailViewProps extends BaseComponentProps {
  title: string
  subtitle?: string
  backButton?: boolean
  onBack?: () => void
  actions?: ReactNode
}

// 加载状态Props
export interface LoadingProps extends BaseComponentProps {
  loading: boolean
  message?: string
  fullScreen?: boolean
}

// 空状态Props
export interface EmptyStateProps extends BaseComponentProps {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
}

// 错误边界Props
export interface ErrorBoundaryProps extends BaseComponentProps {
  fallback?: ReactNode
  onError?: (error: Error) => void
}
