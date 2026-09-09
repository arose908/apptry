export default function PhoneFrame({ children, dark = false }) {
  return (
    <div
      className="phone-frame"
      style={{ background: dark ? 'var(--ink-soft)' : 'var(--page-bg)' }}
    >
      {children}
    </div>
  )
}
