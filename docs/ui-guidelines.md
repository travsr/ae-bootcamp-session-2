# UI Guidelines

## Component Library

Use **Material UI (MUI)** components throughout the app for consistency. Do not use raw HTML elements or other UI libraries where an MUI equivalent exists. Import from `@mui/material`, `@mui/icons-material`, and `@mui/x-date-pickers` as appropriate.

## Color Palette

### Brand Colors
| Role | Color | MUI Token |
|------|-------|-----------|
| Primary | Indigo `#3F51B5` | `primary.main` |
| Secondary | Teal `#009688` | `secondary.main` |

### Priority Colors
| Priority | Color | MUI Token |
|----------|-------|-----------|
| High | Red `#D32F2F` | `error.main` |
| Medium | Amber `#F9A825` | `warning.main` |
| Low | Green `#388E3C` | `success.main` |

### Completion Status Colors
| Status | Color | MUI Token |
|--------|-------|-----------|
| Incomplete | Default text | `text.primary` |
| Complete | Grey `#9E9E9E` | `text.disabled` |

## Typography

- **Font Family**: Roboto (MUI default). Fall back to `sans-serif`.
- **Page Title / H1**: `variant="h4"`, font weight 600
- **Section Headings / H2**: `variant="h6"`, font weight 500
- **Task Title**: `variant="subtitle1"`, font weight 500
- **Body / Description**: `variant="body2"`, normal weight
- **Labels & Metadata** (due date, category, tags): `variant="caption"`

## Button Styles

| Action Type | MUI Variant | Color |
|-------------|-------------|-------|
| Primary (Add Task, Save) | `contained` | `primary` |
| Secondary (Edit, Cancel) | `outlined` | `primary` |
| Destructive (Delete) | `contained` or `outlined` | `error` |

All buttons must include a descriptive `aria-label` when the button text alone is ambiguous (e.g., icon-only buttons).

## Layout

- **Mobile (< 600px)**: Single-column task list, full-width cards, stacked form fields.
- **Desktop (≥ 600px)**: Centered container with `maxWidth="md"` using MUI `<Container>`. Cards fill the container width.
- Use MUI `<Card>` and `<CardContent>` for individual task items.
- Use MUI `<Stack>` or `<Box>` for spacing and alignment within cards and forms.
- The task list header (title + "Add Task" button) should be displayed in a `<Box>` with `display="flex"` and `justifyContent="space-between"`.

## Forms

- Use **inline editing** for tasks where possible — clicking an editable field on a task card should enable editing in place.
- Use a separate form or dialog (MUI `<Dialog>`) for creating a new task.
- Field components:

| Field | Component |
|-------|-----------|
| Task title | `<TextField>` |
| Description | `<TextField multiline rows={3}>` |
| Due Date | MUI X `<DatePicker>` |
| Category | `<Select>` with `<MenuItem>` options |
| Tags | `<Autocomplete multiple freeSolo>` rendering MUI `<Chip>` tags |
| Priority | `<Select>` or `<ToggleButtonGroup>` with High / Medium / Low options |
| Completion status | `<Checkbox>` |

- All form fields must have a visible `<InputLabel>` or `label` prop.

## Accessibility

- All interactive elements (buttons, icon buttons, checkboxes, selects) must have an `aria-label` or associated `<label>`.
- **Color must not be the only indicator of state.** Pair color with text labels, icons, or patterns (e.g., a strikethrough on completed task titles in addition to grey text).
- Full **keyboard navigation** must be supported — users must be able to tab through all interactive elements and activate them with Enter/Space.
- Use MUI's built-in focus ring styles; do not suppress `:focus-visible` outlines globally.
- Completed tasks should also use `text-decoration: line-through` in addition to the muted color.
