// ... existing code ...

**完整示例参考：`views/invite-friends-view.tsx`**
**详细规范参考：`docs/DESIGN_SYSTEM.md`**

---

## 图表组件使用规则

### 统一数据格式（所有图表通用）

\`\`\`tsx
const data = [
  { label: "标签", value: 数值 }
]
\`\`\`

### 可用图表类型

| 组件 | 用途 | 导入 |
|------|------|------|
| LineChart | 折线图 | `@/components/future-lens/charts` |
| BarChart | 柱状图 | `@/components/future-lens/charts` |
| PieChart | 饼图 | `@/components/future-lens/charts` |
| AreaChart | 面积图 | `@/components/future-lens/charts` |

### 基础用法

\`\`\`tsx
import { LineChart } from '@/components/future-lens/charts'

<LineChart 
  data={[
    { label: "1月", value: 1000 },
    { label: "2月", value: 1200 },
  ]}
  title="收入趋势"
/>
\`\`\`

### 对比图表（双数据）

\`\`\`tsx
<LineChart 
  data={[
    { label: "1月", value: 1000, value2: 800 },
    { label: "2月", value: 1200, value2: 900 },
  ]}
  title="收入 vs 成本"
/>
