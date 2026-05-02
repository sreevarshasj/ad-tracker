// FILE: frontend/src/components/table/CampaignTable.jsx
import { useState } from 'react'
import { ChevronUp, ChevronDown, ExternalLink } from 'lucide-react'
import { useCampaigns } from '../../hooks/useCampaigns.js'
import TableRow from './TableRow.jsx'
import { SkeletonTable } from '../ui/Skeleton.jsx'
import Modal from '../ui/Modal.jsx'
import CampaignCard from '../cards/CampaignCard.jsx'
import ExportMenu from '../ui/ExportMenu.jsx'

const COLUMNS = [
  { key: 'institutionName', label: 'Institution' },
  { key: 'platform', label: 'Platform' },
  { key: null, label: 'Location' },
  { key: 'status', label: 'Status' },
  { key: null, label: 'Tags' },
  { key: 'estimatedSpend', label: 'Est. Spend' },
  { key: 'startDate', label: 'Start Date' },
  { key: null, label: 'End Date' },
  { key: null, label: 'Source' },
]

export default function CampaignTable() {
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [selectedCampaign, setSelectedCampaign] = useState(null)

  const { campaigns, total, totalPages, isLoading } = useCampaigns({
    page,
    limit: 20,
    sortBy,
    sortOrder,
  })

  const handleSort = (key) => {
    if (!key) return
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(key)
      setSortOrder('desc')
    }
  }

  const SortIcon = ({ col }) => {
    if (!col.key || sortBy !== col.key) return <ChevronUp size={12} className="opacity-20" />
    return sortOrder === 'asc' ? <ChevronUp size={12} className="text-accent-purple" /> : <ChevronDown size={12} className="text-accent-purple" />
  }

  return (
    <div className="card-dark overflow-hidden">
      {/* Table header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <p className="text-sm text-text-secondary">
          <span className="font-semibold text-text-primary">{total}</span> campaigns
        </p>
        <ExportMenu campaigns={campaigns} />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border bg-background-elevated/50">
              {COLUMNS.map((col) => (
                <th
                  key={col.label}
                  className={`px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider whitespace-nowrap ${col.key ? 'cursor-pointer hover:text-text-secondary' : ''}`}
                  onClick={() => handleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    <SortIcon col={col} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <SkeletonTable rows={8} />
            ) : campaigns.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} className="px-4 py-16 text-center text-text-muted text-sm">
                  No campaigns found for the selected filters
                </td>
              </tr>
            ) : (
              campaigns.map((campaign) => (
                <TableRow
                  key={campaign.id}
                  campaign={campaign}
                  onClick={setSelectedCampaign}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-xs text-text-muted">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="btn-ghost border border-border text-xs px-3 py-1.5 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="btn-ghost border border-border text-xs px-3 py-1.5 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Campaign Detail Modal */}
      <Modal
        isOpen={!!selectedCampaign}
        onClose={() => setSelectedCampaign(null)}
        title="Campaign Details"
        size="md"
      >
        {selectedCampaign && <CampaignCard campaign={selectedCampaign} />}
      </Modal>
    </div>
  )
}
