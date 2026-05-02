// FILE: frontend/src/components/filters/DateRangeFilter.jsx
import { useFilterStore } from '../../store/filterStore.js'
import { DATE_RANGES } from '../../utils/constants.js'

export default function DateRangeFilter() {
  const dateRange = useFilterStore((s) => s.dateRange)
  const setDateRange = useFilterStore((s) => s.setDateRange)

  return (
    <div>
      <label className="text-[10px] text-text-muted block mb-1 uppercase tracking-wider">Time Range</label>
      <div className="flex items-center gap-1">
        {DATE_RANGES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setDateRange(value)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-all duration-200 font-medium ${
              dateRange === value
                ? 'bg-accent-purple/20 text-accent-purple border-accent-purple/50'
                : 'border-border text-text-muted hover:text-text-primary hover:border-text-muted bg-background-surface'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
