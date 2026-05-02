// FILE: backend/services/linkedin.service.js
import axios from 'axios';
import { logger } from '../utils/logger.js';
import { detectInstitutionCategory, extractInstitutionName } from '../utils/classifier.js';

const LINKEDIN_API_BASE = 'https://api.linkedin.com/v2';
const AD_ACCOUNT_ID = process.env.LINKEDIN_AD_ACCOUNT_ID;
const ACCESS_TOKEN = process.env.LINKEDIN_ACCESS_TOKEN;

const linkedinAxios = axios.create({
  baseURL: LINKEDIN_API_BASE,
  timeout: 30000,
  headers: {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
    'X-Restli-Protocol-Version': '2.0.0',
  },
});

/**
 * Fetch campaigns from LinkedIn Marketing API
 */
export const fetchLinkedInCampaigns = async (adAccountId = AD_ACCOUNT_ID, dateRange = {}) => {
  try {
    const params = {
      q: 'search',
      'search.account.values[0]': `urn:li:sponsoredAccount:${adAccountId}`,
      'search.status.values[0]': 'ACTIVE',
      'search.status.values[1]': 'PAUSED',
      'search.status.values[2]': 'COMPLETED',
      count: 100,
      start: 0,
    };

    const response = await linkedinAxios.get('/adCampaignsV2', { params });
    return (response.data.elements || []).map(normalizeLinkedInCampaign);
  } catch (error) {
    logger.error('fetchLinkedInCampaigns error:', error.message);
    return [];
  }
};

/**
 * Fetch performance analytics for a LinkedIn campaign
 */
export const fetchLinkedInInsights = async (campaignId, dateRange = {}) => {
  try {
    const since = dateRange.start
      ? { year: dateRange.start.getFullYear(), month: dateRange.start.getMonth() + 1, day: dateRange.start.getDate() }
      : { year: new Date().getFullYear(), month: new Date().getMonth() - 3, day: 1 };
    const until = {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate(),
    };

    const params = {
      q: 'analytics',
      pivot: 'CAMPAIGN',
      'dateRange.start.year': since.year,
      'dateRange.start.month': since.month,
      'dateRange.start.day': since.day,
      'dateRange.end.year': until.year,
      'dateRange.end.month': until.month,
      'dateRange.end.day': until.day,
      'campaigns[0]': `urn:li:sponsoredCampaign:${campaignId}`,
      fields: 'impressions,clicks,costInLocalCurrency,dateRange',
      timeGranularity: 'DAILY',
    };

    const response = await linkedinAxios.get('/adAnalyticsV2', { params });

    return (response.data.elements || []).map((item) => ({
      impressions: item.impressions || 0,
      clicks: item.clicks || 0,
      spend: parseFloat(item.costInLocalCurrency || 0),
      ctr: item.impressions > 0 ? ((item.clicks / item.impressions) * 100).toFixed(2) : 0,
      date: new Date(
        `${item.dateRange?.start?.year}-${item.dateRange?.start?.month}-${item.dateRange?.start?.day}`
      ),
    }));
  } catch (error) {
    logger.error(`fetchLinkedInInsights error for campaign ${campaignId}:`, error.message);
    return [];
  }
};

/**
 * Fetch creatives for a LinkedIn campaign
 */
export const fetchLinkedInCreatives = async (campaignId) => {
  try {
    const response = await linkedinAxios.get('/adCreativesV2', {
      params: {
        q: 'search',
        'search.campaign.values[0]': `urn:li:sponsoredCampaign:${campaignId}`,
        count: 50,
      },
    });

    return (response.data.elements || []).map((creative) => ({
      mediaUrl: creative.content?.contentLandingPage || '',
      adCopy: creative.content?.title || creative.content?.description || '',
      cta: creative.content?.callToAction?.label || '',
      format: 'IMAGE',
      platform: 'LINKEDIN',
    }));
  } catch (error) {
    logger.error(`fetchLinkedInCreatives error:`, error.message);
    return [];
  }
};

/**
 * Normalize LinkedIn API data to DB schema
 */
export const normalizeLinkedInCampaign = (rawData) => {
  const name = rawData.name || '';
  const institutionName = extractInstitutionName(name);
  const category = detectInstitutionCategory(name);

  const statusMap = {
    ACTIVE: 'ACTIVE',
    PAUSED: 'PAUSED',
    COMPLETED: 'ENDED',
    ARCHIVED: 'ENDED',
    DRAFT: 'PAUSED',
  };

  const accountId = rawData.account
    ? rawData.account.replace('urn:li:sponsoredAccount:', '')
    : '';
  const id = rawData.id || rawData.$URN?.split(':').pop() || Date.now();

  return {
    externalId: `LINKEDIN_${id}`,
    platform: 'LINKEDIN',
    institutionName,
    category,
    status: statusMap[rawData.status] || 'ENDED',
    startDate: rawData.runSchedule?.start ? new Date(rawData.runSchedule.start) : new Date(),
    endDate: rawData.runSchedule?.end ? new Date(rawData.runSchedule.end) : null,
    estimatedSpend: parseFloat(rawData.dailyBudget?.amount || rawData.totalBudget?.amount || 0),
    country: 'India',
    state: '',
    city: '',
    tags: [],
  };
};
