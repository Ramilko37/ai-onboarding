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
10. Placeholder for the future personal learning route.

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

## Important Files

```text
app/page.tsx
app/onboarding-agent/page.tsx
src/modules/onboarding-agent/
  model/types.ts
  model/mockData.ts
  model/diagnosticQuestions.ts
  model/useOnboardingAgentState.ts
  lib/getDiagnosticQuestions.ts
  lib/calculateDiagnosticResult.ts
  lib/getTopicStatus.ts
  lib/getTopicRecommendation.ts
  lib/getRecommendationLabel.ts
  ui/OnboardingAgentPage.tsx
  ui/steps/DiagnosticStep.tsx
  ui/steps/DiagnosticResultStep.tsx
```

## Verification

Known passing commands:

```bash
npm run test:diagnostic
npm run build
```

`npm run test:diagnostic` currently covers:

- stable role and grade specific diagnostic question selection;
- topic scoring and required-topic recommendation behavior.

## Git State Note

At the time of this snapshot, the repository appears to be untracked from git's perspective. Treat existing files as user/workspace state and do not remove or reset them unless explicitly asked.

## Next Product Stage

The next stage should implement the personal learning route based on diagnostic results:

- day 1 route;
- day 7 route;
- day 14 route;
- shortened modules for strong topics;
- reinforced modules for development zones;
- required safety and compliance blocks;
- manager-facing recommendations for high-risk cases.
