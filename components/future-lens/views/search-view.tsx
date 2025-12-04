"use client"
import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, X, Mic, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { AppBackground } from "@/components/future-lens/ds/app-background"
import { useAppConfig, fSize } from "@/lib/future-lens/config-context"
import { DesignTokens } from "@/lib/future-lens/design-tokens"
import { translations } from "@/lib/future-lens/i18n"
import { cn } from "@/lib/utils"

interface SearchViewProps {
  onBack?: () => void
}

// Mock Data for Recent Searches
const RECENT_SEARCHES = ["AI Agent Frameworks", "NVIDIA Earnings", "Crypto Regulation", "React 19", "Climate Tech"]

// Mock Data for Trending Topics
const TRENDING_TOPICS = [
  { rank: 1, title: "GPT-5 Beta Release", tag: "New" },
  { rank: 2, title: "Global Compute Shortage", tag: "Hot" },
  { rank: 3, title: "Sustainable Energy Grid", tag: "" },
  { rank: 4, title: "Neuralink Human Trials", tag: "" },
  { rank: 5, title: "Mars Colony Update", tag: "" },
  { rank: 6, title: "Quantum Encryption", tag: "" },
  { rank: 7, title: "Web3 Gaming Trends", tag: "" },
  { rank: 8, title: "Solid State Batteries", tag: "" },
]

export function SearchView({ onBack }: SearchViewProps) {
  const router = useRouter()
  const { textScale, language } = useAppConfig()
  const t = translations[language] || translations["zh"]
  const inputRef = useRef<HTMLInputElement>(null)
  const [searchText, setSearchText] = useState("")

  // Focus input on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus()
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      router.back()
    }
  }

  return (
    <div className="flex flex-col h-[100dvh] w-full relative overflow-hidden">
      <AppBackground />

      {/* 1. Minimalist Sticky Header */}
      <header
        className={cn(
          `flex items-center gap-3 px-4 pb-3 z-50 bg-background/0 ${DesignTokens.blur.input} sticky top-0`,
          DesignTokens.mobile.safeTop,
        )}
      >
        {/* Clean Input Container */}
        <div className="flex-1 relative">
          <div className="flex items-center px-3 py-2 rounded-lg bg-secondary">
            <Search className="w-4 h-4 text-muted-foreground/60 shrink-0 mr-2" />
            <input
              ref={inputRef}
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder={t.search_placeholder}
              className={cn(
                "flex-1 bg-transparent border-none outline-none placeholder:text-muted-foreground/50 text-foreground caret-primary p-0",
                // Prevent zoom on mobile
                DesignTokens.mobile.input,
              )}
              style={{ fontSize: fSize(16, textScale) }}
            />
            <div className="flex items-center gap-2 ml-2">
              {searchText ? (
                <button
                  onClick={() => setSearchText("")}
                  className="p-0.5 rounded-full bg-muted-foreground/20 hover:bg-muted-foreground/30 transition-colors"
                >
                  <X className="w-3 h-3 text-muted-foreground" />
                </button>
              ) : (
                <Mic className="w-4 h-4 text-muted-foreground/50" />
              )}
            </div>
          </div>
        </div>

        {/* Cancel Action */}
        <button
          onClick={handleBack}
          className="text-[15px] font-medium text-foreground hover:opacity-70 transition-opacity px-1"
        >
          {t.search_cancel}
        </button>
      </header>

      {/* 2. Scrollable Content */}
      <div
        className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar relative z-10"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1rem)" }}
      >
        <div className="flex flex-col gap-8 px-5 py-4">
          {/* Section: Recent Searches */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-foreground text-[13px]">{t.search_recent}</h3>
              <button className="p-1 rounded-full hover:bg-muted transition-colors text-muted-foreground/50">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {RECENT_SEARCHES.map((item, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="px-3 py-1.5 rounded-[4px] bg-white/40 hover:bg-white/60 backdrop-blur-sm text-foreground/80 text-[13px] transition-colors max-w-full truncate border border-white/10"
                >
                  {item}
                </motion.button>
              ))}
            </div>
          </section>

          {/* Section: Trending Topics */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-bold text-foreground text-[13px]">{t.search_trending}</h3>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              {TRENDING_TOPICS.map((topic, i) => (
                <motion.div
                  key={topic.title}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.03 }}
                  className="group flex items-center gap-2.5 cursor-pointer"
                >
                  {/* Rank Number */}
                  <span
                    className={cn(
                      "text-[13px] font-bold w-3.5 text-center",
                      i === 0
                        ? DesignTokens.hot[1]
                        : i === 1
                          ? DesignTokens.hot[2]
                          : i === 2
                            ? DesignTokens.hot[3]
                            : "text-muted-foreground/40",
                    )}
                  >
                    {topic.rank}
                  </span>

                  {/* Title */}
                  <span className="text-[14px] text-foreground/90 truncate flex-1 group-active:opacity-70 transition-opacity">
                    {topic.title}
                  </span>

                  {/* Tag (Hot/New) */}
                  {topic.tag && (
                    <span
                      className={cn(
                        "text-[9px] px-1 rounded-[2px] font-medium ml-auto shrink-0",
                        topic.tag === "Hot"
                          ? `${DesignTokens.hotBackground[1]} ${DesignTokens.hot[1]}`
                          : `${DesignTokens.hotBackground[3]} ${DesignTokens.hot[3]}`,
                      )}
                    >
                      {topic.tag}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
