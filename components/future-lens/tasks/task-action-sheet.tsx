"use client"

import { Radar, Activity, GitCompare, Sparkles, Heart, Target } from "lucide-react"
import { ModalDialog } from "../ds/modal-dialog"
import { DesignTokens } from "@/lib/future-lens/design-tokens"
import { cn } from "@/lib/utils"

export interface TaskOption {
  id: string
  name: string
  icon: typeof Radar
}

const taskOptions: TaskOption[] = [
  {
    id: "radar",
    name: "赛道雷达",
    icon: Radar,
  },
  {
    id: "activity",
    name: "战情播报",
    icon: Activity,
  },
  {
    id: "compare",
    name: "竞品动态",
    icon: GitCompare,
  },
  {
    id: "sparkles",
    name: "热点雷达",
    icon: Sparkles,
  },
  {
    id: "heart",
    name: "情绪监控",
    icon: Heart,
  },
  {
    id: "target",
    name: "目标追踪",
    icon: Target,
  },
]

interface TaskActionSheetProps {
  isOpen: boolean
  onClose: () => void
  onSelectTask: (task: TaskOption) => void
}

export function TaskActionSheet({ isOpen, onClose, onSelectTask }: TaskActionSheetProps) {
  return (
    <ModalDialog isOpen={isOpen} onClose={onClose} variant="action-sheet">
      <div className="grid grid-cols-3 gap-4">
        {taskOptions.map((task) => {
          const Icon = task.icon
          return (
            <button
              key={task.id}
              onClick={() => {
                onSelectTask(task)
                onClose()
              }}
              className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200 active:scale-95 hover:bg-muted/50"
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-primary/10">
                <Icon size={24} className="text-primary" strokeWidth={2} />
              </div>
              <span
                className={cn(
                  DesignTokens.typography.subtitle,
                  "text-sm font-medium text-foreground text-center"
                )}
              >
                {task.name}
              </span>
            </button>
          )
        })}
      </div>
    </ModalDialog>
  )
}

