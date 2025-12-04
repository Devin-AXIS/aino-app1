/**
 * 图表默认配置
 * 统一管理所有图表的默认样式和行为
 * 使用统一的图表颜色系统
 * 参考 ScrollableMomentumChart 的现代极简设计
 */
import { ChartColorsRaw } from "./chart-colors"

export const ChartDefaults = {
  /** 图表颜色（使用统一的颜色系统，基于调色板 COLORS #17） */
  /** 包含基础6色 + 扩展6色，共12个颜色，支持复杂多系列图表 */
  colors: [
    ChartColorsRaw.series.primary,      // 主系列 - 亮蓝色
    ChartColorsRaw.series.secondary,    // 次系列 - 青绿色
    ChartColorsRaw.series.tertiary,     // 第三系列 - 深蓝色
    ChartColorsRaw.series.quaternary,   // 第四系列 - 粉红色
    ChartColorsRaw.series.quinary,      // 第五系列 - 橙色
    ChartColorsRaw.series.senary,      // 第六系列 - 金黄色
    ChartColorsRaw.series.septenary,    // 第七系列 - 亮蓝色浅色变体
    ChartColorsRaw.series.octonary,     // 第八系列 - 青绿色浅色变体
    ChartColorsRaw.series.nonary,       // 第九系列 - 深蓝色浅色变体
    ChartColorsRaw.series.denary,       // 第十系列 - 粉红色浅色变体
    ChartColorsRaw.series.undenary,     // 第十一系列 - 橙色浅色变体
    ChartColorsRaw.series.duodenary,     // 第十二系列 - 金黄色浅色变体
  ],

  /** 统一高度（参考 ScrollableMomentumChart） */
  height: 160,

  /** 统一文字样式 */
  fontSize: {
    title: "9px",        // 标题字体（uppercase tracking-wider）
    axis: "9px",         // 坐标轴字体
    legend: "8px",       // 图例字体
    tooltip: "10px",     // Tooltip 标题
    tooltipValue: "11px", // Tooltip 数值
  },
  fontFamily: "var(--font-geist-sans)",


  /** 圆角 */
  borderRadius: 16,

  /** 网格样式（使用统一的 UI 颜色） */
  gridColor: ChartColorsRaw.ui.grid,
  gridOpacity: 0.2,

  /** 工具提示样式 */
  tooltipBg: "hsl(var(--card))",
  tooltipBorder: "hsl(var(--border))",

  /** 动画配置 */
  animationDuration: 300,

  /** 默认数值格式化 */
  defaultFormatter: (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`
    }
    return value.toString()
  },
}

