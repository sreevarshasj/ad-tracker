// FILE: frontend/src/components/creative/CreativeCard.jsx
import { PlatformBadge } from '../ui/Badge.jsx'
import { PlayCircle, Image as ImageIcon } from 'lucide-react'

export default function CreativeCard({ creative, onClick }) {
  const hasMedia = !!creative.mediaUrl

  return (
    <div
      onClick={() => onClick && onClick(creative)}
      className="card-dark overflow-hidden cursor-pointer hover:border-accent-purple/50 hover:shadow-glow transition-all duration-300 group"
    >
      {/* Preview */}
      <div className="aspect-video bg-background relative overflow-hidden">
        {hasMedia ? (
          <img
            src={creative.mediaUrl}
            alt={creative.adCopy || 'Ad creative'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.target.style.display = 'none' }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <ImageIcon size={32} className="text-text-muted" />
          </div>
        )}

        {creative.format === 'VIDEO' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <PlayCircle size={36} className="text-white opacity-90" />
          </div>
        )}

        <div className="absolute top-2 right-2">
          <PlatformBadge platform={creative.platform} />
        </div>
      </div>

      {/* Info */}
      <div className="p-3 space-y-1.5">
        <p className="text-xs text-text-primary line-clamp-2 leading-relaxed">
          {creative.adCopy || 'No ad copy available'}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-text-muted uppercase tracking-wider">{creative.format}</span>
          {creative.cta && (
            <span className="text-[10px] bg-accent-purple/20 text-accent-purple px-2 py-0.5 rounded-full font-medium">
              {creative.cta}
            </span>
          )}
        </div>
        {creative.campaign?.institutionName && (
          <p className="text-[10px] text-text-muted truncate">
            {creative.campaign.institutionName}
          </p>
        )}
      </div>
    </div>
  )
}
