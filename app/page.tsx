"use client"

import { Suspense } from "react"
import { ConfigProvider } from "@/lib/future-lens/config-context"
import { MobileShell } from "@/components/future-lens/mobile-shell"
import { CardFactory } from "@/components/future-lens/cards/card-factory"

const insights = [
  {
    id: 1,
    type: "trend",
    timeStr: "13:42",
    headline: "AI Infra 算力热度飙升",
    subheadline: "基础设施关注度异常上涨，GPU租赁价格波动，这通常是行情启动的前兆。",
    impact: "短期套利窗口开放，重点关注二级市场标的及下午2点资金流向。",
    isUnread: true,
  },
  {
    id: 2,
    type: "opportunity",
    timeStr: "09:15",
    headline: "多模态模型权重泄露",
    subheadline: "Mistral 新模型权重流出，GitHub 活跃度激增，开源爆发点已现。",
    impact: "项目架构兼容，建议今晚安排性能测试，预计效率提升20%。",
    isUnread: false,
  },
  {
    id: 3,
    type: "risk",
    timeStr: "Yesterday",
    headline: "文案生成领域风险预警",
    subheadline: "自动化代理（Agent）在营销文案领域的替代率已突破临界点。",
    impact: "技能栈重合度高，建议立即启动“创意指导”技能树学习计划，以应对潜在的岗位风险。",
    isUnread: true,
  },
]

function PageContent() {
  return (
    <MobileShell>
      {insights.map((item) => (
        <CardFactory key={item.id} data={item} />
      ))}
    </MobileShell>
  )
}

export default function Page() {
  return (
    <ConfigProvider>
      <Suspense fallback={<div className="min-h-screen w-full bg-background flex items-center justify-center">Loading...</div>}>
        <PageContent />
      </Suspense>
    </ConfigProvider>
  )
}
