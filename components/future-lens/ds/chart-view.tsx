import { cn } from "@/lib/utils"

// 【代理层模式 - 图表】
// 这是最关键的。图表库很重，这里做一个统一接口。
// 即使现在没有图表，先占位。未来你可以无缝接入 ECharts, D3, 或 Recharts

interface ChartViewProps {
  data: any[]
  type: "line" | "bar" | "radar"
  height?: number
  className?: string
}

export function ChartView({ data, type, height = 200, className }: ChartViewProps) {
  // 模拟：检查是否有自定义图表实现
  const hasCustomImplementation = false

  return (
    <div
      className={cn(
        "w-full flex items-center justify-center bg-muted/50 rounded-2xl border border-dashed border-border",
        className,
      )}
      style={{ height }}
    >
      {hasCustomImplementation ? // <MyCustomD3Chart data={data} />
      null : (
        // 降级方案：显示简单的占位或 v0 的默认图表
        <div className="text-xs text-muted-foreground font-mono">
          [System Chart: {type} view]
          <br />
          Data points: {data.length}
        </div>
      )}
    </div>
  )
}
