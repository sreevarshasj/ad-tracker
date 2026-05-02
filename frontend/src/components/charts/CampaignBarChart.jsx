// FILE: frontend/src/components/charts/CampaignBarChart.jsx
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Cell
} from 'recharts'
import { useCampaigns } from '../../hooks/useCampaigns.js'
import { transformBarChartData } from '../../utils/chartHelpers.js'
import Skeleton from '../ui/Skeleton.jsx'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-background-elevated border border-border rounded-xl p-3 shadow-card text-sm">
      <p className="text-text-secondary font-medium mb-1">{label}</p>
      <p className="text-accent-purple font-semibold">{payload[0]?.value} campaigns</p>
      <p className="text-text-muted">₹{((payload[1]?.value || 0) / 1000).toFixed(1)}K spend</p>
    </div>
  )
}

export default function CampaignBarChart() {
  const { campaigns, isLoading } = useCampaigns({ limit: 500 })
  const data = transformBarChartData(campaigns)

  if (isLoading) return <Skeleton className="w-full h-[220px] rounded-xl" />
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-[220px] text-text-muted text-sm">
        No data available
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" vertical={false} />
        <XAxis dataKey="month" tick={{ fill: '#9B9BB4', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#9B9BB4', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="campaigns" fill="#6C5CE7" radius={[4, 4, 0, 0]} maxBarSize={40}>
          {data.map((_, i) => (
            <Cell key={i} fill={i === data.length - 1 ? '#00D2FF' : '#6C5CE7'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
