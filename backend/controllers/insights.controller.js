// FILE: backend/controllers/insights.controller.js
import { getInsightsData } from '../services/insights.service.js';
import { rankInstitutions } from '../services/agent.service.js';
import { prisma } from '../config/db.js';
import { logger } from '../utils/logger.js';

/**
 * GET /api/insights
 */
export const getInsights = async (req, res, next) => {
  try {
    const filters = {
      platform: req.query.platform,
      category: req.query.category,
      country: req.query.country,
      state: req.query.state,
      city: req.query.city,
      days: req.query.days || '90',
      search: req.query.search,
    };

    const data = await getInsightsData(filters);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/insights/rankings
 */
export const getRankedInstitutions = async (req, res, next) => {
  try {
    const { days = '90', limit = '20' } = req.query;
    const where = {};

    if (days !== 'all') {
      const since = new Date();
      const daysInt = parseInt(days);
      if (!isNaN(daysInt)) {
        since.setDate(since.getDate() - daysInt);
        where.startDate = { gte: since };
      }
    }

    const campaigns = await prisma.campaign.findMany({
      where,
      include: { performances: { orderBy: { date: 'desc' }, take: 5 } },
    });

    const ranked = rankInstitutions(campaigns);
    res.json(ranked.slice(0, parseInt(limit)));
  } catch (error) {
    next(error);
  }
};
