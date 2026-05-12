# Sudoku Generator + Playable Game — Plan

## Overview

The backend exposes a `GET /api/sudoku?difficulty=easy|medium|hard` endpoint that generates and returns a puzzle + solution. The frontend renders a difficulty picker, fetches the puzzle, and displays an interactive 9x9 grid of `<input>` fields for the user to solve.

---

## Phase 1: Backend — Sudoku Engine

### Step 1 — Create `packages/backend/src/sudoku.js`

Core logic with these exports:

- `isValid(grid, row, col, num)` — checks row, col, and 3×3 box constraints
- `generateSolvedGrid()` — randomized backtracking (shuffles digits 1–9 before each attempt) to produce a complete valid grid
- `countSolutions(grid, limit)` — solver that stops at `limit` solutions; used for uniqueness checking
- `removeCells(solvedGrid, difficulty)` — removes cells one at a time randomly, restoring each if uniqueness breaks; targets:
  - Easy: ~36 clues (45 removed)
  - Medium: ~30 clues (51 removed)
  - Hard: ~24 clues (57 removed)
- `generatePuzzle(difficulty)` — orchestrates the above, returns `{ puzzle, solution }` as 9×9 2D arrays (0 = empty)

### Step 2 — Add endpoint to `packages/backend/src/app.js`

- `GET /api/sudoku?difficulty=easy|medium|hard`
- Validates difficulty, defaults to `medium` if missing/invalid
- Returns `{ puzzle, solution, difficulty }`

### Step 3 — Backend tests

- `packages/backend/__tests__/sudoku.test.js` — unit tests: grid validity, clue count per difficulty, uniqueness of generated puzzles
- `packages/backend/__tests__/app.test.js` — add tests for the new endpoint (valid/invalid difficulty, response shape)

---

## Phase 2: Frontend — Game UI

### Step 4 — Create `packages/frontend/src/components/DifficultySelector.js`

- 3 buttons: Easy, Medium, Hard
- Props: `onSelect(difficulty)`, highlights active selection

### Step 5 — Create `packages/frontend/src/components/SudokuBoard.js`

- Props: `puzzle`, `solution`, `onComplete`
- Internal state: `userGrid` (initialized from puzzle, 0s are editable)
- Clue cells: read-only `<input>`, bold, grey background
- Empty cells: editable `<input type="text" maxLength="1">`, digits 1–9 only
- Errors: red border when user value ≠ `solution[row][col]`
- Win condition: when `userGrid` fully matches solution, call `onComplete(true)`
- CSS Grid layout with thick borders on 3×3 box boundaries

### Step 6 — Create `packages/frontend/src/components/SudokuGame.js`

- States: `idle | loading | playing | complete`
- On difficulty select → fetch `/api/sudoku?difficulty=...` via axios → render board
- On complete → show success message + "Play again" button (re-fetches same difficulty)
- Difficulty selector always visible (switching mid-game re-fetches a new puzzle)

### Step 7 — Update `packages/frontend/src/App.js`

Replace static content with `<SudokuGame />`, keep the existing header title.

### Step 8 — Update `packages/frontend/src/App.css`

Add: `.sudoku-board` (CSS grid), `.sudoku-cell` (48×48px), `.sudoku-cell--clue`, `.sudoku-cell--error`, thick borders on 3×3 box edges, `.difficulty-selector`.

### Step 9 — Frontend tests

- Create `packages/frontend/src/__tests__/SudokuBoard.test.js` — render with known fixture, assert clue cells are read-only, valid input removes error style, completing board calls `onComplete`
- Update `packages/frontend/src/__tests__/App.test.js` — remove stale "welcome section" assertions

---

## Relevant Files

| Action | File |
|--------|------|
| Create | `packages/backend/src/sudoku.js` |
| Create | `packages/backend/__tests__/sudoku.test.js` |
| Create | `packages/frontend/src/components/DifficultySelector.js` |
| Create | `packages/frontend/src/components/SudokuBoard.js` |
| Create | `packages/frontend/src/components/SudokuGame.js` |
| Create | `packages/frontend/src/__tests__/SudokuBoard.test.js` |
| Modify | `packages/backend/src/app.js` |
| Modify | `packages/backend/__tests__/app.test.js` |
| Modify | `packages/frontend/src/App.js` |
| Modify | `packages/frontend/src/App.css` |
| Modify | `packages/frontend/src/__tests__/App.test.js` |

---

## Verification

1. `npm test --workspace=packages/backend` — all unit + endpoint tests pass
2. `npm test --workspace=packages/frontend` — all component tests pass
3. Manual: select Hard → ~24 pre-filled read-only clues appear
4. Manual: enter a wrong digit → red border appears on that cell
5. Manual: complete the board correctly → success message + "Play again" shown
6. Manual: switch difficulty mid-game → board resets with a new puzzle

---

## Out of Scope

- Persistence / resume after page reload
- Timer, score, or hint system
- Undo/redo
- Mobile-specific touch optimizations
