import { useEffect, useState } from 'react'
import BackHeader from '../components/BackHeader.jsx'
import { usePlannerDispatch, usePlannerState } from '../state/store.jsx'
import { formatElapsed } from '../state/dates.js'

export default function TimerScreen({ task, onDone, onBack }) {
  const dispatch = usePlannerDispatch()
  const state = usePlannerState()
  const [startTime] = useState(() => Date.now())
  const [seconds, setSeconds] = useState(0)
  const [extendedMin, setExtendedMin] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setSeconds(Math.round((Date.now() - startTime) / 1000)), 1000)
    return () => clearInterval(t)
  }, [startTime])

  const estimateMin = task.estimateMin || 15
  const targetMin = estimateMin + extendedMin
  const elapsedMin = seconds / 60
  const elapsedPct = Math.min(100, Math.round((elapsedMin / targetMin) * 100))

  const priorSessions = state.timerLog.filter((l) => l.title === task.title)
  const actualAvgMin = priorSessions.length
    ? Math.round(priorSessions.reduce((s, l) => s + l.actualMin, 0) / priorSessions.length)
    : null
  const avgPct = actualAvgMin ? Math.min(100, Math.round((actualAvgMin / targetMin) * 100)) : 0

  const finish = () => {
    const actualMin = Math.max(1, Math.round(elapsedMin))
    dispatch({ type: 'LOG_TIMER_SESSION', taskId: task.id, title: task.title, estimateMin, actualMin })
    dispatch({ type: 'COMPLETE_TASK', id: task.id })
    onDone()
  }

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
        FOCUS SESSION
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontSize: 26, fontWeight: 600, lineHeight: 1.2, letterSpacing: '-0.02em' }}>{task.title}</span>
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
          {formatElapsed(seconds)}
        </span>
        <span style={{ fontSize: 15, color: 'var(--text-dark-muted)', paddingBottom: 10 }}>elapsed</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ height: 10, borderRadius: 6, background: 'var(--surface-dark-3)', overflow: 'hidden', display: 'flex' }}>
          <span style={{ width: `${elapsedPct}%`, background: 'var(--accent)', display: 'block' }} />
          {avgPct > elapsedPct && (
            <span style={{ width: `${avgPct - elapsedPct}%`, background: '#6b6153', display: 'block' }} />
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, letterSpacing: '0.04em', color: 'var(--text-dark-muted)' }}>
          <span>YOUR GUESS · {estimateMin}M</span>
          <span>{actualAvgMin ? `YOUR ACTUAL AVERAGE · ${actualAvgMin}M` : 'FIRST TIME TIMING THIS'}</span>
        </div>
      </div>

      {elapsedMin > estimateMin && (
        <div style={{ background: 'var(--surface-dark-2)', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--accent-light-text)' }}>
            CAUGHT SOMETHING
          </span>
          <span style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.35 }}>
            You're past your {estimateMin} minute guess. Still worth finishing?
          </span>
        </div>
      )}

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button onClick={finish} className="btn-primary" style={{ fontSize: 17, padding: 16, borderRadius: 11 }}>
          Done — log it
        </button>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => setExtendedMin((m) => m + 10)}
            style={{ flex: 1, background: 'var(--surface-dark-3)', color: 'var(--paper)', fontSize: 15, fontWeight: 500, textAlign: 'center', padding: 14, borderRadius: 11 }}
          >
            +10 min
          </button>
          <button
            onClick={finish}
            style={{ flex: 1, background: 'var(--surface-dark-3)', color: 'var(--text-dark-muted-2)', fontSize: 15, fontWeight: 500, textAlign: 'center', padding: 14, borderRadius: 11 }}
          >
            Stopping here
          </button>
        </div>
      </div>
    </div>
  )
}
