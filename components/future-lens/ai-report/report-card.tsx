/**
 * 报告卡片组件
 * 用于在AI对话中展示报告链接
 * 
 * @note 将报告统一作为卡片类型，便于AI推荐和渲染
 */

"use client"

import { useRouter } from "next/navigation"
import { FileText, ArrowRight } from "lucide-react"
import { CardBase } from "@/components/future-lens/ds/card-base"
import { useConfig } from "@/lib/future-lens/config-context"
import { DesignTokens } from "@/lib/future-lens/design-tokens"

interface ReportCardProps {
  data: {
    reportId: string
    title: string
    summary?: string
    cardCount?: number
    category?: string
    previewCards?: string[]  // 预览卡片ID列表
  }
}

export function ReportCard({ data }: ReportCardProps) {
  const { textScale } = useConfig()
  const fSize = (base: number) => base * textScale
  const router = useRouter()

  const handleClick = () => {
    router.push(`/ai-report/${data.reportId}`)
  }

  return (
    <CardBase className="mb-3 cursor-pointer group" onClick={handleClick}>
      <div className="flex items-start gap-3">
        <div className="p-3 bg-primary/10 rounded-xl border border-primary/20 flex-shrink-0">
          <FileText size={20} className="text-primary" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <h3 className={DesignTokens.typography.title} style={{ fontSize: `${fSize(14)}px` }}>
              {data.title}
            </h3>
            {data.cardCount && (
              <span
                className="text-muted-foreground bg-muted/30 px-2 py-0.5 rounded text-xs"
                style={{ fontSize: `${fSize(10)}px` }}
              >
                {data.cardCount} 张卡片
              </span>
            )}
          </div>
          
          {data.summary && (
            <p
              className="text-muted-foreground line-clamp-2 mb-2"
              style={{ fontSize: `${fSize(12)}px` }}
            >
              {data.summary}
            </p>
          )}
          
          <div className="flex items-center gap-2 text-primary group-hover:gap-3 transition-all">
            <span className="font-medium" style={{ fontSize: `${fSize(12)}px` }}>
              查看完整报告
            </span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </CardBase>
  )
}

