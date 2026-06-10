// ══════════════════════════════════════════════════════════════
// ROUTES: /api/countries  +  /api/visas
// ══════════════════════════════════════════════════════════════
//
// Serves the country/visa catalog from Postgres in the EXACT
// shape the frontend's mockData.js used, so dataService.js can
// swap fetch sources with zero component changes:
//
//   country: { id, flag, name, visas: [...] }
//   visa:    { id, label, active, notes, timeline,
//              packages: { bronze: { price, familyMember, child, priceNote }, ... },
//              features: { bronze: [...], ... },
//              addons:   [{ id, name, desc, price }] }
//
// ══════════════════════════════════════════════════════════════

import { Router } from 'express'
import { query } from '../db.js'

// ── SHARED LOADER ─────────────────────────────────────────────

async function loadCatalog() {
  const [countries, visas, packages, addons] = await Promise.all([
    query('SELECT * FROM countries ORDER BY sort_order'),
    query('SELECT * FROM visas ORDER BY sort_order'),
    query('SELECT * FROM visa_packages ORDER BY sort_order'),
    query('SELECT * FROM visa_addons ORDER BY sort_order'),
  ])

  const visasByCountry = {}
  const visaById = {}

  for (const v of visas.rows) {
    const visa = {
      id: v.id,
      label: v.label,
      active: v.active,
      ...(v.notes ? { notes: v.notes } : {}),
      ...(v.timeline ? { timeline: v.timeline } : {}),
    }
    visaById[v.id] = visa
    ;(visasByCountry[v.country_id] ||= []).push(visa)
  }

  for (const p of packages.rows) {
    const visa = visaById[p.visa_id]
    if (!visa) continue
    visa.packages ||= {}
    visa.features ||= {}
    visa.packages[p.tier] = {
      price: p.price,
      ...(p.family_member_price != null ? { familyMember: p.family_member_price } : {}),
      ...(p.child_price != null ? { child: p.child_price } : {}),
      ...(p.price_note ? { priceNote: p.price_note } : {}),
    }
    visa.features[p.tier] = p.features || []
  }

  for (const a of addons.rows) {
    const visa = visaById[a.visa_id]
    if (!visa) continue
    ;(visa.addons ||= []).push({
      id: a.addon_id,
      name: a.name,
      ...(a.description ? { desc: a.description } : {}),
      price: a.price,
    })
  }

  return countries.rows.map(c => ({
    id: c.id,
    flag: c.flag,
    name: c.name,
    visas: visasByCountry[c.id] || [],
  }))
}

// ── /api/countries ────────────────────────────────────────────

const countriesRouter = Router()

// GET /api/countries
countriesRouter.get('/', async (req, res) => {
  try {
    res.json({ countries: await loadCatalog() })
  } catch (err) {
    console.error('Countries load failed:', err.message)
    res.status(500).json({ error: 'Failed to load countries' })
  }
})

// ── /api/visas ────────────────────────────────────────────────

const visasRouter = Router()

// GET /api/visas/:visaId
visasRouter.get('/:visaId', async (req, res) => {
  try {
    const catalog = await loadCatalog()
    for (const country of catalog) {
      const visa = country.visas.find(v => v.id === req.params.visaId)
      if (visa) return res.json({ visa, country: { id: country.id, flag: country.flag, name: country.name } })
    }
    res.status(404).json({ error: 'Visa not found' })
  } catch (err) {
    console.error('Visa load failed:', err.message)
    res.status(500).json({ error: 'Failed to load visa' })
  }
})

export default { countries: countriesRouter, visas: visasRouter }
