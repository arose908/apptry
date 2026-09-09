import { useState } from 'react'
import BackHeader from '../components/BackHeader.jsx'
import { usePlannerState, usePlannerDispatch } from '../state/store.jsx'
import { timeAgo } from '../state/dates.js'

const DESTINATIONS = [
  { id: 'wedding', label: 'Wedding list', hint: 'out of your day', dark: true },
  { id: 'today', label: "Today's list", hint: 'pick a minute guess' },
  { id: 'someday', label: 'Someday pile', hint: 'no guilt, no reminders' },
  { id: 'delete', label: "Delete — it wasn't real", dashed: true },
]

const MINUTE_OPTIONS = [10, 20, 30, 45]

export default function SortScreen({ onBack, onFinish }) {
  const state = usePlannerState()
  const dispatch = usePlannerDispatch()
  const [pickingMinutes, setPickingMinutes] = useState(false)
  const [startTotal] = useState(() => state.captureInbox.length)
  const queue = state.captureInbox
  const total = queue.length
  const current = queue[0]

  if (!current) {
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          boxSizing: 'border-box',
          background: 'var(--page-bg)',
          padding: '60px 22px 30px',
          color: 'var(--text-primary)',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          zIndex: 26,
        }}
      >
        <BackHeader label="Capture" onBack={onBack} />
        <div style={{ margin: 'auto', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ fontSize: 20, fontWeight: 600 }}>All sorted.</span>
          <button onClick={onFinish} className="btn-primary">
            Done
          </button>
        </div>
      </div>
    )
  }

  const pct = Math.round(((startTotal - total) / startTotal) * 100)

  const sortTo = (destId, minutes) => {
    if (destId === 'delete') {
      dispatch({ type: 'DELETE_CAPTURE', id: current.id })
    } else if (destId === 'wedding') {
      dispatch({ type: 'SORT_TO_TASK', id: current.id, status: 'wedding' })
    } else if (destId === 'someday') {
      dispatch({ type: 'SORT_TO_TASK', id: current.id, status: 'someday' })
    } else if (destId === 'today') {
      dispatch({ type: 'SORT_TO_TASK', id: current.id, status: 'today', minutes })
    }
    setPickingMinutes(false)
  }

  const skipAll = () => onFinish()

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        boxSizing: 'border-box',
        background: 'var(--page-bg)',
        padding: '60px 22px 30px',
        color: 'var(--text-primary)',
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        overflowY: 'auto',
        zIndex: 26,
      }}
    >
      <BackHeader label="Capture" onBack={onBack} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span className="eyebrow">{total} LEFT TO SORT</span>
        <button onClick={skipAll} style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>
          Skip all
        </button>
      </div>

      <div
        className="card"
        style={{
          borderRadius: 14,
          padding: 22,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          boxShadow: '0 2px 0 var(--border), 0 10px 0 -4px var(--card), 0 11px 0 -4px var(--border)',
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
          CAPTURED {timeAgo(current.capturedAt).toUpperCase()}
        </span>
        <span style={{ fontSize: 24, fontWeight: 600, lineHeight: 1.25, letterSpacing: '-0.01em' }}>
          {current.text}
        </span>
      </div>

      {pickingMinutes ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          <span className="eyebrow">HOW LONG, ROUGHLY</span>
          <div style={{ display: 'flex', gap: 8 }}>
            {MINUTE_OPTIONS.map((m) => (
              <button
                key={m}
                onClick={() => sortTo('today', m)}
                style={{
                  flex: 1,
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  padding: '14px 6px',
                  fontSize: 15,
                  fontWeight: 600,
                }}
              >
                {m}m
              </button>
            ))}
          </div>
          <button onClick={() => setPickingMinutes(false)} style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            ← back
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          <span className="eyebrow">WHERE DOES IT GO</span>
          {DESTINATIONS.map((dest) => (
            <button
              key={dest.id}
              onClick={() => (dest.id === 'today' ? setPickingMinutes(true) : sortTo(dest.id))}
              style={{
                background: dest.dark ? 'var(--ink)' : dest.dashed ? 'transparent' : 'var(--card)',
                border: dest.dashed ? '1px dashed var(--border-dashed)' : dest.dark ? 'none' : '1px solid var(--border)',
                borderRadius: 11,
                padding: '15px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                textAlign: 'left',
              }}
            >
              <span
                style={{
                  fontSize: 16,
                  fontWeight: dest.dark ? 600 : 500,
                  color: dest.dark ? 'var(--paper)' : dest.dashed ? 'var(--text-muted)' : 'var(--text-primary)',
                }}
              >
                {dest.label}
              </span>
              {dest.hint && (
                <span style={{ fontSize: 13, color: dest.dark ? 'var(--text-dark-muted)' : 'var(--text-muted)' }}>
                  {dest.hint}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ height: 6, borderRadius: 4, background: 'var(--border)', overflow: 'hidden' }}>
          <span style={{ width: `${pct}%`, height: '100%', background: 'var(--accent)', display: 'block' }} />
        </div>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Two minutes. Then the list is honest again.</span>
      </div>
    </div>
  )
}
