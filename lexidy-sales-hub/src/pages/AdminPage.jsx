import { useState, useEffect } from 'react'
import { PAGES } from '../hooks/useAppState.js'
import { fetchCountries, fetchEligibilityQuestions, saveAdminData, resetAdminData } from '../services/dataService.js'
import { Button, Toast } from '../components/UI.jsx'

export default function AdminPage({ setPage, setBreadcrumb }) {
  const [section, setSection] = useState('services')
  const [countries, setCountries] = useState([])
  const [selectedVisaId, setSelectedVisaId] = useState(null)
  const [selectedTier, setSelectedTier] = useState('bronze')
  const [selectedEligVisa, setSelectedEligVisa] = useState(null)
  const [eligQuestions, setEligQuestions] = useState([])
  const [openQIdx, setOpenQIdx] = useState(null)
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchCountries().then(c => {
      setCountries(c)
      if (!selectedVisaId && c.length > 0 && c[0].visas.length > 0) {
        setSelectedVisaId(c[0].visas[0].id)
      }
    })
  }, [])

  useEffect(() => {
    if (section === 'eligibility' && selectedEligVisa) {
      fetchEligibilityQuestions(selectedEligVisa, {}).then(setEligQuestions)
    }
  }, [section, selectedEligVisa])

  function showToast(message, type = 'success') {
    setToast({ visible: true, message, type })
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 2800)
  }

  function getVisaById(visaId) {
    for (const c of countries) {
      const v = c.visas.find(v => v.id === visaId)
      if (v) return v
    }
    return null
  }

  function updateVisaMeta(visaId, field, value) {
    setCountries(prev => prev.map(c => ({
      ...c,
      visas: c.visas.map(v => v.id === visaId ? { ...v, [field]: value } : v)
    })))
  }

  function updatePkg(visaId, tier, field, value) {
    setCountries(prev => prev.map(c => ({
      ...c,
      visas: c.visas.map(v => {
        if (v.id !== visaId) return v
        return {
          ...v,
          packages: {
            ...v.packages,
            [tier]: { ...v.packages[tier], [field]: field === 'priceNote' ? value : (parseFloat(value) || 0) }
          }
        }
      })
    })))
  }

  function updateFeature(visaId, tier, idx, value) {
    setCountries(prev => prev.map(c => ({
      ...c,
      visas: c.visas.map(v => {
        if (v.id !== visaId) return v
        const features = { ...v.features, [tier]: [...(v.features?.[tier] || [])] }
        features[tier][idx] = value
        return { ...v, features }
      })
    })))
  }

  function addFeature(visaId, tier) {
    setCountries(prev => prev.map(c => ({
      ...c,
      visas: c.visas.map(v => {
        if (v.id !== visaId) return v
        const features = { ...v.features, [tier]: [...(v.features?.[tier] || []), 'New feature'] }
        return { ...v, features }
      })
    })))
  }

  function removeFeature(visaId, tier, idx) {
    setCountries(prev => prev.map(c => ({
      ...c,
      visas: c.visas.map(v => {
        if (v.id !== visaId) return v
        const features = { ...v.features, [tier]: (v.features?.[tier] || []).filter((_, i) => i !== idx) }
        return { ...v, features }
      })
    })))
  }

  function updateAddon(visaId, idx, field, value) {
    setCountries(prev => prev.map(c => ({
      ...c,
      visas: c.visas.map(v => {
        if (v.id !== visaId) return v
        const addons = [...(v.addons || [])]
        addons[idx] = { ...addons[idx], [field]: field === 'price' ? (parseFloat(value) || 0) : value }
        return { ...v, addons }
      })
    })))
  }

  function addAddon(visaId) {
    setCountries(prev => prev.map(c => ({
      ...c,
      visas: c.visas.map(v => {
        if (v.id !== visaId) return v
        return {
          ...v,
          addons: [...(v.addons || []), { id: 'addon-' + Date.now(), name: 'New Add-On', desc: 'Description', price: 0 }]
        }
      })
    })))
  }

  function removeAddon(visaId, idx) {
    setCountries(prev => prev.map(c => ({
      ...c,
      visas: c.visas.map(v => {
        if (v.id !== visaId) return v
        return { ...v, addons: (v.addons || []).filter((_, i) => i !== idx) }
      })
    })))
  }

  function updateQuestion(idx, field, value) {
    setEligQuestions(prev => prev.map((q, i) => i === idx ? { ...q, [field]: value } : q))
  }

  function addQuestion() {
    setEligQuestions(prev => [...prev, { id: 'q_' + Date.now(), label: 'New question', type: 'yesno', required: false }])
  }

  function removeQuestion(idx) {
    if (!confirm('Remove this question?')) return
    setEligQuestions(prev => prev.filter((_, i) => i !== idx))
  }

  function moveQuestion(idx, dir) {
    const newIdx = idx + dir
    if (newIdx < 0 || newIdx >= eligQuestions.length) return
    const arr = [...eligQuestions]
    ;[arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]]
    setEligQuestions(arr)
  }

  function addOption(qIdx) {
    setEligQuestions(prev => prev.map((q, i) =>
      i === qIdx ? { ...q, options: [...(q.options || []), 'New option'] } : q
    ))
  }

  function updateOption(qIdx, oIdx, value) {
    setEligQuestions(prev => prev.map((q, i) => {
      if (i !== qIdx) return q
      const options = [...(q.options || [])]
      options[oIdx] = value
      return { ...q, options }
    }))
  }

  function removeOption(qIdx, oIdx) {
    setEligQuestions(prev => prev.map((q, i) =>
      i === qIdx ? { ...q, options: (q.options || []).filter((_, j) => j !== oIdx) } : q
    ))
  }

  async function handleSave() {
    setSaving(true)
    const eligOverrides = selectedEligVisa ? { [selectedEligVisa]: eligQuestions } : {}
    const result = await saveAdminData({
      countries: countries.map(c => ({
        id: c.id,
        visas: c.visas.map(v => ({ ...v }))
      })),
      eligOverrides,
    })
    setSaving(false)
    showToast(result.success ? 'Changes saved successfully' : 'Save failed', result.success ? 'success' : 'error')
  }

  async function handleReset() {
    if (!confirm('Reset ALL changes to defaults? This cannot be undone.')) return
    await resetAdminData()
    location.reload()
  }

  const inputStyle = {
    padding: '8px 12px', border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius-xs)', fontFamily: "'DM Sans', sans-serif",
    fontSize: 13, color: 'var(--purple)', background: 'white', outline: 'none',
  }
  const labelStyle = {
    fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
    letterSpacing: 0.5, color: 'var(--text-muted)', display: 'block', marginBottom: 5,
  }

  const selectedVisa = getVisaById(selectedVisaId)
  const eligVisas = countries.flatMap(c =>
    c.visas.filter(v => ['es-dnv-freelancer','es-dnv-employee','es-nlv','pt-dnv','pt-dnv-family','pt-d7','pt-d7-family','gr-fip','gr-fip-family','fr-visitor','fr-visitor-family','fr-visitor-platinum'].includes(v.id))
      .map(v => ({ country: c, visa: v }))
  )

  return (
    <div className="page-enter" style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      <Toast message={toast.message} type={toast.type} visible={toast.visible} />

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: 'calc(100vh - var(--topbar-h))' }}>

        {/* SIDEBAR */}
        <div style={{
          background: 'var(--purple)', padding: '28px 0',
          position: 'sticky', top: 'var(--topbar-h)',
          height: 'calc(100vh - var(--topbar-h))', overflowY: 'auto',
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', padding: '0 20px 12px' }}>
            Admin Panel
          </div>
          {[
            { id: 'services', icon: '💼', label: 'Services & Pricing' },
            { id: 'eligibility', icon: '✅', label: 'Eligibility Tests' },
          ].map(nav => (
            <div
              key={nav.id}
              onClick={() => setSection(nav.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 20px', cursor: 'pointer',
                fontSize: 13, fontWeight: 500,
                color: section === nav.id ? 'white' : 'rgba(255,255,255,0.6)',
                background: section === nav.id ? 'rgba(255,255,255,0.1)' : 'none',
                borderLeft: `3px solid ${section === nav.id ? 'var(--orange)' : 'transparent'}`,
                transition: 'all 0.15s',
              }}
            >
              <span style={{ width: 20, textAlign: 'center' }}>{nav.icon}</span>
              {nav.label}
            </div>
          ))}
          <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)', margin: '8px 0' }} />
          <div
            onClick={() => { setPage(PAGES.HUB); setBreadcrumb([]) }}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 20px', cursor: 'pointer',
              fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.6)',
              transition: 'all 0.15s',
            }}
          >
            <span style={{ width: 20, textAlign: 'center' }}>←</span>
            Back to Hub
          </div>
        </div>

        {/* MAIN */}
        <div style={{ padding: '36px 40px 80px', overflowY: 'auto' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px' }}>
                {section === 'services' ? 'Services & Pricing' : 'Eligibility Tests'}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
                {section === 'services' ? 'Edit packages, prices, features and add-ons per visa' : 'Edit questions, answer options and pass/fail conditions'}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button variant="secondary" onClick={handleReset} style={{ color: 'var(--red)', borderColor: 'rgba(201,67,67,0.3)' }}>
                ↺ Reset all
              </Button>
              <Button variant="primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : '💾 Save changes'}
              </Button>
            </div>
          </div>

          {/* ── SERVICES SECTION ── */}
          {section === 'services' && (
            <>
              {/* Visa pills grouped by country */}
              <div style={{ marginBottom: 24 }}>
                {countries.map(country => (
                  <div key={country.id} style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.7, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>
                      {country.flag} {country.name}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {country.visas.filter(v => v.active).map(v => (
                        <button
                          key={v.id}
                          onClick={() => { setSelectedVisaId(v.id); setSelectedTier('bronze') }}
                          style={{
                            padding: '7px 14px', borderRadius: 100,
                            fontSize: 12, fontWeight: 600, cursor: 'pointer',
                            border: `1.5px solid ${selectedVisaId === v.id ? 'var(--orange)' : 'var(--border)'}`,
                            background: selectedVisaId === v.id ? 'var(--orange)' : 'white',
                            color: selectedVisaId === v.id ? 'white' : 'var(--text-muted)',
                            transition: 'all 0.15s', whiteSpace: 'nowrap',
                          }}
                        >{v.label}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {selectedVisa && (
                <>
                  {/* Visa meta */}
                  <AdminCard title="📋 Visa Details" defaultOpen>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                      <Field label="Visa Label">
                        <input style={{ ...inputStyle, width: '100%' }} value={selectedVisa.label}
                          onChange={e => updateVisaMeta(selectedVisa.id, 'label', e.target.value)} />
                      </Field>
                      <Field label="Timeline">
                        <input style={{ ...inputStyle, width: '100%' }} value={selectedVisa.timeline || ''}
                          onChange={e => updateVisaMeta(selectedVisa.id, 'timeline', e.target.value)} />
                      </Field>
                    </div>
                    <Field label="Notes">
                      <textarea
                        style={{ ...inputStyle, width: '100%', minHeight: 60, resize: 'vertical' }}
                        value={selectedVisa.notes || ''}
                        onChange={e => updateVisaMeta(selectedVisa.id, 'notes', e.target.value)}
                      />
                    </Field>
                  </AdminCard>

                  {/* Packages & pricing */}
                  <AdminCard title="💰 Packages & Pricing" defaultOpen>
                    {/* Tier tabs */}
                    <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
                      {['bronze','silver','gold','platinum'].map(tier => {
                        const hasTier = selectedVisa.packages?.[tier]
                        const tierColors = {
                          bronze: { bg: '#f5e8e0', border: '#d4906a', color: '#a0522d' },
                          silver: { bg: '#f0f0f0', border: '#aaa', color: '#555' },
                          gold:   { bg: '#fdf3dc', border: '#d4aa44', color: '#8a6900' },
                          platinum: { bg: 'var(--purple)', border: 'var(--purple)', color: 'white' },
                        }[tier]
                        const isActive = selectedTier === tier
                        return (
                          <button
                            key={tier}
                            onClick={() => setSelectedTier(tier)}
                            style={{
                              padding: '6px 14px', borderRadius: 'var(--radius-xs)',
                              fontSize: 12, fontWeight: 700, cursor: 'pointer',
                              border: `1.5px solid ${isActive ? tierColors.border : 'var(--border)'}`,
                              background: isActive ? tierColors.bg : 'white',
                              color: isActive ? tierColors.color : 'var(--text-muted)',
                              opacity: hasTier ? 1 : 0.4,
                              transition: 'all 0.15s',
                            }}
                          >
                            {tier.charAt(0).toUpperCase() + tier.slice(1)}
                          </button>
                        )
                      })}
                    </div>

                    {selectedVisa.packages?.[selectedTier] ? (
                      <>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
                          {[
                            { label: 'Base Price (€)', field: 'price' },
                            { label: 'Family Member (€)', field: 'familyMember' },
                            { label: 'Child (€)', field: 'child' },
                          ].map(({ label, field }) => (
                            <Field key={field} label={label}>
                              <input
                                style={{ ...inputStyle, width: '100%' }} type="number"
                                value={selectedVisa.packages[selectedTier][field] || 0}
                                onChange={e => updatePkg(selectedVisa.id, selectedTier, field, e.target.value)}
                              />
                            </Field>
                          ))}
                        </div>
                        <Field label="Price note (e.g. '+IVA')">
                          <input
                            style={{ ...inputStyle, width: '100%' }}
                            value={selectedVisa.packages[selectedTier].priceNote || ''}
                            onChange={e => updatePkg(selectedVisa.id, selectedTier, 'priceNote', e.target.value)}
                          />
                        </Field>

                        {/* Features */}
                        <div style={{ marginTop: 16 }}>
                          <label style={labelStyle}>Features — {selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1)}</label>
                          {(selectedVisa.features?.[selectedTier] || []).map((f, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', background: 'var(--cream)', borderRadius: 'var(--radius-xs)', marginBottom: 6, border: '1px solid var(--border)' }}>
                              <span style={{ color: 'var(--text-muted)', cursor: 'grab' }}>⠿</span>
                              <input
                                style={{ flex: 1, border: 'none', background: 'transparent', fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'var(--purple)', outline: 'none' }}
                                value={f}
                                onChange={e => updateFeature(selectedVisa.id, selectedTier, i, e.target.value)}
                              />
                              <button onClick={() => removeFeature(selectedVisa.id, selectedTier, i)} style={{ width: 24, height: 24, borderRadius: '50%', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 14 }}>✕</button>
                            </div>
                          ))}
                          <div onClick={() => addFeature(selectedVisa.id, selectedTier)} style={{ color: 'var(--orange)', fontSize: 12, fontWeight: 700, cursor: 'pointer', marginTop: 4 }}>
                            ＋ Add feature
                          </div>
                        </div>
                      </>
                    ) : (
                      <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                        No {selectedTier} package for this visa.
                      </div>
                    )}
                  </AdminCard>

                  {/* Add-ons */}
                  <AdminCard title={`➕ Add-Ons (${(selectedVisa.addons || []).length})`} defaultOpen>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      {(selectedVisa.addons || []).map((addon, i) => (
                        <div key={i} style={{ border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '14px 16px', background: 'white', display: 'flex', flexDirection: 'column', gap: 10 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: 13, fontWeight: 700 }}>Add-on {i + 1}</span>
                            <button onClick={() => removeAddon(selectedVisa.id, i)} style={{ width: 24, height: 24, borderRadius: '50%', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 14 }}>✕</button>
                          </div>
                          {[
                            { label: 'Name', field: 'name', type: 'text' },
                            { label: 'Description', field: 'desc', type: 'text' },
                            { label: 'Price (€)', field: 'price', type: 'number' },
                          ].map(({ label, field, type }) => (
                            <Field key={field} label={label}>
                              <input
                                style={{ ...inputStyle, width: '100%' }} type={type}
                                value={addon[field] || ''}
                                onChange={e => updateAddon(selectedVisa.id, i, field, e.target.value)}
                              />
                            </Field>
                          ))}
                        </div>
                      ))}
                    </div>
                    <div onClick={() => addAddon(selectedVisa.id)} style={{ color: 'var(--orange)', fontSize: 12, fontWeight: 700, cursor: 'pointer', marginTop: 12 }}>
                      ＋ Add new add-on
                    </div>
                  </AdminCard>
                </>
              )}
            </>
          )}

          {/* ── ELIGIBILITY SECTION ── */}
          {section === 'eligibility' && (
            <>
              <div style={{
                background: 'var(--orange-light)', border: '1px solid #e8c9b8',
                borderRadius: 'var(--radius-sm)', padding: '12px 16px',
                fontSize: 12, color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.6,
              }}>
                <strong style={{ color: 'var(--orange)' }}>ℹ️ How this works:</strong> Each visa has a list of questions. Edit labels, types, options, and pass/fail conditions. Questions are shown in order — use the move buttons to reorder them.
              </div>

              {/* Visa selector */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                {eligVisas.map(({ country, visa }) => (
                  <button
                    key={visa.id}
                    onClick={() => {
                      setSelectedEligVisa(visa.id)
                      setOpenQIdx(null)
                      fetchEligibilityQuestions(visa.id, {}).then(setEligQuestions)
                    }}
                    style={{
                      padding: '7px 14px', borderRadius: 100,
                      fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
                      border: `1.5px solid ${selectedEligVisa === visa.id ? 'var(--orange)' : 'var(--border)'}`,
                      background: selectedEligVisa === visa.id ? 'var(--orange)' : 'white',
                      color: selectedEligVisa === visa.id ? 'white' : 'var(--text-muted)',
                      transition: 'all 0.15s',
                    }}
                  >
                    {country.flag} {visa.label}
                  </button>
                ))}
              </div>

              {selectedEligVisa && (
                <>
                  {eligQuestions.map((q, i) => (
                    <div key={i} style={{ border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', marginBottom: 10, background: 'white', overflow: 'hidden' }}>
                      {/* Q header */}
                      <div
                        onClick={() => setOpenQIdx(openQIdx === i ? null : i)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '10px 14px', cursor: 'pointer',
                          background: openQIdx === i ? '#edeae0' : 'var(--cream)',
                          borderBottom: openQIdx === i ? '1px solid var(--border)' : '1px solid transparent',
                        }}
                      >
                        <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--orange-light)', color: 'var(--orange)', fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</div>
                        <div style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>{q.label || '(no label)'}</div>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)', background: 'var(--cream)', padding: '2px 8px', borderRadius: 4, border: '1px solid var(--border)' }}>{q.type}</span>
                        <button onClick={e => { e.stopPropagation(); removeQuestion(i) }} style={{ width: 24, height: 24, borderRadius: '50%', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 14 }}>✕</button>
                      </div>

                      {/* Q body */}
                      {openQIdx === i && (
                        <div style={{ padding: 16 }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                            <Field label="Question label">
                              <input style={{ ...inputStyle, width: '100%' }} value={q.label || ''} onChange={e => updateQuestion(i, 'label', e.target.value)} />
                            </Field>
                            <Field label="Answer type">
                              <select style={{ ...inputStyle, width: '100%', cursor: 'pointer' }} value={q.type} onChange={e => updateQuestion(i, 'type', e.target.value)}>
                                {['text','number','currency','yesno','select','info'].map(t => <option key={t} value={t}>{t}</option>)}
                              </select>
                            </Field>
                          </div>
                          <Field label="Hint text (optional)">
                            <input style={{ ...inputStyle, width: '100%' }} value={q.hint || ''} onChange={e => updateQuestion(i, 'hint', e.target.value)} />
                          </Field>

                          {/* Conditions */}
                          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                            <label style={labelStyle}>Pass / Fail Conditions</label>

                            {[
                              { key: 'disqualifyIf', msgKey: 'disqualifyMsg', label: 'Disqualify if answer =' },
                              { key: 'reviewIf', msgKey: 'reviewMsg', label: 'Review flag if answer =' },
                            ].map(cond => (
                              <div key={cond.key} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                                <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', width: 160, flexShrink: 0 }}>{cond.label}</span>
                                <select style={{ ...inputStyle, width: 110 }} value={q[cond.key] || ''} onChange={e => updateQuestion(i, cond.key, e.target.value)}>
                                  <option value="">— none —</option>
                                  <option value="Yes">Yes</option>
                                  <option value="No">No</option>
                                </select>
                                <input style={{ ...inputStyle, flex: 1, minWidth: 120 }} placeholder="Message shown to advisor..." value={q[cond.msgKey] || ''} onChange={e => updateQuestion(i, cond.msgKey, e.target.value)} />
                              </div>
                            ))}

                            {q.type === 'currency' && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                                <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', width: 160, flexShrink: 0 }}>Threshold (€)</span>
                                <input style={{ ...inputStyle, width: 110 }} type="number" value={q.threshold || ''} onChange={e => updateQuestion(i, 'threshold', parseFloat(e.target.value) || 0)} />
                                <select style={{ ...inputStyle, width: 190 }} value={q.disqualifyBelow ? 'disq' : q.reviewBelow ? 'rev' : ''} onChange={e => {
                                  updateQuestion(i, 'disqualifyBelow', e.target.value === 'disq')
                                  updateQuestion(i, 'reviewBelow', e.target.value === 'rev')
                                }}>
                                  <option value="">No action below threshold</option>
                                  <option value="disq">Disqualify if below</option>
                                  <option value="rev">Review flag if below</option>
                                </select>
                              </div>
                            )}

                            {q.type === 'select' && (
                              <div style={{ marginTop: 12 }}>
                                <label style={labelStyle}>Dropdown options</label>
                                {(q.options || []).map((opt, oi) => (
                                  <div key={oi} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', background: 'var(--cream)', borderRadius: 'var(--radius-xs)', marginBottom: 6, border: '1px solid var(--border)' }}>
                                    <input style={{ flex: 1, border: 'none', background: 'transparent', fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'var(--purple)', outline: 'none' }} value={opt} onChange={e => updateOption(i, oi, e.target.value)} />
                                    <button onClick={() => removeOption(i, oi)} style={{ width: 24, height: 24, borderRadius: '50%', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 14 }}>✕</button>
                                  </div>
                                ))}
                                <div onClick={() => addOption(i)} style={{ color: 'var(--orange)', fontSize: 12, fontWeight: 700, cursor: 'pointer', marginTop: 4 }}>＋ Add option</div>
                              </div>
                            )}
                          </div>

                          {/* Move buttons */}
                          <div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'flex-end' }}>
                            {i > 0 && <Button variant="secondary" size="sm" onClick={() => moveQuestion(i, -1)}>↑ Move up</Button>}
                            {i < eligQuestions.length - 1 && <Button variant="secondary" size="sm" onClick={() => moveQuestion(i, 1)}>↓ Move down</Button>}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  <div onClick={addQuestion} style={{ color: 'var(--orange)', fontSize: 12, fontWeight: 700, cursor: 'pointer', marginTop: 12 }}>
                    ＋ Add question
                  </div>
                </>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  )
}

// ── REUSABLE ADMIN CARD ───────────────────────────────────────
function AdminCard({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{ background: 'white', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', marginBottom: 16, overflow: 'hidden' }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', cursor: 'pointer',
          borderBottom: open ? '1px solid var(--border)' : '1px solid transparent',
          transition: 'background 0.15s',
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 700 }}>{title}</span>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }}>▼</span>
      </div>
      {open && <div style={{ padding: 20 }}>{children}</div>}
    </div>
  )
}

// ── FIELD ─────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--text-muted)' }}>
        {label}
      </label>
      {children}
    </div>
  )
}
