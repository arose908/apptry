import { useState } from 'react'
import BackHeader from '../components/BackHeader.jsx'
import { focusSession as base } from '../data/mock.js'

export default function TimerScreen({ onDone, onBack }) {
  const [extended, setExtended] = useState(false)
  const session = extended
    ? { ...base, elapsed: '24:32', elapsedPct: Math.min(base.elapsedPct + 17, 100) }
    : base

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        boxSizing: 'border-box',
        background: 'var(--ink)',
        padding: '60px 22px 30px',
        color: 'var(--paper)',
        display: 'flex',
        flexDirection: 'column',
        gap: 22,
        overflowY: 'auto',
        zIndex: 25,
      }}
    >
      <BackHeader label="Today" onBack={onBack} dark />
      <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', color: 'var(--text-dark-muted)' }}>
        {session.windowLabel}
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontSize: 26, fontWeight: 600, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
          {session.title}
        </span>
        <span style={{ fontSize: 15, color: 'var(--text-dark-muted-2)' }}>{session.subtitle}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, padding: '26px 0 6px' }}>
        <span
          style={{
            fontSize: 78,
            fontWeight: 600,
            letterSpacing: '-0.04em',
            lineHeight: 0.9,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {session.elapsed}
        </span>
        <span style={{ fontSize: 15, color: 'var(--text-dark-muted)', paddingBottom: 10 }}>elapsed</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ height: 10, borderRadius: 6, background: 'var(--surface-dark-3)', overflow: 'hidden', display: 'flex' }}>
          <span style={{ width: `${session.elapsedPct}%`, background: 'var(--accent)', display: 'block' }} />
          <span style={{ width: `${session.avgPct}%`, background: '#6b6153', display: 'block' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, letterSpacing: '0.04em', color: 'var(--text-dark-muted)' }}>
          <span>YOUR GUESS · {session.estimateMin}M</span>
          <span>YOUR ACTUAL AVERAGE · {session.actualAvgMin}M</span>
        </div>
      </div>

      <div style={{ background: 'var(--surface-dark-2)', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--accent-light-text)' }}>
          CAUGHT SOMETHING
        </span>
        <span style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.35 }}>{session.caught}</span>
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button onClick={onDone} className="btn-primary" style={{ fontSize: 17, padding: 16, borderRadius: 11 }}>
          Done — log it
        </button>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => setExtended(true)}
            style={{ flex: 1, background: 'var(--surface-dark-3)', color: 'var(--paper)', fontSize: 15, fontWeight: 500, textAlign: 'center', padding: 14, borderRadius: 11 }}
          >
            +10 min
          </button>
          <button
            onClick={onDone}
            style={{ flex: 1, background: 'var(--surface-dark-3)', color: 'var(--text-dark-muted-2)', fontSize: 15, fontWeight: 500, textAlign: 'center', padding: 14, borderRadius: 11 }}
          >
            Stopping here
          </button>
        </div>
      </div>
    </div>
  )
}
