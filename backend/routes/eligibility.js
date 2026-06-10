// ══════════════════════════════════════════════════════════════
// ROUTE: /api/eligibility-questions
// ══════════════════════════════════════════════════════════════
//
// Loads declarative question definitions from Postgres and runs
// them through lib/eligibilityEngine.js — branching (show_if) and
// computed thresholds (threshold_rule) are evaluated server-side
// against the advisor's current answers.
//
// Spec: API_CONTRACT.md §2
//
// ══════════════════════════════════════════════════════════════

import { Router } from 'express'
import { query } from '../db.js'
import { buildQuestions } from '../lib/eligibilityEngine.js'

const router = Router()

function rowToDef(r) {
  return {
    id: r.question_id,
    label: r.label,
    type: r.type,
    required: r.required,
    options: r.options || undefined,
    hint: r.hint || undefined,
    threshold: r.threshold ?? undefined,
    thresholdRule: r.threshold_rule || undefined,
    showIf: r.show_if || undefined,
    disqualifyIf: r.disqualify_if || undefined,
    disqualifyMsg: r.disqualify_msg || undefined,
    reviewIf: r.review_if || undefined,
    reviewMsg: r.review_msg || undefined,
    disqualifyBelow: r.disqualify_below,
    reviewBelow: r.review_below,
    disqualifyBelowIf: r.disqualify_below_if || undefined,
    reviewBelowIf: r.review_below_if || undefined,
    meta: r.meta || undefined,
  }
}

// POST /api/eligibility-questions/:visaId   { answers: {...} }
router.post('/:visaId', async (req, res) => {
  try {
    const { rows } = await query(
      'SELECT * FROM eligibility_questions WHERE visa_id = $1 ORDER BY sort_order',
      [req.params.visaId]
    )
    if (rows.length === 0) return res.json({ questions: [] })

    const answers = (req.body && req.body.answers) || {}
    const questions = buildQuestions(rows.map(rowToDef), answers)
    res.json({ questions })
  } catch (err) {
    console.error('Eligibility questions failed:', err.message)
    res.status(500).json({ error: 'Failed to load eligibility questions' })
  }
})

export default router
