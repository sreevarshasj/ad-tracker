// FILE: frontend/src/components/creative/CreativePanel.jsx
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axiosClient from '../../api/axiosClient.js'
import CreativeCard from './CreativeCard.jsx'
import CreativeModal from './CreativeModal.jsx'
import Skeleton from '../ui/Skeleton.jsx'

export default function CreativePanel({ campaignId, limit = 6 }) {
  const [selected, setSelected] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['creatives', campaignId, limit],
    queryFn: () => axiosClient.get('/creatives', { params: { campaignId, limit } }),
    enabled: !!campaignId,
  })

  const creatives = data?.creatives || []

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-xl" />
        ))}
      </div>
    )
  }

  if (!creatives.length) {
    return (
      <p className="text-sm text-text-muted text-center py-8">
        No creatives found for this campaign
      </p>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        {creatives.slice(0, limit).map((creative) => (
          <CreativeCard key={creative.id} creative={creative} onClick={setSelected} />
        ))}
      </div>
      <CreativeModal creative={selected} onClose={() => setSelected(null)} />
    </>
  )
}
