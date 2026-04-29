# Coding Guidelines

This document describes the coding conventions and quality standards for the TODO task-tracking app. All contributors should follow these guidelines to keep the codebase consistent, readable, and maintainable.

## Formatting

Consistent formatting makes the codebase easier to read and reduces noise in code reviews. All files should use **2-space indentation** — never tabs. Strings should use **single quotes** throughout the codebase, and every statement must end with a **semicolon**. Multi-line data structures (arrays, objects, function parameters) should include a **trailing comma** on the last item, which keeps diffs clean when new items are added. Lines should not exceed **100 characters** in length; break long expressions across multiple lines rather than letting them run off the screen.

## Naming Conventions

Consistent naming helps readers understand the purpose and type of each identifier at a glance. **Variables and functions** use `camelCase` — for example, `taskList` or `handleSubmit`. **React components** use `PascalCase`, which signals that a file exports a component rather than a plain function or module — for example, `TaskCard` or `AddTaskDialog`. **File names** use `kebab-case` to match common Node.js and tooling conventions — for example, `task-card.js` or `add-task-dialog.js`. Following these patterns uniformly means contributors can predict both file names and import paths without looking them up.

## Import Organization

Keeping imports organized makes it easier to understand a file's dependencies at a glance. Imports should be grouped in the following order: first, **external/third-party packages** (e.g., `react`, MUI components), then **internal modules** (e.g., local components, utilities, constants). Leave a single blank line between each group. Avoid importing symbols that are not actually used — unused imports add noise and can confuse linting tools. Sorting alphabetically within groups is encouraged but not required.

## Linting

The project uses **Biome.js** as both the linter and formatter. Biome enforces formatting rules automatically and catches common mistakes — such as unused variables, implicit globals, and inconsistent style — before they reach code review. Relying on a single tool for both formatting and linting keeps configuration simple and ensures all contributors produce output that looks the same regardless of their editor setup.

All code must pass Biome checks before being committed. Contributors should run Biome locally (`npx biome check .`) before pushing changes. CI will reject any code that fails these checks, so catching issues locally is faster and less disruptive.

## Code Quality Principles

Beyond formatting and naming, a few core principles guide how code is written in this project.

**DRY (Don't Repeat Yourself)**: When the same logic appears in more than one place, extract it into a shared utility function or component. Duplication makes bugs harder to fix — a change in one copy is easily missed in another. If two components share a piece of behaviour, lift that behaviour into a shared module rather than copying it.

**Single Responsibility**: Each function or component should do exactly one thing and do it well. A function that fetches data, transforms it, and also updates UI state is doing too much. Breaking responsibilities apart makes each piece easier to test in isolation and easier to change without unintended side effects.

**async/await**: Prefer `async/await` over raw Promises or callback chains for all asynchronous code. `async/await` makes control flow easier to follow — error handling with `try/catch` maps naturally to synchronous code, and stack traces are more meaningful than those produced by chained `.then()` calls.

**Avoid magic values**: Hardcoded strings and numbers scattered through the code are difficult to understand and error-prone to update. Use named constants — defined at the top of a module or in a dedicated constants file — so that each value has a clear meaning and only needs to be changed in one place.
