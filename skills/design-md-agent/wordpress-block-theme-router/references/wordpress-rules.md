# WordPress Rules

Use these rules when routing between specialists.

## Core Asset Boundaries

- Patterns: `/patterns/*.php`
- Template parts: `/parts/{slug}.html`
- Templates: `/templates/{name}.html`
- Custom templates: `/templates/{name}.html` plus `theme.json` `customTemplates`
- Block styles: block-specific style work
- Section styles: reusable layout-zone styling

## Priority

- Prefer official WordPress behavior when project conventions conflict.
- Keep the router focused on selecting the correct workflow, not reproducing every specialist instruction.
