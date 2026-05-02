// FILE: frontend/src/components/charts/PlatformPieChart.jsx
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend
} from 'recharts'
import { usePlatformBreakdown } from '../../hooks/usePerformance.js'
import { transformPlatformData } from '../../utils/chartHelpers.js'
import { PLATFORM_CONFIG } from '../../utils/constants.js'
import Skeleton from '../ui/Skeleton.jsx'

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-background-elevated border border-border rounded-xl p-3 shadow-card text-sm">
      <p className="font-medium" style={{ color: d.color }}>{d.name}</p>
      <p className="text-text-secondary">{d.value} campaigns</p>
      <p className="text-text-muted">₹{(d.spend / 1000).toFixed(1)}K spend</p>
    </div>
  )
}

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.08) return null
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="#EDEDED" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export default function PlatformPieChart() {
  const { platformData, isLoading } = usePlatformBreakdown()
  const data = transformPlatformData(platformData)
  const total = data.reduce((s, d) => s + d.value, 0)

  if (isLoading) return <Skeleton className="w-full h-[260px] rounded-xl" />

  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-[260px] text-text-muted text-sm">
        No platform data available
      </div>
    )
  }

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={105}
            paddingAngle={3}
            dataKey="value"
            labelLine={false}
            label={renderCustomizedLabel}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Center total */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ top: '-8px' }}>
        <div className="text-center">
          <p className="text-xl font-bold text-text-primary">{total}</p>
          <p className="text-[10px] text-text-muted">Campaigns</p>
        </div>
      </div>

      {/* Custom legend */}
      <div className="grid grid-cols-2 gap-2 mt-2">
        {data.map((d) => (
          <div key={d.platform} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
            <span className="text-xs text-text-secondary truncate">{d.name}</span>
            <span className="text-xs text-text-muted ml-auto">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
