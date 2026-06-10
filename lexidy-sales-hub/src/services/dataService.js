// ══════════════════════════════════════════════════════════════
// LEXIDY SALES HUB — DATA SERVICE
// ══════════════════════════════════════════════════════════════
//
// This is the ONLY file that talks to the outside world.
//
// TWO MODES (switched by VITE_API_BASE_URL):
//
//   LIVE MODE  — VITE_API_BASE_URL is set:
//     All functions call the backend in /backend of this repo
//     (Postgres catalog, DB-driven eligibility, HubSpot notes).
//
//   MOCK MODE  — VITE_API_BASE_URL is unset:
//     Original demo behavior: mockData.js + localStorage.
//     Used for local development and stakeholder demos.
//
// ══════════════════════════════════════════════════════════════

import { COUNTRIES, ELIG_DEFS } from '../data/mockData.js'
import { api, isApiMode } from './apiClient.js'

const STORAGE_KEY = 'lexidy_admin_data_v1'

// ── COUNTRIES & VISAS ─────────────────────────────────────────

/**
 * Fetch all countries and their visas.
 * LIVE: GET /api/countries
 */
export async function fetchCountries() {
  if (isApiMode()) {
    const data = await api('/api/countries')
    return data.countries
  }

  // MOCK: apply admin overrides from localStorage
  const overrides = _loadAdminOverrides()
  if (overrides?.countries) {
    overrides.countries.forEach(savedCountry => {
      const country = COUNTRIES.find(c => c.id === savedCountry.id)
      if (country) {
        savedCountry.visas.forEach(savedVisa => {
          const visa = country.visas.find(v => v.id === savedVisa.id)
          if (visa) Object.assign(visa, savedVisa)
        })
      }
    })
  }
  return COUNTRIES
}

/**
 * Fetch a single visa's full data (packages, features, addons, notes).
 * LIVE: GET /api/visas/:visaId
 */
export async function fetchVisa(visaId) {
  if (isApiMode()) {
    try {
      return await api(`/api/visas/${encodeURIComponent(visaId)}`)
    } catch {
      return null
    }
  }

  const countries = await fetchCountries()
  for (const country of countries) {
    const visa = country.visas.find(v => v.id === visaId)
    if (visa) return { visa, country }
  }
  return null
}

// ── ELIGIBILITY QUESTIONS ─────────────────────────────────────

/**
 * Fetch eligibility questions for a visa.
 * Passes current answers so branching logic can show/hide questions.
 * LIVE: POST /api/eligibility-questions/:visaId  { answers }
 */
export async function fetchEligibilityQuestions(visaId, answers = {}) {
  if (isApiMode()) {
    const data = await api(`/api/eligibility-questions/${encodeURIComponent(visaId)}`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    })
    return data.questions
  }

  // MOCK: admin overrides, then built-in functions
  const overrides = _loadAdminOverrides()
  if (overrides?.eligOverrides?.[visaId]) {
    return overrides.eligOverrides[visaId]
  }
  const def = ELIG_DEFS[visaId]
  if (!def) return []
  return def(answers)
}

// ── ELIGIBILITY SUBMIT ────────────────────────────────────────

/**
 * Submit eligibility test results.
 * LIVE: POST /api/sessions/eligibility → Postgres + HubSpot note
 */
export async function submitEligibilityResult(payload) {
  if (isApiMode()) {
    return api('/api/sessions/eligibility', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  console.log('📤 [MOCK] Eligibility result — would send to HubSpot:', payload)
  await _delay(200)
  return { success: true, sessionId: 'mock_' + Date.now() }
}

// ── PRICING SUBMIT ────────────────────────────────────────────

/**
 * Submit pricing/package decision.
 * LIVE: POST /api/sessions/pricing → Postgres + HubSpot note
 */
export async function submitPricingDecision(payload) {
  if (isApiMode()) {
    return api('/api/sessions/pricing', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  console.log('📤 [MOCK] Pricing decision — would send to HubSpot:', payload)
  await _delay(200)
  return { success: true, sessionId: 'mock_' + Date.now() }
}

// ── CONTACT FETCH ─────────────────────────────────────────────

/**
 * Fetch contact info from HubSpot by contactId.
 * LIVE: GET /api/contacts/:contactId (backend proxies HubSpot —
 * the API key never reaches the browser).
 */
export async function fetchContact(contactId) {
  if (!contactId || contactId === 'TEST_CONTACT') {
    return {
      id: 'TEST_CONTACT',
      firstName: 'Test',
      lastName: 'Lead',
      email: 'test@example.com',
    }
  }

  if (isApiMode()) {
    try {
      const data = await api(`/api/contacts/${encodeURIComponent(contactId)}`)
      return data.contact
    } catch {
      return null
    }
  }

  console.log('📥 [MOCK] Would fetch contact from HubSpot:', contactId)
  return null
}

// ── ADMIN: SAVE / LOAD ────────────────────────────────────────

/**
 * Save admin panel changes.
 * LIVE: POST /api/admin/save → Postgres (all advisors see changes)
 */
export async function saveAdminData(data) {
  if (isApiMode()) {
    try {
      return await api('/api/admin/save', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    } catch (e) {
      return { success: false, error: e.message }
    }
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return { success: true }
  } catch (e) {
    console.error('Admin save failed:', e)
    return { success: false, error: e.message }
  }
}

/**
 * Reset all admin changes back to defaults.
 * LIVE: re-runs `npm run seed` on the server — out of scope for the
 * UI, so this only clears local overrides in mock mode.
 */
export async function resetAdminData() {
  localStorage.removeItem(STORAGE_KEY)
  return { success: true }
}

// ── INTERNAL HELPERS ──────────────────────────────────────────

function _loadAdminOverrides() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

function _delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
