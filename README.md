# 📊 Ads Tracker Agent
### Ad Intelligence Platform for Schools & Colleges

A full-stack production-grade application that tracks, analyzes, and generates insights from educational institution ad campaigns across **Meta, Google, LinkedIn, and E-Newspapers**.

---

## 🏗️ What Was Built

### Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS (forced dark theme) |
| Backend | Node.js + Express REST API |
| Database | PostgreSQL + Prisma ORM |
| Queue | Redis + Bull (with setInterval fallback) |
| Charts | Recharts |
| State | Zustand + React Query |
| Auth | JWT-based |

---

## 📁 Project Structure

```
adgent/
├── backend/                    # Node.js Express API
│   ├── config/                 # DB, Redis, constants
│   ├── prisma/                 # Schema + migrations
│   ├── routes/                 # 6 route modules
│   ├── controllers/            # 5 controller modules
│   ├── services/               # Meta, Google, LinkedIn, E-News, Agent, Insights, Export
│   ├── jobs/                   # Bull queue, sync job, scheduler, mock data generator
│   ├── middleware/             # Auth (JWT), error handler, rate limiter
│   └── utils/                 # Logger (Winston), classifier, formatter
│
└── frontend/                   # React + Vite SPA
    └── src/
        ├── pages/              # Dashboard, Campaigns, Creatives, Insights, Settings
        ├── components/
        │   ├── layout/         # Sidebar, TopBar, Layout
        │   ├── filters/        # FilterBar, Location, Platform, Category, DateRange
        │   ├── cards/          # SummaryCard, CampaignCard, InsightCard
        │   ├── charts/         # SpendTrendChart, PlatformPieChart, CampaignBarChart
        │   ├── table/          # CampaignTable, TableRow, StatusBadge
        │   ├── creative/       # CreativePanel, CreativeCard, CreativeModal
        │   ├── agent/          # InsightsPanel, InsightItem, AgentStatus
        │   └── ui/             # Button, Badge, Skeleton, Modal, Tooltip, Dropdown, ExportMenu, SearchBar
        ├── hooks/              # useCampaigns, useInsights, usePerformance, useFilters, useExport
        ├── store/              # Zustand: filterStore, campaignStore, uiStore
        ├── api/                # Axios client + 4 API modules
        └── utils/              # formatters, chartHelpers, constants
```

---

## 🤖 Agent Capabilities

### 1. Campaign Classification
Campaigns are auto-tagged with:
- **High Investment** — spend > ₹5,000
- **Long Running** — active for > 30 days
- **High Engagement** — CTR > 5%

### 2. Institution Ranking
Ranked by a composite score:
```
score = (totalSpend × 0.5) + (campaignCount × 30) + (avgCTR × 20)
```

### 3. AI Insights Generated
- 🏆 Top Advertiser (by composite score)
- 📍 Most Active City
- 💰 Total Spend Summary
- 📊 Trending Platform
- ✅ Active Campaign Rate
- 💎 High Investment count

### 4. Trend Detection
Compares this week vs last week spend to classify as `UP`, `DOWN`, or `STABLE`.

### 5. Auto-Sync (every 6 hours)
- Uses Bull + Redis if available
- Falls back to `setInterval` if Redis is unavailable
- Fetches real API data or generates mock data for development

---

## 🎨 Dark Theme Design System

| Token | Color | Usage |
|-------|-------|-------|
| `--bg-root` | `#0A0A0F` | Page background |
| `--bg-surface` | `#111118` | Cards, panels, sidebar |
| `--bg-elevated` | `#16161F` | Modals, dropdowns, hover |
| `--border` | `#1E1E2E` | All borders |
| `--accent` | `#6C5CE7` | Primary CTA, active nav |
| `--cyan` | `#00D2FF` | Secondary metrics |
| `--success` | `#00B894` | Active badges |
| `--warning` | `#FDCB6E` | Tags, warnings |
| `--danger` | `#E17055` | Errors, ended |

---

## 🚀 Quick Start

```bash
# 1. Install
cd backend && npm install && cd ../frontend && npm install

# 2. Setup DB
cd backend && npx prisma generate && npx prisma migrate dev

# 3. Run
cd backend && npm run dev        # Terminal 1
cd frontend && npm run dev       # Terminal 2

# 4. Open
open http://localhost:5173

# 5. First Sync
# Go to Settings → click "Sync Now"
# OR: POST http://localhost:5000/api/sync/trigger
```

See [SETUP.md](./SETUP.md) for full installation guide.

---

## 📡 API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/campaigns` | List campaigns with filters |
| `GET /api/campaigns/stats` | Summary statistics |
| `GET /api/performance/trend` | Daily spend data |
| `GET /api/performance/platforms` | Platform breakdown |
| `GET /api/insights` | AI-generated insights |
| `GET /api/insights/rankings` | Ranked institutions |
| `GET /api/creatives` | Ad creative gallery |
| `POST /api/sync/trigger` | Manual sync trigger |
| `GET /api/sync/status` | Sync history |

---

## ⚠️ Notes

- **No API keys required** to run — mock data is auto-generated on sync
- **Redis is optional** — the scheduler falls back to `setInterval`
- **PostgreSQL is required** — set `DATABASE_URL` in `backend/.env`
- All features work in demo mode with mock Indian educational institution data
