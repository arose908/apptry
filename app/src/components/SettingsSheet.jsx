import { useRef, useState } from 'react'
import { dateKey } from '../state/dates.js'
import {
  notificationPermission,
  notificationsSupported,
  requestNotificationPermission,
} from '../state/notifications.js'

export default function SettingsSheet({ state, dispatch, onClose, onPreviewLockScreen }) {
  const [editingSchedule, setEditingSchedule] = useState(false)
  const [importError, setImportError] = useState('')
  const fileInputRef = useRef(null)
  const settings = state.settings
  const schedule = state.schedule

  const updateSettings = (patch) => dispatch({ type: 'SETTINGS_UPDATE', settings: patch })
  const updateBlock = (id, field, value) => {
    dispatch({ type: 'SCHEDULE_UPDATE', schedule: schedule.map((b) => (b.id === id ? { ...b, [field]: value } : b)) })
  }

  const toggleNotifications = async () => {
    if (settings.notificationsEnabled) {
      updateSettings({ notificationsEnabled: false })
      return
    }
    const permission = await requestNotificationPermission()
    updateSettings({ notificationsEnabled: permission === 'granted' })
  }

  const exportData = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `right-now-backup-${dateKey()}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const importData = (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result)
        dispatch({ type: 'IMPORT_STATE', data })
        setImportError('')
      } catch {
        setImportError("That file doesn't look like a Right Now backup.")
      }
    }
    reader.readAsText(file)
  }

  const permission = notificationPermission()

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
          maxHeight: '85%',
          overflowY: 'auto',
          background: 'var(--page-bg)',
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
                onClick={() => updateSettings({ coachTone: opt })}
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 600,
                  background: settings.coachTone === opt ? 'var(--accent-btn)' : 'var(--card)',
                  color: settings.coachTone === opt ? '#fff' : 'var(--text-primary)',
                  border: '1px solid var(--border)',
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="eyebrow">Appearance</span>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { id: 'system', label: 'System' },
              { id: 'light', label: 'Light' },
              { id: 'dark', label: 'Dark' },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => updateSettings({ theme: opt.id })}
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 600,
                  background: settings.theme === opt.id ? 'var(--accent-btn)' : 'var(--card)',
                  color: settings.theme === opt.id ? '#fff' : 'var(--text-primary)',
                  border: '1px solid var(--border)',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <ToggleRow
          label="Show drop counts"
          value={settings.showDropCounts}
          onToggle={() => updateSettings({ showDropCounts: !settings.showDropCounts })}
        />
        <ToggleRow
          label="Show time estimates"
          value={settings.showTimeEstimates}
          onToggle={() => updateSettings({ showTimeEstimates: !settings.showTimeEstimates })}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <ToggleRow
            label="Nudge notifications"
            value={settings.notificationsEnabled}
            onToggle={toggleNotifications}
            disabled={!notificationsSupported || permission === 'denied'}
          />
          <span style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4 }}>
            {!notificationsSupported
              ? "This browser doesn't support notifications."
              : permission === 'denied'
                ? 'Notifications are blocked for this app in your browser/phone settings.'
                : "Fires while the app is open or recently backgrounded. It can't wake your phone when the app is fully closed — that needs a push server, which this app doesn't have."}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="eyebrow">Wedding date</span>
          <input
            type="date"
            value={state.wedding.date}
            onChange={(e) => dispatch({ type: 'WEDDING_SET_DATE', date: e.target.value })}
            style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 12px', fontSize: 14, color: 'var(--text-primary)' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            onClick={() => setEditingSchedule((v) => !v)}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <span className="eyebrow">Your day</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-link)' }}>{editingSchedule ? 'Done' : 'Edit'}</span>
          </button>
          {editingSchedule &&
            schedule.map((block) => (
              <div key={block.id} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <input
                  type="time"
                  value={block.start}
                  onChange={(e) => updateBlock(block.id, 'start', e.target.value)}
                  style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px', fontSize: 13, width: 90, color: 'var(--text-primary)' }}
                />
                <input
                  type="time"
                  value={block.end}
                  onChange={(e) => updateBlock(block.id, 'end', e.target.value)}
                  style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px', fontSize: 13, width: 90, color: 'var(--text-primary)' }}
                />
                <input
                  value={block.label}
                  onChange={(e) => updateBlock(block.id, 'label', e.target.value)}
                  style={{ flex: 1, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px', fontSize: 13, minWidth: 0, color: 'var(--text-primary)' }}
                />
              </div>
            ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="eyebrow">Backup</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={exportData} className="btn-ghost" style={{ flex: 1 }}>
              Export data
            </button>
            <button onClick={() => fileInputRef.current?.click()} className="btn-ghost" style={{ flex: 1 }}>
              Import data
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              onChange={importData}
              style={{ display: 'none' }}
            />
          </div>
          {importError && <span style={{ fontSize: 12, color: 'var(--accent-link)' }}>{importError}</span>}
        </div>

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

function ToggleRow({ label, value, onToggle, disabled = false }) {
  return (
    <button onClick={onToggle} disabled={disabled} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: disabled ? 0.5 : 1 }}>
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
