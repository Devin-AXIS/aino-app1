"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Language } from "./i18n"
import { translations } from "./i18n"

interface AppConfig {
  language: Language
  textScale: number
  theme: "light" | "dark" | "system"
  setLanguage: (lang: Language) => void
  setTextScale: (scale: number) => void
  setTheme: (theme: "light" | "dark" | "system") => void
}

const ConfigContext = createContext<AppConfig | undefined>(undefined)

export function fSize(basePx: number, scale?: number): number {
  const currentScale = scale ?? 1.05
  if (basePx > 24) {
    return basePx * Math.min(currentScale, 1.05)
  }
  return basePx * currentScale
}

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  // 从 localStorage 读取语言设置，如果没有则使用默认值
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("app-language")
      if (saved === "zh" || saved === "en") {
        return saved as Language
      }
    }
    return "zh"
  })
  const [textScale, setTextScale] = useState<number>(1.05)
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system")

  // 持久化语言设置
  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    if (typeof window !== "undefined") {
      localStorage.setItem("app-language", lang)
    }
  }

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }
  }, [theme])

  // 使用 useEffect 在客户端动态注入样式，避免 styled-jsx 导致的 hydration 问题
  useEffect(() => {
    const styleId = "app-text-scale-style"
    let styleElement = document.getElementById(styleId) as HTMLStyleElement

    if (!styleElement) {
      styleElement = document.createElement("style")
      styleElement.id = styleId
      document.head.appendChild(styleElement)
    }

    styleElement.textContent = `:root { font-size: ${textScale * 100}%; }`
  }, [textScale])

  return (
    <ConfigContext.Provider value={{ language, textScale, theme, setLanguage, setTextScale, setTheme }}>
      {children}
    </ConfigContext.Provider>
  )
}

export function useAppConfig() {
  const context = useContext(ConfigContext)
  if (!context) {
    throw new Error("useAppConfig must be used within a ConfigProvider")
  }
  return context
}

export { useAppConfig as useConfig }

export function useLanguage() {
  const { language } = useAppConfig()

  const t = (key: keyof typeof translations.zh): string => {
    return translations[language][key] || key
  }

  return { language, t }
}
