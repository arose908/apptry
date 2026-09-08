import { useState } from 'react'
import BackHeader from '../components/BackHeader.jsx'
import { capture } from '../data/mock.js'

export default function CaptureScreen({ onBack, onSort }) {
  const [recording, setRecording] = useState(false)

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
        zIndex: 25,
      }}
    >
      <BackHeader label="Today" onBack={onBack} />
      <span className="eyebrow">DUMP</span>
      <p style={{ margin: 0, fontSize: 22, fontWeight: 600, lineHeight: 1.25, letterSpacing: '-0.01em' }}>
        No categories. No due date. Just get it out of your head.
      </p>

      <div className="card" style={{ minHeight: 132, display: 'flex', flexDirection: 'column', gap: 8, padding: 16, borderRadius: 12 }}>
        {capture.draftLines.map((line, i) => (
          <span key={i} style={{ fontSize: 17, lineHeight: 1.4 }}>
            {line}
          </span>
        ))}
        <span style={{ width: 2, height: 22, background: 'var(--accent)', display: 'block' }} />
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onMouseDown={() => setRecording(true)}
          onMouseUp={() => setRecording(false)}
          onMouseLeave={() => setRecording(false)}
          style={{
            flex: 1,
            background: 'var(--ink)',
            borderRadius: 12,
            padding: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <span
            style={{
              width: 12,
              height: 20,
              borderRadius: 6,
              background: recording ? '#ff5b3d' : 'var(--accent)',
              display: 'block',
            }}
          />
          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--paper)', lineHeight: 1.3, textAlign: 'left' }}>
            {recording ? 'Listening…' : 'Hold to talk'}
            <br />
            <span style={{ fontWeight: 400, color: 'var(--text-dark-muted)' }}>works in the car</span>
          </span>
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <span className="eyebrow">ALSO CAME IN</span>
        {capture.alsoCameIn.map((item) => (
          <div key={item.id} className="card" style={{ padding: '13px 14px', borderRadius: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
              {item.kind}
            </span>
            <span style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.35 }}>{item.text}</span>
          </div>
        ))}
      </div>

      <button
        onClick={onSort}
        style={{
          marginTop: 'auto',
          background: 'var(--chip-bg)',
          border: '1px solid var(--chip-border)',
          borderRadius: 11,
          padding: '14px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--ink)', lineHeight: 1.35 }}>
          {capture.pendingCount} things in here. Sorting takes 2 minutes.
        </span>
        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent-link)', whiteSpace: 'nowrap' }}>
          Sort →
        </span>
      </button>
    </div>
  )
}
