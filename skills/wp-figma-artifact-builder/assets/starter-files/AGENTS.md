# Agent Instructions

Use this repository as a WordPress and Figma implementation workspace.

## Default Rules

- Inspect existing conventions before editing.
- Prefer minimal, maintainable changes.
- Keep design tokens and presentation rules in the theme.
- Keep reusable functionality, custom blocks, custom fields, CPTs, integrations, and business logic in plugins.
- Do not perform broad refactors unless explicitly requested.
- Include verification notes with every handoff.

## Figma-to-WordPress Rules

- Preserve design intent rather than arbitrary pixel values.
- Map variables to `theme.json` presets or semantic custom tokens.
- Map reusable sections to patterns or template parts before custom components.
- Mark missing states or responsive behaviour for human review.

## Routing and Handoff

- Treat this repo packet as execution guidance, not the source of all project decisions.
- Preserve references to upstream LightSpeed skills, briefs, audits, or PRDs when they are named in the task.
- Flag work that should return to a specialist skill, such as Figma canvas changes, WordPress asset generation, parity audits, launch QA, or GitHub issue drafting.
- Include the recommended next skill or human owner when the implementation cannot safely proceed.
