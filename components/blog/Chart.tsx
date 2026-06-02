'use client'

import { Chart as ChartJS, registerables } from 'chart.js'
import { Chart as ReactChart } from 'react-chartjs-2'
import type { ChartData, ChartOptions } from 'chart.js'

// Register all controllers/elements/scales once so any chart type works in MDX.
ChartJS.register(...registerables)

type ChartKind =
  | 'bar' | 'line' | 'pie' | 'doughnut' | 'scatter'
  | 'radar' | 'polarArea' | 'bubble'

interface ChartProps {
  type: ChartKind
  data: ChartData
  options?: ChartOptions
  /** rendered height in px (chart is responsive within this box) */
  height?: number
  className?: string
}

/**
 * Declarative chart primitive for MDX blog posts. Replaces the legacy imperative
 * useRef/useEffect Chart.js pattern: authors pass serializable `type`/`data`/`options`.
 *
 *   <Chart type="bar" data={{ labels: [...], datasets: [...] }} />
 */
export default function Chart({ type, data, options, height = 320, className }: ChartProps) {
  return (
    <div className={className} style={{ position: 'relative', height }}>
      <ReactChart
        type={type}
        data={data}
        options={{ responsive: true, maintainAspectRatio: false, ...(options ?? {}) }}
      />
    </div>
  )
}
