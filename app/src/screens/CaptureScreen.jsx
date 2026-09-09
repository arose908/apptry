import { useEffect, useRef, useState } from 'react'
import BackHeader from '../components/BackHeader.jsx'
import { usePlannerState, usePlannerDispatch } from '../state/store.jsx'
import { timeAgo } from '../state/dates.js'

const SpeechRecognitionCtor =
  typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null

export default function CaptureScreen({ onBack, onSort }) {
  const state = usePlannerState()
  const dispatch = usePlannerDispatch()
  const [draft, setDraft] = useState('')
  const [recording, setRecording] = useState(false)
  const recognitionRef = useRef(null)

  useEffect(() => {
    if (!SpeechRecognitionCtor) return
    const rec = new SpeechRecognitionCtor()
    rec.continuous = true
    rec.interimResults = false
    rec.onresult = (e) => {
      let text = ''
      for (let i = e.resultIndex; i < e.results.length; i++) text += e.results[i][0].transcript
      setDraft((d) => (d ? `${d}\n${text}` : text))
    }
    rec.onend = () => setRecording(false)
    recognitionRef.current = rec
    return () => rec.stop()
  }, [])

  const startRecording = () => {
    if (!recognitionRef.current) return
    setRecording(true)
    recognitionRef.current.start()
  }
  const stopRecording = () => {
    if (!recognitionRef.current) return
    recognitionRef.current.stop()
    setRecording(false)
  }

  const saveDraft = () => {
    const lines = draft.split('\n').filter((l) => l.trim())
    if (!lines.length) return
    dispatch({ type: 'ADD_CAPTURE', texts: lines, source: 'text' })
    setDraft('')
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
        zIndex: 25,
      }}
    >
      <BackHeader label="Today" onBack={onBack} />
      <span className="eyebrow">DUMP</span>
      <p style={{ margin: 0, fontSize: 22, fontWeight: 600, lineHeight: 1.25, letterSpacing: '-0.01em' }}>
        No categories. No due date. Just get it out of your head.
      </p>

      <div className="card" style={{ minHeight: 132, display: 'flex', flexDirection: 'column', gap: 8, padding: 16, borderRadius: 12 }}>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type it. One thing per line."
          rows={4}
          style={{
            border: 'none',
            background: 'transparent',
            fontSize: 17,
            lineHeight: 1.4,
            color: 'var(--ink)',
            resize: 'none',
            fontFamily: 'inherit',
            width: '100%',
          }}
        />
        {draft.trim() && (
          <button onClick={saveDraft} className="link-cta" style={{ alignSelf: 'flex-end' }}>
            Save to inbox →
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button
          disabled={!SpeechRecognitionCtor}
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onMouseLeave={() => recording && stopRecording()}
          onTouchStart={startRecording}
          onTouchEnd={stopRecording}
          style={{
            flex: 1,
            background: SpeechRecognitionCtor ? 'var(--ink)' : 'var(--surface-dark-3)',
            opacity: SpeechRecognitionCtor ? 1 : 0.5,
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
            <span style={{ fontWeight: 400, color: 'var(--text-dark-muted)' }}>
              {SpeechRecognitionCtor ? 'works in the car' : 'needs Chrome'}
            </span>
          </span>
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <span className="eyebrow">IN THE INBOX</span>
        {state.captureInbox.length === 0 && (
          <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>Nothing waiting. You're caught up.</span>
        )}
        {state.captureInbox.slice(0, 5).map((item) => (
          <div key={item.id} className="card" style={{ padding: '13px 14px', borderRadius: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
              {item.source === 'voice' ? 'VOICE' : 'CAPTURED'} · {timeAgo(item.capturedAt)}
            </span>
            <span style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.35 }}>{item.text}</span>
          </div>
        ))}
      </div>

      {state.captureInbox.length > 0 && (
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
            {state.captureInbox.length} thing{state.captureInbox.length === 1 ? '' : 's'} in here. Sorting takes 2 minutes.
          </span>
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent-link)', whiteSpace: 'nowrap' }}>
            Sort →
          </span>
        </button>
      )}
    </div>
  )
}
