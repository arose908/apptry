export default function SettingsSheet({ settings, onChange, onClose, onPreviewLockScreen }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(28,26,23,0.4)',
        display: 'flex',
        alignItems: 'flex-end',
        zIndex: 30,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          background: 'var(--paper)',
          borderRadius: '20px 20px 0 0',
          padding: '18px 20px calc(24px + env(safe-area-inset-bottom, 0px))',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
        }}
      >
        <div style={{ width: 36, height: 4, borderRadius: 3, background: 'var(--border-dashed)', margin: '0 auto' }} />
        <span style={{ fontSize: 16, fontWeight: 600 }}>Settings</span>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="eyebrow">Voice</span>
          <div style={{ display: 'flex', gap: 8 }}>
            {['Blunt coach', 'Neutral'].map((opt) => (
              <button
                key={opt}
                onClick={() => onChange({ ...settings, coachTone: opt })}
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 600,
                  background: settings.coachTone === opt ? 'var(--ink)' : 'var(--card)',
                  color: settings.coachTone === opt ? 'var(--paper)' : 'var(--ink)',
                  border: '1px solid var(--border)',
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <ToggleRow
          label="Show drop counts"
          value={settings.showDropCounts}
          onToggle={() => onChange({ ...settings, showDropCounts: !settings.showDropCounts })}
        />
        <ToggleRow
          label="Show time estimates"
          value={settings.showTimeEstimates}
          onToggle={() => onChange({ ...settings, showTimeEstimates: !settings.showTimeEstimates })}
        />

        <button
          onClick={onPreviewLockScreen}
          style={{ textAlign: 'left', fontSize: 14, fontWeight: 700, color: 'var(--accent-link)', paddingTop: 4 }}
        >
          Preview lock screen nudges →
        </button>
      </div>
    </div>
  )
}

function ToggleRow({ label, value, onToggle }) {
  return (
    <button onClick={onToggle} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 15, fontWeight: 500 }}>{label}</span>
      <span
        style={{
          width: 40,
          height: 24,
          borderRadius: 12,
          background: value ? 'var(--accent)' : 'var(--border)',
          position: 'relative',
          transition: 'background 0.15s',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 2,
            left: value ? 18 : 2,
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: '#fff',
            transition: 'left 0.15s',
          }}
        />
      </span>
    </button>
  )
}
