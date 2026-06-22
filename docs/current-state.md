# Current Project State

Last updated: 2026-06-22

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

## Roadmap Position

The application is currently at the end of roadmap stage 6: personal learning route generation is implemented for the demo flow.

Current roadmap status:

| Roadmap stage | Status |
|---|---|
| Stage 1. Discovery and task framing | Covered for the prototype scope through documented roles, grades, and demo flow. |
| Stage 2. Knowledge base preparation | Implemented as a mock TypeScript knowledge base with role/topic/source mapping. |
| Stage 3. Competency map | Implemented for cook and administrator roles across day 1, day 7, and day 14. |
| Stage 4. Diagnostic test generation | Implemented as a deterministic mock question bank and selector by role and grade, not as real AI generation. |
| Stage 5. Skill gap analysis | Implemented with topic-level scoring, strong zones, development zones, required-topic logic, and recommendations. |
| Stage 6. Personal learning route | Implemented with mock learning modules, RAG-lite source lookup, 14-day distribution, time metrics, checkpoints, and manager recommendations. |
| Stage 7. AI mentor | Not implemented yet. |
| Stage 8. Manager/franchise/UK dashboards | Not implemented yet as separate dashboard screens. |

Practical roadmap position: the prototype is ready to demo the path from employee profile through diagnostic results to a personalized 14-day route. It is not yet the full P0 prototype from the roadmap because mentor chat, module progress, manager dashboards, UK analytics, stress pulse checks, and repeat diagnostics are still pending.

## Implemented Diagnostic Logic

Stage 2 is implemented with mock logic and no backend, AI, LLM, embeddings, or vector database.

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

The knowledge base is now connected to learning-route generation and a lightweight source-backed answer helper. It is not connected to UI search, mentor chat UI, or diagnostic explanations yet.

The current RAG-lite contract supports:

- retrieving role/topic documents for learning modules;
- answering operational smoke-test questions with a visible source label;
- returning the fallback text when no exact knowledge-base answer is found;
- preserving explicit topic-source mappings for diagnostic topics such as `cook-labeling`, `cook-tech-cards`, `admin-refunds`, and `admin-complaints`.

## Implemented Learning Path Logic

Stage 3 is implemented with mock logic and no backend, AI, LLM, embeddings, or vector database.

Current learning-route behavior:

- The route is built from `DiagnosticResult.topicScores`.
- Required topics are never fully skipped.
- Strong skippable topics can be removed from the detailed route.
- Strong required or partially skippable topics are shortened to summary/check blocks.
- Development-zone topics receive full modules and, when available, practice modules.
- Critical or required development-zone topics receive mentor tasks.
- Module selection falls back from an exact format to `short_module` and then `summary` for core learning blocks, so missing optional catalog entries do not break route generation.
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
  model/knowledgeRetrieval.test.ts
  model/learningPathBuilder.test.ts
  model/useOnboardingAgentState.ts
  lib/answerKnowledgeQuestion.ts
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

Last verified locally on 2026-06-22 after adding RAG smoke checks and Learning Path Builder contract tests.

`npm run test:diagnostic` currently covers:

- stable role and grade specific diagnostic question selection;
- topic scoring and required-topic recommendation behavior;
- RAG smoke answers for cook and administrator operational questions;
- visible source labels in RAG-style answers;
- diagnostic topic to knowledge-base source mapping;
- no-answer fallback when the knowledge base does not contain an exact rule;
- learning format decisions;
- learning module fallback selection;
- mentor-task threshold rules for critical and required topics;
- mandatory-topic preservation in personalized routes;
- 14-day route creation;
- day 7 and day 14 checkpoints;
- source-backed module generation;
- primary RAG source mapping inside learning-route modules;
- personalized time metrics;
- manager recommendations for high-risk topics.

## Git State Note

Git state is intentionally not assumed from this document. Agents must run `git status --short` before editing or committing and must not remove or reset user/workspace changes unless explicitly asked.

## Next Product Stage

The next roadmap stage is Stage 7, AI mentor support, with a small amount of route interactivity needed before or alongside it:

- module completion states;
- mentor chat answers grounded in the knowledge base;
- manager dashboard view of progress and risks;
- route adjustment after day 7 or day 14 checkpoint;
- clearer source browsing or knowledge-base search from the route screen.
