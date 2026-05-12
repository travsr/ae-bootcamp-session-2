# Project Overview

## Introduction

This project is a full-stack JavaScript application designed as a starter template for the Copilot Bootcamp by Slalom. It consists of a React frontend and a Node.js/Express backend, organized in a monorepo structure using npm workspaces.

## Architecture

The project follows a monorepo architecture with the following structure:

- `packages/frontend/`: React-based web application
- `packages/backend/`: Express.js API server

## Technology Stack

### Frontend
- React
- React DOM
- CSS for styling

### Backend
- Node.js
- Express.js

### Testing
- **Unit Tests**: Test individual functions and React components in isolation using Jest
  - **File Extensions**: `*.test.js` or `*.test.ts`
  - **Backend Location**: `packages/backend/__tests__/`
  - **Frontend Location**: `packages/frontend/src/__tests__/`
  - Name test files to match what they're testing (e.g., `app.test.js` for testing `app.js`)

- **Integration Tests**: Test backend API endpoints with real HTTP requests using Jest + Supertest
  - **File Extensions**: `*.test.js` or `*.test.ts`
  - **Location**: `packages/backend/__tests__/integration/`
  - Name integration test files intelligently based on what they test (e.g., `todos-api.test.js` for TODO API endpoints)

- **End-to-End (E2E) Tests**: Test complete UI workflows through browser automation using Playwright
  - **File Extensions**: `*.spec.js` or `*.spec.ts`
  - **Location**: `tests/e2e/`
  - Use Playwright only, and only test with one browser
  - Tests must use Page Object Model (POM) pattern
  - Limit to 5-8 E2E tests covering critical user journeys (focus on quality over quantity) that are isolated and independent from one another
  - Name E2E test files based on the user journey they test (e.g., `todo-workflow.spec.js`)

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm (v7 or higher)
- Playwright browsers (installed automatically with first E2E test run)

### Installation
1. Clone the repository
2. Run `npm install` at the root of the project to install all dependencies
3. Start the development environment using `npm run start`

## Development Workflow

The project uses npm workspaces to manage the monorepo structure. You can:

- Run `npm run start` from the root to start both frontend and backend in development mode
- Run `npm test` from the root to run unit and integration tests for all packages
- Run `npm run test:e2e` to run Playwright end-to-end (UI) tests
- Run `npm run test:all` to run all tests (unit, integration, and E2E)
- Work on individual packages by navigating to their directories and using their specific scripts

## Ticket-Driven Development

This project uses a spec-driven development workflow. Features are defined as **tickets** — Markdown files that serve as the source of truth for what needs to be built. The AI agent uses these tickets to implement features autonomously.

### Directory Structure

| Directory | Purpose |
|---|---|
| `tickets/todo/` | Tickets ready to be picked up |
| `tickets/in-progress/` | Tickets currently being implemented |
| `tickets/complete/` | Tickets that are fully implemented and tested |
| `tickets/TICKET-TEMPLATE.md` | Master template for new tickets |

A ticket's status is determined **entirely by which directory it lives in** — there is no status field in the file.

### Ticket Format

Each ticket is a Markdown file with YAML frontmatter and four required sections:

```
---
id: TICKET-NNN
title: Short feature title
created: YYYY-MM-DD
dependencies: []
---

## Description
## Acceptance Criteria
## Technical Implementation Notes
## Test Requirements
```

### Workflow

1. **Create a ticket** using the `/create-ticket` prompt — provide a high-level requirement and the agent generates a fully-specified ticket in `tickets/todo/`.
2. **Implement a ticket** using the `/implement-ticket` prompt — provide a ticket ID and the agent implements the full spec, writes tests, runs the suite, and moves the ticket to `tickets/complete/`.

### Naming Convention

```
TICKET-NNN-short-slug.md
```

The `NNN` number is unique across all three directories and is auto-assigned at creation time.

## Deployment

General Guidelines, Code Style and Testing Practices will be covered in the bootcamp sessions.
