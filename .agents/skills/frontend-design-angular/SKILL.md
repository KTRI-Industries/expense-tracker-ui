---
name: frontend-design-angular
description: Use this skill when working on Angular UI in this repo, especially for component styling, layout refinement, responsive behavior, visual hierarchy, Angular Material polish, Tailwind utility cleanup, form usability, and accessibility improvements. Do not use it for backend, API client generation, NgRx-only logic changes, or non-UI refactors.
---

# Frontend design skill for Expense Tracker UI

## Purpose
Improve the quality of the UI without fighting the existing architecture or design language.

This repository uses:
- Angular standalone components
- Angular Material
- Tailwind CSS 4
- Formly + Material
- NgRx
- Greek locale formatting

When this skill is used, preserve those conventions and improve the interface in a way that feels consistent with the rest of the product.

## Use this skill for
- polishing screens and components
- improving spacing, alignment, grouping, and hierarchy
- making Angular Material-based UIs feel cleaner and more intentional
- improving mobile and tablet responsiveness
- improving form usability and validation clarity
- improving empty, loading, error, and disabled states
- reducing visual clutter
- making dashboards, lists, tables, and forms easier to scan
- improving accessibility and keyboard usability

## Do not use this skill for
- pure state-management changes with no UI implications
- generated API code
- Keycloak/auth-only changes
- backend contract changes
- refactors that do not affect UX or presentation

## Project-specific design rules

### 1. Respect the existing stack
- Prefer Angular Material components already in use.
- Use Tailwind utilities when they simplify layout and spacing.
- Use component SCSS only where it improves readability or handles styling that should not live in long utility chains.
- Do not introduce a new UI library unless explicitly requested.

### 2. Preserve repo conventions
- Keep components standalone.
- Keep imports aligned with public library APIs.
- Avoid changing state shape or feature boundaries unless the UI task truly requires it.
- Keep templates readable; move complex presentation logic out of the template where helpful.

### 3. Visual hierarchy
For every UI change, make these clearer:
- what the screen is for
- what the primary action is
- what information matters most
- what is secondary
- what state the user is in

Use spacing, size, emphasis, grouping, and contrast. Do not rely on color alone.

### 4. Angular Material polish
When using Material:
- make sure form fields, cards, buttons, menus, and tables feel visually consistent
- avoid cramped default layouts
- improve section spacing around Material components
- ensure button hierarchy is obvious
- avoid overusing outlined containers when a simpler structure is clearer

### 5. Tailwind usage
- Prefer Tailwind for layout, spacing, flex/grid, width, gap, alignment, and responsive utilities.
- Avoid long unreadable utility chains when a semantic class or small SCSS block is clearer.
- Reuse existing spacing patterns where possible.
- Do not add arbitrary values unless there is a good reason.

### 6. Forms
- Labels must stay clear and visible.
- Required and optional fields should be obvious.
- Validation messages should be near the field and explain the fix.
- Submitting, loading, and disabled states should be visually distinct.
- Multi-section forms should have clear grouping and progression.

### 7. Data-heavy screens
For dashboards, transaction lists, and account views:
- optimize for scanability first
- emphasize key figures and important actions
- reduce low-value visual noise
- ensure controls are easy to find
- handle narrower screens thoughtfully

### 8. Responsiveness
Always check:
- small mobile widths
- standard laptop widths
- larger desktop widths

Prefer wrapping, stacking, and fluid spacing over brittle fixed layouts.

### 9. Accessibility
Always consider:
- semantic HTML
- heading structure
- keyboard access
- visible focus
- accessible names for controls
- sufficient contrast
- not relying only on placeholders
- clear status and error messaging

## Working method
When using this skill:

1. Identify the UX goal.
2. Identify the main visual or usability problems.
3. Choose the smallest coherent improvement that meaningfully helps.
4. Implement changes in a way that matches the repo’s Angular Material + Tailwind approach.
5. Before finishing, review:
    - responsiveness
    - focus states
    - loading/empty/error states
    - readability of the template
    - consistency with nearby screens/components

## Output expectations
In the final response:
- briefly state the design intent
- summarize the main UI issues addressed
- summarize template changes
- summarize styling changes
- summarize any component-logic changes made in support of the UI
- mention accessibility and responsive improvements