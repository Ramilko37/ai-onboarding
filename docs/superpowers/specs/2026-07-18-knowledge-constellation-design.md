# Knowledge constellation: selected-topic design

## Context

The current `KnowledgeConstellation` puts full topic names inside small, low-contrast circles. On desktop, labels wrap and collide with the visual metaphor; the map cannot be used as a practical guide through learning.

The agreed direction is **variant B — constellation with details on selection**. It retains the constellation as a memorable progress metaphor while moving long text and actions into a clear, accessible details area.

## Experience

### Map

- The panel keeps the title, role context and a three-state legend: `Уверенно`, `В работе`, `Впереди`.
- The map becomes a deliberately compact, high-contrast night-sky surface on desktop and mobile.
- Lines connect topics for both demo data and a generated learning route.
- Nodes contain only a short visual state: status icon or sequence number; they never contain full topic titles.
- Node colors have distinct fill, border and focus treatments, so state does not rely on subtle background contrast alone.
- The selected node is visually larger and receives a visible ring; non-selected nodes remain comfortably tappable (at least 44px interactive area).

### Topic details

- A detail card immediately below the map is always present.
- Before a selection, it introduces the first topic currently in work; after a selection, it shows that topic.
- The card contains: full topic name, plain-language status, concise next step, and source/material count when it is available in demo data.
- The card exposes one explicit action: open the next task or learning material. It should follow existing prototype navigation rather than introduce a dead control.
- On wider screens, the details remain within the same panel beneath the map; the reading order stays map → selected topic → action.

### Interaction and accessibility

- Nodes are semantic buttons with an accessible name that includes the full topic title and status.
- Pointer, Enter and Space select a topic.
- Arrow keys move selection through the displayed topics in visual/data order; Home and End select the first and last topic.
- The selected node uses `aria-pressed`; its details use a labelled region rather than an announcement-only tooltip.
- Respect reduced-motion preferences: floating effects are removed or kept static.

## Data and implementation boundary

- Keep `KnowledgeNode` as the topic/state/position contract and add only the fields needed for a detail card (for example, task ID or topic summary) in the personal-space slice.
- Derive route node labels and their linked next task from `LearningRoute`; do not hard-code barista task titles in the UI.
- Maintain the existing fallback demo constellation and links when a route is absent.
- Keep all state local to `KnowledgeConstellation`; no global store is necessary.
- Update the current-state document only if the public behaviour or verification commands change.

## Responsive behaviour

- Mobile: map is about 250–280px high, nodes retain 44px targets, detail card is directly below it.
- Desktop: map has a bounded height (about 300px) so it does not dominate the employee workspace; full names remain exclusively in the detail card.
- The legend can wrap or collapse into compact state labels on narrow screens, but no status information is hidden.

## Verification

- Unit test: route-to-node detail mapping chooses the expected next task/topic and preserves route topics.
- Browser: verify desktop and mobile with a generated route; select nodes with pointer and keyboard; inspect no horizontal overflow, readable status contrast, and a working detail action.
- Run `npm run test:personal-space` and `npm run build` before handoff.
