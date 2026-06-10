// ══════════════════════════════════════════════════════════════
// ROUTE: /api/sessions
// ══════════════════════════════════════════════════════════════
//
// Logs eligibility results and pricing decisions:
//   1. Stores the full payload in the sessions table (audit trail)
//   2. Creates a formatted note on the HubSpot contact record
//
// Spec: API_CONTRACT.md §3 + §4
//
// If HubSpot isn't configured, the session is still saved locally
// and the note body is logged to console — no data loss.
//
// ══════════════════════════════════════════════════════════════

import { Router } from 'express'
import crypto from 'crypto'
import { query } from '../db.js'
import { createContactNote } from '../lib/hubspot.js'

const router = Router()

const newSessionId = () => 'session_' + crypto.randomBytes(8).toString('hex')
const euro = (n) => '€' + Number(n || 0).toLocaleString('en-US')

// ── NOTE FORMATTERS ───────────────────────────────────────────

function eligibilityNote(p) {
  const lines = [
    `ELIGIBILITY TEST — ${p.country || ''} ${p.visaLabel || p.visaId}`.trim(),
    `Result: ${String(p.result || '').toUpperCase()}`,
    '',
    'Answers:',
  ]
  for (const a of p.answers || []) {
    lines.push(`- ${a.question}: ${a.answer}`)
  }
  lines.push('', `Logged via Lexidy Sales Hub`)
  return lines.join('\n')
}

function pricingNote(p) {
  const lines = [
    `PRICING DECISION — ${p.country || ''} ${p.visaLabel || p.visaId}`.trim(),
    `Package: ${p.package} (${euro(p.packagePrice)})`,
    `Family members: ${p.familyMembers ?? 0} | Children: ${p.children ?? 0}`,
  ]
  if (p.addons?.length) {
    lines.push('', 'Add-ons:')
    for (const a of p.addons) lines.push(`- ${a.name}: ${euro(a.price)}`)
  }
  lines.push('', `TOTAL ESTIMATE: ${euro(p.totalEstimate)}`, '', `Logged via Lexidy Sales Hub`)
  return lines.join('\n')
}

// ── SHARED HANDLER ────────────────────────────────────────────

async function logSession(type, noteBuilder, req, res) {
  const p = req.body || {}
  if (!p.contactId) return res.status(400).json({ error: 'contactId is required' })

  const sessionId = newSessionId()
  let hubspotNoteId = null
  let hubspotError = null

  try {
    hubspotNoteId = await createContactNote(p.contactId, noteBuilder(p), p.timestamp)
  } catch (err) {
    // Session is still recorded locally — surface the HubSpot failure but don't lose data
    hubspotError = err.message
    console.error(`HubSpot note failed (${type}):`, err.message)
  }

  try {
    await query(
      `INSERT INTO sessions (session_id, contact_id, visa_id, type, result, hubspot_note_id)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [sessionId, String(p.contactId), p.visaId || null, type, JSON.stringify(p), hubspotNoteId]
    )
  } catch (err) {
    console.error(`Session insert failed (${type}):`, err.message)
    return res.status(500).json({ error: 'Failed to save session' })
  }

  res.json({ success: true, sessionId, ...(hubspotError ? { hubspotSynced: false } : {}) })
}

// POST /api/sessions/eligibility
router.post('/eligibility', (req, res) => logSession('eligibility', eligibilityNote, req, res))

// POST /api/sessions/pricing
router.post('/pricing', (req, res) => logSession('pricing', pricingNote, req, res))

export default router
