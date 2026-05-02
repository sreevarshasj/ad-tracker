// FILE: backend/controllers/performance.controller.js
import { prisma } from '../config/db.js';
import { logger } from '../utils/logger.js';

/**
 * GET /api/performance/overview
 */
export const getPerformanceOverview = async (req, res, next) => {
  try {
    const { days = '30' } = req.query;
    const since = new Date();
    since.setDate(since.getDate() - parseInt(days));

    const [totals, avgMetrics] = await Promise.all([
      prisma.performance.aggregate({
        _sum: { impressions: true, clicks: true, spend: true },
        _avg: { ctr: true },
        where: { date: { gte: since } },
      }),
      prisma.performance.aggregate({
        _avg: { ctr: true, impressions: true },
        where: { date: { gte: since } },
      }),
    ]);

    res.json({
      totalImpressions: totals._sum.impressions || 0,
      totalClicks: totals._sum.clicks || 0,
      totalSpend: totals._sum.spend || 0,
      avgCTR: parseFloat((avgMetrics._avg.ctr || 0).toFixed(2)),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/performance/trend
 * Returns daily spend aggregated for the line chart
 */
export const getSpendTrend = async (req, res, next) => {
  try {
    const { days = '30', platform, category } = req.query;
    const since = new Date();
    since.setDate(since.getDate() - parseInt(days));

    const where = { date: { gte: since } };
    if (platform && platform !== 'ALL') {
      where.campaign = { platform };
    }

    const performances = await prisma.performance.findMany({
      where,
      include: { campaign: { select: { platform: true, category: true } } },
      orderBy: { date: 'asc' },
    });

    // Group by date
    const dailyMap = {};
    for (const perf of performances) {
      const dateKey = perf.date.toISOString().split('T')[0];
      if (!dailyMap[dateKey]) {
        dailyMap[dateKey] = { date: dateKey, spend: 0, impressions: 0, clicks: 0, ctr: 0, count: 0 };
      }
      dailyMap[dateKey].spend += perf.spend;
      dailyMap[dateKey].impressions += perf.impressions;
      dailyMap[dateKey].clicks += perf.clicks;
      dailyMap[dateKey].ctr += perf.ctr;
      dailyMap[dateKey].count += 1;
    }

    const trend = Object.values(dailyMap).map((d) => ({
      ...d,
      ctr: d.count > 0 ? parseFloat((d.ctr / d.count).toFixed(2)) : 0,
    }));

    res.json(trend);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/performance/platforms
 */
export const getPlatformBreakdown = async (req, res, next) => {
  try {
    const { days = '90' } = req.query;
    const since = new Date();
    since.setDate(since.getDate() - parseInt(days));

    const campaigns = await prisma.campaign.groupBy({
      by: ['platform'],
      _count: { platform: true },
      _sum: { estimatedSpend: true },
      where: { startDate: { gte: since } },
    });

    res.json(
      campaigns.map((c) => ({
        platform: c.platform,
        count: c._count.platform,
        spend: parseFloat((c._sum.estimatedSpend || 0).toFixed(2)),
      }))
    );
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/performance/:campaignId
 */
export const getCampaignPerformance = async (req, res, next) => {
  try {
    const performances = await prisma.performance.findMany({
      where: { campaignId: req.params.campaignId },
      orderBy: { date: 'asc' },
    });
    res.json(performances);
  } catch (error) {
    next(error);
  }
};
