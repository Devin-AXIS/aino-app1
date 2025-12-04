"use client"

import { TextInputStep } from "./text-input-step"
import { PhoneInputStep } from "./phone-input-step"
import { ChoiceStep } from "./choice-step"
import { SliderStep } from "./slider-step"
import { VerifyCodeStep } from "./verify-code-step"
import { MultiSelectStep } from "./multi-select-step"
import { VoiceInputStep } from "./voice-input-step"
import { DateSelectStep } from "./date-select-step"
import type { AIAssistantStep } from "../liquid-ai-assistant"

interface StepInputRendererProps {
  step: AIAssistantStep
  onSubmit: (data: Record<string, any>) => void
  onOptionSelect?: (value: string, fieldName: string) => void
  userData?: Record<string, any>
}

/**
 * 步骤输入渲染器 - 根据步骤类型渲染不同的输入组件
 * 所有输入组件都是独立的，不依赖父组件状态
 */
export function StepInputRenderer({ step, onSubmit, onOptionSelect, userData = {} }: StepInputRendererProps) {
  // 根据步骤类型渲染不同的输入组件
  switch (step.type) {
    case "text":
      // 如果有 customInput，使用自定义输入（向后兼容，如手机号输入）
      if (step.customInput) {
        if (typeof step.customInput === "function") {
          return <>{step.customInput(userData)}</>
        }
        return <>{step.customInput}</>
      }
      // 否则使用默认文本输入
      return (
        <TextInputStep
          onSubmit={(value) => onSubmit({ [step.id]: value })}
          initialValue={userData[step.id] || ""}
        />
      )

    case "phone":
      // 手机号输入（使用独立组件）
      return (
        <PhoneInputStep
          onSubmit={(data) => onSubmit({ phone: data.phone, countryCode: data.countryCode })}
          initialPhone={userData.phone || ""}
          initialCountryCode={userData.countryCode || "+86"}
        />
      )

    case "choice":
      if (!step.options) return null
      return (
        <ChoiceStep
          options={step.options}
          onSelect={(value) => {
            // 使用父组件提供的 onOptionSelect 处理函数
            if (onOptionSelect) {
              onOptionSelect(value, step.id)
            } else {
              // 如果没有提供，直接提交数据
              onSubmit({ [step.id]: value })
            }
          }}
        />
      )

    case "slider":
      if (!step.options) return null
      return (
        <SliderStep
          options={step.options}
          onSelect={(value) => {
            // 使用父组件提供的 onOptionSelect 处理函数
            if (onOptionSelect) {
              onOptionSelect(value, step.id)
            } else {
              // 如果没有提供，直接提交数据
              onSubmit({ [step.id]: value })
            }
          }}
        />
      )

    case "verify":
      // 验证码输入（使用独立组件）
      return (
        <VerifyCodeStep
          onSubmit={(code) => {
            if (step.onVerifyCodeSubmit) {
              step.onVerifyCodeSubmit(code)
            } else {
              onSubmit({ [step.id]: code })
            }
          }}
          onResend={step.onVerifyCodeResend}
          countdown={step.verifyCodeCountdown || 0}
        />
      )

    case "multi-select":
      if (!step.options) return null
      return (
        <MultiSelectStep
          options={step.options}
          onSelect={(values) => {
            // 多选时，只更新数据到 userData，不触发步骤切换
            // 用户需要点击"下一步"按钮来确认选择
            // 直接调用 onSubmit 保存数据，但不触发步骤切换
            onSubmit({ [step.id]: values })
          }}
          maxSelections={step.maxSelections}
        />
      )

    case "voice":
      return (
        <VoiceInputStep
          onSubmit={(text) => onSubmit({ [step.id]: text })}
          placeholder={step.placeholder}
        />
      )

    case "date":
      return (
        <DateSelectStep
          onSelect={(date) => onSubmit({ [step.id]: date })}
          placeholder={step.placeholder}
          mode={step.dateMode}
        />
      )

    case "custom":
      // 自定义渲染
      if (step.options) {
        return (
          <div className="w-full">
            {step.options.map((opt, index) => (
              <div key={opt.value || `custom-${index}`} suppressHydrationWarning>
                {opt.icon}
              </div>
            ))}
          </div>
        )
      }
      return null

    default:
      return null
  }
}

