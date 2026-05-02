// FILE: frontend/src/api/campaigns.api.js
import axiosClient from './axiosClient.js'

export const fetchCampaigns = (params) =>
  axiosClient.get('/campaigns', { params })

export const fetchCampaignStats = (params) =>
  axiosClient.get('/campaigns/stats', { params })

export const fetchCampaignById = (id) =>
  axiosClient.get(`/campaigns/${id}`)

export const createCampaign = (data) =>
  axiosClient.post('/campaigns', data)

export const updateCampaign = (id, data) =>
  axiosClient.put(`/campaigns/${id}`, data)

export const deleteCampaign = (id) =>
  axiosClient.delete(`/campaigns/${id}`)
