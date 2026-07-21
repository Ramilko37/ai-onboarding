# AI onboarding UX simplification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (or subagent-driven-development) to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver the approved 5–7 minute employee onboarding demo with a focused Today screen, eight-question diagnostic, source-backed assistant and a synchronized manager view.

**Architecture:** `useOnboardingAgentState` becomes the persisted demo source of truth for the employee, diagnostic summary, route tasks and escalations. Pure selector functions derive Today, next task, learning completion and manager rows from that state. Employee and manager UI consume those shared projections; diagnostic scoring remains internal to route generation and is not rendered as an employee or manager judgement.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS v4, existing Mayak primitives, browser `localStorage`, Node test runner via existing npm scripts.

## Global Constraints

- Preserve the existing demo-first stack, local RAG route and seed data; add no dependency.
- Keep all employee UI free of score, risk, readiness and manager controls.
- Use `todo | in_progress | done | blocked` as the visible task state; diagnostics do not contribute to completion.
- Standard barista diagnostic contains exactly eight questions and one question is displayed at a time.
- On desktop use a 1180–1240px container, one main employee column, ≤4 above-fold groups and one primary CTA.
- Use calm, concrete Russian copy and grammatical plural helpers; never construct a declined name by appending an ending.
- Preserve keyboard navigation, focus-visible, disabled, loading, error and success states.

## Logical-to-physical file map

| Logical module | Actual paths |
| --- | --- |
| employee/home | `src/modules/personal-space/ui/PersonalSpaceWorkspace.tsx`, `HeroGreeting.tsx`, `TodayFocus.tsx`, `PersonalSpace.tsx` |
| diagnostic/flow | `src/modules/onboarding-agent/model/useOnboardingAgentState.ts`, `lib/getDiagnosticQuestions.ts`, `ui/steps/DiagnosticStep.tsx`, `ui/OnboardingAgentPage.tsx` |
| diagnostic/result | `src/modules/onboarding-agent/ui/steps/DiagnosticResultStep.tsx`, `model/types.ts` |
| employee/plan | `src/modules/personal-space/ui/JourneyMap.tsx` |
| assistant/panel | `src/modules/personal-space/ui/Assistant.tsx`, `app/api/mentor-chat/route.ts` |
| manager/dashboard | `src/modules/manager-dashboard/model/managerDashboardData.ts`, `ui/ManagerDashboardPage.tsx` |
| domain/onboarding types + selectors | `src/modules/onboarding-agent/model/types.ts`, `learningRouteTypes.ts`, new `model/onboardingSelectors.ts` |
| demo seed + persistence | `src/modules/onboarding-agent/model/mockData.ts`, `useOnboardingAgentState.ts`, manager storage adapter |
| Russian plural helper | new `src/shared/lib/ruPlural.ts` |
| tests | existing `diagnosticScoring.test.ts`, `learningRouteBuilder.test.ts`, `managerDashboard.test.ts`, `personal-space` tests; new selector/state tests if necessary |

---

### Task 1: Normalize persisted state and selectors

**Files:**
- Modify: `src/modules/onboarding-agent/model/types.ts`, `learningRouteTypes.ts`, `useOnboardingAgentState.ts`
- Create: `src/modules/onboarding-agent/model/onboardingSelectors.ts`, `src/modules/onboarding-agent/model/onboardingSelectors.test.ts`, `src/shared/lib/ruPlural.ts`
- Modify: `src/modules/manager-dashboard/model/managerDashboardData.ts`, `src/modules/manager-dashboard/model/managerDashboard.test.ts`

**Interfaces:**
- Produces `getTodayTasks(route)`, `getNextTask(route)`, `getLearningProgress(route)`, `getRouteStatus(route)` and `getManagerEmployeeRows(records)`.
- `updateLearningTaskStatus(taskId, status)` updates the persisted route once and synchronizes the manager record from that route.

- [ ] Write selector tests for a route with todo, in-progress, done and blocked tasks; assert Today has at most three current-day tasks and `Math.round(done / total * 100)` excludes diagnostic answers.
- [ ] Add `blocked` task status, `blockedReason` and escalation data to the domain models; migrate saved `needs_mentor` values to `blocked` on restore.
- [ ] Implement pure selectors with flattened route tasks and no component-local task status.
- [ ] Version the storage key to `valle-sanchez:barista-onboarding-state:v2`, migrate v1 state on read, and persist the current route and escalation list.
- [ ] Change manager record projection to completion/current stage/blocked count/escalations; do not render or persist risk/readiness decisions for the new record shape.
- [ ] Run `npm run test:diagnostic`, `npm run test:learning-route`, `npm run test:manager-dashboard`, and the new selector test; commit `feat: unify onboarding task state`.

### Task 2: Direct employee entry and eight-question diagnostic

**Files:**
- Modify: `src/modules/onboarding-agent/ui/OnboardingAgentPage.tsx`, `model/useOnboardingAgentState.ts`, `model/types.ts`, `lib/getDiagnosticQuestions.ts`
- Modify: `src/modules/onboarding-agent/ui/steps/WelcomeStep.tsx`, `DiagnosticStep.tsx`
- Delete or stop rendering: `EmployeeProfileStep.tsx`, `CompetencyMapStep.tsx`, `DiagnosticIntroStep.tsx` from the normal flow
- Modify: `src/modules/onboarding-agent/model/diagnosticScoring.test.ts`

**Interfaces:**
- `createDemoEmployee()` supplies Sofia’s seed profile.
- `startDiagnostic()` moves directly to `diagnostic`; unfinished answers remain navigable.

- [ ] Update question selection to choose one critical/representative question per topic, sort stably and `slice(0, 8)`.
- [ ] Add a test asserting the standard barista demo returns eight unique-topic questions.
- [ ] Replace the four setup steps with one compact prefilled welcome screen containing role, start date, three short steps and `Начать диагностику`; render `Продолжить` only for an unfinished diagnostic.
- [ ] Remove stage navigation and the profile / competency / intro screens from the employee happy path.
- [ ] Keep selected options on navigation; replace auto-advance with a disabled-until-selected `Далее` / `Завершить` primary action and a secondary `Назад`.
- [ ] Render `Вопрос N из 8`, retain the two-line trust copy above question one, and remove the diagnostic percentage card.
- [ ] Run diagnostic and learning-route tests; commit `feat: streamline employee diagnostic`.

### Task 3: Neutral diagnostic result and focused Today home

**Files:**
- Modify: `src/modules/onboarding-agent/ui/steps/DiagnosticResultStep.tsx`, `LearningRouteStep.tsx`
- Modify: `src/modules/personal-space/PersonalSpace.tsx`, `ui/PersonalSpaceWorkspace.tsx`, `ui/HeroGreeting.tsx`, `ui/TodayFocus.tsx`
- Modify: `src/modules/personal-space/lib/getEmployeeFocusSummary.ts`, related tests

**Interfaces:**
- `DiagnosticResultStep` accepts a summary and calls `onBuildRoute()` once from `Перейти к задачам`.
- `TodayFocus` consumes `getTodayTasks(route)` and sends contextual task intents to the state action.

- [ ] Replace the score ring, readiness copy, critical/risk panels and detail hash link with `Персональный фокус готов`, up to three `Уже знакомо` topics and up to three `На этом сфокусируемся` topics.
- [ ] Use the copy `Мы добавили эти темы в первые задачи вашего маршрута.` and one primary `Перейти к задачам` CTA.
- [ ] Remove `ManagerSavedBlock`, reset/testing controls and manager link from employee UI.
- [ ] Make `Сегодня` the first and default workspace, with compact greeting/progress, next-task hero, up to three task rows, assistant entry and an inline `Посмотреть весь план` link.
- [ ] Replace checkbox toggles with context actions: `Начать`, `Завершить`, `Есть проблема`; a blocked task shows its reason and `Попросить помощь`.
- [ ] Display type, estimated duration, one-line description and text-plus-icon status on every visible task.
- [ ] Update personal-space tests for three-task truncation, next-task selection and progress calculation; commit `feat: focus employee home on todays tasks`.

### Task 4: Collapsible plan and assistant request states

**Files:**
- Modify: `src/modules/personal-space/ui/JourneyMap.tsx`, `PersonalSpaceWorkspace.tsx`, `ui/Assistant.tsx`
- Modify: `src/modules/personal-space/lib/workspaceNavigation.ts`, `src/modules/knowledge-base/model/types.ts` if request metadata is required
- Modify: `src/modules/knowledge-base/model/knowledgeBase.test.ts`, `mentorRoute.test.ts`

**Interfaces:**
- `JourneyMap` renders only Today expanded; later periods are `<details>` disclosures.
- `AssistantRequestStatus = 'idle' | 'loading' | 'answered' | 'needs_human' | 'error'` controls response UI.
- `onCreateEscalation(question)` records a manager-visible human handoff.

- [ ] Replace per-task `<select>` controls with the same one-context-action task controls as Today.
- [ ] Group plan by `Сегодня`, `День 2–7`, `Неделя 2`; expand the current group and collapse future groups by default.
- [ ] Move the knowledge constellation to a secondary disclosure inside `Мой план` so it is not above the fold.
- [ ] Make mentor a drawer/panel invoked from Today instead of a permanently competing desktop column.
- [ ] Add loading UI immediately after sending, display known-answer sources, show retry copy on HTTP/network error, and show the prescribed human fallback with `Передать наставнику`.
- [ ] Add tests for grounded citation, empty/error response and unknown-question fallback; commit `feat: make plan and mentor secondary flows reliable`.

### Task 5: Manager projection, role isolation and desktop polish

**Files:**
- Modify: `app/manager/page.tsx`, `src/modules/manager-dashboard/ui/ManagerDashboardPage.tsx`, `model/managerDashboardData.ts`
- Modify: `src/modules/onboarding-agent/ui/OnboardingAgentPage.tsx`, `app/globals.css`, `docs/current-state.md`

**Interfaces:**
- Manager view derives rows from persisted task data and escalation records.
- An employee visitor to `/manager` receives a demo-forbidden/redirect state; `/manager?demoRole=manager` retains the manager entry.

- [ ] Replace risk filters/cards and automatic readiness recommendations with completion, current stage, blocked task and open escalation fields.
- [ ] Ensure the current saved Sofia demo employee appears in the manager dataset immediately after route generation and task updates persist across navigation/reload.
- [ ] Render a direct employee visit to `/manager` as a neutral access boundary; keep manager access available through explicit demo role query.
- [ ] Apply 1180–1240px desktop shell, whitespace hierarchy, no more than four above-fold groups and one primary CTA per employee screen.
- [ ] Add `hover`, `focus-visible`, `disabled`, `loading`, `error` and `success` states for interactive controls; use `ruPlural` for task/topic/day counts.
- [ ] Update `docs/current-state.md` with the new routes, state key, user flow and checks; commit `feat: align manager view with learning progress`.

### Task 6: End-to-end verification and handoff

**Files:**
- Modify only if verification exposes an issue: files from Tasks 1–5
- Update: `docs/current-state.md`

- [ ] Run `npm run test:diagnostic`, `npm run test:learning-route`, `npm run test:knowledge-base`, `npm run test:manager-dashboard`, `npm run test:personal-space` and `npm run build`.
- [ ] Browser-check: one-click entry to question one; eight answers; neutral result; Today with ≤3 tasks; task sync in My plan and manager; grounded mentor answer; human fallback/escalation; no employee manager navigation.
- [ ] Capture desktop screenshots for result, Today and My plan at 1440×900, and confirm 1280×800 has no horizontal overflow or console errors.
- [ ] Record completed checks and any deferred P1 item in `docs/current-state.md`; commit `docs: verify simplified onboarding flow`.
