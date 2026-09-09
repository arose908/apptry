import { useEffect, useState } from 'react'
import PhoneFrame from './components/PhoneFrame.jsx'
import TabBar from './components/TabBar.jsx'
import SettingsSheet from './components/SettingsSheet.jsx'
import { PlannerProvider, usePlannerState, usePlannerDispatch } from './state/store.jsx'
import { nextNudge } from './state/selectors.js'
import { dateKey } from './state/dates.js'
import { fireNudgeNotifications, notificationsSupported } from './state/notifications.js'

import TodayScreen from './screens/TodayScreen.jsx'
import HabitsScreen from './screens/HabitsScreen.jsx'
import WeddingScreen from './screens/WeddingScreen.jsx'
import ReviewScreen from './screens/ReviewScreen.jsx'
import TimerScreen from './screens/TimerScreen.jsx'
import CaptureScreen from './screens/CaptureScreen.jsx'
import SortScreen from './screens/SortScreen.jsx'
import PMRoutineScreen from './screens/PMRoutineScreen.jsx'
import LockScreen from './screens/LockScreen.jsx'

const TAB_SCREENS = {
  today: TodayScreen,
  habits: HabitsScreen,
  wedding: WeddingScreen,
  review: ReviewScreen,
}

export default function App() {
  return (
    <PlannerProvider>
      <PlannerApp />
    </PlannerProvider>
  )
}

function PlannerApp() {
  const state = usePlannerState()
  const dispatch = usePlannerDispatch()
  const [tab, setTab] = useState('today')
  const [overlay, setOverlay] = useState(null)
  const [activeTask, setActiveTask] = useState(null)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const closeOverlay = () => setOverlay(null)
  const TabScreen = TAB_SCREENS[tab]

  const startFocus = (task) => {
    setActiveTask(task)
    setOverlay('timer')
  }

  const runPmRoutine = () => setOverlay('pmRoutine')

  // Apply the theme choice as a data attribute; 'system' removes it so the
  // prefers-color-scheme media query in index.css takes over.
  useEffect(() => {
    const root = document.documentElement
    if (state.settings.theme === 'dark' || state.settings.theme === 'light') {
      root.setAttribute('data-theme', state.settings.theme)
    } else {
      root.removeAttribute('data-theme')
    }
  }, [state.settings.theme])

  // Local nudge notifications — only fire while this tab/app is open or
  // briefly backgrounded. A fully closed app needs a push server to wake it,
  // which this static site doesn't have.
  useEffect(() => {
    if (!notificationsSupported || !state.settings.notificationsEnabled) return
    const check = () => {
      const now = new Date()
      fireNudgeNotifications(nextNudge(state, now), dateKey(now))
    }
    check()
    const t = setInterval(check, 30000)
    return () => clearInterval(t)
  }, [state])

  return (
    <PhoneFrame>
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <div key={tab} className="screen-fade" style={{ position: 'absolute', inset: 0, overflowY: 'auto' }}>
          <TabScreen
            settings={state.settings}
            onStartFocus={startFocus}
            onOpenCapture={() => setOverlay('capture')}
            onRunPMRoutine={runPmRoutine}
            onOpenSettings={() => setSettingsOpen(true)}
          />
        </div>

        {overlay === 'timer' && activeTask && (
          <div className="overlay-slide" style={{ position: 'absolute', inset: 0 }}>
            <TimerScreen task={activeTask} onDone={closeOverlay} onBack={closeOverlay} />
          </div>
        )}
        {overlay === 'capture' && (
          <div className="overlay-slide" style={{ position: 'absolute', inset: 0 }}>
            <CaptureScreen onBack={closeOverlay} onSort={() => setOverlay('sort')} />
          </div>
        )}
        {overlay === 'sort' && (
          <div className="overlay-slide" style={{ position: 'absolute', inset: 0 }}>
            <SortScreen onBack={() => setOverlay('capture')} onFinish={closeOverlay} />
          </div>
        )}
        {overlay === 'pmRoutine' && (
          <div className="overlay-slide" style={{ position: 'absolute', inset: 0 }}>
            <PMRoutineScreen onBack={closeOverlay} onDone={closeOverlay} />
          </div>
        )}
        {overlay === 'lockscreen' && (
          <div className="overlay-slide" style={{ position: 'absolute', inset: 0 }}>
            <LockScreen onBack={() => setSettingsOpen(true)} />
          </div>
        )}

        {settingsOpen && !overlay && (
          <SettingsSheet
            state={state}
            dispatch={dispatch}
            onClose={() => setSettingsOpen(false)}
            onPreviewLockScreen={() => {
              setSettingsOpen(false)
              setOverlay('lockscreen')
            }}
          />
        )}
      </div>

      {!overlay && <TabBar active={tab} onChange={setTab} onCapture={() => setOverlay('capture')} />}
    </PhoneFrame>
  )
}
