// FILE: backend/services/agent.service.js
import { THRESHOLDS, TAGS } from '../config/constants.js';
import { daysBetween } from '../utils/formatter.js';
import { logger } from '../utils/logger.js';

/**
 * Classify a campaign and return appropriate tags
 * @param {object} campaign
 * @param {object} latestPerformance
 * @returns {string[]}
 */
export const classifyCampaign = (campaign, latestPerformance = null) => {
  const tags = [];

  // Check spend threshold
  const spend = latestPerformance?.spend ?? campaign.estimatedSpend ?? 0;
  if (spend > THRESHOLDS.HIGH_SPEND) {
    tags.push(TAGS.HIGH_INVESTMENT);
  }

  // Check campaign duration
  const daysActive = daysBetween(campaign.startDate, campaign.endDate ?? new Date());
  if (daysActive > THRESHOLDS.LONG_RUNNING_DAYS) {
    tags.push(TAGS.LONG_RUNNING);
  }

  // Check CTR
  const ctr = latestPerformance?.ctr ?? 0;
  if (ctr > THRESHOLDS.HIGH_CTR) {
    tags.push(TAGS.HIGH_ENGAGEMENT);
  }

  return tags;
};

/**
 * Rank institutions by spend, campaign count, and engagement
 * @param {Array} campaigns
 * @returns {Array}
 */
export const rankInstitutions = (campaigns) => {
  const institutionMap = {};

  for (const campaign of campaigns) {
    const name = campaign.institutionName;
    if (!institutionMap[name]) {
      institutionMap[name] = {
        institutionName: name,
        category: campaign.category,
        totalSpend: 0,
        campaignCount: 0,
        totalCTR: 0,
        ctrCount: 0,
        platforms: new Set(),
      };
    }

    const inst = institutionMap[name];
    inst.campaignCount += 1;
    inst.platforms.add(campaign.platform);

    const spend = campaign.estimatedSpend || 0;
    inst.totalSpend += spend;

    if (campaign.performances && campaign.performances.length > 0) {
      const avgCTR =
        campaign.performances.reduce((sum, p) => sum + p.ctr, 0) /
        campaign.performances.length;
      inst.totalCTR += avgCTR;
      inst.ctrCount += 1;
    }
  }

  const ranked = Object.values(institutionMap).map((inst) => {
    const avgCTR = inst.ctrCount > 0 ? inst.totalCTR / inst.ctrCount : 0;
    const score =
      inst.totalSpend * 0.5 + inst.campaignCount * 30 + avgCTR * 20;
    return {
      institutionName: inst.institutionName,
      category: inst.category,
      totalSpend: inst.totalSpend,
      campaignCount: inst.campaignCount,
      avgCTR: parseFloat(avgCTR.toFixed(2)),
      platforms: Array.from(inst.platforms),
      score: parseFloat(score.toFixed(2)),
    };
  });

  return ranked.sort((a, b) => b.score - a.score).map((inst, idx) => ({
    ...inst,
    rank: idx + 1,
  }));
};

/**
 * Generate agent insights from campaigns and performance data
 * @param {Array} campaigns
 * @param {Array} performances
 * @param {object} filters
 * @returns {Array}
 */
export const generateInsights = (campaigns, performances, filters = {}) => {
  const insights = [];

  if (!campaigns || campaigns.length === 0) {
    return [
      {
        type: 'NO_DATA',
        text: 'No campaign data available. Trigger a sync to fetch the latest data.',
        value: 0,
        icon: 'info',
      },
    ];
  }

  // ── Top Advertiser ──────────────────────────────
  const ranked = rankInstitutions(campaigns);
  if (ranked.length > 0) {
    const top = ranked[0];
    insights.push({
      type: 'TOP_ADVERTISER',
      text: `${top.institutionName} is the top advertiser with ₹${(top.totalSpend / 100000).toFixed(1)}L total spend across ${top.campaignCount} campaigns`,
      value: top.totalSpend,
      icon: 'trophy',
      institution: top.institutionName,
    });
  }

  // ── Most Active City ──────────────────────────
  const cityMap = {};
  campaigns.forEach((c) => {
    if (c.city) {
      cityMap[c.city] = (cityMap[c.city] || 0) + 1;
    }
  });
  const topCity = Object.entries(cityMap).sort((a, b) => b[1] - a[1])[0];
  if (topCity) {
    insights.push({
      type: 'MOST_ACTIVE_CITY',
      text: `${topCity[0]} is the most active city with ${topCity[1]} campaigns running`,
      value: topCity[1],
      icon: 'map-pin',
      city: topCity[0],
    });
  }

  // ── Highest Spend ─────────────────────────────
  const totalSpend = campaigns.reduce((s, c) => s + (c.estimatedSpend || 0), 0);
  if (totalSpend > 0) {
    insights.push({
      type: 'HIGHEST_SPEND',
      text: `Total ad spend across all campaigns is ₹${(totalSpend / 100000).toFixed(1)}L`,
      value: totalSpend,
      icon: 'currency',
    });
  }

  // ── Trending Platform ─────────────────────────
  const platformMap = {};
  campaigns.forEach((c) => {
    platformMap[c.platform] = (platformMap[c.platform] || 0) + 1;
  });
  const topPlatform = Object.entries(platformMap).sort((a, b) => b[1] - a[1])[0];
  if (topPlatform) {
    insights.push({
      type: 'TRENDING_PLATFORM',
      text: `${topPlatform[0]} is the most used platform with ${topPlatform[1]} campaigns`,
      value: topPlatform[1],
      icon: 'trending-up',
      platform: topPlatform[0],
    });
  }

  // ── Active vs Ended ──────────────────────────
  const active = campaigns.filter((c) => c.status === 'ACTIVE').length;
  const total = campaigns.length;
  insights.push({
    type: 'CAMPAIGN_STATUS',
    text: `${active} out of ${total} campaigns are currently active (${Math.round((active / total) * 100)}% active rate)`,
    value: active,
    icon: 'activity',
  });

  // ── High Investment Tag Count ────────────────
  const highInvestCount = campaigns.filter((c) => {
    const tagsArr = Array.isArray(c.tags) ? c.tags : (c.tags ? c.tags.split(',') : []);
    return tagsArr.includes('High Investment');
  }).length;
  if (highInvestCount > 0) {
    insights.push({
      type: 'HIGH_INVESTMENT',
      text: `${highInvestCount} campaigns are tagged as High Investment (spend > ₹${(THRESHOLDS.HIGH_SPEND / 1000).toFixed(0)}K)`,
      value: highInvestCount,
      icon: 'dollar-sign',
    });
  }

  return insights;
};

/**
 * Detect spend trends (this week vs last week)
 * @param {Array} performanceHistory
 * @returns {{ trend: 'UP' | 'DOWN' | 'STABLE', percentage: number }}
 */
export const detectTrends = (performanceHistory) => {
  if (!performanceHistory || performanceHistory.length < 2) {
    return { trend: 'STABLE', percentage: 0 };
  }

  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const thisWeek = performanceHistory.filter(
    (p) => new Date(p.date) >= oneWeekAgo && new Date(p.date) <= now
  );
  const lastWeek = performanceHistory.filter(
    (p) => new Date(p.date) >= twoWeeksAgo && new Date(p.date) < oneWeekAgo
  );

  const thisWeekSpend = thisWeek.reduce((sum, p) => sum + p.spend, 0);
  const lastWeekSpend = lastWeek.reduce((sum, p) => sum + p.spend, 0);

  if (lastWeekSpend === 0) {
    return { trend: thisWeekSpend > 0 ? 'UP' : 'STABLE', percentage: 100 };
  }

  const percentage = ((thisWeekSpend - lastWeekSpend) / lastWeekSpend) * 100;

  if (percentage > 5) return { trend: 'UP', percentage: parseFloat(percentage.toFixed(1)) };
  if (percentage < -5) return { trend: 'DOWN', percentage: parseFloat(Math.abs(percentage).toFixed(1)) };
  return { trend: 'STABLE', percentage: parseFloat(Math.abs(percentage).toFixed(1)) };
};
