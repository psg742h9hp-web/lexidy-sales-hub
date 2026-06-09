import { PAGES } from '../hooks/useAppState.js'
import { Button, SectionTag } from '../components/UI.jsx'

export default function SalesScriptPage({ state, setPage, setBreadcrumb }) {
  const { countryName, visaLabel, visaData } = state
  const lowestPkg = visaData?.packages
    ? Object.values(visaData.packages).find(p => p?.price)
    : null

  function goToPricing() {
    setBreadcrumb([countryName, visaLabel, 'Pricing'])
    setPage(PAGES.PRICING)
  }

  return (
    <div className="page-enter" style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      <div className="wrap-lg">
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 28, flexWrap: 'wrap', gap: 16,
        }}>
          <div>
            <div style={{
              fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: 0.6, color: 'var(--text-muted)', marginBottom: 4,
            }}>{countryName} / {visaLabel}</div>
            <h2 style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: 24, fontWeight: 800, letterSpacing: '-0.4px',
            }}>Advisor Sales Guide</h2>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="ghost" onClick={() => setPage(PAGES.RESULTS)}>← Back</Button>
          </div>
        </div>

        {/* 4-Quadrant Grid */}
        <div className="quads" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

          {/* Q1: How Lexidy Helps */}
          <div style={{
            background: 'var(--white)', border: '1.5px solid var(--border)',
            borderRadius: 'var(--radius)', padding: 28, minHeight: 340,
          }}>
            <SectionTag>How Lexidy Helps</SectionTag>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { icon: '📋', title: 'Full Documentation Management', sub: 'We handle every document — gathering, reviewing, translating, and submitting on your behalf.' },
                { icon: '🏛️', title: 'Government Liaison', sub: 'Direct communication with immigration authorities, embassies, and consulates.' },
                { icon: '⚡', title: 'Speed & Accuracy', sub: 'Our team knows every requirement. No delays from missing paperwork or incorrect forms.' },
                { icon: '🔄', title: 'End-to-End Support', sub: 'From application to approval — and renewals when the time comes.' },
              ].map(item => (
                <div key={item.title} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 10,
                    background: 'var(--orange-light)', color: 'var(--orange)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20, flexShrink: 0,
                  }}>{item.icon}</div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.2px' }}>{item.title}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5, marginTop: 2 }}>{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Q2: Guarantees */}
          <div style={{
            background: 'var(--white)', border: '1.5px solid var(--border)',
            borderRadius: 'var(--radius)', padding: 28, minHeight: 340,
          }}>
            <SectionTag>Our Guarantees</SectionTag>
            {[
              { icon: '✓', text: 'Fixed pricing — no surprise fees' },
              { icon: '✓', text: 'Dedicated case manager for your application' },
              { icon: '✓', text: 'All communication handled in English' },
              { icon: '✓', text: 'Document review before submission' },
              { icon: '✓', text: 'Regular status updates throughout' },
            ].map(item => (
              <div key={item.text} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 14px', borderRadius: 'var(--radius-sm)',
                background: 'var(--cream)', border: '1px solid var(--cream-mid)',
                marginBottom: 10,
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'var(--green-light)', color: 'var(--green)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, flexShrink: 0, fontWeight: 700,
                }}>{item.icon}</div>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{item.text}</span>
              </div>
            ))}
            <div style={{
              marginTop: 14, padding: '12px 14px',
              background: 'var(--cream)', borderRadius: 'var(--radius-sm)',
              borderLeft: '3px solid var(--orange)',
              fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6,
            }}>
              <strong style={{ color: 'var(--purple)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                💳 Flexible payment
              </strong>
              Split payment available: 50% upfront, 50% on approval. Ask your advisor for details.
            </div>
          </div>

          {/* Q3: Timeline */}
          <div style={{
            background: 'var(--white)', border: '1.5px solid var(--border)',
            borderRadius: 'var(--radius)', padding: 28, minHeight: 340,
          }}>
            <SectionTag>Timeline</SectionTag>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'var(--cream)', border: '1px solid var(--border)',
              borderRadius: 100, padding: '4px 12px',
              fontSize: 11, fontWeight: 600, marginBottom: 20,
            }}>
              🕐 {visaData?.timeline || 'Timeline TBD'}
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', position: 'relative' }}>
              <div style={{
                position: 'absolute', top: 22, left: 22, right: 22, height: 2,
                background: 'var(--border)', zIndex: 0,
              }} />
              {[
                { label: 'Documents\nGathered', num: '1' },
                { label: 'Legal\nReview', num: '2' },
                { label: 'We\nSubmit', num: '3' },
                { label: 'Visa\nApproved', num: '✓', done: true },
              ].map(step => (
                <div key={step.num} style={{
                  flex: 1, textAlign: 'center', position: 'relative', zIndex: 1,
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontSize: 16, fontWeight: 800,
                    margin: '0 auto 10px',
                    background: step.done ? 'var(--green)' : 'var(--purple)',
                    color: 'white',
                  }}>{step.num}</div>
                  <div style={{
                    fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1.4,
                    whiteSpace: 'pre-line',
                  }}>{step.label}</div>
                </div>
              ))}
            </div>
            <div style={{
              marginTop: 20, fontSize: 11, color: 'var(--text-muted)',
              fontStyle: 'italic', lineHeight: 1.5,
              paddingTop: 16, borderTop: '1px solid var(--border)',
            }}>
              * Timeline estimates are approximate and depend on your specific situation and government processing times.
            </div>
          </div>

          {/* Q4: Packages */}
          <div style={{
            background: 'var(--white)', border: '1.5px solid var(--border)',
            borderRadius: 'var(--radius)', padding: 28, minHeight: 340,
          }}>
            <SectionTag>Packages Available</SectionTag>
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 16 }}>
              {['Bronze', 'Silver', 'Gold', 'Platinum'].map((tier, i) => {
                const colors = [
                  { border: '#c08040', color: '#8b5e2a', bg: '#fdf3e7' },
                  { border: '#9aafbe', color: '#4a6676', bg: '#f0f5f8' },
                  { border: '#c9a84c', color: '#8b6e1a', bg: '#fdf8e8' },
                  { border: '#8878c4', color: '#5a4a8f', bg: '#f4f0ff' },
                ][i]
                const tierKey = tier.toLowerCase()
                const hasTier = visaData?.packages?.[tierKey]
                if (!hasTier) return null
                return (
                  <span key={tier} style={{
                    padding: '5px 14px', borderRadius: 100,
                    fontSize: 12, fontWeight: 600,
                    border: `1.5px solid ${colors.border}`,
                    color: colors.color, background: colors.bg,
                  }}>{tier}</span>
                )
              })}
            </div>
            {lowestPkg && (
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
                Starting from{' '}
                <strong style={{
                  color: 'var(--purple)',
                  fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 16,
                }}>
                  €{lowestPkg.price.toLocaleString()}
                </strong>
                {' '}· Customizable with add-ons
              </div>
            )}
            <div style={{
              background: 'var(--cream)', borderRadius: 'var(--radius-sm)',
              padding: '12px 14px', borderLeft: '3px solid var(--orange)',
            }}>
              <div style={{ color: 'var(--orange)', fontSize: 13, marginBottom: 4 }}>★★★★★</div>
              <div style={{
                fontSize: 12, fontStyle: 'italic',
                color: 'var(--text-muted)', lineHeight: 1.5,
              }}>
                "Smooth, professional, efficient process." — Client testimonial
              </div>
            </div>
            <div style={{ marginTop: 14, fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: 1.5, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
              Full package details and pricing visible on next page.
            </div>
            <Button variant="primary" size="sm" onClick={goToPricing} fullWidth style={{ marginTop: 16, justifyContent: 'center' }}>
              View Packages & Pricing →
            </Button>
          </div>

        </div>
      </div>
    </div>
  )
}
