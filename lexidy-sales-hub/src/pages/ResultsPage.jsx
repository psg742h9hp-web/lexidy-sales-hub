import { PAGES } from '../hooks/useAppState.js'
import { Button, Card, FlagPill } from '../components/UI.jsx'

export default function ResultsPage({ state, setPage, setBreadcrumb }) {
  const { eligResult, eligMessage, countryName, visaLabel, testAnswers } = state

  const isPass   = eligResult === 'pass'
  const isReview = eligResult === 'review'

  const heroConfig = {
    pass: {
      icon: '✓',
      bg: 'var(--green-light)',
      border: 'var(--green)',
      title: 'Qualified',
      desc: 'The lead meets the eligibility requirements for this visa. You can now proceed to the sales guide.',
    },
    review: {
      icon: '⚠',
      bg: 'var(--orange-light)',
      border: 'var(--orange)',
      title: 'Review Needed',
      desc: eligMessage || 'Some answers require manual review by the legal team before proceeding.',
    },
  }[eligResult] || {}

  function goToSalesScript() {
    setBreadcrumb([countryName, 'Advisor Guide'])
    setPage(PAGES.SALES_SCRIPT)
  }

  return (
    <div className="page-enter" style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      <div className="wrap-sm">
        {/* Back nav */}
        <div style={{ marginBottom: 28 }}>
          <Button variant="ghost" onClick={() => setPage(PAGES.ELIGIBILITY)}>← Back to Test</Button>
        </div>

        {/* Result hero */}
        <div style={{
          borderRadius: 'var(--radius)', padding: '28px 32px',
          marginBottom: 20, border: `1.5px solid ${heroConfig.border}`,
          background: heroConfig.bg,
          display: 'flex', alignItems: 'flex-start', gap: 20,
        }}>
          <div style={{ fontSize: 40, flexShrink: 0, lineHeight: 1 }}>{heroConfig.icon}</div>
          <div>
            <div style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: 22, fontWeight: 800, letterSpacing: '-0.4px',
              marginBottom: 6,
              color: isPass ? 'var(--green)' : 'var(--orange)',
            }}>{heroConfig.title}</div>
            <div style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              {heroConfig.desc}
            </div>
          </div>
        </div>

        {/* Summary card */}
        <Card style={{ padding: '24px 28px', marginBottom: 20 }}>
          {[
            { label: 'Visa type', value: visaLabel },
            { label: 'Country', value: countryName },
            { label: 'Status', value: <FlagPill type={isPass ? 'ok' : 'warn'}>{isPass ? '✓ Qualified' : '⚠ Review Needed'}</FlagPill> },
          ].map(({ label, value }) => (
            <div key={label} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 0', borderBottom: '1px solid var(--border)',
              fontSize: 14,
            }}>
              <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{label}</span>
              <span style={{ color: 'var(--purple)', fontWeight: 600 }}>{value}</span>
            </div>
          ))}
        </Card>

        {/* Test answers summary */}
        {testAnswers?.length > 0 && (
          <Card style={{ padding: '24px 28px', marginBottom: 20 }}>
            <div style={{
              fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: 0.6, color: 'var(--text-muted)', marginBottom: 16,
            }}>
              Answers submitted
            </div>
            {testAnswers.map((a, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '10px 0', borderBottom: i < testAnswers.length - 1 ? '1px solid var(--border)' : 'none',
                fontSize: 13,
              }}>
                <span style={{ color: 'var(--text-muted)', flex: 1 }}>{a.question}</span>
                <span style={{ color: 'var(--purple)', fontWeight: 600, marginLeft: 16 }}>{a.answer || '—'}</span>
              </div>
            ))}
          </Card>
        )}

        {/* Actions */}
        {(isPass || isReview) && (
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 28 }}>
            <Button variant="primary" onClick={goToSalesScript} style={{ flex: 1, justifyContent: 'center', padding: 14 }}>
              Continue to Sales Guide →
            </Button>
            {isReview && (
              <Button variant="secondary" onClick={() => setPage(PAGES.ELIGIBILITY)}>
                Review Answers
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
