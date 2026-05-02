// FILE: frontend/src/components/ui/Tooltip.jsx
import { useState } from 'react'

export default function Tooltip({ content, children, position = 'top' }) {
  const [visible, setVisible] = useState(false)

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && content && (
        <div className={`absolute ${positions[position]} z-50 px-2.5 py-1.5 bg-background-elevated border border-border rounded-lg text-xs text-text-primary whitespace-nowrap shadow-card fade-in pointer-events-none`}>
          {content}
        </div>
      )}
    </div>
  )
}
