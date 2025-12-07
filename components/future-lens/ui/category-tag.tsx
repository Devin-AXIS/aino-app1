"use client"
import type { CardType } from "@/lib/future-lens/types"
import { useAppConfig } from "@/lib/future-lens/config-context"
import { translations } from "@/lib/future-lens/i18n"

/**
 * CategoryTag - 分类标签组件
 * 
 * 根据卡片类型显示对应的分类标签，支持多语言
 * 
 * @example
 * ```tsx
 * <CategoryTag type="trend" />
 * <CategoryTag type="risk" />
 * ```
 */
export const CategoryTag = ({ type }: { type: CardType }) => {
  const { language } = useAppConfig()
  const t = translations[language] || translations["zh"]

  const styles = {
    trend: "text-foreground/80 border-border bg-muted/50",
    risk: "text-destructive border-destructive/30 bg-destructive/10",
    opportunity: "text-success border-success/20 bg-success/5",
    general: "text-muted-foreground border-border bg-card",
  }

  // Mapping type to translation key safely
  const label = t[type as keyof typeof t] || t.general || type

  return (
    <span
      className={`px-2 py-[3px] rounded-md text-[9px] font-bold border tracking-wider ${styles[type]}`}
      suppressHydrationWarning
    >
      {label}
    </span>
  )
}
