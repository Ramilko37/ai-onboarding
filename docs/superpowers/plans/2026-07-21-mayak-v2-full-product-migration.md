# Mayak v2 Full Product Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the diagnostic, employee workspace and manager dashboard as Mayak v2 without changing onboarding behavior or persisted data.

**Architecture:** Retune the global semantic theme and existing `Mayak*` primitives first. Screen modules then consume the same primitives and token classes, leaving domain models, hooks and routes unchanged.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS v4, lucide-react.

## Global Constraints

- Keep existing routes, diagnostic questions, learning-route generation, mentor API and localStorage contracts unchanged.
- Use Georgia for editorial headings, paper/ink/oxblood semantic tokens and Mayak v2 radii (10px controls, 14px cards, 20px sheets).
- Use mobile-first layouts with at least 44px interactive targets and no horizontal scrolling between 360px and 1920px.
- Do not add fake HR metrics or change human-review guardrails.

---

### Task 1: Establish Mayak v2 global theme and primitives

**Files:**
- Modify: `app/globals.css`
- Modify: `src/shared/ui/mayak/index.tsx`
- Modify: `src/shared/ui/mayak/styleguide.ts`

**Interfaces:**
- Consumes: existing `MayakShell`, `MayakPanel`, `MayakButton`, `MayakTopBar` consumers.
- Produces: unchanged component public APIs with v2 visual output.

- [ ] **Step 1: Establish the source-token contract**

Replace the root palette with the values from the approved specification. Retain Tailwind aliases but make `primary` oxblood, `foreground` ink, `card` surface and `secondary` paper.

```css
:root {
  --background: oklch(0.96036 0.00964 72.66146);
  --card: oklch(0.99447 0.00569 84.56580);
  --foreground: oklch(0.25432 0.01655 37.33932);
  --primary: oklch(0.44935 0.13445 22.18496);
  --radius: 0.875rem;
}
```

- [ ] **Step 2: Retune primitives without changing their props**

Remove aurora decoration from `MayakAmbientBackground`; change shell and top-bar dimensions to 64px compact / 76px desktop, and replace `rounded-3xl` cards and controls with the v2 radius scale. Keep focus and disabled classes.

- [ ] **Step 3: Verify primitive consumers compile**

Run: `npx tsc --noEmit --ignoreDeprecations 6.0`

Expected: exit code 0.

### Task 2: Migrate diagnostic visual composition

**Files:**
- Modify: `src/modules/onboarding-agent/ui/OnboardingAgentPage.tsx`
- Modify: `src/modules/onboarding-agent/ui/steps/WelcomeStep.tsx`
- Modify: `src/modules/onboarding-agent/ui/steps/DiagnosticStep.tsx`

**Interfaces:**
- Consumes: existing onboarding hook callbacks and Mayak primitives.
- Produces: unchanged diagnostic answer, navigation and completion behavior.

- [ ] **Step 1: Preserve behavior with an existing regression check**

Run: `npm run test:diagnostic`

Expected: all diagnostic scoring and flow tests pass before visual changes.

- [ ] **Step 2: Apply v2 geometry and hierarchy**

Use the 880px question column and v2 14px answer cards; make the primary next button oxblood with 10px radius; retain the explicit selected radio state and existing confirmation before exit.

- [ ] **Step 3: Verify diagnostics remain stable**

Run: `npm run test:diagnostic`

Expected: all tests pass.

### Task 3: Migrate employee workspace surfaces

**Files:**
- Modify: `src/modules/personal-space/ui/PersonalSpaceWorkspace.tsx`
- Modify: `src/modules/personal-space/ui/TodayFocus.tsx`
- Modify: `src/modules/personal-space/ui/JourneyMap.tsx`
- Modify: `src/modules/personal-space/ui/Assistant.tsx`
- Modify: `src/modules/personal-space/ui/TopBar.tsx`

**Interfaces:**
- Consumes: existing route, task status and mentor escalation props.
- Produces: unchanged tab, task-opening and status-update actions.

- [ ] **Step 1: Keep behavioral regression coverage green**

Run: `npm run test:personal-space && npm run test:learning-route && npm run test:knowledge-base`

Expected: all tests pass before styling work.

- [ ] **Step 2: Bring workspace regions to v2 density**

Make Today show one featured task and at most two supporting rows; retain the desktop mentor aside only from `lg`; use a 760px detail column; convert route and mentor surfaces to paper/ink panels with oxblood only for active state and action.

- [ ] **Step 3: Verify behavior after migration**

Run: `npm run test:personal-space && npm run test:learning-route && npm run test:knowledge-base`

Expected: all tests pass.

### Task 4: Migrate the manager workspace

**Files:**
- Modify: `src/modules/manager-dashboard/ui/ManagerDashboardPage.tsx`

**Interfaces:**
- Consumes: `ManagerDashboardRecord` data and existing refresh/selection actions.
- Produces: unchanged manager selection, local record refresh and support messaging.

- [ ] **Step 1: Verify existing manager projection**

Run: `npm run test:manager-dashboard`

Expected: all manager dashboard tests pass.

- [ ] **Step 2: Apply a v2 operational layout**

Keep real status summaries, make team list the main column and selected employee a sticky 360px context column from 1024px. Use sequential cards on smaller viewports and v2 status pills.

- [ ] **Step 3: Re-run manager verification**

Run: `npm run test:manager-dashboard`

Expected: all tests pass.

### Task 5: Validate the integration and document state

**Files:**
- Modify: `docs/current-state.md`

**Interfaces:**
- Consumes: the completed visual migration.
- Produces: accurate current-state verification notes.

- [ ] **Step 1: Run full automated verification**

Run: `npm run test:diagnostic && npm run test:learning-route && npm run test:knowledge-base && npm run test:manager-dashboard && npm run test:personal-space && npm run build`

Expected: exit code 0 for every command.

- [ ] **Step 2: Inspect responsive layouts**

Check `/`, `/onboarding-agent` and `/manager` at 390px, 1024px and 1440px. Confirm visible keyboard focus, 44px controls and zero horizontal scrolling.

- [ ] **Step 3: Update the state snapshot**

Record the Mayak v2 migration, current visual checks and commands in `docs/current-state.md`.

- [ ] **Step 4: Commit implementation**

Run: `git add app/globals.css src/shared/ui/mayak src/modules/onboarding-agent src/modules/personal-space src/modules/manager-dashboard docs/current-state.md docs/superpowers/plans/2026-07-21-mayak-v2-full-product-migration.md && git commit -m "feat: migrate product to Mayak v2"`

Expected: a single scoped migration commit.

## Plan self-review

- Spec coverage: Tasks 1–4 map to global tokens, diagnostic, employee and manager requirements; Task 5 maps to verification and state documentation.
- Placeholder scan: no incomplete tasks or deferred requirements remain.
- Type consistency: no domain type or component API is changed; all modified surfaces consume their current props.
