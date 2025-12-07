"use client"

import { useState, useEffect, lazy, Suspense } from "react"
import { motion } from "framer-motion"
import { useRouter, useSearchParams } from "next/navigation" // Import useRouter and useSearchParams for navigation
import { User, Plus, Search, Globe, Layers } from "lucide-react"
import { CardFactory } from "./cards/card-factory"
import { CardRenderer } from "./ai-report/card-renderer"
import { AIOrb } from "./ui/ai-orb"
import { useAppConfig } from "@/lib/future-lens/config-context"
import { translations } from "@/lib/future-lens/i18n"
import type { InsightData } from "@/lib/future-lens/types"
import { getAINOConfig } from "@/lib/aino-sdk/config"
import { getIndustryAnalysisReportList } from "@/lib/future-lens/api/industry-analysis-api"
import { AppBackground } from "./ds/app-background" // Import new background component
import { GlassPanel } from "./ds/glass-panel" // Import new glass panel
import { DesignTokens } from "@/lib/future-lens/design-tokens"
import { DiscoverHeader } from "./discover/discover-header"
import { DEFAULT_AGENTS, loadCustomAgents, saveCustomAgents, getOrderedAndFilteredAgents } from "@/lib/future-lens/data/default-agents"
import type { Agent, FilterState } from "@/lib/future-lens/types/agent-types"
import { FloatingDock } from "./nav/floating-dock" // Import FloatingDock component
import { BottomFadeOverlay } from "./nav/bottom-fade-overlay" // Import BottomFadeOverlay component
import { NotificationBell } from "./ui/notification-bell" // Import notification bell
import { getAllEvents, getTaskListWithUnreadCount } from "@/lib/future-lens/api/task-event-api-mock" // Import event API
import type { ReportWithCards, CardInstance } from "@/lib/future-lens/types/card-types"
import { TaskCard } from "./cards/task-card" // Import TaskCard component

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

// 任务数据现在通过 API 加载，不再硬编码

const AI_DISCOVER_DATA = {
  industry: [
    // 本地数据参考（置顶）
    {
      id: "ai-industry-report-v1",
      title: "AI产业分析",
      category: "产业分析 · 本地参考",
      description:
        "具身智能产业正处于从实验室走向商业试运营的临界点。尽管资本热度高涨，但供应链脆弱性与商业化闭环仍是最大挑战。建议关注掌握数据闭环的平台型企业。",
      growth: "+87%",
      tags: ["产业报告", "全局分析", "16张卡片", "本地数据"],
      trendData: [20, 25, 22, 30, 35, 42, 38, 45, 48, 52],
      isLocal: true, // 标记为本地数据
    },
    // AI产业分析（后端数据）
    {
      id: "industry-analysis-ai",
      title: "AI产业分析报告",
      category: "产业分析 · 后端数据",
      description:
        "人工智能产业正处于快速发展期，技术创新和资本投入持续增长。从产业结构到趋势分析，从资金流向到生态建设，17张卡片全方位呈现AI产业现状。",
      growth: "+95%",
      tags: ["产业报告", "AI产业", "17张卡片", "后端数据"],
      trendData: [30, 35, 40, 45, 50, 55, 60, 65, 70, 75],
      industry: "ai", // 标记产业类型
      isBackend: true, // 标记为后端数据
    },
    // 区块链产业分析（后端数据）
    {
      id: "industry-analysis-blockchain",
      title: "区块链产业分析报告",
      category: "产业分析 · 后端数据",
      description:
        "区块链产业正在从概念验证向实际应用转变。技术突破、生态建设、应用落地是当前的核心趋势。17张卡片全面分析区块链产业的发展现状和未来机遇。",
      growth: "+78%",
      tags: ["产业报告", "区块链产业", "17张卡片", "后端数据"],
      trendData: [25, 28, 32, 35, 38, 42, 45, 48, 50, 52],
      industry: "blockchain", // 标记产业类型
      isBackend: true, // 标记为后端数据
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
  business: [
    {
      id: "ai-business-report-v1",
      title: "AI商业分析",
      category: "商业分析 · 战略洞察",
      description:
        "深度解析商业模式、竞争格局、市场机会与风险。从价值链到盈利模式，从市场定位到增长策略，16张卡片构建完整商业画像。",
      growth: "+85%",
      tags: ["商业报告", "战略分析", "16张卡片"],
      trendData: [22, 24, 26, 28, 30, 32, 34, 36, 38, 40],
    },
  ],
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
  const [selectedInsight, setSelectedInsight] = useState<InsightData | null>(null)
  const [selectedReport, setSelectedReport] = useState<string | null>(null) // Added state for selected AI report
  const [industryReportList, setIndustryReportList] = useState<Array<any>>([]) // 动态获取的产业分析列表
  const [industryListLoading, setIndustryListLoading] = useState(false) // 加载状态
  
  // 智能体相关状态 - 使用排序和关注筛选后的列表
  const [agents, setAgents] = useState<Agent[]>(() => {
    // 获取排序和筛选后的智能体列表
    return getOrderedAndFilteredAgents()
  })
  
  // 监听 localStorage 变化，重新加载排序和筛选后的列表
  useEffect(() => {
    const handleStorageChange = () => {
      const orderedAgents = getOrderedAndFilteredAgents()
      setAgents(orderedAgents)
    }
    
    // 初始加载
    handleStorageChange()
    
    // 监听 storage 事件（跨标签页同步）
    window.addEventListener('storage', handleStorageChange)
    
    // 定期检查（用于同标签页内的更新）
    const interval = setInterval(handleStorageChange, 500)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])
  const [activeAgentId, setActiveAgentId] = useState<string>('industry')
  const [viewMode, setViewMode] = useState<'recommended' | 'all'>('all')
  const [filters, setFilters] = useState<FilterState>({})
  const [isSearchOpen, setIsSearchOpen] = useState(false) // Add state for search view
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isArchiveOpen, setIsArchiveOpen] = useState(false) // Added state for personal archive view
  const [isInviteOpen, setIsInviteOpen] = useState(false) // Add state for invite friends view
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false) // Add notifications state
  const [isChartsOpen, setIsChartsOpen] = useState(false) // Add charts state
  const [isTaskActionSheetOpen, setIsTaskActionSheetOpen] = useState(false) // Add task action sheet state
  const [selectedTask, setSelectedTask] = useState<any>(null) // Selected task for creation
  // 任务列表数据（首页显示所有任务，每个任务显示最新事件）
  const [taskList, setTaskList] = useState<Array<{
    taskId: string
    taskName: string
    latestEvent: CardInstance
    unreadCount: number
    unreadEventIds: string[]
  }>>([])
  const [tasksLoading, setTasksLoading] = useState(true)

  // 初始化已读状态（强制重置为默认状态，用于演示）
  useEffect(() => {
    if (typeof window !== "undefined") {
      // 清除旧的已读状态
      localStorage.removeItem("future-lens-read-status")
      localStorage.removeItem("read-status-initialized")
      // 导入并重置为默认状态
      import("@/lib/future-lens/utils/read-status-manager").then((module) => {
        module.resetToDefaultReadStatus()
        // 标记已初始化
        localStorage.setItem("read-status-initialized", "true")
      })
    }
  }, [])

  // 加载任务列表（包含未读计数）
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setTasksLoading(true)
        const data = await getTaskListWithUnreadCount()
        setTaskList(data)
      } catch (error) {
        console.error("[MobileShell] 加载任务列表失败:", error)
      } finally {
        setTasksLoading(false)
      }
    }

    loadTasks()
  }, [])
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

  // 加载产业分析报告列表（从后端动态获取）
  useEffect(() => {
    const loadIndustryReportList = async () => {
      if (activeTab !== "discover" || activeAgentId !== "industry") {
        return
      }
      
      try {
        setIndustryListLoading(true)
        const config = getAINOConfig()
        // 优先从URL参数获取applicationId，其次使用配置中的默认值
        const urlAppId = typeof window !== 'undefined' 
          ? new URLSearchParams(window.location.search).get('applicationId')
          : null
        const appId = urlAppId || config.applicationId || '35c7a96a-7567-46ef-a29d-b03f8a7052a3'
        console.log('[MobileShell] 使用应用ID加载产业分析列表:', appId)
        const reports = await getIndustryAnalysisReportList(appId, "industry-analysis")
        console.log('[MobileShell] 加载到产业分析报告列表:', reports.length, reports)
        setIndustryReportList(reports)
      } catch (error) {
        console.error('[MobileShell] 加载产业分析报告列表失败:', error)
        setIndustryReportList([])
      } finally {
        setIndustryListLoading(false)
      }
    }
    
    loadIndustryReportList()
  }, [activeTab, activeAgentId, searchParams])

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

  // 处理添加智能体
  const handleAddAgent = (agent: Omit<Agent, 'id'>) => {
    const newAgent: Agent = {
      ...agent,
      id: `custom-${Date.now()}`,
    }
    const updatedAgents = [...agents, newAgent]
    setAgents(updatedAgents)
    saveCustomAgents(updatedAgents.filter(a => a.type === 'custom'))
    setActiveAgentId(newAgent.id)
  }

  const handleAgentsChange = (updatedAgents: Agent[]) => {
    // 保存自定义智能体
    saveCustomAgents(updatedAgents.filter(a => a.type === 'custom'))
    // 重新加载排序和筛选后的列表
    const orderedAgents = getOrderedAndFilteredAgents()
    setAgents(orderedAgents)
  }

  // 处理智能体切换
  const handleAgentChange = (agentId: string) => {
    setActiveAgentId(agentId)
    // 切换智能体时重置筛选
    setFilters({})
  }

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
              <DiscoverHeader
                agents={agents}
                activeAgentId={activeAgentId}
                onAgentChange={handleAgentChange}
                onAddAgent={handleAddAgent}
                onAgentsChange={handleAgentsChange}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                filters={filters}
                onFiltersChange={setFilters}
                onSearch={() => setIsSearchOpen(true)}
              />
            </div>
          )}

          {/* Content List - Using Factory */}
          <div className={`${DesignTokens.layout.containerPadding} mt-1`}>
            {activeTab === "push" && (
              <>
                {/* 预留：任务筛选器（现在不显示，但结构已预留） */}
                {/* <TaskFilter tasks={tasks} onFilterChange={handleFilterChange} /> */}

                {tasksLoading ? (
                  <div className="p-8 flex flex-col items-center justify-center opacity-40">
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
                      加载中...
                    </span>
                  </div>
                ) : (
                  taskList.map((task) => {
                    const latestEventId = task.latestEvent.metadata?.eventId || "event-001"
                    
                    // 点击逻辑：未读=0或1直接进入详情，未读≥2进入未读列表页
                    const handleClick = () => {
                      if (task.unreadCount >= 2) {
                        // 多个未读，进入未读列表页
                        router.push(`/task/${task.taskId}/unread`)
                      } else {
                        // 0个或1个未读，直接进入事件详情页
                        router.push(`/event/${latestEventId}`)
                      }
                    }
                    
                    const handleViewUnread = () => {
                      // 查看未读按钮点击
                      router.push(`/task/${task.taskId}/unread`)
                    }
                    
                    return (
                      <TaskCard
                        key={task.taskId}
                        taskId={task.taskId}
                        taskName={task.taskName}
                        latestEvent={task.latestEvent.data as any}
                        unreadCount={task.unreadCount}
                        onClick={handleClick}
                        onViewUnread={handleViewUnread}
                      />
                    )
                  })
                )}

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
                    onNavigate={(tabId) => setActiveTab(tabId as TabId)}
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
                {(() => {
                  // 根据当前选中的智能体过滤数据
                  const activeAgent = agents.find(a => a.id === activeAgentId)
                  const agentCategory = activeAgent?.category || 'industry'
                  
                  // 如果是产业分析分类，合并本地数据和后端数据
                  let reportsToShow = AI_DISCOVER_DATA[agentCategory as keyof typeof AI_DISCOVER_DATA] || []
                  
                  if (agentCategory === "industry") {
                    // 本地数据（置顶，只显示isLocal=true的）+ 后端数据
                    const localReports = AI_DISCOVER_DATA.industry.filter((r: any) => r.isLocal)
                    // 过滤掉本地数据中与后端数据重复的（通过industry字段匹配）
                    const backendIndustries = new Set(industryReportList.map((r: any) => r.industry).filter(Boolean))
                    const uniqueLocalReports = localReports.filter((r: any) => {
                      // 如果本地数据有industry字段且后端也有，则过滤掉本地数据
                      if (r.industry && backendIndustries.has(r.industry)) {
                        return false
                      }
                      return true
                    })
                    reportsToShow = [...uniqueLocalReports, ...industryReportList]
                    
                    if (industryListLoading) {
                      return (
                        <div className="p-8 flex flex-col items-center justify-center opacity-40">
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
                            加载中...
                          </span>
                        </div>
                      )
                    }
                  }
                  
                  return reportsToShow.map((report) => {
                    const handleClick = () => {
                      console.log('[MobileShell] 点击报告卡片:', report.id, report)
                      // 如果是后端数据的产业分析，跳转到产业分析页面
                      if ((report as any).isBackend && (report as any).industry) {
                        const config = getAINOConfig()
                        // 使用正确的应用ID（确保使用35c7a96a-7567-46ef-a29d-b03f8a7052a3）
                        const appId = config.applicationId || '35c7a96a-7567-46ef-a29d-b03f8a7052a3'
                        const targetUrl = `/industry-analysis?applicationId=${appId}&industry=${(report as any).industry}`
                        console.log('[MobileShell] 跳转到:', targetUrl)
                        // 使用 window.location.href 确保路由跳转
                        window.location.href = targetUrl
                      } else {
                        // 本地数据或其他报告，使用原有逻辑
                        console.log('[MobileShell] 使用原有逻辑，设置selectedReport:', report.id)
                        setSelectedReport(String(report.id))
                      }
                    }
                    
                    return (
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
                        onClick={handleClick}
                      />
                    )
                  })
                })()}
              </motion.div>
            )}
          </div>
        </div>

        {/* Bottom Navigation */}
        <FloatingDock
          items={navItems}
          activeId={activeTab}
          onTabChange={(id) => setActiveTab(id as TabId)}
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
