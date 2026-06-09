// ══════════════════════════════════════════════════════════════
// LEXIDY SALES HUB — DATA SERVICE
// ══════════════════════════════════════════════════════════════
//
// This is the ONLY file that talks to the outside world.
// Right now it returns mock data from mockData.js.
//
// When Kevin's backend is ready, replace each mock function
// with a real fetch() call to his API endpoints.
//
// SEARCH FOR: "// → REPLACE WITH KEVIN'S API"
// Each one shows the exact endpoint and request shape Kevin needs.
//
// ══════════════════════════════════════════════════════════════

import { COUNTRIES, ELIG_DEFS } from './mockData.js'

const STORAGE_KEY = 'lexidy_admin_data_v1'

// ── COUNTRIES & VISAS ─────────────────────────────────────────

/**
 * Fetch all countries and their visas.
 * Used to build the hub landing page.
 *
 * → REPLACE WITH KEVIN'S API:
 *   GET /api/countries
 *   Response: { countries: [...] }
 */
export async function fetchCountries() {
  // Load any admin overrides from localStorage
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
 *
 * → REPLACE WITH KEVIN'S API:
 *   GET /api/visas/:visaId
 *   Response: { visa: { id, label, packages, features, addons, notes, timeline } }
 */
export async function fetchVisa(visaId) {
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
 *
 * → REPLACE WITH KEVIN'S API:
 *   POST /api/eligibility-questions/:visaId
 *   Body: { answers: { questionId: value, ... } }
 *   Response: { questions: [...] }
 *
 *   Question shape:
 *   {
 *     id: string,
 *     label: string,
 *     type: 'text' | 'number' | 'currency' | 'yesno' | 'select' | 'info',
 *     required: boolean,
 *     options?: string[],        // for type: 'select'
 *     hint?: string,
 *     threshold?: number,        // for type: 'currency'
 *     disqualifyIf?: string,     // 'Yes' | 'No'
 *     disqualifyMsg?: string,
 *     reviewIf?: string,         // 'Yes' | 'No'
 *     reviewMsg?: string,
 *     disqualifyBelow?: boolean, // for currency threshold
 *     reviewBelow?: boolean,
 *   }
 */
export async function fetchEligibilityQuestions(visaId, answers = {}) {
  // Check for admin overrides first (from Admin Panel edits)
  const overrides = _loadAdminOverrides()
  if (overrides?.eligOverrides?.[visaId]) {
    return overrides.eligOverrides[visaId]
  }

  // Fall back to built-in eligibility functions
  const def = ELIG_DEFS[visaId]
  if (!def) return []
  return def(answers)
}

// ── ELIGIBILITY SUBMIT ────────────────────────────────────────

/**
 * Submit eligibility test results.
 * In production, this sends to HubSpot via Kevin's backend.
 *
 * → REPLACE WITH KEVIN'S API:
 *   POST /api/sessions/eligibility
 *   Body: {
 *     contactId: string,
 *     visaId: string,
 *     visaLabel: string,
 *     country: string,
 *     result: 'pass' | 'review' | 'fail',
 *     answers: [{ question, answer, stepId }],
 *     timestamp: ISO string
 *   }
 *   Response: { success: true, sessionId: string }
 *
 *   Kevin should then create a HubSpot note/engagement on the contact record.
 */
export async function submitEligibilityResult(payload) {
  console.log('📤 [MOCK] Eligibility result — would send to HubSpot:', payload)
  // Simulate async
  await _delay(200)
  return { success: true, sessionId: 'mock_' + Date.now() }
}

// ── PRICING SUBMIT ────────────────────────────────────────────

/**
 * Submit pricing/package decision.
 * In production, this records the lead's interest in HubSpot.
 *
 * → REPLACE WITH KEVIN'S API:
 *   POST /api/sessions/pricing
 *   Body: {
 *     contactId: string,
 *     visaId: string,
 *     visaLabel: string,
 *     country: string,
 *     package: string,
 *     packagePrice: number,
 *     familyMembers: number,
 *     children: number,
 *     addons: [{ id, name, price }],
 *     totalEstimate: number,
 *     timestamp: ISO string
 *   }
 *   Response: { success: true, sessionId: string }
 *
 *   Kevin should then update the HubSpot contact record with deal interest.
 */
export async function submitPricingDecision(payload) {
  console.log('📤 [MOCK] Pricing decision — would send to HubSpot:', payload)
  await _delay(200)
  return { success: true, sessionId: 'mock_' + Date.now() }
}

// ── CONTACT FETCH ─────────────────────────────────────────────

/**
 * Fetch contact info from HubSpot by contactId.
 * In production, Kevin's backend proxies the HubSpot API call
 * (avoids exposing the API key in the browser).
 *
 * → REPLACE WITH KEVIN'S API:
 *   GET /api/contacts/:contactId
 *   Response: { contact: { id, firstName, lastName, email } }
 *
 *   Kevin's backend calls:
 *   GET https://api.hubapi.com/crm/v3/objects/contacts/:contactId
 *   with Authorization: Bearer {HUBSPOT_API_KEY}
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
  console.log('📥 [MOCK] Would fetch contact from HubSpot:', contactId)
  return null
}

// ── ADMIN: SAVE DATA ──────────────────────────────────────────

/**
 * Save admin panel changes.
 * Currently persists to localStorage.
 *
 * → REPLACE WITH KEVIN'S API:
 *   POST /api/admin/save
 *   Body: { countries: [...], eligOverrides: {...} }
 *   Response: { success: true }
 *
 *   Kevin stores this in his database.
 *   All advisors will see changes on next page load.
 */
export async function saveAdminData(data) {
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
