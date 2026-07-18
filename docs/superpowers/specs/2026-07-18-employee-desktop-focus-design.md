# Employee Desktop Focus Design

Date: 2026-07-18

## Context

Customer feedback confirms that the employee flow is comfortable on a phone, but the desktop personal-space screen exposes too much information at once. The overload is concentrated after the diagnostic, where the route, all route tasks, knowledge map, mentor chat, daily focus, support panel, and manager-facing actions are visible simultaneously.

The change must preserve the working mobile experience and the existing barista onboarding domain logic.

## Goal

Make the employee personal space calm and immediately actionable on desktop. On entry, the employee should understand the current priority and one next step without scanning the whole 14-day route.

## Chosen Approach

Use a desktop-only focused workspace with progressive disclosure. The default desktop view is **Today**. The complete route, mentor, and knowledge content remain available through a clear tabbed navigation.

The existing vertical mobile composition remains unchanged.

## Desktop Information Architecture

The personal-space header keeps the employee greeting, compact route progress, and the nearest required action.

Below the header, desktop users see four tabs:

1. **Today** — the default tab. Shows the current-day tasks, completion progress, and nearest mentor or manager check.
2. **Route** — shows the complete Day 1, Day 7, and Day 14 journey and existing task-status controls.
3. **Mentor** — combines the source-backed assistant and the existing support guidance.
4. **Knowledge** — shows the employee knowledge-topic map and its route context.

Only the selected tab panel is visually active on desktop. The screen must not duplicate the same task list across tabs.

The saved-result message and actions such as opening the manager dashboard or starting a new diagnostic remain available, but they use compact, secondary styling so they do not compete with the employee's next task.

## Responsive Behaviour

- Mobile widths keep the existing vertical content order and touch-friendly controls.
- The focused tabbed workspace appears at the project's existing desktop breakpoint (`lg`, 1024 px).
- Tablet layouts continue to use the mobile/stacked composition unless the content fits without truncation.
- Desktop content uses a readable maximum width and avoids filling available horizontal space with additional panels.
- No new arbitrary breakpoint is introduced.

## Interaction And Accessibility

- **Today** is selected when the personal space first opens.
- Tab switching is local UI state and does not reload the page or change onboarding data.
- Tabs use semantic tab roles, visible selection, keyboard navigation, and a visible focus state.
- Existing task-status controls continue to update the same learning-route state and manager-dashboard summary.
- When JavaScript state changes a task, the active tab remains selected.
- No new external UI or state library is required.

## Architecture

The change stays within the existing `personal-space` slice.

- `PersonalSpace` continues to receive the profile, learning route, reset action, and task-status callback.
- A focused desktop workspace component owns only the active-tab presentation state.
- Existing domain-rich components (`JourneyMap`, `Assistant`, `TodayFocus`, `KnowledgeConstellation`, and `SupportPanel`) remain responsible for their current content.
- If Today needs a route-task subset, the selection rule is a small pure helper in the personal-space slice rather than business logic embedded in JSX.
- No onboarding scoring, route generation, persistence keys, API behavior, or manager-dashboard contracts change.

## Empty And Fallback States

- The personal space keeps working with the existing demo fallback when no generated route is supplied.
- If a generated route has no tasks for the current day, Today shows a calm completion/next-check message and links to the full route.
- Mentor failures and knowledge fallbacks continue to use their existing safe, source-backed behavior.

## Verification

Verify the employee personal space at 375 px, 768 px, 1280 px, and 1440 px.

Acceptance criteria:

- At 375 px and 768 px, the existing stacked employee experience remains usable and complete.
- At 1280 px and 1440 px, only one primary content area is visually presented at a time below the header.
- Today is selected initially and exposes the employee's next actionable tasks.
- Route, Mentor, and Knowledge can be reached by mouse and keyboard.
- Task status changes still persist and remain visible in the manager dashboard summary.
- No content overlaps, clips, or causes unintended horizontal scrolling.
- Existing diagnostic, learning-route, knowledge-base, and manager-dashboard tests pass.
- `npm run build` passes.

## Out Of Scope

- Redesigning the manager dashboard.
- Changing the diagnostic questions, scoring, skill-gap rules, or learning-route generation.
- Changing mobile information architecture.
- Adding backend persistence, cross-device sync, or new integrations.
