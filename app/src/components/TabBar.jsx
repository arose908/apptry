const TABS = [
  { id: 'today', label: 'Today' },
  { id: 'habits', label: 'Habits' },
  { id: 'wedding', label: 'Wedding' },
  { id: 'review', label: 'Review' },
]

export default function TabBar({ active, onChange, onCapture }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        padding: '8px 10px calc(10px + env(safe-area-inset-bottom, 0px))',
        background: 'var(--tabbar-bg)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderTop: '1px solid var(--border)',
      }}
    >
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            padding: '6px 4px',
          }}
        >
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: active === tab.id ? 'var(--accent)' : 'transparent',
            }}
          />
          <span
            style={{
              fontSize: 11,
              fontWeight: active === tab.id ? 700 : 500,
              letterSpacing: '0.02em',
              color: active === tab.id ? 'var(--text-primary)' : 'var(--text-muted)',
            }}
          >
            {tab.label}
          </span>
        </button>
      ))}
      <button
        onClick={onCapture}
        aria-label="Capture"
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: 'var(--ink)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 'none',
          marginLeft: 2,
        }}
      >
        <span style={{ width: 10, height: 16, borderRadius: 5, background: 'var(--paper)', display: 'block' }} />
      </button>
    </div>
  )
}
