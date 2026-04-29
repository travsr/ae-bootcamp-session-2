## Instructions

Create a new file at `docs/testing-guidelines.md` that documents the testing guidelines for our TODO task-tracking app.

The app is a full-stack JavaScript application with a React frontend (`packages/frontend/`) and a Node.js/Express backend (`packages/backend/`). Refer to `docs/project-overview.md` for the full architecture and tech stack.

The testing guidelines should cover the following:

### Unit Tests
- Use **Jest** to test individual functions and React components in isolation
- File naming convention: `*.test.js` or `*.test.ts`
- Backend unit tests location: `packages/backend/__tests__/`
- Frontend unit tests location: `packages/frontend/src/__tests__/`
- Name test files to match what they're testing (e.g., `app.test.js` for testing `app.js`)

### Integration Tests
- Use **Jest + Supertest** to test backend API endpoints with real HTTP requests
- File naming convention: `*.test.js` or `*.test.ts`
- Location: `packages/backend/__tests__/integration/`
- Name integration test files intelligently based on what they test (e.g., `todos-api.test.js` for TODO API endpoints)

### End-to-End (E2E) Tests
- Use **Playwright** (required framework — no alternatives) to test complete UI workflows through browser automation
- File naming convention: `*.spec.js` or `*.spec.ts`
- Location: `tests/e2e/`
- Name E2E test files based on the user journey they test (e.g., `todo-workflow.spec.js`)
- Playwright tests must target **one browser only**
- Playwright tests must use the **Page Object Model (POM)** pattern for maintainability
- Limit to **5–8 E2E tests** covering critical user journeys — focus on happy paths and key edge cases, not exhaustive coverage

### Port Configuration
- Always use environment variables with sensible defaults for port configuration
  - Backend: `const PORT = process.env.PORT || 3030;`
  - Frontend: React's default port is 3000, but can be overridden with the `PORT` environment variable
- This allows CI/CD workflows to dynamically detect ports

### General Principles
- **All tests must be isolated and independent** — each test should set up its own data and not rely on other tests
- **Setup and teardown hooks are required** — tests must succeed on repeated runs without manual cleanup
- All new features should include appropriate tests at the relevant level (unit, integration, or E2E)
- Tests should be maintainable and follow best practices

---

When finished, update `.github/copilot-instructions.md` to add a reference to `docs/testing-guidelines.md` in the Documentation Overview section, following the same format as the existing entries.
