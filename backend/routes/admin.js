// ══════════════════════════════════════════════════════════════
// ROUTE: /api/admin
// ══════════════════════════════════════════════════════════════
//
// Powers the Admin Panel:
//   GET  /api/admin/data  → current catalog + eligibility questions
//   POST /api/admin/save  → persist edits (visas, packages, addons,
//                           eligibility questions)
//
// Spec: API_CONTRACT.md §5 + §6
//
// Eligibility save semantics: eligOverrides[visaId] REPLACES that
// visa's full question set (delete + insert in one transaction).
// Declarative fields (showIf, thresholdRule, ...) are preserved
// when the admin payload includes them.
//
// ══════════════════════════════════════════════════════════════

import { Router } from 'express'
import { pool, query } from '../db.js'

const router = Router()

// ── GET /api/admin/data ───────────────────────────────────────

router.get('/data', async (req, res) => {
  try {
    const [countries, visas, packages, addons, questions] = await Promise.all([
      query('SELECT * FROM countries ORDER BY sort_order'),
      query('SELECT * FROM visas ORDER BY sort_order'),
      query('SELECT * FROM visa_packages ORDER BY sort_order'),
      query('SELECT * FROM visa_addons ORDER BY sort_order'),
      query('SELECT * FROM eligibility_questions ORDER BY visa_id, sort_order'),
    ])

    const visaMap = {}
    for (const v of visas.rows) {
      visaMap[v.id] = {
        id: v.id, label: v.label, active: v.active,
        timeline: v.timeline, notes: v.notes,
        countryId: v.country_id, packages: {}, features: {}, addons: [],
      }
    }
    for (const p of packages.rows) {
      const visa = visaMap[p.visa_id]; if (!visa) continue
      visa.packages[p.tier] = {
        price: p.price, familyMember: p.family_member_price,
        child: p.child_price, priceNote: p.price_note,
      }
      visa.features[p.tier] = p.features || []
    }
    for (const a of addons.rows) {
      visaMap[a.visa_id]?.addons.push({ id: a.addon_id, name: a.name, desc: a.description, price: a.price })
    }

    const countriesOut = countries.rows.map(c => ({
      id: c.id, flag: c.flag, name: c.name,
      visas: Object.values(visaMap).filter(v => v.countryId === c.id).map(({ countryId, ...v }) => v),
    }))

    const eligOverrides = {}
    for (const q of questions.rows) {
      ;(eligOverrides[q.visa_id] ||= []).push({
        id: q.question_id, label: q.label, type: q.type, required: q.required,
        ...(q.options ? { options: q.options } : {}),
        ...(q.hint ? { hint: q.hint } : {}),
        ...(q.threshold != null ? { threshold: q.threshold } : {}),
        ...(q.disqualify_if ? { disqualifyIf: q.disqualify_if } : {}),
        ...(q.disqualify_msg ? { disqualifyMsg: q.disqualify_msg } : {}),
        ...(q.review_if ? { reviewIf: q.review_if } : {}),
        ...(q.review_msg ? { reviewMsg: q.review_msg } : {}),
        ...(q.disqualify_below ? { disqualifyBelow: true } : {}),
        ...(q.review_below ? { reviewBelow: true } : {}),
        ...(q.show_if ? { showIf: q.show_if } : {}),
        ...(q.threshold_rule ? { thresholdRule: q.threshold_rule } : {}),
        ...(q.disqualify_below_if ? { disqualifyBelowIf: q.disqualify_below_if } : {}),
        ...(q.review_below_if ? { reviewBelowIf: q.review_below_if } : {}),
        ...(q.meta ? { meta: q.meta } : {}),
      })
    }

    res.json({ countries: countriesOut, eligOverrides })
  } catch (err) {
    console.error('Admin data load failed:', err.message)
    res.status(500).json({ error: 'Failed to load admin data' })
  }
})

// ── POST /api/admin/save ──────────────────────────────────────

router.post('/save', async (req, res) => {
  const { countries, eligOverrides } = req.body || {}
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    // Visa-level edits: label, timeline, notes, active, packages, addons
    for (const c of countries || []) {
      for (const v of c.visas || []) {
        await client.query(
          `UPDATE visas SET
             label = COALESCE($2, label),
             timeline = COALESCE($3, timeline),
             notes = COALESCE($4, notes),
             active = COALESCE($5, active),
             updated_at = NOW()
           WHERE id = $1`,
          [v.id, v.label ?? null, v.timeline ?? null, v.notes ?? null,
           typeof v.active === 'boolean' ? v.active : null]
        )

        if (v.packages) {
          let i = 0
          for (const [tier, pkg] of Object.entries(v.packages)) {
            if (!pkg) {
              await client.query('DELETE FROM visa_packages WHERE visa_id = $1 AND tier = $2', [v.id, tier])
              continue
            }
            await client.query(
              `INSERT INTO visa_packages
                 (visa_id, tier, price, family_member_price, child_price, price_note, features, sort_order)
               VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
               ON CONFLICT (visa_id, tier) DO UPDATE SET
                 price = EXCLUDED.price, family_member_price = EXCLUDED.family_member_price,
                 child_price = EXCLUDED.child_price, price_note = EXCLUDED.price_note,
                 features = EXCLUDED.features, sort_order = EXCLUDED.sort_order, updated_at = NOW()`,
              [v.id, tier, pkg.price ?? 0, pkg.familyMember ?? null, pkg.child ?? null,
               pkg.priceNote || null, JSON.stringify(v.features?.[tier] || []), i++]
            )
          }
        }

        if (Array.isArray(v.addons)) {
          await client.query('DELETE FROM visa_addons WHERE visa_id = $1', [v.id])
          for (const [i, a] of v.addons.entries()) {
            await client.query(
              `INSERT INTO visa_addons (visa_id, addon_id, name, description, price, sort_order)
               VALUES ($1,$2,$3,$4,$5,$6)`,
              [v.id, a.id, a.name, a.desc || a.description || null, a.price ?? 0, i]
            )
          }
        }
      }
    }

    // Eligibility edits: full replace per visa
    for (const [visaId, qs] of Object.entries(eligOverrides || {})) {
      await client.query('DELETE FROM eligibility_questions WHERE visa_id = $1', [visaId])
      for (const [i, q] of (qs || []).entries()) {
        await client.query(
          `INSERT INTO eligibility_questions
             (visa_id, question_id, label, type, required, options, hint, threshold,
              disqualify_if, disqualify_msg, review_if, review_msg,
              disqualify_below, review_below, show_if, threshold_rule,
              disqualify_below_if, review_below_if, meta, sort_order)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)`,
          [visaId, q.id, q.label, q.type, q.required === true,
           q.options ? JSON.stringify(q.options) : null,
           q.hint || null, q.threshold ?? null,
           q.disqualifyIf || null, q.disqualifyMsg || null,
           q.reviewIf || null, q.reviewMsg || null,
           q.disqualifyBelow === true, q.reviewBelow === true,
           q.showIf ? JSON.stringify(q.showIf) : null,
           q.thresholdRule ? JSON.stringify(q.thresholdRule) : null,
           q.disqualifyBelowIf ? JSON.stringify(q.disqualifyBelowIf) : null,
           q.reviewBelowIf ? JSON.stringify(q.reviewBelowIf) : null,
           q.meta ? JSON.stringify(q.meta) : null, i]
        )
      }
    }

    await client.query('COMMIT')
    res.json({ success: true })
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('Admin save failed:', err.message)
    res.status(500).json({ error: 'Failed to save admin data' })
  } finally {
    client.release()
  }
})

export default router
