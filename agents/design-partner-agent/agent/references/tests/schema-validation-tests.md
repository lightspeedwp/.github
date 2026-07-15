# Schema Validation Tests

Use this test suite when checking whether files in `templates/`, `examples/`, `schemas/`, and `memory/` still match the current schema-validation rules.

## Scope

- `templates/`
- `examples/`
- `schemas/`
- `memory/`

## Folder-level validation checks

### `templates/`

- Every template file must have a top-level title heading.
- Every template file must contain the required sections for its file type.
- Template files must remain reusable and must not contain live client-specific content.
- Template files should use clear placeholder sections rather than partial prose.

### `examples/`

- Every example file must have a top-level title heading.
- Every example file must describe a concrete artifact, surface, or evidence set.
- Every example file must include a goal plus findings/issues and recommendations/implications.
- Example files should read like finished references, not raw notes.

### `schemas/`

- Every schema file must parse as valid JSON.
- Every schema file must define a top-level object with `title`, `type`, and `properties`.
- Every schema file must include a `required` list.
- Schema vocabulary should stay aligned with related templates and examples.

### `memory/`

- `user-preferences.md` must contain standing working preferences only.
- `project-defaults.md` must contain stable defaults and reusable client-pattern sections only.
- `todos.md` must contain active follow-ups only.
- `review-history.md` must contain completed review summaries only.
- `client-engagement-template.md` must remain a reusable engagement starter.

## Stricter per-file checks

### Template file checks

- `templates/design-critique-template.md` must include: Artifact, Goal, Top issues, Recommendations, Accessibility notes, Open questions.
- `templates/implementation-handoff-template.md` must include: Scope, Behaviors, States, Dependencies, Edge cases, Acceptance criteria, Open questions.
- `templates/research-synthesis-template.md` must include: Inputs reviewed, Core findings, Tensions, Design implications, Opportunities, Open questions.
- `templates/ux-writing-template.md` must include: Surface or moment, User goal, Current copy, Recommended copy options, Tone and brand notes, Accessibility and clarity checks.

### Example file checks

- `examples/design-critique-example.md` and `examples/woo-product-page-critique-example.md` must include a goal, issues/findings, recommendations, and accessibility notes.
- `examples/tour-booking-audit-example.md` and `examples/publishing-homepage-audit-example.md` must include a goal, key findings, recommendations, and open questions.
- `examples/research-synthesis-example.md` must include inputs, core findings, tensions, design implications, and opportunities.

## Failure signals

- Missing required headings
- Invalid JSON in schema files
- Memory files mixing defaults, open work, and history
- Templates or examples drifting away from the current workflow vocabulary
- Files that are too incomplete to be reliable references
