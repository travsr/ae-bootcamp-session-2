## Instructions

Create a new file at `docs/coding-guidelines.md` that documents the coding guidelines for our TODO task-tracking app.

The app is a full-stack JavaScript application with a React frontend (`packages/frontend/`) and a Node.js/Express backend (`packages/backend/`). Refer to `docs/project-overview.md` for the full architecture and tech stack.

The coding guidelines should be written as a **high-level narrative** (a few paragraphs per section, not exhaustive bullet lists). Cover the following topics:

### Formatting
Describe the general formatting expectations for the project: consistent indentation (2 spaces), single quotes for strings, semicolons required, trailing commas in multi-line structures, and a maximum line length of 100 characters.

### Naming Conventions
Explain the naming conventions used across the codebase:
- Variables and functions use **camelCase** (e.g., `taskList`, `handleSubmit`)
- React components use **PascalCase** (e.g., `TaskCard`, `AddTaskDialog`)
- File names use **kebab-case** (e.g., `task-card.js`, `add-task-dialog.js`)

### Import Organization
Describe how imports should be ordered: external/third-party imports first (e.g., React, MUI), then internal modules (e.g., components, utilities), with a blank line separating each group. Avoid unused imports.

### Linting
The project uses **Biome.js** as the linter and formatter. All code must pass Biome checks before being committed. Describe why a linter helps enforce consistency and catch issues early, and mention that contributors should run Biome locally before pushing.

### Code Quality Principles
Cover the key principles that guide code quality in this project:
- **DRY (Don't Repeat Yourself)**: Extract reusable logic into shared utilities or components rather than duplicating code
- **Single Responsibility**: Each function or component should do one thing well
- **async/await**: Prefer `async/await` over raw Promises or callbacks for asynchronous code — it improves readability and error handling
- **Avoid magic values**: Use named constants instead of hardcoded strings or numbers

---

When finished, update `.github/copilot-instructions.md` to add a reference to `docs/coding-guidelines.md` in the Documentation Overview section, following the same format as the existing entries.
