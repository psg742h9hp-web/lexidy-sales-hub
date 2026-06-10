// ══════════════════════════════════════════════════════════════
// LEXIDY SALES HUB — SEED SCRIPT
// ══════════════════════════════════════════════════════════════
//
// Loads all countries, visas, packages, addons, and eligibility
// questions from the frontend's mockData.js into Postgres.
//
// Run:  npm run seed     (run `npm run migrate` first)
//
// Idempotent — uses upserts, safe to re-run after editing
// mockData.js. Existing rows are updated, not duplicated.
//
// ELIGIBILITY QUESTIONS:
// Seeded from data/eligibilityData.js — the DECLARATIVE conversion
// of mockData.js's branching functions (verified 1:1 equivalent by
// test-equivalence.js). Branching (show_if) and computed thresholds
// (threshold_rule) live in the database, fully editable without
// deploys. Grammar: see lib/eligibilityEngine.js.
//
// ══════════════════════════════════════════════════════════════

import { pool, query } from './db.js'
import { COUNTRIES } from '../lexidy-sales-hub/src/data/mockData.js'
import { ELIGIBILITY_DEFS } from './data/eligibilityData.js'

async function seedCountries() {
  let count = 0
  for (const [i, c] of COUNTRIES.entries()) {
    await query(
      `INSERT INTO countries (id, name, flag, sort_order, active)
       VALUES ($1, $2, $3, $4, TRUE)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name, flag = EXCLUDED.flag,
         sort_order = EXCLUDED.sort_order, updated_at = NOW()`,
      [c.id, c.name, c.flag || null, i]
    )
    count++
  }
  console.log(`  countries: ${count}`)
}

async function seedVisas() {
  let count = 0
  for (const c of COUNTRIES) {
    for (const [i, v] of (c.visas || []).entries()) {
      await query(
        `INSERT INTO visas (id, country_id, label, active, notes, timeline, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO UPDATE SET
           label = EXCLUDED.label, active = EXCLUDED.active,
           notes = EXCLUDED.notes, timeline = EXCLUDED.timeline,
           sort_order = EXCLUDED.sort_order, updated_at = NOW()`,
        [v.id, c.id, v.label, v.active !== false, v.notes || null, v.timeline || null, i]
      )
      count++
    }
  }
  console.log(`  visas: ${count}`)
}

async function seedPackages() {
  let count = 0
  for (const c of COUNTRIES) {
    for (const v of c.visas || []) {
      if (!v.packages) continue
      let i = 0
      for (const [tier, pkg] of Object.entries(v.packages)) {
        if (!pkg) continue // e.g. platinum: null
        const features = v.features?.[tier] || []
        await query(
          `INSERT INTO visa_packages
             (visa_id, tier, price, family_member_price, child_price, price_note, features, sort_order)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (visa_id, tier) DO UPDATE SET
             price = EXCLUDED.price,
             family_member_price = EXCLUDED.family_member_price,
             child_price = EXCLUDED.child_price,
             price_note = EXCLUDED.price_note,
             features = EXCLUDED.features,
             sort_order = EXCLUDED.sort_order,
             updated_at = NOW()`,
          [v.id, tier, pkg.price ?? 0, pkg.familyMember ?? null, pkg.child ?? null,
           pkg.priceNote || null, JSON.stringify(features), i++]
        )
        count++
      }
    }
  }
  console.log(`  packages: ${count}`)
}

async function seedAddons() {
  let count = 0
  for (const c of COUNTRIES) {
    for (const v of c.visas || []) {
      for (const [i, a] of (v.addons || []).entries()) {
        await query(
          `INSERT INTO visa_addons (visa_id, addon_id, name, description, price, sort_order)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (visa_id, addon_id) DO UPDATE SET
             name = EXCLUDED.name, description = EXCLUDED.description,
             price = EXCLUDED.price, sort_order = EXCLUDED.sort_order,
             updated_at = NOW()`,
          [v.id, a.id, a.name, a.desc || a.description || null, a.price ?? 0, i]
        )
        count++
      }
    }
  }
  console.log(`  addons: ${count}`)
}

async function seedEligibilityQuestions() {
  let count = 0
  for (const [visaId, defs] of Object.entries(ELIGIBILITY_DEFS)) {
    for (const [i, q] of defs.entries()) {
      await query(
        `INSERT INTO eligibility_questions
           (visa_id, question_id, label, type, required, options, hint, threshold,
            disqualify_if, disqualify_msg, review_if, review_msg,
            disqualify_below, review_below, show_if, threshold_rule,
            disqualify_below_if, review_below_if, meta, sort_order)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
         ON CONFLICT (visa_id, question_id) DO UPDATE SET
           label = EXCLUDED.label, type = EXCLUDED.type,
           required = EXCLUDED.required, options = EXCLUDED.options,
           hint = EXCLUDED.hint, threshold = EXCLUDED.threshold,
           disqualify_if = EXCLUDED.disqualify_if, disqualify_msg = EXCLUDED.disqualify_msg,
           review_if = EXCLUDED.review_if, review_msg = EXCLUDED.review_msg,
           disqualify_below = EXCLUDED.disqualify_below, review_below = EXCLUDED.review_below,
           show_if = EXCLUDED.show_if, threshold_rule = EXCLUDED.threshold_rule,
           disqualify_below_if = EXCLUDED.disqualify_below_if,
           review_below_if = EXCLUDED.review_below_if,
           meta = EXCLUDED.meta,
           sort_order = EXCLUDED.sort_order, updated_at = NOW()`,
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
      count++
    }
  }
  console.log(`  eligibility questions: ${count}`)
}

async function main() {
  console.log('🌱 Seeding Lexidy Sales Hub database...')
  await seedCountries()
  await seedVisas()
  await seedPackages()
  await seedAddons()
  await seedEligibilityQuestions()
  console.log('✅ Seed complete')
  await pool.end()
}

main().catch((err) => {
  console.error('❌ Seed failed:', err.message)
  process.exit(1)
})
