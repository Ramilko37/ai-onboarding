# Knowledge Constellation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the knowledge constellation into an accessible, high-contrast interactive map whose selected topic exposes a clear next learning action.

**Architecture:** Keep pure route-to-map derivation in a personal-space library so both the UI and node tests use the same mapping. Keep selection and keyboard focus local to `KnowledgeConstellation`; it accepts the existing optional `LearningRoute` and calls a supplied local navigation callback only when the selected topic has a task to open.

**Tech Stack:** Next.js App Router, React client component state, TypeScript, Tailwind CSS v4, Node test runner.

## Global Constraints

- Preserve the constellation metaphor while never placing full topic labels inside map nodes.
- Do not hard-code route task titles in UI; derive selected-topic details from `LearningRoute`.
- Keep demo fallback nodes and their existing knowledge links when no route exists.
- Nodes must be semantic 44px-or-larger buttons with accessible name, `aria-pressed`, visible focus state, and pointer/keyboard selection.
- Keyboard: Enter/Space select; Arrow keys wrap through topics; Home/End choose first/last.
- Respect reduced-motion preferences and do not add a dependency or a global store.
- Verify with `npm run test:personal-space` and `npm run build`; browser-check generated-route mobile and desktop views.

---

## File structure

- Create `src/modules/personal-space/lib/getKnowledgeConstellationItems.ts`: derives stable map items, route links and selected-topic details from route tasks or fallback data.
- Create `src/modules/personal-space/lib/getKnowledgeConstellationItems.test.ts`: asserts fallback, route mapping, next-action selection and keyboard index helper behaviour.
- Modify `src/modules/personal-space/data.ts`: extend fallback node metadata with short status/action copy used when no route exists.
- Modify `src/modules/personal-space/ui/KnowledgeConstellation.tsx`: render the map buttons, selection, keyboard navigation, detail card and action.
- Modify `src/modules/personal-space/ui/PersonalSpaceWorkspace.tsx`: pass the existing route-opening callback into the knowledge panel, so its action navigates to the Route tab instead of being a dead control.
- Modify `src/modules/personal-space/ui/JourneyMap.tsx`: expose stable focus targets on rendered route tasks.
- Modify `package.json`: compile both personal-space test files in `test:personal-space`.
- Modify `docs/current-state.md`: record the interactive constellation and verification command only after successful implementation.

## Task 1: Derive constellation items from route data

**Files:**
- Create: `src/modules/personal-space/lib/getKnowledgeConstellationItems.ts`
- Create: `src/modules/personal-space/lib/getKnowledgeConstellationItems.test.ts`
- Modify: `src/modules/personal-space/data.ts:15-23,108-119`
- Modify: `package.json:10`

**Interfaces:**
- Consumes: `LearningRoute`, `LearningTask`, `KnowledgeNode`, `knowledgeNodes`, `knowledgeLinks`.
- Produces:

```ts
export type KnowledgeConstellationItem = KnowledgeNode & {
  title: string;
  statusLabel: string;
  task?: LearningTask;
  actionLabel: string;
};

export function getKnowledgeConstellationItems(route?: LearningRoute): {
  items: KnowledgeConstellationItem[];
  links: KnowledgeLink[];
};

export function getNextConstellationIndex(
  currentIndex: number,
  key: "ArrowLeft" | "ArrowRight" | "ArrowUp" | "ArrowDown" | "Home" | "End",
  length: number,
): number;
```

- Produces fallback metadata in `KnowledgeNode` without changing existing `id`, `label`, `mastery`, `x`, `y`, or `size` callers.

- [ ] **Step 1: Write failing derivation tests**

Create `getKnowledgeConstellationItems.test.ts` with a compact `LearningRoute` containing two `topicId` tasks: one `done` hygiene task and one `todo` milk task. Assert that the route result has the task-derived full title, maps `todo` to `В работе`, carries the `todo` task as its action target, and creates links between sequential displayed topic IDs. Assert that no-route result preserves `knowledgeNodes`/`knowledgeLinks` length and supplies readable fallback title/action text. Add keyboard assertions for wrapping, Home and End.

```ts
assert.equal(routeMap.items[1]?.title, "Молоко и текстура");
assert.equal(routeMap.items[1]?.statusLabel, "В работе");
assert.equal(routeMap.items[1]?.task?.id, "milk-task");
assert.deepEqual(routeMap.links, [["hygiene", "milk"]]);
assert.equal(getNextConstellationIndex(0, "ArrowLeft", 3), 2);
assert.equal(getNextConstellationIndex(1, "End", 3), 2);
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npx tsc --ignoreConfig --module Node16 --moduleResolution Node16 --target ES2020 --lib ES2020,DOM --types node --outDir .personal-space-test-build --noEmit false --rootDir . src/modules/personal-space/lib/getKnowledgeConstellationItems.test.ts`

Expected: FAIL because `getKnowledgeConstellationItems` does not exist.

- [ ] **Step 3: Add the minimal pure mapping implementation**

In `getKnowledgeConstellationItems.ts`, create a fixed eight-position array, flatten `route.days`, retain the first task for each `topicId`, and return items in task order. Map statuses as `done → strong/Уверенно`, `in_progress` or `needs_mentor → learning/В работе`, and `todo → new/Впереди`; derive `title` from the current colon suffix rule. Build route links from adjacent item IDs. For no route, map fallback nodes to a `title` equal to `label`, a human status label, and an action label such as `Открыть материалы`; return `knowledgeLinks` unchanged. Implement wrapped index navigation with `((index % length) + length) % length` and return `0` for an empty list.

```ts
const taskByTopic = new Map<string, LearningTask>();
for (const task of route?.days.flatMap((day) => day.tasks) ?? []) {
  if (task.topicId && !taskByTopic.has(task.topicId)) taskByTopic.set(task.topicId, task);
}

const links = items.slice(1).map((item, index) => [items[index]!.id, item.id] as KnowledgeLink);
```

- [ ] **Step 4: Extend fallback data only with presentation metadata**

Add optional `description?: string` and `actionLabel?: string` to `KnowledgeNode`. Give each fallback node a one-line description and `Открыть материалы`; do not alter its coordinates, label or mastery. The new library must use these fields rather than place fallback copy in the component.

- [ ] **Step 5: Make the project command compile both personal-space test files**

Replace the final test input in `package.json` with both files:

```json
"src/modules/personal-space/lib/getEmployeeFocusSummary.test.ts src/modules/personal-space/lib/getKnowledgeConstellationItems.test.ts"
```

- [ ] **Step 6: Run the focused test to verify it passes**

Run: `npm run test:personal-space`

Expected: all current focus/workspace tests plus the new constellation mapping tests pass.

- [ ] **Step 7: Commit the independently tested model change**

```bash
git add src/modules/personal-space/data.ts src/modules/personal-space/lib/getKnowledgeConstellationItems.ts src/modules/personal-space/lib/getKnowledgeConstellationItems.test.ts package.json
git commit -m "Add knowledge constellation mapping"
```

## Task 2: Build the accessible selected-topic map

**Files:**
- Modify: `src/modules/personal-space/ui/KnowledgeConstellation.tsx:1-160`

**Interfaces:**
- Consumes: `getKnowledgeConstellationItems`, `getNextConstellationIndex`, optional `onOpenTask?: (taskId: string) => void`.
- Produces: a client-rendered selected-topic map that exposes exactly one selected item and only calls `onOpenTask` when `selectedItem.task` is defined.

- [ ] **Step 1: Replace label circles with interactive node buttons**

Add `"use client"`, `useMemo`, `useRef` and `useState`. Initialise selection to the first `learning` item, falling back to index `0`. Render each item as a `<button type="button">` with an `aria-label` of `${item.title}. ${item.statusLabel}`, `aria-pressed={index === selectedIndex}`, minimum `h-11 w-11`, a unique status icon/sequence number, and a strong `focus-visible:ring-2` treatment. Use the data library’s `links` to draw lines for both fallback and route maps. Do not render `item.title` in a node.

```tsx
onKeyDown={(event) => {
  if (!navigationKeys.has(event.key)) return;
  event.preventDefault();
  const nextIndex = getNextConstellationIndex(index, event.key, items.length);
  setSelectedIndex(nextIndex);
  nodeRefs.current[nextIndex]?.focus();
}}
```

- [ ] **Step 2: Apply contrast-safe visual hierarchy**

Use a bounded `min-h-[260px] sm:min-h-[300px]` map surface with a dark primary/secondary gradient, light connection strokes, and three clearly differentiated node treatments. Keep all labels in surrounding foreground text. Remove the existing `animate-float` class from selected controls and add `motion-reduce:transition-none motion-reduce:animate-none` to any remaining visual transition.

- [ ] **Step 3: Render the persistent detail card**

Place a labelled `section aria-live="polite"` directly after the map. It shows the selected item’s full title, status label, description (route task description or fallback description), and time/source detail when available. Its sole button reads `Открыть задачу` for route tasks and `Открыть материалы` for fallback. The route-task button calls `onOpenTask(selectedItem.task.id)`; the fallback button remains an accessible local informational action only if there is existing material navigation available—otherwise render it as a non-button status line to avoid a dead control.

```tsx
{selectedItem.task ? (
  <button type="button" onClick={() => onOpenTask?.(selectedItem.task!.id)}>
    Открыть задачу
  </button>
) : (
  <p>Материалы появятся после персонального маршрута.</p>
)}
```

- [ ] **Step 4: Run the focused tests and type/build check**

Run: `npm run test:personal-space && npm run build`

Expected: tests pass and Next.js completes production compilation. If Google font loading needs access, rerun the build with approved network access.

- [ ] **Step 5: Commit the map UI**

```bash
git add src/modules/personal-space/ui/KnowledgeConstellation.tsx
git commit -m "Improve interactive knowledge constellation"
```

## Task 3: Wire the real route action and perform browser verification

**Files:**
- Modify: `src/modules/personal-space/ui/PersonalSpaceWorkspace.tsx:90-125`
- Modify: `src/modules/personal-space/ui/JourneyMap.tsx:164-184`
- Modify: `docs/current-state.md:42-43,166-172`

**Interfaces:**
- Consumes: `KnowledgeConstellation` optional `onOpenTask` prop and existing workspace tab state.
- Produces: clicking a route topic’s action opens the existing `Route` tab and moves focus to the matching task element, without changing task status.

- [ ] **Step 1: Add a focus target to route tasks**

In `JourneyMap.tsx`, give each rendered route task article a stable `id={`route-task-${task.id}`}` and `tabIndex={-1}` so it can receive programmatic focus without entering normal tab order.

- [ ] **Step 2: Wire the constellation action to the route tab**

Create a local `handleOpenTask(taskId: string)` that sets the active workspace tab to `route`, then queues `document.getElementById(`route-task-${taskId}`)?.focus()` with `requestAnimationFrame`. Pass it as `onOpenTask` only to `KnowledgeConstellation`; do not mutate a learning task’s status.

```tsx
const handleOpenTask = (taskId: string) => {
  setActiveTab("route");
  requestAnimationFrame(() => document.getElementById(`route-task-${taskId}`)?.focus());
};
```

- [ ] **Step 3: Browser-check the generated route at 375px and 1280px**

Run the local server and complete or restore a barista route. At both widths: select at least two constellation nodes, confirm full title/status/description changes, use ArrowRight/ArrowLeft/Home/End and Enter/Space, confirm focus ring and no horizontal overflow, then click `Открыть задачу` and confirm the Route tab opens with the matching task focused. Check the browser console has no errors.

- [ ] **Step 4: Record the new user-visible behaviour**

Add one concise `docs/current-state.md` sentence in the employee flow: the knowledge map uses selectable high-contrast nodes and opens selected-topic details/route task. Add the completed test/build/browser smoke note under Latest completed verification.

- [ ] **Step 5: Run final verification**

Run: `npm run test:personal-space && npm run build`

Expected: all personal-space tests pass and build exits with code 0.

- [ ] **Step 6: Commit integration and documentation**

```bash
git add src/modules/personal-space/ui/PersonalSpaceWorkspace.tsx src/modules/personal-space/ui/JourneyMap.tsx docs/current-state.md
git commit -m "Link constellation topics to learning route"
```

## Final review checklist

- [ ] Full titles never appear inside constellation nodes.
- [ ] Route and fallback maps both display connected nodes and a selected detail card.
- [ ] Status is conveyed by text plus visual treatment, not colour alone.
- [ ] The only route action navigates to an existing route task; no visible dead control remains.
- [ ] Mobile and desktop show readable controls with no horizontal overflow.
