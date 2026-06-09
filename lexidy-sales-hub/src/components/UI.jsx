// ── BUTTON ────────────────────────────────────────────────────
export function Button({ children, variant = 'primary', size, onClick, disabled, style = {}, fullWidth }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: size === 'sm' ? '7px 14px' : '11px 22px',
    borderRadius: 'var(--radius-sm)',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: size === 'sm' ? 12 : 14,
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: 'none',
    transition: 'all 0.18s',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    lineHeight: 1,
    opacity: disabled ? 0.45 : 1,
    width: fullWidth ? '100%' : 'auto',
    justifyContent: fullWidth ? 'center' : 'flex-start',
  }

  const variants = {
    primary:   { background: 'var(--orange)',    color: 'white' },
    secondary: { background: 'var(--white)',     color: 'var(--purple)', border: '1.5px solid var(--border)' },
    dark:      { background: 'var(--purple)',    color: 'white' },
    ghost:     { background: 'transparent',      color: 'var(--purple)', border: '1.5px solid var(--border)', padding: '8px 16px', fontSize: 13 },
  }

  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={{ ...base, ...variants[variant], ...style }}
    >
      {children}
    </button>
  )
}

// ── CARD ──────────────────────────────────────────────────────
export function Card({ children, style = {} }) {
  return (
    <div style={{
      background: 'var(--white)',
      border: '1.5px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '28px 32px',
      ...style,
    }}>
      {children}
    </div>
  )
}

// ── EYEBROW ───────────────────────────────────────────────────
export function Eyebrow({ children }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 7,
      background: 'var(--orange-light)', border: '1px solid #e8c9b8',
      color: 'var(--orange)', fontSize: 11, fontWeight: 700,
      letterSpacing: 0.7, textTransform: 'uppercase',
      padding: '5px 12px', borderRadius: 100,
      marginBottom: 22,
    }}>
      <span style={{ fontSize: 6 }}>●</span>
      {children}
    </div>
  )
}

// ── PAGE TITLE ────────────────────────────────────────────────
export function PageTitle({ children }) {
  return (
    <h1 style={{
      fontFamily: "'Bricolage Grotesque', sans-serif",
      fontSize: 'clamp(32px, 5vw, 52px)',
      fontWeight: 800,
      letterSpacing: '-1.2px',
      lineHeight: 1.08,
      marginBottom: 14,
    }}>
      {children}
    </h1>
  )
}

// ── SECTION TAG ───────────────────────────────────────────────
export function SectionTag({ num, children }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontSize: 11, fontWeight: 700, letterSpacing: 0.8,
      textTransform: 'uppercase', color: 'var(--orange)',
      marginBottom: 20,
    }}>
      {num && (
        <span style={{
          width: 22, height: 22, borderRadius: '50%',
          background: 'var(--orange-light)', color: 'var(--orange)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, fontWeight: 700,
        }}>{num}</span>
      )}
      {children}
    </div>
  )
}

// ── ADVISOR NOTE BANNER ───────────────────────────────────────
export function AdvisorNote({ children }) {
  return (
    <div style={{
      background: 'var(--orange-light)',
      border: '1.5px solid #e8c9b8',
      borderRadius: 'var(--radius)',
      padding: '16px 20px',
      marginBottom: 36,
      fontSize: 12, lineHeight: 1.6, color: 'var(--text-muted)',
    }}>
      {children}
    </div>
  )
}

// ── FLAG PILL ─────────────────────────────────────────────────
export function FlagPill({ type, children }) {
  const styles = {
    ok:   { background: 'var(--green-light)', color: 'var(--green)' },
    warn: { background: 'var(--orange-light)', color: 'var(--orange)' },
    bad:  { background: 'var(--red-light)', color: 'var(--red)' },
  }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '3px 10px', borderRadius: 100,
      fontSize: 11, fontWeight: 600,
      ...(styles[type] || styles.ok),
    }}>
      {children}
    </span>
  )
}

// ── TOAST ─────────────────────────────────────────────────────
export function Toast({ message, type, visible }) {
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9998,
      background: type === 'error' ? 'var(--red)' : 'var(--green)',
      color: 'white',
      padding: '12px 20px', borderRadius: 'var(--radius-sm)',
      fontSize: 13, fontWeight: 600,
      boxShadow: '0 8px 24px rgba(44,28,79,0.3)',
      transform: visible ? 'translateY(0)' : 'translateY(80px)',
      opacity: visible ? 1 : 0,
      transition: 'all 0.25s cubic-bezier(0.22,1,0.36,1)',
      display: 'flex', alignItems: 'center', gap: 8,
    }}>
      {type === 'error' ? '⚠' : '✓'} {message}
    </div>
  )
}
