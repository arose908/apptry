export default function PhoneFrame({ children, dark = false }) {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: 402,
        height: 'min(874px, 100dvh)',
        background: dark ? 'var(--ink-soft)' : 'var(--paper)',
        borderRadius: 40,
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 1px 2px rgba(28,26,23,0.08), 0 24px 48px -12px rgba(28,26,23,0.35)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {children}
    </div>
  )
}
