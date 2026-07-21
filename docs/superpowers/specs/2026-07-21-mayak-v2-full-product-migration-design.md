# Миграция продукта на Mayak v2

## Цель

Перевести все рабочие поверхности прототипа Valle Sanchez на визуальную систему Mayak v2, сохранив текущие пользовательские сценарии, доменные данные, диагностические вопросы и browser persistence.

В состав входят:

- диагностический поток на `/` и `/onboarding-agent`;
- личное пространство сотрудника после диагностики;
- рабочая область руководителя на `/manager`.

Не входят изменения в скоринг, маршрут обучения, API наставника, структуру localStorage, набор ролей или содержание demo knowledge base.

## Визуальное направление

Mayak v2 — спокойный редакционный интерфейс. Ink несёт содержание, oxblood отмечает единственное основное действие или активную навигацию, paper создаёт рабочие поверхности. Ключевые заголовки набираются Georgia, рабочий текст — компактным sans-serif. Экран не должен одновременно требовать более одного решения.

Глобальные семантические токены:

| Назначение | Значение |
| --- | --- |
| `background` | `oklch(0.96036 0.00964 72.66146)` |
| `surface` | `oklch(0.99447 0.00569 84.56580)` |
| `foreground` | `oklch(0.25432 0.01655 37.33932)` |
| `muted` | `oklch(0.53591 0.01943 40.69931)` |
| `border` | `oklch(0.90301 0.01640 64.65496)` |
| `primary` | `oklch(0.44935 0.13445 22.18496)` |

Controls use a 10px radius, cards 14px, larger sheets 20px. Pills are reserved for status. The current aurora gradients, oversized rounded surfaces, and decorative floating effects are removed from product screens.

## Shared interface layer

`app/globals.css` will become the source of the Mayak v2 theme. Existing `Mayak*` primitives in `src/shared/ui/mayak` will be retuned before screen modules are changed. They provide:

- a responsive shell: 64px compact header on mobile and 76px desktop top navigation;
- panels and soft panels;
- primary, secondary and ghost buttons with hover, pressed, disabled and visible focus states;
- status pills, progress, source rows and option cards;
- one compact mobile bottom navigation for the employee workspace.

All interactive targets remain at least 44px high or wide. Reduced-motion rules remain in place.

## Diagnostic flow

The data flow and step navigation stay unchanged. The visual composition changes to a thin product top bar, a bounded focus shell and a single decision per screen.

- Welcome: a concise context block and one primary action.
- Question: centered, max 880px content; compact progress and one question; answer rows show a radio indicator and explicit selected state.
- Completion: preserve the current direct transition to `Сегодня` without restoring an intermediate score screen.
- Back and technical reset controls remain functional but stay visually subordinate to the primary action.

On smaller screens all content remains in one stream. At desktop widths the shell adds whitespace, not additional competing panels.

## Employee workspace

The current tabs and data handlers remain unchanged.

- `Сегодня`: one featured next task, up to two next task rows, and on desktop one dark ink mentor aside. The explanation sheet stays progressive disclosure.
- `Мой план`: learning stages remain accordion-like, with no more than one opened detailed stage at once.
- Task detail: a focused, centered content column capped at 760px; source and status action remain attached to the task.
- `AI-наставник`: a dedicated conversation surface with quick prompts, composer and source-backed assistant responses. A missing source still routes the employee to a person rather than inventing a rule.

Mobile retains the bottom navigation and does not reserve an aside. Desktop uses the top navigation and, only on Today, a contextual aside.

## Manager workspace

Manager data, filters, selection and action capture remain unchanged. The screen becomes a dense-but-readable operational composition:

- concise heading with a refresh action;
- status summaries based on existing route progress and help signals only;
- team list as the primary column;
- selected employee context as one sticky secondary column from 1024px upward;
- sequential employee cards and details below them on small screens.

No invented metrics, decorative tiles or HR verdicts are introduced. Help copy continues to make clear that employee decisions remain with a human manager.

## Responsive rules

The implementation is mobile-first.

| Width | Layout |
| --- | --- |
| 320–639px | One flow, employee bottom navigation, no persistent aside |
| 640–1023px | One flow with related controls grouped; compact top bar |
| 1024–1439px | Main area plus one contextual aside; 76px top bar; max 1184px shell |
| 1440–1920px | Same information density, more surrounding whitespace only |

Layouts must not horizontally scroll at 360×800, 390×844, 430×932, 600×960, 820×1180, 1024×768, 1366×768, 1440×900 and 1920×1080.

## Error and state handling

The redesign must preserve visible default, hover, focus, active, disabled and loading states. Existing empty states are restyled, not removed. Mentor knowledge fallback and manager no-blocker messaging remain explicit. The visual migration does not change validation, response handling or persistence behavior.

## Verification

- Run the existing diagnostic, learning-route, knowledge-base, manager-dashboard and personal-space tests.
- Run `npm run build`.
- Capture or inspect key employee and manager screens at 390px, 1024px and 1440px, checking keyboard focus, 44px target sizing and absence of horizontal overflow.

## Scope decisions

- Mayak v2 is the source of truth when it conflicts with the current v1 styleguide.
- Existing routes remain unchanged; no additional public routes or landing pages are added.
- The migration stays visual and structural: business rules, employee progress records and demo content are not changed.
