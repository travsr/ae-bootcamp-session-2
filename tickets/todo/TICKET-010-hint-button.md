---
id: TICKET-010
title: Hint Button
created: 2026-05-12
dependencies: [TICKET-009]
---

## Description

Add a "Hint" button to the sudoku game that, when clicked, reveals the correct value for one randomly chosen empty cell. This gives players a nudge without fully solving the puzzle. The board state mechanism introduced in TICKET-009 (`overrideGrid` prop) is extended to support single-cell reveals tracked in `SudokuGame`.

## Acceptance Criteria

- [ ] A "Hint" button is rendered below the board while `gameState === 'playing'`.
- [ ] Clicking "Hint" selects a random cell that is currently empty (value `0` in the user's grid) and fills it with the correct value from `solution`.
- [ ] The revealed cell is treated as a clue cell: it is read-only and styled identically to original clue cells (`sudoku-cell--clue`).
- [ ] If all cells are already filled, clicking "Hint" has no visible effect (the button may remain visible but does nothing).
- [ ] Multiple hints may be used per puzzle; each click reveals one additional empty cell.
- [ ] The hint state resets when a new puzzle is fetched (difficulty change or "Play Again").
- [ ] The "Hint" button is not visible when `gameState` is `'idle'`, `'loading'`, or `'complete'`.

## Technical Implementation Notes

- **Files likely affected**:
  - `packages/frontend/src/components/SudokuGame.js` (add `hintCells` state — a `Set` of `"row-col"` strings; add `handleHint` function)
  - `packages/frontend/src/components/SudokuBoard.js` (accept `hintCells` prop — a `Set<string>`; cells whose key is in `hintCells` are treated as read-only clue cells displaying the solution value)
  - `packages/frontend/src/App.css` (no new styles required — hint cells reuse `.sudoku-cell--clue`)
- **Approach**:
  - In `SudokuGame`, add `hintCells` state (a `Set`, default empty). `handleHint`:
    1. Collect all `[row, col]` pairs where `userGrid[row][col] === 0` and the key is not already in `hintCells`.
    2. Pick one at random.
    3. Add `"${row}-${col}"` to a new `Set` and call `setHintCells`.
  - `SudokuGame` needs access to the current `userGrid`. Either lift `userGrid` state up from `SudokuBoard` into `SudokuGame` (preferred, since TICKET-009 may already require reading the grid), or pass a `onGridChange` callback down.
  - In `SudokuBoard`, treat any cell whose `"${row}-${col}"` key is in `hintCells` exactly like an original clue cell (read-only, shows `solution[row][col]`, has `sudoku-cell--clue` class).
  - Reset `hintCells` to an empty `Set` inside `fetchPuzzle`.
- **Constraints**: Do not re-implement solve logic; `hintCells` and `overrideGrid` (from TICKET-009) are independent mechanisms — both must coexist without conflict. Keep hint selection logic in `SudokuGame`, not `SudokuBoard`.

## Test Requirements

### Unit Tests
- Location: `packages/frontend/src/__tests__/SudokuGame.test.js`
- Must verify:
  - The "Hint" button is not visible on initial render (idle state).
  - The "Hint" button is visible while a puzzle is in play.
  - Clicking "Hint" causes exactly one previously-empty cell to display the correct solution value.
  - Clicking "Hint" a second time reveals a second distinct cell.
  - Hint state is cleared when a new puzzle is fetched.
- Location: `packages/frontend/src/__tests__/SudokuBoard.test.js`
- Must verify:
  - A cell whose key appears in `hintCells` is rendered read-only with the `sudoku-cell--clue` class and the solution value.

### Integration Tests
- Location: `packages/backend/__tests__/integration/`
- Must verify: N/A — this feature is entirely frontend; no backend changes are involved.

### E2E Tests
- Location: `tests/e2e/`
- Must verify: Starting a game and clicking "Hint" causes exactly one empty cell to become filled and read-only.
