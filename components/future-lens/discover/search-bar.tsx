"use client"

import { useState } from "react"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { DesignTokens } from "@/lib/future-lens/design-tokens"
import { useAppConfig } from "@/lib/future-lens/config-context"
import { GlassPanel } from "../ds/glass-panel"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onSearch?: (query: string) => void
  placeholder?: string
}

/**
 * 搜索栏组件
 * 圆角输入框，毛玻璃背景
 */
export function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "搜索...",
}: SearchBarProps) {
  const { textScale } = useAppConfig()
  const fSize = (base: number) => base * textScale

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(value)
    }
  }

  return (
    <GlassPanel intensity="subtle" className="p-0">
      <div className="flex items-center gap-2 px-3 py-2">
        <Search
          size={14}
          className="text-muted-foreground flex-shrink-0"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "flex-1 bg-transparent border-none outline-none",
            DesignTokens.typography.body,
            DesignTokens.mobile.input
          )}
          style={{ fontSize: `${fSize(13)}px` }}
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 p-0.5"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </GlassPanel>
  )
}

