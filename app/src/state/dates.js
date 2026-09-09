const DAY_LABELS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const MONTH_LABELS = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
]

export function dateKey(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function formatDateLabel(d = new Date()) {
  return `${DAY_LABELS[d.getDay()]} · ${MONTH_LABELS[d.getMonth()]} ${d.getDate()}`
}

export function formatFullDate(d = new Date()) {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ]
  return `${dayNames[d.getDay()]}, ${monthNames[d.getMonth()]} ${d.getDate()}`
}

// "HH:MM" (24h) -> minutes since midnight
export function timeToMinutes(t) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

export function minutesNow(d = new Date()) {
  return d.getHours() * 60 + d.getMinutes()
}

// "HH:MM" (24h) -> "8:10" / "15:00" -> "3:00" (matches the design's no-am/pm style)
export function formatClock(t) {
  const [h, m] = t.split(':').map(Number)
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return `${hour12}:${String(m).padStart(2, '0')}`
}

export function formatClockFromDate(d = new Date()) {
  const hour12 = d.getHours() % 12 === 0 ? 12 : d.getHours() % 12
  return `${hour12}:${String(d.getMinutes()).padStart(2, '0')}`
}

export function formatDuration(mins) {
  if (mins < 60) return `${mins}m`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m ? `${h}h ${m}m` : `${h}h`
}

export function formatElapsed(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

// Monday-first weekday index: Mon=0 .. Sun=6
export function mondayIndex(d = new Date()) {
  return (d.getDay() + 6) % 7
}

export function startOfWeek(d = new Date()) {
  const copy = new Date(d)
  copy.setHours(0, 0, 0, 0)
  copy.setDate(copy.getDate() - mondayIndex(copy))
  return copy
}

export function addDays(d, n) {
  const copy = new Date(d)
  copy.setDate(copy.getDate() + n)
  return copy
}

export function daysBetween(a, b) {
  const start = new Date(a.getFullYear(), a.getMonth(), a.getDate())
  const end = new Date(b.getFullYear(), b.getMonth(), b.getDate())
  return Math.round((end - start) / 86400000)
}

export function timeAgo(iso) {
  const then = new Date(iso)
  const diffMin = Math.round((Date.now() - then.getTime()) / 60000)
  if (diffMin < 1) return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.round(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  const diffDay = Math.round(diffHr / 24)
  return `${diffDay}d ago`
}

export function parseDateInput(s) {
  if (!s) return null
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}
