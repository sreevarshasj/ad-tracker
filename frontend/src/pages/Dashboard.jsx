// FILE: frontend/src/pages/Dashboard.jsx
import { Users, Megaphone, DollarSign, TrendingUp } from 'lucide-react'
import SummaryCard from '../components/cards/SummaryCard.jsx'
import SpendTrendChart from '../components/charts/SpendTrendChart.jsx'
import PlatformPieChart from '../components/charts/PlatformPieChart.jsx'
import CampaignBarChart from '../components/charts/CampaignBarChart.jsx'
import InsightsPanel from '../components/agent/InsightsPanel.jsx'
import FilterBar from '../components/filters/FilterBar.jsx'
import { useCampaignStats } from '../hooks/useCampaigns.js'
import { useInsights } from '../hooks/useInsights.js'
import { formatCurrency, formatNumber } from '../utils/formatters.js'

export default function Dashboard() {
  const { stats, isLoading: statsLoading } = useCampaignStats()
  const { trends } = useInsights()

  const summaryCards = [
    {
      title: 'Total Campaigns',
      value: formatNumber(stats?.total || 0),
      subtitle: `${stats?.active || 0} active`,
      icon: Megaphone,
      color: 'purple',
      trend: trends?.trend,
      trendValue: trends ? `${trends.percentage}%` : null,
    },
    {
      title: 'Active Campaigns',
      value: formatNumber(stats?.active || 0),
      subtitle: `${stats?.paused || 0} paused`,
      icon: TrendingUp,
      color: 'success',
    },
    {
      title: 'Total Est. Spend',
      value: formatCurrency(stats?.totalSpend || 0),
      subtitle: 'Across all platforms',
      icon: DollarSign,
      color: 'cyan',
    },
    {
      title: 'Institutions',
      value: formatNumber(stats?.byCategory?.reduce?.((s, c) => s + c.count, 0) || 0),
      subtitle: `${stats?.byCategory?.find?.((c) => c.category === 'UNIVERSITY')?.count || 0} universities · ${stats?.byCategory?.find?.((c) => c.category === 'COLLEGE')?.count || 0} colleges · ${stats?.byCategory?.find?.((c) => c.category === 'SCHOOL')?.count || 0} schools`,
      icon: Users,
      color: 'warning',
    },
  ]

  return (
    <div className="space-y-6 fade-in">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <SummaryCard key={card.title} {...card} isLoading={statsLoading} />
        ))}
      </div>

      {/* Filters */}
      <FilterBar />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spend Trend - Wide */}
        <div className="lg:col-span-2 card-dark p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-text-primary">Spend Trend</h2>
              <p className="text-xs text-text-muted mt-0.5">Daily spend vs CTR</p>
            </div>
          </div>
          <SpendTrendChart />
        </div>

        {/* Platform Split */}
        <div className="card-dark p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-text-primary">Platform Split</h2>
            <p className="text-xs text-text-muted mt-0.5">Campaigns by platform</p>
          </div>
          <PlatformPieChart />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaign Growth */}
        <div className="lg:col-span-2 card-dark p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-text-primary">Campaign Growth</h2>
            <p className="text-xs text-text-muted mt-0.5">Monthly campaign count</p>
          </div>
          <CampaignBarChart />
        </div>

        {/* Insights Panel */}
        <InsightsPanel />
      </div>
    </div>
  )
}
