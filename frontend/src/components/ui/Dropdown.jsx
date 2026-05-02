// FILE: frontend/src/components/ui/Dropdown.jsx
import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

export default function Dropdown({ options = [], value, onChange, placeholder = 'Select...', className = '' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selected = options.find((o) => (typeof o === 'string' ? o : o.value) === value)
  const label = selected
    ? typeof selected === 'string' ? selected : selected.label
    : placeholder

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="input-dark flex items-center justify-between gap-2 w-full text-left"
      >
        <span className={value ? 'text-text-primary' : 'text-text-muted'}>{label}</span>
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-background-elevated border border-border rounded-lg shadow-card fade-in max-h-56 overflow-y-auto">
          <button
            onClick={() => { onChange(''); setOpen(false) }}
            className="w-full px-3 py-2 text-left text-sm text-text-muted hover:bg-border transition-colors"
          >
            {placeholder}
          </button>
          {options.map((opt) => {
            const val = typeof opt === 'string' ? opt : opt.value
            const lbl = typeof opt === 'string' ? opt : opt.label
            return (
              <button
                key={val}
                onClick={() => { onChange(val); setOpen(false) }}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-border transition-colors ${
                  value === val ? 'text-accent-purple' : 'text-text-primary'
                }`}
              >
                {lbl}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
