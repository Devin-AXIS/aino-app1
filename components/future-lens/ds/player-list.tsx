/**
 * 企业/玩家列表组件
 * 用于展示多个企业/玩家的排名、影响力等信息
 * 
 * @example
 * ```tsx
 * <PlayerList
 *   players={[
 *     { name: "OpenAI", value: 98, type: "Brain", color: "bg-success" },
 *     { name: "Tesla", value: 92, type: "System", color: "bg-foreground" }
 *   ]}
 * />
 * ```
 */

"use client"

import { useAppConfig } from "@/lib/future-lens/config-context"

export interface PlayerItem {
  /** 名称 */
  name: string
  /** 数值（0-100，用于进度条） */
  value: number
  /** 类型标签 */
  type: string
  /** 图标背景颜色（Tailwind类名） */
  color: string
}

interface PlayerListProps {
  /** 玩家/企业列表 */
  players: PlayerItem[]
  /** 自定义间距 */
  spacing?: "sm" | "md" | "lg"
}

export function PlayerList({ players, spacing = "md" }: PlayerListProps) {
  const { textScale } = useAppConfig()
  const fSize = (base: number) => base * textScale

  const spacingClass = {
    sm: "space-y-2",
    md: "space-y-3",
    lg: "space-y-4",
  }[spacing]

  return (
    <div className={spacingClass}>
      {players.map((player, index) => (
        <div key={index} className="flex items-center gap-2.5">
          {/* 图标 */}
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white shadow-sm ${player.color}`}
            style={{ fontSize: `${fSize(11)}px` }}
          >
            {player.name[0]}
          </div>
          
          {/* 内容区域 */}
          <div className="flex-1">
            {/* 名称和类型 */}
            <div className="flex justify-between mb-1">
              <span className="font-bold text-foreground" style={{ fontSize: `${fSize(11)}px` }}>
                {player.name}
              </span>
              <span
                className="text-muted-foreground bg-muted/30 px-1.5 py-0.5 rounded"
                style={{ fontSize: `${fSize(8)}px` }}
              >
                {player.type}
              </span>
            </div>
            
            {/* 进度条 */}
            <div className="h-1.5 w-full bg-muted/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-foreground rounded-full"
                style={{ width: `${player.value}%`, opacity: player.value / 100 }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

