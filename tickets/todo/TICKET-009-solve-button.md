---
id: TICKET-009
title: Solve Button
created: 2026-05-12
dependencies: [TICKET-005]
---

## Description

Add a "Solve" button to the sudoku game that, when clicked, immediately fills every empty cell with its correct value from the `solution` array. This lets a player give up on a puzzle and see the completed board. The button is only visible while a puzzle is in progress.

## Acceptance Criteria

- [ ] A "Solve" button is rendered below the board while `gameState === 'playing'`.
- [ ] Clicking "Solve" fills all currently empty or incorrect cells with their correct values from `solution`, making the board fully solved.
- [ ] After clicking "Solve", all cells are read-only (no further edits possible).
- [ ] Clicking "Solve" triggers the `onComplete` callback so the success/play-again screen is shown (identical flow to a player-solved puzzle).
- [ ] The "Solve" button is not visible when `gameState` is `'idle'`, `'loading'`, or `'complete'`.

## Technical Implementation Notes

- **Files likely affected**:
  - `packages/frontend/src/components/SudokuBoard.js` (accept an `overrideGrid` prop; when truthy, display its values and make all cells read-only)
  - `packages/frontend/src/components/SudokuGame.js` (add `handleSolve` function; pass `overrideGrid={solution}` to `SudokuBoard` when solved, then call `handleComplete`)
  - `packages/frontend/src/App.css` (add button style for `.solve-button` if a distinct style is desired; otherwise reuse existing button styles)
- **Approach**:
  - Add an `overrideGrid` prop to `SudokuBoard`. When provided, use it as the display values for all cells and mark every cell read-only. This keeps solve/hint logic out of the board component.
  - In `SudokuGame`, add a `solvedByButton` state (boolean, default `false`). `handleSolve` sets `solvedByButton = true` and immediately calls `handleComplete()`.
  - Pass `overrideGrid={solvedByButton ? solution : null}` to `SudokuBoard`.
  - Reset `solvedByButton` to `false` in `fetchPuzzle` so a new puzzle starts fresh.
- **Constraints**: Do not modify the sudoku engine or API. Keep solve logic in `SudokuGame`, not in `SudokuBoard`.

## Test Requirements

### Unit Tests
- Location: `packages/frontend/src/__tests__/SudokuGame.test.js`
- Must verify:
  - The "Solve" button is not visible on initial render (idle state).
  - The "Solve" button is visible while a puzzle is in play.
  - Clicking "Solve" causes the success message to appear (i.e. `handleComplete` is triggered).
- Location: `packages/frontend/src/__tests__/SudokuBoard.test.js`
- Must verify:
  - When `overrideGrid` is provided, all cells display the override values.
  - When `overrideGrid` is provided, all cells are read-only (no `onChange` handler).

### Integration Tests
- Location: `packages/backend/__tests__/integration/`
- Must verify: N/A — this feature is entirely frontend; no backend changes are involved.

### E2E Tests
- Location: `tests/e2e/`
- Must verify: Starting a game, clicking "Solve", and confirming the success screen is shown.
