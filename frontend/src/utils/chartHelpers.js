// FILE: frontend/src/utils/chartHelpers.js
import { PLATFORM_CONFIG, COLORS } from './constants.js'

export const getPlatformColor = (platform) => {
  return PLATFORM_CONFIG[platform]?.color || '#9B9BB4'
}

export const transformSpendTrendData = (rawData) => {
  if (!rawData || !Array.isArray(rawData)) return []
  return rawData.map((d) => ({
    date: new Date(d.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    spend: parseFloat((d.spend || 0).toFixed(2)),
    ctr: parseFloat((d.ctr || 0).toFixed(2)),
    impressions: d.impressions || 0,
    clicks: d.clicks || 0,
  }))
}

export const transformPlatformData = (rawData) => {
  if (!rawData || !Array.isArray(rawData)) return []
  return rawData.map((d) => ({
    name: PLATFORM_CONFIG[d.platform]?.label || d.platform,
    value: d.count || 0,
    spend: d.spend || 0,
    color: getPlatformColor(d.platform),
    platform: d.platform,
  }))
}

export const transformBarChartData = (campaigns) => {
  if (!campaigns || !Array.isArray(campaigns)) return []
  const grouped = {}
  campaigns.forEach((c) => {
    const month = new Date(c.startDate).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })
    if (!grouped[month]) grouped[month] = { month, campaigns: 0, spend: 0 }
    grouped[month].campaigns += 1
    grouped[month].spend += c.estimatedSpend || 0
  })
  return Object.values(grouped).slice(-12)
}
