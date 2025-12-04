"use client"

import type { ComponentProps } from "react"
import { useEffect, useState, memo, createContext, useContext } from "react"
import { Brain, ChevronDown } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

type ReasoningContextValue = {
  isStreaming: boolean
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  duration: number
}

const ReasoningContext = createContext<ReasoningContextValue | null>(null)

const useReasoning = () => {
  const context = useContext(ReasoningContext)
  if (!context) {
    throw new Error("Reasoning components must be used within Reasoning")
  }
  return context
}

export type ReasoningProps = ComponentProps<typeof Collapsible> & {
  isStreaming?: boolean
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  duration?: number
}

const AUTO_CLOSE_DELAY = 500
const MS_IN_S = 1000

function ReasoningComponent({
  className,
  isStreaming = false,
  open,
  defaultOpen = true,
  onOpenChange,
  duration: durationProp,
  children,
  ...props
}: ReasoningProps) {
  const [isOpen, setIsOpen] = useState(open ?? defaultOpen)
  const [duration, setDuration] = useState(durationProp ?? 0)
  const [hasAutoClosedRef, setHasAutoClosedRef] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)

  // Sync with controlled open prop
  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open)
    }
  }, [open])

  // Sync with controlled duration prop
  useEffect(() => {
    if (durationProp !== undefined) {
      setDuration(durationProp)
    }
  }, [durationProp])

  // Track duration when streaming starts and ends
  useEffect(() => {
    if (isStreaming) {
      if (startTime === null) {
        setStartTime(Date.now())
      }
    } else if (startTime !== null) {
      const calculatedDuration = Math.round((Date.now() - startTime) / MS_IN_S)
      setDuration(calculatedDuration)
      setStartTime(null)
    }
  }, [isStreaming, startTime])

  // Auto-open when streaming starts, auto-close when streaming ends (once only)
  useEffect(() => {
    if (defaultOpen && !isStreaming && isOpen && !hasAutoClosedRef) {
      // Add a small delay before closing to allow user to see the content
      const timer = setTimeout(() => {
        setIsOpen(false)
        setHasAutoClosedRef(true)
        onOpenChange?.(false)
      }, AUTO_CLOSE_DELAY)

      return () => clearTimeout(timer)
    }
  }, [isStreaming, isOpen, defaultOpen, onOpenChange, hasAutoClosedRef])

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen)
    onOpenChange?.(newOpen)
  }

  return (
    <ReasoningContext.Provider value={{ isStreaming, isOpen, setIsOpen, duration }}>
      <Collapsible className={cn("not-prose", className)} onOpenChange={handleOpenChange} open={isOpen} {...props}>
        {children}
      </Collapsible>
    </ReasoningContext.Provider>
  )
}

export const Reasoning = memo(ReasoningComponent)

export type ReasoningTriggerProps = ComponentProps<typeof CollapsibleTrigger>

function ReasoningTriggerComponent({ className, children, ...props }: ReasoningTriggerProps) {
  const { isStreaming, isOpen, duration } = useReasoning()

  return (
    <CollapsibleTrigger
      className={cn(
        "flex items-center gap-1.5 text-muted-foreground text-xs transition-colors hover:text-foreground",
        className,
      )}
      {...props}
    >
      {children ?? (
        <>
          <Brain className="size-4" />
          {isStreaming || duration === 0 ? (
            <span>思考中...</span>
          ) : (
            <span>思考了 {duration} 秒</span>
          )}
          <ChevronDown
            className={cn("size-3 text-muted-foreground transition-transform", isOpen ? "rotate-180" : "rotate-0")}
          />
        </>
      )}
    </CollapsibleTrigger>
  )
}

export const ReasoningTrigger = memo(ReasoningTriggerComponent)

export type ReasoningContentProps = ComponentProps<typeof CollapsibleContent> & {
  children: string
}

function ReasoningContentComponent({ className, children, ...props }: ReasoningContentProps) {
  return (
    <CollapsibleContent
      className={cn(
        "mt-2 text-muted-foreground text-xs leading-relaxed",
        "data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2",
        "outline-hidden data-[state=closed]:animate-out data-[state=open]:animate-in",
        className,
      )}
      {...props}
    >
      <div className="whitespace-pre-wrap grid gap-2">{children}</div>
    </CollapsibleContent>
  )
}

export const ReasoningContent = memo(ReasoningContentComponent)

Reasoning.displayName = "Reasoning"
ReasoningTrigger.displayName = "ReasoningTrigger"
ReasoningContent.displayName = "ReasoningContent"

