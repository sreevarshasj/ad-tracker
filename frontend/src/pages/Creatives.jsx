// FILE: frontend/src/pages/Creatives.jsx
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axiosClient from '../api/axiosClient.js'
import CreativeCard from '../components/creative/CreativeCard.jsx'
import CreativeModal from '../components/creative/CreativeModal.jsx'
import Skeleton from '../components/ui/Skeleton.jsx'
import { PLATFORMS } from '../utils/constants.js'
import { Image, Video, LayoutGrid } from 'lucide-react'

const FORMATS = [
  { value: '', label: 'All', icon: LayoutGrid },
  { value: 'IMAGE', label: 'Images', icon: Image },
  { value: 'VIDEO', label: 'Videos', icon: Video },
]

export default function Creatives() {
  const [platform, setPlatform] = useState('')
  const [format, setFormat] = useState('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['creatives-gallery', platform, format, page],
    queryFn: () =>
      axiosClient.get('/creatives', {
        params: { platform: platform || undefined, format: format || undefined, page, limit: 24 },
      }),
    staleTime: 3 * 60 * 1000,
  })

  const creatives = data?.creatives || []
  const totalPages = data?.pagination?.totalPages || 1

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-xl font-bold text-text-primary">Creatives</h1>
        <p className="text-sm text-text-secondary mt-1">
          Browse ad creatives from all platforms
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* Format Filter */}
        <div className="flex gap-1">
          {FORMATS.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setFormat(value)}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all ${
                format === value
                  ? 'bg-accent-purple/20 text-accent-purple border-accent-purple/50'
                  : 'border-border text-text-muted hover:text-text-primary bg-background-surface'
              }`}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>

        {/* Platform Filter */}
        <div className="flex gap-1">
          <button
            onClick={() => setPlatform('')}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
              !platform ? 'bg-accent-purple/20 text-accent-purple border-accent-purple/50' : 'border-border text-text-muted hover:text-text-primary bg-background-surface'
            }`}
          >
            All Platforms
          </button>
          {PLATFORMS.map((p) => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                platform === p ? 'bg-accent-purple/20 text-accent-purple border-accent-purple/50' : 'border-border text-text-muted hover:text-text-primary bg-background-surface'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(12)].map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-xl" />
          ))}
        </div>
      ) : creatives.length === 0 ? (
        <div className="text-center py-20">
          <Image size={48} className="text-text-muted mx-auto mb-4" />
          <p className="text-text-secondary">No creatives found. Sync to fetch ad creatives.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {creatives.map((creative) => (
            <CreativeCard key={creative.id} creative={creative} onClick={setSelected} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="btn-ghost border border-border disabled:opacity-40">
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-text-secondary">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="btn-ghost border border-border disabled:opacity-40">
            Next
          </button>
        </div>
      )}

      <CreativeModal creative={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
