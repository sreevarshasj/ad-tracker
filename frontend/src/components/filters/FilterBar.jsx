// FILE: frontend/src/components/filters/FilterBar.jsx
import { Filter, X } from 'lucide-react'
import { useFilterStore } from '../../store/filterStore.js'
import LocationFilter from './LocationFilter.jsx'
import PlatformFilter from './PlatformFilter.jsx'
import CategoryFilter from './CategoryFilter.jsx'
import DateRangeFilter from './DateRangeFilter.jsx'
import Button from '../ui/Button.jsx'

export default function FilterBar() {
  const activeFilterCount = useFilterStore((s) => s.getActiveFilterCount())
  const resetFilters = useFilterStore((s) => s.resetFilters)

  return (
    <div className="card-dark p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Filter size={14} className="text-text-muted" />
        <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">Filters</span>
        {activeFilterCount > 0 && (
          <span className="bg-accent-purple text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
            {activeFilterCount}
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <LocationFilter />
        <PlatformFilter />
        <CategoryFilter />
        <DateRangeFilter />

        {activeFilterCount > 0 && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 text-xs text-text-muted hover:text-status-danger transition-colors px-3 py-2 rounded-lg hover:bg-status-danger/10 border border-transparent hover:border-status-danger/30"
          >
            <X size={12} />
            Reset All
          </button>
        )}
      </div>
    </div>
  )
}
