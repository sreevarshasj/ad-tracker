// FILE: backend/controllers/creatives.controller.js
import { prisma } from '../config/db.js';

/**
 * GET /api/creatives
 */
export const getCreatives = async (req, res, next) => {
  try {
    const { platform, format, campaignId, page = '1', limit = '24' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (platform && platform !== 'ALL') where.platform = platform;
    if (format) where.format = format;
    if (campaignId) where.campaignId = campaignId;

    const [creatives, total] = await Promise.all([
      prisma.creative.findMany({
        where,
        include: {
          campaign: {
            select: { institutionName: true, category: true, status: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.creative.count({ where }),
    ]);

    res.json({
      creatives,
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
 * GET /api/creatives/:id
 */
export const getCreativeById = async (req, res, next) => {
  try {
    const creative = await prisma.creative.findUnique({
      where: { id: req.params.id },
      include: {
        campaign: true,
      },
    });

    if (!creative) {
      return res.status(404).json({ error: 'Creative not found' });
    }

    res.json(creative);
  } catch (error) {
    next(error);
  }
};
