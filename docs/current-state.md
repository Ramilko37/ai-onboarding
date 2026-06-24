# Current Project State

Last updated: 2026-06-24

## Product Scope

The project is a Next.js prototype of an AI onboarding agent for a HORECA franchise network. The current iteration remains focused on two roles:

- Cook.
- Cafe / shift administrator.

The prototype demonstrates personalization without backend, external LLM, embeddings, vector database, or real integrations: a new employee selects a role and grade, passes a soft knowledge diagnostic, sees topic-level results, reaches the Mayak personal-space screen after an automatically generated personal learning route is created in state, and can ask the mentor chat questions that are answered from a local demo knowledge base with visible source citations.

## Implemented Routes

The main prototype is available on the root route and on a dedicated onboarding route:

```text
/
/onboarding-agent
```

Both routes render `OnboardingAgentPage`. The Mayak personal-space UI in `src/modules/personal-space/` is used as the final target state after the learning route is generated.

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
11. Mayak personal-space screen embedded inside the onboarding shell.

## Current UX Structure

The onboarding flow uses the shared Mayak UI kit and a compact operational layout rather than large promo-style cards:

- The scenario progress is shown as a compact “Step X of 7” stepper with a thin progress bar.
- Main actions are kept close to the active panel so forward/back actions stay reachable on desktop and mobile.
- Role, grade, competency, diagnostic, result, and route screens use denser cards and tables.
- Diagnostic result details are collapsed behind a details section by default.
- The generated learning route step opens the Mayak personal-space UI inside the onboarding shell.
- The final personal-space screen uses the generated employee profile and learning route for the hero, journey map, knowledge map, today's focus, and mentor chat context.

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
- The final Mayak screen uses the generated `LearningRoute` and employee profile instead of the previous static employee demo state.
- The Mayak screen contains static mentor / knowledge-base / team shortcut buttons for the prototype; they do not open real external systems.
- Blocked tasks are only displayed as blockers inside the prototype; they do not create escalations.

## Implemented Knowledge Base And Mentor Chat

The project now includes a local demo knowledge base and a RAG-ready mentor-chat layer. It is intentionally lightweight: source-grounded lexical retrieval over curated demo documents, not a production vector RAG pipeline.

Implemented behavior:

- Knowledge documents are explicitly marked as demo content.
- Documents are role-scoped for cook and administrator.
- The retriever searches document titles, sources, topic ids, section titles, and section text.
- Required topics and route topic ids boost relevant matches only after a textual match exists; they do not force an unrelated answer.
- The mentor answer includes source lines and returns structured `sources` for UI citations.
- Unknown, unrelated, HR, medical, legal, payroll, disciplinary, or sensitive questions fall back to manager / HR / mentor review instead of inventing an answer.
- The `/api/mentor-chat` route validates JSON, required question text, and role.
- The embedded personal-space assistant sends the current role, route topic ids, employee name, route summary, and active task titles to the API.

Current demo sources include:

- cook hygiene;
- cook storage and labeling;
- cook tech cards and quality defects;
- administrator order handling;
- administrator payment, refund, complaint, and kitchen interaction rules.

## Important Files

```text
app/page.tsx
app/onboarding-agent/page.tsx
app/api/mentor-chat/route.ts
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
src/modules/knowledge-base/
  index.ts
  model/
  lib/
src/shared/ui/mayak/
  index.tsx
  styleguide.ts
```

## Verification

Expected passing commands:

```bash
npm run test:diagnostic
npm run test:learning-route
npm run test:knowledge-base
npm run build
```

Latest browser smoke check on 2026-06-24 covered:

- `/onboarding-agent` desktop flow: welcome, profile, role and grade selection, competency map, diagnostic intro, 12 diagnostic questions, diagnostic result, generated route, and final Mayak screen.
- Final screen personalization: employee profile and generated route data appear in the Mayak personal-space UI instead of the previous static employee state.
- Mentor chat: "Где хранить лосось после открытия упаковки?" returns a grounded answer with `Регламент хранения продуктов` citations.
- Mentor chat fallback: a disciplinary / HR question does not receive an invented operational answer and points to manager / HR review.
- `/` mobile first screen at 390x844.
- Browser console warnings/errors during the checked flow: none observed.

The knowledge-base test covers:

- demo documents being marked and source-backed;
- role-specific retrieval;
- grounded answers with citations;
- HR / disciplinary fallback;
- unknown-question fallback even when route topic ids are present.

The route builder test covers:

- day 1 / day 7 / day 14 route structure;
- required topics staying in the route;
- strong topics receiving shortened learning tasks;
- critical topics receiving reinforced tasks;
- task reasons and topic sources;
- deterministic builder output except `generatedAt`.

## Explicitly Not Implemented Yet

The current prototype still does not include:

- external LLM answer generation;
- embeddings;
- vector database or semantic search;
- production RAG ingestion pipeline;
- uploaded real franchise documents;
- escalation to a human;
- ticket creation;
- HR / manager notifications;
- backend;
- real HRIS, LMS, SSO, calendar, service desk, or messaging integrations.

## Next Product Stage

The next stage can harden the assistive AI layer on top of the already implemented route:

- import real franchise documents into the knowledge base;
- add embeddings and a vector store;
- connect an LLM answer generator that is constrained by retrieved sources;
- keep safe fallback for unknown or sensitive questions;
- HR / manager dashboard;
- demo-only support queue, if it is explicitly in scope;
- mock integrations for a broader end-to-end demo.
