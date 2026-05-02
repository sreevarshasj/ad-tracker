// FILE: backend/services/meta.service.js
import axios from 'axios';
import { logger } from '../utils/logger.js';
import { detectInstitutionCategory, extractInstitutionName } from '../utils/classifier.js';
import { calculateCTR } from '../utils/formatter.js';

const META_API_BASE = 'https://graph.facebook.com/v19.0';
const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const AD_ACCOUNT_ID = process.env.META_AD_ACCOUNT_ID;

const metaAxios = axios.create({
  baseURL: META_API_BASE,
  params: { access_token: ACCESS_TOKEN },
  timeout: 30000,
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Fetch campaigns from Meta Marketing API
 */
export const fetchMetaCampaigns = async (adAccountId = AD_ACCOUNT_ID, dateRange = {}) => {
  try {
    const params = {
      fields: 'id,name,status,start_time,stop_time,objective,daily_budget,lifetime_budget',
      limit: 100,
    };

    if (dateRange.start) {
      params.time_range = JSON.stringify({
        since: dateRange.start.toISOString().split('T')[0],
        until: (dateRange.end || new Date()).toISOString().split('T')[0],
      });
    }

    const response = await metaAxios.get(`/${adAccountId}/campaigns`, { params });
    return (response.data.data || []).map(normalizeMetaCampaign);
  } catch (error) {
    if (error.response?.data?.error?.code === 17) {
      logger.warn('Meta API rate limit hit, retrying in 60s...');
      await sleep(60000);
      const retryResponse = await metaAxios.get(`/${adAccountId}/campaigns`);
      return (retryResponse.data.data || []).map(normalizeMetaCampaign);
    }
    logger.error('fetchMetaCampaigns error:', error.message);
    throw error;
  }
};

/**
 * Fetch ad insights (performance data) for a campaign
 */
export const fetchMetaAdInsights = async (campaignId, dateRange = {}) => {
  try {
    const params = {
      fields: 'impressions,clicks,spend,ctr,date_start,date_stop',
      time_increment: 1,
      limit: 100,
    };

    if (dateRange.start) {
      params.time_range = JSON.stringify({
        since: dateRange.start.toISOString().split('T')[0],
        until: (dateRange.end || new Date()).toISOString().split('T')[0],
      });
    } else {
      params.date_preset = 'last_90d';
    }

    const response = await metaAxios.get(`/${campaignId}/insights`, { params });
    return (response.data.data || []).map((item) => ({
      impressions: parseInt(item.impressions || 0),
      clicks: parseInt(item.clicks || 0),
      spend: parseFloat(item.spend || 0),
      ctr: parseFloat(item.ctr || 0),
      date: new Date(item.date_start),
    }));
  } catch (error) {
    logger.error(`fetchMetaAdInsights error for campaign ${campaignId}:`, error.message);
    return [];
  }
};

/**
 * Fetch ad creatives for a campaign
 */
export const fetchMetaCreatives = async (campaignId) => {
  try {
    const response = await metaAxios.get(`/${campaignId}/ads`, {
      params: {
        fields: 'creative{thumbnail_url,body,call_to_action,image_url}',
        limit: 50,
      },
    });

    return (response.data.data || []).map((ad) => ({
      mediaUrl: ad.creative?.thumbnail_url || ad.creative?.image_url || '',
      adCopy: ad.creative?.body || '',
      cta: ad.creative?.call_to_action?.type || '',
      format: 'IMAGE',
      platform: 'META',
    }));
  } catch (error) {
    logger.error(`fetchMetaCreatives error for campaign ${campaignId}:`, error.message);
    return [];
  }
};

/**
 * Normalize Meta API campaign data to DB schema
 */
export const normalizeMetaCampaign = (rawData) => {
  const name = rawData.name || '';
  const institutionName = extractInstitutionName(name);
  const category = detectInstitutionCategory(name);

  const status = rawData.status === 'ACTIVE' ? 'ACTIVE'
    : rawData.status === 'PAUSED' ? 'PAUSED'
    : 'ENDED';

  return {
    externalId: `META_${rawData.id}`,
    platform: 'META',
    institutionName,
    category,
    status,
    startDate: rawData.start_time ? new Date(rawData.start_time) : new Date(),
    endDate: rawData.stop_time ? new Date(rawData.stop_time) : null,
    estimatedSpend: parseFloat(rawData.lifetime_budget || rawData.daily_budget || 0) / 100,
    country: 'India',
    state: '',
    city: '',
    tags: [],
  };
};
