---
id: TICKET-008
title: Game Timer
created: 2026-05-12
dependencies: [TICKET-005]
---

## Description

Add an elapsed-time timer to the sudoku game that starts counting upward when a new puzzle begins loading and stops when the puzzle is solved. The timer is displayed above the board during play, giving the player a sense of how long they've been working on the current puzzle.

## Acceptance Criteria

- [ ] When a new puzzle starts loading, the timer resets to 0 and begins counting upward in whole seconds (e.g. `0:00`, `0:01`, … `1:00`, `1:01`).
- [ ] The timer is visible while `gameState === 'playing'` and is displayed in `MM:SS` format.
- [ ] The timer stops (stops incrementing) when `gameState === 'complete'`.
- [ ] The timer resets to `0:00` whenever a new puzzle is fetched (difficulty change or "Play Again").
- [ ] The timer is not shown when `gameState` is `'idle'`, `'loading'`, or `'complete'`.

## Technical Implementation Notes

- **Files likely affected**:
  - `packages/frontend/src/components/SudokuGame.js` (add timer state and `useEffect` with `setInterval`)
  - `packages/frontend/src/App.css` (add `.timer` style)
- **Pattern**: Add a `elapsed` state (integer seconds) initialised to `0`. Use a `useEffect` that starts a `setInterval` (1000 ms) when `gameState === 'playing'` and clears it via the cleanup function when the state changes. Reset `elapsed` to `0` inside `fetchPuzzle` before the API call.
- **Display**: Render `<p className="timer">{formatTime(elapsed)}</p>` inside the `gameState === 'playing'` block in the JSX. `formatTime` converts seconds to `M:SS` (e.g. `formatTime(75)` → `"1:15"`).
- **Constraints**: Do not introduce any third-party timer library; use native `setInterval`/`clearInterval` only.

## Test Requirements

### Unit Tests
- Location: `packages/frontend/src/__tests__/SudokuGame.test.js`
- Must verify:
  - Timer is not visible on initial render (idle state).
  - Timer shows `0:00` immediately after a puzzle loads successfully.
  - After simulating time passage (use Jest fake timers / `act` + `advanceTimersByTime`), the displayed time increments correctly.
  - Timer is not rendered when `gameState === 'complete'`.
  - Fetching a new puzzle resets the timer to `0:00`.

### Integration Tests
- Location: `packages/backend/__tests__/integration/`
- Must verify: N/A — this feature is entirely frontend state/UI; no backend changes are involved.

### E2E Tests
- Location: `tests/e2e/`
- Must verify: N/A — timer logic is covered by unit tests; adding an E2E assertion for elapsed seconds would be flaky and non-deterministic.
