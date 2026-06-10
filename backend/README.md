# Lexidy Sales Hub — Backend

Node.js/Express API serving the Lexidy Sales Hub advisor tool.  
Connects to Postgres for the visa catalog and session audit trail,  
and proxies HubSpot for contact lookups and timeline notes.

---

## Stack

| Layer | Tech |
|---|---|
| Runtime | Node.js ≥ 18 |
| Framework | Express 4 |
| Database | PostgreSQL (any version ≥ 14) |
| Auth | JWT (shared advisor password → 12h token) |
| HubSpot | REST API v3 (private app token) |

---

## Directory layout

```
backend/
  server.js              Entry point — mounts all routes
  db.js                  Postgres pool + migration runner
  schema.sql             All tables (idempotent — safe to re-run)
  seed.js                Loads visa catalog from mockData.js into Postgres
  test-equivalence.js    30-scenario test: engine vs original logic
  .env.example           Copy to .env, fill in secrets
  lib/
    eligibilityEngine.js Evaluates branching + computed thresholds
    hubspot.js           HubSpot contact fetch + note creation
  routes/
    auth.js              POST /api/auth/login
    contacts.js          GET  /api/contacts/:contactId
    visas.js             GET  /api/countries  |  GET /api/visas/:visaId
    eligibility.js       POST /api/eligibility-questions/:visaId
    sessions.js          POST /api/sessions/eligibility  +  /pricing
    admin.js             GET  /api/admin/data  |  POST /api/admin/save
  data/
    eligibilityData.js   Declarative eligibility question definitions
    nationalities.js     194-nationality dropdown (auto-extracted)
```

---

## First-time setup

### 1. Clone and install

```bash
git clone https://github.com/psg742h9hp-web/lexidy-sales-hub.git
cd lexidy-sales-hub/backend
npm install
```

### 2. Create the database

```bash
psql -U postgres -c "CREATE DATABASE lexidy_sales_hub;"
# If you want a dedicated user:
psql -U postgres -c "CREATE USER lexidy WITH PASSWORD 'your-password';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE lexidy_sales_hub TO lexidy;"
```

### 3. Configure environment

```bash
cp .env.example .env
```

Open `.env` and fill in every value:

```env
PORT=3001

# Allow the deployed frontend + local dev
CORS_ORIGINS=https://sales-hub.lexidy.com,http://localhost:5173

# Postgres — adjust host/user/password to match your server
DATABASE_URL=postgres://lexidy:your-password@localhost:5432/lexidy_sales_hub
DB_SSL=false          # set true if your Postgres requires SSL

# Generate with: openssl rand -hex 32
JWT_SECRET=

# Shared advisor password — advisors enter this once per workday
ADVISOR_PASSWORD=

# HubSpot private app token (see §HubSpot setup below)
HUBSPOT_API_KEY=
```

### 4. Run migrations

Creates all tables. Safe to re-run — uses `CREATE TABLE IF NOT EXISTS`.

```bash
npm run migrate
```

### 5. Seed the database

Loads all 6 countries, 36 visas, packages, addons, and eligibility  
questions from the frontend's `mockData.js` into Postgres.

```bash
npm run seed
```

Expected output:
```
🌱 Seeding Lexidy Sales Hub database...
  countries: 6
  visas: 36
  packages: 104
  addons: 113
  eligibility questions: 149
✅ Seed complete
```

The seed is **idempotent** — safe to re-run after editing content.  
Re-seeding resets eligibility questions to the code definitions.  
Pricing/package edits made through the Admin Panel are preserved  
(they use upserts, not full deletes).

### 6. Start the server

```bash
npm start          # production
npm run dev        # development (auto-restarts on file changes)
```

Verify it's running:
```bash
curl http://localhost:3001/api/health
# {"status":"ok","service":"lexidy-sales-hub-backend"}
```

---

## Endpoints

All endpoints except `/api/health` and `/api/auth/login` require:  
`Authorization: Bearer <token>`

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/auth/login` | Exchange advisor password for 12h JWT |
| GET | `/api/health` | Health check (no auth) |
| GET | `/api/contacts/:id` | HubSpot contact proxy |
| GET | `/api/countries` | All countries + visas catalog |
| GET | `/api/visas/:visaId` | Single visa detail |
| POST | `/api/eligibility-questions/:visaId` | Dynamic question list (branching) |
| POST | `/api/sessions/eligibility` | Log eligibility result + HubSpot note |
| POST | `/api/sessions/pricing` | Log pricing decision + HubSpot note |
| GET | `/api/admin/data` | Load catalog for Admin Panel |
| POST | `/api/admin/save` | Save catalog edits (transactional) |

Full request/response shapes: see `API_CONTRACT.md` in the repo root.

---

## HubSpot setup

The backend needs a **private app token** to:
- Look up contact details (`GET /api/contacts/:id`)
- Write timeline notes after eligibility/pricing sessions

### Create the private app

1. HubSpot → **Settings** → **Integrations** → **Private Apps**
2. **Create a private app**
3. Name: `Lexidy Sales Hub`
4. Under **Scopes**, grant:
   - `crm.objects.contacts.read`
   - `crm.objects.notes.write`
5. Click **Create app** → copy the token
6. Paste it as `HUBSPOT_API_KEY` in `.env`

### Without a token (local dev)

The server starts fine without `HUBSPOT_API_KEY` — it logs a warning  
and falls back to mock mode:
- Contact fetches return mock data
- Session notes are printed to console instead of sent to HubSpot
- Everything else (Postgres, eligibility engine, admin) works normally

---

## Connecting the frontend

In the frontend's `.env` (at `lexidy-sales-hub/.env`):

```env
VITE_API_BASE_URL=https://your-backend-url.lexidy.com
```

Leave it empty (`VITE_API_BASE_URL=`) to run the frontend in mock/demo  
mode (original mockData.js behavior — no backend needed).

Then rebuild the frontend:
```bash
cd ../lexidy-sales-hub
npm run build
```

---

## HubSpot embed (Sales Hub tab on contact records)

See `hubspot-app/README.md` for the 4-step deploy guide.  
**Requires:** HubSpot Sales Hub Enterprise.

---

## Database tables

| Table | Purpose |
|---|---|
| `countries` | 6 countries (ES, PT, GR, FR, IT, MX) |
| `visas` | 36 visa types, one per country/type |
| `visa_packages` | Bronze/Silver/Gold/Platinum pricing tiers |
| `visa_addons` | Optional add-on services per visa |
| `eligibility_questions` | Declarative questions with branching + threshold rules |
| `sessions` | Audit trail of every eligibility test and pricing decision |

### Editing content without a deploy

Prices, labels, income thresholds, disqualify messages — all editable  
from the Sales Hub Admin Panel. Changes write to Postgres immediately  
and take effect for all advisors on next page load.

Adding a **new visa** (e.g. Mexico): insert a row in `countries`,  
`visas`, `visa_packages`, `visa_addons`, and `eligibility_questions`,  
or use the seed script after updating `data/eligibilityData.js`.

---

## Eligibility engine

`lib/eligibilityEngine.js` is a small (~150 line) interpreter that  
turns the declarative question definitions in Postgres into the  
question list the frontend renders — including:

- **Branching** (`show_if`): show/hide questions based on previous answers  
  (equality, `not`, `gt/gte/lt/lte`, `answered`, `any`/`all`)
- **Computed thresholds** (`threshold_rule`): income minimums that scale  
  with family size (familyTiered, perFamily, pctMultiplier, byAnswer)
- **Dynamic flags** (`disqualify_below_if`, `review_below_if`): flags  
  that activate based on other answers (used for Greece FIP income/savings)

The engine is verified 1:1 against the original `mockData.js` branching  
functions across 30 answer scenarios. Run the test:

```bash
node test-equivalence.js
# ✅ 30 scenarios passed, 0 failed
```

---

## Production deployment checklist

- [ ] `JWT_SECRET` set (at least 32 random bytes)
- [ ] `ADVISOR_PASSWORD` set to a strong password (share with advisors separately)
- [ ] `HUBSPOT_API_KEY` set (private app token with correct scopes)
- [ ] `DATABASE_URL` points to production Postgres
- [ ] `DB_SSL=true` if Postgres requires SSL
- [ ] `CORS_ORIGINS` set to the deployed frontend URL only
- [ ] `npm run migrate` run against production DB
- [ ] `npm run seed` run against production DB
- [ ] `/api/health` returns `200 ok` from production
- [ ] Frontend `VITE_API_BASE_URL` set to backend URL and rebuilt
- [ ] HubSpot embed deployed (`hs project upload` in `hubspot-app/`)
- [ ] HubSpot contact record layout updated to show "Sales Hub" tab
- [ ] PAT `github_pat_11CFUUYJI0b…` revoked (was used during build — no longer needed)

---

## Troubleshooting

**`ECONNREFUSED` on startup**  
Postgres isn't running or `DATABASE_URL` is wrong. Check `pg_ctl status`.

**`relation "countries" does not exist`**  
Run `npm run migrate` first.

**`insert or update on table "eligibility_questions" violates foreign key`**  
Seed ran before migrate, or `ELIGIBILITY_DEFS` references a visa ID that  
doesn't exist in the `visas` table. Run `npm run seed` after `migrate`.

**HubSpot note not appearing on contact**  
Check `HUBSPOT_API_KEY` is set and the private app has  
`crm.objects.notes.write` scope. The session is still saved in Postgres  
regardless — no data is lost.

**Frontend shows login screen in demo mode**  
`VITE_API_BASE_URL` is set in the frontend `.env`. Clear it to return to  
mock/demo mode.

**CORS error in browser**  
Add the frontend's origin to `CORS_ORIGINS` in the backend `.env`  
and restart the server.
