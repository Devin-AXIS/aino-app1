"use client"

import { useState, useEffect, lazy, Suspense } from "react"
import { motion } from "framer-motion"
import { useRouter, useSearchParams } from "next/navigation" // Import useRouter and useSearchParams for navigation
import { User, Plus, Search, Globe, Layers } from "lucide-react"
import { CardFactory } from "./cards/card-factory"
import { AIOrb } from "./ui/ai-orb"
import { useAppConfig } from "@/lib/future-lens/config-context"
import { translations } from "@/lib/future-lens/i18n"
import type { InsightData } from "@/lib/future-lens/types"
import { AppBackground } from "./ds/app-background" // Import new background component
import { GlassPanel } from "./ds/glass-panel" // Import new glass panel
import { DesignTokens } from "@/lib/future-lens/design-tokens"
import { FloatingDock } from "./nav/floating-dock" // Import FloatingDock component
import { BottomFadeOverlay } from "./nav/bottom-fade-overlay" // Import BottomFadeOverlay component
import { NotificationBell } from "./ui/notification-bell" // Import notification bell

// 懒加载大型视图组件（按需加载，提升首次加载性能）
const DesignSystemGallery = lazy(() => import("./views/design-system-gallery").then(m => ({ default: m.DesignSystemGallery })))
const UserProfileView = lazy(() => import("./views/user-profile-view").then(m => ({ default: m.UserProfileView })))
const InsightDetailView = lazy(() => import("./views/insight-detail-view").then(m => ({ default: m.InsightDetailView })))
const SearchView = lazy(() => import("./views/search-view").then(m => ({ default: m.SearchView })))
const AIChatView = lazy(() => import("./views/ai-chat-view").then(m => ({ default: m.AIChatView })))
const ChartsRegistryView = lazy(() => import("./views/charts-registry-view").then(m => ({ default: m.ChartsRegistryView })))
const PersonalArchiveView = lazy(() => import("./views/personal-archive-view").then(m => ({ default: m.PersonalArchiveView })))
const InviteFriendsView = lazy(() => import("./views/invite-friends-view").then(m => ({ default: m.InviteFriendsView })))
const NotificationsView = lazy(() => import("./views/notifications-view").then(m => ({ default: m.NotificationsView })))
const AIReportPage = lazy(() => import("./views/ai-report-page").then(m => ({ default: m.AIReportPage })))
const TaskActionSheet = lazy(() => import("./tasks/task-action-sheet").then(m => ({ default: m.TaskActionSheet })))
const CreateTaskView = lazy(() => import("./tasks/create-task-view").then(m => ({ default: m.CreateTaskView })))

// 简单的加载占位符
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-full">
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-1.5">
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
        />
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
        />
      </div>
    </div>
  </div>
)

// Mock Data
const INSIGHTS_DATA: InsightData[] = [
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

const AI_DISCOVER_DATA = {
  industry: [
    {
      id: "ai-industry-report-v1",
      title: "AI产业分析",
      category: "产业分析 · 全局洞察",
      description:
        "具身智能产业正处于从实验室走向商业试运营的临界点。尽管资本热度高涨，但供应链脆弱性与商业化闭环仍是最大挑战。建议关注掌握数据闭环的平台型企业。",
      growth: "+87%",
      tags: ["产业报告", "全局分析", "16张卡片"],
      trendData: [20, 25, 22, 30, 35, 42, 38, 45, 48, 52],
    },
  ],
  company: [
    {
      id: "ai-company-report-v1",
      title: "AI企业分析",
      category: "企业分析 · 深度画像",
      description:
        "全方位分析企业的业务基础、竞争力生态、资本未来。从公司档案到财务健康，从护城河到增长引擎，16张卡片构建完整企业画像。",
      growth: "+92%",
      tags: ["企业报告", "深度分析", "16张卡片"],
      trendData: [18, 20, 24, 28, 32, 30, 35, 38, 40, 43],
    },
  ],
  product: [
    {
      id: "ai-product-report-v1",
      title: "AI产品分析",
      category: "产品分析 · 体验与技术",
      description:
        "深度解析产品的用户画像、体验路径、功能热度；技术架构、性能可靠性、安全合规；商业模式、增长策略、产品护城河。16张卡片全方位呈现产品竞争力。",
      growth: "+88%",
      tags: ["产品报告", "UX/技术", "16张卡片"],
      trendData: [15, 18, 22, 25, 28, 30, 33, 36, 38, 40],
    },
  ],
  business: [],
}

type Message = {
  reasoning?: string // 思维链内容
  isStreaming?: boolean // 是否正在流式输出
  id: string
  type: "user" | "ai"
  content: string
  timestamp: string
}

type TabId = "push" | "discover" | "profile" | "components"

export function MobileShell() {
  const router = useRouter() // Add router instance
  const searchParams = useSearchParams() // Get URL search params
  const [activeTab, setActiveTab] = useState<TabId>("push")
  const [activeCategory, setActiveCategory] = useState<"industry" | "company" | "product" | "business">("industry") // Add state for active discover category
  const [selectedInsight, setSelectedInsight] = useState<InsightData | null>(null)
  const [selectedReport, setSelectedReport] = useState<string | null>(null) // Added state for selected AI report
  const [isSearchOpen, setIsSearchOpen] = useState(false) // Add state for search view
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isArchiveOpen, setIsArchiveOpen] = useState(false) // Added state for personal archive view
  const [isInviteOpen, setIsInviteOpen] = useState(false) // Add state for invite friends view
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false) // Add notifications state
  const [isChartsOpen, setIsChartsOpen] = useState(false) // Add charts state
  const [isTaskActionSheetOpen, setIsTaskActionSheetOpen] = useState(false) // Add task action sheet state
  const [selectedTask, setSelectedTask] = useState<any>(null) // Selected task for creation
  const [messages, setMessages] = useState<Message[]>([])
  const [isThinking, setIsThinking] = useState(false)
  const [isDiscoverScrolled, setIsDiscoverScrolled] = useState(false) // Add scroll state for discover tab header

  const { language, setLanguage, textScale, setTextScale } = useAppConfig()
  const t = translations[language] || translations["zh"]

  // Handle URL params for auth redirect (e.g., /?tab=profile&fromAuth=true)
  useEffect(() => {
    const tabParam = searchParams.get("tab")
    const fromAuth = searchParams.get("fromAuth")
    
    if (tabParam && ["push", "discover", "profile", "components"].includes(tabParam)) {
      setActiveTab(tabParam as TabId)
      // Clean up URL params after switching
      if (fromAuth === "true") {
        router.replace("/", { scroll: false })
      }
    }
  }, [searchParams, router])

  // 不再自动添加欢迎消息，只显示 AI 特效
  // useEffect(() => {
  //   if (messages.length === 0 && t?.ai_greeting) {
  //     setMessages([
  //       {
  //         id: "init-1",
  //         type: "ai",
  //         content: t.ai_greeting,
  //         timestamp: "Now",
  //       },
  //     ])
  //   }
  // }, [messages.length, t?.ai_greeting])

  useEffect(() => {
    if (activeTab !== "discover") return

    const scrollContainer = document.getElementById("scroll-container")
    if (!scrollContainer) return

    const handleScroll = () => {
      setIsDiscoverScrolled(scrollContainer.scrollTop > 10)
    }

    scrollContainer.addEventListener("scroll", handleScroll)
    return () => scrollContainer.removeEventListener("scroll", handleScroll)
  }, [activeTab])

  const handleSendMessage = async (text: string) => {
    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      type: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
    setMessages((prev) => [...prev, userMsg])
    setIsThinking(false)

    // 导入内容检测工具
    const { detectContentType, parseMarkdownTable, extractHTMLCode } = await import("@/lib/future-lens/chat/content-detector")
    const contentType = detectContentType(text)

    // Special demo: Show reasoning chain when input is "11"
    if (text.trim() === "11") {
      const aiMsgId = (Date.now() + 1).toString()
      const reasoningText = `让我分析一下这个问题：

1. **理解需求**：用户输入了"11"，这可能是一个测试或演示请求
2. **思考过程**：
   - 首先，我需要确认这是否是一个特殊的演示命令
   - 如果是，我应该展示思维链功能
   - 思维链可以帮助用户理解 AI 的思考过程
3. **得出结论**：这是一个演示思维链功能的请求，我应该展示完整的思考过程
4. **准备回答**：现在我可以给出一个完整的回答，并展示我的思考过程`

      const contentText = `好的！我检测到您输入了"11"，这是思维链演示模式。

我已经完成了思考过程，您可以在上方看到我的思维链。思维链展示了我是如何分析问题、思考步骤，并最终得出结论的。

这种透明的思考过程可以帮助您：
- 理解 AI 的推理逻辑
- 验证答案的可靠性
- 学习问题分析方法

您想了解更多关于思维链的信息吗？`

      // 创建初始消息（空内容，用于流式更新）
      // 注意：初始时 content 和 reasoning 都为空，但我们会先流式输出 reasoning
      const initialMsg: Message = {
        id: aiMsgId,
        type: "ai",
        content: "", // 初始为空，等思维链完成后再流式输出
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        reasoning: "", // 先流式输出思维链
        isStreaming: true,
      }
      setMessages((prev) => [...prev, initialMsg])

      // 流式输出思维链（优化版：使用节流减少更新频率）
      let currentReasoning = ""
      let lastUpdate = Date.now()
      const throttleDelay = 50 // 每 50ms 更新一次，参考 Vercel 的 experimental_throttle: 100

      for (const char of reasoningText) {
        currentReasoning += char
        const now = Date.now()

        // 节流更新：只在达到延迟时间或积累一定内容时更新
        if (now - lastUpdate >= throttleDelay || currentReasoning.length % 5 === 0) {
          setMessages((prev) => {
            return prev.map((msg) => {
              if (msg.id === aiMsgId) {
                return {
                  ...msg,
                  reasoning: currentReasoning,
                  isStreaming: true,
                }
              }
              return msg
            })
          })
          lastUpdate = now
        }

        await new Promise((resolve) => setTimeout(resolve, 8)) // 8ms per char
      }

      // 确保最后的内容被更新
      if (currentReasoning) {
        setMessages((prev) => {
          return prev.map((msg) => {
            if (msg.id === aiMsgId) {
              return {
                ...msg,
                reasoning: currentReasoning,
                isStreaming: true,
              }
            }
            return msg
          })
        })
      }

      // 等待一小段时间，让用户看到思维链
      await new Promise((resolve) => setTimeout(resolve, 500))

      // 流式输出消息内容（优化版：使用节流）
      let currentContent = ""
      lastUpdate = Date.now() // 重置时间戳，继续使用同一个变量

      for (const char of contentText) {
        currentContent += char
        const now = Date.now()

        // 节流更新：参考 Vercel 的 experimental_throttle 机制
        if (now - lastUpdate >= throttleDelay || currentContent.length % 5 === 0) {
          setMessages((prev) => {
            return prev.map((msg) => {
              if (msg.id === aiMsgId) {
                return {
                  ...msg,
                  content: currentContent,
                  reasoning: currentReasoning, // 保持思维链内容
                  isStreaming: true,
                }
              }
              return msg
            })
          })
          lastUpdate = now
        }

        await new Promise((resolve) => setTimeout(resolve, 12)) // 12ms per char
      }

      // 确保最后的内容被更新
      if (currentContent) {
        setMessages((prev) => {
          return prev.map((msg) => {
            if (msg.id === aiMsgId) {
              return {
                ...msg,
                content: currentContent,
                reasoning: currentReasoning,
                isStreaming: true,
              }
            }
            return msg
          })
        })
      }

      // 标记完成
      setMessages((prev) => {
        return prev.map((msg) => {
          if (msg.id === aiMsgId) {
            return {
              ...msg,
              isStreaming: false,
            }
          }
          return msg
        })
      })
      return
    }

    // 智能回复：根据用户发送的内容类型，回复相应类型的内容
    const aiMsgId = (Date.now() + 1).toString()
    let contentText = ""
    let shouldUseTable = false
    let shouldUseHTML = false
    let tableData: { headers: string[]; data: Array<Record<string, any>> } | null = null
    let htmlCode: { html: string; css?: string } | null = null

    // 根据检测到的内容类型生成相应回复
    switch (contentType) {
      case "table": {
        // 用户发送表格，回复表格
        const parsedTable = parseMarkdownTable(text)
        if (parsedTable) {
          // 生成示例表格数据
          tableData = {
            headers: ["指标", "数值", "状态"],
            data: [
              { 指标: "数据行数", 数值: parsedTable.data.length.toString(), 状态: "✅" },
              { 指标: "列数", 数值: parsedTable.headers.length.toString(), 状态: "✅" },
              { 指标: "分析完成", 数值: "是", 状态: "✅" },
            ],
          }
          shouldUseTable = true
          contentText = "我收到了您发送的表格数据。以下是分析结果："
        } else {
          contentText = `我检测到您发送了表格内容，但格式可能不完整。请使用 Markdown 表格格式：\n\n| 列1 | 列2 |\n|-----|-----|\n| 数据1 | 数据2 |`
        }
        break
      }

      case "html": {
        // 用户发送 HTML，回复动态 HTML+CSS 卡片
        const extractedHTML = extractHTMLCode(text)
        if (extractedHTML) {
          // 生成一个动态 HTML+CSS 卡片作为回复
          htmlCode = {
            html: `<div style="padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 16px; color: white; margin: 16px 0;">
  <h2 style="margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">动态卡片</h2>
  <p style="margin: 0; opacity: 0.9; line-height: 1.6;">这是一个响应式的 HTML+CSS 卡片示例</p>
</div>`,
            css: undefined,
          }
          shouldUseHTML = true
          contentText = "我收到了您的 HTML 代码。以下是一个动态卡片示例："
        } else {
          contentText = `我检测到您发送了 HTML 内容。请使用 \`\`\`html 代码块格式。`
        }
        break
      }

      case "card": {
        // 用户发送卡片，回复卡片
        contentText = `我收到了您的卡片数据。卡片功能已识别，可以正常渲染。`
        break
      }

      case "markdown": {
        // 用户发送 Markdown，回复 Markdown
        contentText = `我收到了您的 Markdown 内容。以下是格式化的回复：\n\n## 分析结果\n\n- ✅ 内容已识别\n- ✅ 格式正确\n- ✅ 可以渲染\n\n**总结**：您的 Markdown 内容格式良好！`
        break
      }

      default: {
        // 普通文本回复
        contentText = `Here is a simulated response to: "**${text}**"\n\nI can help you analyze market trends, summarize reports, or draft content. \n\n*   **Market Analysis**: Deep dive into current trends.\n*   **Risk Assessment**: Evaluate potential pitfalls.\n*   **Strategy**: Develop actionable plans.\n\nHow would you like to proceed?`
      }
    }

    // 创建初始消息
    // 如果检测到表格或 HTML，直接创建包含相应 parts 的消息
    let initialMsg: Message
    if (shouldUseTable && tableData) {
      // 对于表格，我们需要将表格数据嵌入到 content 中，让 convertToNewFormat 识别
      // 暂时使用 Markdown 表格格式，后续会被正确解析
      const tableMarkdown = `| ${tableData.headers.join(" | ")} |\n| ${tableData.headers.map(() => "---").join(" | ")} |\n${tableData.data.map(row => `| ${tableData.headers.map(h => row[h] || "").join(" | ")} |`).join("\n")}`
      initialMsg = {
        id: aiMsgId,
        type: "ai",
        content: contentText ? `${contentText}\n\n${tableMarkdown}` : tableMarkdown,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isStreaming: true,
      }
    } else if (shouldUseHTML && htmlCode) {
      // 对于 HTML，使用代码块格式，让 convertToNewFormat 识别
      const htmlMarkdown = `\`\`\`html\n${htmlCode.html}\n\`\`\``
      initialMsg = {
        id: aiMsgId,
        type: "ai",
        content: contentText ? `${contentText}\n\n${htmlMarkdown}` : htmlMarkdown,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isStreaming: true,
      }
    } else {
      // 普通文本或 Markdown
      initialMsg = {
        id: aiMsgId,
        type: "ai",
        content: "",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isStreaming: true,
      }
    }
    setMessages((prev) => [...prev, initialMsg])

    // 流式输出内容（优化版：使用节流）
    let currentContent = ""
    let lastUpdate = Date.now()
    const throttleDelay = 50

    // 如果已经有表格或 HTML，直接标记完成
    if (shouldUseTable && tableData) {
      const tableMarkdown = `| ${tableData.headers.join(" | ")} |\n| ${tableData.headers.map(() => "---").join(" | ")} |\n${tableData.data.map(row => `| ${tableData.headers.map(h => row[h] || "").join(" | ")} |`).join("\n")}`
      const finalContent = contentText ? `${contentText}\n\n${tableMarkdown}` : tableMarkdown
      setMessages((prev) => {
        return prev.map((msg) => {
          if (msg.id === aiMsgId) {
            return {
              ...msg,
              content: finalContent,
              isStreaming: false,
            }
          }
          return msg
        })
      })
      return
    }

    if (shouldUseHTML && htmlCode) {
      const htmlMarkdown = `\`\`\`html\n${htmlCode.html}\n\`\`\``
      const finalContent = contentText ? `${contentText}\n\n${htmlMarkdown}` : htmlMarkdown
      setMessages((prev) => {
        return prev.map((msg) => {
          if (msg.id === aiMsgId) {
            return {
              ...msg,
              content: finalContent,
              isStreaming: false,
            }
          }
          return msg
        })
      })
      return
    }

    // 普通文本流式输出
    for (const char of contentText) {
      currentContent += char
      const now = Date.now()

      // 节流更新
      if (now - lastUpdate >= throttleDelay || currentContent.length % 5 === 0) {
        setMessages((prev) => {
          return prev.map((msg) => {
            if (msg.id === aiMsgId) {
              return {
                ...msg,
                content: currentContent,
                isStreaming: true,
              }
            }
            return msg
          })
        })
        lastUpdate = now
      }

      await new Promise((resolve) => setTimeout(resolve, 12)) // 12ms per char
    }

    // 确保最后的内容被更新
    if (currentContent) {
      setMessages((prev) => {
        return prev.map((msg) => {
          if (msg.id === aiMsgId) {
            return {
              ...msg,
              content: currentContent,
              isStreaming: false,
            }
          }
          return msg
        })
      })
    }

    // 标记完成
    setMessages((prev) => {
      return prev.map((msg) => {
        if (msg.id === aiMsgId) {
          return {
            ...msg,
            isStreaming: false,
          }
        }
        return msg
      })
    })
  }

  const handleVoiceInput = () => {
    handleSendMessage("🎤 [Voice Input Transcribed] Analyze the latest AI infrastructure trends.")
  }

  const handleClearHistory = () => {
    setMessages([])
  }

  const [displayedText, setDisplayedText] = useState("")

  useEffect(() => {
    if (!t?.morning_brief) return

    const fullText = t.morning_brief
    let isMounted = true

    const runTyping = async () => {
      // Typing phase
      for (let i = 0; i <= fullText.length; i++) {
        if (!isMounted) return
        setDisplayedText(fullText.slice(0, i))
        await new Promise((resolve) => setTimeout(resolve, 50))
      }
    }

    runTyping()

    return () => {
      isMounted = false
    }
  }, [language, t?.morning_brief])

  const navItems = [
    { id: "push", icon: Layers, label: t?.push || "Push" },
    { id: "discover", icon: Globe, label: t?.discover || "Discover" },
    { id: "profile", icon: User, label: "Profile" },
  ]

  const toggleLanguage = () => {
    setLanguage(language === "zh" ? "en" : "zh")
  }

  const toggleSize = () => {
    setTextScale(textScale === 1.0 ? 1.2 : 1.0)
  }

  const unreadNotificationsCount = 3

  const discoverCategories = [
    { id: "industry", label: "产业分析" },
    { id: "company", label: "企业分析" },
    { id: "product", label: "产品分析" },
    { id: "business", label: "商业分析" },
  ]

  if (isNotificationsOpen) {
    return (
      <div className="min-h-screen w-full bg-background font-sans text-foreground md:flex md:justify-center md:items-center p-0 md:p-8">
        <div className="relative w-full md:max-w-[390px] md:h-[844px] h-screen bg-background overflow-hidden shadow-2xl md:rounded-[40px] ring-8 ring-black/5">
          <AppBackground />
          <div className="relative z-10 h-full">
            <Suspense fallback={<LoadingFallback />}>
              <NotificationsView onBack={() => setIsNotificationsOpen(false)} />
            </Suspense>
          </div>
        </div>
      </div>
    )
  }

  if (isInviteOpen) {
    return (
      <div className="min-h-screen w-full bg-background font-sans text-foreground md:flex md:justify-center md:items-center p-0 md:p-8">
        <div className="relative w-full md:max-w-[390px] md:h-[844px] h-screen bg-background overflow-hidden shadow-2xl md:rounded-[40px] ring-8 ring-black/5">
          <AppBackground />
          <div className="relative z-10 h-full">
            <Suspense fallback={<LoadingFallback />}>
              <InviteFriendsView onBack={() => setIsInviteOpen(false)} />
            </Suspense>
          </div>
        </div>
      </div>
    )
  }

  if (isArchiveOpen) {
    return (
      <div className="min-h-screen w-full bg-background font-sans text-foreground md:flex md:justify-center md:items-center p-0 md:p-8">
        <div className="relative w-full md:max-w-[390px] md:h-[844px] h-screen bg-background overflow-hidden shadow-2xl md:rounded-[40px] ring-8 ring-black/5">
          <AppBackground />
          <div className="relative z-10 h-full">
            <Suspense fallback={<LoadingFallback />}>
              <PersonalArchiveView onBack={() => setIsArchiveOpen(false)} />
            </Suspense>
          </div>
        </div>
      </div>
    )
  }

  if (isSearchOpen) {
    return (
      <div className="min-h-screen w-full bg-background font-sans text-foreground md:flex md:justify-center md:items-center p-0 md:p-8">
        <div className="relative w-full md:max-w-[390px] md:h-[844px] h-screen bg-background overflow-hidden shadow-2xl md:rounded-[40px] ring-8 ring-black/5">
          <Suspense fallback={<LoadingFallback />}>
            <SearchView onBack={() => setIsSearchOpen(false)} />
          </Suspense>
        </div>
      </div>
    )
  }

  if (isChatOpen) {
    return (
      <div className="min-h-screen w-full bg-background font-sans text-foreground md:flex md:justify-center md:items-center p-0 md:p-8">
        <div className="fixed inset-0 md:relative w-full md:max-w-[390px] md:h-[844px] h-screen bg-background overflow-hidden shadow-2xl md:rounded-[40px] ring-8 ring-black/5">
          <Suspense fallback={<LoadingFallback />}>
            <AIChatView
              onBack={() => setIsChatOpen(false)}
              messages={messages}
              onSendMessage={handleSendMessage}
              onVoiceInput={handleVoiceInput}
              isThinking={isThinking}
              onClearHistory={handleClearHistory}
            />
          </Suspense>
        </div>
      </div>
    )
  }

  if (isChartsOpen) {
    return (
      <div className="min-h-screen w-full bg-background font-sans text-foreground md:flex md:justify-center md:items-center p-0 md:p-8">
        <div className="relative w-full md:max-w-[390px] md:h-[844px] h-screen bg-background overflow-hidden shadow-2xl md:rounded-[40px] ring-8 ring-black/5">
          <AppBackground />
          <div className="relative z-10 h-full">
            <Suspense fallback={<LoadingFallback />}>
              <ChartsRegistryView onBack={() => setIsChartsOpen(false)} />
            </Suspense>
          </div>
        </div>
      </div>
    )
  }

  if (selectedReport) {
    return (
      <div className="min-h-screen w-full bg-background font-sans text-foreground md:flex md:justify-center md:items-center p-0 md:p-8">
        <div className="relative w-full md:max-w-[390px] md:h-[844px] h-screen bg-background overflow-hidden shadow-2xl md:rounded-[40px] ring-8 ring-black/5">
          <AppBackground />
          <div className="relative z-10 h-full">
            <Suspense fallback={<LoadingFallback />}>
              <AIReportPage reportId={selectedReport} onBack={() => setSelectedReport(null)} />
            </Suspense>
          </div>
        </div>
      </div>
    )
  }

  if (selectedInsight) {
    return (
      <div className="min-h-screen w-full bg-background font-sans text-foreground md:flex md:justify-center md:items-center p-0 md:p-8">
        <div className="relative w-full md:max-w-[390px] md:h-[844px] h-screen bg-background overflow-hidden shadow-2xl md:rounded-[40px] ring-8 ring-black/5">
          <AppBackground />
          <div className="relative z-10 h-full">
            <Suspense fallback={<LoadingFallback />}>
              <InsightDetailView data={selectedInsight} onBack={() => setSelectedInsight(null)} />
            </Suspense>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-background font-sans text-foreground md:flex md:justify-center md:items-center p-0 md:p-8">
      {/* Added id="app-portal-container" for the modal portal target */}
      <div
        id="app-portal-container"
        className={`relative w-full md:max-w-[390px] md:h-[844px] ${DesignTokens.mobile.viewportHeight} bg-background overflow-hidden shadow-2xl md:rounded-[40px] ring-8 ring-black/5`}
      >
        {/* --- BACKGROUND --- */}
        <AppBackground />

        {/* Scrollable Content */}
        <div id="scroll-container" className="relative z-10 h-full overflow-y-auto pb-32 scrollbar-hide">
          {/* --- HEADER AREA --- */}
          {activeTab !== "profile" && activeTab !== "components" && activeTab !== "discover" && (
            <div className={`${DesignTokens.mobile.safeTop} px-6 pb-4 flex flex-col gap-4`}>
              {/* Row 1: Identity & Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <AIOrb />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span
                      className={`${DesignTokens.typography.caption} text-[9px] font-bold uppercase tracking-widest text-muted-foreground leading-none mb-1`}
                    >
                      Strategic AI
                    </span>
                    <span
                      className={`${DesignTokens.typography.title} text-[15px] font-bold text-foreground leading-none tracking-tight`}
                    >
                      FutureLens
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <NotificationBell
                    unreadCount={unreadNotificationsCount}
                    onClick={() => setIsNotificationsOpen(true)}
                  />

                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-secondary transition-all active:scale-95 border border-transparent hover:border-border"
                  >
                    <Search size={18} strokeWidth={2} />
                  </button>
                  <button
                    onClick={() => setIsTaskActionSheetOpen(true)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-secondary transition-all active:scale-95 border border-transparent hover:border-border"
                  >
                    <Plus size={20} strokeWidth={2} />
                  </button>
                </div>
              </div>

              {/* Row 2: Full Width Bubble */}
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="w-full"
                onClick={() => setIsSearchOpen(true)} // Add click handler to open search
              >
                <GlassPanel
                  intensity="medium"
                  className="h-11 px-4 flex items-center relative overflow-hidden rounded-xl cursor-pointer active:scale-[0.98] transition-transform"
                >
                  <p className="text-[13px] truncate w-full bg-clip-text text-transparent bg-gradient-to-r from-foreground/80 via-muted-foreground to-muted-foreground/50">
                    {displayedText}
                    <span className="inline-block w-[2px] h-3.5 ml-1 bg-muted-foreground animate-pulse align-middle" />
                  </p>
                </GlassPanel>
              </motion.div>
            </div>
          )}

          {activeTab === "discover" && (
            <div
              className={`${DesignTokens.mobile.safeTop} sticky top-0 z-30 transition-all duration-300 ${
                isDiscoverScrolled ? "bg-background/80 backdrop-blur-xl border-b border-border/50" : "bg-transparent"
              }`}
            >
              <div className="px-4 py-3">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                  {discoverCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id as "industry" | "company" | "product" | "business")}
                      className={`
                        flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all
                        ${
                          activeCategory === category.id
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                        }
                      `}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Content List - Using Factory */}
          <div className={`${DesignTokens.layout.containerPadding} mt-1`}>
            {activeTab === "push" && (
              <>
                {INSIGHTS_DATA.map((item) => (
                  <CardFactory
                    key={item.id}
                    data={item}
                    onClick={() => {
                      // 跳转到事件详情页
                      // 目前所有卡片都跳转到 event-001 作为示例
                      // 后续可以根据卡片数据动态生成事件 ID
                      router.push(`/event/event-001`)
                    }}
                  />
                ))}

                {/* Loading State */}
                <div className="p-8 flex flex-col items-center justify-center opacity-40 mt-2">
                  <div className="flex gap-1.5 mb-3">
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                    />
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
                    />
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0.4 }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground tracking-[0.2em] uppercase">
                    {t?.scanning || "Scanning..."}
                  </span>
                </div>
              </>
            )}

            {activeTab === "components" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <Suspense fallback={<LoadingFallback />}>
                  <DesignSystemGallery onBack={() => setActiveTab("profile")} />
                </Suspense>
              </motion.div>
            )}

            {activeTab === "profile" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <Suspense fallback={<LoadingFallback />}>
                  <UserProfileView
                    onNavigate={setActiveTab}
                    onOpenArchive={() => setIsArchiveOpen(true)}
                    onOpenInvite={() => setIsInviteOpen(true)}
                    onOpenCharts={() => setIsChartsOpen(true)} // Added charts handler
                  />
                </Suspense>
              </motion.div>
            )}

            {activeTab === "discover" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="pb-4"
              >
                {AI_DISCOVER_DATA[activeCategory]?.map((report) => (
                  <CardFactory
                    key={report.id}
                    data={{
                      id: report.id,
                      type: "discover",
                      title: report.title,
                      category: report.category,
                      description: report.description,
                      growth: report.growth,
                      tags: report.tags,
                      trendData: report.trendData,
                    }}
                    onClick={() => setSelectedReport(String(report.id))}
                  />
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* Bottom Navigation */}
        <FloatingDock
          items={navItems}
          activeId={activeTab}
          onTabChange={setActiveTab}
          onChatClick={() => setIsChatOpen(true)}
        />

        {/* Bottom Fade Overlay - 使用公用组件 */}
        <BottomFadeOverlay />
      </div>

      {/* Task Action Sheet */}
      <Suspense fallback={null}>
        <TaskActionSheet
          isOpen={isTaskActionSheetOpen}
          onClose={() => setIsTaskActionSheetOpen(false)}
          onSelectTask={(task) => {
            setSelectedTask(task)
            setIsTaskActionSheetOpen(false)
          }}
        />
      </Suspense>

      {/* Create Task View */}
      {selectedTask && (
        <Suspense fallback={null}>
          <div className="fixed inset-0 z-[200]">
            <CreateTaskView
              task={selectedTask}
              onComplete={(data) => {
                console.log("Task created:", data)
                setSelectedTask(null)
                // TODO: 导航到任务列表或显示成功消息
              }}
              onBack={() => setSelectedTask(null)}
            />
          </div>
        </Suspense>
      )}
    </div>
  )
}
