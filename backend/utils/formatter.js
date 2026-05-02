// FILE: backend/utils/formatter.js
/**
 * Format currency value
 * @param {number} amount
 * @param {string} currency
 * @returns {string}
 */
export const formatCurrency = (amount, currency = 'INR') => {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  });
  return formatter.format(amount);
};

/**
 * Format date to readable string
 * @param {Date|string} date
 * @returns {string}
 */
export const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Calculate days between two dates
 * @param {Date|string} startDate
 * @param {Date|string} endDate
 * @returns {number}
 */
export const daysBetween = (startDate, endDate = new Date()) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffMs = end - start;
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
};

/**
 * Normalize spend from micro units (Google Ads uses micros)
 * @param {number} micros
 * @returns {number}
 */
export const microsToCurrency = (micros) => {
  return micros / 1_000_000;
};

/**
 * Calculate CTR
 * @param {number} clicks
 * @param {number} impressions
 * @returns {number}
 */
export const calculateCTR = (clicks, impressions) => {
  if (!impressions || impressions === 0) return 0;
  return parseFloat(((clicks / impressions) * 100).toFixed(2));
};

/**
 * Format large numbers (1200 → 1.2K)
 * @param {number} num
 * @returns {string}
 */
export const formatNumber = (num) => {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
};

/**
 * Get date range from days string
 * @param {string|number} days
 * @returns {{ start: Date, end: Date }}
 */
export const getDateRange = (days) => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - parseInt(days || 90));
  return { start, end };
};
