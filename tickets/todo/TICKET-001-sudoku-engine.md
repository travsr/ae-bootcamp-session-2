---
id: TICKET-001
title: Sudoku Engine (Backend Logic)
created: 2026-05-12
dependencies: []
---

## Description

Create a self-contained sudoku engine module at `packages/backend/src/sudoku.js`. This module provides all generation and solving logic used by the API layer. It must be able to produce a fully solved grid, remove cells according to a target difficulty while preserving uniqueness, and verify that a puzzle has exactly one solution.

## Acceptance Criteria

- [ ] `generateSolvedGrid()` returns a valid 9×9 2D array where every row, column, and 3×3 box contains the digits 1–9 exactly once.
- [ ] `generatePuzzle('easy')` returns `{ puzzle, solution }` where `puzzle` has approximately 36 clue cells (non-zero values) and `solution` is the complete solved grid.
- [ ] `generatePuzzle('medium')` returns `{ puzzle, solution }` where `puzzle` has approximately 30 clue cells.
- [ ] `generatePuzzle('hard')` returns `{ puzzle, solution }` where `puzzle` has approximately 24 clue cells.
- [ ] Every generated puzzle has exactly one solution (verified by `countSolutions` returning 1).
- [ ] `solution` in the returned object is a valid, fully solved 9×9 grid matching the clues present in `puzzle`.

## Technical Implementation Notes

- **Files likely affected**: `packages/backend/src/sudoku.js` (create new)
- **Exports required**:
  - `isValid(grid, row, col, num)` — returns `true` if placing `num` at `[row][col]` does not violate row, column, or 3×3 box constraints
  - `generateSolvedGrid()` — randomized backtracking: shuffle `[1..9]` before trying each cell to ensure variety
  - `countSolutions(grid, limit)` — run a backtracking solver but stop and return as soon as `limit` solutions have been found; call with `limit=2` to cheaply check uniqueness
  - `removeCells(solvedGrid, difficulty)` — clone the solved grid, iterate cells in random order, tentatively set each to 0, call `countSolutions(tentative, 2)`; if result > 1 restore the cell; stop when target clue count is reached
  - `generatePuzzle(difficulty)` — calls `generateSolvedGrid()` then `removeCells()`, returns `{ puzzle, solution }` where both are 9×9 2D arrays and 0 represents an empty cell
- **Clue targets**: easy = 36, medium = 30, hard = 24 (±2 tolerance acceptable)
- **Constraints**: no external sudoku libraries; pure JS only; no database access in this module
- **Performance guard**: `removeCells` must include a max-iteration limit (e.g. 150 attempts) so the function cannot loop indefinitely on pathological inputs; if the limit is reached, return the puzzle in its current state even if the exact clue-count target has not been met

## Test Requirements

### Unit Tests
- Location: `packages/backend/__tests__/sudoku.test.js`
- Must verify:
  - `isValid` returns `false` when a duplicate exists in the same row, column, or box
  - `isValid` returns `true` for a valid placement
  - `generateSolvedGrid` returns a 9×9 array where every row, column, and 3×3 box contains digits 1–9 exactly once
  - `generatePuzzle('easy')` clue count is within the expected range (34–38)
  - `generatePuzzle('medium')` clue count is within the expected range (28–32)
  - `generatePuzzle('hard')` clue count is within the expected range (22–26)
  - `generatePuzzle` returned `solution` is a fully solved valid grid
  - `countSolutions` returns 1 for a known uniquely-solvable puzzle

### Integration Tests
- Location: `packages/backend/__tests__/integration/`
- Must verify: N/A — this module contains no HTTP or database logic; integration coverage is provided by TICKET-002

### E2E Tests
- Location: `tests/e2e/`
- Must verify: N/A — pure logic module; E2E coverage is provided by TICKET-006
