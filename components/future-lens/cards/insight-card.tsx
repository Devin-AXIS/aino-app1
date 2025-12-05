"use client"
import { Stars, ArrowUpRight } from "lucide-react"
import { motion } from "framer-motion"
import type { CardProps } from "@/lib/future-lens/types"
import { CategoryTag } from "../ui/category-tag"
import { useAppConfig } from "@/lib/future-lens/config-context"
import { translations } from "@/lib/future-lens/i18n"
import { CardBase } from "../ds/card-base"
import { DesignTokens } from "@/lib/future-lens/design-tokens"

// This is the core card component, isolated as requested.
export const InsightCard = ({ data, onClick }: CardProps & { onClick?: () => void }) => {
  const { id, headline, subheadline, impact, type, isUnread, timeStr } = data
  const { textScale, language } = useAppConfig()
  const t = translations[language] || translations["zh"]

  const themeColors = {
    trend: {
      actionBg: "bg-muted/30 border-border",
      iconColor: "text-muted-foreground",
      textColor: "text-foreground/80",
      glow: "after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] after:from-muted-foreground/10 after:via-transparent after:to-transparent after:rounded-lg after:pointer-events-none",
    },
    risk: {
      actionBg: "bg-muted/30 border-border",
      iconColor: "text-destructive",
      textColor: "text-foreground/80",
      glow: "after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] after:from-destructive/10 after:via-transparent after:to-transparent after:rounded-lg after:pointer-events-none",
    },
    opportunity: {
      actionBg: "bg-muted/30 border-border",
      iconColor: "text-success",
      textColor: "text-foreground/80",
      glow: "",
    },
    general: {
      actionBg: "bg-muted/30 border-border",
      iconColor: "text-muted-foreground",
      textColor: "text-foreground/80",
      glow: "",
    },
  }

  const theme = themeColors[type] || themeColors.trend

  // Dynamic font sizing based on configuration
  // Base sizes: Time(10px), Headline(17px), Subhead(13px), Tag(9px)
  const fSize = (base: number) => `${base * textScale}px`

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.995 }}
    >
      <CardBase
        className="p-5 mb-3 group cursor-pointer"
        onClick={onClick} // Added click handler to enable navigation
      >
      <div className="relative z-20 flex flex-col gap-3">
        {/* 1. Header */}
        <div className="flex justify-between items-center h-5">
          <div className="flex items-center gap-2.5">
            {isUnread && (
              <div
                className={`w-1.5 h-1.5 rounded-full ${type === "risk" ? "bg-destructive" : "bg-blue-700"} shadow-sm animate-pulse`}
              />
            )}
            <CategoryTag type={type} />
          </div>
          <span className={DesignTokens.typography.caption} style={{ fontSize: fSize(10) }}>
            {timeStr}
          </span>
        </div>

        {/* 2. Main Text - 优化：移除标题，副标题提升为主标题 */}
        <div>
          <h3 
            className={`${DesignTokens.typography.title} mb-0 leading-relaxed line-clamp-3`} 
            style={{ fontSize: fSize(14), lineHeight: 1.5 }}
          >
            {subheadline || headline}
          </h3>
        </div>

        {/* 3. AI Action Footer */}
        <div
          className={`relative rounded-lg border ${theme.actionBg} ${theme.actionBorder || ""} transition-colors duration-300 overflow-hidden ${theme.glow || ""}`}
        >
          <div className="relative z-10 px-3 py-3 flex items-start gap-3">
            {/* Icon */}
            <div className="flex-shrink-0 pt-0.5">
              <Stars size={13 * textScale} className={theme.iconColor} fill="currentColor" fillOpacity={0.2} />
            </div>

            {/* Text */}
            <div className="flex-1">
              <div className="flex flex-col justify-center">
                <span
                  className="font-bold text-muted-foreground/60 uppercase tracking-widest leading-none mb-1"
                  style={{ fontSize: fSize(9) }}
                >
                  {t.strategy}
                </span>
                <span
                  className={`font-semibold leading-snug ${theme.textColor} line-clamp-2 text-ellipsis overflow-hidden`}
                  style={{ fontSize: fSize(13) }}
                >
                  {impact}
                </span>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex-shrink-0 self-center opacity-40 group-hover:opacity-100 transition-opacity">
              <ArrowUpRight size={15 * textScale} className={theme.iconColor} />
            </div>
          </div>
        </div>
      </div>
    </CardBase>
    </motion.div>
  )
}
