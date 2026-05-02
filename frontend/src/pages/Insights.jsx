// FILE: frontend/src/pages/Insights.jsx
import { Sparkles, TrendingUp, TrendingDown, Minus, Trophy } from 'lucide-react'
import { useInsights, useRankings } from '../hooks/useInsights.js'
import { useSyncStatus } from '../hooks/useInsights.js'
import { triggerSync } from '../api/insights.api.js'
import InsightItem from '../components/agent/InsightItem.jsx'
import Skeleton from '../components/ui/Skeleton.jsx'
import { formatCurrency, formatRelativeTime } from '../utils/formatters.js'
import FilterBar from '../components/filters/FilterBar.jsx'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

export default function Insights() {
  const { insights, trends, summary, lastSync, isLoading } = useInsights()
  const { rankings } = useRankings()
  const { syncStatus } = useSyncStatus()
  const queryClient = useQueryClient()
  const [syncing, setSyncing] = useState(false)

  const handleSync = async () => {
    setSyncing(true)
    try {
      await triggerSync()
      setTimeout(() => {
        queryClient.invalidateQueries()
        setSyncing(false)
      }, 3000)
    } catch {
      setSyncing(false)
    }
  }

  const TrendIcon = trends?.trend === 'UP' ? TrendingUp : trends?.trend === 'DOWN' ? TrendingDown : Minus
  const trendColor = trends?.trend === 'UP' ? 'text-status-success' : trends?.trend === 'DOWN' ? 'text-status-danger' : 'text-text-muted'

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Agent Insights</h1>
          <p className="text-sm text-text-secondary mt-1">
            AI-generated insights from your campaign data
          </p>
        </div>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="btn-primary flex items-center gap-2"
        >
          <Sparkles size={14} className={syncing ? 'animate-spin' : ''} />
          {syncing ? 'Refreshing...' : 'Refresh Insights'}
        </button>
      </div>

      {/* Sync Status Banner */}
      {lastSync && (
        <div className="flex items-center gap-3 px-4 py-3 bg-status-success/10 border border-status-success/20 rounded-xl text-sm">
          <div className="w-2 h-2 rounded-full bg-status-success status-pulse" />
          <span className="text-status-success font-medium">
            Last synced {formatRelativeTime(lastSync.syncedAt)} — {lastSync.count} records
          </span>
        </div>
      )}

      {/* Spend Trend Banner */}
      {trends && (
        <div className="card-dark p-4 flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            trends.trend === 'UP' ? 'bg-status-success/20' : trends.trend === 'DOWN' ? 'bg-status-danger/20' : 'bg-border'
          }`}>
            <TrendIcon size={22} className={trendColor} />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">
              Week-over-Week Spend {trends.trend === 'UP' ? 'Increased' : trends.trend === 'DOWN' ? 'Decreased' : 'Stable'} by {trends.percentage}%
            </p>
            <p className="text-xs text-text-muted mt-0.5">Compared to last 7 days</p>
          </div>
        </div>
      )}

      <FilterBar />

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Insights List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider">AI-Generated Insights</h2>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
            </div>
          ) : insights.length === 0 ? (
            <div className="text-center py-16 card-dark">
              <Sparkles size={40} className="text-text-muted mx-auto mb-3" />
              <p className="text-text-secondary">No insights yet. Click Refresh Insights to generate them.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {insights.map((insight, i) => (
                <InsightItem key={insight.type + i} insight={insight} index={i} />
              ))}
            </div>
          )}
        </div>

        {/* Rankings Panel */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider flex items-center gap-2">
            <Trophy size={14} className="text-yellow-400" />
            Top Advertisers
          </h2>
          <div className="card-dark divide-y divide-border">
            {rankings.slice(0, 10).map((inst, i) => (
              <div key={inst.institutionName} className="flex items-center gap-3 px-4 py-3 hover:bg-background-elevated transition-colors">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold"
                  style={{ background: i < 3 ? 'linear-gradient(135deg, #6C5CE7, #00D2FF)' : '#16161F', color: i < 3 ? '#fff' : '#9B9BB4' }}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary font-medium truncate">{inst.institutionName}</p>
                  <p className="text-xs text-text-muted">{inst.campaignCount} campaigns</p>
                </div>
                <p className="text-sm font-semibold text-accent-purple flex-shrink-0">
                  {formatCurrency(inst.totalSpend)}
                </p>
              </div>
            ))}
            {rankings.length === 0 && (
              <p className="text-center py-8 text-sm text-text-muted px-4">
                No ranking data yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
