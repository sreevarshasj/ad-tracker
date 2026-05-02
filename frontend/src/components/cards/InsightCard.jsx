// FILE: frontend/src/components/cards/InsightCard.jsx
import InsightItem from '../agent/InsightItem.jsx'

export default function InsightCard({ insights = [], isLoading }) {
  if (isLoading) {
    return (
      <div className="card-dark p-5 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 skeleton rounded-xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="card-dark p-5 space-y-2">
      {insights.slice(0, 3).map((insight, i) => (
        <InsightItem key={i} insight={insight} index={i} />
      ))}
    </div>
  )
}
