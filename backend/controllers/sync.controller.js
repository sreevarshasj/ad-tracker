// FILE: backend/controllers/sync.controller.js
import { triggerManualSync } from '../jobs/scheduler.js';
import { prisma } from '../config/db.js';
import { logger } from '../utils/logger.js';

/**
 * POST /api/sync/trigger
 * Manually trigger an ad sync
 */
export const triggerSync = async (req, res, next) => {
  try {
    logger.info('[Sync] Manual trigger initiated');

    // Run sync asynchronously — respond immediately
    res.json({
      message: 'Sync triggered successfully. Data will be updated shortly.',
      startedAt: new Date().toISOString(),
    });

    // Execute sync in background
    triggerManualSync().catch((err) => {
      logger.error('[Sync] Manual sync failed:', err.message);
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/sync/status
 */
export const getSyncStatus = async (req, res, next) => {
  try {
    const recentLogs = await prisma.syncLog.findMany({
      orderBy: { syncedAt: 'desc' },
      take: 20,
    });

    const lastSuccess = recentLogs.find((l) => l.status === 'SUCCESS');
    const lastFail = recentLogs.find((l) => l.status === 'FAILED');

    const platformSummary = {};
    for (const log of recentLogs) {
      if (!platformSummary[log.platform]) {
        platformSummary[log.platform] = log;
      }
    }

    res.json({
      lastSync: lastSuccess?.syncedAt || null,
      lastFailed: lastFail?.syncedAt || null,
      recentLogs,
      platformStatus: Object.values(platformSummary),
      totalSynced: recentLogs.reduce((s, l) => s + (l.count || 0), 0),
    });
  } catch (error) {
    next(error);
  }
};
