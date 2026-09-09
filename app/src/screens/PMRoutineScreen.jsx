import BackHeader from '../components/BackHeader.jsx'
import { usePlannerState, usePlannerDispatch } from '../state/store.jsx'
import { dateKey } from '../state/dates.js'

export default function PMRoutineScreen({ onBack, onDone }) {
  const state = usePlannerState()
  const dispatch = usePlannerDispatch()
  const steps = state.pmRoutine.steps
  const total = steps.length
  const doneIds = state.pmRoutine.history[dateKey()] || []
  const stepIndex = steps.findIndex((s) => !doneIds.includes(s.id))
  const current = stepIndex === -1 ? steps[total - 1] : steps[stepIndex]

  const next = () => {
    if (stepIndex === -1) {
      onDone()
      return
    }
    dispatch({ type: 'PM_STEP_DONE', stepId: current.id })
    if (stepIndex + 1 >= total) onDone()
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        boxSizing: 'border-box',
        background: 'var(--surface-dark-1)',
        padding: '60px 22px 30px',
        color: 'var(--paper)',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        overflowY: 'auto',
        zIndex: 25,
      }}
    >
      <BackHeader label="Habits" onBack={onBack} dark />
      <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', color: 'var(--text-dark-muted)' }}>
        PM ROUTINE · STEP {Math.min(stepIndex + 1, total)} OF {total}
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{ fontSize: 30, fontWeight: 600, lineHeight: 1.15, letterSpacing: '-0.02em' }}>
          {current.title}
        </span>
        {current.subtitle && (
          <span style={{ fontSize: 16, color: 'var(--text-dark-muted-2)', lineHeight: 1.4 }}>{current.subtitle}</span>
        )}
      </div>

      <div style={{ display: 'flex', gap: 6 }}>
        {steps.map((s) => (
          <span
            key={s.id}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 3,
              background: doneIds.includes(s.id) || s.id === current.id ? 'var(--accent)' : 'var(--surface-dark-4)',
              display: 'block',
            }}
          />
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 6 }}>
        {steps.map((s, i) => {
          const isDone = doneIds.includes(s.id)
          const isCurrent = s.id === current.id
          return (
            <div
              key={s.id}
              style={{
                display: 'flex',
                gap: 12,
                alignItems: 'center',
                padding: '13px 0',
                borderBottom: i < total - 1 ? '1px solid var(--surface-dark-3)' : 'none',
              }}
            >
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: isDone ? 'var(--surface-dark-4)' : 'transparent',
                  border: isCurrent && !isDone ? '2px solid var(--accent)' : isDone ? 'none' : '2px solid var(--surface-dark-4)',
                  display: 'block',
                  flex: 'none',
                }}
              />
              <span
                style={{
                  fontSize: isCurrent ? 17 : 16,
                  fontWeight: isCurrent ? 600 : 400,
                  color: isDone ? 'var(--text-dark-muted)' : isCurrent ? 'var(--paper)' : 'var(--text-dark-muted-2)',
                  textDecoration: isDone ? 'line-through' : 'none',
                }}
              >
                {s.title}
              </span>
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button onClick={next} className="btn-primary" style={{ fontSize: 17, padding: 17, borderRadius: 11 }}>
          {stepIndex === -1 ? 'All done' : 'Done, next'}
        </button>
        <button onClick={onBack} style={{ fontSize: 14, color: 'var(--text-dark-muted)', textAlign: 'center' }}>
          Bail out — keeps the {doneIds.length} you did
        </button>
      </div>
    </div>
  )
}
