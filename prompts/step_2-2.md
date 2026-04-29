## Instructions

Create a new file at `docs/ui-guidelines.md` that describes the UI guidelines for our TODO task-tracking app.

The app is a React frontend (see `docs/project-overview.md` for the tech stack) and needs to support the features described in `docs/functional-requirements.md`, including task fields like due date, category, tags, priority, and description, as well as editing, sorting, filtering, and completion status.

The UI guidelines should cover:

- **Component library**: Use Material UI (MUI) components throughout the app for consistency
- **Color palette**: Define a primary and secondary color, plus semantic colors for priority levels (e.g., red for high, yellow for medium, green for low) and completion status
- **Typography**: Specify font family, heading sizes, and body text styles
- **Button styles**: Primary actions (e.g., Add Task, Save) use filled/contained buttons; secondary actions (e.g., Cancel, Edit) use outlined buttons; destructive actions (e.g., Delete) use a danger/error color
- **Layout**: Single-column task list on mobile, centered max-width container on desktop; use cards for individual task items
- **Forms**: Inline editing for tasks where possible; use MUI TextField, Select, DatePicker, and Chip components for task fields
- **Accessibility**: All interactive elements must have accessible labels; color must not be the only indicator of state; keyboard navigation must be supported

When finished, update `copilot-instructions.md` to reference the new `docs/ui-guidelines.md` file in the Documentation Overview section.
