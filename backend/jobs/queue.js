// FILE: backend/jobs/queue.js
import Bull from 'bull';
import { redisConfig } from '../config/redis.js';
import { logger } from '../utils/logger.js';

let syncQueue = null;

export const getSyncQueue = () => {
  if (!syncQueue) {
    try {
      syncQueue = new Bull('sync-ads', {
        redis: redisConfig,
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 5000,
          },
          removeOnComplete: 50,
          removeOnFail: 20,
        },
      });

      syncQueue.on('error', (err) => {
        logger.warn('Bull queue error (Redis may be unavailable):', err.message);
      });

      syncQueue.on('completed', (job) => {
        logger.info(`Job ${job.id} completed`);
      });

      syncQueue.on('failed', (job, err) => {
        logger.error(`Job ${job.id} failed:`, err.message);
      });

    } catch (err) {
      logger.warn('Failed to create Bull queue:', err.message);
    }
  }
  return syncQueue;
};

export default getSyncQueue;
