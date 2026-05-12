---
id: TICKET-005
title: Sudoku Game Orchestration and App Integration
created: 2026-05-12
dependencies: [TICKET-002, TICKET-003, TICKET-004]
---

## Description

Create a `SudokuGame` component that wires together the difficulty selector, the API fetch, and the sudoku board into a complete playable experience. Update `App.js` to render `SudokuGame` in place of the existing static content. This ticket is the final assembly step that makes the feature usable end-to-end in the browser.

## Acceptance Criteria

- [ ] On initial load the user sees the difficulty selector and a prompt to choose a difficulty; no board is shown.
- [ ] Selecting a difficulty triggers a fetch to `GET /api/sudoku?difficulty=<selection>` and displays a loading indicator while the request is in flight.
- [ ] After a successful fetch the board renders with the returned `puzzle` and `solution`.
- [ ] The currently selected difficulty button appears active (via the `selected` prop on `DifficultySelector`).
- [ ] Selecting a different difficulty while a game is in progress fetches a new puzzle and resets the board.
- [ ] When the board calls `onComplete`, the board is hidden and a success message is displayed along with a "Play Again" button.
- [ ] Clicking "Play Again" re-fetches a new puzzle with the same difficulty and returns to the playing state.
- [ ] If the API fetch fails, an error message is displayed to the user.
- [ ] `App.js` renders `<SudokuGame />` as its main content beneath the existing header.
- [ ] Existing App.css header styles are preserved; new game-related styles do not break the existing layout.

## Technical Implementation Notes

- **Files likely affected**:
  - `packages/frontend/src/components/SudokuGame.js` (create new)
  - `packages/frontend/src/App.js` (modify — replace static `<main>` content with `<SudokuGame />`)
  - `packages/frontend/src/App.css` (add `.loading`, `.error`, `.success-message`, `.play-again` styles as needed)
- **State in `SudokuGame`**:
  - `difficulty` (string | null) — currently selected difficulty
  - `gameState` (`'idle' | 'loading' | 'playing' | 'complete'`) — drives what is rendered
  - `puzzle` (2D array | null)
  - `solution` (2D array | null)
  - `error` (string | null)
- **API call**: use `axios` (already installed) to call `GET /api/sudoku?difficulty=<difficulty>`; the frontend proxy in `package.json` forwards `/api/*` to `http://localhost:3030`
- **Component composition**:
  - Always render `<DifficultySelector selected={difficulty} onSelect={handleDifficultySelect} />`
  - Render a loading spinner/text when `gameState === 'loading'`
  - Render `<SudokuBoard puzzle={puzzle} solution={solution} onComplete={handleComplete} />` when `gameState === 'playing'`
  - Render success message and "Play Again" button when `gameState === 'complete'`
  - Render error message when `error` is set
- **Constraints**: do not move API logic into the board or selector components; keep fetch logic in `SudokuGame`

## Test Requirements

### Unit Tests
- Location: `packages/frontend/src/__tests__/SudokuGame.test.js`
- Must verify:
  - On mount, only the difficulty selector is shown (no board, no loading indicator)
  - Clicking a difficulty button triggers an API call with the correct difficulty param
  - While the API call is pending, a loading indicator is visible
  - After a successful API response, the board is rendered and the loading indicator is gone
  - After the board calls `onComplete`, the success message and "Play Again" button are shown
  - Clicking "Play Again" triggers a new API call and returns to the playing state
  - When the API returns an error, an error message is displayed
- Update `packages/frontend/src/__tests__/App.test.js` to remove stale assertions about the old static welcome section content

### Integration Tests
- Location: `packages/backend/__tests__/integration/`
- Must verify: N/A — the integration between frontend and backend is covered by TICKET-002's integration tests and by TICKET-006's E2E tests

### E2E Tests
- Location: `tests/e2e/`
- Must verify: N/A — full user journey E2E coverage is provided by TICKET-006
