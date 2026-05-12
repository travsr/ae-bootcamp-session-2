---
id: TICKET-003
title: Difficulty Selector Component
created: 2026-05-12
dependencies: []
---

## Description

Create a stateless React component that renders three difficulty buttons (Easy, Medium, Hard) and communicates the user's selection to its parent via a callback prop. This component is purely presentational and has no knowledge of the API or game state — it can be built and tested independently before the game orchestration layer exists.

## Acceptance Criteria

- [ ] Three buttons labelled "Easy", "Medium", and "Hard" are rendered.
- [ ] Clicking a button calls the `onSelect` prop with the corresponding lowercase string value (`'easy'`, `'medium'`, or `'hard'`).
- [ ] The button matching the `selected` prop receives an `active` CSS class; the others do not.
- [ ] When no `selected` prop is provided the component renders without errors and no button has the active class.
- [ ] The component is exported as the default export from its file.

## Technical Implementation Notes

- **Files likely affected**: `packages/frontend/src/components/DifficultySelector.js` (create new)
- **Props**:
  - `onSelect(difficulty: string)` — called when a button is clicked, with value `'easy'`, `'medium'`, or `'hard'`
  - `selected` (string, optional) — the currently active difficulty; used to apply an `active` CSS class to the matching button
- **Styling**: buttons should sit in a flex row; use a class like `.difficulty-selector` on the container and add an `active` class to the selected button; add styles to `packages/frontend/src/App.css`
- **Constraints**: no API calls, no internal state; keep it a pure functional component

## Test Requirements

### Unit Tests
- Location: `packages/frontend/src/__tests__/DifficultySelector.test.js`
- Must verify:
  - All three buttons render with correct labels
  - Clicking "Easy" calls `onSelect` with `'easy'`
  - Clicking "Medium" calls `onSelect` with `'medium'`
  - Clicking "Hard" calls `onSelect` with `'hard'`
  - When `selected="medium"` is passed, only the "Medium" button has the `active` class

### Integration Tests
- Location: `packages/backend/__tests__/integration/`
- Must verify: N/A — frontend-only component; no backend integration

### E2E Tests
- Location: `tests/e2e/`
- Must verify: N/A — difficulty selection is covered as part of the full user journey in TICKET-006
