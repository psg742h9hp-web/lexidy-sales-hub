import { useState } from 'react'
import { PAGES } from '../hooks/useAppState.js'
import { Button } from '../components/UI.jsx'
import { submitPricingDecision } from '../services/dataService.js'

export default function PricingPage({
  state, cartTotal,
  setPage, setBreadcrumb,
  selectPackage, toggleAddon, updateCartMembers, registerAnswer,
}) {
  const { visaData, visaLabel, countryName, cartPkg, cartPkgLabel,
          cartMain, cartFamily, cartChild, cartMembers, cartChildren,
          cartAddons, cartRegistered, contactId, contactEmail } = state
  const [addonsOpen, setAddonsOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  if (!visaData) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <Button variant="secondary" onClick={() => setPage(PAGES.HUB)}>← Back to Hub</Button>
      </div>
    )
  }

  const { packages, features, addons = [], notes } = visaData
  const tiers = ['bronze', 'silver', 'gold']
  const hasPlatinum = packages?.platinum

  function handleSelectPkg(tier) {
    const pkg = packages[tier]
    if (!pkg) return
    const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1)
    selectPackage(
      tier, tierLabel,
      `€${pkg.price?.toLocaleString() || '0'}`,
      pkg.familyMember ? `€${pkg.familyMember.toLocaleString()}` : '—',
      pkg.child ? `€${pkg.child.toLocaleString()}` : '—',
    )
  }

  function handleSelectPlatinum() {
    const pkg = packages.platinum
    if (!pkg) return
    selectPackage(
      'platinum', 'Platinum',
      `€${pkg.price?.toLocaleString() || '0'}`,
      pkg.familyMember ? `€${pkg.familyMember.toLocaleString()}` : '—',
      pkg.child ? `€${pkg.child.toLocaleString()}` : '—',
    )
  }

  async function handleRegister() {
    if (!cartPkg || submitting) return
    setSubmitting(true)
    const payload = {
      contactId,
      visaId:       visaData.id,
      visaLabel,
      country:      countryName,
      package:      cartPkgLabel,
      packagePrice: parseFloat(String(cartMain).replace(/[€,]/g, '')) || 0,
      familyMembers: cartMembers,
      children:      cartChildren,
      addons:        cartAddons,
      totalEstimate: cartTotal,
    }
    await submitPricingDecision(payload)
    registerAnswer(payload)
    setSubmitting(false)
  }

  const tierStyles = {
    bronze:   { label: 'Bronze',   color: '#c08040', textColor: '#8b5e2a' },
    silver:   { label: 'Silver',   color: '#9aafbe', textColor: '#4a6676' },
    gold:     { label: 'Gold',     color: '#c9a84c', textColor: '#8b6e1a' },
  }

  return (
    <div className="page-enter" style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      <div className="wrap-lg">
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          marginBottom: 32, flexWrap: 'wrap', gap: 16,
        }}>
          <div>
            <div style={{
              fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: 0.6, color: 'var(--text-muted)', marginBottom: 4,
            }}>{countryName} / {visaLabel}</div>
            <h2 style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: 24, fontWeight: 800, letterSpacing: '-0.4px',
            }}>Packages & Pricing</h2>
          </div>
          <Button variant="ghost" onClick={() => setPage(PAGES.SALES_SCRIPT)}>← Back to Guide</Button>
        </div>

        {/* Layout: left content + right cart */}
        <div className="pricing-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 28, alignItems: 'start' }}>

          {/* LEFT COLUMN */}
          <div>
            {/* Bronze / Silver / Gold */}
            <div className="packages-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20, alignItems: 'stretch' }}>
              {tiers.map(tier => {
                const pkg = packages?.[tier]
                if (!pkg) return null
                const isSelected = cartPkg === tier
                const s = tierStyles[tier]
                const featureList = features?.[tier] || []

                return (
                  <div
                    key={tier}
                    onClick={() => handleSelectPkg(tier)}
                    style={{
                      background: 'var(--white)',
                      border: isSelected ? '2px solid var(--orange)' : '1.5px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      padding: '22px 18px',
                      position: 'relative',
                      cursor: 'pointer',
                      display: 'flex', flexDirection: 'column',
                      boxShadow: isSelected ? '0 0 0 4px rgba(224,120,86,0.12), var(--shadow-md)' : 'none',
                      transition: 'all 0.2s',
                    }}
                  >
                    {tier === 'gold' && (
                      <div style={{
                        position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)',
                        background: 'var(--orange)', color: 'white',
                        fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase',
                        padding: '4px 12px', borderRadius: 100, whiteSpace: 'nowrap',
                      }}>Most Popular</div>
                    )}
                    <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8, color: s.textColor }}>
                      {s.label}
                    </div>
                    <div style={{
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      fontSize: 26, fontWeight: 800, letterSpacing: '-0.8px',
                      color: 'var(--purple)', marginBottom: 2, lineHeight: 1,
                    }}>
                      €{pkg.price?.toLocaleString()}
                      {pkg.priceNote && <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-muted)', marginLeft: 4 }}>{pkg.priceNote}</span>}
                    </div>
                    {pkg.familyMember && (
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 14, fontWeight: 500 }}>
                        {pkg.familyNote || `€${pkg.familyMember.toLocaleString()} / family member`}
                        {pkg.child && ` · €${pkg.child.toLocaleString()} / child`}
                      </div>
                    )}
                    <div style={{ height: 1, background: 'var(--border)', marginBottom: 12 }} />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {featureList.map((f, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 7, fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4, fontWeight: 500 }}>
                          <span style={{ color: 'var(--green)', fontSize: 12, flexShrink: 0, marginTop: 1 }}>✓</span>
                          {f}
                        </div>
                      ))}
                    </div>
                    <button style={{
                      marginTop: 14, padding: '9px 14px',
                      background: isSelected ? 'var(--orange)' : 'var(--white)',
                      border: `1.5px solid ${isSelected ? 'var(--orange)' : 'var(--border)'}`,
                      borderRadius: 'var(--radius-sm)',
                      color: isSelected ? 'white' : 'var(--purple)',
                      fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600,
                      cursor: 'pointer', width: '100%',
                    }}>
                      {isSelected ? '✓ Selected' : `Select ${s.label}`}
                    </button>
                  </div>
                )
              })}
            </div>

            {/* Add-ons */}
            {addons.length > 0 && (
              <div style={{
                background: 'var(--white)',
                border: `1.5px solid ${addonsOpen ? 'var(--orange)' : 'var(--border)'}`,
                borderRadius: 'var(--radius)', marginBottom: 20, overflow: 'hidden',
              }}>
                <div
                  onClick={() => setAddonsOpen(!addonsOpen)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '18px 24px', cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: 9,
                      background: 'var(--orange-light)', color: 'var(--orange)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17,
                    }}>＋</div>
                    <div>
                      <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 15, fontWeight: 700 }}>
                        Available Add-Ons
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Optional services to enhance any package</div>
                    </div>
                  </div>
                  <div style={{
                    width: 26, height: 26, borderRadius: '50%',
                    background: addonsOpen ? 'var(--orange-light)' : 'var(--cream)',
                    color: addonsOpen ? 'var(--orange)' : 'var(--text-muted)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10,
                    transform: addonsOpen ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.22s, background 0.2s',
                  }}>▼</div>
                </div>

                {addonsOpen && (
                  <div style={{ padding: '0 24px 22px', borderTop: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 16 }}>
                      {addons.map(addon => {
                        const isSelected = cartAddons.some(a => a.id === addon.id)
                        return (
                          <div key={addon.id} style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            gap: 14, padding: '13px 14px',
                            border: `1.5px solid ${isSelected ? 'var(--orange)' : 'var(--border)'}`,
                            borderRadius: 'var(--radius-sm)',
                            background: isSelected ? 'var(--orange-light)' : 'var(--white)',
                            transition: 'border-color 0.2s',
                          }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 13, fontWeight: 600 }}>{addon.name}</div>
                              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{addon.desc}</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                              <span style={{
                                fontFamily: "'Bricolage Grotesque', sans-serif",
                                fontSize: 17, fontWeight: 700, whiteSpace: 'nowrap',
                              }}>
                                {addon.price > 0 ? `€${addon.price.toLocaleString()}` : 'Custom'}
                              </span>
                              <button
                                onClick={() => toggleAddon(addon)}
                                style={{
                                  padding: '7px 13px', borderRadius: 8, fontSize: 11, fontWeight: 600,
                                  border: '1.5px solid', fontFamily: 'inherit', whiteSpace: 'nowrap', cursor: 'pointer',
                                  background: isSelected ? 'var(--orange)' : 'var(--white)',
                                  borderColor: isSelected ? 'var(--orange)' : 'var(--border)',
                                  color: isSelected ? 'white' : 'var(--purple)',
                                  transition: 'all 0.18s',
                                }}
                              >
                                {isSelected ? '✓ Added' : '+ Add'}
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Platinum */}
            {hasPlatinum && <PlatinumCard pkg={packages.platinum} features={features?.platinum} isSelected={cartPkg === 'platinum'} onSelect={handleSelectPlatinum} />}

            {/* Notes */}
            {notes && (
              <div style={{
                background: 'var(--cream)', borderLeft: '3px solid var(--orange)',
                borderRadius: 'var(--radius-sm)', padding: '14px 16px',
                fontSize: 13, lineHeight: 1.6, color: 'var(--text-muted)', marginTop: 12,
              }}>
                <strong style={{ color: 'var(--purple)' }}>Notes:</strong> {notes}
              </div>
            )}
          </div>

          {/* RIGHT: CART */}
          <Cart
            cartPkg={cartPkg}
            cartPkgLabel={cartPkgLabel}
            cartMain={cartMain}
            cartFamily={cartFamily}
            cartChild={cartChild}
            cartMembers={cartMembers}
            cartChildren={cartChildren}
            cartAddons={cartAddons}
            cartTotal={cartTotal}
            cartRegistered={cartRegistered}
            submitting={submitting}
            onMembersChange={updateCartMembers}
            onRegister={handleRegister}
          />
        </div>
      </div>
    </div>
  )
}

// ── PLATINUM CARD ─────────────────────────────────────────────
function PlatinumCard({ pkg, features = [], isSelected, onSelect }) {
  return (
    <div
      onClick={onSelect}
      style={{
        position: 'relative', overflow: 'hidden',
        borderRadius: 20, marginBottom: 20, color: 'white',
        background: 'linear-gradient(135deg, #1a1030 0%, #251843 40%, #2c1c4f 100%)',
        boxShadow: isSelected
          ? '0 0 0 3px var(--orange), 0 32px 80px rgba(20,12,40,0.55)'
          : '0 0 0 1px rgba(224,120,86,0.18), 0 32px 80px rgba(20,12,40,0.45)',
        cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s',
      }}
    >
      <div style={{ position: 'relative', zIndex: 1, padding: 32 }}>
        {/* Badge row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 14 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: 'linear-gradient(135deg, rgba(224,120,86,0.35), rgba(224,120,86,0.15))',
            border: '1px solid rgba(224,120,86,0.45)', borderRadius: 100,
            padding: '5px 14px', fontSize: 10, fontWeight: 800, letterSpacing: 1,
            textTransform: 'uppercase', color: '#ffd4c2',
          }}>
            <div style={{
              width: 16, height: 16, borderRadius: '50%',
              background: 'linear-gradient(135deg, #e07856, #c95e3d)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 8, color: 'white', fontWeight: 900,
            }}>★</div>
            Platinum
          </div>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontStyle: 'italic' }}>All-inclusive service</span>
        </div>

        {/* Pricing cells */}
        <div style={{
          display: 'flex', gap: 1, marginBottom: 28,
          background: 'rgba(255,255,255,0.07)', borderRadius: 12, overflow: 'hidden',
        }}>
          {[
            { label: 'Main applicant', val: pkg.price },
            ...(pkg.familyMember ? [{ label: 'Family member', val: pkg.familyMember }] : []),
            ...(pkg.child ? [{ label: 'Child', val: pkg.child }] : []),
          ].map(cell => (
            <div key={cell.label} style={{
              flex: 1, padding: '18px 20px', textAlign: 'center',
              background: 'rgba(255,255,255,0.03)',
            }}>
              <div style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontSize: 24, fontWeight: 800, letterSpacing: '-0.8px', lineHeight: 1,
                background: 'linear-gradient(135deg, #fff 0%, #ffd4c2 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>€{cell.val?.toLocaleString()}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 4, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {cell.label}
              </div>
            </div>
          ))}
        </div>

        {/* Features */}
        {features.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 16 }} className="plat-body">
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginBottom: 12, paddingBottom: 7, borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
                What's included
              </div>
              {features.slice(0, Math.ceil(features.length / 2)).map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 12, color: 'rgba(255,255,255,0.75)', lineHeight: 1.45, marginBottom: 9 }}>
                  <div style={{ flexShrink: 0, width: 15, height: 15, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, marginTop: 1 }}>✓</div>
                  {f}
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginBottom: 12, paddingBottom: 7, borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
                Premium add-ons
              </div>
              {features.slice(Math.ceil(features.length / 2)).map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 12, color: 'rgba(255,255,255,0.75)', lineHeight: 1.45, marginBottom: 9 }}>
                  <div style={{ flexShrink: 0, width: 15, height: 15, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, marginTop: 1 }}>✓</div>
                  {f}
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          style={{
            width: '100%', marginTop: 8, padding: 14,
            background: isSelected
              ? 'linear-gradient(135deg, #e07856, #c95e3d)'
              : 'linear-gradient(135deg, rgba(224,120,86,0.85), rgba(200,90,60,0.9))',
            border: '1px solid rgba(224,120,86,0.6)',
            borderRadius: 'var(--radius-sm)',
            color: 'white', fontFamily: "'DM Sans', sans-serif",
            fontSize: 14, fontWeight: 700, cursor: 'pointer',
            boxShadow: isSelected ? '0 4px 20px rgba(224,120,86,0.35)' : 'none',
          }}
        >
          {isSelected ? '✓ Platinum Selected' : '✓ Select Platinum'}
        </button>
      </div>
    </div>
  )
}

// ── CART SIDEBAR ──────────────────────────────────────────────
function Cart({ cartPkg, cartPkgLabel, cartMain, cartFamily, cartChild,
                 cartMembers, cartChildren, cartAddons, cartTotal,
                 cartRegistered, submitting, onMembersChange, onRegister }) {
  return (
    <div className="cart-sidebar" style={{
      position: 'sticky', top: 'calc(var(--topbar-h) + 20px)',
      background: 'linear-gradient(160deg, #1e1240 0%, #2c1c4f 100%)',
      borderRadius: 'var(--radius)', padding: 24, color: 'white',
      boxShadow: '0 0 0 1px rgba(224,120,86,0.15), var(--shadow-lg)',
    }}>
      {/* Cart title */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 18, paddingBottom: 14,
        borderBottom: '1px solid rgba(255,255,255,0.1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 700 }}>
          🛒 Lead Interest
        </div>
        <span style={{
          fontSize: 10, fontWeight: 700, letterSpacing: 0.3,
          padding: '3px 10px', borderRadius: 100,
          background: cartRegistered ? 'rgba(61,158,110,0.3)' : 'rgba(255,255,255,0.1)',
          color: cartRegistered ? '#a8e0c2' : 'rgba(255,255,255,0.6)',
        }}>
          {cartRegistered ? 'Registered' : 'Not registered'}
        </span>
      </div>

      {!cartPkg ? (
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '20px 0', fontStyle: 'italic' }}>
          Select a package to begin building the quote.
        </div>
      ) : (
        <>
          {/* Cart rows */}
          {[
            { label: 'Package', value: cartPkgLabel, highlight: true },
            { label: 'Main applicant', value: cartMain },
            { label: 'Per family member', value: cartFamily },
            { label: 'Per child', value: cartChild },
          ].map(row => (
            <div key={row.label} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              fontSize: 13, marginBottom: 8, color: 'rgba(255,255,255,0.7)',
            }}>
              <span>{row.label}</span>
              <span style={{
                color: row.highlight ? 'var(--orange)' : 'rgba(255,255,255,0.9)',
                fontWeight: 600,
              }}>{row.value}</span>
            </div>
          ))}

          {/* Add-ons list */}
          {cartAddons.length > 0 && (
            <div style={{ marginBottom: 8 }}>
              <div style={{
                fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5,
                opacity: 0.5, margin: '12px 0 6px', paddingTop: 8,
                borderTop: '1px solid rgba(255,255,255,0.1)',
              }}>Add-ons</div>
              {cartAddons.map(addon => (
                <div key={addon.id} style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontSize: 12, color: 'rgba(255,255,255,0.65)', marginBottom: 5,
                }}>
                  <span>{addon.name}</span>
                  <span>{addon.price > 0 ? `€${addon.price.toLocaleString()}` : 'Custom'}</span>
                </div>
              ))}
            </div>
          )}

          {/* Family / Children inputs */}
          <div style={{ margin: '14px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Family members:', key: 'members', value: cartMembers },
              { label: 'Children:', key: 'children', value: cartChildren },
            ].map(row => (
              <div key={row.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{row.label}</span>
                <input
                  type="number"
                  value={row.value}
                  min={0} max={20}
                  onChange={e => onMembersChange(
                    row.key === 'members' ? e.target.value : cartMembers,
                    row.key === 'children' ? e.target.value : cartChildren,
                  )}
                  style={{
                    width: 64, padding: '5px 8px', borderRadius: 7,
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: 'white', fontFamily: 'inherit', fontSize: 13,
                    outline: 'none', textAlign: 'center',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Total */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '12px 0', borderTop: '1px solid rgba(255,255,255,0.15)',
            fontWeight: 700,
          }}>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>Estimated total</span>
            <span style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: 22, fontWeight: 800,
              background: 'linear-gradient(135deg, #fff, #ffd4c2)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              €{cartTotal.toLocaleString()}
            </span>
          </div>

          {/* Register button */}
          <button
            onClick={onRegister}
            disabled={submitting || cartRegistered}
            style={{
              width: '100%', padding: '13px 14px',
              background: cartRegistered ? 'var(--green)' : 'var(--orange)',
              border: 'none', borderRadius: 'var(--radius-sm)',
              color: 'white', fontFamily: "'DM Sans', sans-serif",
              fontSize: 14, fontWeight: 700, cursor: cartRegistered ? 'default' : 'pointer',
              transition: 'all 0.2s', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 8, letterSpacing: 0.2,
              marginTop: 14,
            }}
          >
            {cartRegistered ? '✓ Registered' : submitting ? 'Registering…' : '✓ Register answer'}
          </button>
          <div style={{
            fontSize: 11, color: 'rgba(255,255,255,0.35)', textAlign: 'center',
            marginTop: 8, lineHeight: 1.5,
          }}>
            Saves selection to lead record in HubSpot.
          </div>
        </>
      )}
    </div>
  )
}
