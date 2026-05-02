// FILE: frontend/src/pages/Campaigns.jsx
import FilterBar from '../components/filters/FilterBar.jsx'
import CampaignTable from '../components/table/CampaignTable.jsx'

export default function Campaigns() {
  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-xl font-bold text-text-primary">Campaigns</h1>
        <p className="text-sm text-text-secondary mt-1">
          Browse and filter all tracked ad campaigns from schools and colleges
        </p>
      </div>

      <FilterBar />
      <CampaignTable />
    </div>
  )
}
