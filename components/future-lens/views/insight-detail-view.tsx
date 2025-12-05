"use client"

import { DetailViewShell } from "@/components/future-lens/layout/detail-view-shell"
import type { InsightData } from "@/lib/future-lens/types"
import { useAppConfig } from "@/lib/future-lens/config-context"
import { translations } from "@/lib/future-lens/i18n"
import { TrendingUp, AlertTriangle, Sparkles } from "lucide-react"
import { DesignTokens } from "@/lib/future-lens/design-tokens"

interface InsightDetailViewProps {
  data: InsightData
  onBack: () => void
}

export function InsightDetailView({ data, onBack }: InsightDetailViewProps) {
  const { language, textScale } = useAppConfig()
  const t = translations[language] || translations["zh"]

  const iconMap = {
    trend: <TrendingUp size={28} className="text-muted-foreground" />,
    risk: <AlertTriangle size={28} className="text-destructive" />,
    opportunity: <Sparkles size={28} className="text-success" />,
  }

  const fSize = (base: number) => `${base * textScale}px`

  return (
    <DetailViewShell
      onBack={onBack}
      onAction={() => console.log("Share/More actions")}
      icon={iconMap[data.type] || iconMap.trend}
    >
      {/* Detail Content */}
      <div className="space-y-6">
        {/* Main Title - 优化：副标题提升为主标题 */}
        <div>
          <h1 className={`${DesignTokens.typography.title} mb-2`} style={{ fontSize: fSize(18), lineHeight: 1.5 }}>
            {data.subheadline || data.headline}
          </h1>
          <p className={`${DesignTokens.typography.caption} text-sm`}>{data.timeStr}</p>
        </div>

        {/* Impact */}
        <div className="p-4 bg-muted/30 rounded-xl border border-border/50">
          <h2 className={`${DesignTokens.typography.caption} mb-2`}>{t.strategy}</h2>
          <p className={`${DesignTokens.typography.body} text-sm`}>{data.impact}</p>
        </div>

        {/* Placeholder for additional content */}
        <div className="p-6 bg-gradient-to-br from-muted/30 to-muted/50 rounded-xl border border-border/60 text-center">
          <p className="text-xs text-muted-foreground">
            {language === "zh" ? "更多分析内容即将呈现..." : "More analysis coming soon..."}
          </p>
        </div>
      </div>
    </DetailViewShell>
  )
}
