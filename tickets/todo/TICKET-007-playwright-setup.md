---
id: TICKET-007
title: Playwright E2E Test Infrastructure Setup
created: 2026-05-12
dependencies: []
---

## Description

Set up the Playwright configuration and folder structure required for E2E tests to run. Without this, `npm run test:e2e` has no config to read and TICKET-006 cannot be implemented. This is a one-time infrastructure task that is a prerequisite for all E2E tests in the project.

## Acceptance Criteria

- [ ] A `playwright.config.js` file exists at the root of the workspace.
- [ ] The config sets `baseURL` to `http://localhost:3000` (the React dev server).
- [ ] The config specifies exactly one browser (Chromium).
- [ ] The config points to `tests/e2e/` as the test directory.
- [ ] The config sets a reasonable `timeout` (e.g. 30000ms) and `expect` timeout.
- [ ] The `tests/e2e/` and `tests/e2e/pages/` directories exist (with `.gitkeep` files if empty).
- [ ] `npm run test:e2e` at the workspace root runs Playwright and exits without a configuration error (it may find no tests yet — that is acceptable).
- [ ] `@playwright/test` is confirmed as a dependency in the root `package.json`; install it if missing.

## Technical Implementation Notes

- **Files likely affected**:
  - `playwright.config.js` (create at workspace root)
  - `tests/e2e/.gitkeep` (ensure directory exists)
  - `tests/e2e/pages/.gitkeep` (ensure pages directory exists for POM classes)
  - `package.json` (root) — confirm `test:e2e` script runs `playwright test` and `@playwright/test` is listed as a dev dependency
- **Playwright config pattern**:
  ```js
  import { defineConfig } from '@playwright/test';
  export default defineConfig({
    testDir: './tests/e2e',
    timeout: 30000,
    expect: { timeout: 5000 },
    use: { baseURL: 'http://localhost:3000', headless: true },
    projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
  });
  ```
  Use CommonJS (`require`/`module.exports`) if the root package is not ESM.
- **Constraints**: do not configure multiple browsers; do not add `webServer` to the config (the dev servers are started separately before running E2E tests); keep config minimal

## Test Requirements

### Unit Tests
- Location: N/A — infrastructure configuration, no unit tests applicable

### Integration Tests
- Location: N/A — infrastructure configuration only

### E2E Tests
- Location: `tests/e2e/`
- Must verify: Running `npx playwright test` (or `npm run test:e2e`) completes without a "No config file found" or "Cannot find module" error. Actual test coverage is provided by TICKET-006.
