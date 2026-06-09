import { PAGES } from '../hooks/useAppState.js'

export default function Topbar({ state, onLogoClick }) {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      height: 'var(--topbar-h)',
      background: 'rgba(246,242,235,0.92)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 32px',
    }}>
      {/* Logo */}
      <button
        onClick={onLogoClick}
        style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontSize: 22, fontWeight: 800,
          color: 'var(--purple)', letterSpacing: '-0.3px',
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={e => e.target.style.opacity = 0.75}
        onMouseLeave={e => e.target.style.opacity = 1}
      >
        Lexi<span style={{ color: 'var(--orange)' }}>dy</span>
      </button>

      {/* Breadcrumb */}
      {state.breadcrumb.length > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 13, color: 'var(--text-muted)', fontWeight: 500,
          position: 'absolute', left: '50%', transform: 'translateX(-50%)',
        }}>
          {state.breadcrumb.map((crumb, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {i > 0 && <span style={{ opacity: 0.35, margin: '0 2px' }}>/</span>}
              <span style={
                i === state.breadcrumb.length - 1
                  ? { color: 'var(--purple)', fontWeight: 600 }
                  : {}
              }>{crumb}</span>
            </span>
          ))}
        </div>
      )}

      {/* Right: badges */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {state.eligResult === 'pass' && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '5px 12px', borderRadius: 100,
            fontSize: 11, fontWeight: 700, letterSpacing: 0.3,
            background: 'var(--green-light)', color: 'var(--green)',
            border: '1px solid rgba(61,158,110,0.2)',
          }}>✓ Qualified</span>
        )}
        {(state.contactName || state.contactEmail) && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '5px 12px', borderRadius: 100,
            fontSize: 11, fontWeight: 600,
            background: 'var(--purple-light)', color: 'var(--purple)',
            border: '1px solid var(--border)',
          }}>
            👤 {state.contactName || state.contactEmail}
          </span>
        )}
      </div>
    </div>
  )
}
