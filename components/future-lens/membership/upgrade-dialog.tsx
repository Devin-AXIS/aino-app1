"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { useAppConfig } from "@/lib/future-lens/config-context"
import { ChevronRight, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Z_INDEX } from "@/lib/future-lens/constants"

interface UpgradeDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function UpgradeDialog({ isOpen, onClose }: UpgradeDialogProps) {
  const { language } = useAppConfig()
  const isZh = language === "zh"
  const [mounted, setMounted] = useState(false)

  // 权益列表 - 4行
  const benefits = [
    {
      text: isZh
        ? "Plus 套餐中的所有功能"
        : "All features in the Plus plan",
    },
    {
      text: isZh
        ? "免费终身更新"
        : "Free lifetime updates",
    },
    {
      text: isZh
        ? "24/7 支持"
        : "24/7 support",
    },
    {
      text: isZh
        ? "无限制访问所有高级功能"
        : "Unlimited access to all premium features",
    },
  ]

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!mounted) return null

  const content = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-xl"
            style={{ zIndex: Z_INDEX.MODAL }}
          />

          {/* Card Container - 底部对齐 */}
          <div
            className="fixed inset-x-0 bottom-0 flex flex-col justify-end pointer-events-none h-full"
            style={{ zIndex: Z_INDEX.MODAL + 10 }}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full pointer-events-auto px-4 pb-6"
            >
              {/* 卡片 - 完全按照参考图片，无外部容器 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="relative rounded-2xl bg-slate-900 dark:bg-slate-950 p-6 shadow-2xl"
              >
                {/* 关闭按钮 */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors text-white"
                >
                  <X size={18} strokeWidth={2} />
                </button>

                {/* 标题和价格 - 完全按照参考图片 */}
                <div className="flex items-start justify-between mb-6">
                  <h2 className="text-3xl font-bold text-white">
                    {isZh ? "Pro" : "Pro"}
                  </h2>
                  <div className="text-3xl font-bold text-white">
                    US$200
                  </div>
                </div>

                {/* 权益列表 - 简化文字 */}
                <div className="space-y-3 mb-6">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-white mt-2 flex-shrink-0" />
                      <p className="text-sm text-white/90 leading-relaxed flex-1">
                        {benefit.text}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* 购买按钮 - 完全按照参考图片：白色背景，左边黑色圆形图标+白色箭头，右边文字 */}
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    // TODO: 实现购买逻辑
                    console.log("Purchase clicked")
                  }}
                  className="w-full py-3.5 rounded-xl bg-white text-slate-900 font-semibold text-base hover:bg-white/90 transition-all flex items-center justify-center gap-3 group"
                >
                  {/* 左边：黑色圆形图标 + 白色箭头 */}
                  <div className="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0">
                    <ChevronRight size={14} className="text-white" />
                  </div>
                  {/* 右边：文字 */}
                  <span>{isZh ? "购买" : "Get Started"}</span>
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )

  const portalContainer = document.getElementById("app-portal-container")
  if (portalContainer) {
    return createPortal(content, portalContainer)
  }

  return content
}

