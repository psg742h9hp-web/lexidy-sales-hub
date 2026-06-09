import { useState, useEffect, useCallback } from 'react'
import { PAGES } from '../hooks/useAppState.js'
import { fetchEligibilityQuestions, submitEligibilityResult } from '../services/dataService.js'
import { AdvisorNote, Button } from '../components/UI.jsx'

export default function EligibilityPage({ state, setPage, setBreadcrumb, setEligResult }) {
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers]     = useState({})
  const [validationMsg, setValidationMsg] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Reload questions whenever answers change (branching logic)
  useEffect(() => {
    fetchEligibilityQuestions(state.visaId, answers).then(setQuestions)
  }, [state.visaId, answers])

  function handleAnswer(id, value) {
    setAnswers(prev => ({ ...prev, [id]: value }))
    setValidationMsg('')
  }

  function validate() {
    for (const q of questions) {
      if (q.required && q.type !== 'info') {
        const val = answers[q.id]
        if (!val || val === '' || val === 'Select...') {
          return `Please answer: "${q.label}"`
        }
      }
    }
    return null
  }

  function evaluateResult() {
    let result = 'pass'
    let resultMsg = ''

    for (const q of questions) {
      const ans = answers[q.id]
      if (!ans) continue

      // Disqualify checks
      if (q.disqualifyIf && ans === q.disqualifyIf) {
        return { result: 'fail', msg: q.disqualifyMsg || `Did not qualify: ${q.label}` }
      }

      // Review checks
      if (q.reviewIf && ans === q.reviewIf) {
        result = 'review'
        resultMsg = q.reviewMsg || `Review needed: ${q.label}`
      }

      // Currency threshold checks
      if (q.type === 'currency' && q.threshold) {
        const val = parseFloat(String(ans).replace(/[€,\s]/g, ''))
        if (!isNaN(val)) {
          if (q.disqualifyBelow && val < q.threshold) {
            return { result: 'fail', msg: q.disqualifyMsg || `Income below required threshold of €${q.threshold}` }
          }
          if (q.reviewBelow && val < q.threshold) {
            result = 'review'
            resultMsg = q.reviewMsg || `Income below recommended threshold of €${q.threshold}`
          }
        }
      }
    }

    return { result, msg: resultMsg }
  }

  async function handleSubmit() {
    const error = validate()
    if (error) { setValidationMsg(error); return }

    setSubmitting(true)
    const { result, msg } = evaluateResult()

    const testAnswers = questions
      .filter(q => q.type !== 'info')
      .map(q => ({ question: q.label, answer: answers[q.id] || '', stepId: q.id }))

    await submitEligibilityResult({
      contactId:    state.contactId,
      visaId:       state.visaId,
      visaLabel:    state.visaLabel,
      country:      state.countryName,
      result,
      answers:      testAnswers,
      timestamp:    new Date().toISOString(),
    })

    setEligResult(result, msg, testAnswers)

    if (result === 'fail') {
      setBreadcrumb([state.countryName, state.visaLabel, 'Not Eligible'])
      setPage(PAGES.REROUTE)
    } else {
      setBreadcrumb([state.countryName, state.visaLabel, 'Results'])
      setPage(PAGES.RESULTS)
    }
    setSubmitting(false)
  }

  function handleSkip() {
    setEligResult('pass', '', [])
    setBreadcrumb([state.countryName, state.visaLabel, 'Results'])
    setPage(PAGES.RESULTS)
  }

  return (
    <div className="page-enter" style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      <div className="wrap-sm">
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 36, flexWrap: 'wrap', gap: 16,
        }}>
          <div>
            <div style={{
              fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: 0.6, color: 'var(--text-muted)', marginBottom: 6,
            }}>
              {state.countryName} / {state.visaLabel}
            </div>
            <h2 style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: 26, fontWeight: 800, letterSpacing: '-0.5px',
            }}>
              Eligibility Test
            </h2>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Button variant="ghost" onClick={() => { setPage(PAGES.HUB); setBreadcrumb([]) }}>
              ← Back
            </Button>
          </div>
        </div>

        {/* Advisor Note */}
        <AdvisorNote>
          <strong style={{ color: 'var(--orange)' }}>📋 Advisor note:</strong> Go through each question with the lead. All questions are shown at once — answers update the form dynamically.
        </AdvisorNote>

        {/* Questions */}
        {questions.map(q => (
          <QuestionCard key={q.id} question={q} answer={answers[q.id]} onChange={handleAnswer} />
        ))}

        {/* Validation */}
        {validationMsg && (
          <div style={{
            padding: '12px 14px',
            background: 'var(--red-light)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid rgba(201,67,67,0.2)',
            fontSize: 13, color: 'var(--red)',
            marginBottom: 12,
          }}>
            ⚠ {validationMsg}
          </div>
        )}

        {/* Submit / Skip */}
        <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
          <Button
            variant="primary"
            fullWidth
            onClick={handleSubmit}
            disabled={submitting}
            style={{ flex: 1, padding: 14, justifyContent: 'center' }}
          >
            {submitting ? 'Submitting…' : 'Submit Assessment →'}
          </Button>
          <Button
            variant="secondary"
            onClick={handleSkip}
            style={{ padding: 14, whiteSpace: 'nowrap' }}
          >
            Skip Test →
          </Button>
        </div>
      </div>
    </div>
  )
}

// ── QUESTION CARD ─────────────────────────────────────────────
function QuestionCard({ question: q, answer, onChange }) {
  if (q.type === 'info') {
    return (
      <div style={{
        background: 'var(--cream)', borderLeft: '3px solid var(--orange)',
        borderRadius: 'var(--radius-sm)', padding: '14px 16px',
        marginBottom: 16, fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6,
      }}>
        {q.label}
      </div>
    )
  }

  return (
    <div style={{
      background: 'var(--white)',
      border: '1.5px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '28px 32px',
      marginBottom: 20,
      animation: 'fadeUp 0.3s ease-out both',
    }}>
      <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
        {q.label}
        {q.required && <span style={{ color: 'var(--orange)', marginLeft: 4 }}>*</span>}
      </label>

      {q.hint && (
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10, lineHeight: 1.5 }}>
          {q.hint}
        </div>
      )}

      {/* Yes / No */}
      {q.type === 'yesno' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {['Yes', 'No'].map(opt => (
            <label key={opt} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 14px', borderRadius: 'var(--radius-sm)',
              cursor: 'pointer', transition: 'background 0.12s',
              border: `1.5px solid ${answer === opt ? 'var(--orange)' : 'transparent'}`,
              background: answer === opt ? 'var(--orange-light)' : 'transparent',
            }}>
              <input
                type="radio"
                name={q.id}
                value={opt}
                checked={answer === opt}
                onChange={() => onChange(q.id, opt)}
                style={{ width: 16, height: 16, accentColor: 'var(--orange)', cursor: 'pointer' }}
              />
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{opt}</span>
            </label>
          ))}
        </div>
      )}

      {/* Select */}
      {q.type === 'select' && (
        <select
          className="elig-select"
          value={answer || ''}
          onChange={e => onChange(q.id, e.target.value)}
        >
          <option value="">Select...</option>
          {(q.options || []).filter(o => o !== 'Select...').map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      )}

      {/* Text */}
      {q.type === 'text' && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 14px', border: '1.5px solid var(--border)',
          borderRadius: 'var(--radius-sm)', background: 'var(--white)',
        }}>
          <input
            type="text"
            value={answer || ''}
            onChange={e => onChange(q.id, e.target.value)}
            style={{
              flex: 1, border: 'none', background: 'none',
              fontFamily: "'DM Sans', sans-serif", fontSize: 14,
              color: 'var(--purple)', outline: 'none',
            }}
            placeholder="Type your answer..."
          />
        </div>
      )}

      {/* Number */}
      {q.type === 'number' && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 14px', border: '1.5px solid var(--border)',
          borderRadius: 'var(--radius-sm)', background: 'var(--white)',
        }}>
          <input
            type="number"
            value={answer || ''}
            onChange={e => onChange(q.id, e.target.value)}
            style={{
              flex: 1, border: 'none', background: 'none',
              fontFamily: "'DM Sans', sans-serif", fontSize: 14,
              color: 'var(--purple)', outline: 'none',
            }}
            placeholder="0"
          />
        </div>
      )}

      {/* Currency */}
      {q.type === 'currency' && (
        <CurrencyInput
          questionId={q.id}
          value={answer || ''}
          threshold={q.threshold}
          onChange={onChange}
        />
      )}
    </div>
  )
}

// ── CURRENCY INPUT ────────────────────────────────────────────
function CurrencyInput({ questionId, value, threshold, onChange }) {
  const numVal = parseFloat(String(value).replace(/[€,\s]/g, '')) || 0

  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '10px 14px', border: '1.5px solid var(--border)',
        borderRadius: 'var(--radius-sm)', background: 'var(--white)',
      }}>
        <span style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: 14 }}>€</span>
        <input
          type="number"
          value={value}
          onChange={e => onChange(questionId, e.target.value)}
          style={{
            flex: 1, border: 'none', background: 'none',
            fontFamily: "'DM Sans', sans-serif", fontSize: 14,
            color: 'var(--purple)', outline: 'none',
          }}
          placeholder="0"
        />
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>/month</span>
      </div>

      {threshold && value && (
        <div style={{
          background: 'var(--cream)', borderLeft: '3px solid var(--orange)',
          borderRadius: 'var(--radius-sm)', padding: '14px 16px',
          marginTop: 14, fontSize: 13,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, color: 'var(--text-muted)' }}>
            <span>Income provided</span>
            <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, color: 'var(--purple)' }}>
              €{numVal.toLocaleString()}
            </span>
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            paddingTop: 8, borderTop: '1px solid var(--border)',
            fontWeight: 700, color: 'var(--purple)',
          }}>
            <span>Required minimum</span>
            <span style={{
              fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700,
              color: numVal >= threshold ? 'var(--green)' : 'var(--red)',
            }}>
              €{threshold.toLocaleString()} {numVal >= threshold ? '✓' : '✗'}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
