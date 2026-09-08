import { useState } from 'react'
import PhoneFrame from './components/PhoneFrame.jsx'
import TabBar from './components/TabBar.jsx'
import SettingsSheet from './components/SettingsSheet.jsx'
import { settingsDefaults } from './data/mock.js'

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
  const [tab, setTab] = useState('today')
  const [overlay, setOverlay] = useState(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [settings, setSettings] = useState(settingsDefaults)

  const closeOverlay = () => setOverlay(null)
  const TabScreen = TAB_SCREENS[tab]

  return (
    <PhoneFrame>
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, overflowY: 'auto' }}>
          <TabScreen
            settings={settings}
            onStartFocus={() => setOverlay('timer')}
            onOpenCapture={() => setOverlay('capture')}
            onRunPMRoutine={() => setOverlay('pmRoutine')}
            onOpenSettings={() => setSettingsOpen(true)}
          />
        </div>

        {overlay === 'timer' && <TimerScreen onDone={closeOverlay} onBack={closeOverlay} />}
        {overlay === 'capture' && (
          <CaptureScreen onBack={closeOverlay} onSort={() => setOverlay('sort')} />
        )}
        {overlay === 'sort' && <SortScreen onBack={() => setOverlay('capture')} onFinish={closeOverlay} />}
        {overlay === 'pmRoutine' && <PMRoutineScreen onBack={closeOverlay} onDone={closeOverlay} />}
        {overlay === 'lockscreen' && <LockScreen onBack={() => setSettingsOpen(true)} />}

        {settingsOpen && !overlay && (
          <SettingsSheet
            settings={settings}
            onChange={setSettings}
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
