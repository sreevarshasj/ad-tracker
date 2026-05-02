// FILE: frontend/src/components/cards/SummaryCard.jsx
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'
import Skeleton from '../ui/Skeleton.jsx'

export default function SummaryCard({ title, value, subtitle, icon: Icon, trend, trendValue, color = 'purple', isLoading }) {
  const colorMap = {
    purple: 'from-accent-purple/20 to-accent-purple/5 border-accent-purple/20',
    cyan: 'from-accent-cyan/20 to-accent-cyan/5 border-accent-cyan/20',
    success: 'from-status-success/20 to-status-success/5 border-status-success/20',
    warning: 'from-status-warning/20 to-status-warning/5 border-status-warning/20',
    danger: 'from-status-danger/20 to-status-danger/5 border-status-danger/20',
  }

  const iconColors = {
    purple: 'text-accent-purple',
    cyan: 'text-accent-cyan',
    success: 'text-status-success',
    warning: 'text-status-warning',
    danger: 'text-status-danger',
  }

  if (isLoading) {
    return (
      <div className="card-dark p-5 space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden card-dark p-5 bg-gradient-to-br ${colorMap[color]} hover:shadow-glow transition-all duration-300 group`}>
      <div className="flex items-start justify-between mb-3">
        <p className="metric-label">{title}</p>
        {Icon && (
          <div className={`w-9 h-9 rounded-lg bg-background-surface border border-border flex items-center justify-center ${iconColors[color]} group-hover:scale-110 transition-transform`}>
            <Icon size={18} />
          </div>
        )}
      </div>

      <p className="metric-value mb-1">{value}</p>

      <div className="flex items-center gap-2">
        {trend && (
          <span className={`flex items-center gap-0.5 text-xs font-medium ${
            trend === 'UP' ? 'text-status-success' :
            trend === 'DOWN' ? 'text-status-danger' :
            'text-text-muted'
          }`}>
            {trend === 'UP' ? <ArrowUpRight size={12} /> : trend === 'DOWN' ? <ArrowDownRight size={12} /> : <Minus size={12} />}
            {trendValue}
          </span>
        )}
        {subtitle && <p className="text-xs text-text-muted">{subtitle}</p>}
      </div>
    </div>
  )
}
