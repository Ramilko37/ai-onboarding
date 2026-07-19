# Mayak Product Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the Mayak v1.0 design system consistently to every employee and manager product surface without changing onboarding behaviour or domain data.

**Architecture:** Make `app/globals.css` and `src/shared/ui/mayak/index.tsx` the single visual and behavioural foundation. Migrate visual consumers by workflow boundary: onboarding, personal space and manager dashboard. Shared primitives carry semantic colour, control sizing, focus and status behaviour so feature components stay domain-specific.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS v4, Lucide, Node test runner.

## Global Constraints

- Use only the Mayak colour tokens defined in `app/globals.css`; no raw colours or named palette colour utilities in product components.
- Keep one primary action per employee working screen; use secondary or ghost actions for support and navigation.
- Preserve diagnostic scoring, learning-route generation, local persistence and API contracts.
- Use Tenor Sans only for screen-level display/H1 moments, Geist for operational copy and Geist Mono for compact metadata.
- Controls and selectable options have a minimum 44px target, visible focus, and semantic state text or icon alongside colour.
- Mobile-first composition uses Tailwind `sm`, `md`, `lg`, `xl` breakpoints only.
- Respect reduced motion and do not add dependencies.
- Verify employee and manager flows at 390px, 768px, 1024px and 1440px, then run all project test commands and build.

---

## File structure

- Modify `app/globals.css`: set the canonical Mayak tokens, surface shadows and reduced-motion defaults.
- Modify `src/shared/ui/mayak/index.tsx`: make primitives match the token, control-height and status requirements; add `MayakTaskRow` and `MayakLevelPill` semantic implementation.
- Modify `src/shared/ui/mayak/styleguide.ts`: replace stale teal documentation with current oxblood/paper/sand language.
- Modify `src/modules/onboarding-agent/ui/components.tsx` and `ui/steps/*.tsx`: consume the shared primitives, standardise action bars, field controls and option cards.
- Modify `src/modules/personal-space/**/*.tsx`: replace local repeated panels/actions/status controls and raw constellation colours with Mayak semantic treatments.
- Modify `src/modules/manager-dashboard/ui/ManagerDashboardPage.tsx`: use the shared shell, action bar, metric/task/status primitives and compact responsive list detail patterns.
- Modify `docs/current-state.md`: record the full Mayak migration and final verification matrix.

## Task 1: Establish canonical tokens and reusable primitives

**Files:**
- Modify: `app/globals.css`
- Modify: `src/shared/ui/mayak/index.tsx`
- Modify: `src/shared/ui/mayak/styleguide.ts`

**Interfaces:**
- Produces `MayakTaskRow`, `MayakLevelPill`, `MayakActionBar`, `MayakButton`, `MayakOptionCard`, `MayakProgressBar` and `MayakPanel` with the same semantic tone props used by feature modules.

- [ ] **Step 1: Replace token values in `app/globals.css` with the Mayak specification**

Set `--background`, `--foreground`, `--card`, `--primary`, `--secondary`, `--accent`, `--muted`, semantic status colours, border, ring and shadows to the exact token roles in `mayak-design-system-spec.md`. Keep `--deep-*` as derived aliases of primary for existing consumers. Add a global reduced-motion media query that disables animations and transition duration.

- [ ] **Step 2: Standardise shared control and panel classes**

Change the shared input and button base classes from `min-h-10` to `min-h-11`; use `rounded-xl` for controls and `rounded-2xl`/`rounded-[1.75rem]` only for option/panel/shell roles. Make panel surfaces use one card shadow, one soft variant and a deep primary variant. Keep focus outline shared through `focus-visible` classes.

- [ ] **Step 3: Remove raw status colour values from shared code**

Change `MayakLevelPill.confident` to `bg-[color-mix(in_oklch,var(--success)_14%,transparent)] text-success`, and use the same semantic token pattern for its dot. Replace all styleguide teal/deep-teal descriptions with the Mayak oxblood, paper and sand roles.

- [ ] **Step 4: Add shared task/status affordances**

Export a `MayakTaskRow` with `title`, `description`, `meta`, `status`, `action` and `className` props. Render a semantic status label using `MayakLevelPill` and keep the row responsive with a vertical mobile layout and `sm:grid-cols-[minmax(0,1fr)_auto]`. Do not give it product-specific copy or route mutations.

- [ ] **Step 5: Build and commit the foundation**

Run: `npm run build`

Expected: Next compilation and TypeScript pass with no colour or primitive type errors.

```bash
git add app/globals.css src/shared/ui/mayak/index.tsx src/shared/ui/mayak/styleguide.ts
git commit -m "Align shared Mayak primitives"
```

## Task 2: Apply Mayak to the employee onboarding flow

**Files:**
- Modify: `src/modules/onboarding-agent/ui/OnboardingAgentPage.tsx`
- Modify: `src/modules/onboarding-agent/ui/components.tsx`
- Modify: `src/modules/onboarding-agent/ui/steps/WelcomeStep.tsx`
- Modify: `src/modules/onboarding-agent/ui/steps/EmployeeProfileStep.tsx`
- Modify: `src/modules/onboarding-agent/ui/steps/CompetencyMapStep.tsx`
- Modify: `src/modules/onboarding-agent/ui/steps/DiagnosticIntroStep.tsx`
- Modify: `src/modules/onboarding-agent/ui/steps/DiagnosticStep.tsx`
- Modify: `src/modules/onboarding-agent/ui/steps/DiagnosticResultStep.tsx`
- Modify: `src/modules/onboarding-agent/ui/steps/LearningRouteStep.tsx`

**Interfaces:**
- Consumes shared buttons, panels, action bars, progress, option cards and status primitives from `@/shared/ui/mayak`.
- Produces unchanged step callbacks and state transitions.

- [ ] **Step 1: Normalise employee screen hierarchy**

Use `MayakSectionHeader` for the display title and short supporting copy in each step. Retain existing domain copy, but make the current practical action the only primary `MayakButton` per screen. Place back/reset links in a `MayakActionBar` as secondary or ghost buttons.

- [ ] **Step 2: Standardise profile and answer selection**

Use `MayakField`, `MayakInput` and `MayakOptionCard` for profile fields, grade choices and diagnostic answers. Ensure options use `aria-pressed`, selected border plus ring rather than a colour-only left border, and 44px-or-larger targets.

- [ ] **Step 3: Recompose desktop diagnostic without a persistent information sidebar**

At `lg`, keep the question and answer options as the dominant bounded content area. Move supplementary employee/context details into compact panels above or below it. On compact and comfortable widths maintain one sequential stream; do not add fixed widths or arbitrary breakpoints.

- [ ] **Step 4: Bring result and learning-route outputs to common status/task patterns**

Use `MayakInsightCard`, `MayakLevelPill`, `MayakProgressBar`, `MayakTaskRow` and `MayakActionBar` wherever the existing result and route render repeated explanation/status/task blocks. Keep sources and mentor routing visible and do not change route task IDs or status controls.

- [ ] **Step 5: Run focused regression commands and commit**

Run: `npm run test:diagnostic && npm run test:learning-route && npm run build`

Expected: diagnostic and route tests pass; build completes.

```bash
git add src/modules/onboarding-agent
git commit -m "Apply Mayak to employee onboarding"
```

## Task 3: Apply Mayak to the employee personal workspace

**Files:**
- Modify: `src/modules/personal-space/PersonalSpace.tsx`
- Modify: `src/modules/personal-space/ui/HeroGreeting.tsx`
- Modify: `src/modules/personal-space/ui/TodayFocus.tsx`
- Modify: `src/modules/personal-space/ui/JourneyMap.tsx`
- Modify: `src/modules/personal-space/ui/KnowledgeConstellation.tsx`
- Modify: `src/modules/personal-space/ui/Assistant.tsx`
- Modify: `src/modules/personal-space/ui/SupportPanel.tsx`
- Modify: `src/modules/personal-space/ui/PersonalSpaceWorkspace.tsx`
- Modify: `src/modules/personal-space/ui/TopBar.tsx`

**Interfaces:**
- Consumes existing route/task callbacks and shared Mayak primitives.
- Produces the existing desktop tab selection, selected constellation topic and route-task focus behaviours.

- [ ] **Step 1: Consolidate shell, action and task styling**

Replace repeated local button, panel, badge and task-row class strings with Mayak primitives where an equivalent exists. Preserve the existing tab IDs, focus movement and task status update callbacks.

- [ ] **Step 2: Convert constellation visual states to semantic Mayak tokens**

Replace emerald, amber, slate and raw gradient colours with `success`, `accent`, `secondary`, `primary`, `card` and `deep` token-based treatments. Keep the approved map-detail interaction; node status continues to have an icon/number and text in the detail card.

- [ ] **Step 3: Preserve focus desktop and quiet compact composition**

Keep the existing one-active-tab desktop workspace at `lg`, but use the Mayak focus width and panel rhythm. On mobile/tablet keep the stream readable without fixed sidebars; all task/status actions remain touch-sized.

- [ ] **Step 4: Run focused tests and commit**

Run: `npm run test:personal-space && npm run build`

Expected: workspace navigation, task status and constellation mapping tests pass; build completes.

```bash
git add src/modules/personal-space
git commit -m "Apply Mayak to employee workspace"
```

## Task 4: Apply Mayak to the manager dashboard

**Files:**
- Modify: `src/modules/manager-dashboard/ui/ManagerDashboardPage.tsx`

**Interfaces:**
- Consumes shared `MayakShell`, panels, action bar, badges, task rows and progress primitives.
- Produces the existing risk filtering, record selection, manager actions and local refresh behaviour.

- [ ] **Step 1: Recompose manager page into Mayak information order**

Use `MayakShell` with the shared top bar and bounded wide shell. Keep the page order as attention today, recurring topics, employee comparison and selected employee detail. Group header controls into one action bar with `Новое тестирование` as the sole primary action.

- [ ] **Step 2: Replace risk colour-only rows and local controls**

Map risk to semantic Mayak badge/pill treatment plus explanatory text; preserve labels that frame risk as support or review. Convert filters, refresh, dates and manager action controls to minimum-44px shared button/input patterns.

- [ ] **Step 3: Preserve dense desktop comparison and mobile cards**

Keep the current table-like comparison at `lg` for five-plus employees. Preserve the existing card list below `lg`, keep text at 14px or higher, and prevent selected-row emphasis from relying solely on colour.

- [ ] **Step 4: Run dashboard regression commands and commit**

Run: `npm run test:manager-dashboard && npm run build`

Expected: dashboard model tests and build pass.

```bash
git add src/modules/manager-dashboard/ui/ManagerDashboardPage.tsx
git commit -m "Apply Mayak to manager dashboard"
```

## Task 5: Update state documentation and verify the full product

**Files:**
- Modify: `docs/current-state.md`

- [ ] **Step 1: Update project state**

Add the Mayak migration to the implemented flow and record that desktop employee content uses a bounded focus workspace while manager UI uses dense comparison with shared primitives.

- [ ] **Step 2: Browser smoke at each design-system viewport**

At 390px, 768px, 1024px and 1440px verify `/onboarding-agent` through profile, answer selection, generated route and personal space; verify `/manager` filtering, selected employee detail and manager action feedback. Confirm one primary employee action per screen, visible focus, no horizontal overflow and no console errors.

- [ ] **Step 3: Run final verification**

Run: `npm run test:diagnostic && npm run test:learning-route && npm run test:knowledge-base && npm run test:manager-dashboard && npm run test:personal-space && npm run build`

Expected: every command exits with code 0.

- [ ] **Step 4: Commit documentation**

```bash
git add docs/current-state.md
git commit -m "Document Mayak product migration"
```
