import { useState } from 'react'
import BackHeader from '../components/BackHeader.jsx'
import { sortQueue, sortDestinations } from '../data/mock.js'

export default function SortScreen({ onBack, onFinish }) {
  const [index, setIndex] = useState(0)
  const total = sortQueue.length
  const current = sortQueue[index]
  const pct = Math.round(((index + 1) / total) * 100)

  const advance = () => {
    if (index + 1 >= total) {
      onFinish()
    } else {
      setIndex(index + 1)
    }
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        boxSizing: 'border-box',
        background: 'var(--paper)',
        padding: '60px 22px 30px',
        color: 'var(--ink)',
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        overflowY: 'auto',
        zIndex: 26,
      }}
    >
      <BackHeader label="Capture" onBack={onBack} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span className="eyebrow">
          SORTING · {index + 1} OF {total}
        </span>
        <button onClick={onFinish} style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>
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
          {current.capturedAt}
        </span>
        <span style={{ fontSize: 24, fontWeight: 600, lineHeight: 1.25, letterSpacing: '-0.01em' }}>
          {current.text}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        <span className="eyebrow">WHERE DOES IT GO</span>
        {sortDestinations.map((dest) => (
          <button
            key={dest.id}
            onClick={advance}
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
                color: dest.dark ? 'var(--paper)' : dest.dashed ? 'var(--text-muted)' : 'var(--ink)',
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

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ height: 6, borderRadius: 4, background: 'var(--border)', overflow: 'hidden' }}>
          <span style={{ width: `${pct}%`, height: '100%', background: 'var(--accent)', display: 'block' }} />
        </div>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Two minutes. Then the list is honest again.</span>
      </div>
    </div>
  )
}
