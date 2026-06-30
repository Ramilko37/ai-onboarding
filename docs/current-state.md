# Current Project State

Last updated: 2026-06-28

## Product Scope

This branch is a Valle Sanchez barista-focused version of the onboarding prototype.

The visible product flow is now centered on one role:

- Barista.

The prototype supports high-volume onboarding of new baristas: an employee enters profile data and grade, passes a soft first-day diagnostic based on demo coffee standards, receives topic-level skill-gap analysis, and gets a personal development route for day 1, day 7, and day 14.

The manager dashboard shows a demo cohort plus live diagnostic results saved in this browser. There is still no backend, external LLM, external embeddings service, or production vector database.

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

1. Welcome screen for Valle Sanchez barista assessment.
2. Barista profile form: name, grade, coffee shop, start date.
3. Barista competency map for day 1, day 7, and day 14.
4. Diagnostic explanation screen.
5. Diagnostic question flow.
6. Topic-level diagnostic result.
7. Automatically generated personal development route for day 1, day 7, and day 14.
8. Final personal-space screen with route, today focus, knowledge map, and source-backed mentor chat.

Current manager flow:

1. Open `/manager`.
2. Review cohort metrics: count, average score, high-risk baristas, ready baristas.
3. Filter by risk level.
4. Select a barista and review readiness, critical topics, development areas, manager recommendation, and route highlights.

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

- 15 mock single-choice questions.
- Question selection remains grade-aware and stable.
- Every barista diagnostic covers every barista competency topic.
- Required topics stay in the route even when the score is high.

## Knowledge Base And Mentor Chat

The knowledge base is still local demo content, now with a lightweight mock vector index:

- knowledge documents are role-scoped and source-backed;
- barista standards are explicitly marked as `Demo KB`;
- retrieval combines lexical matching with deterministic hashed-vector scoring;
- vector score only boosts already relevant matches, so unrelated questions still fall back safely;
- mentor answers cite source titles and excerpts;
- unknown, HR, medical, legal, payroll, disciplinary, or sensitive questions fall back to manager / HR / mentor review.

Barista demo sources include:

- coffee bar hygiene;
- beans and storage;
- espresso setup;
- milk texture and drink recipes;
- equipment cleaning;
- peak-flow and guest communication.

## Persistence

Prototype browser persistence uses localStorage:

```text
valle-sanchez:barista-onboarding-state:v1
barista:assessment-results:v1
```

The manager dashboard record stores summary data only: profile summary, total score, topic labels, critical topics, route highlights, risk level, readiness label, and manager recommendation. It does not store raw diagnostic answers.

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
npm run build
```

Latest completed verification on 2026-06-28:

- `npm run test:diagnostic`
- `npm run test:learning-route`
- `npm run test:knowledge-base`
- `npm run test:manager-dashboard`
- `npm run build`

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
