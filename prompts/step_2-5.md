## Instructions

Using the context and standards documented in `.github/copilot-instructions.md` and the `docs/` directory, expand the TODO task-tracking app to meet the full functional requirements.

Before writing any code, produce an **implementation plan** that outlines:
1. What backend API changes are needed (new routes, updated data model)
2. What frontend components need to be created or updated
3. What tests will be added at each layer (unit, integration, E2E)

Wait for approval of the plan before proceeding with implementation.

---

### Context to follow

All implementation must conform to the documented standards:

- **Functional requirements**: `docs/functional-requirements.md`
- **UI guidelines**: `docs/ui-guidelines.md`
- **Coding guidelines**: `docs/coding-guidelines.md`
- **Testing guidelines**: `docs/testing-guidelines.md`
- **Project overview / architecture**: `docs/project-overview.md`

---

### Feature requirements

Expand the app so that tasks support the following fields in addition to the existing title:
- **Due Date** — a date indicating when the task should be completed
- **Category** — a single category to classify the task
- **Custom Tags** — one or more user-defined tags
- **Priority** — high, medium, or low
- **Description** — freeform text for additional notes

The app must also support:
- **Editing** any field of an existing task
- **Sorting** the task list by due date, priority, or category
- **Filtering** the task list by category, tag, priority, or completion status
- **Completion status** — users can mark a task as done without deleting it; completed tasks remain visible with a visual distinction (strikethrough + muted color)

---

### UI requirements

- Use **Material UI (MUI)** components throughout — no raw HTML elements or other UI libraries where an MUI equivalent exists
- Follow the color palette defined in `docs/ui-guidelines.md` (primary: Indigo `#3F51B5`, secondary: Teal `#009688`, priority colors, etc.)
- Use **inline editing** for existing tasks where possible; use a MUI `<Dialog>` for creating a new task
- Completed tasks must show both `text-decoration: line-through` and muted grey color (`text.disabled`)
- Layout must be responsive: single-column on mobile, centered `maxWidth="md"` container on desktop

---

### Testing requirements

Add tests at all three layers:

1. **Unit tests** (Jest) — backend logic and React components in isolation
   - Backend: `packages/backend/__tests__/`
   - Frontend: `packages/frontend/src/__tests__/`

2. **Integration tests** (Jest + Supertest) — all new/updated API endpoints
   - Location: `packages/backend/__tests__/integration/`
   - File name: `todos-api.test.js`

3. **End-to-End tests** (Playwright, Page Object Model, one browser only) — 5–8 tests covering critical user journeys
   - Location: `tests/e2e/`
   - File name: `todo-workflow.spec.js`

All tests must be isolated and independent, with setup/teardown hooks so they pass on repeated runs.

---

### Coding standards

- 2-space indentation, single quotes, semicolons, trailing commas, max 100-character line length
- `camelCase` for variables/functions, `PascalCase` for React components, `kebab-case` for file names
- `async/await` for all asynchronous code
- Named constants instead of hardcoded strings/numbers
- All code must pass `npx biome check .` before committing
