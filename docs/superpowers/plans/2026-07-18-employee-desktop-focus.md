# Employee Desktop Focus Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the employee personal-space desktop view into a focused Today-first workspace while preserving the existing stacked mobile experience and route persistence.

**Architecture:** Add one pure personal-space focus selector for route-derived progress and next-task data, then compose existing personal-space panels behind an accessible desktop tab interface. The tab component owns presentation state only; onboarding scoring, route generation, persistence, mentor retrieval, and manager-dashboard contracts remain unchanged.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS 4, Lucide React, Node assertion tests compiled with TypeScript.

## Global Constraints

- Keep the existing vertical employee composition below 1024 px.
- Activate the tabbed workspace at the existing Tailwind `lg` breakpoint (1024 px); add no arbitrary breakpoints.
- Default desktop tab is `today`; remaining tabs are `route`, `mentor`, and `knowledge`.
- Preserve touch-friendly controls and visible keyboard focus.
- Keep task status updates connected to the existing `onUpdateTaskStatus(taskId, status)` callback.
- Add no dependency and change no persistence key, diagnostic rule, learning-route rule, mentor API behavior, or manager-dashboard data contract.
- Keep demo fallback content when no generated route is provided.

---

## File Map

- Create `src/modules/personal-space/lib/getEmployeeFocusSummary.ts`: pure route-to-focus projection shared by the greeting, Today panel, and desktop summary.
- Create `src/modules/personal-space/lib/getEmployeeFocusSummary.test.ts`: focused unit coverage for current-day selection, progress, next task, and empty routes.
- Create `src/modules/personal-space/ui/PersonalSpaceWorkspace.tsx`: client-only accessible tab state and responsive panel composition.
- Modify `src/modules/personal-space/ui/TodayFocus.tsx`: make generated-route tasks controlled by the existing learning-route callback; retain local state only for the no-route demo.
- Modify `src/modules/personal-space/ui/HeroGreeting.tsx`: surface the nearest task and route completion instead of diagnostic score as “progress.”
- Modify `src/modules/personal-space/PersonalSpace.tsx`: replace the dense two-column dashboard with the focused workspace and compact saved-result actions.
- Modify `package.json`: add the focused personal-space test command.
- Modify `docs/current-state.md`: document the new desktop behavior and verification date.

---

### Task 1: Add a tested employee focus projection

**Files:**
- Create: `src/modules/personal-space/lib/getEmployeeFocusSummary.ts`
- Create: `src/modules/personal-space/lib/getEmployeeFocusSummary.test.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: `LearningRoute` and `LearningTask` from `src/modules/onboarding-agent/model/learningRouteTypes.ts`.
- Produces: `getEmployeeFocusSummary(route?: LearningRoute): EmployeeFocusSummary`.

- [ ] **Step 1: Write the failing selector test**

Create a small `makeRoute()` fixture with complete `LearningRoute` fields and assert these exact behaviours:

```ts
import assert from "node:assert/strict";
import type { LearningRoute } from "../../onboarding-agent/model/learningRouteTypes";
import { getEmployeeFocusSummary } from "./getEmployeeFocusSummary";

function makeRoute(): LearningRoute {
  return {
    employeeId: "employee-1",
    role: "barista",
    grade: "no_experience",
    generatedAt: "2026-07-18T09:00:00.000Z",
    totalScorePercent: 64,
    summary: "Маршрут для теста",
    days: [
      {
        id: "day_7",
        title: "День 7",
        goal: "Стабильность",
        focus: "Повторение",
        tasks: [],
      },
      {
        id: "day_1",
        title: "День 1",
        goal: "Уверенный старт",
        focus: "Эспрессо",
        tasks: [
          {
            id: "done-task",
            dayId: "day_1",
            title: "Гигиена стойки",
            description: "Проверить рабочую зону",
            type: "check",
            priority: "required",
            status: "done",
            estimatedMinutes: 5,
            reason: "Обязательный стандарт",
          },
          {
            id: "next-task",
            dayId: "day_1",
            title: "Настройка эспрессо",
            description: "Настроить рецепт",
            type: "practice",
            priority: "required",
            status: "todo",
            estimatedMinutes: 12,
            reason: "Зона развития",
          },
        ],
      },
    ],
  };
}

const summary = getEmployeeFocusSummary(makeRoute());
assert.deepEqual(summary.todayTasks.map((task) => task.id), ["done-task", "next-task"]);
assert.equal(summary.completedTodayCount, 1);
assert.equal(summary.totalTodayCount, 2);
assert.equal(summary.nextTask?.id, "next-task");
assert.equal(summary.routeCompletedCount, 1);
assert.equal(summary.routeTaskCount, 2);
assert.equal(summary.routeProgressPercent, 50);

const empty = getEmployeeFocusSummary(undefined);
assert.equal(empty.nextTask, undefined);
assert.equal(empty.routeProgressPercent, 0);

console.log("personal-space focus tests passed");
```

- [ ] **Step 2: Add and run the failing test command**

Add to `package.json` scripts:

```json
"test:personal-space": "rm -rf .personal-space-test-build && tsc --ignoreConfig --module Node16 --moduleResolution Node16 --target ES2020 --lib ES2020,DOM --types node --outDir .personal-space-test-build --noEmit false --rootDir . src/modules/personal-space/lib/getEmployeeFocusSummary.test.ts && node .personal-space-test-build/src/modules/personal-space/lib/getEmployeeFocusSummary.test.js"
```

Run: `npm run test:personal-space`

Expected: FAIL because `getEmployeeFocusSummary.ts` does not exist.

- [ ] **Step 3: Implement the pure selector**

Create `getEmployeeFocusSummary.ts` with this public contract:

```ts
import type {
  LearningRoute,
  LearningTask,
} from "../../onboarding-agent/model/learningRouteTypes";

export type EmployeeFocusSummary = {
  todayTasks: LearningTask[];
  completedTodayCount: number;
  totalTodayCount: number;
  nextTask?: LearningTask;
  routeCompletedCount: number;
  routeTaskCount: number;
  routeProgressPercent: number;
};

export function getEmployeeFocusSummary(
  route?: LearningRoute,
): EmployeeFocusSummary {
  const todayTasks = route?.days.find((day) => day.id === "day_1")?.tasks ?? [];
  const routeTasks = route?.days.flatMap((day) => day.tasks) ?? [];
  const completedTodayCount = todayTasks.filter((task) => task.status === "done").length;
  const routeCompletedCount = routeTasks.filter((task) => task.status === "done").length;

  return {
    todayTasks,
    completedTodayCount,
    totalTodayCount: todayTasks.length,
    nextTask: todayTasks.find((task) => task.status !== "done"),
    routeCompletedCount,
    routeTaskCount: routeTasks.length,
    routeProgressPercent:
      routeTasks.length === 0
        ? 0
        : Math.round((routeCompletedCount / routeTasks.length) * 100),
  };
}
```

- [ ] **Step 4: Run the selector test**

Run: `npm run test:personal-space`

Expected: PASS and output `personal-space focus tests passed`.

- [ ] **Step 5: Commit the selector**

```bash
git add package.json src/modules/personal-space/lib/getEmployeeFocusSummary.ts src/modules/personal-space/lib/getEmployeeFocusSummary.test.ts
git commit -m "Add employee focus route summary"
```

---

### Task 2: Build the responsive Today-first workspace

**Files:**
- Create: `src/modules/personal-space/ui/PersonalSpaceWorkspace.tsx`
- Modify: `src/modules/personal-space/ui/TodayFocus.tsx`
- Modify: `src/modules/personal-space/ui/HeroGreeting.tsx`
- Modify: `src/modules/personal-space/PersonalSpace.tsx`

**Interfaces:**
- Consumes: `getEmployeeFocusSummary(route)`, existing `PersonalSpaceProfile`, `LearningRoute`, and `onUpdateTaskStatus(taskId, status)`.
- Produces: `PersonalSpaceWorkspace({ profile, route, onUpdateTaskStatus })` with desktop tabs and the existing mobile stack.

- [ ] **Step 1: Create the tab shell with desktop-only controls**

Create `PersonalSpaceWorkspace.tsx` as a client component. Define the stable tab type and labels:

```ts
type WorkspaceTabId = "today" | "route" | "mentor" | "knowledge";

const workspaceTabs: Array<{ id: WorkspaceTabId; label: string }> = [
  { id: "today", label: "Сегодня" },
  { id: "route", label: "Маршрут" },
  { id: "mentor", label: "Наставник" },
  { id: "knowledge", label: "Знания" },
];
```

Use `useState<WorkspaceTabId>("today")`, button refs, and this keyboard rule inside `onKeyDown`: ArrowRight/ArrowLeft wrap through the list, Home selects the first tab, End selects the last tab, and the newly selected button receives focus. Each button must have `role="tab"`, `aria-selected`, `aria-controls`, `tabIndex`, and a visible `focus-visible` outline.

The tab list uses `hidden lg:grid lg:grid-cols-4`. Panel wrappers use `contents` below `lg`; on desktop the active wrapper uses `lg:block` or `lg:grid`, while inactive wrappers use `lg:hidden`. This renders every existing panel once and preserves the mobile stack without viewport JavaScript or duplicated IDs.

- [ ] **Step 2: Preserve mobile order while grouping desktop tabs**

Compose panels in a parent mobile grid with the existing order:

```tsx
<div className="grid min-w-0 gap-3">
  <section className={panelClass("route")} id="route-panel" role="tabpanel">
    <div className="order-1"><JourneyMap ... /></div>
  </section>
  <section className={panelClass("knowledge")} id="knowledge-panel" role="tabpanel">
    <div className="order-2"><KnowledgeConstellation ... /></div>
  </section>
  <section className={mentorPanelClass} id="mentor-panel" role="tabpanel">
    <div className="order-3"><Assistant ... /></div>
    <div className="order-5"><SupportPanel /></div>
  </section>
  <section className={panelClass("today")} id="today-panel" role="tabpanel">
    <div className="order-4"><TodayFocus ... /></div>
  </section>
</div>
```

Implement `panelClass(tabId)` so every wrapper is `contents` below desktop, the active panel becomes visible at `lg`, and inactive panels become `lg:hidden`. For the active desktop Today panel, use a readable `max-w-4xl` rather than stretching it across the full shell. For Mentor, use a balanced two-column desktop grid with the assistant as the wider column.

- [ ] **Step 3: Connect Today task completion to route persistence**

Change `TodayFocus` props to:

```ts
export function TodayFocus({
  route,
  onUpdateTaskStatus,
}: {
  route?: LearningRoute;
  onUpdateTaskStatus?: (taskId: string, status: LearningTaskStatus) => void;
})
```

When `route` exists, derive displayed tasks directly from `getEmployeeFocusSummary(route).todayTasks.slice(0, 3)`. Clicking a generated task calls:

```ts
onUpdateTaskStatus?.(task.id, task.status === "done" ? "todo" : "done");
```

Use `initialTodayTasks` and local `useState` only when `route` is undefined. If a generated route has zero Day 1 tasks, render the explicit message `На сегодня обязательных задач не осталось. Можно открыть полный маршрут и посмотреть следующий контроль.` instead of demo tasks.

- [ ] **Step 4: Make the greeting describe the next action and real route progress**

In `HeroGreeting`, call `getEmployeeFocusSummary(route)`. Set the progress ring to `routeProgressPercent` when a generated route exists and keep `newcomer.progress` only for the demo fallback. Replace the generic paragraph with:

```tsx
<p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
  {focus.nextTask
    ? <>Сегодня главное — <span className="font-medium text-foreground">{focus.nextTask.title}</span>. Остальной маршрут можно открыть, когда понадобится.</>
    : "План на сегодня выполнен. Следующий контроль уже отмечен в маршруте."}
</p>
```

Point the desktop action to `#today-panel` and label it `К задачам`. Keep the role/location summary and route progress ring compact.

- [ ] **Step 5: Replace the dense PersonalSpace grid**

In `PersonalSpace.tsx`, import `PersonalSpaceWorkspace`, remove direct imports of `Assistant`, `JourneyMap`, `KnowledgeConstellation`, `SupportPanel`, and `TodayFocus`, and replace the two-column grid with:

```tsx
<PersonalSpaceWorkspace
  profile={profile}
  route={route}
  onUpdateTaskStatus={onUpdateTaskStatus}
/>
```

Keep `HeroGreeting` and the footer. Restyle `ManagerSavedBlock` as a compact secondary notice: use smaller desktop padding, make the dashboard link secondary rather than primary, keep the reset action ghost-like, and remove the obsolete `Вернуться к результату` anchor because the Route tab replaces it.

- [ ] **Step 6: Run focused and integration verification**

Run: `npm run test:personal-space`

Expected: PASS.

Run: `npm run test:learning-route`

Expected: PASS; generated tasks and status changes remain valid.

Run: `npm run test:manager-dashboard`

Expected: PASS; manager summary contracts are unchanged.

- [ ] **Step 7: Commit the workspace**

```bash
git add src/modules/personal-space/PersonalSpace.tsx src/modules/personal-space/ui/PersonalSpaceWorkspace.tsx src/modules/personal-space/ui/TodayFocus.tsx src/modules/personal-space/ui/HeroGreeting.tsx
git commit -m "Add focused employee desktop workspace"
```

---

### Task 3: Verify responsive behaviour and update project state

**Files:**
- Modify: `docs/current-state.md`

**Interfaces:**
- Consumes: the completed desktop workspace from Task 2.
- Produces: verified responsive behaviour and an updated implementation snapshot.

- [ ] **Step 1: Run the full automated project verification**

Run these commands individually:

```bash
npm run test:diagnostic
npm run test:learning-route
npm run test:knowledge-base
npm run test:manager-dashboard
npm run test:personal-space
npm run build
```

Expected: every command exits with code 0; the build completes without TypeScript, accessibility, or route-generation errors.

- [ ] **Step 2: Perform browser verification at the accepted widths**

Start the local app and complete or restore a barista diagnostic so the learning route is visible. Check 375 px, 768 px, 1280 px, and 1440 px.

At 375 px and 768 px, verify the full stack remains visible in this order: Route, Knowledge, Mentor, Today, Support. Confirm there is no horizontal overflow and all controls remain at least 44 px high where touch interaction is expected.

At 1280 px and 1440 px, verify Today is initially selected; only one primary tab panel is visible; mouse and ArrowLeft/ArrowRight/Home/End navigation work; focus is visible; Route task changes update Today; mentor chat still answers from the local source-backed API; and Knowledge fits without clipping.

- [ ] **Step 3: Update current state**

In `docs/current-state.md`, add the desktop Today-first workspace to the implemented employee flow, record the four verification widths, add `npm run test:personal-space` to expected commands, and set `Last updated: 2026-07-18`. Do not change the roadmap because product scope is unchanged.

- [ ] **Step 4: Check the final diff and commit documentation**

Run:

```bash
git diff --check
git status --short
```

Expected: no whitespace errors and only the intended current-state update is uncommitted.

Then commit:

```bash
git add docs/current-state.md
git commit -m "Document employee desktop workspace"
```
