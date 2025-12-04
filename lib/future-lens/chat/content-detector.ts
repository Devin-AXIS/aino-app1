/**
 * 内容类型检测工具
 * 用于检测用户发送的内容类型，以便 AI 回复相应类型的内容
 */

import type { MessagePart } from "./message-types"

/**
 * 检测文本内容的类型
 */
export function detectContentType(text: string): "table" | "html" | "card" | "markdown" | "text" {
  // 检测表格（Markdown 表格格式）
  if (/^\s*\|.*\|.*\|/m.test(text) || text.includes("|") && text.split("\n").some(line => line.includes("|") && line.split("|").length >= 3)) {
    return "table"
  }

  // 检测 HTML 代码块
  if (/```html[\s\S]*?```/i.test(text) || /<html[\s\S]*?<\/html>/i.test(text) || /<div[\s\S]*?style[\s\S]*?>/i.test(text)) {
    return "html"
  }

  // 检测卡片（JSON 格式或特定标记）
  if (/```json[\s\S]*?"componentName"[\s\S]*?```/i.test(text) || /"type":\s*"card"/i.test(text)) {
    return "card"
  }

  // 检测 Markdown（包含 Markdown 语法）
  if (/^#{1,6}\s|^\*\s|^-\s|^\d+\.\s|```|\[.*\]\(.*\)|!\[.*\]\(.*\)/m.test(text)) {
    return "markdown"
  }

  return "text"
}

/**
 * 检测文件类型
 */
export function detectFileType(file: File): "image" | "video" | "file" {
  if (file.type.startsWith("image/")) {
    return "image"
  }
  if (file.type.startsWith("video/")) {
    return "video"
  }
  return "file"
}

/**
 * 从文本中提取表格数据
 */
export function parseMarkdownTable(text: string): { headers: string[]; data: Array<Record<string, any>> } | null {
  // 提取所有包含 | 的行
  const lines = text.split("\n").filter(line => {
    const trimmed = line.trim()
    return trimmed.includes("|") && trimmed.length > 0
  })
  
  if (lines.length < 2) {
    return null
  }

  // 找到分隔符行的索引
  let separatorIndex = -1
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    // 检查是否是分隔符行（只包含 |、-、:、空格）
    if (/^[\s|:\-]+$/.test(line) && line.includes("|")) {
      separatorIndex = i
      break
    }
  }

  // 如果没有找到分隔符，假设第一行是表头
  const headerIndex = separatorIndex > 0 ? 0 : 0
  const dataStartIndex = separatorIndex > 0 ? separatorIndex + 1 : 1

  // 解析表头
  const headerLine = lines[headerIndex]
  const headers = headerLine
    .split("|")
    .map(h => h.trim())
    .filter(h => h && h.length > 0) // 过滤空字符串

  if (headers.length === 0) {
    return null
  }

  // 解析数据行（跳过分隔符行）
  const dataLines = lines.slice(dataStartIndex).filter(line => {
    const trimmed = line.trim()
    // 跳过空行和分隔符行
    if (!trimmed || trimmed.length === 0) return false
    if (/^[\s|:\-]+$/.test(trimmed)) return false
    
    const cells = trimmed.split("|").map(c => c.trim())
    return cells.length > 0 && cells.some(c => c.length > 0)
  })

  const data = dataLines.map(line => {
    const cells = line.split("|").map(c => c.trim())
    const row: Record<string, any> = {}
    headers.forEach((header, index) => {
      // 确保索引不越界
      row[header] = cells[index] !== undefined ? cells[index] : ""
    })
    return row
  })

  return { headers, data }
}

/**
 * 从文本中提取 HTML 代码
 */
export function extractHTMLCode(text: string): { html: string; css?: string } | null {
  // 尝试从代码块中提取（支持多种格式）
  const htmlBlockMatch = text.match(/```html\s*([\s\S]*?)```/i) || text.match(/```\s*html\s*([\s\S]*?)```/i)
  if (htmlBlockMatch) {
    let htmlContent = htmlBlockMatch[1].trim()
    
    // 提取 CSS（可能在 <style> 标签中，也可能在单独的代码块中）
    const cssMatch = htmlContent.match(/<style[^>]*>([\s\S]*?)<\/style>/i)
    let css: string | undefined = undefined
    
    if (cssMatch) {
      css = cssMatch[1].trim()
      // 从 HTML 中移除 style 标签
      htmlContent = htmlContent.replace(/<style[^>]*>[\s\S]*?<\/style>/i, "").trim()
    }
    
    // 如果 HTML 内容为空，返回 null
    if (!htmlContent || htmlContent.length === 0) {
      return null
    }
    
    return { html: htmlContent, css }
  }

  // 尝试直接提取 HTML（不包含在代码块中）
  const directHtmlMatch = text.match(/(<div[\s\S]*?<\/div>|<section[\s\S]*?<\/section>|<article[\s\S]*?<\/article>)/i)
  if (directHtmlMatch) {
    const html = directHtmlMatch[1]
    const cssMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i)
    const css = cssMatch ? cssMatch[1].trim() : undefined
    return { html, css }
  }

  return null
}

