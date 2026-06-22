# Current Project State

Last updated: 2026-06-22

## Product Scope

The project is a demo-first Next.js MVP of an AI onboarding layer. The visible product is now employee-first: a newcomer sees only their own onboarding route, assistant, learning materials and support contacts. HR/manager analytics are still present, but they are separated into a service mode and are not part of the employee screen.

This follows the MVP principle that the main value for employees is a guided personal track, not a performance dashboard. The employee portal must not expose other employees, competency scores, test levels, weak/strong labels, or “good/bad” performance judgement.

The current MVP intentionally uses mock data and local deterministic retrieval. It does not use a backend, real LLM, real RAG infrastructure, HRIS, LMS, SSO, calendar, service desk, or messaging APIs.

## Routes

The general demo route is available at:

```text
/
```

The legacy route is still available and renders the same MVP workspace:

```text
/onboarding-agent
```

Direct employee-only demo routes are available at:

```text
/employee/employee-anna
/employee/employee-timur
/employee/employee-lera
```

On these employee routes, the HR/manager mode switch is hidden. This better represents a real employee-facing path.

The service route for HR/manager demo mode is available at:

```text
/hr
```

## Implemented Demo Flow

Current employee-first flow:

1. The default mode is `Портал сотрудника`.
2. The employee sees a personal welcome screen with only their own start date, team, manager and mentor.
3. The employee sees the next onboarding step and simple actions: `Начать`, `Готово`, `Нужна помощь`.
4. The employee sees their personal learning track by phase: Day 0, Day 1, Week 1, Month 1.
5. Each track item shows practical task text, owner, due label and related learning materials.
6. The employee sees progress only as onboarding navigation: completed steps, steps in work and help requests. It is explicitly not shown as a knowledge score or performance judgement.
7. The employee asks the AI assistant questions and receives source-grounded answers from the curated knowledge base.
8. Unknown or sensitive questions trigger safe fallback and create a HR escalation.
9. Clicking `Нужна помощь` on a task creates a demo escalation to HR, IT, manager or mentor.
10. `HR / руководитель` is a separate service mode for demo transparency, not the employee experience.

## HR / Manager Service Mode

The HR/manager mode shows:

- aggregate completion across demo newcomers;
- tasks requiring help;
- open escalations;
- list of newcomers for the service user;
- frequent questions / search intents;
- mocked integrations: HRIS, LMS, SSO, Service Desk, Calendar and Messaging.

This mode is intentionally separated from the employee portal so that employees do not see other employees' data or manager-facing analytics.

## Seed Data

The MVP includes three role/persona tracks:

- `Support Specialist` — CRM, SLA, tone of voice, escalation and customer support onboarding.
- `Sales Manager` — pipeline, discovery, demo shadowing, CRM hygiene and handoff.
- `Developer` — environment setup, Git flow, code review, CI/CD, release and incident basics.

The local curated knowledge base contains 20 articles/FAQ entries. Each assistant answer can return up to two sources. The source-grounding is demo-level retrieval over article titles, tags, body and role scope.

## Implemented MVP Capabilities

Implemented from the MVP brief and latest product feedback:

- employee-first portal as the default experience;
- direct employee-only routes via `/employee/[employeeId]`;
- separate HR/manager service route via `/hr`;
- personal onboarding route with Day 0, Day 1, Week 1 and Month 1 phases;
- task statuses mapped to employee-friendly actions: `Начать`, `Готово`, `Нужна помощь`;
- personal assistant panel with source-grounded answers;
- personal materials list derived from the employee route;
- support contacts: mentor, manager and HR/help route;
- safe fallback for unknown or sensitive questions;
- demo escalations to HR, IT, manager or mentor;
- separate HR/manager service mode with progress, blockers, open escalations, newcomers, frequent questions and mock integrations;
- seed data for 3 roles and 3 newcomers;
- local knowledge base with 20 source-backed articles;
- mocked HRIS, LMS, SSO, Service Desk, Calendar and Messaging cards.

## Important Files

```text
app/page.tsx
app/onboarding-agent/page.tsx
app/employee/[employeeId]/page.tsx
app/hr/page.tsx
app/layout.tsx
src/modules/onboarding-agent/
  index.ts
  model/mvpDemoData.ts
  model/mvpAssistant.test.ts
  lib/answerOnboardingQuestion.ts
  ui/OnboardingAgentPage.tsx
  ui/MvpOnboardingPage.tsx
  ui/MvpOnboardingPage.module.css
```

Legacy diagnostic and learning-route files still remain in the repository for reference, but the visible route now uses the employee-first MVP workspace.

## Verification

Expected verification commands after pulling the branch locally:

```bash
npm run test:mvp-assistant
npm run build
```

The MVP assistant smoke test covers:

- source-grounded first-day answer;
- source-grounded CRM answer;
- sensitive payroll-like question fallback;
- unknown question fallback.

Manual employee-flow smoke test:

```text
1. Open /employee/employee-anna
2. Confirm there is no HR/manager mode switch on this route.
3. Confirm the employee sees only their own route, assistant, materials and support contacts.
4. Confirm no other employee list appears in employee mode.
5. Click Начать / Готово / Нужна помощь on a task.
6. Ask: Что мне сделать в первый день?
7. Ask: Как получить доступ к CRM?
8. Ask: Какая у меня зарплата?
9. Open /hr and confirm the service dashboard reflects help requests and escalations.
```

## Explicitly Not Implemented Yet

The current prototype still does not include:

- hosted LLM or production RAG;
- real ticket creation;
- real HRIS/LMS/SSO/calendar/service desk/messaging integrations;
- authentication and RBAC;
- persistent storage;
- production security controls;
- auth-backed employee sessions beyond the demo employee URL;
- screenshots/video backup demo.

## Next Product Stage

Recommended next stage:

- add auth-backed personal employee home instead of demo employee IDs in the URL;
- persist demo state in localStorage for presenter continuity;
- add scripted presenter mode for the 5–7 minute demo;
- prepare backup screenshots/video for the 25 June demo;
- add privacy copy explaining that employee progress is onboarding navigation, not a score;
- connect the assistant to a real RAG pipeline only after the employee-first demo flow is validated.
