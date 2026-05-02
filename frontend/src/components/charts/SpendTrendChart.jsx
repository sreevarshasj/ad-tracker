// FILE: frontend/src/components/charts/SpendTrendChart.jsx
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend,
} from 'recharts'
import { useSpendTrend } from '../../hooks/usePerformance.js'
import { transformSpendTrendData } from '../../utils/chartHelpers.js'
import Skeleton from '../ui/Skeleton.jsx'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-background-elevated border border-border rounded-xl p-3 shadow-card text-sm">
      <p className="text-text-secondary mb-2 font-medium">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name === 'spend' ? `₹${(p.value / 1000).toFixed(1)}K` : `${p.value}%`}
          <span className="text-text-muted font-normal ml-1">
            {p.name === 'spend' ? 'Spend' : 'CTR'}
          </span>
        </p>
      ))}
    </div>
  )
}

export default function SpendTrendChart() {
  const { trendData, isLoading } = useSpendTrend()
  const data = transformSpendTrendData(trendData)

  if (isLoading) {
    return <Skeleton className="w-full h-[280px] rounded-xl" />
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[280px] text-text-muted text-sm">
        No trend data available
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fill: '#9B9BB4', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          yAxisId="left"
          tick={{ fill: '#9B9BB4', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fill: '#9B9BB4', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: 12, color: '#9B9BB4' }}
          formatter={(value) => value === 'spend' ? 'Spend' : 'CTR'}
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="spend"
          stroke="#6C5CE7"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: '#6C5CE7' }}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="ctr"
          stroke="#00D2FF"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: '#00D2FF' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
