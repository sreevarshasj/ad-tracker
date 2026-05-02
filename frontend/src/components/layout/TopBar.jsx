// FILE: frontend/src/components/layout/TopBar.jsx
import { Bell, RefreshCw } from 'lucide-react'
import { useUIStore } from '../../store/uiStore.js'
import { triggerSync } from '../../api/insights.api.js'
import { useQueryClient } from '@tanstack/react-query'
import SearchBar from '../ui/SearchBar.jsx'
import { useState } from 'react'

export default function TopBar({ title }) {
  const queryClient = useQueryClient()
  const [syncing, setSyncing] = useState(false)

  const handleSync = async () => {
    setSyncing(true)
    try {
      await triggerSync()
      setTimeout(() => {
        queryClient.invalidateQueries()
      }, 3000)
    } catch (e) {
      console.error('Sync failed:', e.message)
    } finally {
      setTimeout(() => setSyncing(false), 2000)
    }
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-20">
      <div>
        <h1 className="text-lg font-semibold text-text-primary">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <SearchBar />

        <button
          onClick={handleSync}
          disabled={syncing}
          className="btn-ghost border border-border flex items-center gap-2"
        >
          <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
          {syncing ? 'Syncing...' : 'Sync Now'}
        </button>

        <button className="relative p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-border transition-all">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent-purple rounded-full" />
        </button>

        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-purple to-accent-cyan flex items-center justify-center text-xs font-bold text-white">
          AT
        </div>
      </div>
    </header>
  )
}
