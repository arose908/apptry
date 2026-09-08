# ADHD-Friendly Daily Planner

_Started 2026-09-08 16:02 UTC_

---

## User

Design a mobile app for me to use as a kind of daily planner that is effective for someone with adhd who is bad at using planner and keeping routines and habits. Use what you know about me to personalize the app

## Assistant



## Assistant

I don't have background on you yet, so let me collect the essentials rather than guess.

_[tool: ask_user]_

Waiting on your answers — especially the "tell me about your days" and habits fields, since those become the actual content of the app.

## User

Answered — Asked for follow-up questions; about_you: teacher, planning a wedding, trying to fit in exercise I tend put off important things bc I forget about them; failure_mode: I forget the app exists, Setup is too much work, Guilt from overdue items piles up, I overplan then abandon the plan, Time blindness — I misjudge how long things take, Task list gets so long it's mea…; core_need: Knowing what to do RIGHT NOW, Building a few habits that stick, Starting tasks I'm avoiding, Seeing where time actually went, Winding down / sleep routine; day_shape: Loose but recurring; tone: Blunt coach, p…

## Assistant



## Assistant

_[tool: ask_user]_

Round two is up — mainly your school-day rhythm and where blunt stops being useful.

## User

Answered — Asked for follow-up questions; school_rhythm: 7:40-3 Prep 5th period around 11:55-12:45 PLC/prep 1st period 8:10-8:50; wedding_role: Full checklist with deadline countdown, Just the next 1–2 things, hide the rest, Budget tracking, Keep it out of my daily view entirely; blunt_limit: Show the count of what I dropped

## Assistant



## Assistant

_[tool: ask_user]_

Final round is up — the wedding split, your date, and how things get captured.

## User

Answered — wedding_resolve: Separate wedding tab; daily view shows one line with the next thing + days-out; wedding_date: June 27th 2027; capture: One big always-there text box — dump it, sort later, Voice note while driving home, Forward an email; exercise_when: Right after school, Evening, Weekends only

## Assistant



## Assistant

One thing left: nobody picked a visual direction, and I don't want to guess on your behalf.

_[tool: ask_user]_

Waiting on the four visual picks — then I build both directions.

## User

Answered — vibe: Calm paper — warm off-white, soft ink, nothing shouts; accent: #D94F2B; type: Grotesque sans throughout — plain, fast to scan; layout: option_3

## Assistant

_[tool: copy_starter_component]_

_[tool: grep]_

_[tool: read_file]_

_[tool: dc_write]_

_[tool: ready_for_verification]_

Two directions, built around your actual day (7:40–3, 1st-period PLC, 5th-period prep, after-school window) and June 27, 2027.

**1a — The Rail** (9 screens): the day pinned to the clock, tasks only ever offered inside a window you can act in. Includes the estimate-vs-actual timer for time blindness, sort-one-card-at-a-time triage, four capped habits, the wedding tab with countdown and budget, a Sunday review, and the persistent-nudge lock screen.

**1b — One Thing** (4 screens): same voice, no list at all. One task on screen, the rest physically hidden, capture as the home screen.

Both use "show the count" rather than naming broken streaks, per your answer. Tell me which to build out — or whether you want 1b's single-focus Today grafted onto 1a's rail.

## User

Found issues — fixing…

## User

Found issues — fixing…

## User

Found issues — fixing…

## Assistant

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

Fixed both — those two muted labels sit on dark cards, so they now use the dark-surface tone.

## User

Send this design to Netlify: `Right Now.dc.html`

## Assistant

_[tool: dc_html_str_replace]_

_[tool: tool_search_tool_bm25]_

_[tool: bundle_project]_

_[tool: netlify__import-claude-design-from-url]_

_[tool: netlify__get-design-import-job-status]_

_[tool: sleep]_

_[tool: netlify__get-design-import-job-status]_

Live: [Open in Netlify](https://right-now-adhd-daily-planner-cd-f982c27df2.netlify.app) · [manage the site](https://app.netlify.com/projects/right-now-adhd-daily-planner-cd-f982c27df2)

