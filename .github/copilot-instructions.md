# GitHub Copilot Instructions

> **Note**: This file is located at `.github/copilot-instructions.md` and is used by GitHub Copilot to understand project context.

This file contains high-level instructions for GitHub Copilot to follow when generating code for this project. For detailed guidance, refer to the documentation files in the `docs/` directory.

## Documentation Overview

The project documentation will be built during the bootcamp sessions.

- [Project Overview](../docs/project-overview.md) - Overview of the project

## Ticket Workflow

This project uses a spec-driven development workflow where features are broken into **tickets** — structured Markdown files that serve as the source of truth for what needs to be built.

### Directory Structure

```
tickets/
  todo/          ← tickets ready to be picked up
  in-progress/   ← tickets currently being implemented
  complete/      ← tickets that are fully implemented and tested
  TICKET-TEMPLATE.md  ← master template for new tickets
```

**Status is determined by directory** — there is no status field inside the file.

### Ticket Naming Convention

```
TICKET-NNN-short-slug.md
```

Examples: `TICKET-001-user-auth.md`, `TICKET-007-search-filter.md`

The sequential number must be unique across all three status directories.

### Planning Tickets (Project Manager Mode)

Use the `plan-tickets` prompt:

```
> /plan-tickets
```

Provide a high-level plan, feature list, or conversation summary. The agent will:
1. Survey all existing tickets to avoid duplicate work
2. Decompose the requirements into discrete, independently-implementable tickets
3. Identify dependencies between tickets and suggest an implementation order
4. **Present the full plan for your approval before creating any files**
5. Write all approved tickets to `tickets/todo/`

Use this when you have a larger feature or multiple related features to plan at once.

### Creating a Single Ticket

Use the `create-ticket` prompt:

```
> /create-ticket
```

Provide a high-level description of the feature. The agent will auto-assign the next ticket ID, fill in all sections, and write the file to `tickets/todo/`.

### Implementing a Ticket

Use the `implement-ticket` prompt:

```
> /implement-ticket
```

Provide the ticket ID or filename. The agent will:
1. Move the ticket to `tickets/in-progress/`
2. Read and implement the full spec (acceptance criteria + technical notes)
3. Write all required tests
4. Run the test suite
5. Move the ticket to `tickets/complete/`

### Golden Rules

- **Always read the full ticket before implementing.** Never skip sections.
- **Never mark a ticket complete if any acceptance criterion is unsatisfied.**
- **Never mark a ticket complete if the test suite is failing.**
- **Check dependencies.** If a ticket lists dependencies, those tickets must be in `tickets/complete/` before implementation begins.
- **Do not over-implement.** Build exactly what the ticket describes — nothing more.

## UI Styling Guidelines

All frontend code must follow these guidelines to keep the UI consistent. Styles live in `packages/frontend/src/App.css`; component-scoped overrides are acceptable but must use the same tokens.

### Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg-dark` | `#282c34` | App header background |
| `--color-bg-surface` | `#f5f5f5` | Cards, sections, read-only cells |
| `--color-bg-page` | `#ffffff` | Page / board background |
| `--color-accent` | `#61dafb` | Primary buttons, interactive highlights |
| `--color-accent-hover` | `#21a1c9` | Button hover state |
| `--color-text-dark` | `#282c34` | Body text on light backgrounds |
| `--color-text-light` | `#ffffff` | Text on dark backgrounds |
| `--color-error` | `#d32f2f` | Error messages, invalid cell borders |
| `--color-success` | `#2e7d32` | Success messages |
| `--border-radius-sm` | `4px` | Buttons, inputs, small elements |
| `--border-radius-md` | `8px` | Cards, sections, board container |
| `--shadow-card` | `0 2px 4px rgba(0,0,0,0.1)` | Elevated surfaces |
| `--max-width` | `800px` | Page content max-width |

### Layout

- The root `.App` is centered with `max-width: 800px` and `margin: 0 auto` — do not widen this.
- Use `display: flex; flex-direction: column; gap: 20px` for vertical stacking of content sections.
- Prefer `gap` over margin between sibling elements.

### Typography

- Font stack: inherit from the browser default (system-ui / sans-serif). Do not introduce a custom font unless explicitly requested.
- Header `h1`: `1.8rem` on the dark header bar
- Section headings: `1.2rem`
- Body text: `1rem`
- Do not use font sizes smaller than `0.85rem`

### Buttons

- All buttons use padding `8px 16px`, `background-color: #61dafb`, `color: #282c34`, `border: none`, `border-radius: 4px`, `font-weight: bold`, `cursor: pointer`.
- Hover state: `background-color: #21a1c9`.
- Active/selected state (e.g. difficulty buttons): use a darkened version of the accent — `background-color: #21a1c9` with `box-shadow: inset 0 2px 4px rgba(0,0,0,0.2)`.
- Disabled state: `opacity: 0.5; cursor: not-allowed`.

### Inputs

- All `<input>` elements: `border: 1px solid #ccc`, `border-radius: 4px`, `text-align: center`.
- Focus ring: `outline: 2px solid #61dafb; outline-offset: 1px`.
- Error state: `border: 2px solid #d32f2f` (use class `.error` or `.sudoku-cell--error`).

### Sudoku Board

- The board must be visually centred within the page.
- Cell size: `48px × 48px` minimum; font size `1.2rem`.
- Thin inner borders: `1px solid #ccc`.
- Thick box-boundary borders (every 3rd row/column edge): `2px solid #282c34`.
- Clue cells: `background-color: #f5f5f5; font-weight: bold; cursor: default`.
- Empty editable cells: `background-color: #ffffff`.
- Error cells: `border: 2px solid #d32f2f`.

### Spacing

- Use multiples of `4px` for all padding and margin values (4, 8, 12, 16, 20, 24…).
- Section/card padding: `20px`.
- Button group gap: `8px`.

### Do Not

- Do not use inline styles except for dynamically computed values (e.g. per-cell border widths).
- Do not introduce CSS-in-JS, CSS modules, or Tailwind — plain CSS in `App.css` only.
- Do not hardcode colours outside of `App.css` — reference class names instead.
