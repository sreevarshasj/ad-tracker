// FILE: frontend/src/components/agent/AgentStatus.jsx
import { useSyncStatus } from '../../hooks/useInsights.js'
import { formatRelativeTime } from '../../utils/formatters.js'
import { Activity } from 'lucide-react'

export default function AgentStatus({ collapsed }) {
  const { syncStatus } = useSyncStatus()
  const lastSync = syncStatus?.lastSync
  const hasError = !!syncStatus?.lastFailed && !lastSync

  const dotColor = !lastSync
    ? 'bg-text-muted'
    : hasError
    ? 'bg-status-danger'
    : 'bg-status-success'

  if (collapsed) {
    return (
      <div className="flex justify-center">
        <div className={`w-2.5 h-2.5 rounded-full ${dotColor} status-pulse`} />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 px-1">
      <div className="relative flex-shrink-0">
        <div className={`w-2 h-2 rounded-full ${dotColor} status-pulse`} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] text-text-muted font-medium uppercase tracking-wider">Agent Status</p>
        <p className="text-xs text-text-secondary truncate">
          {lastSync ? `Synced ${formatRelativeTime(lastSync)}` : 'Not synced yet'}
        </p>
      </div>
    </div>
  )
}
