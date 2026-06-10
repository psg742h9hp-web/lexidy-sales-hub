// ══════════════════════════════════════════════════════════════
// LEXIDY SALES HUB — API CLIENT
// ══════════════════════════════════════════════════════════════
//
// Talks to the backend in /backend of this repo.
//
// MODE SWITCH:
//   VITE_API_BASE_URL set   → live API mode (Postgres + HubSpot)
//   VITE_API_BASE_URL unset → mock mode (mockData.js + localStorage)
//
// Auth: advisor password → 12h JWT, kept in sessionStorage so a
// browser refresh inside HubSpot doesn't re-prompt.
//
// ══════════════════════════════════════════════════════════════

const BASE = import.meta.env.VITE_API_BASE_URL || ''
const TOKEN_KEY = 'lexidy_hub_jwt'

export function isApiMode() {
  return Boolean(BASE)
}

export function getToken() {
  try { return sessionStorage.getItem(TOKEN_KEY) } catch { return null }
}

export function clearToken() {
  try { sessionStorage.removeItem(TOKEN_KEY) } catch { /* noop */ }
}

/**
 * Exchange the advisor password for a JWT.
 * Returns true on success, throws Error with message on failure.
 */
export async function login(password, advisorName) {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password, advisorName }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Login failed')
  try { sessionStorage.setItem(TOKEN_KEY, data.token) } catch { /* noop */ }
  return true
}

/**
 * Authenticated fetch against the backend.
 * On 401 (expired/invalid token), clears the token and notifies the
 * app so the login gate re-appears.
 */
export async function api(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
      ...options.headers,
    },
  })

  if (res.status === 401) {
    clearToken()
    window.dispatchEvent(new Event('lexidy:auth-expired'))
    throw new Error('Session expired — please log in again')
  }

  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `API error ${res.status}`)
  return data
}
