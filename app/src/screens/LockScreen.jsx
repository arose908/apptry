import BackHeader from '../components/BackHeader.jsx'
import { nudges } from '../data/mock.js'

export default function LockScreen({ onBack }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        boxSizing: 'border-box',
        background: 'var(--surface-dark-1)',
        padding: '60px 18px 30px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        overflowY: 'auto',
        zIndex: 25,
      }}
    >
      <BackHeader label="Settings" onBack={onBack} dark />
      <div style={{ textAlign: 'center', padding: '10px 0 18px' }}>
        <div style={{ fontSize: 76, fontWeight: 600, color: 'var(--paper)', letterSpacing: '-0.04em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
          11:54
        </div>
        <div style={{ fontSize: 15, color: 'var(--text-dark-muted-2)', paddingTop: 6 }}>Tuesday, September 8</div>
      </div>

      {nudges.map((n) => (
        <div
          key={n.id}
          style={{
            background: `rgba(244,241,234,${n.opacity})`,
            borderRadius: 18,
            padding: '15px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 5,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', color: '#5A5348' }}>RIGHT NOW</span>
            <span style={{ fontSize: 12, color: '#5A5348' }}>{n.time}</span>
          </div>
          <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.3 }}>{n.text}</span>
          {n.actions && (
            <div style={{ display: 'flex', gap: 8, paddingTop: 8 }}>
              {n.actions.map((action, i) => (
                <span
                  key={action}
                  style={{
                    flex: 1,
                    background: i === 0 ? 'var(--ink)' : 'rgba(28,26,23,0.08)',
                    color: i === 0 ? 'var(--paper)' : 'var(--text-muted-2)',
                    fontSize: 14,
                    fontWeight: i === 0 ? 600 : 500,
                    textAlign: 'center',
                    padding: 10,
                    borderRadius: 8,
                  }}
                >
                  {action}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}

      <div style={{ marginTop: 'auto', textAlign: 'center' }}>
        <span style={{ fontSize: 13, color: 'var(--text-dark-muted)', lineHeight: 1.5 }}>
          Persistent, by your setting: three asks, then it logs the miss and moves on.
        </span>
      </div>
    </div>
  )
}
