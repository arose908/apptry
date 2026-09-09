export default function BackHeader({ label, onBack, dark = false }) {
  const c = dark ? '#F4F1EA' : 'var(--text-primary)'
  return (
    <button
      onClick={onBack}
      style={{
        position: 'absolute',
        top: 16,
        left: 16,
        zIndex: 21,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 10px 6px 6px',
        borderRadius: 20,
        background: dark ? 'var(--back-pill-bg-dark-screen)' : 'var(--back-pill-bg)',
      }}
      aria-label={label || 'Back'}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderLeft: `2px solid ${c}`,
          borderBottom: `2px solid ${c}`,
          transform: 'rotate(45deg)',
          display: 'block',
        }}
      />
      <span style={{ fontSize: 13, fontWeight: 600, color: c }}>{label || 'Back'}</span>
    </button>
  )
}
