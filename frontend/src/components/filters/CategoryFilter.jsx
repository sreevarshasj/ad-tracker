// FILE: frontend/src/components/filters/CategoryFilter.jsx
import { useFilterStore } from '../../store/filterStore.js'
import { School, GraduationCap, Building2 } from 'lucide-react'

const CATEGORIES = [
  { value: 'SCHOOL', label: 'School', icon: School, color: 'text-blue-400', bg: 'bg-blue-900/30', border: 'border-blue-700/50' },
  { value: 'COLLEGE', label: 'College', icon: GraduationCap, color: 'text-purple-400', bg: 'bg-purple-900/30', border: 'border-purple-700/50' },
  { value: 'UNIVERSITY', label: 'University', icon: Building2, color: 'text-cyan-400', bg: 'bg-cyan-900/30', border: 'border-cyan-700/50' },
]

export default function CategoryFilter() {
  const category = useFilterStore((s) => s.category)
  const setCategory = useFilterStore((s) => s.setCategory)

  return (
    <div>
      <label className="text-[10px] text-text-muted block mb-1 uppercase tracking-wider">Category</label>
      <div className="flex items-center gap-1.5">
        {CATEGORIES.map(({ value, label, icon: Icon, color, bg, border }) => {
          const isActive = category === value
          return (
            <button
              key={value}
              onClick={() => setCategory(isActive ? '' : value)}
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition-all duration-200 font-medium ${
                isActive
                  ? `${bg} ${color} ${border}`
                  : 'border-border text-text-muted hover:border-text-muted bg-background-surface'
              }`}
            >
              <Icon size={12} />
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
