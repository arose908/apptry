import {
  timeToMinutes,
  minutesNow,
  formatClock,
  formatClockFromDate,
  dateKey,
  startOfWeek,
  addDays,
  daysBetween,
} from './dates.js'

export function todayOpenTasks(state) {
  return state.tasks
    .filter((t) => t.status === 'today')
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
}

export function blockState(block, nowMin) {
  const start = timeToMinutes(block.start)
  const end = timeToMinutes(block.end)
  if (nowMin >= end) return 'done'
  if (nowMin >= start) return 'now'
  return 'upcoming'
}

export function buildTimeline(state, now = new Date()) {
  const nowMin = minutesNow(now)
  const open = todayOpenTasks(state)
  let cursor = 0 // index into `open`, tasks are handed out to free blocks in order

  const sorted = [...state.schedule].sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start))

  return sorted.map((block) => {
    const st = blockState(block, nowMin)
    const base = {
      id: block.id,
      time: formatClock(block.start),
      state: st,
      label: block.label,
    }
    if (st === 'now') base.nowLabel = `NOW ${formatClockFromDate(now)}`

    if (block.kind === 'free') {
      const durationMin = timeToMinutes(block.end) - timeToMinutes(block.start)
      const candidates = open.slice(cursor).filter((t) => !t.minutes || t.minutes <= durationMin)
      if (st !== 'done' && candidates.length) {
        const focus = candidates[0]
        cursor = open.indexOf(focus) + 1
        base.focusTask = { id: focus.id, title: focus.title, estimateMin: focus.minutes || 15 }
        const second = open.slice(cursor).find((t) => !t.minutes || t.minutes <= durationMin)
        if (second) base.task = { id: second.id, title: second.title, minutes: second.minutes || '?' }
      } else if (st !== 'done') {
        base.note = 'Nothing queued for this window yet. Capture something.'
      }
    } else if (block.kind === 'habit-window') {
      const habit = state.habits.find((h) => h.id === block.habitId)
      const doneToday = habit && habit.history[dateKey(now)]
      base.window = {
        title: block.windowTitle,
        note: doneToday ? 'Already done today.' : block.windowNote,
      }
    } else if (block.kind === 'pm-routine') {
      const doneCount = (state.pmRoutine.history[dateKey(now)] || []).length
      const allDone = doneCount >= state.pmRoutine.steps.length
      base.note = allDone ? 'Done for today.' : block.note
    } else {
      base.note = st === 'done' ? 'Passed.' : ''
    }

    return base
  })
}

export function nextFreeWindow(state, now = new Date()) {
  const nowMin = minutesNow(now)
  const free = state.schedule
    .filter((b) => b.kind === 'free')
    .map((b) => ({ ...b, startMin: timeToMinutes(b.start), endMin: timeToMinutes(b.end) }))
    .sort((a, b) => a.startMin - b.startMin)

  const active = free.find((b) => nowMin >= b.startMin && nowMin < b.endMin)
  if (active) return { block: active, minutesLeft: active.endMin - nowMin, atClock: formatClockFromDate(now) }

  const upcoming = free.find((b) => b.startMin > nowMin)
  if (upcoming) return { block: upcoming, minutesLeft: upcoming.endMin - upcoming.startMin, atClock: formatClock(upcoming.start) }

  return null
}

export function droppedTodayCount(state, now = new Date()) {
  const key = dateKey(now)
  return state.droppedLog.filter((d) => dateKey(new Date(d.date)) === key).length
}

export function droppedThisWeekCount(state, now = new Date()) {
  const weekStart = startOfWeek(now)
  return state.droppedLog.filter((d) => new Date(d.date) >= weekStart).length
}

export function tasksTouchedThisWeek(state, now = new Date()) {
  const weekStart = startOfWeek(now)
  const done = state.tasks.filter((t) => t.status === 'done' && t.doneAt && new Date(t.doneAt) >= weekStart)
  const dropped = state.droppedLog.filter((d) => new Date(d.date) >= weekStart)
  return { doneCount: done.length, droppedCount: dropped.length, total: done.length + dropped.length }
}

export function habitWeekGrid(habit, now = new Date()) {
  const weekStart = startOfWeek(now)
  const todayKey = dateKey(now)
  const grid = []
  for (let i = 0; i < 7; i++) {
    const d = addDays(weekStart, i)
    const key = dateKey(d)
    if (key > todayKey) grid.push(null)
    else grid.push(habit.history[key] ? 1 : 0)
  }
  return grid
}

export function habitWeekCount(habit, now = new Date()) {
  return habitWeekGrid(habit, now).filter((v) => v === 1).length
}

export function weddingView(state, now = new Date()) {
  const weddingDate = new Date(`${state.wedding.date}T00:00:00`)
  const daysOut = Math.max(0, daysBetween(now, weddingDate))
  const items = state.tasks
    .filter((t) => t.status === 'wedding')
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  const open = items.filter((t) => t.status !== 'done')
  const urgent = open[0] || null
  const spent = state.wedding.budgetItems.filter((i) => i.status === 'paid').reduce((s, i) => s + i.amount, 0)
  const committed = state.wedding.budgetItems.filter((i) => i.status === 'committed').reduce((s, i) => s + i.amount, 0)
  const total = state.wedding.budgetTotal || 1
  return {
    dateLabel: weddingDate
      .toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      .toUpperCase(),
    daysOut,
    urgent,
    nextUp: open.slice(0, 6),
    totalCount: items.length,
    budget: {
      spent,
      committed,
      total,
      spentPct: Math.min(100, Math.round((spent / total) * 100)),
      committedPct: Math.min(100 - Math.round((spent / total) * 100), Math.round((committed / total) * 100)),
    },
  }
}

export function reviewView(state, now = new Date()) {
  const weekStart = startOfWeek(now)
  const recent = state.timerLog.filter((l) => new Date(l.date) >= weekStart)
  const byTitle = new Map()
  for (const log of recent) {
    const key = log.title
    if (!byTitle.has(key)) byTitle.set(key, { id: key, label: log.title, guessed: 0, actual: 0, n: 0 })
    const entry = byTitle.get(key)
    entry.guessed += log.estimateMin
    entry.actual += log.actualMin
    entry.n += 1
  }
  const items = [...byTitle.values()]
    .map((e) => ({
      id: e.id,
      label: e.label,
      guessed: Math.round(e.guessed / e.n),
      actual: Math.round(e.actual / e.n),
    }))
    .slice(0, 5)

  const maxVal = Math.max(1, ...items.flatMap((i) => [i.guessed, i.actual]))
  for (const i of items) {
    i.guessedPct = Math.round((i.guessed / maxVal) * 100)
    i.actualPct = Math.round((i.actual / maxVal) * 100)
  }

  const totalGuessed = recent.reduce((s, l) => s + l.estimateMin, 0)
  const totalActual = recent.reduce((s, l) => s + l.actualMin, 0)
  const overrunPct = totalGuessed ? totalActual / totalGuessed : 1

  let headline
  if (!recent.length) {
    headline = 'Run a few timers this week and this page fills in with your real numbers.'
  } else if (overrunPct > 1.25) {
    const avgGuess = Math.round(totalGuessed / recent.length)
    headline = `You guess ${avgGuess} minutes for everything. Nothing takes ${avgGuess} minutes.`
  } else if (overrunPct < 0.85) {
    headline = "You're overestimating. Things are taking less time than you plan for."
  } else {
    headline = 'Your estimates are holding up. Keep timing things.'
  }

  const worst = [...items].sort((a, b) => b.actual / b.guessed - a.actual / a.guessed)[0]
  const changeSuggestion = worst
    ? `${worst.label} took ${worst.actual}m against a ${worst.guessed}m guess. Block more time for it next time.`
    : 'Log a few more sessions to get a suggestion.'

  return {
    headline,
    items,
    changeSuggestion,
    suggestionKey: worst ? worst.id : null,
    droppedCount: droppedThisWeekCount(state, now),
  }
}

export function nextNudge(state, now = new Date()) {
  const win = nextFreeWindow(state, now)
  const nowMin = minutesNow(now)
  const upcoming = [...state.schedule]
    .map((b) => ({ ...b, startMin: timeToMinutes(b.start) }))
    .filter((b) => b.startMin >= nowMin && b.startMin - nowMin <= 60)
    .sort((a, b) => a.startMin - b.startMin)[0]

  const nudges = []
  if (upcoming) {
    const minsAway = upcoming.startMin - nowMin
    nudges.push({
      id: upcoming.id,
      time: minsAway <= 0 ? 'now' : `in ${minsAway}m`,
      text:
        minsAway <= 1
          ? `${upcoming.label} is starting. Put the phone down.`
          : `${upcoming.label} starts in ${minsAway} minutes.`,
      opacity: 0.94,
      habitId: upcoming.habitId,
    })
  }
  if (win && win.block && !upcoming) {
    nudges.push({
      id: 'free-window',
      time: win.atClock,
      text: `${win.minutesLeft} minutes free at ${win.atClock}. Pick one thing before you open your phone.`,
      opacity: 0.8,
    })
  }
  return nudges
}
