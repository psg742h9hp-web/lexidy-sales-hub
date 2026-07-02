import { PAGES } from '../hooks/useAppState.js'
import { fetchVisa } from '../services/dataService.js'
import { Button } from '../components/UI.jsx'

// Rerouting suggestions — keyed by visaId
const REROUTE_SUGGESTIONS = {
  'es-dnv-freelancer': [
    { countryId: 'pt', visaId: 'pt-dnv', flag: '🇵🇹', name: 'Portugal Digital Nomad Visa', reason: 'Lower income threshold (€3,040/mo)', match: '95%' },
    { countryId: 'gr', visaId: 'gr-dnv-freelancer', flag: '🇬🇷', name: 'Greece Digital Nomad Visa', reason: 'Flexible qualification criteria', match: '88%' },
  ],
  'es-dnv-employee': [
    { countryId: 'pt', visaId: 'pt-dnv', flag: '🇵🇹', name: 'Portugal Digital Nomad Visa', reason: 'Lower income threshold', match: '90%' },
    { countryId: 'fr', visaId: 'fr-visitor', flag: '🇫🇷', name: 'France Visitor Visa', reason: 'Alternative path for employed individuals', match: '75%' },
  ],
  'es-nlv': [
    { countryId: 'pt', visaId: 'pt-d7', flag: '🇵🇹', name: 'Portugal D7 Passive Income Visa', reason: 'Comparable requirements, similar lifestyle', match: '92%' },
    { countryId: 'gr', visaId: 'gr-fip', flag: '🇬🇷', name: 'Greece Financially Independent Permit', reason: 'Great alternative for passive income holders', match: '85%' },
  ],
  'pt-dnv': [
    { countryId: 'es', visaId: 'es-dnv-freelancer', flag: '🇪🇸', name: 'Spain Digital Nomad Visa', reason: 'Similar visa category, strong expat community', match: '88%' },
  ],
  'gr-fip': [
    { countryId: 'pt', visaId: 'pt-d7', flag: '🇵🇹', name: 'Portugal D7 Passive Income Visa', reason: 'Similar passive income requirements', match: '90%' },
    { countryId: 'es', visaId: 'es-nlv', flag: '🇪🇸', name: 'Spain Non-Lucrative Visa', reason: 'Well-established program for retirees', match: '85%' },
  ],
}

export default function ReroutePage({ state, setPage, setBreadcrumb, selectVisa }) {
  const suggestions = REROUTE_SUGGESTIONS[state.visaId] || []

  async function handleSelectAlternative(suggestion) {
    const data = await fetchVisa(suggestion.visaId)
    if (!data) { setBreadcrumb([]); setPage(PAGES.HUB); return }
    selectVisa(data.country, data.visa)
    setBreadcrumb([data.country.name, data.visa.label, 'Eligibility Test'])
    setPage(PAGES.ELIGIBILITY)
  }

  return (
    <div className="page-enter" style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      <div className="wrap-sm">
        <div style={{ marginBottom: 28 }}>
          <Button variant="ghost" onClick={() => setPage(PAGES.ELIGIBILITY)}>← Back to Test</Button>
        </div>

        {/* Fail hero */}
        <div style={{
          borderRadius: 'var(--radius)', padding: '28px 32px',
          marginBottom: 28, border: '1.5px solid var(--red)',
          background: 'var(--red-light)',
          display: 'flex', alignItems: 'flex-start', gap: 20,
        }}>
          <div style={{ fontSize: 40, flexShrink: 0, lineHeight: 1 }}>✗</div>
          <div>
            <div style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: 22, fontWeight: 800, letterSpacing: '-0.4px',
              marginBottom: 6, color: 'var(--red)',
            }}>Not Eligible</div>
            <div style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              {state.eligMessage || `The lead does not currently meet the requirements for the ${state.visaLabel}.`}
            </div>
          </div>
        </div>

        {/* Alternative visas */}
        {suggestions.length > 0 && (
          <>
            <div style={{
              fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: 0.6, color: 'var(--text-muted)', marginBottom: 16,
            }}>
              Alternative visas to consider
            </div>

            {suggestions.map((s, i) => (
              <div
                key={i}
                onClick={() => handleSelectAlternative(s)}
                style={{
                  borderRadius: 'var(--radius)', padding: '20px 24px',
                  marginBottom: 12, border: '1.5px solid var(--border)',
                  background: 'var(--white)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  gap: 20, cursor: 'pointer',
                  transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.18s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--orange)'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.transform = 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontSize: 24 }}>{s.flag}</span>
                  <div>
                    <div style={{
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      fontSize: 15, fontWeight: 700,
                    }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3, lineHeight: 1.4 }}>
                      {s.reason}
                    </div>
                  </div>
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: 0.3,
                  padding: '4px 10px', borderRadius: 100,
                  background: 'var(--green-light)', color: 'var(--green)',
                  flexShrink: 0,
                }}>
                  {s.match} match
                </span>
              </div>
            ))}
          </>
        )}

        <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
          <Button variant="primary" onClick={() => { setBreadcrumb([]); setPage(PAGES.HUB) }} style={{ flex: 1, justifyContent: 'center' }}>
            ← Back to Country Selection
          </Button>
          <Button variant="secondary" onClick={() => setPage(PAGES.ELIGIBILITY)}>
            Re-run Test
          </Button>
        </div>
      </div>
    </div>
  )
}
