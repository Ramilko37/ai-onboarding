# Current Project State

Last updated: 2026-06-22

## Product Scope

The project is a Next.js prototype of an AI onboarding agent for a HORECA franchise network. The current iteration remains focused on two roles:

- Cook.
- Cafe / shift administrator.

The prototype demonstrates personalization without backend, LLM, RAG, chat, or real integrations: a new employee selects a role and grade, passes a soft knowledge diagnostic, sees topic-level results, and receives an automatically generated personal learning route.

## Current UI Direction

The onboarding agent UI has been restyled into a lighter operational app shell:

- Light background, white work surfaces, subtle borders, and restrained teal status accents.
- Compact header with current employee/location context.
- Compact step progress that stays readable on desktop and becomes horizontally scrollable on mobile.
- Reduced visual weight: no glassmorphism, oversized purple/blue gradients, or nested decorative hero cards.
- Route, diagnostic, result, and profile screens use clearer typography, smaller radii, and calmer cards/tables.
- Step changes reset scroll to the top so the next screen does not open underneath the sticky header.

## Implemented Flow

The main prototype is available on the root route:

```text
/
```

The older route is still available:

```text
/onboarding-agent
```

Current user flow:

1. Welcome screen.
2. Employee profile form.
3. Role selection: cook or administrator.
4. Grade selection: no experience, HORECA experience, or network experience.
5. Employee summary card.
6. Competency map for day 1, day 7, and day 14.
7. Diagnostic explanation screen.
8. Diagnostic question flow.
9. Topic-level diagnostic result.
10. Automatically generated personal learning route for day 1, day 7, and day 14.
11. Task status updates and progress recalculation inside the route.

## Implemented Diagnostic Logic

Stage 2 is implemented with mock logic and no backend, AI, LLM, or RAG.

Current diagnostic behavior:

- Questions are selected by role.
- Questions are selected by grade difficulty.
- Selection is stable and predictable for demo use.
- Only `single_choice` questions are implemented in the UI.
- Data types leave room for future question types.
- Answers are scored by topic, not only by total score.
- Topic status is calculated from weighted score.
- Recommendations preserve required topics even when an employee scores highly.

Current question bank:

- Cook: 16 mock questions.
- Administrator: 16 mock questions.

## Implemented Personal Learning Route

The placeholder after diagnostic results is no longer part of the main user flow. The button “Сформировать персональный маршрут” now builds a real `LearningRoute` from `DiagnosticResult` and opens the `learning_route` step.

Implemented route behavior:

- Route is generated automatically by `buildPersonalLearningRoute`.
- Route uses employee role, grade, total diagnostic score, topic scores, strong topics, weak topics, critical topics, required topics, and topic recommendations.
- Route has three blocks: day 1, day 7, and day 14.
- Required topics always stay in the route.
- Strong topics receive a short summary or control task instead of a full module.
- Medium topics receive a short module and practice.
- Weak topics receive a full module, practice, and repeated check.
- Critical topics receive a full module, practice under manager or mentor supervision, and repeated check.
- Each learning task has type, priority, status, estimated duration, source, and assignment reason.
- Task statuses are editable: `todo`, `in_progress`, `done`, and blocked.
- Route progress shows total tasks, completed tasks, blocked tasks, and completion percentage.
- Blocked tasks are only displayed as blockers inside the prototype; they do not create escalations.

## Important Files

```text
app/page.tsx
app/onboarding-agent/page.tsx
src/modules/onboarding-agent/
  model/types.ts
  model/learningRouteTypes.ts
  model/mockData.ts
  model/diagnosticQuestions.ts
  model/learningRouteData.ts
  model/useOnboardingAgentState.ts
  model/diagnosticScoring.test.ts
  model/learningRouteBuilder.test.ts
  lib/getDiagnosticQuestions.ts
  lib/calculateDiagnosticResult.ts
  lib/buildPersonalLearningRoute.ts
  lib/getTopicStatus.ts
  lib/getTopicRecommendation.ts
  lib/getRecommendationLabel.ts
  ui/OnboardingAgentPage.tsx
  ui/steps/DiagnosticStep.tsx
  ui/steps/DiagnosticResultStep.tsx
  ui/steps/LearningRouteStep.tsx
  ui/steps/LearningRouteStep.module.css
```

## Verification

Expected passing commands:

```bash
npm run test:diagnostic
npm run test:learning-route
npm run build
```

The route builder test covers:

- day 1 / day 7 / day 14 route structure;
- required topics staying in the route;
- strong topics receiving shortened learning tasks;
- critical topics receiving reinforced tasks;
- task reasons and topic sources;
- deterministic builder output except `generatedAt`.

## Explicitly Not Implemented Yet

The current prototype still does not include:

- AI assistant;
- chat;
- RAG;
- answers over a knowledge base;
- escalation to a human;
- ticket creation;
- HR / manager notifications;
- backend;
- LLM API;
- real HRIS, LMS, SSO, calendar, service desk, or messaging integrations.

## Next Product Stage

The next stage can add an assistive AI layer on top of the already implemented route:

- curated knowledge base and source-grounded answers;
- safe fallback for unknown or sensitive questions;
- HR / manager dashboard;
- demo-only support queue, if it is explicitly in scope;
- mock integrations for a broader end-to-end demo.
