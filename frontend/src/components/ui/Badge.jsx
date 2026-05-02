// FILE: frontend/src/components/ui/Badge.jsx
import { PLATFORM_CONFIG } from '../../utils/constants.js'

export const PlatformBadge = ({ platform }) => {
  const config = PLATFORM_CONFIG[platform] || {}
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium border ${config.bg} ${config.text}`}
      style={{ borderColor: config.color + '40' }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: config.color }} />
      {config.label || platform}
    </span>
  )
}

export const StatusBadge = ({ status }) => {
  const configs = {
    ACTIVE: 'badge-active',
    ENDED: 'badge-ended',
    PAUSED: 'badge-paused',
  }
  return <span className={configs[status] || 'badge-ended'}>{status}</span>
}

export const TagBadge = ({ tag }) => {
  const configs = {
    'High Investment': 'badge-high-invest',
    'Long Running': 'badge-long-running',
    'High Engagement': 'badge-high-engagement',
  }
  return <span className={configs[tag] || 'badge-ended'}>{tag}</span>
}

export const CategoryBadge = ({ category }) => {
  const configs = {
    SCHOOL: 'badge-school',
    COLLEGE: 'badge-college',
  }
  return <span className={configs[category] || 'badge-ended'}>{category}</span>
}

export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-background-elevated text-text-secondary border-border',
    purple: 'bg-purple-900/30 text-purple-400 border-purple-800/50',
    cyan: 'bg-cyan-900/30 text-accent-cyan border-cyan-800/50',
    success: 'bg-green-900/30 text-status-success border-green-800/50',
    warning: 'bg-yellow-900/30 text-status-warning border-yellow-800/50',
    danger: 'bg-red-900/30 text-status-danger border-red-800/50',
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
