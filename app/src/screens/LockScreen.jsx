import { useEffect, useState } from 'react'
import BackHeader from '../components/BackHeader.jsx'
import { usePlannerState, usePlannerDispatch } from '../state/store.jsx'
import { nextNudge } from '../state/selectors.js'
import { formatClockFromDate, formatFullDate } from '../state/dates.js'

export default function LockScreen({ onBack }) {
  const state = usePlannerState()
  const dispatch = usePlannerDispatch()
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const nudges = nextNudge(state, now)

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
          {formatClockFromDate(now)}
        </div>
        <div style={{ fontSize: 15, color: 'var(--text-dark-muted-2)', paddingTop: 6 }}>{formatFullDate(now)}</div>
      </div>

      {nudges.length === 0 && (
        <div style={{ background: 'rgba(244,241,234,0.94)', borderRadius: 18, padding: '15px 16px' }}>
          <span style={{ fontSize: 15, color: 'var(--text-muted-2)' }}>Nothing pending in the next hour.</span>
        </div>
      )}

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
          {n.habitId && (
            <div style={{ display: 'flex', gap: 8, paddingTop: 8 }}>
              <button
                onClick={() => dispatch({ type: 'HABIT_TOGGLE_CHECK', id: n.habitId })}
                style={{ flex: 1, background: 'var(--ink)', color: 'var(--paper)', fontSize: 14, fontWeight: 600, textAlign: 'center', padding: 10, borderRadius: 8 }}
              >
                Done
              </button>
              <button
                onClick={onBack}
                style={{ flex: 1, background: 'rgba(28,26,23,0.08)', color: 'var(--text-muted-2)', fontSize: 14, fontWeight: 500, textAlign: 'center', padding: 10, borderRadius: 8 }}
              >
                Not now
              </button>
            </div>
          )}
        </div>
      ))}

      <div style={{ marginTop: 'auto', textAlign: 'center' }}>
        <span style={{ fontSize: 13, color: 'var(--text-dark-muted)', lineHeight: 1.5 }}>
          This is a preview — a browser tab can't show real lock-screen notifications.
        </span>
      </div>
    </div>
  )
}
