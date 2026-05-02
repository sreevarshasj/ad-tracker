// FILE: frontend/src/components/ui/ExportMenu.jsx
import { useState, useRef, useEffect } from 'react'
import { Download, FileText, FileJson } from 'lucide-react'
import { useExport } from '../../hooks/useExport.js'

export default function ExportMenu({ campaigns = [] }) {
  const [open, setOpen] = useState(false)
  const { exportToCSV, exportToJSON, isExporting } = useExport()
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={isExporting}
        className="btn-ghost flex items-center gap-2 border border-border"
      >
        <Download size={14} />
        Export
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-48 bg-background-elevated border border-border rounded-xl shadow-card z-50 fade-in overflow-hidden">
          <button
            onClick={() => { exportToCSV(campaigns); setOpen(false) }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-text-secondary hover:text-text-primary hover:bg-border transition-colors"
          >
            <FileText size={15} className="text-status-success" />
            Export as CSV
          </button>
          <button
            onClick={() => { exportToJSON(campaigns); setOpen(false) }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-text-secondary hover:text-text-primary hover:bg-border transition-colors"
          >
            <FileJson size={15} className="text-accent-cyan" />
            Export as JSON
          </button>
        </div>
      )}
    </div>
  )
}
