// Mock data generator for chart previews
export function generateMockData(dataFormat: string, dataHint: string) {
  console.log("[v0] generateMockData called with format:", dataFormat, "hint:", dataHint)

  if (
    dataHint.includes("month") &&
    dataHint.includes("增长") &&
    dataHint.includes("热度") &&
    dataHint.includes("资本")
  ) {
    return {
      data: [
        { label: "Jan", 增长: 55, 热度: 62, 资本: 48 },
        { label: "Feb", 增长: 58, 热度: 65, 资本: 52 },
        { label: "Mar", 增长: 62, 热度: 68, 资本: 58 },
        { label: "Apr", 增长: 65, 热度: 72, 资本: 62 },
        { label: "May", 增长: 68, 热度: 75, 资本: 65 },
        { label: "Jun", 增长: 72, 热度: 78, 资本: 68 },
        { label: "Jul", 增长: 75, 热度: 80, 资本: 72 },
        { label: "Aug", 增长: 78, 热度: 82, 资本: 75 },
        { label: "Sep", 增长: 80, 热度: 85, 资本: 78 },
        { label: "Oct", 增长: 82, 热度: 87, 资本: 80 },
        { label: "Nov", 增长: 85, 热度: 88, 资本: 82 },
        { label: "Dec", 增长: 88, 热度: 90, 资本: 85 },
      ],
      lines: [
        { dataKey: "资本", name: "资本", color: "#6366f1", strokeDasharray: "0" }, // 蓝色实线
        { dataKey: "增长", name: "技术", color: "#10b981", strokeDasharray: "0" }, // 绿色实线
        { dataKey: "热度", name: "热度", color: "#ef4444", strokeDasharray: "5 5" }, // 红色虚线
      ],
    }
  }

  if (dataHint.includes("inventory") && dataHint.includes("turnover") && dataHint.includes("name: string")) {
    return [
      { name: "Q1", inventory: 500, turnover: 4.2 },
      { name: "Q2", inventory: 550, turnover: 4.0 },
      { name: "Q3", inventory: 480, turnover: 4.5 },
      { name: "Q4", inventory: 450, turnover: 4.8 },
    ]
  }

  if (
    dataHint.includes("units") &&
    dataHint.includes("revenue") &&
    dataHint.includes("cost") &&
    dataHint.includes("profit")
  ) {
    return [
      { units: 0, revenue: 0, cost: 5000, profit: -5000 },
      { units: 100, revenue: 10000, cost: 8000, profit: 2000 },
      { units: 200, revenue: 20000, cost: 11000, profit: 9000 },
      { units: 300, revenue: 30000, cost: 14000, profit: 16000 },
      { units: 400, revenue: 40000, cost: 17000, profit: 23000 },
      { units: 500, revenue: 50000, cost: 20000, profit: 30000 },
    ]
  }

  if (
    dataHint.includes("name") &&
    dataHint.includes("value") &&
    !dataHint.includes("fill") &&
    !dataHint.includes("senior")
  ) {
    return [
      { name: "研发", value: 15 },
      { name: "制造", value: 8 },
      { name: "销售", value: 12 },
      { name: "服务", value: 25 },
      { name: "物流", value: 10 },
    ]
  }

  if (dataHint.includes("senior") && dataHint.includes("mezzanine") && dataHint.includes("equity")) {
    return [
      { name: "2023", senior: 40, mezzanine: 20, equity: 40 },
      { name: "2024", senior: 35, mezzanine: 25, equity: 40 },
      { name: "2025", senior: 30, mezzanine: 30, equity: 40 },
    ]
  }

  if (
    dataHint.includes("name") &&
    dataHint.includes("fill") &&
    (dataHint.includes("NDR") || dataHint.includes("string"))
  ) {
    return [
      { name: "期初ARR", value: 1000, fill: "#94a3b8" },
      { name: "扩展", value: 200, fill: "#10b981" },
      { name: "流失", value: -80, fill: "#ef4444" },
      { name: "降级", value: -50, fill: "#f97316" },
      { name: "期末ARR", value: 1070, fill: "#3b82f6" },
    ]
  }

  if (dataHint.includes("name") && dataHint.includes("cac") && dataHint.includes("margin")) {
    return [
      { name: "产品A", cac: 150, margin: 450 },
      { name: "产品B", cac: 300, margin: 900 },
      { name: "产品C", cac: 200, margin: 600 },
      { name: "产品D", cac: 250, margin: 750 },
    ]
  }

  if (dataHint.includes("name") && dataHint.includes("velocity") && !dataHint.includes("margin")) {
    return [
      { name: "Q1", velocity: 45 },
      { name: "Q2", velocity: 52 },
      { name: "Q3", velocity: 48 },
      { name: "Q4", velocity: 60 },
      { name: "Q1'24", velocity: 65 },
    ]
  }

  if (dataHint.includes("month") && dataHint.includes("cash") && dataHint.includes("number")) {
    return [
      { month: 0, cash: -500 },
      { month: 3, cash: -350 },
      { month: 6, cash: -200 },
      { month: 9, cash: -50 },
      { month: 12, cash: 100 },
      { month: 15, cash: 250 },
      { month: 18, cash: 400 },
    ]
  }

  if (dataHint.includes("profit") && dataHint.includes("name: string")) {
    return [
      { name: "0%", profit: 0 },
      { name: "20%", profit: 150 },
      { name: "40%", profit: 180 },
      { name: "60%", profit: 175 },
      { name: "80%", profit: 140 },
      { name: "100%", profit: 100 },
    ]
  }

  if (dataHint.includes("open") && dataHint.includes("close") && dataHint.includes("high")) {
    return Array.from({ length: 20 }, (_, i) => {
      const base = 100 + Math.sin(i / 2) * 20 + i
      const open = base + Math.random() * 10 - 5
      const close = base + Math.random() * 10 - 5
      return {
        date: `Day ${i + 1}`,
        name: i,
        open,
        close,
        high: Math.max(open, close) + Math.random() * 5,
        low: Math.min(open, close) - Math.random() * 5,
      }
    })
  }

  if (dataHint.includes("x:") && dataHint.includes("y:") && dataHint.includes("label")) {
    return [
      { x: 25, y: 30, label: "产品A", z: 120 },
      { x: 35, y: 45, label: "产品B", z: 240 },
      { x: 55, y: 60, label: "产品C", z: 180 },
      { x: 75, y: 20, label: "产品D", z: 300 },
      { x: 15, y: 70, label: "产品E", z: 90 },
    ]
  }

  if (dataHint.includes("type") && (dataHint.includes("increase") || dataHint.includes("decrease"))) {
    return [
      { label: "期初", value: 1000, type: "start" },
      { label: "销售收入", value: 500, type: "increase" },
      { label: "成本支出", value: -200, type: "decrease" },
      { label: "营销费用", value: -150, type: "decrease" },
      { label: "其他收入", value: 80, type: "increase" },
      { label: "期末", value: 1230, type: "end" },
    ]
  }

  if (dataHint.includes("low") && dataHint.includes("high")) {
    return [
      { label: "价格", low: -30, high: 45 },
      { label: "成本", low: -25, high: 35 },
      { label: "市场规模", low: -20, high: 30 },
      { label: "竞争", low: -15, high: 25 },
      { label: "政策", low: -10, high: 20 },
    ]
  }

  if (dataHint.includes("target")) {
    return [
      { label: "销售额", value: 75, target: 100, ranges: [50, 75, 100] },
      { label: "利润率", value: 60, target: 80, ranges: [40, 60, 80] },
      { label: "客户满意度", value: 85, target: 90, ranges: [60, 80, 90] },
    ]
  }

  if (dataHint.includes("burn") || dataHint.includes("cash")) {
    return [
      { label: "1月", burn: 50, cash: 1000, revenue: 20 },
      { label: "2月", burn: 55, cash: 950, revenue: 25 },
      { label: "3月", burn: 48, cash: 905, revenue: 30 },
      { label: "4月", burn: 52, cash: 857, revenue: 35 },
      { label: "5月", burn: 45, cash: 812, revenue: 42 },
      { label: "6月", burn: 40, cash: 772, revenue: 50 },
    ]
  }

  if (dataHint.includes("type:") && dataHint.includes("string")) {
    return [
      { label: "期初ARR", value: 100, type: "start" },
      { label: "新增客户", value: 25, type: "new" },
      { label: "扩展收入", value: 15, type: "expansion" },
      { label: "流失客户", value: -10, type: "churn" },
      { label: "降级收入", value: -5, type: "contraction" },
      { label: "期末ARR", value: 125, type: "end" },
    ]
  }

  if (dataHint.includes("metric")) {
    return [
      { metric: "LTV", value: 5000, benchmark: 4500 },
      { metric: "CAC", value: 1000, benchmark: 1200 },
      { metric: "LTV/CAC", value: 5.0, benchmark: 3.75 },
      { metric: "回收期(月)", value: 12, benchmark: 15 },
      { metric: "毛利率(%)", value: 75, benchmark: 70 },
    ]
  }

  if (dataHint.includes("TAM") || dataHint.includes("SAM") || dataHint.includes("SOM")) {
    return [
      { label: "TAM", value: 10000, description: "全球市场" },
      { label: "SAM", value: 2000, description: "可服务市场" },
      { label: "SOM", value: 200, description: "可获得市场" },
    ]
  }

  if (dataHint.includes("stage") && dataHint.includes("margin")) {
    return [
      { stage: "原材料", margin: 5, revenue: 100 },
      { stage: "制造", margin: 15, revenue: 150 },
      { stage: "分销", margin: 10, revenue: 180 },
      { stage: "零售", margin: 25, revenue: 250 },
    ]
  }

  if (dataHint.includes("type:") && dataFormat === "custom") {
    return [
      { label: "优先债务", value: 300, type: "senior-debt", rate: "5%" },
      { label: "次级债务", value: 150, type: "junior-debt", rate: "8%" },
      { label: "优先股", value: 100, type: "preferred", rate: "12%" },
      { label: "普通股", value: 200, type: "equity", rate: "20%" },
    ]
  }

  if (dataHint.includes("price") && dataHint.includes("volume") && dataHint.includes("type")) {
    const bidData = Array.from({ length: 15 }, (_, i) => ({
      price: 90 + i,
      volume: (i + 1) * 100 + Math.random() * 200,
      type: "bid",
    })).reverse()

    const askData = Array.from({ length: 15 }, (_, i) => ({
      price: 106 + i,
      volume: (i + 1) * 100 + Math.random() * 200,
      type: "ask",
    }))

    return [...bidData, ...askData]
  }

  if (
    dataHint.includes("scenario") ||
    dataHint.includes("forecast") ||
    (dataHint.includes("low") && dataHint.includes("high") && dataHint.includes("base"))
  ) {
    return [
      { name: "2024", base: 100, low: 100, high: 100 },
      { name: "2025", base: 120, low: 110, high: 140 },
      { name: "2026", base: 150, low: 125, high: 190 },
      { name: "2027", base: 190, low: 140, high: 260 },
      { name: "2028", base: 240, low: 160, high: 350 },
    ]
  }

  if (dataHint.includes("period") || dataHint.includes("date")) {
    return [
      { period: "2024-01", label: "1月", value: 3200, target: 3000 },
      { period: "2024-02", label: "2月", value: 3800, target: 3500 },
      { period: "2024-03", label: "3月", value: 4200, target: 4000 },
      { period: "2024-04", label: "4月", value: 4800, target: 4500 },
    ]
  }

  if (dataHint.includes("scenario") || dataHint.includes("forecast") || dataHint.includes("best")) {
    return [
      { year: 2024, label: "2024", best: 5000, base: 4000, worst: 3000 },
      { year: 2025, label: "2025", best: 6500, base: 5000, worst: 3500 },
      { year: 2026, label: "2026", best: 8000, base: 6000, worst: 4000 },
      { year: 2027, label: "2027", best: 10000, base: 7500, worst: 5000 },
    ]
  }

  if (dataHint.includes("varies by type") || dataHint.includes("DCF") || dataHint.includes("Comps")) {
    return [
      { name: "EV/Sales", min: 2, q1: 4, median: 6, q3: 8, max: 12 },
      { name: "EV/EBITDA", min: 8, q1: 12, median: 15, q3: 20, max: 25 },
      { name: "P/E", min: 15, q1: 20, median: 25, q3: 35, max: 45 },
    ]
  }

  if (dataHint.includes("nodes") || dataHint.includes("edges")) {
    return {
      nodes: [
        { id: "1", label: "核心", value: 100 },
        { id: "2", label: "分支A", value: 60 },
        { id: "3", label: "分支B", value: 40 },
      ],
      edges: [
        { source: "1", target: "2" },
        { source: "1", target: "3" },
      ],
    }
  }

  // Radar chart data generation logic
  if (dataHint.includes("subject") && dataHint.includes("value")) {
    return [
      { subject: "技术能力", value: 85, fullMark: 100 },
      { subject: "市场份额", value: 72, fullMark: 100 },
      { subject: "团队实力", value: 90, fullMark: 100 },
      { subject: "资金状况", value: 78, fullMark: 100 },
      { subject: "创新能力", value: 82, fullMark: 100 },
      { subject: "运营效率", value: 88, fullMark: 100 },
    ]
  }

  if (dataHint.includes("subject") || dataHint.includes("score")) {
    return [
      { subject: "环境", score: 85, fullMark: 100 },
      { subject: "社会", score: 72, fullMark: 100 },
      { subject: "治理", score: 90, fullMark: 100 },
      { subject: "创新", score: 68, fullMark: 100 },
      { subject: "合规", score: 95, fullMark: 100 },
    ]
  }

  if (dataHint.includes("stage") || dataHint.includes("Funnel") || dataHint.includes("conversion")) {
    return [
      { stage: "访问", label: "访问", value: 10000, conversion: 100 },
      { stage: "注册", label: "注册", value: 5000, conversion: 50 },
      { stage: "试用", label: "试用", value: 2000, conversion: 20 },
      { stage: "付费", label: "付费", value: 500, conversion: 5 },
    ]
  }

  // Progress bars format: Array<{name: string, value: number}>
  if (dataHint.includes("name: string, value: number") || dataHint.includes("进度条") || dataHint.includes("指标")) {
    return [
      { name: "技术", value: 91 },
      { name: "资本", value: 85 },
      { name: "舆论", value: 88 },
      { name: "商业", value: 58 },
    ]
  }

  // Standard format: Array<{label: string, value: number}>
  if (dataFormat === "standard") {
    return [
      { label: "Q1", value: 2400 },
      { label: "Q2", value: 3800 },
      { label: "Q3", value: 2800 },
      { label: "Q4", value: 4200 },
    ]
  }

  // Custom formats based on data hint
  if (dataHint.includes("name, x, y, z") || dataHint.includes("BCG")) {
    return [
      { name: "产品A", x: 25, y: 15, z: 1200, label: "明星" },
      { name: "产品B", x: 75, y: 20, z: 2400, label: "问题" },
      { name: "产品C", x: 15, y: 70, z: 800, label: "瘦狗" },
      { name: "产品D", x: 80, y: 65, z: 3000, label: "现金牛" },
    ]
  }

  if (dataHint.includes("growth") && dataHint.includes("margin")) {
    return [
      { name: "2021", growth: 45, margin: -5, total: 40 },
      { name: "2022", growth: 38, margin: 2, total: 40 },
      { name: "2023", growth: 30, margin: 12, total: 42 },
      { name: "2024", growth: 25, margin: 18, total: 43 },
    ]
  }

  // Area chart / Line chart default data
  if (dataFormat === "time-series" || dataHint.includes("time") || dataHint.includes("date")) {
    return [
      { date: "1月", value: 120, value2: 80 },
      { date: "2月", value: 150, value2: 100 },
      { date: "3月", value: 180, value2: 120 },
      { date: "4月", value: 200, value2: 140 },
      { date: "5月", value: 220, value2: 160 },
      { date: "6月", value: 240, value2: 180 },
    ]
  }

  // Multi-line chart data
  if (dataHint.includes("multiple") || dataHint.includes("series") || dataHint.includes("line")) {
    return {
      data: [
        { label: "1月", series1: 45, series2: 35, series3: 25 },
        { label: "2月", series1: 52, series2: 42, series3: 32 },
        { label: "3月", series1: 48, series2: 38, series3: 28 },
        { label: "4月", series1: 61, series2: 51, series3: 41 },
        { label: "5月", series1: 55, series2: 45, series3: 35 },
        { label: "6月", series1: 67, series2: 57, series3: 47 },
      ],
      lines: [
        { dataKey: "series1", name: "系列1", color: "#3b82f6" },
        { dataKey: "series2", name: "系列2", color: "#10b981" },
        { dataKey: "series3", name: "系列3", color: "#f59e0b" },
      ],
    }
  }

  // Default standard format fallback - 确保总是返回数据
  return [
    { label: "类别A", value: 2400 },
    { label: "类别B", value: 3800 },
    { label: "类别C", value: 2800 },
    { label: "类别D", value: 4200 },
    { label: "类别E", value: 3200 },
  ]
}
