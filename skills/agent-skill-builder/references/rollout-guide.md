# Rollout Guide

Use this guide before handing off or packaging a generated skill.

## Pre-release checklist

- `SKILL.md` has valid frontmatter with only `name` and `description` unless the packaging target allows more fields.
- Description explains task and trigger context.
- References are linked from `SKILL.md` only when useful.
- Templates match schemas.
- Examples match templates.
- Memory has no stale or temporary entries.
- Source priority is consistent.
- Validators pass or known warnings are documented.
- The package stays below platform size limits.

## Release sequence

1. Run individual validators while editing.
2. Run `scripts/validate-all.py`.
3. Manually review `SKILL.md` and the reference register.
4. Update `rollout/changelog.md`.
5. Package the complete skill folder.
6. Share the ZIP and a short validation note.

## Backwards compatibility

If a template, schema, memory convention, or validation rule changes, update paired examples and release notes in the same change.
