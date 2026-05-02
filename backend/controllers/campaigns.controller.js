// FILE: backend/controllers/campaigns.controller.js
import { prisma } from '../config/db.js';
import { logger } from '../utils/logger.js';
import { COUNTRIES, INDIAN_STATES } from '../config/constants.js';

/**
 * GET /api/campaigns
 * Query params: platform, category, country, state, city, days, search, page, limit
 */
export const getCampaigns = async (req, res, next) => {
  try {
    const {
      platform,
      category,
      country,
      state,
      city,
      days = '90',
      search,
      status,
      page = '1',
      limit = '20',
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = {};

    if (platform && platform !== 'ALL') where.platform = platform;
    if (category && category !== '') where.category = category;
    if (country) where.country = country;
    if (state) where.state = state;
    if (city) where.city = city;
    if (status && status !== 'ALL') where.status = status;

    if (search) {
      where.institutionName = { contains: search, mode: 'insensitive' };
    }

    if (days && days !== 'all') {
      const since = new Date();
      since.setDate(since.getDate() - parseInt(days));
      where.startDate = { gte: since };
    }

    const validSortFields = ['createdAt', 'startDate', 'estimatedSpend', 'institutionName'];
    const orderByField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';

    const [campaigns, total] = await Promise.all([
      prisma.campaign.findMany({
        where,
        include: {
          performances: {
            orderBy: { date: 'desc' },
            take: 1,
          },
          creatives: {
            take: 1,
          },
        },
        orderBy: { [orderByField]: sortOrder === 'asc' ? 'asc' : 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.campaign.count({ where }),
    ]);

    res.json({
      campaigns: campaigns.map(c => ({
        ...c,
        tags: c.tags ? c.tags.split(',') : []
      })),
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/campaigns/stats
 */
export const getCampaignStats = async (req, res, next) => {
  try {
    const { days = '90' } = req.query;
    const dateFilter = {};
    if (days !== 'all') {
      const since = new Date();
      const daysInt = parseInt(days);
      if (!isNaN(daysInt)) {
        since.setDate(since.getDate() - daysInt);
        dateFilter.startDate = { gte: since };
      }
    }

    const [total, active, ended, paused, byPlatform, byCategory] = await Promise.all([
      prisma.campaign.count({ where: { ...dateFilter } }),
      prisma.campaign.count({ where: { status: 'ACTIVE', ...dateFilter } }),
      prisma.campaign.count({ where: { status: 'ENDED', ...dateFilter } }),
      prisma.campaign.count({ where: { status: 'PAUSED', ...dateFilter } }),
      prisma.campaign.groupBy({
        by: ['platform'],
        _count: { platform: true },
        _sum: { estimatedSpend: true },
        where: { ...dateFilter },
      }),
      prisma.campaign.groupBy({
        by: ['category'],
        _count: { category: true },
        where: { ...dateFilter },
      }),
    ]);

    const totalSpend = await prisma.campaign.aggregate({
      _sum: { estimatedSpend: true },
      where: { ...dateFilter },
    });

    res.json({
      total,
      active,
      ended,
      paused,
      totalSpend: totalSpend._sum.estimatedSpend || 0,
      byPlatform: byPlatform.map((p) => ({
        platform: p.platform,
        count: p._count.platform,
        spend: p._sum.estimatedSpend || 0,
      })),
      byCategory: byCategory.map((c) => ({
        category: c.category,
        count: c._count.category,
      })),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/campaigns/:id
 */
export const getCampaignById = async (req, res, next) => {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id: req.params.id },
      include: {
        performances: { orderBy: { date: 'asc' } },
        creatives: true,
      },
    });

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    if (campaign) {
      campaign.tags = campaign.tags ? campaign.tags.split(',') : [];
    }
    res.json(campaign);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/campaigns
 */
export const createCampaign = async (req, res, next) => {
  try {
    const campaign = await prisma.campaign.create({ data: req.body });
    res.status(201).json(campaign);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/campaigns/:id
 */
export const updateCampaign = async (req, res, next) => {
  try {
    const campaign = await prisma.campaign.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(campaign);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/campaigns/:id
 */
export const deleteCampaign = async (req, res, next) => {
  try {
    await prisma.campaign.delete({ where: { id: req.params.id } });
    res.json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// ── Filter endpoints ────────────────────────────────
export const getCountries = async (req, res) => {
  res.json(COUNTRIES);
};

export const getStates = async (req, res) => {
  const { country } = req.query;
  if (country === 'India' || !country) {
    res.json(INDIAN_STATES);
  } else {
    res.json([]);
  }
};

export const getCities = async (req, res, next) => {
  try {
    const { country, state } = req.query;
    const where = {};
    if (country) where.country = country;
    if (state) where.state = state;

    const cities = await prisma.campaign.findMany({
      where,
      select: { city: true },
      distinct: ['city'],
      orderBy: { city: 'asc' },
    });

    res.json(cities.map((c) => c.city).filter(Boolean));
  } catch (error) {
    next(error);
  }
};

export const getPlatforms = async (req, res) => {
  res.json(['META', 'GOOGLE', 'LINKEDIN', 'ENEWSPAPER']);
};
