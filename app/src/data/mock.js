export const today = {
  dateLabel: 'TUE · SEP 8',
  droppedCount: 3,
  timeline: [
    {
      id: 'plc',
      time: '8:10',
      state: 'done',
      label: 'PLC / PREP · 40 MIN',
      task: { title: 'Email Alvarez re: IEP meeting', minutes: 8 },
      note: 'Done. 9:04.',
    },
    {
      id: 'prep',
      time: '11:55',
      state: 'now',
      nowLabel: 'NOW 12:12',
      label: 'PREP PERIOD · 50 MIN',
      focusTask: {
        title: 'Grade quiz set 3 — period 2 only',
        estimateMin: 20,
        actualAvgMin: 34,
      },
      task: { title: 'Call florist back', minutes: 10 },
    },
    {
      id: 'out',
      time: '3:00',
      state: 'upcoming',
      label: 'OUT · THE WINDOW',
      window: {
        title: 'Gym, on the way home',
        note: "If you go home first you don't go. Bag is already in the car.",
      },
    },
    {
      id: 'pm',
      time: '8:30',
      state: 'upcoming',
      label: 'PM ROUTINE · 4 STEPS',
      note: 'Starts itself. You just tap through.',
    },
  ],
}

export const focusSession = {
  windowLabel: 'PREP PERIOD · 26 MIN LEFT',
  title: 'Grade quiz set 3',
  subtitle: 'Period 2 only. 24 papers.',
  elapsed: '14:32',
  estimateMin: 20,
  actualAvgMin: 34,
  elapsedPct: 43,
  avgPct: 30,
  caught: 'You opened your email twice in 14 minutes. It is still 24 papers.',
}

export const capture = {
  draftLines: ['ask about the chair rentals before', 'friday'],
  alsoCameIn: [
    {
      id: 'email',
      kind: 'FORWARDED EMAIL',
      text: 'Willow Creek Barn — final headcount due Oct 15',
    },
    {
      id: 'voice',
      kind: 'VOICE · 0:14 · YESTERDAY 3:52P',
      text: '"tell Dana I need the sub plans template"',
    },
  ],
  pendingCount: 9,
}

export const sortQueue = [
  {
    id: 1,
    capturedAt: 'CAPTURED TUE 7:12A',
    text: 'Ask about the chair rentals before Friday',
  },
  {
    id: 2,
    capturedAt: 'CAPTURED TUE 7:14A',
    text: 'Order more quiz booklets before next unit',
  },
  {
    id: 3,
    capturedAt: 'CAPTURED MON 4:40P',
    text: 'Look up ring cleaning — Mom asked twice',
  },
  {
    id: 4,
    capturedAt: 'CAPTURED MON 8:02P',
    text: 'Reply to Dana re: sub plans template',
  },
]

export const sortDestinations = [
  { id: 'wedding', label: 'Wedding list', hint: 'out of your day', dark: true },
  { id: 'prep', label: 'Next prep period', hint: '11:55, 50 min free' },
  { id: 'someday', label: 'Someday pile', hint: 'no guilt, no reminders' },
  { id: 'delete', label: "Delete — it wasn't real", dashed: true },
]

export const habits = [
  {
    id: 'reset',
    title: 'After-work reset',
    meta: '3:45 · 12 minutes · 4 steps',
    week: [1, 1, 0, 1, 1, 0, null],
    ringDone: false,
  },
  {
    id: 'move',
    title: 'Move your body',
    meta: 'after school, evening, or weekend — 3× a week',
    week: [0, 1, 0, 1, 0, 0, null],
    ringDone: false,
    footnote: '2 of 3 done. Today is the third.',
  },
  {
    id: 'water',
    title: 'Water',
    meta: '4 of 6 · refill at prep and at 3:00',
    tally: [1, 1, 1, 1, 0, 0],
  },
  {
    id: 'pm',
    title: 'PM routine',
    meta: '8:30 · starts on its own',
    runNow: true,
  },
]

export const pmRoutineSteps = [
  { id: 1, title: 'Dishes out of the sink', done: true },
  { id: 2, title: "Pack tomorrow's bag", subtitle: 'Laptop, charger, water bottle, gym shoes.', current: true },
  { id: 3, title: 'Phone on the charger, kitchen counter', done: false },
  { id: 4, title: 'Look at tomorrow for 20 seconds', done: false },
]

export const wedding = {
  dateLabel: 'JUNE 27, 2027',
  daysOut: 292,
  urgent: {
    title: 'Book the florist tasting',
    note: "She's held the date twice. 10 minutes on the phone.",
  },
  totalCount: 34,
  nextUp: [
    { id: 1, title: 'Final headcount to the barn', due: 'Oct 15', urgent: true },
    { id: 2, title: 'Save-the-dates ordered', due: 'Nov 1' },
    { id: 3, title: 'Chair rentals — ask about count', due: 'no date' },
    { id: 4, title: 'Dress — first fitting', due: 'Jan' },
  ],
  budget: {
    spent: 9400,
    total: 24000,
    committed: 3300,
    spentPct: 39,
    committedPct: 14,
  },
}

export const review = {
  headline: 'You guess 20 minutes for everything. Nothing takes 20 minutes.',
  items: [
    { id: 'grading', label: 'Grading', guessed: 20, actual: 41, guessedPct: 32, actualPct: 68 },
    { id: 'wedding', label: 'Wedding calls', guessed: 10, actual: 25, guessedPct: 20, actualPct: 50 },
    { id: 'sub', label: 'Sub plans', guessed: 30, actual: 28, guessedPct: 60, actualPct: 56 },
  ],
  changeSuggestion: 'From now on, prep period holds one task, not three.',
  droppedCount: 7,
}

export const nudges = [
  {
    id: 1,
    time: 'now',
    text: 'Prep starts in 1 minute. Quiz set 3. Put the phone down.',
    opacity: 0.94,
  },
  {
    id: 2,
    time: '3:00p',
    text: 'Gym or home. Pick before you start the car.',
    opacity: 0.94,
    actions: ['Gym', 'Home, and I know it'],
  },
  {
    id: 3,
    time: '2nd ask · 8:41p',
    text: "PM routine. Four steps. I'll ask again at 9:10.",
    opacity: 0.72,
  },
]

export const settingsDefaults = {
  coachTone: 'Blunt coach',
  showDropCounts: true,
  showTimeEstimates: true,
}
