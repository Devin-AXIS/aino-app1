/**
 * 卡片系统统一导出
 * 提供所有卡片相关的组件和工具函数
 */

// 核心组件
export { CardFactory } from "./card-factory"
export { InsightCard } from "./insight-card"
export { DiscoverCard } from "./discover-card"
export { CardRenderer } from "../ai-report/card-renderer"

// 注册系统
export {
  registerCard,
  getCardComponent,
  getRegisteredCardTypes,
  isCardRegistered,
  getCardRegistry,
  type CardComponent,
  type CardRegistry,
} from "./card-registry"

// 初始化（自动执行）
export { initCardRegistry } from "./card-registry-init"

