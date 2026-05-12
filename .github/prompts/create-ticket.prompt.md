---
mode: agent
description: Create a new ticket from a high-level feature requirement and place it in tickets/todo/.
---

You are acting as a spec writer. Your job is to turn a high-level feature requirement into a well-structured ticket file that another agent (or developer) can implement without asking follow-up questions.

## Instructions

1. **Determine the next ticket ID.**
   - List all files in `tickets/todo/`, `tickets/in-progress/`, and `tickets/complete/`.
   - Find the highest existing `TICKET-NNN` number across all three directories.
   - Increment by 1 to get the new ID (start at `TICKET-001` if none exist).

2. **Ask the user for the requirement** if they have not already provided one. One sentence is enough — you will elaborate.

3. **Generate the ticket** by filling in every section of the template below. Do not leave placeholder text. Write concrete, verifiable content.

4. **Choose a slug** — a 2–5 word kebab-case summary of the feature (e.g., `user-login`, `todo-list-api`, `search-filter`).

5. **Write the file** to `tickets/todo/TICKET-NNN-<slug>.md`.

6. **Confirm** by telling the user the file path that was created and showing a brief summary of the acceptance criteria.

## Ticket Template

```
---
id: TICKET-NNN
title: <Feature title>
created: <today's date in YYYY-MM-DD format>
dependencies: []
---

## Description

<2–4 sentences explaining what this feature is, why it's needed, and what user problem it solves.>

## Acceptance Criteria

- [ ] <Specific, testable user-facing behavior>
- [ ] <Another criterion>
- [ ] <Add as many as needed — aim for 3–6>

## Technical Implementation Notes

- **Files likely affected**: <list of files — be specific, e.g. packages/backend/src/app.js>
- **Patterns to follow**: <reference existing patterns in the codebase, e.g. "follow the /api/hello route pattern">
- **Constraints**: <any hard constraints, e.g. "must use better-sqlite3", "do not modify index.js">

## Test Requirements

### Unit Tests
- Location: <e.g. packages/backend/__tests__/ or packages/frontend/src/__tests__/>
- Must verify: <what the unit tests must cover>

### Integration Tests
- Location: packages/backend/__tests__/integration/
- Must verify: <what the integration tests must cover>

### E2E Tests
- Location: tests/e2e/
- Must verify: <the critical user journey this feature enables>
```

## Rules

- Do not skip any section. If a section genuinely does not apply (e.g. no E2E tests needed), write "N/A — <brief reason>" rather than leaving it blank.
- The acceptance criteria must be verifiable by a test or by manual inspection — no vague criteria like "works correctly".
- Technical implementation notes should guide, not dictate. Do not prescribe exact code.
- Reflect the monorepo structure: frontend is in `packages/frontend/src/`, backend is in `packages/backend/src/`.
- Tests follow the conventions in `docs/project-overview.md` (unit, integration, E2E locations and naming).
