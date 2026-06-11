# Lexidy Sales Hub

Internal advisor tool embedded in HubSpot contact records.  
Guides sales advisors through country/visa selection → eligibility test → results → sales script → pricing.

---

## Repository structure

```
/
├── lexidy-sales-hub/   React/Vite frontend (advisor UI)
├── backend/            Node.js/Express API (Postgres + HubSpot)
└── hubspot-app/        HubSpot UI extension (embeds the Hub in contact records)
```

---

## Quick start (local, mock mode — no backend needed)

```bash
cd lexidy-sales-hub
npm install
npm run dev
# → http://localhost:5173
```

Uses `mockData.js` — no login, no database, no HubSpot key required.  
Full demo of the entire advisor flow.

---

## Full stack (live mode)

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env        # fill in JWT_SECRET, ADVISOR_PASSWORD, DATABASE_URL
npm run migrate             # create tables
npm run seed                # load visa catalog into Postgres
npm start                   # → http://localhost:3001
```

### 2. Frontend

```bash
cd lexidy-sales-hub
cp .env.example .env        # set VITE_API_BASE_URL=http://localhost:3001
npm install
npm run dev                 # → http://localhost:5173
```

Advisor enters shared password → JWT issued → full flow backed by Postgres + HubSpot.

### 3. HubSpot embed (optional)

See `hubspot-app/README.md` — deploys a "Sales Hub" tab on every contact record.

---

## Detailed documentation

| Topic | File |
|---|---|
| Backend setup, endpoints, deploy checklist | `backend/README.md` |
| HubSpot embed deploy guide | `hubspot-app/README.md` |
| API request/response contracts | `lexidy-sales-hub/API_CONTRACT.md` |
| Eligibility engine grammar | `backend/lib/eligibilityEngine.js` (header comment) |

---

## Adding new content

| What | How |
|---|---|
| Edit prices / labels / thresholds | Admin Panel in the running app — saves to Postgres, no deploy |
| Add a new visa | Add to `mockData.js` + `backend/data/eligibilityData.js`, run `npm run seed` |
| Add a new country | Same as above, plus a row in `backend/schema.sql` seed data |

---

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite 5 |
| Backend | Node.js ≥ 18, Express 4 |
| Database | PostgreSQL ≥ 14 |
| Auth | JWT (shared advisor password, 12h tokens) |
| CRM | HubSpot REST API v3 (private app) |
| Embed | HubSpot UI Extensions (Sales Hub Enterprise) |
