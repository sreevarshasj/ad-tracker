// FILE: frontend/src/api/axiosClient.js
import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api'

const axiosClient = axios.create({
  baseURL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ads_tracker_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ads_tracker_token')
    }
    const message = error.response?.data?.error || error.message || 'An error occurred'
    return Promise.reject(new Error(message))
  }
)

export default axiosClient
