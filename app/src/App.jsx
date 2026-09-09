import { useState } from 'react'
import PhoneFrame from './components/PhoneFrame.jsx'
import TabBar from './components/TabBar.jsx'
import SettingsSheet from './components/SettingsSheet.jsx'
import { PlannerProvider, usePlannerState, usePlannerDispatch } from './state/store.jsx'

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

  return (
    <PhoneFrame>
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, overflowY: 'auto' }}>
          <TabScreen
            settings={state.settings}
            onStartFocus={startFocus}
            onOpenCapture={() => setOverlay('capture')}
            onRunPMRoutine={runPmRoutine}
            onOpenSettings={() => setSettingsOpen(true)}
          />
        </div>

        {overlay === 'timer' && activeTask && (
          <TimerScreen task={activeTask} onDone={closeOverlay} onBack={closeOverlay} />
        )}
        {overlay === 'capture' && (
          <CaptureScreen onBack={closeOverlay} onSort={() => setOverlay('sort')} />
        )}
        {overlay === 'sort' && <SortScreen onBack={() => setOverlay('capture')} onFinish={closeOverlay} />}
        {overlay === 'pmRoutine' && <PMRoutineScreen onBack={closeOverlay} onDone={closeOverlay} />}
        {overlay === 'lockscreen' && <LockScreen onBack={() => setSettingsOpen(true)} />}

        {settingsOpen && !overlay && (
          <SettingsSheet
            settings={state.settings}
            schedule={state.schedule}
            weddingDate={state.wedding.date}
            onChange={(settings) => dispatch({ type: 'SETTINGS_UPDATE', settings })}
            onScheduleChange={(schedule) => dispatch({ type: 'SCHEDULE_UPDATE', schedule })}
            onWeddingDateChange={(date) => dispatch({ type: 'WEDDING_SET_DATE', date })}
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
