import { wedding } from '../data/mock.js'

export default function WeddingScreen() {
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span className="eyebrow">{wedding.dateLabel}</span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={{ fontSize: 52, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
            {wedding.daysOut}
          </span>
          <span style={{ fontSize: 17, fontWeight: 500, color: 'var(--text-muted-2)' }}>days out</span>
        </div>
      </div>

      <div style={{ background: 'var(--ink)', color: 'var(--paper)', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--text-dark-muted-2)' }}>
          THE ONLY ONE THAT'S URGENT
        </span>
        <span style={{ fontSize: 19, fontWeight: 600, lineHeight: 1.25 }}>{wedding.urgent.title}</span>
        <span style={{ fontSize: 14, color: 'var(--text-dark-muted-2)' }}>{wedding.urgent.note}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span className="eyebrow">NEXT UP · BY DEADLINE</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>{wedding.totalCount} total</span>
        </div>
        {wedding.nextUp.map((item, i) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 12,
              padding: '13px 0',
              borderBottom: i < wedding.nextUp.length - 1 ? '1px solid var(--border)' : 'none',
            }}
          >
            <span style={{ fontSize: 15, fontWeight: 500 }}>{item.title}</span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: item.urgent ? 'var(--accent-link)' : 'var(--text-muted-2)',
                whiteSpace: 'nowrap',
              }}
            >
              {item.due}
            </span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 'auto' }} className="card" >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span className="eyebrow">BUDGET</span>
            <span style={{ fontSize: 14, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
              ${wedding.budget.spent.toLocaleString()}{' '}
              <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>of ${wedding.budget.total.toLocaleString()}</span>
            </span>
          </div>
          <div style={{ height: 12, borderRadius: 7, background: 'var(--border)', overflow: 'hidden', display: 'flex' }}>
            <span style={{ width: `${wedding.budget.spentPct}%`, background: 'var(--ink)', display: 'block' }} />
            <span style={{ width: `${wedding.budget.committedPct}%`, background: 'var(--accent)', display: 'block' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)' }}>
            <span>spent</span>
            <span>committed, not paid · ${wedding.budget.committed.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
