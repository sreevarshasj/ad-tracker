# Ads Tracker Agent — SETUP GUIDE

## Prerequisites

- **Node.js 18+** — https://nodejs.org
- **PostgreSQL 15+** — https://postgresql.org (or Docker)
- **Redis 7+** *(optional — scheduler works without it)*

---

## 1. Clone & Install

```bash
# Install root dependencies
cd ads-tracker-agent
npm install

# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies
cd frontend && npm install && cd ..
```

---

## 2. Environment Setup

```bash
# Copy example env files
cp .env.example backend/.env
```

Edit `backend/.env` with your values.

---

## 3. Database Setup

```bash
cd backend

# Generate Prisma client
npx prisma generate

# Create tables
npx prisma migrate dev --name init

# (Optional) Open database GUI
npx prisma studio
```

---

## 4. API Key Setup

### Meta (Facebook/Instagram)
1. Go to https://developers.facebook.com
2. Create an app → Add **Marketing API** product
3. Generate a **User Access Token** with `ads_read` scope
4. Copy: `META_APP_ID`, `META_APP_SECRET`, `META_ACCESS_TOKEN`, `META_AD_ACCOUNT_ID`

### Google Ads
1. Enable Google Ads API in Google Cloud Console
2. Create OAuth2 credentials
3. Get Developer Token from https://ads.google.com/nav/selectaccount
4. Copy: `GOOGLE_ADS_CLIENT_ID`, `GOOGLE_ADS_CLIENT_SECRET`, `GOOGLE_ADS_DEVELOPER_TOKEN`, `GOOGLE_ADS_CUSTOMER_ID`

### LinkedIn Ads
1. Go to https://www.linkedin.com/developers/
2. Create app → Add **Marketing Developer Platform**
3. Generate access token with `r_ads` scope
4. Copy: `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET`, `LINKEDIN_ACCESS_TOKEN`, `LINKEDIN_AD_ACCOUNT_ID`

> **Note:** The app works with mock data if API keys are not configured. Trigger sync from Settings page.

---

## 5. Run Development

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev

# OR run both with one command (from root)
npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api
- **Health check:** http://localhost:5000/health

---

## 6. First Sync

1. Open http://localhost:5173
2. Go to **Settings** → click **Sync Now**
3. Or call: `POST http://localhost:5000/api/sync/trigger`

The sync will generate mock data automatically if APIs are not configured.

---

## 7. Build for Production

```bash
cd frontend && npm run build
```

---

## 8. Using with Docker (PostgreSQL)

```bash
docker run -d \
  --name postgres-ads \
  -e POSTGRES_DB=ads_tracker \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  postgres:15
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `Can't reach database server` | Check PostgreSQL is running and `DATABASE_URL` is correct |
| `Redis connection error` | App works without Redis; scheduler uses setInterval fallback |
| `Prisma not found` | Run `cd backend && npx prisma generate` |
| Blank dashboard | Trigger a sync from Settings page |
| CORS errors | Check `FRONTEND_URL` in `backend/.env` matches your frontend port |
