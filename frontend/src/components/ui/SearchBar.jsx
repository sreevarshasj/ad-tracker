// FILE: frontend/src/components/ui/SearchBar.jsx
import { Search, X } from 'lucide-react'
import { useFilterStore } from '../../store/filterStore.js'
import { useEffect, useRef, useState } from 'react'

export default function SearchBar({ placeholder = 'Search institutions...' }) {
  const searchQuery = useFilterStore((s) => s.searchQuery)
  const setSearchQuery = useFilterStore((s) => s.setSearchQuery)
  const [local, setLocal] = useState(searchQuery)
  const timerRef = useRef(null)

  // Debounce
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setSearchQuery(local)
    }, 300)
    return () => clearTimeout(timerRef.current)
  }, [local])

  // Sync external
  useEffect(() => {
    setLocal(searchQuery)
  }, [searchQuery])

  return (
    <div className="relative flex-1 max-w-sm">
      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
      <input
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
        className="input-dark w-full pl-9 pr-8"
        id="global-search"
      />
      {local && (
        <button
          onClick={() => { setLocal(''); setSearchQuery('') }}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}
