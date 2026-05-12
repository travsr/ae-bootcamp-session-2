---
id: TICKET-002
title: Sudoku API Endpoint
created: 2026-05-12
dependencies: [TICKET-001]
---

## Description

Add a `GET /api/sudoku` Express endpoint to the backend that accepts a `difficulty` query parameter and returns both an unsolved puzzle and its complete solution. The frontend depends on receiving the solution alongside the puzzle in order to perform real-time validation during gameplay without a second round-trip to the server.

## Acceptance Criteria

- [ ] `GET /api/sudoku?difficulty=easy` returns HTTP 200 with a JSON body containing `puzzle`, `solution`, and `difficulty` fields.
- [ ] `GET /api/sudoku?difficulty=medium` and `GET /api/sudoku?difficulty=hard` both return HTTP 200 with the same response shape.
- [ ] `puzzle` in the response is a 9×9 2D array where empty cells are represented as `0`.
- [ ] `solution` in the response is a fully solved 9×9 2D array with no zeros.
- [ ] `GET /api/sudoku` with a missing or unrecognised `difficulty` value defaults to `medium` and returns HTTP 200.
- [ ] The `difficulty` field in the response reflects the difficulty that was actually used (i.e. `"medium"` when defaulted).

## Technical Implementation Notes

- **Files likely affected**: `packages/backend/src/app.js` (add new route)
- **Patterns to follow**: follow the existing route pattern in `packages/backend/src/app.js` (e.g. `/api/hello`, `/api/status`)
- **Implementation**: import `generatePuzzle` from `./sudoku`, validate the `difficulty` query param against the set `['easy', 'medium', 'hard']`, default to `'medium'` if invalid or absent, call `generatePuzzle(difficulty)`, return `{ puzzle, solution, difficulty }`
- **Constraints**: do not modify `index.js`; keep all route logic in `app.js`

## Test Requirements

### Unit Tests
- Location: `packages/backend/__tests__/app.test.js`
- Must verify:
  - `GET /api/sudoku?difficulty=easy` returns 200 and a body with `puzzle`, `solution`, and `difficulty` fields
  - `GET /api/sudoku?difficulty=medium` returns 200 with correct shape
  - `GET /api/sudoku?difficulty=hard` returns 200 with correct shape
  - `GET /api/sudoku` (no difficulty param) returns 200 with `difficulty: 'medium'`
  - `GET /api/sudoku?difficulty=invalid` returns 200 with `difficulty: 'medium'`
  - `puzzle` in the response is a 9×9 nested array
  - `solution` in the response is a 9×9 nested array with no zero values

### Integration Tests
- Location: `packages/backend/__tests__/integration/sudoku-api.test.js`
- Must verify:
  - Full HTTP request/response cycle for each valid difficulty returns correct structure
  - Invalid difficulty query param results in a `medium` difficulty response
  - `solution` cells are non-zero for all positions
  - Clue cells in `puzzle` match those same positions in `solution`

### E2E Tests
- Location: `tests/e2e/`
- Must verify: N/A — API-level coverage is complete via integration tests; E2E coverage of the resulting gameplay is provided by TICKET-006
