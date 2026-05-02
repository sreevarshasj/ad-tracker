// FILE: frontend/src/hooks/useFilters.js
import { useFilterStore } from '../store/filterStore.js'
import { useQuery } from '@tanstack/react-query'
import axiosClient from '../api/axiosClient.js'

export const useFilters = () => {
  const store = useFilterStore()

  return {
    ...store,
    activeFilterCount: store.getActiveFilterCount(),
    queryParams: store.getQueryParams(),
  }
}

export const useLocationFilters = () => {
  const country = useFilterStore((s) => s.country)
  const state = useFilterStore((s) => s.state)

  const { data: states = [] } = useQuery({
    queryKey: ['states', country],
    queryFn: () => axiosClient.get('/filters/states', { params: { country } }),
    enabled: !!country,
  })

  const { data: cities = [] } = useQuery({
    queryKey: ['cities', country, state],
    queryFn: () => axiosClient.get('/filters/cities', { params: { country, state } }),
    enabled: !!state,
  })

  return { states, cities }
}
