# Mayak Design System: full product migration

## Goal

Bring every visible Valle Sanchez product surface into the supplied Mayak v1.0 design system: the employee onboarding flow, the employee personal space, the manager dashboard, and the shared primitives they use. Preserve diagnostic logic, learning-route generation, local persistence and all existing routes.

## Direction

The product uses Mayak’s warm editorial navigation: oxblood establishes direction and the one primary action; paper surfaces keep work calm; sand indicates learning and support. The application must feel like a guided operational workspace for a coffee-bar team, not a generic LMS or an HR administration dashboard.

The supplied Mayak tokens in `app/globals.css` are the only colour source. Component code must not introduce raw colour values, named palette utility colours, or competing visual systems.

## Migration architecture

### Shared Mayak foundation

`src/shared/ui/mayak/` becomes the product-wide source for visual behaviour.

- Align `MayakShell`, `MayakTopBar`, `MayakPanel`, typography, form controls, buttons and badges to the Mayak spec.
- Add focused primitives only where the same pattern is used in at least two product modules: status/level pill, action bar, option card, task row, linear progress and progress ring.
- Use semantic tone names (`primary`, `secondary`, `accent`, `success`, `warning`, `danger`, `info`) rather than colour words or raw CSS colours inside components.
- Raise all interactive controls to a minimum 44px target, including selects, filters, task controls and compact action buttons.
- Ensure default, hover, visible focus, disabled, error and loading states are structurally consistent.
- Keep `Tenor Sans` for screen-level display/H1 moments only; use Geist and Geist Mono for operational UI and metadata.

### Employee onboarding

The employee flow remains sequential and calm.

- Welcome, profile, competency map, diagnostic intro, question flow, result, and generated route use a consistent shell, section header and action bar.
- Each screen exposes one primary next action. Back, reset and supporting navigation use secondary or ghost treatment.
- Form fields and answer choices use one option-card interaction model with `aria-pressed`, full keyboard focus treatment and accessible errors.
- Diagnostic questions take the principal working area at desktop; employee context and explanatory content remain compact instead of becoming a permanent sidebar.
- The result puts the next practice first, then development analysis and supporting details.
- The learning route and personal-space entry use shared task/status patterns; source and mentor affordances stay explicit.

### Employee personal space

The existing desktop focus model is retained and made more deliberate.

- Compact and comfortable layouts use one content stream; focus desktop uses the existing Today / Route / Mentor / Knowledge workspace navigation.
- The workspace stays bounded to the Mayak focus width instead of filling large screens with more panels.
- Hero, manager-save notice, today tasks, route, mentor, support and knowledge constellation share panel variants, captions, action heights and status language.
- The constellation keeps the approved selected-topic pattern: short visual nodes, contrast-safe states, a readable detail card and a direct route-task action. Its node state colours are converted to Mayak semantic tokens.

### Manager dashboard

The manager view keeps denser comparison patterns without changing its human tone.

- Information order is: today requires attention, recurring topics, employee list, employee detail.
- Summary metrics become compact operational cards rather than oversized dashboard decoration.
- Risk copy is consistently framed as support, review or mentor attention; it is never presented as a personnel decision.
- Desktop uses the existing comparison table for the employee list and keeps text at or above 14px; compact layouts turn list rows into readable cards.
- The detail panel uses shared task rows, status pills and action bars so the employee and manager views communicate state identically.

## Responsive composition

- **320–639 (compact):** one content stream; no persistent sidebars; action bars stack or scroll only when necessary; touch controls are at least 44px.
- **640–1023 (comfortable):** two columns only for related content such as form fields or compact summaries. Primary workflow remains vertically legible.
- **1024–1439 (focus desktop):** employee workspace is bounded at 720–960px and shows a single active workspace section. Diagnostic questions remain central.
- **1440+:** overall shell is capped at 1152px; manager comparison can use the full shell, while employee screens preserve readable measure and whitespace.

## Accessibility and motion

- Body text meets 4.5:1 contrast; UI boundaries and large text meet 3:1.
- Status has text and/or icon alongside colour in every module.
- All progress indicators have useful `aria` text and all selectable options expose selection state.
- Form errors are connected to controls with `aria-describedby`.
- Existing motion is reduced to one current-state pulse per screen; all transforms and loops honour `prefers-reduced-motion`.

## Non-goals

- No changes to diagnostic scoring, route-building rules, manager record schema, browser persistence or API boundaries.
- No new product modules, integrations, role types or data collection.
- No broad structural rewrite outside shared Mayak primitives and the visual consumers that need them.

## Verification

- Preserve and run the existing diagnostic, learning-route, knowledge-base, manager-dashboard and personal-space test commands.
- Add focused UI-model tests for any new shared status or responsive-selection helper.
- Run a production build.
- Browser smoke all three product surfaces at 390px, 768px, 1024px and 1440px: main action availability, keyboard focus, option selection, route task update, manager filter/detail selection, overflow and console errors.
