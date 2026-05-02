// FILE: frontend/src/components/agent/InsightItem.jsx
import {
  Trophy, MapPin, DollarSign, TrendingUp, Activity,
  Info, Sparkles, ArrowUpRight, ArrowDownRight, Minus
} from 'lucide-react'

const ICON_MAP = {
  trophy: Trophy,
  'map-pin': MapPin,
  currency: DollarSign,
  'trending-up': TrendingUp,
  activity: Activity,
  'dollar-sign': DollarSign,
  info: Info,
  sparkles: Sparkles,
}

const TYPE_COLORS = {
  TOP_ADVERTISER: 'text-yellow-400 bg-yellow-900/20 border-yellow-800/30',
  MOST_ACTIVE_CITY: 'text-accent-cyan bg-cyan-900/20 border-cyan-800/30',
  HIGHEST_SPEND: 'text-accent-purple bg-purple-900/20 border-purple-800/30',
  TRENDING_PLATFORM: 'text-status-success bg-green-900/20 border-green-800/30',
  CAMPAIGN_STATUS: 'text-status-info bg-blue-900/20 border-blue-800/30',
  HIGH_INVESTMENT: 'text-status-warning bg-yellow-900/20 border-yellow-800/30',
  NO_DATA: 'text-text-muted bg-background-elevated border-border',
}

export default function InsightItem({ insight, index = 0 }) {
  const Icon = ICON_MAP[insight.icon] || Info
  const colorClass = TYPE_COLORS[insight.type] || TYPE_COLORS.NO_DATA

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border fade-in-up stagger-item ${colorClass}`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex-shrink-0 mt-0.5">
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm leading-relaxed text-text-primary">{insight.text}</p>
        {insight.value !== undefined && insight.value > 0 && (
          <p className="text-xs mt-1 opacity-70 font-mono">
            Value: {typeof insight.value === 'number' && insight.value > 1000
              ? `₹${(insight.value / 1000).toFixed(1)}K`
              : insight.value}
          </p>
        )}
      </div>
    </div>
  )
}
