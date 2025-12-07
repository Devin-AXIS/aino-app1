"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { DesignTokens } from "@/lib/future-lens/design-tokens"
import { useAppConfig } from "@/lib/future-lens/config-context"
import { ModalDialog } from "../ds/modal-dialog"
import type { FilterField, FilterState } from "@/lib/future-lens/types/agent-types"

interface FilterActionSheetProps {
  isOpen: boolean
  onClose: () => void
  filterFields: FilterField[]
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  onApply: () => void
}

/**
 * 筛选 Action Sheet 组件
 * 参考美团样式，从底部弹出
 */
export function FilterActionSheet({
  isOpen,
  onClose,
  filterFields,
  filters,
  onFiltersChange,
  onApply,
}: FilterActionSheetProps) {
  const { textScale } = useAppConfig()
  const fSize = (base: number) => base * textScale
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})

  // 计算已选数量
  const selectedCount = Object.values(filters).reduce((count, value) => {
    if (Array.isArray(value)) {
      return count + value.length
    }
    if (value !== null && value !== undefined && value !== '') {
      return count + 1
    }
    return count
  }, 0)

  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleFilterChange = (fieldKey: string, value: any) => {
    const newFilters = { ...filters }
    
    if (value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
      delete newFilters[fieldKey]
    } else {
      newFilters[fieldKey] = value
    }
    
    onFiltersChange(newFilters)
  }

  const handleReset = () => {
    onFiltersChange({})
  }

  const handleApply = () => {
    onApply()
    onClose()
  }

  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onClose}
      variant="action-sheet"
    >
      <div className="flex flex-col h-full max-h-[80vh]">
        {/* 标题栏 */}
        <div className="flex items-center justify-between pb-4 border-b border-border/50">
          <h3
            className={cn(DesignTokens.typography.title)}
            style={{ fontSize: `${fSize(16)}px` }}
          >
            筛选
          </h3>
          <button
            onClick={handleReset}
            className={cn(
              DesignTokens.typography.caption,
              "text-muted-foreground hover:text-foreground transition-colors"
            )}
            style={{ fontSize: `${fSize(14)}px` }}
          >
            重置
          </button>
        </div>

        {/* 筛选内容区域 */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6">
          {filterFields.map((field) => {
            const isExpanded = expandedSections[field.key] !== false // 默认展开
            const fieldValue = filters[field.key]

            return (
              <div key={field.key} className="space-y-3">
                {/* 分组标题 */}
                <div className="flex items-center justify-between">
                  <h4
                    className={cn(DesignTokens.typography.subtitle, "font-semibold")}
                    style={{ fontSize: `${fSize(14)}px` }}
                  >
                    {field.label}
                  </h4>
                  <button
                    onClick={() => toggleSection(field.key)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </button>
                </div>

                {/* 筛选选项 */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      {field.type === 'multiselect' && field.options && (
                        <div className="grid grid-cols-2 gap-2">
                          {field.options.map((option) => {
                            const isSelected = Array.isArray(fieldValue) && fieldValue.includes(option.value)
                            
                            return (
                              <button
                                key={option.value}
                                onClick={() => {
                                  const currentValues = Array.isArray(fieldValue) ? fieldValue : []
                                  const newValues = isSelected
                                    ? currentValues.filter(v => v !== option.value)
                                    : [...currentValues, option.value]
                                  handleFilterChange(field.key, newValues.length > 0 ? newValues : null)
                                }}
                                className={cn(
                                  "px-4 py-2.5 rounded-lg text-left transition-all duration-200",
                                  DesignTokens.typography.caption,
                                  "border",
                                  isSelected
                                    ? "bg-primary/20 border-primary text-primary font-medium"
                                    : "bg-card/60 backdrop-blur-sm border-border/50 text-foreground hover:border-border"
                                )}
                                style={{ fontSize: `${fSize(13)}px` }}
                              >
                                {option.label}
                              </button>
                            )
                          })}
                        </div>
                      )}

                      {field.type === 'select' && field.options && (
                        <div className="grid grid-cols-2 gap-2">
                          {field.options.map((option) => {
                            const isSelected = fieldValue === option.value
                            
                            return (
                              <button
                                key={option.value}
                                onClick={() => {
                                  handleFilterChange(field.key, isSelected ? null : option.value)
                                }}
                                className={cn(
                                  "px-4 py-2.5 rounded-lg text-left transition-all duration-200",
                                  DesignTokens.typography.caption,
                                  "border",
                                  isSelected
                                    ? "bg-primary/20 border-primary text-primary font-medium"
                                    : "bg-card/60 backdrop-blur-sm border-border/50 text-foreground hover:border-border"
                                )}
                                style={{ fontSize: `${fSize(13)}px` }}
                              >
                                {option.label}
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

        {/* 底部操作栏 */}
        <div className="flex gap-3 pt-4 border-t border-border/50">
          <button
            onClick={handleReset}
            className={cn(
              "flex-1 px-4 py-3 rounded-lg",
              DesignTokens.typography.button,
              "bg-card/60 backdrop-blur-md border border-border/50 text-foreground",
              "hover:bg-card/80 transition-all duration-200"
            )}
            style={{ fontSize: `${fSize(14)}px` }}
          >
            重置
          </button>
          <button
            onClick={handleApply}
            className={cn(
              "flex-1 px-4 py-3 rounded-lg",
              DesignTokens.typography.button,
              "bg-primary text-primary-foreground",
              "hover:bg-primary/90 transition-all duration-200",
              "shadow-md"
            )}
            style={{ fontSize: `${fSize(14)}px` }}
          >
            完成 {selectedCount > 0 && `(已选${selectedCount})`}
          </button>
        </div>
      </div>
    </ModalDialog>
  )
}

