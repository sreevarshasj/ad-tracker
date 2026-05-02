// FILE: frontend/src/components/layout/Layout.jsx
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import TopBar from './TopBar.jsx'

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/campaigns': 'Campaigns',
  '/creatives': 'Creatives',
  '/insights': 'Agent Insights',
  '/settings': 'Settings',
}

export default function Layout() {
  const { pathname } = useLocation()
  const title = PAGE_TITLES[pathname] || 'Ads Tracker'

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar title={title} />
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
