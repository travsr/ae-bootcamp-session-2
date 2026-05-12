---
id: TICKET-004
title: Sudoku Board Component
created: 2026-05-12
dependencies: []
---

## Description

Create an interactive React component that renders a 9×9 sudoku grid. The component receives a `puzzle` (the unsolved grid with clues) and a `solution` (the fully solved grid) as props. It uses `solution` for real-time frontend validation — highlighting cells where the user's input is incorrect — and to detect when the puzzle has been completed successfully.

## Acceptance Criteria

- [ ] The board renders 81 cells in a 9×9 grid layout.
- [ ] Clue cells (non-zero values in `puzzle`) render as read-only inputs displaying the clue digit; they cannot be edited by the user.
- [ ] Empty cells (zero values in `puzzle`) render as editable text inputs that accept only a single digit 1–9; non-digit input is ignored.
- [ ] When a user enters a digit that does not match `solution[row][col]`, that cell receives an error style (red border).
- [ ] When a user enters a digit that matches `solution[row][col]`, the error style is absent from that cell.
- [ ] When every empty cell has been correctly filled (all user values match `solution`), the `onComplete` prop is called.
- [ ] 3×3 box boundaries are visually distinct from inner cell borders (thicker borders on every 3rd row/column edge).
- [ ] The component is exported as the default export from its file.

## Technical Implementation Notes

- **Files likely affected**:
  - `packages/frontend/src/components/SudokuBoard.js` (create new)
  - `packages/frontend/src/App.css` (add sudoku grid styles)
- **Props**:
  - `puzzle` — 9×9 2D array; `0` = empty cell, `1–9` = clue
  - `solution` — 9×9 2D array; fully solved grid used for validation
  - `onComplete` — callback called with no arguments when the puzzle is solved
- **Internal state**: `userGrid` — a 9×9 2D array initialised as a copy of `puzzle`; updated as the user types; initialise with `useState` and reset when `puzzle` prop changes (use `useEffect` with `puzzle` as a dependency)
- **Validation**: on each input change, compare the entered value against `solution[row][col]`; update `userGrid`; after updating, check if every cell in `userGrid` matches `solution` — if so, call `onComplete`
- **CSS classes**:
  - `.sudoku-board` — CSS grid, 9 columns of equal width
  - `.sudoku-cell` — base cell: fixed 48×48px, centered text, 1px border
  - `.sudoku-cell--clue` — bold text, grey background (`#eee`), `cursor: default`
  - `.sudoku-cell--error` — red border (`2px solid red`)
  - Apply thicker right/bottom borders using `:nth-child` selectors or inline styles to delineate 3×3 boxes
- **Constraints**: no API calls inside this component; all data comes via props

## Test Requirements

### Unit Tests
- Location: `packages/frontend/src/__tests__/SudokuBoard.test.js`
- Must verify:
  - Given a known `puzzle` and `solution`, clue cells are rendered as read-only inputs with the correct value
  - Empty cells are rendered as editable inputs
  - Typing a digit that does not match the solution applies the error CSS class to that cell
  - Typing the correct digit removes (or does not add) the error CSS class
  - `onComplete` is called when all empty cells are filled with their correct solution values
  - `onComplete` is not called when the board has incorrect values

### Integration Tests
- Location: `packages/backend/__tests__/integration/`
- Must verify: N/A — frontend-only component; no backend integration

### E2E Tests
- Location: `tests/e2e/`
- Must verify: N/A — board interaction is covered as part of the full user journey in TICKET-006
