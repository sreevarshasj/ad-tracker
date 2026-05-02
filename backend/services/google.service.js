// FILE: backend/services/google.service.js
import axios from 'axios';
import { logger } from '../utils/logger.js';
import { detectInstitutionCategory, extractInstitutionName } from '../utils/classifier.js';
import { microsToCurrency } from '../utils/formatter.js';

const GOOGLE_ADS_BASE = 'https://googleads.googleapis.com/v16';
const CUSTOMER_ID = process.env.GOOGLE_ADS_CUSTOMER_ID;
const DEVELOPER_TOKEN = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;

const getAuthToken = async () => {
  // In production, implement OAuth2 token refresh logic
  return process.env.GOOGLE_ADS_REFRESH_TOKEN || '';
};

const googleAxios = axios.create({
  baseURL: GOOGLE_ADS_BASE,
  timeout: 30000,
});

/**
 * Fetch campaigns from Google Ads API using GAQL
 */
export const fetchGoogleCampaigns = async (customerId = CUSTOMER_ID, dateRange = {}) => {
  try {
    const token = await getAuthToken();
    const query = `
      SELECT
        campaign.id,
        campaign.name,
        campaign.status,
        campaign.start_date,
        campaign.end_date,
        campaign.advertising_channel_type,
        campaign_budget.amount_micros
      FROM campaign
      WHERE segments.date DURING LAST_90_DAYS
        AND campaign.status != 'REMOVED'
      LIMIT 500
    `;

    const response = await googleAxios.post(
      `/customers/${customerId}/googleAds:search`,
      { query },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'developer-token': DEVELOPER_TOKEN,
          'Content-Type': 'application/json',
        },
      }
    );

    return (response.data.results || []).map(normalizeGoogleCampaign);
  } catch (error) {
    logger.error('fetchGoogleCampaigns error:', error.message);
    return [];
  }
};

/**
 * Fetch performance metrics for a Google campaign
 */
export const fetchGooglePerformance = async (campaignId, customerId = CUSTOMER_ID, dateRange = {}) => {
  try {
    const token = await getAuthToken();

    const since = dateRange.start
      ? dateRange.start.toISOString().split('T')[0]
      : new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const until = (dateRange.end || new Date()).toISOString().split('T')[0];

    const query = `
      SELECT
        campaign.id,
        segments.date,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.ctr
      FROM campaign
      WHERE campaign.id = ${campaignId}
        AND segments.date BETWEEN '${since}' AND '${until}'
      ORDER BY segments.date ASC
    `;

    const response = await googleAxios.post(
      `/customers/${customerId}/googleAds:search`,
      { query },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'developer-token': DEVELOPER_TOKEN,
          'Content-Type': 'application/json',
        },
      }
    );

    return (response.data.results || []).map((row) => ({
      impressions: parseInt(row.metrics?.impressions || 0),
      clicks: parseInt(row.metrics?.clicks || 0),
      spend: microsToCurrency(parseInt(row.metrics?.cost_micros || 0)),
      ctr: parseFloat((row.metrics?.ctr || 0) * 100).toFixed(2),
      date: new Date(row.segments?.date || Date.now()),
    }));
  } catch (error) {
    logger.error(`fetchGooglePerformance error for campaign ${campaignId}:`, error.message);
    return [];
  }
};

/**
 * Fetch YouTube video ads for a campaign
 */
export const fetchYouTubeVideoAds = async (campaignId, customerId = CUSTOMER_ID) => {
  try {
    const token = await getAuthToken();
    const query = `
      SELECT
        ad_group_ad.ad.video_ad.video.id,
        ad_group_ad.ad.final_urls,
        ad_group_ad.ad.video_ad.headline
      FROM ad_group_ad
      WHERE campaign.id = ${campaignId}
        AND campaign.advertising_channel_type = 'VIDEO'
    `;

    const response = await googleAxios.post(
      `/customers/${customerId}/googleAds:search`,
      { query },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'developer-token': DEVELOPER_TOKEN,
          'Content-Type': 'application/json',
        },
      }
    );

    return (response.data.results || []).map((row) => {
      const videoId = row.ad_group_ad?.ad?.video_ad?.video?.id;
      return {
        mediaUrl: videoId ? `https://img.youtube.com/vi/${videoId}/0.jpg` : '',
        adCopy: row.ad_group_ad?.ad?.video_ad?.headline || '',
        cta: '',
        format: 'VIDEO',
        platform: 'GOOGLE',
      };
    });
  } catch (error) {
    logger.error(`fetchYouTubeVideoAds error:`, error.message);
    return [];
  }
};

/**
 * Normalize Google Ads API data to DB schema
 */
export const normalizeGoogleCampaign = (rawData) => {
  const campaign = rawData.campaign || rawData;
  const name = campaign.name || '';
  const institutionName = extractInstitutionName(name);
  const category = detectInstitutionCategory(name);

  const statusMap = {
    ENABLED: 'ACTIVE',
    PAUSED: 'PAUSED',
    REMOVED: 'ENDED',
  };

  return {
    externalId: `GOOGLE_${campaign.id}`,
    platform: 'GOOGLE',
    institutionName,
    category,
    status: statusMap[campaign.status] || 'ENDED',
    startDate: campaign.start_date ? new Date(campaign.start_date) : new Date(),
    endDate: campaign.end_date && campaign.end_date !== '2037-12-30' ? new Date(campaign.end_date) : null,
    estimatedSpend: microsToCurrency(parseInt(rawData.campaign_budget?.amount_micros || 0)),
    country: 'India',
    state: '',
    city: '',
    tags: [],
  };
};
