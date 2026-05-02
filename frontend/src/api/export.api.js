// FILE: frontend/src/api/export.api.js
import axiosClient from './axiosClient.js'

export const exportCSV = async (params) => {
  const response = await axiosClient.get('/campaigns/export/csv', {
    params,
    responseType: 'blob',
  })
  return response
}

export const triggerExportCSV = async (filters = {}) => {
  // Fallback: fetch data and create CSV client-side
  const data = await axiosClient.get('/campaigns', { params: { ...filters, limit: 1000 } })
  return data
}
