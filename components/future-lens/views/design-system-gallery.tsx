"use client"

import { cn } from "@/lib/utils"
import { Calendar, Home, User, Search, Plus, Eye, Lock, Mail, Layers, Copy, Reply, Forward, Trash2 } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type React from "react"
import { useState } from "react"
import { CardBase } from "../ds/card-base"
import { ActionButton } from "../ds/action-button"
import { DetailViewShell } from "../layout/detail-view-shell"
import { GlassPanel } from "../ds/glass-panel"
import { ChartView } from "../ds/chart-view"
import { AIOrb } from "../ui/ai-orb"
import { useAppConfig } from "@/lib/future-lens/config-context"
import { translations } from "@/lib/future-lens/i18n"
import { ModalDialog } from "../ds/modal-dialog"
import { ChatInput } from "../ai/chat-input"
import { MessageBubble } from "../ai/message-bubble"
import { PillButton } from "../ds/pill-button"
import { TextInput } from "../ds/text-input"
import { MobileInput } from "../ds/mobile-input"
import { VerifyCodeInput } from "../ds/verify-code-input"
import { CascadePicker } from "../ds/cascade-picker"
import { RadioGroup } from "../ds/radio-group"
import { CheckboxGroup } from "../ds/checkbox-group"
import { Select } from "../ds/select"
import { DatePicker } from "../ds/date-picker"
import { TimePicker } from "../ds/time-picker"
import { FloatingDock } from "../nav/floating-dock"
import { ScrollHeader } from "../layout/scroll-header"
import { ScrollHeaderContainer } from "../layout/scroll-header-container"
import { StickyTabs } from "../ds/sticky-tabs"
import { CapsuleTabs } from "../ds/capsule-tabs"
import { PlayerList } from "../ds/player-list"
import type { CascadeOption } from "../ds/cascade-picker"
import { DesignTokens } from "@/lib/future-lens/design-tokens"
import { ContentActionBar } from "../nav/content-action-bar"

const DetailViewDemo = ({ onBack }: { onBack?: () => void }) => {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className="h-[600px] w-full border border-slate-200 rounded-3xl overflow-hidden bg-[#F8F9FB] relative shadow-xl pt-20">
      {/* Background pattern simulation */}
      <div className="absolute inset-0 opacity-30 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.1),transparent_50%)]" />

      {onBack && (
        <ScrollHeaderContainer scrollContainerId="scroll-container">
          <ScrollHeader title="Future Design" onBack={onBack} />
        </ScrollHeaderContainer>
      )}

      <DetailViewShell
        title="Analysis"
        tabs={["Overview", "Details", "Sources"]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onBack={() => {}}
        onAction={() => {}}
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Market Opportunity Analysis</h2>
            <p className="text-slate-500 leading-relaxed">
              Based on current market trends, we've identified a significant opening in the renewable energy sector...
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Key Insight</span>
            </div>
            <p className="text-slate-700 font-medium">Growth potential exceeds 45% in Q4 2025.</p>
          </div>

          <div className="h-32 rounded-2xl bg-slate-100/50 border border-slate-100 flex items-center justify-center text-slate-400 text-sm">
            Chart Placeholder
          </div>

          <p className="text-slate-500 leading-relaxed">
            The convergence of AI and clean tech is creating new vertical markets that were previously inaccessible.
          </p>
        </div>
      </DetailViewShell>
    </div>
  )
}

type Category = "containers" | "basics" | "inputs" | "navigation" | "feedback" | "layout" | "ai"

export function DesignSystemGallery({ onBack }: { onBack?: () => void }) {
  const { language } = useAppConfig()
  const t = translations[language] || translations["zh"]
  const [activeCategory, setActiveCategory] = useState<Category>("inputs")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false)

  const [singleDate, setSingleDate] = useState<Date>()
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>()
  const [multipleDates, setMultipleDates] = useState<Date[]>([])
  const [selectedTime, setSelectedTime] = useState<string>()

  const categories: { id: Category; label: string; icon: LucideIcon }[] = [
    { id: "containers", label: t.gallery_containers, icon: Home },
    { id: "basics", label: t.gallery_basics, icon: Search },
    { id: "inputs", label: t.gallery_inputs || "输入", icon: Plus },
    { id: "navigation", label: t.gallery_navigation, icon: Calendar },
    { id: "feedback", label: t.gallery_feedback, icon: Mail },
    { id: "layout", label: t.gallery_layout || "Layout", icon: Layers },
    { id: "ai", label: t.gallery_ai_interaction, icon: User },
  ]

  const mockCascadeOptions: CascadeOption[] = [
    {
      value: "china",
      label: "中国",
      children: [
        {
          value: "beijing",
          label: "北京",
          children: [
            { value: "chaoyang", label: "朝阳区" },
            { value: "haidian", label: "海淀区" },
            { value: "dongcheng", label: "东城区" },
          ],
        },
        {
          value: "shanghai",
          label: "上海",
          children: [
            { value: "pudong", label: "浦东新区" },
            { value: "huangpu", label: "黄浦区" },
            { value: "xuhui", label: "徐汇区" },
          ],
        },
      ],
    },
    {
      value: "usa",
      label: "United States",
      children: [
        {
          value: "california",
          label: "California",
          children: [
            { value: "sf", label: "San Francisco" },
            { value: "la", label: "Los Angeles" },
          ],
        },
        {
          value: "newyork",
          label: "New York",
          children: [
            { value: "manhattan", label: "Manhattan" },
            { value: "brooklyn", label: "Brooklyn" },
          ],
        },
      ],
    },
  ]

  // Category Tabs 组件（集成到 ScrollHeader 内部）
  const CategoryTabs = () => (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => setActiveCategory(cat.id)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all",
            activeCategory === cat.id
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary/50 text-muted-foreground hover:bg-secondary",
          )}
        >
          <cat.icon size={14} />
          {cat.label}
        </button>
      ))}
    </div>
  )

  return (
    <div className="h-full flex flex-col bg-background">
      {onBack && (
        <ScrollHeaderContainer scrollContainerId="design-system-scroll-container">
          <ScrollHeader title="Future Design" onBack={onBack} tabs={<CategoryTabs />} />
        </ScrollHeaderContainer>
      )}

      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-3 pb-24" id="design-system-scroll-container">
        {/* Containers Category */}
        {activeCategory === "containers" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SectionHeader icon={Home} title={t.gallery_core_containers} description={t.gallery_core_containers_desc} />

            <div className="grid gap-6">
              <div className="space-y-2">
                <Label>{t.gallery_standard_card}</Label>
                <CardBase className={DesignTokens.layout.cardPadding}>
                  <h4 className="font-semibold text-slate-800">{t.gallery_standard_card}</h4>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">{t.gallery_standard_card_desc}</p>
                </CardBase>
              </div>

              <div className="space-y-2">
                <Label>{t.gallery_glass_panels}</Label>
                <div className="grid gap-3">
                  <GlassPanel intensity="low" className="p-4 rounded-xl border border-slate-200/50">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-700">{t.gallery_low_intensity}</span>
                      <span className="text-xs text-slate-400">{t.gallery_blur_8px}</span>
                    </div>
                  </GlassPanel>
                  <GlassPanel intensity="medium" className="p-4 rounded-xl border border-slate-200/50">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-700">{t.gallery_medium_intensity}</span>
                      <span className="text-xs text-slate-400">{t.gallery_blur_12px}</span>
                    </div>
                  </GlassPanel>
                  <GlassPanel intensity="high" className="p-4 rounded-xl border border-slate-200/50">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-700">{t.gallery_high_intensity}</span>
                      <span className="text-xs text-slate-400">{t.gallery_blur_16px}</span>
                    </div>
                  </GlassPanel>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Basics Category */}
        {activeCategory === "basics" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SectionHeader
              icon={Search}
              title={t.gallery_basic_components}
              description={t.gallery_basic_components_desc}
            />

            <div className="grid gap-6">
              <div className="space-y-2">
                <Label>{t.gallery_pill_buttons || "Pill Buttons"}</Label>
                <CardBase className={`${DesignTokens.layout.cardPadding} space-y-3`}>
                  <p className="text-sm text-slate-500 mb-3">
                    统一的药丸按钮组件，高度36px，完全圆角。用于登录、表单提交等主要操作。
                  </p>
                  <PillButton variant="primary" onClick={() => {}}>
                    主要按钮
                  </PillButton>
                  <PillButton variant="secondary" onClick={() => {}}>
                    次要按钮
                  </PillButton>
                  <PillButton
                    variant="primary"
                    icon={
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path
                          d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
                          fill="#4285F4"
                        />
                        <path
                          d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
                          fill="#34A853"
                        />
                        <path
                          d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
                          fill="#EA4335"
                        />
                      </svg>
                    }
                  >
                    使用 Google 登录
                  </PillButton>
                </CardBase>
              </div>

              <div className="space-y-2">
                <Label>{t.gallery_action_buttons}</Label>
                <div className="flex flex-wrap gap-3 p-4 bg-slate-100/50 rounded-xl border border-slate-200/50">
                  <ActionButton variant="primary" icon={Plus} label={t.gallery_primary} />
                  <ActionButton variant="secondary" icon={Calendar} label={t.gallery_secondary} />
                  <ActionButton variant="ghost" icon={Search} label={t.gallery_ghost} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t.gallery_typography_scale}</Label>
                <CardBase className={`${DesignTokens.layout.cardPadding} space-y-4`}>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">{t.gallery_heading_1}</h1>
                    <span className="text-xs text-slate-400">{t.gallery_24px_bold}</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{t.gallery_heading_2}</h2>
                    <span className="text-xs text-slate-400">{t.gallery_20px_bold}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{t.gallery_heading_3}</h3>
                    <span className="text-xs text-slate-400">{t.gallery_18px_semibold}</span>
                  </div>
                  <div>
                    <p className="text-base text-slate-600">{t.gallery_body_text_regular}</p>
                    <span className="text-xs text-slate-400">{t.gallery_16px_regular}</span>
                  </div>
                </CardBase>
              </div>

              <div className="space-y-2">
                <Label>Player List (企业/玩家列表)</Label>
                <div className="p-4 bg-slate-100/50 dark:bg-slate-900/50 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
                  <p className="text-sm text-slate-500 mb-4">
                    用于展示多个企业/玩家的排名、影响力等信息，包含图标、名称、进度条和类型标签。
                  </p>
                  <PlayerList
                    players={[
                      { name: "OpenAI", value: 98, type: "Brain", color: "bg-success" },
                      { name: "Tesla", value: 92, type: "System", color: "bg-foreground" },
                      { name: "Figure", value: 85, type: "Integrator", color: "bg-primary" },
                      { name: "Boston", value: 75, type: "Control", color: "bg-warning" },
                    ]}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Sticky Tabs (粘性标签栏)</Label>
                <div className="relative h-64 bg-slate-100 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  {/* 模拟内容区域 */}
                  <div className="absolute inset-0 overflow-y-auto p-4 space-y-4 pt-20">
                    <div className="h-24 bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-4 flex items-center justify-center text-slate-300">
                      Content Block 1
                    </div>
                    <div className="h-24 bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-4 flex items-center justify-center text-slate-300">
                      Content Block 2
                    </div>
                    <div className="h-24 bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-4 flex items-center justify-center text-slate-300">
                      Content Block 3
                    </div>
                  </div>

                  {/* Demo StickyTabs */}
                  <div className="absolute top-14 left-0 right-0 z-10">
                    <StickyTabs
                      tabs={["职业数据", "具备能力", "相关岗位"]}
                      activeTab={0}
                      onTabChange={() => {}}
                      stickyTop="0px"
                    />
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  粘性标签栏组件，初始在内容区域，滚动到顶部时自动固定。支持黑暗模式。
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Inputs Category */}
        {activeCategory === "inputs" && (
          <>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-slate-900 mb-1">{t.gallery_input_components}</h2>
              <p className="text-sm text-slate-500">{t.gallery_input_components_desc}</p>
            </div>

            <div className="space-y-3">
              {/* Text Input */}
              <GlassPanel intensity="medium" className="p-4 hover:bg-secondary/30 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground">文本输入</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">36px height · Rounded design</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <TextInput
                    label={t.input_label_name}
                    placeholder={t.input_placeholder_name}
                    leftIcon={<User size={16} />}
                  />
                  <p className="text-xs text-slate-500">{t.gallery_text_input_desc}</p>
                </div>
              </GlassPanel>

              {/* Phone Input */}
              <GlassPanel intensity="medium" className="p-4 hover:bg-secondary/30 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground">手机号输入</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">自动格式化</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <MobileInput label={t.input_label_phone} placeholder={t.input_placeholder_phone} />
                  <p className="text-xs text-slate-500">{t.gallery_phone_input_desc}</p>
                </div>
              </GlassPanel>

              {/* Verify Code Input */}
              <GlassPanel intensity="medium" className="p-4 hover:bg-secondary/30 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground">验证码输入</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Integrated send button with countdown</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <VerifyCodeInput label="Verification Code" placeholder="Enter 6-digit code" onSendCode={() => {}} />
                  <p className="text-xs text-slate-500">Integrated send button with countdown</p>
                </div>
              </GlassPanel>

              {/* Password Input */}
              <GlassPanel intensity="medium" className="p-4 hover:bg-secondary/30 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground">密码输入</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">支持显示/隐藏</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <TextInput
                    label={t.input_label_password}
                    placeholder={t.input_placeholder_password}
                    type="password"
                    leftIcon={<Lock size={16} />}
                    rightIcon={<Eye size={16} />}
                  />
                  <p className="text-xs text-slate-500">{t.gallery_password_input_desc}</p>
                </div>
              </GlassPanel>

              {/* Email Input */}
              <GlassPanel intensity="medium" className="p-4 hover:bg-secondary/30 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground">邮箱输入</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">邮箱格式验证</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <TextInput
                    label={t.input_label_email}
                    placeholder={t.input_placeholder_email}
                    type="email"
                    leftIcon={<Mail size={16} />}
                  />
                  <p className="text-xs text-slate-500">{t.gallery_email_input_desc}</p>
                </div>
              </GlassPanel>

              {/* Dropdown Select */}
              <GlassPanel intensity="medium" className="p-4 hover:bg-secondary/30 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground">下拉选择</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">标准下拉选择器</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <Select
                    label={t.input_label_interest}
                    placeholder={t.input_placeholder_location}
                    options={[
                      { value: "tech", label: t.input_option_tech },
                      { value: "business", label: t.input_option_business },
                      { value: "finance", label: t.input_option_finance },
                      { value: "ai", label: t.input_option_ai },
                    ]}
                    onChange={(val) => {}}
                  />
                  <p className="text-xs text-slate-500">{t.gallery_dropdown_select_desc}</p>
                </div>
              </GlassPanel>
            </div>

            <div className="space-y-3">
              {/* Cascade Picker */}
              <GlassPanel intensity="medium" className="p-4 hover:bg-secondary/30 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground">{t.gallery_cascade_picker}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{t.gallery_cascade_picker_desc}</p>
                  </div>
                </div>
                <CascadePicker
                  label={t.input_label_location}
                  placeholder={t.input_placeholder_location}
                  options={mockCascadeOptions}
                  onChange={(val) => {}}
                />
              </GlassPanel>

              {/* Radio Group */}
              <GlassPanel intensity="medium" className="p-4 hover:bg-secondary/30 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground">{t.gallery_radio_group}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{t.gallery_radio_group_desc}</p>
                  </div>
                </div>
                <RadioGroup
                  label={t.input_label_interest}
                  options={[
                    { value: "tech", label: t.input_option_tech },
                    { value: "business", label: t.input_option_business },
                    { value: "finance", label: t.input_option_finance },
                  ]}
                  onChange={(val) => {}}
                />
              </GlassPanel>

              {/* Checkbox Group */}
              <GlassPanel intensity="medium" className="p-4 hover:bg-secondary/30 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground">{t.gallery_checkbox_group}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{t.gallery_checkbox_group_desc}</p>
                  </div>
                </div>
                <CheckboxGroup
                  label={t.input_label_interest}
                  options={[
                    { value: "tech", label: t.input_option_tech },
                    { value: "business", label: t.input_option_business },
                    { value: "ai", label: t.input_option_ai },
                  ]}
                  onChange={(vals) => {}}
                />
              </GlassPanel>
            </div>

            {/* Date & Time Pickers */}
            <div className="space-y-3">
              {/* Single Date Picker */}
              <GlassPanel intensity="medium" className="p-4 hover:bg-secondary/30 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground">单日期选择</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{t.gallery_date_single_desc}</p>
                  </div>
                </div>
                <DatePicker
                  mode="single"
                  label={t.input_label_date}
                  placeholder={t.input_placeholder_date}
                  value={singleDate}
                  onChange={(val) => {
                    setSingleDate(val as Date)
                  }}
                />
              </GlassPanel>

              {/* Date Range Picker */}
              <GlassPanel intensity="medium" className="p-4 hover:bg-secondary/30 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground">日期范围选择</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{t.gallery_date_range_desc}</p>
                  </div>
                </div>
                <DatePicker
                  mode="range"
                  label={t.input_label_date}
                  placeholder={t.input_placeholder_date_range}
                  value={dateRange}
                  onChange={(val) => {
                    setDateRange(val as { start: Date; end: Date })
                  }}
                />
              </GlassPanel>

              {/* Multiple Date Picker */}
              <GlassPanel intensity="medium" className="p-4 hover:bg-secondary/30 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground">多日期选择</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{t.gallery_date_multiple_desc}</p>
                  </div>
                </div>
                <DatePicker
                  mode="multiple"
                  label={t.input_label_date}
                  placeholder={t.input_placeholder_date_multiple}
                  value={multipleDates}
                  onChange={(val) => {
                    setMultipleDates(val as Date[])
                  }}
                />
              </GlassPanel>

              {/* Time Picker */}
              <GlassPanel intensity="medium" className="p-4 hover:bg-secondary/30 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground">时间选择</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{t.gallery_time_picker_desc}</p>
                  </div>
                </div>
                <TimePicker
                  format="12h"
                  label={t.input_label_time}
                  placeholder={t.input_placeholder_time}
                  value={selectedTime}
                  onChange={(val) => {
                    setSelectedTime(val)
                  }}
                />
              </GlassPanel>
            </div>
          </>
        )}

        {/* Navigation Category */}
        {activeCategory === "navigation" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SectionHeader
              icon={Calendar}
              title={t.gallery_navigation}
              description="分离式悬浮导航组件 (Floating Dock)，提供现代化的交互体验。"
            />

            <div className="grid gap-6">
              <div className="space-y-2">
                <Label>Floating Dock (Mobile & Desktop)</Label>
                {/* Increased height and adjusted preview to ensure full visibility */}
                <div className="relative h-64 bg-slate-100 rounded-3xl border border-slate-200 overflow-hidden flex items-end justify-center pb-6">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center space-y-2">
                    <p className="text-slate-400 text-sm font-medium">Content Area</p>
                    <p className="text-slate-300 text-xs">Scrollable content goes here</p>
                  </div>

                  <FloatingDock
                    items={[
                      { id: "home", icon: Home },
                      { id: "search", icon: Search },
                      { id: "profile", icon: User },
                    ]}
                    activeId="home"
                    onTabChange={() => {}}
                    onChatClick={() => {}}
                    className="relative bottom-auto left-auto right-auto transform-none w-full max-w-md shadow-none !translate-x-0 !left-0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>CapsuleTabs (胶囊式标签导航)</Label>
                <div className="relative h-48 bg-slate-100 rounded-3xl border border-slate-200 overflow-hidden flex items-start justify-center pt-8 px-5">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
                  <div className="relative w-full max-w-md">
                    <CapsuleTabs
                      tabs={["结构 & 趋势", "资金 & 生态", "战略 & 人物"]}
                      activeTab={0}
                      onTabChange={() => {}}
                    />
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  胶囊式标签导航组件，支持粘性定位。适用于报告页面、数据展示等场景。
                </p>
              </div>

              <div className="space-y-2">
                <Label>Content Action Bar (内容操作栏)</Label>
                <div className="relative h-64 bg-slate-100 rounded-3xl border border-slate-200 overflow-hidden flex items-end justify-center pb-6">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center space-y-2">
                    <p className="text-slate-400 text-sm font-medium">文章内容区域</p>
                    <p className="text-slate-300 text-xs">可滚动的内容</p>
                  </div>

                  <div className="absolute bottom-6 left-0 right-0 px-3">
                    <ContentActionBar
                      placeholder="Ask AI..."
                      onSend={(msg) => {}}
                      onVoiceInput={() => {}}
                      onAddAttachment={() => {}}
                      liked={false}
                      bookmarked={false}
                      onLike={() => {}}
                      onBookmark={() => {}}
                      onShare={() => {}}
                      className="!static !bottom-auto"
                    />
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  内容操作导航栏，胶囊样式，支持AI分析/评论模式切换，右侧点赞、收藏、分享按钮。
                </p>
              </div>

              <div className="space-y-2">
                <Label>Scroll Header (Fixed)</Label>
                <div className="relative h-56 bg-slate-100 rounded-3xl border border-slate-200 overflow-hidden">
                  {/* Simulated content scrolling */}
                  <div className="absolute inset-0 overflow-y-auto p-4 space-y-4 pt-20">
                    <div className="h-24 bg-white rounded-2xl shadow-sm p-4 flex items-center justify-center text-slate-300">
                      Content Block 1
                    </div>
                    <div className="h-24 bg-white rounded-2xl shadow-sm p-4 flex items-center justify-center text-slate-300">
                      Content Block 2
                    </div>
                    <div className="h-24 bg-white rounded-2xl shadow-sm p-4 flex items-center justify-center text-slate-300">
                      Content Block 3
                    </div>
                  </div>

                  {/* Demo ScrollHeader forced to absolute for preview */}
                  <div className="absolute top-0 left-0 right-0 z-10">
                    <ScrollHeaderContainer scrollContainerId="demo-preview-scroll">
                      <ScrollHeader title="Page Title" onBack={() => {}} className="!absolute" />
                    </ScrollHeaderContainer>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  固定定位导航栏，支持滚动模糊 (Backdrop Blur) 和动态透明度变化。
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Feedback Category */}
        {activeCategory === "feedback" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SectionHeader icon={Mail} title={t.gallery_feedback_data} description={t.gallery_feedback_data_desc} />

            <div className="grid gap-6">
              <div className="space-y-2">
                <Label>Modal Dialog</Label>
                <CardBase className="p-6 flex flex-col items-center justify-center gap-4">
                  <p className="text-sm text-slate-500 text-center">Bottom drawer with auto-height and glass effect.</p>
                  <ActionButton
                    variant="default"
                    icon={Mail}
                    label={t.modal_trigger}
                    onClick={() => setIsModalOpen(true)}
                  />
                </CardBase>
              </div>

              <div className="space-y-2">
                <Label>Action Sheet</Label>
                <CardBase className="p-6 flex flex-col items-center justify-center gap-4">
                  <p className="text-sm text-slate-500 text-center">
                    Bottom drawer with handle bar, no header, auto-closes on backdrop click.
                  </p>
                  <ActionButton
                    variant="default"
                    icon={Mail}
                    label={t.action_sheet_trigger}
                    onClick={() => setIsActionSheetOpen(true)}
                  />
                </CardBase>
              </div>

              <div className="space-y-2">
                <Label>{t.gallery_data_visualization}</Label>
                <CardBase className="p-4">
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-slate-800">{t.gallery_trend_analysis}</h4>
                    <p className="text-xs text-slate-500">{t.gallery_unified_chart_container_proxy}</p>
                  </div>
                  <ChartView type="line" data={[10, 25, 40, 30, 55, 45]} height={160} />
                </CardBase>
              </div>

              <div className="space-y-2">
                <Label>{t.gallery_status_indicators}</Label>
                <div className="grid gap-4">
                  <CardBase variant="success" className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                      <div>
                        <h4 className="text-sm font-semibold text-slate-800">Opportunity Detected</h4>
                        <p className="text-xs text-slate-500">Subtle emerald glow for positive trends</p>
                      </div>
                    </div>
                  </CardBase>

                  <CardBase variant="warning" className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                      <div>
                        <h4 className="text-sm font-semibold text-slate-800">Potential Risk</h4>
                        <p className="text-xs text-slate-500">Warm amber glow for warnings</p>
                      </div>
                    </div>
                  </CardBase>

                  <CardBase variant="error" className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-rose-400 shadow-[0_0_10px_rgba(251,113,133,0.5)]" />
                      <div>
                        <h4 className="text-sm font-semibold text-slate-800">Critical Alert</h4>
                        <p className="text-xs text-slate-500">Soft rose glow for errors</p>
                      </div>
                    </div>
                  </CardBase>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Layout Category */}
        {activeCategory === "layout" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SectionHeader
              icon={Layers}
              title={t.gallery_layout_templates || "Layout Templates"}
              description={t.gallery_layout_templates_desc || "Generic page structures"}
            />
            <div className="grid gap-6">
              <div className="space-y-2">
                <Label>{t.gallery_detail_view || "Detail View Shell"}</Label>
                <DetailViewDemo onBack={onBack} />
              </div>
            </div>
          </div>
        )}

        {/* AI Category */}
        {activeCategory === "ai" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SectionHeader icon={User} title={t.gallery_ai_components} description={t.gallery_ai_components_desc} />

            <div className="grid gap-6">
              {/* Chat Input Component */}
              <div className="space-y-2">
                <Label>{t.gallery_chat_input}</Label>
                <p className="text-sm text-slate-500 mb-2">{t.gallery_chat_input_desc}</p>
                <ChatInput onSend={(msg) => {}} onVoiceInput={() => {}} onFileUpload={() => {}} />
              </div>

              {/* Message Bubbles */}
              <div className="space-y-2">
                <Label>{t.gallery_message_bubbles}</Label>
                <CardBase className="p-6 space-y-4 bg-slate-50">
                  <p className="text-sm text-slate-500 mb-4">{t.gallery_message_bubbles_desc}</p>

                  <MessageBubble type="user" content="How do you buy 'nice' stuff?" timestamp="9:41 AM" />

                  <MessageBubble
                    type="ai"
                    content="Based on current market trends, I recommend focusing on renewable energy sectors. The growth potential exceeds 45% in Q4 2025."
                    timestamp="9:42 AM"
                  />

                  <MessageBubble
                    type="user"
                    content="Can you provide more details about the investment strategy?"
                    timestamp="9:43 AM"
                  />
                </CardBase>
              </div>
            </div>
          </div>
        )}
      </div>

      <ModalDialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={t.modal_example_title}
        icon={<AIOrb />}
      >
        <div className="text-center space-y-4 w-full">
          <p className="text-slate-600">
            This is a dynamic content area. The modal height adjusts automatically based on the content provided here.
          </p>
          <div className="h-24 bg-slate-200/50 rounded-xl w-full animate-pulse" />
        </div>
      </ModalDialog>

      <ModalDialog isOpen={isActionSheetOpen} onClose={() => setIsActionSheetOpen(false)} variant="action-sheet">
        <div className="divide-y divide-slate-100">
          <button className="w-full px-4 py-4 text-left hover:bg-slate-50 transition-colors flex items-center gap-3 group">
            <Copy size={18} className="text-slate-400 group-hover:text-slate-600" />
            <span className="text-slate-700 font-medium flex-1">{t.action_copy}</span>
            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">Copy</span>
          </button>
          <button className="w-full px-4 py-4 text-left hover:bg-slate-50 transition-colors flex items-center gap-3 group">
            <Reply size={18} className="text-slate-400 group-hover:text-slate-600" />
            <span className="text-slate-700 font-medium flex-1">{t.action_reply}</span>
            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">Reply</span>
          </button>
          <button className="w-full px-4 py-4 text-left hover:bg-slate-50 transition-colors flex items-center gap-3 group">
            <Forward size={18} className="text-slate-400 group-hover:text-slate-600" />
            <span className="text-slate-700 font-medium flex-1">{t.action_forward}</span>
            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">Forward</span>
          </button>
          <button className="w-full px-4 py-4 text-left hover:bg-red-50 transition-colors flex items-center gap-3 group">
            <Trash2 size={18} className="text-red-400 group-hover:text-red-600" />
            <span className="text-red-600 font-medium flex-1">{t.action_delete}</span>
            <span className="text-xs text-red-200 bg-red-50 px-2 py-1 rounded group-hover:text-red-500 group-hover:bg-red-100">
              Del
            </span>
          </button>
        </div>
      </ModalDialog>
    </div>
  )
}

function SectionHeader({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3 px-2">
      <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
        <Icon size={20} />
      </div>
      <div>
        <h3 className="font-bold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 px-2 mb-2">{children}</h4>
}
