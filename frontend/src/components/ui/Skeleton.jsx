// FILE: frontend/src/components/ui/Skeleton.jsx
export default function Skeleton({ className = '', count = 1 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`skeleton ${className}`} />
      ))}
    </>
  )
}

export function SkeletonCard() {
  return (
    <div className="card-dark p-5 space-y-3">
      <div className="flex justify-between items-start">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-3 w-48" />
    </div>
  )
}

export function SkeletonRow() {
  return (
    <tr className="border-b border-border">
      {[180, 100, 120, 80, 80, 100, 80].map((w, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className={`h-4 w-${w < 100 ? '[' + w + 'px]' : '[' + w + 'px]'}`} style={{ width: w }} />
        </td>
      ))}
    </tr>
  )
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} />
      ))}
    </>
  )
}
