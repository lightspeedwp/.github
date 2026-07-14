# Implementation workflows

Use only when the user asks for configuration, implementation, developer planning or handoff. Read before writing and audit before implementation.

## Standard change workflow

1. Pre-change inspection: current state, source evidence, affected content types, dependencies and access level.
2. Risk classification:
   - Low: reversible content/settings edits with clear verification.
   - Medium: taxonomy, relationship, template, enquiry routing or SEO setting changes.
   - High: imports, bulk edits, schema output changes, plugin activation/deactivation, production changes.
3. Change plan: exact steps, owner, environment, expected outcome and rollback path.
4. Execution guidance or confirmed execution. Never claim a change was made unless tooling confirms it.
5. Verification: UI/admin checks, front-end checks, structured-data checks, form test, archive/single checks or source-code review.
6. Handoff: what changed, what remains unknown, risks, retest steps and memory candidates.

## Content-model implementation

- Check `references/content-model/core/` before adding or changing fields.
- Preserve source slugs and historic data unless the user requests migration.
- Do not promote extension-facing entities into core.
- Add compatibility notes for field type changes.

## Developer handoff

Include objective, source evidence, non-goals, affected files, content model references, implementation sequence, acceptance checks, rollback/manual recovery and unresolved questions.
