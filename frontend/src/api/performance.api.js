// FILE: frontend/src/api/performance.api.js
import axiosClient from './axiosClient.js'

export const fetchPerformanceOverview = (params) =>
  axiosClient.get('/performance/overview', { params })

export const fetchSpendTrend = (params) =>
  axiosClient.get('/performance/trend', { params })

export const fetchPlatformBreakdown = (params) =>
  axiosClient.get('/performance/platforms', { params })

export const fetchCampaignPerformance = (campaignId) =>
  axiosClient.get(`/performance/${campaignId}`)
