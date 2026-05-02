// FILE: backend/services/export.service.js
import { prisma } from '../config/db.js';
import { logger } from '../utils/logger.js';
import { formatDate, formatCurrency } from '../utils/formatter.js';

/**
 * Export campaigns data as CSV string
 */
export const exportCampaignsCSV = async (filters = {}) => {
  try {
    const { buildWhereClause } = await import('./insights.service.js');
    const whereClause = buildWhereClause(filters);

    const campaigns = await prisma.campaign.findMany({
      where: whereClause,
      include: {
        performances: {
          orderBy: { date: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const headers = [
      'Institution Name',
      'Platform',
      'Category',
      'Country',
      'State',
      'City',
      'Status',
      'Tags',
      'Est. Spend (INR)',
      'Start Date',
      'End Date',
      'Impressions',
      'Clicks',
      'CTR (%)',
    ];

    const rows = campaigns.map((c) => {
      const perf = c.performances[0] || {};
      return [
        `"${c.institutionName}"`,
        c.platform,
        c.category,
        c.country,
        c.state,
        c.city,
        c.status,
        `"${(c.tags || []).join(', ')}"`,
        c.estimatedSpend?.toFixed(2) || '0',
        formatDate(c.startDate),
        c.endDate ? formatDate(c.endDate) : 'Ongoing',
        perf.impressions || '0',
        perf.clicks || '0',
        perf.ctr?.toFixed(2) || '0',
      ];
    });

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    return csvContent;
  } catch (error) {
    logger.error('exportCampaignsCSV error:', error);
    throw error;
  }
};

/**
 * Generate simple HTML report for PDF rendering
 */
export const generateHTMLReport = async (filters = {}) => {
  try {
    const { buildWhereClause } = await import('./insights.service.js');
    const whereClause = buildWhereClause(filters);

    const [campaigns, syncLog] = await Promise.all([
      prisma.campaign.findMany({
        where: whereClause,
        take: 100,
        orderBy: { estimatedSpend: 'desc' },
      }),
      prisma.syncLog.findFirst({ orderBy: { syncedAt: 'desc' } }),
    ]);

    const totalSpend = campaigns.reduce((s, c) => s + (c.estimatedSpend || 0), 0);
    const activeCampaigns = campaigns.filter((c) => c.status === 'ACTIVE').length;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Ads Tracker Report</title>
  <style>
    body { font-family: Arial, sans-serif; background: #fff; color: #333; }
    h1 { color: #6C5CE7; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th { background: #6C5CE7; color: #fff; padding: 8px; text-align: left; }
    td { padding: 6px 8px; border-bottom: 1px solid #eee; }
    .summary { display: flex; gap: 20px; margin: 20px 0; }
    .stat { background: #f5f5f5; padding: 16px; border-radius: 8px; flex: 1; }
    .stat h2 { margin: 0; font-size: 24px; color: #6C5CE7; }
    .stat p { margin: 4px 0 0; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <h1>📊 Ads Tracker Report</h1>
  <p>Generated: ${new Date().toLocaleString()} | Last Sync: ${syncLog ? formatDate(syncLog.syncedAt) : 'Never'}</p>

  <div class="summary">
    <div class="stat"><h2>${campaigns.length}</h2><p>Total Campaigns</p></div>
    <div class="stat"><h2>${activeCampaigns}</h2><p>Active Campaigns</p></div>
    <div class="stat"><h2>₹${(totalSpend / 100000).toFixed(1)}L</h2><p>Total Est. Spend</p></div>
  </div>

  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Institution</th>
        <th>Platform</th>
        <th>Category</th>
        <th>Status</th>
        <th>Est. Spend</th>
        <th>Tags</th>
      </tr>
    </thead>
    <tbody>
      ${campaigns
        .slice(0, 50)
        .map(
          (c, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${c.institutionName}</td>
          <td>${c.platform}</td>
          <td>${c.category}</td>
          <td>${c.status}</td>
          <td>₹${(c.estimatedSpend || 0).toFixed(0)}</td>
          <td>${(c.tags || []).join(', ') || '-'}</td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>
</body>
</html>`;

    return html;
  } catch (error) {
    logger.error('generateHTMLReport error:', error);
    throw error;
  }
};
