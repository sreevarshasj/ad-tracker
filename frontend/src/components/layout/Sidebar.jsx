// FILE: frontend/src/components/layout/Sidebar.jsx
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Megaphone,
  Image,
  Sparkles,
  Settings,
  Radio,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useUIStore } from '../../store/uiStore.js'
import AgentStatus from '../agent/AgentStatus.jsx'

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Megaphone, label: 'Campaigns', path: '/campaigns' },
  { icon: Image, label: 'Creatives', path: '/creatives' },
  { icon: Sparkles, label: 'Insights', path: '/insights' },
  { icon: Settings, label: 'Settings', path: '/settings' },
]

export default function Sidebar() {
  const collapsed = useUIStore((s) => s.sidebarCollapsed)
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)

  return (
    <aside
      className="flex flex-col h-full bg-background-surface border-r border-border transition-all duration-300 relative"
      style={{ width: collapsed ? 68 : 240 }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-accent-purple/20 border border-accent-purple/30 flex items-center justify-center flex-shrink-0 pulse-glow">
          <Radio size={16} className="text-accent-purple" />
        </div>
        {!collapsed && (
          <div className="fade-in">
            <span className="text-sm font-bold bg-gradient-to-r from-accent-purple to-accent-cyan bg-clip-text text-transparent leading-none">
              AdsTracker
            </span>
            <p className="text-[10px] text-text-muted mt-0.5">Agent Platform</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ icon: Icon, label, path }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
                isActive
                  ? 'bg-accent-purple/15 text-accent-purple border-l-2 border-accent-purple'
                  : 'text-text-secondary hover:text-text-primary hover:bg-border/60'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={`flex-shrink-0 ${isActive ? 'text-accent-purple' : ''}`} />
                {!collapsed && <span className="text-sm font-medium fade-in">{label}</span>}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-background-elevated border border-border rounded-md text-xs text-text-primary whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-card">
                    {label}
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Agent Status */}
      <div className="border-t border-border p-3">
        <AgentStatus collapsed={collapsed} />
      </div>

      {/* Toggle button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 w-6 h-6 bg-background-elevated border border-border rounded-full flex items-center justify-center text-text-muted hover:text-text-primary transition-colors shadow-card z-10"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  )
}
