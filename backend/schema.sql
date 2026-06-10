-- ══════════════════════════════════════════════════════════════
-- LEXIDY SALES HUB — DATABASE SCHEMA
-- ══════════════════════════════════════════════════════════════
--
-- Apply with:  npm run migrate
-- Idempotent:  safe to run multiple times.
--
-- Structure mirrors API_CONTRACT.md's suggested schema, plus
-- countries/visas tables to serve GET /api/countries.
--
-- ══════════════════════════════════════════════════════════════

-- ── COUNTRIES ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS countries (
  id          VARCHAR(10) PRIMARY KEY,      -- 'es', 'pt', 'gr', 'fr', 'it', 'mx'
  name        VARCHAR(100) NOT NULL,        -- 'Spain'
  flag        VARCHAR(10),                  -- emoji flag
  sort_order  INTEGER DEFAULT 0,
  active      BOOLEAN DEFAULT TRUE,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── VISAS ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS visas (
  id          VARCHAR(50) PRIMARY KEY,      -- 'es-dnv-freelancer'
  country_id  VARCHAR(10) NOT NULL REFERENCES countries(id),
  label       VARCHAR(200) NOT NULL,        -- 'Digital Nomad Visa — Freelancer'
  active      BOOLEAN DEFAULT TRUE,
  notes       TEXT,                          -- advisor-facing notes
  timeline    TEXT,                          -- e.g. '2-3 months'
  sort_order  INTEGER DEFAULT 0,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_visas_country ON visas(country_id);

-- ── VISA PACKAGES (pricing tiers) ─────────────────────────────

CREATE TABLE IF NOT EXISTS visa_packages (
  id                  SERIAL PRIMARY KEY,
  visa_id             VARCHAR(50) NOT NULL REFERENCES visas(id) ON DELETE CASCADE,
  tier                VARCHAR(20) NOT NULL,   -- 'bronze' | 'silver' | 'gold' | 'platinum'
  price               INTEGER NOT NULL,       -- base price in euros
  family_member_price INTEGER,                -- nullable
  child_price         INTEGER,                -- nullable
  price_note          VARCHAR(50),            -- e.g. '+IVA'
  features            JSONB DEFAULT '[]',     -- array of feature strings
  sort_order          INTEGER DEFAULT 0,
  updated_at          TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (visa_id, tier)
);

-- ── VISA ADDONS ───────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS visa_addons (
  id          SERIAL PRIMARY KEY,
  visa_id     VARCHAR(50) NOT NULL REFERENCES visas(id) ON DELETE CASCADE,
  addon_id    VARCHAR(50) NOT NULL,           -- 'tax-consultation'
  name        VARCHAR(200) NOT NULL,
  description VARCHAR(500),
  price       INTEGER NOT NULL,
  sort_order  INTEGER DEFAULT 0,
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (visa_id, addon_id)
);

-- ── ELIGIBILITY QUESTIONS ─────────────────────────────────────
-- Branching logic (show/hide based on previous answers) is stored
-- in show_if as JSONB: { "questionId": "expectedValue" }.
-- NULL show_if = always shown.

CREATE TABLE IF NOT EXISTS eligibility_questions (
  id               SERIAL PRIMARY KEY,
  visa_id          VARCHAR(50) NOT NULL REFERENCES visas(id) ON DELETE CASCADE,
  question_id      VARCHAR(50) NOT NULL,      -- 'monthly_income'
  label            VARCHAR(500) NOT NULL,
  type             VARCHAR(20) NOT NULL,      -- text|number|currency|yesno|select|info
  required         BOOLEAN DEFAULT TRUE,
  options          JSONB,                     -- for type 'select'
  hint             VARCHAR(500),
  threshold        INTEGER,                   -- for type 'currency'
  disqualify_if    VARCHAR(10),               -- 'Yes' | 'No'
  disqualify_msg   VARCHAR(500),
  review_if        VARCHAR(10),               -- 'Yes' | 'No'
  review_msg       VARCHAR(500),
  disqualify_below BOOLEAN DEFAULT FALSE,
  review_below     BOOLEAN DEFAULT FALSE,
  show_if          JSONB,                     -- branching condition
  sort_order       INTEGER DEFAULT 0,
  updated_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (visa_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_elig_visa ON eligibility_questions(visa_id);

-- ── SESSIONS (eligibility results + pricing decisions) ────────

CREATE TABLE IF NOT EXISTS sessions (
  session_id  VARCHAR(50) PRIMARY KEY,        -- generated: 'sess_' + timestamp + random
  contact_id  VARCHAR(50) NOT NULL,           -- HubSpot contact ID
  visa_id     VARCHAR(50),
  type        VARCHAR(20) NOT NULL,           -- 'eligibility' | 'pricing'
  result      JSONB NOT NULL,                 -- full payload (answers / package / addons / totals)
  hubspot_note_id VARCHAR(50),                -- ID of the note created in HubSpot (null if failed)
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_contact ON sessions(contact_id);
CREATE INDEX IF NOT EXISTS idx_sessions_type ON sessions(type);
