# Current Project State

Last updated: 2026-06-21

## Product Scope

The project is a Next.js prototype of an AI onboarding agent for a HORECA franchise network. The first iteration remains focused on two roles:

- Cook.
- Cafe / shift administrator.

The prototype should demonstrate that onboarding is personalized: a new employee selects a role and grade, passes a soft knowledge diagnostic, sees topic-level gaps, and then moves toward a personal learning route.

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
10. Personal learning route generation.
11. 14-day learning route screen with time metrics, topic decisions, source-backed modules, checkpoints, and manager recommendations.

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

## Mock Knowledge Base

A mock RAG-lite knowledge base has been added as TypeScript data. It contains 45 source documents:

- 9 general onboarding, quality, safety, source-backed answer, escalation, and route-logic documents.
- 18 cook documents mapped to cook competency topics.
- 18 administrator documents mapped to administrator competency topics.

The stronger document set includes scenario-based instructions, short checklists, escalation rules, RAG source-answering guidance, day 1 / day 7 / day 14 route logic, and manager-review triggers for high-risk cases.

The knowledge base is now connected to learning-route generation through a lightweight local retrieval helper. It is not connected to UI search, mentor answers, or diagnostic explanations yet.

## Implemented Learning Path Logic

Stage 3 is implemented with mock logic and no backend, AI, LLM, embeddings, or vector database.

Current learning-route behavior:

- The route is built from `DiagnosticResult.topicScores`.
- Required topics are never fully skipped.
- Strong skippable topics can be removed from the detailed route.
- Strong required or partially skippable topics are shortened to summary/check blocks.
- Development-zone topics receive full modules and, when available, practice modules.
- Critical or required development-zone topics receive mentor tasks.
- Every route module attempts to attach 1-3 knowledge-base sources.
- The route distributes modules across day 1 through day 14 with load limits and role-specific base days.
- Day 7 has an intermediate checkpoint.
- Day 14 has a final readiness checkpoint.
- The route calculates standard time, personalized time, saved minutes, and saved percent.
- Manager recommendations are generated for high-risk or mentor-supported topics and keep HR guardrail wording.

## Important Files

```text
app/page.tsx
app/onboarding-agent/page.tsx
src/modules/onboarding-agent/
  model/types.ts
  model/mockData.ts
  model/knowledgeBase.mock.ts
  model/learningModules.mock.ts
  model/diagnosticQuestions.ts
  model/learningPathBuilder.test.ts
  model/useOnboardingAgentState.ts
  lib/buildLearningPath.ts
  lib/getDiagnosticQuestions.ts
  lib/calculateDiagnosticResult.ts
  lib/getTopicStatus.ts
  lib/getTopicRecommendation.ts
  lib/getRecommendationLabel.ts
  lib/retrieveKnowledge.ts
  ui/OnboardingAgentPage.tsx
  ui/steps/DiagnosticStep.tsx
  ui/steps/DiagnosticResultStep.tsx
  ui/steps/LearningPathStep.tsx
```

## Verification

Known passing commands:

```bash
npm run test:diagnostic
npx tsc --noEmit --ignoreDeprecations 6.0
npm run build
```

`npm run test:diagnostic` currently covers:

- stable role and grade specific diagnostic question selection;
- topic scoring and required-topic recommendation behavior;
- learning format decisions;
- mandatory-topic preservation in personalized routes;
- 14-day route creation;
- day 7 and day 14 checkpoints;
- source-backed module generation;
- personalized time metrics;
- manager recommendations for high-risk topics.

## Git State Note

At the time of this snapshot, the repository has an active git worktree. Treat existing files as user/workspace state and do not remove or reset them unless explicitly asked.

## Next Product Stage

The next stage can make the route more interactive:

- module completion states;
- mentor chat answers grounded in the knowledge base;
- manager dashboard view of progress and risks;
- route adjustment after day 7 or day 14 checkpoint;
- clearer source browsing or knowledge-base search from the route screen.
