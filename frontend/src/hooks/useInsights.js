// FILE: frontend/src/hooks/useInsights.js
import { useQuery } from '@tanstack/react-query'
import { useFilterStore } from '../store/filterStore.js'
import { fetchInsights, fetchRankings, fetchSyncStatus } from '../api/insights.api.js'

export const useInsights = () => {
  const getQueryParams = useFilterStore((s) => s.getQueryParams)
  const filters = getQueryParams()

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['insights', filters],
    queryFn: () => fetchInsights(filters),
    staleTime: 5 * 60 * 1000,
  })

  return {
    insights: data?.insights || [],
    trends: data?.trends || null,
    summary: data?.summary || null,
    lastSync: data?.lastSync || null,
    rankedInstitutions: data?.rankedInstitutions || [],
    isLoading,
    error: error?.message,
    refetch,
  }
}

export const useRankings = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['rankings'],
    queryFn: () => fetchRankings({ limit: 10 }),
    staleTime: 10 * 60 * 1000,
  })

  return { rankings: data || [], isLoading, error: error?.message }
}

export const useSyncStatus = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['sync-status'],
    queryFn: fetchSyncStatus,
    refetchInterval: 30000, // poll every 30 seconds
    staleTime: 0,
  })

  return { syncStatus: data, isLoading, refetch }
}
