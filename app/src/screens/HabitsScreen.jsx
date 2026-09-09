import { useState } from 'react'
import { usePlannerState, usePlannerDispatch } from '../state/store.jsx'
import { habitWeekGrid, habitWeekCount, tasksTouchedThisWeek, habitCap, streakUnlockProgress } from '../state/selectors.js'
import { dateKey } from '../state/dates.js'

export default function HabitsScreen({ settings, onRunPMRoutine }) {
  const state = usePlannerState()
  const dispatch = usePlannerDispatch()
  const blunt = settings.coachTone === 'Blunt coach'
  const now = new Date()
  const today = dateKey(now)
  const { doneCount, droppedCount, total } = tasksTouchedThisWeek(state, now)
  const [adding, setAdding] = useState(false)
  const [title, setTitle] = useState('')
  const [habitType, setHabitType] = useState('check')

  const cap = habitCap(state.habits, now)
  const progress = streakUnlockProgress(state.habits, now)
  const canAdd = state.habits.length < cap

  const addHabit = () => {
    if (!title.trim()) return
    dispatch({ type: 'ADD_HABIT', title: title.trim(), habitType })
    setTitle('')
    setHabitType('check')
    setAdding(false)
  }

  const removeHabit = (id, habitTitle) => {
    if (window.confirm(`Remove "${habitTitle}"? Its history goes with it.`)) {
      dispatch({ type: 'DELETE_HABIT', id })
    }
  }

  return (
    <div
      style={{
        minHeight: '100%',
        boxSizing: 'border-box',
        background: 'var(--page-bg)',
        padding: '60px 22px 22px',
        color: 'var(--text-primary)',
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
      }}
    >
      <span className="eyebrow">
        {cap} THING{cap === 1 ? '' : 'S'} · {progress.current >= progress.target ? "THAT'S THE CAP, EXPANDED" : "THAT'S THE CAP"}
      </span>
      {total === 0 ? (
        <p style={{ margin: 0, fontSize: 21, fontWeight: 600, lineHeight: 1.25, letterSpacing: '-0.01em' }}>
          Nothing finished or dropped yet this week.
        </p>
      ) : blunt ? (
        <p style={{ margin: 0, fontSize: 21, fontWeight: 600, lineHeight: 1.25, letterSpacing: '-0.01em' }}>
          You dropped {droppedCount} of {total} this week. That's still a week.
        </p>
      ) : (
        <p style={{ margin: 0, fontSize: 21, fontWeight: 600, lineHeight: 1.25, letterSpacing: '-0.01em' }}>
          {doneCount} of {total} this week. Keep going.
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {state.habits.map((habit) => {
          const week = habit.type === 'check' ? habitWeekGrid(habit, now) : null
          const weekCount = habit.type === 'check' ? habitWeekCount(habit, now) : null
          const doneToday = habit.type === 'check' ? Boolean(habit.history[today]) : false
          const tallyToday = habit.type === 'tally' ? habit.history[today] || 0 : 0

          return (
            <div key={habit.id} className="card" style={{ borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <span style={{ fontSize: 17, fontWeight: 600 }}>{habit.title}</span>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    {habit.type === 'tally' ? `${tallyToday} of ${habit.target} · ${habit.meta}` : habit.meta}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 'none' }}>
                  {habit.type === 'check' && (
                    <button
                      onClick={() => dispatch({ type: 'HABIT_TOGGLE_CHECK', id: habit.id })}
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: '50%',
                        border: '2px solid var(--border-dashed)',
                        background: doneToday ? 'var(--text-primary)' : 'transparent',
                        flex: 'none',
                      }}
                    />
                  )}
                  {habit.type === 'runNow' && (
                    <button onClick={onRunPMRoutine} style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-link)' }}>
                      RUN IT
                    </button>
                  )}
                  <button
                    onClick={() => removeHabit(habit.id, habit.title)}
                    aria-label={`Remove ${habit.title}`}
                    style={{ fontSize: 13, color: 'var(--text-muted)', flex: 'none' }}
                  >
                    ×
                  </button>
                </div>
              </div>

              {week && (
                <div style={{ display: 'flex', gap: 5 }}>
                  {week.map((v, i) =>
                    v === null ? (
                      <span key={i} style={{ flex: 1, height: 26, borderRadius: 4, border: '2px dashed var(--border-dashed)', boxSizing: 'border-box', display: 'block' }} />
                    ) : (
                      <span
                        key={i}
                        style={{ flex: 1, height: 26, borderRadius: 4, background: v ? 'var(--text-primary)' : 'var(--border)', display: 'block' }}
                      />
                    ),
                  )}
                </div>
              )}

              {habit.weeklyTarget && (
                <span style={{ fontSize: 13, color: 'var(--accent-link)', fontWeight: 600 }}>
                  {weekCount} of {habit.weeklyTarget} done{weekCount >= habit.weeklyTarget ? '.' : `. ${habit.weeklyTarget - weekCount} to go.`}
                </span>
              )}

              {habit.type === 'tally' && (
                <button
                  onClick={() =>
                    dispatch({
                      type: 'HABIT_SET_TALLY',
                      id: habit.id,
                      value: tallyToday >= habit.target ? 0 : tallyToday + 1,
                    })
                  }
                  style={{ display: 'flex', gap: 4 }}
                  aria-label="Add a glass"
                >
                  {Array.from({ length: habit.target }).map((_, i) => (
                    <span
                      key={i}
                      style={{ width: 9, height: 30, borderRadius: 3, background: i < tallyToday ? 'var(--text-primary)' : 'var(--border)', display: 'block' }}
                    />
                  ))}
                </button>
              )}
            </div>
          )
        })}
      </div>

      {adding ? (
        <div className="card" style={{ borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's the habit?"
            style={{ background: 'var(--page-bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px', fontSize: 14, color: 'var(--text-primary)' }}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { id: 'check', label: 'Check off daily' },
              { id: 'tally', label: 'Count reps' },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setHabitType(opt.id)}
                style={{
                  flex: 1,
                  padding: '9px 10px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  background: habitType === opt.id ? 'var(--ink)' : 'var(--page-bg)',
                  color: habitType === opt.id ? 'var(--paper)' : 'var(--text-primary)',
                  border: '1px solid var(--border)',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={addHabit} className="btn-primary" style={{ flex: 1, fontSize: 14, padding: 10 }}>
              Add
            </button>
            <button onClick={() => setAdding(false)} style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        canAdd && (
          <button onClick={() => setAdding(true)} style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-link)', textAlign: 'left' }}>
            + add a habit
          </button>
        )
      )}

      <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--border)' }}>
        <span style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.45 }}>
          {progress.current >= progress.target
            ? 'A 5th habit unlocked — a streak held for three weeks straight.'
            : `A 5th habit unlocks at a 3-week streak. Longest right now: ${progress.current} day${progress.current === 1 ? '' : 's'}.`}
        </span>
      </div>
    </div>
  )
}
