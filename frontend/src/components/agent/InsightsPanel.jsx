// FILE: frontend/src/components/agent/InsightsPanel.jsx
import { Sparkles, RefreshCw, AlertCircle } from 'lucide-react'
import { useInsights } from '../../hooks/useInsights.js'
import { useQueryClient } from '@tanstack/react-query'
import { triggerSync } from '../../api/insights.api.js'
import InsightItem from './InsightItem.jsx'
import Skeleton from '../ui/Skeleton.jsx'
import { formatRelativeTime } from '../../utils/formatters.js'
import { useState } from 'react'

export default function InsightsPanel() {
  const { insights, lastSync, isLoading, error, refetch } = useInsights()
  const queryClient = useQueryClient()
  const [syncing, setSyncing] = useState(false)

  const handleRefresh = async () => {
    setSyncing(true)
    try {
      await triggerSync()
      setTimeout(async () => {
        await queryClient.invalidateQueries()
        setSyncing(false)
      }, 3000)
    } catch (e) {
      setSyncing(false)
    }
  }

  return (
    <div className="card-dark p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent-purple/20 border border-accent-purple/30 flex items-center justify-center">
            <Sparkles size={15} className="text-accent-purple" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-primary">Agent Insights</h3>
            {lastSync && (
              <p className="text-[10px] text-text-muted">
                Updated {formatRelativeTime(lastSync.syncedAt)}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={handleRefresh}
          disabled={syncing}
          className="btn-ghost border border-border text-xs px-3 py-1.5 flex items-center gap-1.5"
        >
          <RefreshCw size={12} className={syncing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-16 w-full rounded-xl" count={4} />
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 p-4 bg-status-danger/10 border border-status-danger/20 rounded-xl text-sm text-status-danger">
          <AlertCircle size={16} />
          <span>Failed to load insights. {error}</span>
        </div>
      ) : insights.length === 0 ? (
        <div className="text-center py-8">
          <Sparkles size={32} className="text-text-muted mx-auto mb-3" />
          <p className="text-sm text-text-secondary">No insights yet. Trigger a sync to generate insights.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {insights.map((insight, i) => (
            <InsightItem key={insight.type + i} insight={insight} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
