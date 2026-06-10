// ══════════════════════════════════════════════════════════════
// LEXIDY SALES HUB — HUBSPOT HELPER
// ══════════════════════════════════════════════════════════════
//
// Server-side HubSpot API calls. The API key NEVER reaches the
// browser — the frontend always goes through these routes.
//
// Env: HUBSPOT_API_KEY (private app token)
// If unset, functions return mock data / no-ops so the backend
// runs locally without HubSpot configured.
//
// ══════════════════════════════════════════════════════════════

const HS_BASE = 'https://api.hubapi.com'

function configured() {
  return Boolean(process.env.HUBSPOT_API_KEY)
}

async function hsFetch(path, options = {}) {
  const res = await fetch(`${HS_BASE}${path}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${process.env.HUBSPOT_API_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`HubSpot ${res.status}: ${body.slice(0, 300)}`)
  }
  return res.json()
}

/**
 * Fetch a contact's basic info.
 * Returns { id, firstName, lastName, email } or null if not found.
 */
export async function fetchContact(contactId) {
  if (!configured()) {
    console.warn('[hubspot] No API key — returning mock contact')
    return { id: contactId, firstName: 'Test', lastName: 'Lead', email: 'test@example.com', _mock: true }
  }
  try {
    const data = await hsFetch(
      `/crm/v3/objects/contacts/${encodeURIComponent(contactId)}?properties=firstname,lastname,email`
    )
    return {
      id: data.id,
      firstName: data.properties.firstname || '',
      lastName: data.properties.lastname || '',
      email: data.properties.email || '',
    }
  } catch (err) {
    if (String(err.message).includes('404')) return null
    throw err
  }
}

/**
 * Create a note on a contact record.
 * associationTypeId 202 = note → contact (HubSpot-defined).
 * Returns the note ID, or null if HubSpot isn't configured.
 */
export async function createContactNote(contactId, noteBody, timestamp) {
  if (!configured()) {
    console.warn('[hubspot] No API key — note not created (logged below)')
    console.log('─'.repeat(50) + '\n' + noteBody + '\n' + '─'.repeat(50))
    return null
  }
  const data = await hsFetch('/crm/v3/objects/notes', {
    method: 'POST',
    body: JSON.stringify({
      properties: {
        hs_note_body: noteBody,
        hs_timestamp: timestamp || new Date().toISOString(),
      },
      associations: [
        {
          to: { id: contactId },
          types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 202 }],
        },
      ],
    }),
  })
  return data.id
}
