// FILE: backend/jobs/scheduler.js
import { logger } from '../utils/logger.js';
import { processSyncJob } from './syncAds.job.js';

let schedulerInterval = null;
let isRunning = false;

/**
 * Run a sync job immediately (without Bull/Redis)
 */
const runSyncNow = async () => {
  if (isRunning) {
    logger.warn('[Scheduler] Sync already in progress, skipping...');
    return;
  }

  isRunning = true;
  const fakeJob = {
    id: Date.now(),
    progress: (pct) => logger.info(`[Sync] Progress: ${pct}%`),
  };

  try {
    const result = await processSyncJob(fakeJob);
    logger.info('[Scheduler] Sync completed:', result);
    return result;
  } catch (err) {
    logger.error('[Scheduler] Sync failed:', err.message);
    throw err;
  } finally {
    isRunning = false;
  }
};

/**
 * Try to start Bull queue scheduler (requires Redis)
 * Falls back to node-cron if Redis is unavailable
 */
export const startScheduler = async () => {
  let usingBull = false;

  // Try Bull first
  try {
    const { getSyncQueue } = await import('./queue.js');
    const queue = getSyncQueue();

    if (queue) {
      // Register processor
      queue.process('sync-ads', 1, async (job) => {
        return await processSyncJob(job);
      });

      // Schedule repeating job based on minutes
      const intervalMins = parseInt(process.env.SYNC_INTERVAL_MINUTES) || 360; // default to 6 hours
      
      // Clear existing repeaters
      const repeatableJobs = await queue.getRepeatableJobs();
      for (const job of repeatableJobs) {
        await queue.removeRepeatableByKey(job.key);
      }

      await queue.add(
        'sync-ads',
        {},
        {
          repeat: { cron: `*/${intervalMins} * * * *` },
          jobId: 'recurring-sync',
        }
      );

      logger.info(`⏰ Bull scheduler started — syncing every ${intervalMins} minutes`);
      usingBull = true;
    }
  } catch (err) {
    logger.warn('[Scheduler] Bull unavailable, falling back to setInterval:', err.message);
  }

  // Fallback: setInterval (works without Redis)
  if (!usingBull) {
    const intervalMins = parseInt(process.env.SYNC_INTERVAL_MINUTES) || 360;
    const intervalMs = intervalMins * 60 * 1000;

    // Clear existing interval if any
    if (schedulerInterval) clearInterval(schedulerInterval);

    schedulerInterval = setInterval(async () => {
      logger.info('[Scheduler] Triggering scheduled sync...');
      await runSyncNow().catch((e) => logger.error('[Scheduler] Error:', e.message));
    }, intervalMs);

    logger.info(`⏰ Fallback scheduler started — syncing every ${intervalMins} minutes (setInterval)`);
  }
};

/**
 * Manually trigger a sync (for API endpoint)
 */
export const triggerManualSync = async () => {
  return await runSyncNow();
};

/**
 * Stop the scheduler
 */
export const stopScheduler = () => {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
    logger.info('[Scheduler] Stopped');
  }
};

export { runSyncNow };
