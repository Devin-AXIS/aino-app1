/**
 * 卡片迁移使用示例
 * 
 * 这个文件展示了如何逐步迁移卡片
 * 可以复制这些代码到你的代码中使用
 */

import { 
  markCardAsMigrated, 
  markCardAsNotMigrated,
  getMigratedCards,
  getNotMigratedCards,
  isCardMigrated 
} from "./card-migration-config"

/**
 * 示例1：迁移第一个卡片（industry-stack）
 * 
 * 步骤：
 * 1. 确保后端数据已准备好（运行 test-module-import.sh）
 * 2. 在 industry-stack 目录创建测试数据
 * 3. 运行这个函数
 */
export function migrateFirstCard() {
  markCardAsMigrated("industry-stack", "第一个迁移的卡片 - 产业堆叠分析")
  console.log("✅ industry-stack 卡片已标记为已迁移")
  console.log("现在访问产业分析报告页面，industry-stack 卡片会从后端读取数据")
}

/**
 * 示例2：迁移第二个卡片（trend-radar）
 */
export function migrateSecondCard() {
  markCardAsMigrated("trend-radar", "第二个迁移的卡片 - 趋势雷达")
  console.log("✅ trend-radar 卡片已标记为已迁移")
}

/**
 * 示例3：回退卡片到Mock数据（如果后端数据有问题）
 */
export function rollbackCard(templateId: "industry-stack" | "trend-radar") {
  markCardAsNotMigrated(templateId)
  console.log(`✅ ${templateId} 卡片已回退到Mock数据`)
}

/**
 * 示例4：查看迁移状态
 */
export function checkMigrationStatus() {
  const migrated = getMigratedCards()
  const notMigrated = getNotMigratedCards()
  
  console.log("📊 卡片迁移状态：")
  console.log(`✅ 已迁移 (${migrated.length}):`, migrated)
  console.log(`⏸️  未迁移 (${notMigrated.length}):`, notMigrated)
  
  return { migrated, notMigrated }
}

/**
 * 示例5：批量迁移多个卡片（谨慎使用）
 * 
 * 建议：还是一个个迁移，确保每个都正常
 */
export function migrateMultipleCards(templateIds: Array<"industry-stack" | "trend-radar" | "structural-shift">) {
  templateIds.forEach((id) => {
    markCardAsMigrated(id, `批量迁移 - ${id}`)
  })
  console.log(`✅ 已迁移 ${templateIds.length} 个卡片:`, templateIds)
}

/**
 * 示例6：检查特定卡片是否已迁移
 */
export function checkCardStatus(templateId: "industry-stack" | "trend-radar") {
  const migrated = isCardMigrated(templateId)
  console.log(`${templateId} 迁移状态:`, migrated ? "✅ 已迁移（使用后端数据）" : "⏸️ 未迁移（使用Mock数据）")
  return migrated
}

// 使用示例（在浏览器控制台或代码中调用）：
/*
// 1. 迁移第一个卡片
migrateFirstCard()

// 2. 检查状态
checkMigrationStatus()

// 3. 如果后端数据有问题，回退
rollbackCard("industry-stack")

// 4. 检查特定卡片
checkCardStatus("industry-stack")
*/

