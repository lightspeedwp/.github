# Templates Schema Validation Test

Use this test when checking whether files in `templates/` still follow the expected structure and remain reusable.

## Scope

- `templates/design-critique-template.md`
- `templates/implementation-handoff-template.md`
- `templates/research-synthesis-template.md`
- `templates/ux-writing-template.md`
- Any future template file added to `templates/`

## Validation rules

### Required structure

- The file must have a clear title heading.
- The file must be organized into reusable sections rather than client-specific content.
- Placeholder sections must be explicit and easy to fill in.
- The file must not contain live client data or temporary notes.

### Template-specific checks

#### Design critique template

- Must include sections for artifact, goal, top issues, recommendations, accessibility notes, and open questions.

#### Implementation handoff template

- Must include sections for scope, behaviors, states, dependencies, edge cases, acceptance criteria, and open questions.

#### Research synthesis template

- Must include sections for inputs reviewed, core findings, tensions, design implications, opportunities, and open questions.

#### UX writing template

- Must include sections for surface or moment, user goal, current copy, recommended copy options, tone and brand notes, and accessibility or clarity checks.

## Failure signals

- Missing core sections
- Overly specific project content instead of reusable placeholders
- Sections that duplicate the same purpose under different headings
- A template that cannot be used without rewriting most of it
