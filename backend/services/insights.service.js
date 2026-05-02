// FILE: backend/services/insights.service.js
import { prisma } from '../config/db.js';
import { generateInsights, detectTrends, rankInstitutions } from './agent.service.js';
import { logger } from '../utils/logger.js';

/**
 * Get full insights data for dashboard
 */
export const getInsightsData = async (filters = {}) => {
  try {
    const whereClause = buildWhereClause(filters);

    const [campaigns, performances, syncLogs] = await Promise.all([
      prisma.campaign.findMany({
        where: whereClause,
        include: {
          performances: {
            orderBy: { date: 'desc' },
            take: 30,
          },
        },
        take: 500,
      }),
      prisma.performance.findMany({
        where: {
          campaign: whereClause,
        },
        orderBy: { date: 'desc' },
        take: 1000,
      }),
      prisma.syncLog.findMany({
        orderBy: { syncedAt: 'desc' },
        take: 10,
      }),
    ]);

    const insights = generateInsights(campaigns, performances, filters);
    const trends = detectTrends(performances);
    const rankedInstitutions = rankInstitutions(campaigns);
    const lastSync = syncLogs[0] || null;

    return {
      insights,
      trends,
      rankedInstitutions: rankedInstitutions.slice(0, 10),
      lastSync,
      summary: {
        totalCampaigns: campaigns.length,
        activeCampaigns: campaigns.filter((c) => c.status === 'ACTIVE').length,
        totalSpend: campaigns.reduce((s, c) => s + (c.estimatedSpend || 0), 0),
        platforms: [...new Set(campaigns.map((c) => c.platform))],
      },
    };
  } catch (error) {
    logger.error('getInsightsData error:', error);
    throw error;
  }
};

/**
 * Build Prisma where clause from filters
 */
const buildWhereClause = (filters) => {
  const where = {};

  if (filters.platform && filters.platform !== 'ALL') {
    where.platform = filters.platform;
  }

  if (filters.category && filters.category !== '') {
    where.category = filters.category;
  }

  if (filters.country) {
    where.country = filters.country;
  }

  if (filters.state) {
    where.state = filters.state;
  }

  if (filters.city) {
    where.city = filters.city;
  }

  if (filters.search) {
    where.institutionName = { contains: filters.search, mode: 'insensitive' };
  }

  if (filters.days && filters.days !== 'all') {
    const since = new Date();
    const daysInt = parseInt(filters.days);
    if (!isNaN(daysInt)) {
      since.setDate(since.getDate() - daysInt);
      where.startDate = { gte: since };
    }
  }

  return where;
};

export { buildWhereClause };
