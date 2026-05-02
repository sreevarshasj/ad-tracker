// FILE: frontend/src/hooks/usePerformance.js
import { useQuery } from '@tanstack/react-query'
import { useFilterStore } from '../store/filterStore.js'
import {
  fetchPerformanceOverview,
  fetchSpendTrend,
  fetchPlatformBreakdown,
} from '../api/performance.api.js'

export const usePerformanceOverview = () => {
  const getQueryParams = useFilterStore((s) => s.getQueryParams)
  const filters = getQueryParams()

  const { data, isLoading, error } = useQuery({
    queryKey: ['performance-overview', filters.days],
    queryFn: () => fetchPerformanceOverview({ days: filters.days || '30' }),
    staleTime: 5 * 60 * 1000,
  })

  return { overview: data, isLoading, error: error?.message }
}

export const useSpendTrend = () => {
  const getQueryParams = useFilterStore((s) => s.getQueryParams)
  const filters = getQueryParams()

  const { data, isLoading, error } = useQuery({
    queryKey: ['spend-trend', filters],
    queryFn: () => fetchSpendTrend({ days: filters.days || '30', platform: filters.platform }),
    staleTime: 5 * 60 * 1000,
  })

  return { trendData: data || [], isLoading, error: error?.message }
}

export const usePlatformBreakdown = () => {
  const getQueryParams = useFilterStore((s) => s.getQueryParams)
  const filters = getQueryParams()

  const { data, isLoading, error } = useQuery({
    queryKey: ['platform-breakdown', filters.days],
    queryFn: () => fetchPlatformBreakdown({ days: filters.days || '90' }),
    staleTime: 5 * 60 * 1000,
  })

  return { platformData: data || [], isLoading, error: error?.message }
}
