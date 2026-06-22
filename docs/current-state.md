# Current Project State

Last updated: 2026-06-22

## Product Scope

The project is now a demo-first Next.js MVP of an AI onboarding layer. It follows the uploaded MVP brief: a newcomer sees a personal onboarding route, asks an AI assistant questions, receives source-grounded answers from a curated knowledge base, updates task statuses, and HR/manager sees progress, blockers and escalations.

The current MVP intentionally uses mock data and local deterministic retrieval. It does not use a backend, real LLM, real RAG infrastructure, HRIS, LMS, SSO, calendar, service desk, or messaging APIs.

## Implemented Demo Flow

The main prototype is available on the root route:

```text
/
```

The legacy route is still available and renders the same MVP workspace:

```text
/onboarding-agent
```

Current demo flow:

1. HR or presenter selects one of three demo newcomers.
2. The newcomer panel shows a personalized route by phase: Day 0, Day 1, Week 1, Month 1.
3. Each route task has owner, due label, mock integration, source articles and status buttons.
4. Supported statuses are `todo`, `in_progress`, `done`, and `blocked`.
5. Marking a task as `blocked` creates a demo escalation.
6. The AI assistant answers questions from the curated knowledge base and shows sources.
7. Unknown or sensitive questions trigger safe fallback and create a HR escalation.
8. The HR/manager dashboard shows aggregate completion, blocked tasks, open escalations, newcomers, search intents and mocked integrations.

## Seed Data

The MVP includes three role/persona tracks:

- `Support Specialist` — CRM, SLA, tone of voice, escalation and customer support onboarding.
- `Sales Manager` — pipeline, discovery, demo shadowing, CRM hygiene and handoff.
- `Developer` — environment setup, Git flow, code review, CI/CD, release and incident basics.

The local curated knowledge base contains 20 articles/FAQ entries. Each assistant answer can return up to two sources. The source-grounding is demo-level retrieval over article titles, tags, body and role scope.

## Implemented MVP Capabilities

Implemented from the MVP brief:

- web prototype with three main zones: newcomer route, AI assistant, HR/manager dashboard;
- seed data for 3 roles and 3 newcomers;
- local knowledge base with 20 source-backed articles;
- onboarding route phases: Day 0, Day 1, Week 1, Month 1;
- task statuses: `todo`, `in_progress`, `done`, `blocked`;
- assistant answers only from allowed local sources;
- visible sources for confident answers;
- fallback for unknown or sensitive questions;
- demo escalations to HR, IT, manager or mentor;
- dashboard with progress, blockers, open escalations, newcomers, frequent questions and mock integrations;
- mocked HRIS, LMS, SSO, Service Desk, Calendar and Messaging cards.

## Important Files

```text
app/page.tsx
app/onboarding-agent/page.tsx
app/layout.tsx
src/modules/onboarding-agent/
  index.ts
  model/mvpDemoData.ts
  lib/answerOnboardingQuestion.ts
  ui/OnboardingAgentPage.tsx
  ui/MvpOnboardingPage.tsx
  ui/MvpOnboardingPage.module.css
```

Legacy diagnostic and learning-route files still remain in the repository for reference, but the visible route now uses the demo-first MVP workspace.

## Verification

Expected verification commands after pulling the branch locally:

```bash
npm run build
```

The previous diagnostic tests may still be useful for legacy logic, but the MVP workspace itself currently has no dedicated automated test. The assistant retrieval is deterministic and can be manually smoke-tested with these demo questions:

```text
Что мне сделать в первый день?
Как получить доступ к CRM?
Что делать, если SSO не работает?
Когда нужна эскалация к человеку?
Как проходит review через месяц?
```

Expected fallback smoke test:

```text
Какая у меня зарплата?
```

Expected result: the assistant does not answer directly and creates a HR escalation.

## Explicitly Not Implemented Yet

The current prototype still does not include:

- hosted LLM or production RAG;
- real ticket creation;
- real HRIS/LMS/SSO/calendar/service desk/messaging integrations;
- authentication and RBAC;
- persistent storage;
- production security controls;
- automated tests for the MVP workspace;
- screenshots/video backup demo.

## Next Product Stage

Recommended next stage:

- add a small automated test around `answerOnboardingQuestion` fallback/source behavior;
- add persistent mock state or localStorage for demo continuity;
- add a scripted presenter mode for the 5–7 minute demo;
- prepare backup screenshots/video for the 25 June demo;
- connect the assistant to a real RAG pipeline only after the demo flow is validated.
