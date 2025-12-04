"use client"

import { useMemo } from "react"
import { LiquidAIAssistant, type AIAssistantStep } from "../ai/liquid-ai-assistant"
import { useAppConfig } from "@/lib/future-lens/config-context"
import type { TaskOption } from "./task-action-sheet"

interface CreateTaskViewProps {
  task: TaskOption
  onComplete: (data: Record<string, any>) => void
  onBack: () => void
}

export function CreateTaskView({ task, onComplete, onBack }: CreateTaskViewProps) {
  const { language } = useAppConfig()

  // 根据任务类型生成不同的步骤
  const steps: Record<string, AIAssistantStep> = useMemo(() => {
    const isZh = language === "zh"
    
    // 通用步骤：任务名称
    const nameStep: AIAssistantStep = {
      id: "name",
      type: "text",
      getLines: () => [
        isZh ? "让我们开始创建任务" : "Let's start creating a task",
        isZh ? `请为您的${task.name}任务起个名字` : `Please name your ${task.name} task`,
      ],
      next: "description",
    }

    // 通用步骤：任务描述
    const descriptionStep: AIAssistantStep = {
      id: "description",
      type: "voice",
      getLines: () => [
        isZh ? "描述一下这个任务" : "Describe this task",
        isZh ? "您可以说话或输入文字" : "You can speak or type",
      ],
      placeholder: isZh ? "说话或输入..." : "Speak or type...",
      next: "topics",
    }

    // 通用步骤：选择相关话题（多选）
    const topicsStep: AIAssistantStep = {
      id: "topics",
      type: "multi-select",
      getLines: () => [
        isZh ? "选择相关话题" : "Select related topics",
        isZh ? "可以选择多个" : "You can select multiple",
      ],
      options: [
        { label: isZh ? "科技" : "Tech", value: "tech" },
        { label: isZh ? "商业" : "Business", value: "business" },
        { label: isZh ? "金融" : "Finance", value: "finance" },
        { label: isZh ? "健康" : "Health", value: "health" },
        { label: isZh ? "设计" : "Design", value: "design" },
        { label: isZh ? "创新" : "Innovation", value: "innovation" },
      ],
      maxSelections: 5,
      next: "date",
    }

    // 通用步骤：选择日期
    const dateStep: AIAssistantStep = {
      id: "date",
      type: "date",
      getLines: () => [
        isZh ? "选择开始日期" : "Select start date",
        isZh ? "任务将从这一天开始" : "Task will start from this date",
      ],
      placeholder: isZh ? "选择日期" : "Select date",
      dateMode: "single",
      next: null,
    }

    return {
      name: nameStep,
      description: descriptionStep,
      topics: topicsStep,
      date: dateStep,
    }
  }, [task, language])

  return (
    <LiquidAIAssistant
      steps={steps}
      initialStepId="name"
      onComplete={onComplete}
      showNavigation={true}
      showMuteButton={true}
    />
  )
}

