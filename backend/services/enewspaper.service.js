// FILE: backend/services/enewspaper.service.js
import axios from 'axios';
import * as cheerio from 'cheerio';
import { logger } from '../utils/logger.js';

const EDUCATION_KEYWORDS = [
  'college', 'school', 'admission', 'university', 'institute',
  'enroll', 'apply now', 'courses', 'degree', 'diploma',
  'engineering', 'medical', 'management', 'education', 'campus',
  'scholarship', 'exam', 'coaching',
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Fetch ads from a publisher's own API endpoint
 */
export const fetchFromPublisherAPI = async (publisherConfig) => {
  try {
    const { name, apiUrl, apiKey } = publisherConfig;

    const response = await axios.get(apiUrl, {
      headers: { 'X-API-Key': apiKey, 'Accept': 'application/json' },
      timeout: 15000,
    });

    const ads = response.data.ads || response.data.data || response.data || [];
    return ads.map((ad) => ({
      mediaUrl: ad.image_url || ad.banner_url || '',
      adCopy: ad.title || ad.headline || ad.description || '',
      cta: ad.cta || ad.button_text || 'Learn More',
      format: 'IMAGE',
      platform: 'ENEWSPAPER',
      source: name,
    }));
  } catch (error) {
    logger.error(`fetchFromPublisherAPI error for ${publisherConfig.name}:`, error.message);
    return [];
  }
};

/**
 * Scrape education ads from a newspaper website
 */
export const scrapeNewspaperAds = async (targetUrl) => {
  try {
    await sleep(1000 + Math.random() * 1000); // respectful scraping delay

    const response = await axios.get(targetUrl, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AdsTrackerBot/1.0)',
        'Accept': 'text/html,application/xhtml+xml',
      },
    });

    const $ = cheerio.load(response.data);
    const ads = [];

    // Common ad container selectors
    const adSelectors = [
      '.advertisement',
      '.ad-banner',
      '.ad-container',
      '[class*="sponsor"]',
      '[class*="advertisement"]',
      '[class*="ad-"]',
      '[id*="advertisement"]',
      'ins.adsbygoogle',
    ];

    for (const selector of adSelectors) {
      $(selector).each((_, el) => {
        const $el = $(el);

        // Extract image
        const img = $el.find('img').first();
        const imageUrl =
          img.attr('src') || img.attr('data-src') || img.attr('data-lazy-src') || '';

        // Extract link
        const link = $el.find('a').first();
        const linkUrl = link.attr('href') || '';

        // Extract alt text as ad copy
        const altText = img.attr('alt') || link.text().trim() || $el.text().trim();

        if (imageUrl || altText) {
          ads.push({
            mediaUrl: imageUrl.startsWith('http') ? imageUrl : `${new URL(targetUrl).origin}${imageUrl}`,
            adCopy: altText.substring(0, 500),
            cta: link.text().trim() || 'Learn More',
            format: 'IMAGE',
            platform: 'ENEWSPAPER',
            linkUrl,
          });
        }
      });
    }

    return filterEducationAds(ads);
  } catch (error) {
    logger.error(`scrapeNewspaperAds error for ${targetUrl}:`, error.message);
    return [];
  }
};

/**
 * Filter ads to only keep education-related ones
 */
export const filterEducationAds = (ads) => {
  return ads.filter((ad) => {
    const text = (ad.adCopy + ' ' + ad.linkUrl).toLowerCase();
    return EDUCATION_KEYWORDS.some((kw) => text.includes(kw));
  });
};

/**
 * Generate mock e-newspaper data for demo/dev purposes
 */
export const generateMockNewspaperAds = (count = 5) => {
  const sources = ['Times of India', 'The Hindu', 'Deccan Chronicle', 'Hindustan Times'];
  const institutions = [
    'Sri Ramakrishna College',
    'PSG College of Technology',
    'Kumaraguru College',
    'Amrita University',
    'SASTRA University',
  ];

  return Array.from({ length: count }, (_, i) => ({
    externalId: `ENEWSPAPER_${Date.now()}_${i}`,
    platform: 'ENEWSPAPER',
    institutionName: institutions[i % institutions.length],
    category: i % 2 === 0 ? 'COLLEGE' : 'SCHOOL',
    status: 'ACTIVE',
    startDate: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
    endDate: null,
    estimatedSpend: Math.random() * 10000,
    country: 'India',
    state: 'Tamil Nadu',
    city: ['Coimbatore', 'Chennai', 'Madurai'][i % 3],
    tags: [],
    source: sources[i % sources.length],
  }));
};
