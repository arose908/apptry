import { today } from '../data/mock.js'

export default function TodayScreen({ settings, onStartFocus, onOpenSettings }) {
  const blunt = settings.coachTone === 'Blunt coach'

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
        gap: 12,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span className="eyebrow">{today.dateLabel}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {settings.showDropCounts && <span className="chip">{today.droppedCount} dropped</span>}
            <button
              onClick={onOpenSettings}
              aria-label="Settings"
              style={{ width: 24, height: 24, borderRadius: '50%', border: '1px solid var(--border)' }}
            />
          </div>
        </div>
        {blunt ? (
          <p style={{ margin: 0, fontSize: 19, fontWeight: 600, lineHeight: 1.25, letterSpacing: '-0.01em' }}>
            You have 50 minutes free at 11:55. Last week you spent it on your phone.
          </p>
        ) : (
          <p style={{ margin: 0, fontSize: 19, fontWeight: 600, lineHeight: 1.25, letterSpacing: '-0.01em' }}>
            You have 50 minutes free at 11:55. Two things fit in it.
          </p>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '52px 1fr', columnGap: 12, rowGap: 0 }}>
        {today.timeline.map((slot) => (
          <TimelineRow key={slot.id} slot={slot} settings={settings} onStartFocus={onStartFocus} />
        ))}
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 12, display: 'flex', gap: 10, alignItems: 'center' }}>
        <div
          style={{
            flex: 1,
            background: 'var(--card)',
            border: '1px dashed var(--border-dashed)',
            borderRadius: 11,
            padding: '13px 16px',
            fontSize: 15,
            color: 'var(--text-muted)',
          }}
        >
          Dump anything here
        </div>
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: '50%',
            background: 'var(--ink)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 'none',
          }}
        >
          <span style={{ width: 12, height: 20, borderRadius: 6, background: 'var(--paper)', display: 'block' }} />
        </div>
      </div>
    </div>
  )
}

function TimelineRow({ slot, settings, onStartFocus }) {
  const isNow = slot.state === 'now'
  return (
    <>
      <span
        style={{
          fontSize: 13,
          fontWeight: isNow ? 700 : 600,
          color: isNow ? 'var(--accent-link)' : 'var(--text-muted-2)',
          fontVariantNumeric: 'tabular-nums',
          paddingTop: 10,
        }}
      >
        {slot.time}
      </span>
      <div
        style={{
          borderLeft: `2px solid ${isNow ? 'var(--accent)' : 'var(--border)'}`,
          padding: '10px 0 10px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {isNow ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--accent-link)' }}>
              {slot.label}
            </span>
            <span style={{ height: 1, flex: 1, background: 'var(--chip-border)' }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', color: 'var(--accent-link)' }}>
              {slot.nowLabel}
            </span>
          </div>
        ) : (
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--text-muted)' }}>
            {slot.label}
          </span>
        )}

        {slot.focusTask && (
          <div
            style={{
              background: 'var(--ink)',
              color: 'var(--paper)',
              borderRadius: 12,
              padding: 14,
              display: 'flex',
              flexDirection: 'column',
              gap: 9,
            }}
          >
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--text-dark-muted-2)' }}>
              DO THIS ONE
            </span>
            <span style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.25 }}>{slot.focusTask.title}</span>
            {settings.showTimeEstimates && (
              <span style={{ fontSize: 13, color: 'var(--text-dark-muted-2)', lineHeight: 1.4 }}>
                You said {slot.focusTask.estimateMin} min. It has taken you {slot.focusTask.actualAvgMin} the last
                three times.
              </span>
            )}
            <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
              <button onClick={onStartFocus} style={{ flex: 1 }} className="btn-primary">
                Start · {slot.focusTask.estimateMin} min
              </button>
              <button className="btn-dark">Not this</button>
            </div>
          </div>
        )}

        {slot.task && (
          <div
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: '12px 14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <span style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.3 }}>{slot.task.title}</span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--text-muted)',
                fontVariantNumeric: 'tabular-nums',
                whiteSpace: 'nowrap',
              }}
            >
              {slot.task.minutes}m
            </span>
          </div>
        )}

        {slot.window && (
          <div
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 600 }}>{slot.window.title}</span>
            <span style={{ fontSize: 13, color: 'var(--text-muted-2)', lineHeight: 1.4 }}>{slot.window.note}</span>
          </div>
        )}

        {slot.note && !slot.focusTask && (
          <span style={{ fontSize: slot.id === 'pm' ? 14 : 13, color: 'var(--text-muted-2)', lineHeight: 1.4 }}>
            {slot.note}
          </span>
        )}
      </div>
    </>
  )
}
