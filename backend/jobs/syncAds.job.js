// FILE: backend/jobs/syncAds.job.js
import { prisma } from '../config/db.js';
import { generateMockData } from './mockDataGenerator.js';
import { classifyCampaign } from '../services/agent.service.js';
import { logger } from '../utils/logger.js';

const PLATFORMS = ['META', 'GOOGLE', 'LINKEDIN', 'ENEWSPAPER'];

/**
 * Main sync job processor — runs for each platform
 */
export const processSyncJob = async (job) => {
  const startTime = Date.now();
  logger.info(`[Sync Job ${job.id}] Starting at ${new Date().toISOString()}`);

  const results = {
    total: 0,
    success: 0,
    failed: 0,
    platforms: {},
  };

  for (const platform of PLATFORMS) {
    try {
      logger.info(`[Sync] Processing platform: ${platform}`);
      job.progress(PLATFORMS.indexOf(platform) * 25);

      let campaigns = [];

      // Try to fetch real data; fall back to mock data
      try {
        campaigns = await fetchPlatformCampaigns(platform);
      } catch (fetchErr) {
        logger.warn(`[Sync] Real API fetch failed for ${platform}, using mock data: ${fetchErr.message}`);
        campaigns = generateMockData(platform, 25);
      }

      let syncCount = 0;

      for (const campaignData of campaigns) {
        try {
          // Upsert campaign
          const campaign = await prisma.campaign.upsert({
            where: { externalId: campaignData.externalId },
            update: {
              status: campaignData.status,
              endDate: campaignData.endDate,
              category: campaignData.category,
              estimatedSpend: campaignData.estimatedSpend || 0,
              updatedAt: new Date(),
            },
            create: {
              externalId: campaignData.externalId,
              platform: campaignData.platform,
              institutionName: campaignData.institutionName,
              category: campaignData.category,
              country: campaignData.country || 'India',
              state: campaignData.state || '',
              city: campaignData.city || '',
              startDate: campaignData.startDate,
              endDate: campaignData.endDate || null,
              status: campaignData.status,
              estimatedSpend: campaignData.estimatedSpend || 0,
              tags: "",
            },
          });

          // Upsert performance data if provided
          if (campaignData.performance) {
            const perf = campaignData.performance;
            await prisma.performance.upsert({
              where: {
                campaignId_date: {
                  campaignId: campaign.id,
                  date: perf.date || new Date(),
                },
              },
              update: {
                impressions: perf.impressions || 0,
                clicks: perf.clicks || 0,
                spend: perf.spend || 0,
                ctr: perf.ctr || 0,
              },
              create: {
                campaignId: campaign.id,
                impressions: perf.impressions || 0,
                clicks: perf.clicks || 0,
                spend: perf.spend || 0,
                ctr: perf.ctr || 0,
                date: perf.date || new Date(),
              },
            });
          }
          // Upsert creatives if provided
          if (campaignData.creatives && campaignData.creatives.length > 0) {
            for (const creativeData of campaignData.creatives) {
              await prisma.creative.create({
                data: {
                  campaignId: campaign.id,
                  mediaUrl: creativeData.mediaUrl,
                  adCopy: creativeData.adCopy,
                  cta: creativeData.cta,
                  format: creativeData.format,
                  platform: creativeData.platform,
                }
              });
            }
          }

          // Classify and update tags
          const latestPerf = campaignData.performance || null;
          const tags = classifyCampaign(campaign, latestPerf);
          if (tags.length > 0) {
            await prisma.campaign.update({
              where: { id: campaign.id },
              data: { tags: tags.join(',') },
            });
          }

          syncCount++;
        } catch (itemErr) {
          logger.error(`[Sync] Error upserting campaign ${campaignData.externalId}:`, itemErr.message);
        }
      }

      // Write sync log
      await prisma.syncLog.create({
        data: {
          platform,
          status: 'SUCCESS',
          message: `Synced ${syncCount} campaigns`,
          count: syncCount,
        },
      });

      results.platforms[platform] = { success: true, count: syncCount };
      results.success++;
      results.total += syncCount;

      logger.info(`[Sync] ✅ ${platform}: Synced ${syncCount} campaigns`);

    } catch (platformErr) {
      logger.error(`[Sync] ❌ ${platform} failed:`, platformErr.message);

      await prisma.syncLog.create({
        data: {
          platform,
          status: 'FAILED',
          message: platformErr.message,
          count: 0,
        },
      });

      results.platforms[platform] = { success: false, error: platformErr.message };
      results.failed++;
    }
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  logger.info(`[Sync Job ${job.id}] Complete in ${duration}s — Total: ${results.total} records`);

  return results;
};

/**
 * Fetch campaigns from a specific platform
 */
const fetchPlatformCampaigns = async (platform) => {
  const dateRange = {
    start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    end: new Date(),
  };

  switch (platform) {
    case 'META': {
      const { fetchMetaCampaigns } = await import('../services/meta.service.js');
      return fetchMetaCampaigns(process.env.META_AD_ACCOUNT_ID, dateRange);
    }
    case 'GOOGLE': {
      const { fetchGoogleCampaigns } = await import('../services/google.service.js');
      return fetchGoogleCampaigns(process.env.GOOGLE_ADS_CUSTOMER_ID, dateRange);
    }
    case 'LINKEDIN': {
      const { fetchLinkedInCampaigns } = await import('../services/linkedin.service.js');
      return fetchLinkedInCampaigns(process.env.LINKEDIN_AD_ACCOUNT_ID, dateRange);
    }
    case 'ENEWSPAPER': {
      const { generateMockNewspaperAds } = await import('../services/enewspaper.service.js');
      return generateMockNewspaperAds(8);
    }
    default:
      return [];
  }
};
