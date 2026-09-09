import { usePlannerState, usePlannerDispatch } from '../state/store.jsx'
import { habitWeekGrid, habitWeekCount, tasksTouchedThisWeek } from '../state/selectors.js'
import { dateKey } from '../state/dates.js'

export default function HabitsScreen({ settings, onRunPMRoutine }) {
  const state = usePlannerState()
  const dispatch = usePlannerDispatch()
  const blunt = settings.coachTone === 'Blunt coach'
  const now = new Date()
  const today = dateKey(now)
  const { doneCount, droppedCount, total } = tasksTouchedThisWeek(state, now)

  return (
    <div
      style={{
        minHeight: '100%',
        boxSizing: 'border-box',
        background: 'var(--paper)',
        padding: '60px 22px 22px',
        color: 'var(--ink)',
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
      }}
    >
      <span className="eyebrow">FOUR THINGS · THAT'S THE CAP</span>
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
                {habit.type === 'check' && (
                  <button
                    onClick={() => dispatch({ type: 'HABIT_TOGGLE_CHECK', id: habit.id })}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      border: '2px solid var(--border-dashed)',
                      background: doneToday ? 'var(--ink)' : 'transparent',
                      flex: 'none',
                    }}
                  />
                )}
                {habit.type === 'runNow' && (
                  <button onClick={onRunPMRoutine} style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-link)' }}>
                    RUN IT
                  </button>
                )}
              </div>

              {week && (
                <div style={{ display: 'flex', gap: 5 }}>
                  {week.map((v, i) =>
                    v === null ? (
                      <span key={i} style={{ flex: 1, height: 26, borderRadius: 4, border: '2px dashed var(--border-dashed)', boxSizing: 'border-box', display: 'block' }} />
                    ) : (
                      <span
                        key={i}
                        style={{ flex: 1, height: 26, borderRadius: 4, background: v ? 'var(--ink)' : 'var(--border)', display: 'block' }}
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
                      style={{ width: 9, height: 30, borderRadius: 3, background: i < tallyToday ? 'var(--ink)' : 'var(--border)', display: 'block' }}
                    />
                  ))}
                </button>
              )}
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--border)' }}>
        <span style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.45 }}>
          A fifth habit unlocks when one of these hits three weeks. Not before.
        </span>
      </div>
    </div>
  )
}
