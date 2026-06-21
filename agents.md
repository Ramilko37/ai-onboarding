# Agents Guide

This file defines the working rules for AI agents and developers in this repository.

## Project Context

The product is a prototype of an AI onboarding agent for a HORECA franchise network. The first iteration focuses on two roles:

- Cook.
- Cafe / shift administrator.

The core workflow:

1. A new employee selects role and grade.
2. The agent runs a soft first-day knowledge diagnostic.
3. The system identifies skill gaps.
4. The agent builds a personal learning route for day 1, day 7, and day 14.
5. Managers see progress, risks, and recommendations.

Keep the prototype focused on the roadmap in `docs/roadmap.md`.

## Start Of Work

Every agent must begin work by checking the current project state before making assumptions or edits.

Minimum startup check:

1. Read `docs/current-state.md`.
2. Check the worktree with `git status --short`.
3. Inspect the files directly related to the user's request.
4. If code behavior may be affected, run the smallest relevant verification command before and after the change.

Use the current-state document as a snapshot, not as a substitute for reading code. If the code and `docs/current-state.md` disagree, trust the code, mention the mismatch, and update the document when the task changes the project state.

## Architecture Approach

Use Feature-Sliced Design (FSD) adapted for Next.js App Router.

Recommended structure when the app grows:

```text
app/
  layout.tsx
  page.tsx
src/
  app/
    providers/
    styles/
  pages/
  widgets/
  features/
  entities/
  shared/
```

Layer responsibilities:

- `app/`: Next.js routes, layouts, route-level metadata, server entry points.
- `src/app/`: app composition, providers, global styles, runtime configuration.
- `src/pages/`: page-level compositions if a route becomes too large for `app/` files.
- `src/widgets/`: large UI blocks that combine features and entities, such as manager dashboard, onboarding workspace, or knowledge base panel.
- `src/features/`: user actions and business flows, such as role selection, diagnostic test, skill gap analysis, route generation, mentor chat, progress review.
- `src/entities/`: domain models and UI for stable business nouns, such as employee, role, grade, competency, knowledge topic, learning task, location, manager.
- `src/shared/`: reusable infrastructure, UI primitives, API clients, helpers, constants, design tokens.

Dependency rule:

```text
app -> pages -> widgets -> features -> entities -> shared
```

Lower layers must not import from higher layers. For example, `entities` may import from `shared`, but must not import from `features`, `widgets`, `pages`, or `app`.

## FSD Slice Guidelines

Each slice should expose a small public API through `index.ts`.

Preferred slice shape:

```text
src/features/diagnostic-test/
  index.ts
  model/
  ui/
  lib/
  api/
```

Use only the folders that are needed:

- `ui/`: React components.
- `model/`: types, state, schemas, selectors, business rules.
- `api/`: feature-specific server calls or adapters.
- `lib/`: pure helpers that are not useful outside the slice.

Do not import internal files across slices. Import from the slice public API instead.

## Next.js Guidelines

- Prefer Server Components by default.
- Add `"use client"` only when a component needs browser state, effects, event handlers, refs, or client-only APIs.
- Keep route files thin. Move real UI and business logic into FSD slices.
- Keep server-only code out of client components.
- Validate external input at boundaries before it reaches domain logic.
- Use TypeScript types for domain models and Zod or similar schemas for untrusted data.
- Avoid global mutable state. Prefer local state, URL state, server state, or explicit stores when needed.

## UI Guidelines

- Build the actual prototype experience, not a marketing landing page.
- Prioritize operational clarity: role selection, diagnostic flow, learning route, mentor chat, manager dashboard, and analytics.
- Use dense but readable interfaces for dashboards and admin views.
- Keep copy specific to HORECA onboarding. Avoid generic SaaS filler.
- Use accessible semantic HTML, keyboard-friendly controls, and visible focus states.
- Keep text, controls, and layouts responsive across desktop and mobile.
- Do not introduce large visual frameworks or component libraries without a clear reason.

## Domain Guidelines

Use consistent domain language:

- `role`: employee role, initially `cook` or `administrator`.
- `grade`: onboarding starting level, such as no experience, HORECA experience, or network experience.
- `competency`: what an employee must know or do.
- `knowledgeTopic`: source-backed learning topic.
- `diagnostic`: first-day knowledge check.
- `skillGap`: difference between expected and actual knowledge.
- `learningRoute`: personalized plan for day 1, day 7, and day 14.
- `mentor`: AI assistant that explains tasks and answers questions.

Never hard-code business rules deep inside UI components. Put role maps, competency maps, scoring, and route generation rules into `model/` or `lib/` within the relevant slice.

## AI Guardrails

- The agent must not present generated recommendations as final HR decisions.
- The agent must explain that diagnostics are onboarding support, not punishment.
- The agent must preserve mandatory safety and compliance topics even when an employee scores highly.
- The agent must cite or link the knowledge base source when giving operational instructions.
- The agent must avoid medical, legal, payroll, disciplinary, or employment-status decisions.
- The agent must ask a manager to review high-risk cases, repeated failures, safety issues, or employee distress signals.
- The agent must not invent local franchise rules that are not in the knowledge base.
- The agent must keep tone calm, supportive, and practical for first-day employees.

## Data And Privacy Guardrails

- Store only data needed for the prototype.
- Avoid collecting sensitive personal data unless the roadmap explicitly requires it.
- Treat employee progress, test answers, and risk flags as confidential.
- Keep demo data clearly separated from future production data.
- Do not log private employee answers, free-text concerns, or manager notes in plain debug logs.

## Quality Guidelines

- Keep changes small and aligned with the roadmap.
- Prefer clear types, pure functions, and explicit data contracts.
- Add tests around scoring, skill gap analysis, route generation, and mandatory-topic behavior.
- Run `npm run build` before handing off code changes.
- If adding lint or test scripts, keep them fast enough for regular local use.
- Do not leave placeholder UI, fake TODO flows, or dead controls in visible prototype paths.

## Implementation Guardrails

- Do not add integrations with HRM, LMS, POS, camera systems, or predictive attrition analytics in the first iteration unless explicitly requested.
- Do not broaden the MVP beyond cook and administrator roles without updating the roadmap.
- Do not turn the app into a generic learning platform. Keep it anchored in franchise onboarding.
- Do not bypass FSD dependency direction for convenience.
- Do not create cross-slice shared helpers until at least two slices truly need them.
- Do not move everything into `shared`; domain meaning belongs in `entities` and `features`.

## Documentation Rules

- Keep roadmap and planning documents in `docs/`.
- Update `docs/roadmap.md` only when product scope changes.
- Update `docs/current-state.md` when implementation status, routes, verification commands, or next-stage assumptions change.
- Add implementation notes when architectural decisions affect future work.
- Prefer short, concrete examples over abstract rules.
