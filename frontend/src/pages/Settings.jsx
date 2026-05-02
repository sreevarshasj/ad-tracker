// FILE: frontend/src/pages/Settings.jsx
import { useState } from 'react'
import { Save, Eye, EyeOff, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'
import { triggerSync } from '../api/insights.api.js'
import { useSyncStatus } from '../hooks/useInsights.js'
import { formatRelativeTime } from '../utils/formatters.js'
import { useQueryClient } from '@tanstack/react-query'

const API_SECTIONS = [
  {
    title: 'Meta Ads',
    color: '#1877F2',
    keys: [
      { key: 'META_APP_ID', label: 'App ID', placeholder: 'your_meta_app_id' },
      { key: 'META_ACCESS_TOKEN', label: 'Access Token', placeholder: 'EAAxxxxxxxx...', secret: true },
      { key: 'META_AD_ACCOUNT_ID', label: 'Ad Account ID', placeholder: 'act_XXXXXXXXXX' },
    ],
  },
  {
    title: 'Google Ads',
    color: '#EA4335',
    keys: [
      { key: 'GOOGLE_ADS_CUSTOMER_ID', label: 'Customer ID', placeholder: '123-456-7890' },
      { key: 'GOOGLE_ADS_DEVELOPER_TOKEN', label: 'Developer Token', placeholder: 'xxxxxxxx...', secret: true },
    ],
  },
  {
    title: 'LinkedIn Ads',
    color: '#0A66C2',
    keys: [
      { key: 'LINKEDIN_CLIENT_ID', label: 'Client ID', placeholder: 'your_client_id' },
      { key: 'LINKEDIN_ACCESS_TOKEN', label: 'Access Token', placeholder: 'AQxxxxxx...', secret: true },
      { key: 'LINKEDIN_AD_ACCOUNT_ID', label: 'Ad Account ID', placeholder: '123456789' },
    ],
  },
]

function SecretInput({ placeholder, value, onChange }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-dark w-full pr-10"
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
      >
        {show ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
    </div>
  )
}

export default function Settings() {
  const [apiKeys, setApiKeys] = useState({})
  const [saved, setSaved] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const { syncStatus } = useSyncStatus()
  const queryClient = useQueryClient()

  const handleSave = () => {
    // In a real app, this would securely save to backend
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleSync = async () => {
    setSyncing(true)
    try {
      await triggerSync()
      setTimeout(() => {
        queryClient.invalidateQueries()
        setSyncing(false)
      }, 3000)
    } catch (e) {
      setSyncing(false)
    }
  }

  return (
    <div className="space-y-6 fade-in max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-text-primary">Settings</h1>
        <p className="text-sm text-text-secondary mt-1">Configure API keys and sync preferences</p>
      </div>

      {/* Sync Control */}
      <div className="card-dark p-5 space-y-4">
        <h2 className="text-sm font-semibold text-text-primary">Sync Control</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text-secondary">Manual Sync</p>
            <p className="text-xs text-text-muted mt-0.5">
              Last sync: {syncStatus?.lastSync ? formatRelativeTime(syncStatus.lastSync) : 'Never'}
            </p>
          </div>
          <button
            onClick={handleSync}
            disabled={syncing}
            className="btn-primary flex items-center gap-2"
          >
            <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
            {syncing ? 'Syncing...' : 'Sync Now'}
          </button>
        </div>

        {/* Recent sync logs */}
        {syncStatus?.platformStatus?.length > 0 && (
          <div className="border-t border-border pt-4 space-y-2">
            <p className="text-xs text-text-muted uppercase tracking-wider">Last Sync Status</p>
            {syncStatus.platformStatus.map((log) => (
              <div key={log.platform} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  {log.status === 'SUCCESS'
                    ? <CheckCircle size={13} className="text-status-success" />
                    : <AlertCircle size={13} className="text-status-danger" />
                  }
                  <span className="text-text-secondary">{log.platform}</span>
                </div>
                <div className="text-right">
                  <span className={log.status === 'SUCCESS' ? 'text-status-success' : 'text-status-danger'}>
                    {log.status === 'SUCCESS' ? `${log.count} synced` : 'Failed'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* API Keys */}
      {API_SECTIONS.map((section) => (
        <div key={section.title} className="card-dark p-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: section.color }} />
            <h2 className="text-sm font-semibold text-text-primary">{section.title}</h2>
          </div>

          <div className="space-y-3">
            {section.keys.map(({ key, label, placeholder, secret }) => (
              <div key={key}>
                <label className="text-xs text-text-muted block mb-1">{label}</label>
                {secret ? (
                  <SecretInput
                    placeholder={placeholder}
                    value={apiKeys[key] || ''}
                    onChange={(v) => setApiKeys((prev) => ({ ...prev, [key]: v }))}
                  />
                ) : (
                  <input
                    type="text"
                    value={apiKeys[key] || ''}
                    onChange={(e) => setApiKeys((prev) => ({ ...prev, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="input-dark w-full"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Thresholds */}
      <div className="card-dark p-5 space-y-4">
        <h2 className="text-sm font-semibold text-text-primary">Classification Thresholds</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-text-muted block mb-1">High Spend Threshold (₹)</label>
            <input type="number" defaultValue="5000" className="input-dark w-full" />
          </div>
          <div>
            <label className="text-xs text-text-muted block mb-1">Long Running (Days)</label>
            <input type="number" defaultValue="30" className="input-dark w-full" />
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center gap-3">
        <button onClick={handleSave} className="btn-primary flex items-center gap-2">
          {saved ? <CheckCircle size={14} /> : <Save size={14} />}
          {saved ? 'Saved!' : 'Save Settings'}
        </button>
        {saved && <p className="text-xs text-status-success">Settings saved successfully</p>}
      </div>
    </div>
  )
}
