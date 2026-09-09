const NOTIFIED_KEY = 'right-now-notified-v1'

export const notificationsSupported =
  typeof window !== 'undefined' && 'Notification' in window

export function notificationPermission() {
  return notificationsSupported ? Notification.permission : 'unsupported'
}

export async function requestNotificationPermission() {
  if (!notificationsSupported) return 'unsupported'
  return Notification.requestPermission()
}

function loadNotified() {
  try {
    return JSON.parse(localStorage.getItem(NOTIFIED_KEY)) || {}
  } catch {
    return {}
  }
}

function saveNotified(map) {
  try {
    localStorage.setItem(NOTIFIED_KEY, JSON.stringify(map))
  } catch {
    // best-effort — a missed dedupe just means a possible repeat notification
  }
}

// Fires a local notification for each due nudge, at most once per nudge id per day.
// This only works while the app/tab is open (or briefly backgrounded) — a fully
// closed app can't be woken without a push server, which this app doesn't have.
export async function fireNudgeNotifications(nudges, dayKey) {
  if (!notificationsSupported || Notification.permission !== 'granted') return
  const notified = loadNotified()
  if (notified.day !== dayKey) {
    notified.day = dayKey
    notified.fired = {}
  }
  notified.fired = notified.fired || {}

  for (const nudge of nudges) {
    if (nudge.time !== 'now') continue
    if (notified.fired[nudge.id]) continue

    const options = { body: nudge.text, tag: nudge.id, icon: iconUrl(), badge: iconUrl() }
    if (navigator.serviceWorker && navigator.serviceWorker.ready) {
      try {
        const reg = await navigator.serviceWorker.ready
        await reg.showNotification('Right Now', options)
      } catch {
        new Notification('Right Now', options)
      }
    } else {
      new Notification('Right Now', options)
    }
    notified.fired[nudge.id] = true
  }

  saveNotified(notified)
}

function iconUrl() {
  const base = document.querySelector('link[rel="manifest"]')?.href || '/'
  return new URL('icons/icon-192.png', base).toString()
}
