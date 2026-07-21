# Current Project State

Last updated: 2026-07-21

## Product Scope

This branch is a Valle Sanchez barista-focused version of the onboarding prototype.

The visible product flow is now centered on one role:

- Barista.

The prototype supports high-volume onboarding of new baristas: an employee enters profile data and grade, passes a soft first-day diagnostic based on sample coffee standards, receives topic-level development areas, and gets a personal development route for day 1, day 7, and day 14.

The manager dashboard shows a demo cohort plus live diagnostic results saved in this browser. There is still no backend, external LLM, external embeddings service, or production vector database.

The UX/UI layer follows the Mayak v1.0 system: warm editorial navigation, oxblood direction, paper surfaces, semantic status tokens, 44px controls and a responsive focus-first composition. Visible wording is product-facing, the role is fixed as the barista scenario, the employee route links directly to the manager dashboard, and the manager dashboard includes next actions, attention items, topic analytics, route statuses, and mock action capture.

## Implemented Routes

```text
/
/onboarding-agent
/manager
```

- `/` and `/onboarding-agent` render the barista diagnostic and learning-route flow.
- `/manager` renders the manager dashboard with demo baristas plus locally saved live results.
- `/api/mentor-chat` answers mentor questions from the local demo knowledge base.

## Implemented Flow

Current employee flow:

1. Compact prefilled welcome for Sofia, her role, location and start date.
2. One primary action starts the first of eight diagnostic questions, or resumes an unfinished diagnostic at the saved question number.
3. Completing the last diagnostic question immediately builds the personal route.
4. `Сегодня` workspace with a next action and at most three Day 1 tasks.
5. Collapsible full route by period, source-backed mentor panel, and secondary knowledge constellation.
6. One route task state (`todo`, `in_progress`, `done`, `blocked`) persists into the manager projection.

Current manager flow:

1. Open `/manager`.
2. Review cohort metrics: count, average score, high-risk baristas, ready baristas.
3. Review "today requires attention" and frequent development topics.
4. Filter by risk level.
5. Compare baristas in a desktop card-table layout or mobile cards.
6. Select a barista and review readiness, critical topics, development areas, manager recommendation, next action, mentor, manual check, repeat test date, route status, and day 1/7/14 timeline.
7. Click a mock manager action and see "action captured in demo" feedback.

## Domain Data

Visible role:

- `barista`.

Hidden legacy role data for `cook` and `admin` remains in code so existing tests and prior demo logic stay stable, but the visible profile path is barista-only.

Barista competency topics:

- Hygiene and safety at the coffee bar.
- Beans and storage.
- Espresso setup.
- Grind, dose, and tamping.
- Extraction and sensory check.
- Milk and texture.
- Drink recipes.
- Equipment cleaning.
- Service flow.
- Guest communication.

Required topics:

- Hygiene and safety at the coffee bar.
- Milk and texture.
- Equipment cleaning.

Current barista question bank:

- 15 single-choice questions, including methodologist-supplied day-1 espresso checks.
- The active diagnostic run now selects 8 compact questions from the bank.
- The diagnostic checks the 18-27-38 espresso recipe, roast-date dose range, extraction timing, milk temperature, flat white recipe basics, hygiene, equipment cleaning, and storage.
- Question selection remains grade-aware and stable.
- Every barista diagnostic keeps required safety topics while using a compact role-representative sample.
- Required topics stay in the route even when the score is high.

Visible onboarding progress is grouped into four customer-facing stages:

- Profile.
- Test.
- Result.
- Development plan.

The four-stage progress control is clickable: users can return to available stages without resetting completed data. Result and development-plan stages become selectable only after the corresponding result or route exists.

## Knowledge Base And Mentor Chat

The knowledge base is still local demo content, now with a lightweight mock vector index:

- knowledge documents are role-scoped and source-backed;
- barista standards are explicitly marked as `Demo KB`;
- retrieval combines lexical matching with deterministic hashed-vector scoring;
- vector score only boosts already relevant matches, so unrelated questions still fall back safely;
- mentor answers cite source titles and excerpts;
- mentor answers format demo source names as sample network standards in the visible UI;
- unknown, HR, medical, legal, payroll, disciplinary, or sensitive questions fall back to manager / HR / mentor review.

Barista demo and methodologist-supplied sources include:

- day-1 espresso dictionary, recipe, extraction timing, grind adjustment, and milk temperature;
- coffee bar hygiene;
- beans and storage;
- espresso setup;
- milk texture and drink recipes;
- equipment cleaning;
- peak-flow and guest communication.

## Persistence

Prototype browser persistence uses localStorage:

```text
valle-sanchez:barista-onboarding-state:v2
barista:assessment-results:v1
```

The manager dashboard record stores profile summary, learning-route progress, task statuses, blocked task titles and open mentor questions. It does not store raw diagnostic answers.

This is still local browser persistence only. New employee state uses `valle-sanchez:barista-onboarding-state:v2` and migrates the previous v1 key.

## Important Files

```text
app/page.tsx
app/onboarding-agent/page.tsx
app/manager/page.tsx
app/api/mentor-chat/route.ts
app/globals.css
src/modules/onboarding-agent/
src/modules/knowledge-base/
src/modules/manager-dashboard/
src/modules/personal-space/
src/shared/ui/mayak/
```

## Verification

Expected passing commands:

```bash
npm run test:diagnostic
npm run test:learning-route
npm run test:knowledge-base
npm run test:manager-dashboard
npm run test:personal-space
npm run build
```

Latest completed verification on 2026-07-18:

- `npm run test:diagnostic`
- `npm run test:learning-route`
- `npm run test:knowledge-base`
- `npm run test:manager-dashboard`
- `npm run test:personal-space`
- `npm run build`
- Browser smoke: completed barista diagnostic, generated route, marked a route task as needing mentor help, verified the saved barista appears in `/manager`, verified manager action feedback, checked desktop and mobile manager/onboarding screens, and confirmed no browser console errors.
- 2026-06-30 follow-up: `npm run build` after enabling clickable stage navigation.
- 2026-07-18: added the employee desktop `Today`-first workspace and `npm run test:personal-space` coverage for focus selection, route progress, status toggling, and tab navigation.
- 2026-07-18 browser smoke: completed the full barista diagnostic, generated a route, changed a Today task status, and confirmed the same status in the full route. Verified 375 px and 768 px stacked layouts plus 1024 px, 1280 px, and 1440 px tabbed layouts with no horizontal overflow, correct keyboard navigation, and no browser console errors.
- 2026-07-18 knowledge constellation: verified a generated route at 375 px and 1280 px; topic nodes are keyboard-selectable, full topic details remain outside nodes, and the task action focuses the matching route card with no horizontal overflow or browser console errors.
- 2026-07-21 UX simplification: baseline tests and production build passed after replacing employee score/risk output with topic focus, unifying task status projections and simplifying the manager view to learning progress and help signals.
- 2026-07-21 diagnostic completion: the intermediate focus/result screen was removed; finishing the last diagnostic question now opens the `Сегодня` task workspace directly. Verified with `npm run test:diagnostic`, `npx tsc --noEmit --ignoreDeprecations 6.0`, browser flow on `localhost:3000`, and `npm run build`.
- 2026-07-21 diagnostic question redesign: the diagnostic run was shortened to 8 questions, the question screen was constrained to a 960 px outer / 880 px content width, the duplicate inner frame and old explanatory blocks were removed, answer cards were normalized to 72-88 px with left radio indicators and clear selected state, and the first-screen back action became `Выйти из диагностики` with confirmation.
- 2026-07-21 welcome simplification: the separate right-hand presentation column was removed, the welcome card was constrained to 800 px without a fixed desktop height, the entry action was reduced to a single CTA (`Начать — около 4 минут` or `Продолжить с вопроса N из 8`), and the development-only reset action moved into the profile menu.
- `npm run build` may need network access because `app/layout.tsx` currently loads Geist and Geist Mono through `next/font/google`.

## Explicitly Not Implemented

The prototype still does not include:

- real franchise standards from Valle Sanchez;
- external LLM answer generation;
- external embeddings;
- production vector database;
- backend persistence;
- cross-device manager dashboard sync;
- HRM, LMS, POS, SSO, payroll, calendar, service desk, or messaging integrations;
- employment-status, payroll, disciplinary, legal, or medical decisions.

## Next Product Stage

Recommended next stage:

- import real Valle Sanchez standards and replace demo documents;
- choose a production vector store and embedding strategy;
- add backend persistence for manager dashboard results;
- add manager review workflow for high-risk diagnostic results;
- run a demo pilot with barista leads and store managers.
