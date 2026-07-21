# AI onboarding UX simplification design

## Approved direction

The supplied UX specification is the product decision for this iteration. The
employee experience is rebuilt around one question per screen and one obvious
next action: the employee opens a prefilled home, starts an eight-question
diagnostic, sees a neutral learning focus, and lands on `Сегодня` with at most
three tasks. The full route, knowledge constellation and assistant are
secondary destinations, not competing desktop columns.

## State architecture

One persisted demo onboarding state owns the seed employee, diagnostic summary,
learning route, task statuses and escalations. Derived selectors calculate
today's tasks, the next task, learning progress and the manager rows. The
manager dashboard reads the same persisted record rather than a separate
employee-facing status copy. Diagnostic answers only determine the focus; they
do not affect route completion.

## Employee flow

`/onboarding-agent` opens a prefilled welcome / Today state depending on
whether the saved employee has completed the diagnostic. `Начать диагностику`
opens question one directly. Questions use explicit `Далее` / `Завершить`
actions and retain editable answers. The result names familiar and focus topics
only. `Перейти к задачам` builds the route once and opens Today.

Today contains a compact progress header, the current task hero, up to three
task rows, assistant entry point and a text link to `Мой план`. Task actions
map to `todo`, `in_progress`, `done`, or `blocked`; a blocked task exposes
`Попросить помощь`. Future route periods are disclosures closed by default.

## Assistant and manager

The assistant lives in a panel invoked from employee UI. A request always
reaches `loading`, `answered`, `needs_human`, or `error`; grounded replies show
their retrieved source. The fallback creates a persisted escalation after the
employee selects `Передать наставнику`.

The manager route is a separate demo entry point. It displays completion,
current stage, blocked tasks and escalations; it does not display risk,
readiness or HR decisions. Employee UI contains no manager link or control.

## Validation

Tests cover the selectors and shared task update behaviour. Browser checks at
1440x900 and 1280x800 cover the new result, Today and My plan screens, plus
the assistant fallback and manager synchronization.
