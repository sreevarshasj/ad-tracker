// FILE: frontend/src/hooks/useExport.js
import { useState } from 'react'
import { useCampaigns } from './useCampaigns.js'

export const useExport = () => {
  const [isExporting, setIsExporting] = useState(false)

  const exportToCSV = async (campaigns, filename = 'ads-tracker-export.csv') => {
    setIsExporting(true)
    try {
      const headers = [
        'Institution Name', 'Platform', 'Category', 'Country', 'State',
        'City', 'Status', 'Tags', 'Est. Spend', 'Start Date', 'End Date'
      ]

      const rows = campaigns.map((c) => [
        `"${c.institutionName || ''}"`,
        c.platform || '',
        c.category || '',
        c.country || '',
        c.state || '',
        c.city || '',
        c.status || '',
        `"${(c.tags || []).join(', ')}"`,
        (c.estimatedSpend || 0).toFixed(2),
        c.startDate ? new Date(c.startDate).toLocaleDateString() : '',
        c.endDate ? new Date(c.endDate).toLocaleDateString() : 'Ongoing',
      ])

      const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.click()
      URL.revokeObjectURL(url)
    } finally {
      setIsExporting(false)
    }
  }

  const exportToJSON = (data, filename = 'ads-tracker-export.json') => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  }

  return { exportToCSV, exportToJSON, isExporting }
}
