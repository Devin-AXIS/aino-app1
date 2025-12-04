"use client"

import { useState } from "react"
import { ArrowLeft, Activity } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { CardBase } from "@/components/future-lens/ds/card-base"
import { AppBackground } from "@/components/future-lens/ds/app-background"
import { fSize, useConfig } from "@/lib/future-lens/config-context"
import { DesignTokens } from "@/lib/future-lens/design-tokens"
import {
  IndustryStackCard,
  TrendRadarCard,
  StructuralShiftCard,
  TechTimelineCard,
  IndustryPaceCard,
  CapitalFlowCard,
  PlayerImpactCard,
  NarrativeCapitalCard,
  SupplyChainHealthCard,
  EcosystemMapCard,
  StrategyWindowCard,
  InfluencerCard,
  ScenarioCard,
  ShockSimulationCard,
  FactorWeightingCard,
  InsightCompressionCard,
} from "./report-cards"

const TopOverviewCard = ({ textScale = 1.0 }: { textScale?: number }) => (
  <CardBase className="bg-gradient-to-br from-card/95 to-primary/5 border-primary/20 mb-3">
    <div className="flex justify-between items-start mb-3">
      <div>
        <span
          className="inline-block px-2 py-0.5 rounded-md bg-foreground text-primary-foreground font-bold mb-2"
          style={{ fontSize: fSize(9, textScale) }}
        >
          LIVE INTELLIGENCE
        </span>
        <h1 className="font-black text-foreground tracking-tight" style={{ fontSize: fSize(19, textScale) }}>
          具身智能 · 产业洞察
        </h1>
      </div>
      <div className="p-2 bg-card rounded-full shadow-sm border border-border">
        <Activity size={18} className="text-primary" />
      </div>
    </div>
    <div className="bg-card/80 p-3 rounded-2xl border border-border/50 mb-5 backdrop-blur-sm">
      <p
        className="font-medium text-foreground leading-relaxed text-justify"
        style={{ fontSize: fSize(13, textScale) }}
      >
        <span className="text-primary font-bold mr-1">Executive Summary:</span>
        产业正处于从实验室走向商业试运营的临界点。尽管资本热度高涨，但供应链脆弱性与商业化闭环仍是最大挑战。建议关注掌握数据闭环的平台型企业。
      </p>
    </div>
    <div className="grid grid-cols-4 gap-2">
      {[
        { l: "热度", v: "87" },
        { l: "资本", v: "76" },
        { l: "技术", v: "91" },
        { l: "商业", v: "54" },
      ].map((m, i) => (
        <div
          key={i}
          className="flex flex-col items-center justify-center p-2 bg-card rounded-xl border border-border shadow-sm"
        >
          <span className="font-bold text-muted-foreground mb-0.5" style={{ fontSize: fSize(9, textScale) }}>
            {m.l}
          </span>
          <span className="font-black text-foreground" style={{ fontSize: fSize(17, textScale) }}>
            {m.v}
          </span>
        </div>
      ))}
    </div>
  </CardBase>
)

const TabNav = ({
  activeTab,
  setActiveTab,
  textScale = 1.0,
}: {
  activeTab: number
  setActiveTab: (tab: number) => void
  textScale?: number
}) => (
  <div className={`sticky ${DesignTokens.mobile.safeTop} z-50 py-2 bg-background/90 backdrop-blur-md -mx-5 px-5 mb-3`}>
    <div className="flex p-1.5 bg-muted/50 rounded-2xl backdrop-blur-sm">
      {["结构 & 趋势", "资金 & 生态", "战略 & 人物"].map((tab, idx) => (
        <button
          key={idx}
          onClick={() => setActiveTab(idx)}
          className={`
            flex-1 py-2.5 font-bold rounded-xl transition-all duration-300
            ${
              activeTab === idx
                ? "bg-card text-foreground shadow-md scale-100"
                : "text-muted-foreground hover:text-foreground scale-95"
            }
          `}
          style={{ fontSize: fSize(11, textScale) }}
        >
          {tab}
        </button>
      ))}
    </div>
  </div>
)

export default function AIReportPage() {
  const [activeTab, setActiveTab] = useState(0)
  const { textScale } = useConfig()
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background font-sans text-foreground pb-20">
      <AppBackground />

      <div className="relative z-10">
        <div className={`${DesignTokens.mobile.safeTop} px-5 pt-4 pb-2 flex items-center gap-3`}>
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center text-foreground hover:bg-muted/50 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <h2 className="font-bold text-foreground" style={{ fontSize: fSize(15, textScale) }}>
            AI 产业报告
          </h2>
        </div>

        <div className="px-5">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <TopOverviewCard textScale={textScale} />
          </motion.div>

          <TabNav activeTab={activeTab} setActiveTab={setActiveTab} textScale={textScale} />

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 0 && (
              <>
                <IndustryStackCard textScale={textScale} />
                <TrendRadarCard textScale={textScale} />
                <StructuralShiftCard textScale={textScale} />
                <TechTimelineCard textScale={textScale} />
                <IndustryPaceCard textScale={textScale} />
              </>
            )}
            {activeTab === 1 && (
              <>
                <CapitalFlowCard textScale={textScale} />
                <PlayerImpactCard textScale={textScale} />
                <NarrativeCapitalCard textScale={textScale} />
                <SupplyChainHealthCard textScale={textScale} />
                <EcosystemMapCard textScale={textScale} />
              </>
            )}
            {activeTab === 2 && (
              <>
                <StrategyWindowCard textScale={textScale} />
                <InfluencerCard textScale={textScale} />
                <ScenarioCard textScale={textScale} />
                <ShockSimulationCard textScale={textScale} />
                <FactorWeightingCard textScale={textScale} />
                <InsightCompressionCard textScale={textScale} />
              </>
            )}
          </motion.div>
        </div>

        <div className="text-center mt-10 mb-6 px-5">
          <div className="flex items-center justify-center gap-2 text-muted-foreground/50">
            <span className="font-bold uppercase tracking-widest" style={{ fontSize: fSize(9, textScale) }}>
              FutureLens AI Strategy OS v1.0
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
