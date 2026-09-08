export default function StatusBar({ dark = false, time = '9:41' }) {
  const c = dark ? '#F4F1EA' : '#1C1A17'
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px 0',
        fontSize: 14,
        fontWeight: 600,
        color: c,
        fontVariantNumeric: 'tabular-nums',
        zIndex: 20,
        pointerEvents: 'none',
      }}
    >
      <span>{time}</span>
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        <span style={{ width: 16, height: 10, border: `1.4px solid ${c}`, borderRadius: 2, opacity: 0.9 }} />
      </div>
    </div>
  )
}
