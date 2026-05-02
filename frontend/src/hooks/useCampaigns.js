// FILE: frontend/src/hooks/useCampaigns.js
import { useQuery } from '@tanstack/react-query'
import { useFilterStore } from '../store/filterStore.js'
import { fetchCampaigns, fetchCampaignStats } from '../api/campaigns.api.js'
import { useDeferredValue, useState } from 'react'

export const useCampaigns = (extraParams = {}) => {
  const getQueryParams = useFilterStore((s) => s.getQueryParams)
  const filters = getQueryParams()

  const params = { ...filters, ...extraParams }

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['campaigns', params],
    queryFn: () => fetchCampaigns(params),
    staleTime: 2 * 60 * 1000,
  })

  return {
    campaigns: data?.campaigns || [],
    total: data?.pagination?.total || 0,
    totalPages: data?.pagination?.totalPages || 1,
    isLoading,
    error: error?.message,
    refetch,
  }
}

export const useCampaignStats = () => {
  const getQueryParams = useFilterStore((s) => s.getQueryParams)
  const filters = getQueryParams()

  const { data, isLoading, error } = useQuery({
    queryKey: ['campaign-stats', filters],
    queryFn: () => fetchCampaignStats({ days: filters.days || '90' }),
    staleTime: 5 * 60 * 1000,
  })

  return { stats: data, isLoading, error: error?.message }
}
