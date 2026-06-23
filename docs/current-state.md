# Current Project State

Last updated: 2026-06-23

## Product Scope

The project is a Next.js prototype of an AI onboarding agent for a HORECA franchise network. The current iteration remains focused on two roles:

- Cook.
- Cafe / shift administrator.

The prototype demonstrates personalization without backend, LLM, RAG, chat, or real integrations: a new employee selects a role and grade, passes a soft knowledge diagnostic, sees topic-level results, and receives an automatically generated personal learning route.

## Implemented Routes

The main prototype is available on the root route:

```text
/
```

There is no public `/onboarding-agent` route. The Mayak personal-space UI in `src/modules/personal-space/` is used as the final target state after the learning route is generated; this is the literal page that previously lived on the root route.

## Implemented Flow

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
11. Mayak personal-space screen: the same UI that previously opened on `/`.

## Current UX Structure

The onboarding flow uses a compact operational layout rather than large promo-style cards:

- The scenario progress is shown as a compact “Step X of 7” stepper with a thin progress bar.
- Main actions are kept in a sticky bottom action bar so forward/back actions stay reachable on desktop and mobile.
- Changing steps resets scroll to the top and focuses the current screen heading.
- Role, grade, competency, diagnostic, result, and route screens use denser cards and tables.
- Diagnostic result details are collapsed behind a details section by default.
- The generated learning route step opens the Mayak personal-space UI exactly as the previous root page.

## Implemented Diagnostic Logic

Stage 2 is implemented with mock logic and no backend, AI, LLM, or RAG.

Current diagnostic behavior:

- Questions are selected by role.
- Questions are selected by grade difficulty.
- Each selected diagnostic covers every competency topic for the employee role.
- Experienced network employees may receive basic anchor questions for topics that do not yet have harder questions, so no role topic disappears from the flow.
- Selection is stable and predictable for demo use.
- Only `single_choice` questions are implemented in the UI.
- Data types leave room for future question types.
- Answers are scored by topic, not only by total score.
- Diagnostic results include the full topic map for the role, including topics with zero diagnostic questions.
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
- The final Mayak screen currently uses the existing static personal-space demo content.
- Because the Mayak screen is preserved as a literal carry-over from the previous root page, it still contains the previous static CTA hrefs that point to `/onboarding-agent`; the route itself is removed.
- Blocked tasks are only displayed as blockers inside the prototype; they do not create escalations.

## Important Files

```text
app/page.tsx
app/layout.tsx
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
src/modules/personal-space/
  PersonalSpace.tsx
  data.ts
  ui/
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

- real AI assistant;
- source-grounded chat;
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
