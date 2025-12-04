/**
 * 报告布局组件统一导出
 * 每个报告类型可以使用不同的布局组件
 */

export { TabsStickyLayout } from "./tabs-sticky-layout"
export { SinglePageLayout } from "./single-page-layout"

// 布局组件映射表（AI友好：布局类型 -> 布局组件）
export const LAYOUT_COMPONENTS = {
  "tabs-sticky": () => import("./tabs-sticky-layout").then((m) => ({ default: m.TabsStickyLayout })),
  "single-page": () => import("./single-page-layout").then((m) => ({ default: m.SinglePageLayout })),
  // 可以继续添加其他布局类型
  // "tabs-static": () => import("./tabs-static-layout").then((m) => ({ default: m.TabsStaticLayout })),
  // "accordion": () => import("./accordion-layout").then((m) => ({ default: m.AccordionLayout })),
} as const

