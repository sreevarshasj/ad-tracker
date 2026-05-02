// FILE: backend/utils/classifier.js
export const SCHOOL_KEYWORDS = [
  'school', 'matriculation', 'matric', 'cbse', 'icse',
  'primary', 'secondary', 'high school', 'vidyalaya', 'vidya mandir',
  'kendriya vidyalaya', 'kv ', 'navodaya', 'nursery', 'kindergarten',
  'k-12', 'k12', 'playschool', 'play school', 'montessori',
];

export const UNIVERSITY_KEYWORDS = [
  'university', 'deemed', 'iit', 'nit', 'anna university', 'sastra',
  'vit university', 'srm institute', 'amrita vishwa', 'bits pilani',
  'deemed university', 'vishwavidyalaya',
];

export const COLLEGE_KEYWORDS = [
  'college', 'institute', 'polytechnic', 'arts & science', 'engineering',
  'medical college', 'autonomous', 'faculty', 'campus', 'mba', 'mca',
  'btech', 'b.tech', 'b.e', 'bsc', 'b.sc', 'law college', 'nursing college',
  'pharmacy',
];

/**
 * Detect institution category from campaign name
 * @param {string} campaignName
 * @returns {'SCHOOL' | 'COLLEGE' | 'UNIVERSITY' | 'UNKNOWN'}
 */
export const detectInstitutionCategory = (campaignName) => {
  const lower = (campaignName || '').toLowerCase();

  for (const keyword of UNIVERSITY_KEYWORDS) {
    if (lower.includes(keyword)) return 'UNIVERSITY';
  }

  for (const keyword of COLLEGE_KEYWORDS) {
    if (lower.includes(keyword)) return 'COLLEGE';
  }

  for (const keyword of SCHOOL_KEYWORDS) {
    if (lower.includes(keyword)) return 'SCHOOL';
  }

  return 'UNKNOWN';
};

/**
 * Extract cleaned institution name from a campaign name
 * @param {string} campaignName
 * @returns {string}
 */
export const extractInstitutionName = (campaignName) => {
  if (!campaignName) return 'Unknown Institution';

  // Remove common ad suffixes
  const suffixes = [
    /_awareness\d*/gi,
    /_conversion\d*/gi,
    /_leads?\d*/gi,
    /_traffic\d*/gi,
    /_retargeting\d*/gi,
    /_remarketing\d*/gi,
    /_q[1-4]_?\d{4}/gi,
    /\s*[-|_]\s*(q[1-4]|fy\d+|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s*\d{0,4}/gi,
    /_\d{4}$/gi,
    /\s*\|\s*.*/gi,
    /\s*-\s*(awareness|conversion|leads?|traffic|retargeting)$/gi,
  ];

  let cleaned = campaignName;
  for (const suffix of suffixes) {
    cleaned = cleaned.replace(suffix, '');
  }

  // Trim and capitalize
  cleaned = cleaned.trim().replace(/_/g, ' ').replace(/\s+/g, ' ');

  // Title case
  cleaned = cleaned.replace(/\b\w/g, (char) => char.toUpperCase());

  return cleaned || 'Unknown Institution';
};

/**
 * Get platform color hex
 * @param {string} platform
 * @returns {string}
 */
export const assignPlatformColor = (platform) => {
  const colors = {
    META: '#1877F2',
    GOOGLE: '#EA4335',
    LINKEDIN: '#0A66C2',
    ENEWSPAPER: '#F59E0B',
  };
  return colors[platform] || '#9B9BB4';
};
