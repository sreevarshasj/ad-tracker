// FILE: frontend/src/api/insights.api.js
import axiosClient from './axiosClient.js'

export const fetchInsights = (params) =>
  axiosClient.get('/insights', { params })

export const fetchRankings = (params) =>
  axiosClient.get('/insights/rankings', { params })

export const triggerSync = () =>
  axiosClient.post('/sync/trigger')

export const fetchSyncStatus = () =>
  axiosClient.get('/sync/status')
