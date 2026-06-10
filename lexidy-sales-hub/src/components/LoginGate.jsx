// ══════════════════════════════════════════════════════════════
// LOGIN GATE — advisor authentication (live API mode only)
// ══════════════════════════════════════════════════════════════
//
// Shown when VITE_API_BASE_URL is set and no valid JWT exists.
// One shared advisor password → 12h token in sessionStorage, so
// advisors log in at most once per workday per browser.
//
// In mock/demo mode this component never renders.
//
// ══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { isApiMode, getToken, login } from '../services/apiClient.js'

export default function LoginGate({ children }) {
  const [authed, setAuthed] = useState(() => !isApiMode() || Boolean(getToken()))
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  // Re-show the gate if the token expires mid-session
  useEffect(() => {
    const onExpired = () => setAuthed(false)
    window.addEventListener('lexidy:auth-expired', onExpired)
    return () => window.removeEventListener('lexidy:auth-expired', onExpired)
  }, [])

  if (authed) return children

  async function handleSubmit() {
    if (!password || busy) return
    setBusy(true)
    setError('')
    try {
      await login(password)
      setAuthed(true)
    } catch (e) {
      setError(e.message || 'Login failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--cream)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, padding: '40px 36px',
        boxShadow: '0 8px 32px rgba(44,28,79,0.12)', width: 360, textAlign: 'center',
      }}>
        <div style={{
          fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700,
          fontSize: 22, color: 'var(--purple)', marginBottom: 6,
        }}>
          Lexidy Sales Hub
        </div>
        <div style={{ fontSize: 14, color: '#6b6580', marginBottom: 24 }}>
          Enter the advisor password to continue
        </div>

        <input
          type="password"
          value={password}
          autoFocus
          placeholder="Advisor password"
          onChange={e => { setPassword(e.target.value); setError('') }}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          style={{
            width: '100%', boxSizing: 'border-box', padding: '12px 14px',
            borderRadius: 10, border: error ? '1.5px solid var(--red)' : '1.5px solid #ddd6ea',
            fontSize: 15, outline: 'none', marginBottom: 10,
          }}
        />

        {error && (
          <div style={{ color: 'var(--red)', fontSize: 13, marginBottom: 10 }}>{error}</div>
        )}

        <button
          onClick={handleSubmit}
          disabled={busy || !password}
          style={{
            width: '100%', padding: '12px 0', borderRadius: 10, border: 'none',
            background: 'var(--orange)', color: '#fff', fontWeight: 600,
            fontSize: 15, cursor: busy || !password ? 'default' : 'pointer',
            opacity: busy || !password ? 0.6 : 1,
          }}
        >
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </div>
    </div>
  )
}
