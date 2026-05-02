// FILE: frontend/src/components/table/TableRow.jsx
import { formatDate, formatCurrency } from '../../utils/formatters.js'
import { PlatformBadge, StatusBadge, TagBadge, CategoryBadge } from '../ui/Badge.jsx'
import { MapPin } from 'lucide-react'

export default function TableRow({ campaign, onClick }) {
  return (
    <tr
      className="border-b border-border hover:bg-background-elevated transition-colors cursor-pointer group"
      onClick={() => onClick && onClick(campaign)}
    >
      {/* Institution */}
      <td className="px-4 py-3">
        <div>
          <p className="text-sm font-medium text-text-primary group-hover:text-accent-purple transition-colors leading-tight">
            {campaign.institutionName}
          </p>
          <CategoryBadge category={campaign.category} />
        </div>
      </td>

      {/* Platform */}
      <td className="px-4 py-3">
        <PlatformBadge platform={campaign.platform} />
      </td>

      {/* Location */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5 text-sm text-text-secondary">
          <MapPin size={12} className="text-text-muted flex-shrink-0" />
          <span className="truncate max-w-[120px]">
            {[campaign.city, campaign.state].filter(Boolean).join(', ') || campaign.country || '—'}
          </span>
        </div>
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <StatusBadge status={campaign.status} />
      </td>

      {/* Tags */}
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-1">
          {campaign.tags?.length > 0
            ? campaign.tags.map((tag) => <TagBadge key={tag} tag={tag} />)
            : <span className="text-text-muted text-xs">—</span>
          }
        </div>
      </td>

      {/* Spend */}
      <td className="px-4 py-3">
        <span className="text-sm font-semibold text-accent-purple">
          {formatCurrency(campaign.estimatedSpend)}
        </span>
      </td>

      {/* Start Date */}
      <td className="px-4 py-3 text-sm text-text-secondary">
        {formatDate(campaign.startDate)}
      </td>

      {/* End Date */}
      <td className="px-4 py-3 text-sm text-text-secondary">
        {campaign.endDate ? formatDate(campaign.endDate) : (
          <span className="text-status-success text-xs font-medium">Ongoing</span>
        )}
      </td>

      {/* Source Link */}
      <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
        <a
          href={
            campaign.platform === 'META' ? `https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=IN&q=${encodeURIComponent(campaign.institutionName)}&search_type=keyword_unordered&media_type=all` :
            campaign.platform === 'GOOGLE' ? `https://adstransparency.google.com/?query=${encodeURIComponent(campaign.institutionName)}&region=IN` :
            campaign.platform === 'LINKEDIN' ? `https://www.linkedin.com/ad-library/search?keyword=${encodeURIComponent(campaign.institutionName)}` :
            '#'
          }
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-bold text-accent-purple hover:text-accent-cyan transition-colors uppercase tracking-widest border border-accent-purple/30 px-2 py-1 rounded hover:bg-accent-purple/10"
        >
          View Ads
        </a>
      </td>
    </tr>
  )
}
