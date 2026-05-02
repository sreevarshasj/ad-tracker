// FILE: frontend/src/components/cards/CampaignCard.jsx
import { formatDate, formatCurrency } from '../../utils/formatters.js'
import { PlatformBadge, StatusBadge, TagBadge, CategoryBadge } from '../ui/Badge.jsx'
import { MapPin, Calendar, Eye, MousePointerClick, Percent } from 'lucide-react'

export default function CampaignCard({ campaign }) {
  if (!campaign) return null

  const latestPerf = campaign.performances?.[0]

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-text-primary leading-tight">{campaign.institutionName}</h3>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <CategoryBadge category={campaign.category} />
            <PlatformBadge platform={campaign.platform} />
            <StatusBadge status={campaign.status} />
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-lg font-bold text-accent-purple">{formatCurrency(campaign.estimatedSpend)}</p>
          <p className="text-xs text-text-muted">Est. Spend</p>
        </div>
      </div>

      {/* Tags */}
      {campaign.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {campaign.tags.map((tag) => <TagBadge key={tag} tag={tag} />)}
        </div>
      )}

      {/* Meta info */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <MapPin size={13} className="text-text-muted flex-shrink-0" />
          <span className="truncate">{[campaign.city, campaign.state].filter(Boolean).join(', ') || campaign.country || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <Calendar size={13} className="text-text-muted flex-shrink-0" />
          <span>{formatDate(campaign.startDate)}</span>
        </div>
      </div>

      {/* Performance metrics */}
      {latestPerf && (
        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border">
          {[
            { icon: Eye, label: 'Impressions', value: latestPerf.impressions?.toLocaleString() },
            { icon: MousePointerClick, label: 'Clicks', value: latestPerf.clicks?.toLocaleString() },
            { icon: Percent, label: 'CTR', value: `${latestPerf.ctr?.toFixed(2)}%` },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="text-center p-2 bg-background rounded-lg">
              <Icon size={14} className="text-text-muted mx-auto mb-1" />
              <p className="text-sm font-semibold text-text-primary">{value || 'N/A'}</p>
              <p className="text-[10px] text-text-muted">{label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
