import { usePlannerState, usePlannerDispatch } from '../state/store.jsx'
import { reviewView } from '../state/selectors.js'

export default function ReviewScreen({ settings }) {
  const state = usePlannerState()
  const dispatch = usePlannerDispatch()
  const review = reviewView(state)
  const dismissed = review.suggestionKey && state.dismissedSuggestions[review.suggestionKey]

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
      <span className="eyebrow">SUNDAY · 4 MINUTES</span>
      <p style={{ margin: 0, fontSize: 22, fontWeight: 600, lineHeight: 1.25, letterSpacing: '-0.01em' }}>
        {review.headline}
      </p>

      {review.items.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {review.items.map((item) => (
            <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span style={{ fontWeight: 600 }}>{item.label}</span>
                <span style={{ color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>
                  guessed {item.guessed} · took {item.actual}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <span style={{ width: `${item.guessedPct}%`, height: 9, borderRadius: 5, background: 'var(--border-dashed)', display: 'block' }} />
                <span
                  style={{
                    width: `${item.actualPct}%`,
                    height: 9,
                    borderRadius: 5,
                    background: item.actual > item.guessed ? 'var(--accent)' : 'var(--ink)',
                    display: 'block',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {!dismissed && review.suggestionKey && (
        <div style={{ background: 'var(--ink)', color: 'var(--paper)', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--text-dark-muted-2)' }}>
            CHANGING ONE THING
          </span>
          <span style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.35 }}>{review.changeSuggestion}</span>
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <button
              onClick={() => dispatch({ type: 'DISMISS_SUGGESTION', key: review.suggestionKey })}
              className="btn-primary"
              style={{ flex: 1, fontSize: 15, padding: 12, borderRadius: 9 }}
            >
              Got it
            </button>
            <button onClick={() => dispatch({ type: 'DISMISS_SUGGESTION', key: review.suggestionKey })} className="btn-dark">
              Leave it
            </button>
          </div>
        </div>
      )}

      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid var(--border)' }}>
        {settings.showDropCounts && (
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>
            {review.droppedCount} thing{review.droppedCount === 1 ? '' : 's'} dropped this week
          </span>
        )}
        {review.droppedCount > 0 && (
          <button onClick={() => dispatch({ type: 'CLEAR_DROPPED' })} style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-link)' }}>
            CLEAR THEM ALL
          </button>
        )}
      </div>
    </div>
  )
}
