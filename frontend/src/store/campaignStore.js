// FILE: frontend/src/store/campaignStore.js
import { create } from 'zustand'

export const useCampaignStore = create((set, get) => ({
  campaigns: [],
  total: 0,
  isLoading: false,
  error: null,
  selectedCampaign: null,
  page: 1,
  totalPages: 1,

  setCampaigns: (campaigns, total, totalPages) =>
    set({ campaigns, total, totalPages }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setSelectedCampaign: (selectedCampaign) => set({ selectedCampaign }),
  setPage: (page) => set({ page }),
  clearSelected: () => set({ selectedCampaign: null }),
}))
