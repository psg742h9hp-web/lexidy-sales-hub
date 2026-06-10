// ══════════════════════════════════════════════════════════════
// ROUTE: /api/contacts
// ══════════════════════════════════════════════════════════════
//
// Proxies HubSpot contact lookups so the API key stays server-side.
// Spec: API_CONTRACT.md §1
//
// ══════════════════════════════════════════════════════════════

import { Router } from 'express'
import { fetchContact } from '../lib/hubspot.js'

const router = Router()

// GET /api/contacts/:contactId
router.get('/:contactId', async (req, res) => {
  const { contactId } = req.params

  // Frontend test mode
  if (contactId === 'TEST_CONTACT') {
    return res.json({
      contact: { id: 'TEST_CONTACT', firstName: 'Test', lastName: 'Lead', email: 'test@example.com' },
    })
  }

  try {
    const contact = await fetchContact(contactId)
    if (!contact) return res.status(404).json({ error: 'Contact not found' })
    res.json({ contact })
  } catch (err) {
    console.error('Contact fetch failed:', err.message)
    res.status(502).json({ error: 'HubSpot contact fetch failed' })
  }
})

export default router
