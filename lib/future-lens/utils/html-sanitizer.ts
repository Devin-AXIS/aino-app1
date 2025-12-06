/**
 * HTML 安全过滤工具
 * 用于详情页内容的安全渲染，防止 XSS 攻击
 */

import type { Config } from "isomorphic-dompurify"

// 只在客户端导入 DOMPurify，避免服务端 jsdom 问题
let DOMPurify: any = null

// 初始化 DOMPurify（只在客户端）
if (typeof window !== "undefined") {
  try {
    // 使用动态导入避免服务端问题
    import("isomorphic-dompurify")
      .then((mod) => {
        DOMPurify = mod.default
      })
      .catch((err) => {
        console.warn("DOMPurify 加载失败，使用基础清理:", err)
      })
  } catch (err) {
    console.warn("DOMPurify 初始化失败:", err)
  }
}

/**
 * DOMPurify 配置：允许的 HTML 标签和属性
 * 严格限制，只允许安全的标签和属性
 */
const SANITIZE_CONFIG: Config = {
  // 允许的 HTML 标签
  ALLOWED_TAGS: [
    // 文本标签
    "p",
    "div",
    "span",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "strong",
    "em",
    "b",
    "i",
    "u",
    "s",
    "br",
    "hr",
    // 列表
    "ul",
    "ol",
    "li",
    "dl",
    "dt",
    "dd",
    // 链接和引用
    "a",
    "blockquote",
    "cite",
    "q",
    // 代码
    "code",
    "pre",
    "kbd",
    "samp",
    // 媒体（H5 支持）
    "img",
    "video",
    "audio",
    "source",
    "track",
    "canvas",
    // 表格
    "table",
    "thead",
    "tbody",
    "tfoot",
    "tr",
    "th",
    "td",
    "caption",
    "colgroup",
    "col",
    // 语义化标签
    "section",
    "article",
    "header",
    "footer",
    "nav",
    "aside",
    "main",
    "figure",
    "figcaption",
      // 其他
      "details",
      "summary",
      "mark",
      "time",
      "small",
      "sub",
      "sup",
      // SVG 支持
      "svg",
      "g",
      "path",
      "circle",
      "rect",
      "line",
      "polyline",
      "polygon",
      "ellipse",
      "text",
      "tspan",
      "defs",
      "marker",
      "linearGradient",
      "radialGradient",
      "stop",
      "pattern",
      "clipPath",
      "mask",
      // SVG 动画支持
      "animate",
      "animateTransform",
      "animateMotion",
      "set",
      // 样式支持
      "style",
    ],

  // 允许的 HTML 属性
  ALLOWED_ATTR: [
    // 通用属性
    "class",
    "id",
    "style",
    "title",
    "lang",
    "dir",
    // 链接属性
    "href",
    "target",
    "rel",
    // 媒体属性
    "src",
    "alt",
    "width",
    "height",
    "poster",
    "controls",
    "autoplay",
    "loop",
    "muted",
    "preload",
    "playsinline",
    // 视频/音频特定
    "crossorigin",
    "kind",
    "srclang",
    "label",
    "default",
    // 表格属性
    "colspan",
    "rowspan",
    "scope",
    "headers",
        // 其他
        "datetime",
        "cite",
        "open",
        "value",
        // SVG 属性
        "viewBox",
        "x",
        "y",
        "width",
        "height",
        "cx",
        "cy",
        "r",
        "rx",
        "ry",
        "x1",
        "y1",
        "x2",
        "y2",
        "points",
        "d",
        "fill",
        "stroke",
        "stroke-width",
        "opacity",
        "transform",
        "text-anchor",
        "font-size",
        "font-weight",
        "marker-end",
        "marker-start",
        "markerWidth",
        "markerHeight",
        "refX",
        "refY",
        "orient",
        // SVG 动画属性
        "attributeName",
        "attributeType",
        "begin",
        "dur",
        "end",
        "repeatCount",
        "repeatDur",
        "fill",
        "calcMode",
        "values",
        "keyTimes",
        "keySplines",
        "from",
        "to",
        "by",
        "type",
        "path",
        "keyPoints",
        "rotate",
        "accumulate",
        "additive",
      ],

  // 允许的 URL 协议（防止 javascript: 等危险协议）
  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,

  // 保留样式（用于设计系统一致性）
  KEEP_CONTENT: true,

  // 返回 DOM 对象（用于 react-markdown）
  RETURN_DOM: false,
  RETURN_DOM_FRAGMENT: false,
  RETURN_TRUSTED_TYPE: false,
}

/**
 * 基础 HTML 清理（服务端和客户端兜底）
 */
function basicSanitize(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
}

/**
 * 安全地清理 HTML 内容
 * @param html 原始 HTML 字符串
 * @returns 清理后的安全 HTML 字符串
 */
export function sanitizeHTML(html: string): string {
  // 服务端渲染时，使用基础清理
  if (typeof window === "undefined") {
    return basicSanitize(html)
  }
  
  // 客户端：优先使用 DOMPurify（如果已加载）
  if (DOMPurify) {
    try {
      const result = DOMPurify.sanitize(html, SANITIZE_CONFIG)
      return typeof result === "string" ? result : String(result)
    } catch (err) {
      console.warn("DOMPurify 清理失败，使用基础清理:", err)
      return basicSanitize(html)
    }
  }
  
  // DOMPurify 还未加载，使用基础清理
  return basicSanitize(html)
}

/**
 * 检查内容是否包含 HTML 标签
 * @param content 内容字符串
 * @returns 是否包含 HTML
 */
export function containsHTML(content: string): boolean {
  return /<[a-z][\s\S]*>/i.test(content)
}

