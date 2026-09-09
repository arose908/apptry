import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { dateKey } from './dates.js'

const STORAGE_KEY = 'right-now-planner-v1'

function uid() {
  return Math.random().toString(36).slice(2, 10)
}

function defaultState() {
  return {
    schedule: [
      { id: 'plc', start: '08:10', end: '08:50', label: 'PLC / PREP · 40 MIN', kind: 'note' },
      { id: 'prep', start: '11:55', end: '12:45', label: 'PREP PERIOD · 50 MIN', kind: 'free' },
      {
        id: 'out',
        start: '15:00',
        end: '15:10',
        label: 'OUT · THE WINDOW',
        kind: 'habit-window',
        habitId: 'move',
        windowTitle: 'Gym, on the way home',
        windowNote: "If you go home first you don't go. Bag is already in the car.",
      },
      {
        id: 'pm',
        start: '20:30',
        end: '20:40',
        label: 'PM ROUTINE · 4 STEPS',
        kind: 'pm-routine',
        note: 'Starts itself. You just tap through.',
      },
    ],
    tasks: [],
    captureInbox: [
      {
        id: uid(),
        text: 'Ask about the chair rentals before Friday',
        capturedAt: new Date().toISOString(),
        source: 'text',
      },
      {
        id: uid(),
        text: 'Order more quiz booklets before next unit',
        capturedAt: new Date().toISOString(),
        source: 'text',
      },
    ],
    habits: [
      { id: 'reset', title: 'After-work reset', meta: '3:45 · 12 minutes · 4 steps', type: 'check', history: {} },
      {
        id: 'move',
        title: 'Move your body',
        meta: 'after school, evening, or weekend — 3× a week',
        type: 'check',
        weeklyTarget: 3,
        history: {},
      },
      { id: 'water', title: 'Water', meta: 'refill at prep and at 3:00', type: 'tally', target: 6, history: {} },
      { id: 'pm', title: 'PM routine', meta: '8:30 · starts on its own', type: 'runNow' },
    ],
    pmRoutine: {
      steps: [
        { id: 1, title: 'Dishes out of the sink' },
        { id: 2, title: "Pack tomorrow's bag", subtitle: 'Laptop, charger, water bottle, gym shoes.' },
        { id: 3, title: 'Phone on the charger, kitchen counter' },
        { id: 4, title: 'Look at tomorrow for 20 seconds' },
      ],
      history: {},
    },
    wedding: {
      date: '2027-06-27',
      budgetTotal: 24000,
      budgetItems: [
        { id: uid(), label: 'Venue deposit', amount: 6000, status: 'paid' },
        { id: uid(), label: 'Photographer', amount: 3400, status: 'paid' },
        { id: uid(), label: 'Catering', amount: 3300, status: 'committed' },
      ],
      vendors: [],
    },
    timerLog: [],
    droppedLog: [],
    settings: {
      coachTone: 'Blunt coach',
      showDropCounts: true,
      showTimeEstimates: true,
      theme: 'system',
      notificationsEnabled: false,
    },
    dismissedSuggestions: {},
  }
}

function mergeState(defaults, saved) {
  return {
    ...defaults,
    ...saved,
    settings: { ...defaults.settings, ...saved.settings },
    wedding: { ...defaults.wedding, ...saved.wedding },
    pmRoutine: { ...defaults.pmRoutine, ...saved.pmRoutine },
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    const parsed = JSON.parse(raw)
    return mergeState(defaultState(), parsed)
  } catch {
    return defaultState()
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_CAPTURE': {
      const items = action.texts
        .map((text) => text.trim())
        .filter(Boolean)
        .map((text) => ({ id: uid(), text, capturedAt: new Date().toISOString(), source: action.source || 'text' }))
      if (!items.length) return state
      return { ...state, captureInbox: [...items, ...state.captureInbox] }
    }

    case 'DELETE_CAPTURE':
      return { ...state, captureInbox: state.captureInbox.filter((i) => i.id !== action.id) }

    case 'SORT_TO_TASK': {
      const item = state.captureInbox.find((i) => i.id === action.id)
      if (!item) return state
      const task = {
        id: uid(),
        title: item.text,
        status: action.status,
        minutes: action.minutes ?? null,
        dueLabel: action.dueLabel ?? null,
        createdAt: new Date().toISOString(),
        doneAt: null,
      }
      return {
        ...state,
        tasks: [...state.tasks, task],
        captureInbox: state.captureInbox.filter((i) => i.id !== action.id),
      }
    }

    case 'ADD_TASK':
      return {
        ...state,
        tasks: [
          ...state.tasks,
          {
            id: uid(),
            title: action.title,
            status: action.status || 'today',
            minutes: action.minutes ?? null,
            dueLabel: action.dueLabel ?? null,
            createdAt: new Date().toISOString(),
            doneAt: null,
          },
        ],
      }

    case 'COMPLETE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) => (t.id === action.id ? { ...t, status: 'done', doneAt: new Date().toISOString() } : t)),
      }

    case 'DROP_TASK': {
      const task = state.tasks.find((t) => t.id === action.id)
      if (!task) return state
      return {
        ...state,
        tasks: state.tasks.map((t) => (t.id === action.id ? { ...t, status: 'dropped' } : t)),
        droppedLog: [...state.droppedLog, { id: uid(), title: task.title, date: new Date().toISOString() }],
      }
    }

    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter((t) => t.id !== action.id) }

    case 'LOG_TIMER_SESSION':
      return {
        ...state,
        timerLog: [
          ...state.timerLog,
          {
            id: uid(),
            taskId: action.taskId,
            title: action.title,
            estimateMin: action.estimateMin,
            actualMin: action.actualMin,
            date: new Date().toISOString(),
          },
        ],
      }

    case 'HABIT_TOGGLE_CHECK': {
      const key = action.dateKey || dateKey()
      return {
        ...state,
        habits: state.habits.map((h) => {
          if (h.id !== action.id) return h
          const history = { ...h.history }
          history[key] = !history[key]
          return { ...h, history }
        }),
      }
    }

    case 'HABIT_SET_TALLY': {
      const key = action.dateKey || dateKey()
      return {
        ...state,
        habits: state.habits.map((h) => {
          if (h.id !== action.id) return h
          return { ...h, history: { ...h.history, [key]: action.value } }
        }),
      }
    }

    case 'PM_STEP_DONE': {
      const key = dateKey()
      const existing = state.pmRoutine.history[key] || []
      if (existing.includes(action.stepId)) return state
      return {
        ...state,
        pmRoutine: { ...state.pmRoutine, history: { ...state.pmRoutine.history, [key]: [...existing, action.stepId] } },
      }
    }

    case 'PM_ROUTINE_RESET_TODAY': {
      const key = dateKey()
      const history = { ...state.pmRoutine.history }
      delete history[key]
      return { ...state, pmRoutine: { ...state.pmRoutine, history } }
    }

    case 'WEDDING_SET_DATE':
      return { ...state, wedding: { ...state.wedding, date: action.date } }

    case 'WEDDING_SET_BUDGET_TOTAL':
      return { ...state, wedding: { ...state.wedding, budgetTotal: action.total } }

    case 'WEDDING_ADD_BUDGET_ITEM':
      return {
        ...state,
        wedding: {
          ...state.wedding,
          budgetItems: [
            ...state.wedding.budgetItems,
            { id: uid(), label: action.label, amount: action.amount, status: action.status || 'committed' },
          ],
        },
      }

    case 'WEDDING_DELETE_BUDGET_ITEM':
      return {
        ...state,
        wedding: { ...state.wedding, budgetItems: state.wedding.budgetItems.filter((i) => i.id !== action.id) },
      }

    case 'WEDDING_ADD_VENDOR':
      return {
        ...state,
        wedding: {
          ...state.wedding,
          vendors: [
            ...state.wedding.vendors,
            {
              id: uid(),
              category: action.category,
              name: action.name,
              phone: action.phone || '',
              email: action.email || '',
              notes: action.notes || '',
            },
          ],
        },
      }

    case 'WEDDING_DELETE_VENDOR':
      return {
        ...state,
        wedding: { ...state.wedding, vendors: state.wedding.vendors.filter((v) => v.id !== action.id) },
      }

    case 'ADD_HABIT':
      return {
        ...state,
        habits: [
          ...state.habits,
          action.habitType === 'tally'
            ? { id: uid(), title: action.title, meta: action.meta || '', type: 'tally', target: action.target || 4, history: {} }
            : {
                id: uid(),
                title: action.title,
                meta: action.meta || '',
                type: 'check',
                weeklyTarget: action.weeklyTarget || null,
                history: {},
              },
        ],
      }

    case 'DELETE_HABIT':
      return { ...state, habits: state.habits.filter((h) => h.id !== action.id) }

    case 'IMPORT_STATE':
      return mergeState(defaultState(), action.data)

    case 'SCHEDULE_UPDATE':
      return { ...state, schedule: action.schedule }

    case 'SETTINGS_UPDATE':
      return { ...state, settings: { ...state.settings, ...action.settings } }

    case 'CLEAR_DROPPED':
      return { ...state, droppedLog: [] }

    case 'DISMISS_SUGGESTION':
      return { ...state, dismissedSuggestions: { ...state.dismissedSuggestions, [action.key]: true } }

    default:
      return state
  }
}

const PlannerStateContext = createContext(null)
const PlannerDispatchContext = createContext(null)

export function PlannerProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // storage unavailable (private mode, quota) — app still works for the session
    }
  }, [state])

  const stateValue = useMemo(() => state, [state])

  return (
    <PlannerStateContext.Provider value={stateValue}>
      <PlannerDispatchContext.Provider value={dispatch}>{children}</PlannerDispatchContext.Provider>
    </PlannerStateContext.Provider>
  )
}

export function usePlannerState() {
  const ctx = useContext(PlannerStateContext)
  if (!ctx) throw new Error('usePlannerState must be used within PlannerProvider')
  return ctx
}

export function usePlannerDispatch() {
  const ctx = useContext(PlannerDispatchContext)
  if (!ctx) throw new Error('usePlannerDispatch must be used within PlannerProvider')
  return ctx
}
