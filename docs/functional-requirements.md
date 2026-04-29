# Functional Requirements

## TODO Task-Tracking App

### Current Features
- Add tasks
- Remove tasks

### New Requirements

#### Task Fields
Tasks must support the following additional fields:
- **Due Date** — A date indicating when the task should be completed
- **Category** — A single category to classify the task
- **Custom Tags** — One or more user-defined tags for flexible organization
- **Priority** — A priority level (high, medium, or low) to indicate urgency
- **Description** — A freeform text field for additional context or notes on a task

#### Task Management
- Tasks must be **editable** — users can update any field of an existing task
- Tasks must be **sortable** by any of their field types (e.g., due date, category, tags, priority)
- Tasks must support a **completion status** — users can mark tasks as done without deleting them, enabling a task history or archive view
- Tasks must be **filterable** — users can filter the task list by category, tag, priority, or completion status
