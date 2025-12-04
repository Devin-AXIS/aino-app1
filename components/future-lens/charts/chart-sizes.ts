// 图表尺寸配置（简化版，仅用于需要尺寸的组件）
export type ChartSize = "small" | "medium" | "large"

// 简化的尺寸配置函数（仅保留实际使用的属性）
export const getChartSize = (size: ChartSize = "medium") => {
  const configs = {
    small: { height: 120, barSize: 12, fontSize: 10, radius: 4, barGap: "10%" },
    medium: { height: 180, barSize: 18, fontSize: 11, radius: 6, barGap: "15%" },
    large: { height: 240, barSize: 24, fontSize: 12, radius: 8, barGap: "20%" },
  }
  return configs[size]
}
