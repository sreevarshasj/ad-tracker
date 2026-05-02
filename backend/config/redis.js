// FILE: backend/config/redis.js
import Redis from 'ioredis';
import { logger } from '../utils/logger.js';

let redisClient = null;
let isConnected = false;

export const getRedisClient = () => {
  if (!redisClient) {
    redisClient = new Redis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: parseInt(process.env.REDIS_PORT) || 6379,
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 5) {
          logger.warn('Redis connection failed after 5 retries — running without Redis');
          return null;
        }
        return Math.min(times * 500, 2000);
      },
      lazyConnect: true,
    });

    redisClient.on('connect', () => {
      isConnected = true;
      logger.info('✅ Redis connected');
    });

    redisClient.on('error', (err) => {
      isConnected = false;
      logger.warn('Redis connection error:', err.message);
    });

    redisClient.on('close', () => {
      isConnected = false;
    });
  }

  return redisClient;
};

export const isRedisAvailable = () => isConnected;

export const redisConfig = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT) || 6379,
};

export default getRedisClient;
