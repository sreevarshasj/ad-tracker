// FILE: frontend/src/components/creative/CreativeModal.jsx
import Modal from '../ui/Modal.jsx'
import { PlatformBadge } from '../ui/Badge.jsx'
import { ExternalLink, PlayCircle } from 'lucide-react'

export default function CreativeModal({ creative, onClose }) {
  if (!creative) return null

  return (
    <Modal isOpen={!!creative} onClose={onClose} title="Creative Preview" size="lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Media Preview */}
        <div className="aspect-video bg-background rounded-xl overflow-hidden border border-border relative">
          {creative.mediaUrl ? (
            creative.format === 'VIDEO' ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <PlayCircle size={48} className="text-accent-purple" />
                <a href={creative.mediaUrl} target="_blank" rel="noreferrer" className="btn-primary text-xs">
                  Open Video
                </a>
              </div>
            ) : (
              <img
                src={creative.mediaUrl}
                alt={creative.adCopy}
                className="w-full h-full object-cover"
              />
            )
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-text-muted text-sm">
              No media available
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-4">
          <div>
            <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Platform</p>
            <PlatformBadge platform={creative.platform} />
          </div>

          <div>
            <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Format</p>
            <p className="text-sm text-text-primary font-medium">{creative.format}</p>
          </div>

          <div>
            <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Ad Copy</p>
            <p className="text-sm text-text-secondary leading-relaxed">{creative.adCopy || 'No copy available'}</p>
          </div>

          {creative.cta && (
            <div>
              <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Call to Action</p>
              <span className="text-sm bg-accent-purple/20 text-accent-purple px-3 py-1 rounded-lg font-medium">
                {creative.cta}
              </span>
            </div>
          )}

          {creative.campaign && (
            <div>
              <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Institution</p>
              <p className="text-sm text-text-primary font-medium">{creative.campaign.institutionName}</p>
              <p className="text-xs text-text-muted">{creative.campaign.category}</p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
