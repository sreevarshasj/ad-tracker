// FILE: backend/config/constants.js
export const PLATFORMS = {
  META: 'META',
  GOOGLE: 'GOOGLE',
  LINKEDIN: 'LINKEDIN',
  ENEWSPAPER: 'ENEWSPAPER',
};

export const CATEGORIES = {
  SCHOOL: 'SCHOOL',
  COLLEGE: 'COLLEGE',
  UNKNOWN: 'UNKNOWN',
};

export const STATUSES = {
  ACTIVE: 'ACTIVE',
  ENDED: 'ENDED',
  PAUSED: 'PAUSED',
};

export const TAGS = {
  HIGH_INVESTMENT: 'High Investment',
  LONG_RUNNING: 'Long Running',
  HIGH_ENGAGEMENT: 'High Engagement',
};

export const THRESHOLDS = {
  HIGH_SPEND: parseFloat(process.env.HIGH_SPEND_THRESHOLD) || 5000,
  LONG_RUNNING_DAYS: parseInt(process.env.LONG_RUNNING_DAYS) || 30,
  HIGH_CTR: 5.0,
};

export const PLATFORM_COLORS = {
  META: '#1877F2',
  GOOGLE: '#EA4335',
  LINKEDIN: '#0A66C2',
  ENEWSPAPER: '#F59E0B',
};

export const CREATIVE_FORMATS = {
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
  CAROUSEL: 'CAROUSEL',
};

export const SYNC_STATUS = {
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  IN_PROGRESS: 'IN_PROGRESS',
};

export const COUNTRIES = [
  'India',
  'United States',
  'United Kingdom',
  'UAE',
  'Singapore',
  'Australia',
  'Canada',
];

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi',
];
