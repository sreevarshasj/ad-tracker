// FILE: frontend/src/store/filterStore.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useFilterStore = create(
  persist(
    (set, get) => ({
      country: '',
      state: '',
      city: '',
      platforms: [],
      category: '',
      dateRange: '90',
      customStart: null,
      customEnd: null,
      searchQuery: '',

      setCountry: (country) => set({ country, state: '', city: '' }),
      setState: (state) => set({ state, city: '' }),
      setCity: (city) => set({ city }),

      togglePlatform: (platform) => {
        const current = get().platforms
        if (current.includes(platform)) {
          set({ platforms: current.filter((p) => p !== platform) })
        } else {
          set({ platforms: [...current, platform] })
        }
      },

      setCategory: (category) => set({ category }),
      setDateRange: (dateRange) => set({ dateRange, customStart: null, customEnd: null }),
      setCustomDates: (customStart, customEnd) =>
        set({ customStart, customEnd, dateRange: 'custom' }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),

      resetFilters: () =>
        set({
          country: '',
          state: '',
          city: '',
          platforms: [],
          category: '',
          dateRange: '90',
          customStart: null,
          customEnd: null,
          searchQuery: '',
        }),

      getActiveFilterCount: () => {
        const s = get()
        let count = 0
        if (s.country) count++
        if (s.state) count++
        if (s.city) count++
        if (s.platforms.length > 0) count++
        if (s.category) count++
        if (s.dateRange !== '90') count++
        if (s.searchQuery) count++
        return count
      },

      getQueryParams: () => {
        const s = get()
        const params = {}
        if (s.country) params.country = s.country
        if (s.state) params.state = s.state
        if (s.city) params.city = s.city
        if (s.platforms.length === 1) params.platform = s.platforms[0]
        if (s.category) params.category = s.category
        if (s.dateRange !== 'custom') params.days = s.dateRange
        if (s.searchQuery) params.search = s.searchQuery
        return params
      },
    }),
    {
      name: 'ads-tracker-filters',
      version: 1,
    }
  )
)
