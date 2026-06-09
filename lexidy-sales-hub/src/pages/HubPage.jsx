import { useState, useEffect } from 'react'
import { PAGES } from '../hooks/useAppState.js'
import { fetchCountries } from '../services/dataService.js'
import { Eyebrow, PageTitle, Button } from '../components/UI.jsx'

export default function HubPage({ state, setPage, setBreadcrumb, selectVisa }) {
  const [countries, setCountries] = useState([])
  const [openCountry, setOpenCountry] = useState(null)

  useEffect(() => {
    fetchCountries().then(setCountries)
  }, [])

  function handleSelectVisa(country, visa) {
    selectVisa(country, visa)
    setBreadcrumb([country.name, visa.label, 'Eligibility Test'])
    setPage(PAGES.ELIGIBILITY)
  }

  function toggleCountry(id) {
    setOpenCountry(prev => prev === id ? null : id)
  }

  return (
    <div className="page-enter" style={{ minHeight: '100vh', background: 'var(--cream)' }}>
      <div className="wrap-md">
        <Eyebrow>Lexidy Sales Hub</Eyebrow>
        <PageTitle>
          Select a <em style={{ color: 'var(--orange)', fontStyle: 'normal' }}>country</em>
          <br />to get started.
        </PageTitle>
        <p style={{
          fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.6,
          maxWidth: 540, marginBottom: 48,
        }}>
          Choose a jurisdiction and visa type to begin the eligibility assessment for your lead.
        </p>

        {/* Countries Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 12,
        }}>
          {countries.map(country => {
            const isOpen = openCountry === country.id
            const activeCount   = country.visas.filter(v => v.active).length
            const inactiveCount = country.visas.filter(v => !v.active).length
            const countLabel    = activeCount > 0
              ? `${activeCount} visa${activeCount > 1 ? 's' : ''} available`
              : `${inactiveCount} visa${inactiveCount > 1 ? 's' : ''} coming soon`

            return (
              <div
                key={country.id}
                onClick={() => toggleCountry(country.id)}
                style={{
                  background: 'var(--white)',
                  border: `1.5px solid ${isOpen ? 'var(--purple)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius)',
                  overflow: 'hidden',
                  transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.18s',
                  cursor: 'pointer',
                  boxShadow: isOpen ? 'var(--shadow-md)' : 'none',
                }}
              >
                {/* Header */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '18px 20px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 26, lineHeight: 1 }}>{country.flag}</span>
                    <div>
                      <div style={{
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                        fontSize: 16, fontWeight: 700,
                      }}>{country.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, fontWeight: 500 }}>
                        {countLabel}
                      </div>
                    </div>
                  </div>
                  <div style={{
                    width: 26, height: 26, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isOpen ? 'var(--orange-light)' : 'var(--cream)',
                    color: isOpen ? 'var(--orange)' : 'var(--text-muted)',
                    fontSize: 10,
                    transform: isOpen ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.25s, background 0.2s',
                  }}>▼</div>
                </div>

                {/* Visa List */}
                {isOpen && (
                  <div style={{ borderTop: '1px solid var(--border)', padding: '8px 10px 10px' }}>
                    {country.visas.map(visa => (
                      visa.active ? (
                        <div
                          key={visa.id}
                          onClick={e => { e.stopPropagation(); handleSelectVisa(country, visa) }}
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '10px 12px', borderRadius: 'var(--radius-sm)',
                            marginBottom: 5, cursor: 'pointer',
                            background: 'var(--purple)', color: 'white',
                            fontSize: 13, fontWeight: 500,
                            transition: 'background 0.15s',
                          }}
                        >
                          <span>{visa.label}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{
                              fontSize: 9, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase',
                              padding: '2px 8px', borderRadius: 4,
                              background: 'var(--green-light)', color: 'var(--green)',
                            }}>Active</span>
                            <span>→</span>
                          </div>
                        </div>
                      ) : (
                        <div
                          key={visa.id}
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '10px 12px', borderRadius: 'var(--radius-sm)',
                            marginBottom: 5, cursor: 'default',
                            fontSize: 13, fontWeight: 500, color: 'var(--text-muted)',
                          }}
                        >
                          <span>{visa.label}</span>
                          <span style={{
                            fontSize: 9, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase',
                            padding: '2px 8px', borderRadius: 4,
                            background: 'var(--cream-mid)', color: 'var(--text-muted)',
                          }}>Coming Soon</span>
                        </div>
                      )
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Admin Panel button */}
        <div style={{
          marginTop: 48, paddingTop: 28,
          borderTop: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Manage countries, visas, eligibility questions and pricing.
          </div>
          <Button
            variant="secondary"
            onClick={() => { setPage(PAGES.ADMIN); setBreadcrumb(['Admin Panel']) }}
          >
            ⚙️ Admin Panel
          </Button>
        </div>
      </div>
    </div>
  )
}
