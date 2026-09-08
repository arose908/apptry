import { useState } from 'react'
import { habits } from '../data/mock.js'

export default function HabitsScreen({ settings, onRunPMRoutine }) {
  const blunt = settings.coachTone === 'Blunt coach'
  const [done, setDone] = useState({})

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
      {blunt ? (
        <p style={{ margin: 0, fontSize: 21, fontWeight: 600, lineHeight: 1.25, letterSpacing: '-0.01em' }}>
          You dropped 5 of 28 this week. That's still a good week.
        </p>
      ) : (
        <p style={{ margin: 0, fontSize: 21, fontWeight: 600, lineHeight: 1.25, letterSpacing: '-0.01em' }}>
          23 of 28 this week. Keep going.
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {habits.map((habit) => (
          <div key={habit.id} className="card" style={{ borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <span style={{ fontSize: 17, fontWeight: 600 }}>{habit.title}</span>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{habit.meta}</span>
              </div>
              {habit.week && (
                <button
                  onClick={() => setDone((d) => ({ ...d, [habit.id]: !d[habit.id] }))}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    border: '2px solid var(--border-dashed)',
                    background: done[habit.id] ? 'var(--ink)' : 'transparent',
                    flex: 'none',
                  }}
                />
              )}
              {habit.runNow && (
                <button onClick={onRunPMRoutine} style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-link)' }}>
                  RUN IT
                </button>
              )}
            </div>

            {habit.week && (
              <div style={{ display: 'flex', gap: 5 }}>
                {habit.week.map((v, i) =>
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

            {habit.footnote && (
              <span style={{ fontSize: 13, color: 'var(--accent-link)', fontWeight: 600 }}>{habit.footnote}</span>
            )}

            {habit.tally && (
              <div style={{ display: 'flex', gap: 4 }}>
                {habit.tally.map((v, i) => (
                  <span
                    key={i}
                    style={{ width: 9, height: 30, borderRadius: 3, background: v ? 'var(--ink)' : 'var(--border)', display: 'block' }}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--border)' }}>
        <span style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.45 }}>
          A fifth habit unlocks when one of these hits three weeks. Not before.
        </span>
      </div>
    </div>
  )
}
