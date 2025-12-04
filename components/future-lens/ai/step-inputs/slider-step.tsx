"use client"

interface SliderOption {
  label: string
  value: string
  icon?: React.ReactNode
}

interface SliderStepProps {
  options: SliderOption[]
  onSelect: (value: string) => void
}

/**
 * 滑动选择步骤组件 - 完全独立
 * 点击选项时立即通知父组件
 */
export function SliderStep({ options, onSelect }: SliderStepProps) {
  const handleClick = (value: string) => {
    onSelect(value)
  }

  return (
    <div className="w-full relative group">
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      <div className="flex gap-4 overflow-x-auto scrollbar-hide px-8 sm:px-[calc(50%-60px)] py-4 snap-x snap-mandatory">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleClick(opt.value)}
            className="snap-center shrink-0 w-24 h-28 md:w-28 md:h-32 flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card shadow-sm text-muted-foreground hover:scale-105 hover:shadow-md hover:text-foreground hover:border-primary transition-all duration-300"
            suppressHydrationWarning
          >
            {opt.icon && <div className="text-inherit opacity-80">{opt.icon}</div>}
            <span className="text-xs md:text-sm font-medium" suppressHydrationWarning>
              {opt.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

