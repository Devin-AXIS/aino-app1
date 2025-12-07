/**
 * 默认智能体数据
 */
import { Sparkles, Building2, Briefcase, TrendingUp } from "lucide-react"
import type { Agent } from "../types/agent-types"

export const DEFAULT_AGENTS: Agent[] = [
  {
    id: 'industry',
    name: '产业分析',
    icon: Sparkles,
    type: 'system',
    category: 'industry',
    config: {
      defaultView: 'all',
      filterFields: [
        {
          key: 'industry',
          label: '行业',
          type: 'multiselect',
          options: [
            { label: '人工智能', value: 'ai' },
            { label: '区块链', value: 'blockchain' },
            { label: '物联网', value: 'iot' },
            { label: '智能制造', value: 'smart-manufacturing' },
            { label: '新能源', value: 'new-energy' },
            { label: '生物医药', value: 'biotech' },
            { label: '金融科技', value: 'fintech' },
          ]
        },
        {
          key: 'status',
          label: '状态',
          type: 'select',
          options: [
            { label: '全部', value: 'all' },
            { label: '已发布', value: 'published' },
            { label: '草稿', value: 'draft' },
          ]
        }
      ]
    }
  },
  {
    id: 'enterprise',
    name: '企业分析',
    icon: Building2,
    type: 'system',
    category: 'enterprise',
    config: {
      defaultView: 'all',
      filterFields: []
    }
  },
  {
    id: 'project',
    name: '项目分析',
    icon: Briefcase,
    type: 'system',
    category: 'project',
    config: {
      defaultView: 'all',
      filterFields: []
    }
  },
  {
    id: 'stock',
    name: '股票分析',
    icon: TrendingUp,
    type: 'system',
    category: 'stock',
    config: {
      defaultView: 'all',
      filterFields: []
    }
  },
]

/**
 * 从 localStorage 加载自定义智能体
 * 注意：组件类型的 icon 无法序列化，只保存字符串类型的 icon
 */
export function loadCustomAgents(): Agent[] {
  if (typeof window === 'undefined') return []
  
  try {
    const saved = localStorage.getItem('custom-agents')
    if (saved) {
      const agents = JSON.parse(saved)
      // 确保所有 agent 都有有效的结构，并且 icon 只能是字符串
      return agents
        .filter((agent: any) => agent && agent.id && agent.name)
        .map((agent: any) => ({
          ...agent,
          // 确保 icon 只保留字符串类型，移除任何对象类型的 icon
          icon: typeof agent.icon === 'string' ? agent.icon : undefined,
        }))
    }
  } catch (e) {
    console.error('加载自定义智能体失败:', e)
  }
  
  return []
}

/**
 * 保存自定义智能体到 localStorage
 * 注意：只保存可以序列化的数据，组件类型的 icon 会被忽略
 */
export function saveCustomAgents(agents: Agent[]): void {
  if (typeof window === 'undefined') return
  
  try {
    // 只保存自定义智能体，并且只保存可序列化的字段
    const customAgents = agents
      .filter(agent => agent.type === 'custom')
      .map(agent => ({
        id: agent.id,
        name: agent.name,
        icon: typeof agent.icon === 'string' ? agent.icon : undefined, // 只保存字符串类型的 icon
        type: agent.type,
        category: agent.category,
        config: agent.config,
      }))
    
    localStorage.setItem('custom-agents', JSON.stringify(customAgents))
  } catch (e) {
    console.error('保存自定义智能体失败:', e)
  }
}

