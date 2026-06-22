# Agents Guide

This file defines the working rules for AI agents and developers in this repository.

## Project Context

The product is a demo-first MVP of an AI onboarding layer. It should closely follow the MVP brief in `mvp.md` from the task context and the implementation snapshot in `docs/current-state.md`.

The main demo flow is:

1. A newcomer gets a personal onboarding route by role.
2. The route is split into Day 0, Day 1, Week 1 and Month 1.
3. The newcomer asks an AI assistant questions.
4. The assistant answers only from a curated knowledge base and shows sources.
5. Unknown or sensitive questions are escalated to a human.
6. The newcomer updates task statuses: `todo`, `in_progress`, `done`, `blocked`.
7. HR/manager sees progress, blockers, frequent questions and open escalations.
8. External systems are mocked: HRIS, LMS, SSO, service desk, calendar and messaging.

The current demo roles are:

- Support Specialist.
- Sales Manager.
- Developer.

The prototype should demonstrate operational onboarding value, not become a generic marketing landing page.

## Start Of Work

Every agent must begin work by checking the current project state before making assumptions or edits.

Minimum startup check:

1. Read `docs/current-state.md`.
2. Inspect the files directly related to the user's request.
3. If using a local checkout, check the worktree with `git status --short`.
4. If code behavior may be affected, run the smallest relevant verification command before and after the change when the environment allows it.

Use the current-state document as a snapshot, not as a substitute for reading code. If the code and `docs/current-state.md` disagree, trust the code, mention the mismatch, and update the document when the task changes the project state.

## Architecture Approach

Use Feature-Sliced Design ideas adapted for this small Next.js prototype. Keep route files thin and put demo UI, data and deterministic business rules inside `src/modules/onboarding-agent/` until the product grows.

Current practical structure:

```text
app/
  layout.tsx
  page.tsx
  onboarding-agent/page.tsx
src/modules/onboarding-agent/
  model/
  lib/
  ui/
```

Layer responsibilities:

- `app/`: Next.js routes, layouts, route-level metadata and server entry points.
- `model/`: demo data, domain types, task statuses, knowledge base records and role definitions.
- `lib/`: deterministic business logic, retrieval, scoring, fallback and source-grounding helpers.
- `ui/`: React components and CSS modules for the prototype experience.

Keep business rules out of deeply nested JSX when they are reusable or testable.

## Next.js Guidelines

- Prefer Server Components by default.
- Add `"use client"` only when a component needs browser state, effects, event handlers, refs or client-only APIs.
- Keep route files thin.
- Keep server-only code out of client components.
- Validate external input at boundaries before it reaches domain logic.
- Use TypeScript types for domain models and explicit data contracts.
- Avoid global mutable state. For this demo, local component state is acceptable.

## UI Guidelines

- Build the actual prototype experience, not a marketing landing page.
- Keep the three MVP zones visible and usable: newcomer route, AI assistant, HR/manager dashboard.
- Prioritize operational clarity: role/persona selection, route tasks, statuses, source-backed answers, fallback and escalations.
- Use dense but readable interfaces for dashboards and admin views.
- Keep copy specific to onboarding and the demo roles.
- Use accessible semantic HTML, keyboard-friendly controls and visible focus states.
- Keep text, controls and layouts responsive across desktop and mobile.
- Do not introduce large visual frameworks or component libraries without a clear reason.

## Domain Guidelines

Use consistent domain language:

- `role`: employee role, currently `support_specialist`, `sales_manager` or `developer`.
- `newcomer`: employee going through onboarding.
- `phase`: onboarding period, currently `day_0`, `day_1`, `week_1`, `month_1`.
- `task`: onboarding checklist item.
- `taskStatus`: `todo`, `in_progress`, `done`, `blocked`.
- `knowledgeArticle`: source-backed FAQ/policy/playbook article.
- `assistant`: AI-like helper that answers from allowed sources.
- `escalation`: handoff to HR, IT, manager or mentor when the agent is unsure or a task is blocked.
- `dashboard`: HR/manager view of progress, blockers, questions and escalations.
- `mockIntegration`: demo substitute for HRIS, LMS, SSO, service desk, calendar or messaging.

Do not hard-code new business rules in UI components if they belong in `model/` or `lib/`.

## AI Guardrails

- The agent must not present generated recommendations as final HR decisions.
- The agent must answer operational questions only from allowed knowledge-base sources.
- Every confident answer must show at least one source.
- The agent must fall back and escalate when it cannot find a source.
- Sensitive questions about payroll, legal issues, employment status, discipline, medical matters, harassment or personal data must be escalated to a human.
- The agent must avoid inventing company rules that are not in the knowledge base.
- The agent must keep tone calm, supportive and practical for first-day employees.

## Data And Privacy Guardrails

- Store only data needed for the prototype.
- Keep all current users, roles, tasks and integrations as demo data.
- Avoid collecting sensitive personal data unless a future roadmap explicitly requires it.
- Treat employee progress, blocked tasks, assistant questions and escalation notes as confidential.
- Do not log private employee answers, free-text concerns or manager notes in plain debug logs.

## Quality Guidelines

- Keep changes aligned with the demo-first MVP.
- Prefer clear types, pure functions and explicit data contracts.
- Add tests around source selection, fallback behavior and escalation rules when touching assistant logic.
- Run `npm run build` before handing off code changes when a local environment is available.
- Do not leave dead controls in visible prototype paths.

## Implementation Guardrails

- Do not add real HRIS, LMS, SSO, service desk, calendar or messaging integrations in this demo unless explicitly requested.
- Do not add production authentication, payroll, disciplinary or employment-status decisions to the MVP.
- Do not let the assistant answer without sources for operational instructions.
- Do not replace human review for consequential HR decisions.
- Do not turn the app into a generic learning platform; keep it anchored in the end-to-end onboarding demo.

## Documentation Rules

- Keep roadmap and planning documents in `docs/`.
- Update `docs/current-state.md` when implementation status, routes, verification commands or next-stage assumptions change.
- Add implementation notes when architectural decisions affect future work.
- Prefer short, concrete examples over abstract rules.
