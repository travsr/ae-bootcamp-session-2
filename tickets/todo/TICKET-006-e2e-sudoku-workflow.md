---
id: TICKET-006
title: E2E Tests — Sudoku Game Workflow
created: 2026-05-12
dependencies: [TICKET-005, TICKET-007]
---

## Description

Write Playwright end-to-end tests covering the critical user journeys of the sudoku feature. These tests run against the full stack (frontend + backend both running) and verify that the complete experience works correctly in a real browser. Tests must follow the Page Object Model pattern and be independent of one another.

## Acceptance Criteria

- [ ] A `SudokuPage` Page Object Model class is defined and used by all tests.
- [ ] A test verifies that the difficulty selector is visible on initial load and no board is shown.
- [ ] A test verifies that selecting "Easy" fetches and displays a 9×9 board.
- [ ] A test verifies that selecting "Medium" fetches and displays a 9×9 board.
- [ ] A test verifies that selecting "Hard" fetches and displays a 9×9 board.
- [ ] A test verifies that clue cells are read-only (cannot be typed into).
- [ ] A test verifies that switching difficulty mid-game resets the board to a new puzzle.
- [ ] All tests pass when both the frontend and backend dev servers are running.
- [ ] The test file contains no more than 8 tests total, focusing on quality over quantity.

## Technical Implementation Notes

- **Files likely affected**:
  - `tests/e2e/sudoku-workflow.spec.js` (create new — the spec file)
  - `tests/e2e/pages/SudokuPage.js` (create new — the Page Object Model class)
- **POM class `SudokuPage` should encapsulate**:
  - Locators for: difficulty buttons, the sudoku grid, individual cells (clue vs. editable), loading indicator, success message, "Play Again" button
  - Methods such as: `selectDifficulty(difficulty)`, `getCell(row, col)`, `getBoardCells()`, `waitForBoard()`, `waitForSuccess()`
- **Test approach**:
  - Use `page.waitForSelector` or `expect(locator).toBeVisible()` to wait for async state transitions (loading → playing)
  - Do not attempt to complete a full puzzle in E2E tests — this would be brittle and slow; focus on structural/interaction assertions instead
  - Each test must be independent: use `beforeEach` to navigate to the app URL
- **Constraints**:
  - Use Playwright only (no other E2E frameworks)
  - Test with one browser only (as per project conventions)
  - Follow the POM pattern — no raw `page.click` or `page.locator` calls directly in test bodies
  - Limit to 5–8 tests

## Test Requirements

### Unit Tests
- Location: N/A — E2E tests are not unit tests

### Integration Tests
- Location: N/A — E2E tests cover the full stack

### E2E Tests
- Location: `tests/e2e/sudoku-workflow.spec.js`
- Must verify:
  1. Initial page load shows difficulty selector, no board visible
  2. Selecting "Easy" causes the board to appear with 81 cells
  3. Selecting "Medium" causes the board to appear with 81 cells
  4. Selecting "Hard" causes the board to appear with 81 cells
  5. Clue cells on the board are read-only inputs
  6. Editable cells accept digit input
  7. Switching difficulty resets the board (board re-renders with a different puzzle)
