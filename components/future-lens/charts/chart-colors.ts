/**
 * Future Lens 图表颜色系统
 * 
 * 设计理念：
 * - 统一调色板：基于现代化调色板（COLORS #17）设计
 * - 语义化：颜色具有明确的语义含义
 * - 深色模式适配：自动适配浅色/深色模式
 * - 统一规范：所有图表统一使用此颜色系统
 * - 完整覆盖：所有6个基础颜色都被使用，并基于此扩展更多变体
 * 
 * 调色板来源：VIDEOINFOGRAPHICA.COM/COLORS #17
 * 基础6色：
 * - #45AAB4 (青绿色) - 用于增长、成功、次要数据
 * - #038DB2 (亮蓝色) - 用于主系列、信息、核心数据
 * - #206491 (深蓝色) - 用于资本、深度分析、第三系列
 * - #F9637C (粉红色) - 用于危险、热度、负面数据
 * - #FE7A66 (橙色) - 用于警告、活跃数据、第五系列
 * - #FBB45C (金黄色) - 用于警告、高亮、第六系列
 * 
 * 使用场景指南：
 * 
 * 【语义化颜色】- 用于表达数据含义
 * - success: 增长趋势、达成目标、正向指标、盈利数据
 * - danger: 下降趋势、未达标、风险指标、亏损数据
 * - warning: 需要关注但不紧急、波动数据、待确认信息
 * - info: 中性数据、参考线、辅助信息、基准值
 * 
 * 【数据系列颜色】- 用于多系列图表，按优先级顺序使用
 * - primary: 最重要的数据系列（如：主要产品线、核心指标）
 * - secondary: 次要数据系列（如：次要产品、对比数据）
 * - tertiary: 第三重要系列（如：历史数据、参考系列）
 * - quaternary: 第四系列（如：预测数据、辅助指标）
 * - quinary: 第五系列（如：背景数据、次要对比）
 * - senary: 第六系列（如：补充数据、额外维度）
 * - septenary 及以后: 扩展系列，用于复杂多系列图表
 * 
 * 【特殊场景颜色】- 用于特定业务场景
 * - growth: 增长相关（营收增长、用户增长、市场扩张）
 * - capital: 资本相关（融资、估值、投资回报）
 * - heat: 热度相关（热门产品、趋势话题、活跃度）
 * - revenue: 收入相关（营收、销售额、订阅收入）
 * - profit: 利润相关（净利润、毛利率、盈利能力）
 * - market: 市场相关（市场份额、竞争分析、市场定位）
 * 
 * @example
 * ```tsx
 * import { ChartColors } from '@/components/future-lens/charts/chart-colors'
 * 
 * // 语义化颜色 - 用于表达数据含义
 * <Area stroke={ChartColors.semantic.success} />  // 增长数据
 * <Line stroke={ChartColors.semantic.danger} />   // 下降数据
 * 
 * // 数据系列颜色 - 用于多系列图表
 * <Line stroke={ChartColors.series.primary} />    // 主系列
 * <Line stroke={ChartColors.series.secondary} />  // 次系列
 * 
 * // 特殊场景颜色 - 用于特定业务场景
 * <Bar fill={ChartColors.context.growth} />       // 增长场景
 * <Bar fill={ChartColors.context.capital} />     // 资本场景
 * ```
 */

/**
 * 图表颜色系统
 * 所有颜色通过 CSS 变量定义，支持深色模式自动适配
 */
export const ChartColors = {
  /**
   * 语义化颜色（Semantic Colors）
   * 用于表达数据含义，自动适配深色模式
   * 
   * 使用场景：
   * - success: 增长趋势、达成目标、正向指标、盈利数据
   * - danger: 下降趋势、未达标、风险指标、亏损数据
   * - warning: 需要关注但不紧急、波动数据、待确认信息
   * - info: 中性数据、参考线、辅助信息、基准值
   */
  semantic: {
    /** 成功/增长/正面数据 - 青绿色 (#45AAB4) */
    success: "var(--chart-semantic-success)",
    /** 危险/下降/负面数据 - 粉红色 (#F9637C) */
    danger: "var(--chart-semantic-danger)",
    /** 警告/注意 - 金黄色 (#FBB45C) */
    warning: "var(--chart-semantic-warning)",
    /** 信息/中性 - 亮蓝色 (#038DB2) */
    info: "var(--chart-semantic-info)",
  },

  /**
   * 数据系列颜色（Data Series Colors）
   * 用于多系列图表，按优先级顺序使用
   * 基于统一调色板，固定颜色值，保证在浅色/深色模式下都有良好的可读性
   * 
   * 使用场景：
   * - primary: 最重要的数据系列（如：主要产品线、核心指标）
   * - secondary: 次要数据系列（如：次要产品、对比数据）
   * - tertiary: 第三重要系列（如：历史数据、参考系列）
   * - quaternary: 第四系列（如：预测数据、辅助指标）
   * - quinary: 第五系列（如：背景数据、次要对比）
   * - senary: 第六系列（如：补充数据、额外维度）
   * - septenary 及以后: 扩展系列，用于复杂多系列图表（12+系列）
   */
  series: {
    /** 主系列 - 亮蓝色 (#038DB2) - 最重要的数据 */
    primary: "var(--chart-series-1)",
    /** 次系列 - 青绿色 (#45AAB4) - 次要数据 */
    secondary: "var(--chart-series-2)",
    /** 第三系列 - 深蓝色 (#206491) - 第三重要数据 */
    tertiary: "var(--chart-series-3)",
    /** 第四系列 - 粉红色 (#F9637C) - 第四重要数据 */
    quaternary: "var(--chart-series-4)",
    /** 第五系列 - 橙色 (#FE7A66) - 第五重要数据 */
    quinary: "var(--chart-series-5)",
    /** 第六系列 - 金黄色 (#FBB45C) - 第六重要数据 */
    senary: "var(--chart-series-6)",
    /** 第七系列 - 亮蓝色浅色变体 - 扩展系列 */
    septenary: "var(--chart-series-7)",
    /** 第八系列 - 青绿色浅色变体 - 扩展系列 */
    octonary: "var(--chart-series-8)",
    /** 第九系列 - 深蓝色浅色变体 - 扩展系列 */
    nonary: "var(--chart-series-9)",
    /** 第十系列 - 粉红色浅色变体 - 扩展系列 */
    denary: "var(--chart-series-10)",
    /** 第十一系列 - 橙色浅色变体 - 扩展系列 */
    undenary: "var(--chart-series-11)",
    /** 第十二系列 - 金黄色浅色变体 - 扩展系列 */
    duodenary: "var(--chart-series-12)",
  },

  /**
   * 特殊场景颜色（Context Colors）
   * 用于特定业务场景，复用系列颜色以保证一致性
   * 
   * 使用场景：
   * - growth: 增长相关（营收增长、用户增长、市场扩张）
   * - capital: 资本相关（融资、估值、投资回报）
   * - heat: 热度相关（热门产品、趋势话题、活跃度）
   * - revenue: 收入相关（营收、销售额、订阅收入）
   * - profit: 利润相关（净利润、毛利率、盈利能力）
   * - market: 市场相关（市场份额、竞争分析、市场定位）
   */
  context: {
    /** 增长相关数据 - 青绿色 (#45AAB4) - 营收增长、用户增长、市场扩张 */
    growth: "var(--chart-context-growth)",
    /** 资本相关数据 - 深蓝色 (#206491) - 融资、估值、投资回报 */
    capital: "var(--chart-context-capital)",
    /** 热度相关数据 - 粉红色 (#F9637C) - 热门产品、趋势话题、活跃度 */
    heat: "var(--chart-context-heat)",
    /** 收入相关数据 - 亮蓝色 (#038DB2) - 营收、销售额、订阅收入 */
    revenue: "var(--chart-context-revenue)",
    /** 利润相关数据 - 橙色 (#FE7A66) - 净利润、毛利率、盈利能力 */
    profit: "var(--chart-context-profit)",
    /** 市场相关数据 - 金黄色 (#FBB45C) - 市场份额、竞争分析、市场定位 */
    market: "var(--chart-context-market)",
  },

  /**
   * UI 元素颜色（UI Element Colors）
   * 用于图表中的 UI 元素，自动适配深色模式
   */
  ui: {
    /** 网格线颜色 */
    grid: "var(--chart-ui-grid)",
    /** 坐标轴颜色 */
    axis: "var(--chart-ui-axis)",
    /** 文字颜色 */
    text: {
      primary: "var(--chart-ui-text-primary)",
      secondary: "var(--chart-ui-text-secondary)",
      muted: "var(--chart-ui-text-muted)",
    },
    /** 背景颜色 */
    background: "var(--chart-ui-bg)",
  },
} as const

/**
 * 图表颜色原始值（用于 SVG 渐变等需要固定值的场景）
 * 这些值在浅色和深色模式下保持一致，保证数据可读性
 * 基于统一调色板：VIDEOINFOGRAPHICA.COM/COLORS #17
 * 
 * 扩展说明：
 * - 基础6色：直接使用调色板原始颜色
 * - 扩展系列（7-12）：基于基础颜色生成浅色变体（+20% 亮度）
 */
export const ChartColorsRaw = {
  semantic: {
    success: "#45AAB4",      // 青绿色 - 成功/增长
    danger: "#F9637C",        // 粉红色 - 危险/下降
    warning: "#FBB45C",       // 金黄色 - 警告
    info: "#038DB2",          // 亮蓝色 - 信息
  },
  series: {
    // 基础6色（直接使用调色板）
    primary: "#038DB2",       // 亮蓝色 - 主系列
    secondary: "#45AAB4",     // 青绿色 - 次系列
    tertiary: "#206491",      // 深蓝色 - 第三系列
    quaternary: "#F9637C",    // 粉红色 - 第四系列
    quinary: "#FE7A66",       // 橙色 - 第五系列
    senary: "#FBB45C",        // 金黄色 - 第六系列
    // 扩展系列（基于基础颜色生成浅色变体）
    septenary: "#1AA8C2",     // 亮蓝色浅色变体 - 第七系列
    octonary: "#5DB8C4",      // 青绿色浅色变体 - 第八系列
    nonary: "#3A7AA1",        // 深蓝色浅色变体 - 第九系列
    denary: "#FF7A8C",        // 粉红色浅色变体 - 第十系列
    undenary: "#FF9A86",      // 橙色浅色变体 - 第十一系列
    duodenary: "#FFC966",     // 金黄色浅色变体 - 第十二系列
  },
  context: {
    growth: "#45AAB4",        // 青绿色 - 增长
    capital: "#206491",        // 深蓝色 - 资本
    heat: "#F9637C",         // 粉红色 - 热度
    revenue: "#038DB2",       // 亮蓝色 - 收入
    profit: "#FE7A66",        // 橙色 - 利润
    market: "#FBB45C",        // 金黄色 - 市场
  },
  /**
   * UI 元素颜色原始值（用于 SVG 等需要固定值的场景）
   * 这些值在浅色和深色模式下可能需要调整
   * 不使用纯黑色，使用调色板中的深色
   */
  ui: {
    grid: "#e2e8f0",          // Slate 200 - 网格线（浅色模式）
    axis: "#64748b",          // Slate 500 - 坐标轴（浅色模式）
    text: {
      primary: "#263B58",     // 深蓝灰色 - 主文字（替代纯黑色，基于扩展颜色）
      secondary: "#64748b",   // Slate 500 - 次级文字（浅色模式）
      muted: "#94a3b8",       // Slate 400 - 轻文字（浅色模式）
    },
  },
} as const

/**
 * 图表颜色类型定义
 */
export type ChartColorKey = 
  | keyof typeof ChartColors.semantic
  | keyof typeof ChartColors.series
  | keyof typeof ChartColors.context

