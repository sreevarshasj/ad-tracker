// FILE: frontend/src/utils/constants.js
export const PLATFORMS = ['META', 'GOOGLE', 'LINKEDIN', 'ENEWSPAPER']
export const COUNTRIES = ['India']

export const PLATFORM_CONFIG = {
  META: { label: 'Meta', color: '#1877F2', bg: 'bg-blue-900/20', text: 'text-blue-400' },
  GOOGLE: { label: 'Google', color: '#EA4335', bg: 'bg-red-900/20', text: 'text-red-400' },
  LINKEDIN: { label: 'LinkedIn', color: '#0A66C2', bg: 'bg-blue-900/20', text: 'text-blue-300' },
  ENEWSPAPER: { label: 'E-Newspaper', color: '#F59E0B', bg: 'bg-yellow-900/20', text: 'text-yellow-400' },
}

export const CATEGORIES = ['SCHOOL', 'COLLEGE', 'UNIVERSITY']
export const STATUSES = ['ACTIVE', 'ENDED', 'PAUSED']

export const DATE_RANGES = [
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
  { value: '90', label: 'Last 90 days' },
  { value: 'all', label: 'All time' },
]

export const COLORS = {
  purple: '#6C5CE7',
  cyan: '#00D2FF',
  success: '#00B894',
  warning: '#FDCB6E',
  danger: '#E17055',
  meta: '#1877F2',
  google: '#EA4335',
  linkedin: '#0A66C2',
  newspaper: '#F59E0B',
}

export const CHART_COLORS = ['#6C5CE7', '#00D2FF', '#00B894', '#FDCB6E', '#E17055', '#74B9FF']
