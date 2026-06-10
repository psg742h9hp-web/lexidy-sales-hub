// ══════════════════════════════════════════════════════════════
// LEXIDY SALES HUB — ELIGIBILITY ENGINE
// ══════════════════════════════════════════════════════════════
//
// Pure functions that turn DECLARATIVE question definitions
// (stored in Postgres) into the question list the frontend
// renders — including branching and computed thresholds.
//
// This replaces the hardcoded JS functions in the frontend's
// mockData.js. All editable from the database, zero deploys.
//
// ── SHOW_IF GRAMMAR ──────────────────────────────────────────
// Decides whether a question is visible given current answers.
//
//   { "employment_type": "Retired" }              equality (multiple keys = AND)
//   { "retired": { "not": "Yes" } }               not equal (matches unanswered too)
//   { "child_count": { "gt": 0 } }                numeric >  (also: gte, lt, lte)
//   { "income_type": { "answered": true } }       answered & not '' / 'Select...'
//   { "monthly_funds": { "belowThresholdOf": "monthly_funds" } }
//                                                  numeric answer < computed threshold
//                                                  of the referenced question
//   { "all": [cond, cond] }                       explicit AND of conditions
//   { "any": [cond, cond] }                       OR of conditions
//
// ── THRESHOLD_RULE GRAMMAR ───────────────────────────────────
// Computes a € threshold from current answers.
//
//   { "type": "fixed", "value": 29000 }
//
//   { "type": "familyTiered", "base": 2650, "firstFamily": 995,
//     "perAdditional": 335, "familyField": "family_count" }
//       → base + (fam>0 ? firstFamily : 0) + max(fam-1,0)*perAdditional
//
//   { "type": "perFamily", "base": 3480, "perFamily": 435,
//     "familyField": "family_count" }
//       → base + fam * perFamily
//
//   { "type": "pctMultiplier", "base": 2000, "round": "ceil", "factors": [
//       { "field": "has_spouse", "equals": "Yes", "pct": 0.20 },
//       { "field": "child_count", "perUnit": true, "pct": 0.15 } ] }
//       → base * (1 + sum of active factor pcts)
//
//   { "type": "byAnswer", "field": "employment_status",
//     "map": { "Employee or Self-Employed (remote)": 1353 }, "default": 1425 }
//
// Labels and messages may contain "{threshold}" — replaced with
// the computed threshold, locale-formatted (e.g. "2,650").
//
// ══════════════════════════════════════════════════════════════

const UNANSWERED = (v) => v === undefined || v === null || v === '' || v === 'Select...'

// ── THRESHOLD COMPUTATION ─────────────────────────────────────

export function computeThreshold(rule, answers) {
  if (!rule) return null
  const num = (field) => parseInt(answers[field]) || 0

  switch (rule.type) {
    case 'fixed':
      return rule.value

    case 'familyTiered': {
      const fam = num(rule.familyField || 'family_count')
      return rule.base
        + (fam > 0 ? (rule.firstFamily || 0) : 0)
        + Math.max(fam - 1, 0) * (rule.perAdditional || 0)
    }

    case 'perFamily': {
      const fam = num(rule.familyField || 'family_count')
      return rule.base + fam * (rule.perFamily || 0)
    }

    case 'pctMultiplier': {
      let pct = 0
      for (const f of rule.factors || []) {
        if (f.perUnit) pct += num(f.field) * f.pct
        else if (answers[f.field] === f.equals) pct += f.pct
      }
      const raw = rule.base * (1 + pct)
      return rule.round === 'ceil' ? Math.ceil(raw) : Math.round(raw)
    }

    case 'byAnswer': {
      const v = answers[rule.field]
      return (rule.map && v in rule.map) ? rule.map[v] : rule.default
    }

    default:
      return null
  }
}

// ── CONDITION MATCHING ────────────────────────────────────────

function matchField(value, matcher, ctx) {
  if (matcher === null || matcher === undefined) return true
  if (typeof matcher !== 'object') return value === matcher

  if ('not' in matcher) return value !== matcher.not
  if ('in' in matcher) return matcher.in.includes(value)
  if ('answered' in matcher) return matcher.answered ? !UNANSWERED(value) : UNANSWERED(value)

  const n = parseFloat(value)
  if ('gt' in matcher) return !isNaN(n) && n > matcher.gt
  if ('gte' in matcher) return !isNaN(n) && n >= matcher.gte
  if ('lt' in matcher) return !isNaN(n) && n < matcher.lt
  if ('lte' in matcher) return !isNaN(n) && n <= matcher.lte

  if ('belowThresholdOf' in matcher) {
    const ref = ctx.questionsById[matcher.belowThresholdOf]
    if (!ref) return false
    const threshold = computeThreshold(ref.thresholdRule, ctx.answers)
    return !isNaN(n) && n > 0 && threshold !== null && n < threshold
  }

  return false
}

export function evaluateCondition(cond, answers, ctx) {
  if (!cond) return true

  if (Array.isArray(cond.all)) {
    return cond.all.every(c => evaluateCondition(c, answers, ctx))
  }
  if (Array.isArray(cond.any)) {
    return cond.any.some(c => evaluateCondition(c, answers, ctx))
  }

  // Shorthand: { field: matcher, field2: matcher2 } = AND
  return Object.entries(cond).every(([field, matcher]) =>
    matchField(answers[field], matcher, ctx)
  )
}

// ── QUESTION LIST BUILDER ─────────────────────────────────────

/**
 * Build the visible question list for a visa given current answers.
 *
 * @param defs    Array of question definitions (camelCase):
 *                { id, label, type, required, options, hint, threshold,
 *                  thresholdRule, showIf, disqualifyIf, disqualifyMsg,
 *                  reviewIf, reviewMsg, disqualifyBelow, reviewBelow,
 *                  disqualifyBelowIf, reviewBelowIf, meta }
 * @param answers Current answers object: { questionId: value }
 * @returns       Array of questions in the frontend's expected shape.
 */
export function buildQuestions(defs, answers = {}) {
  const ctx = {
    answers,
    questionsById: Object.fromEntries(defs.map(d => [d.id, d])),
  }

  const visible = defs.filter(d => evaluateCondition(d.showIf, answers, ctx))

  return visible.map(d => {
    const threshold = d.thresholdRule
      ? computeThreshold(d.thresholdRule, answers)
      : (d.threshold ?? null)

    const fmt = (s) => (s && threshold !== null)
      ? s.replaceAll('{threshold}', threshold.toLocaleString('en-US'))
      : s

    const q = {
      id: d.id,
      label: fmt(d.label),
      type: d.type,
    }

    if (d.required) q.required = true
    if (d.options) q.options = d.options
    if (d.hint) q.hint = fmt(d.hint)
    if (threshold !== null && d.type === 'currency') q.threshold = threshold

    if (d.disqualifyIf) q.disqualifyIf = d.disqualifyIf
    if (d.reviewIf) q.reviewIf = d.reviewIf

    // Static or condition-activated below-threshold flags
    const dqBelow = d.disqualifyBelowIf
      ? evaluateCondition(d.disqualifyBelowIf, answers, ctx)
      : d.disqualifyBelow === true
    const rvBelow = d.reviewBelowIf
      ? evaluateCondition(d.reviewBelowIf, answers, ctx)
      : d.reviewBelow === true

    if (dqBelow) q.disqualifyBelow = true
    if (rvBelow) q.reviewBelow = true

    // Messages travel with the question whenever defined (matches
    // original mockData.js objects, which always carry their msgs)
    if (d.disqualifyMsg) q.disqualifyMsg = fmt(d.disqualifyMsg)
    if (d.reviewMsg) q.reviewMsg = fmt(d.reviewMsg)

    if (d.meta) Object.assign(q, d.meta)

    return q
  })
}
