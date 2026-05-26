---
file_type: "instructions"
title: "Markdown Instructions (Repo-local)"
description: "Canonical Markdown authoring rules for the LightSpeed .github control-plane repository."
version: "v1.0"
last_updated: "2026-05-26"
owners: ["LightSpeed Team"]
tags: ["markdown", "documentation", "a11y", "governance"]
applyTo: ["**/*.md"]
status: "active"
stability: "stable"
domain: "governance"
---

# Markdown Instructions (Repo-local)

This file is the canonical Markdown standard for repo-local `.github` documentation.
For portable and organisation-wide rules, use [`../../instructions/documentation-formats.instructions.md`](../../instructions/documentation-formats.instructions.md).

## Scope

| Scope | File family | Canonical source |
| --- | --- | --- |
| Repo-local `.github` docs | `.github/**.md`, `docs/**.md` | This file |
| Portable shared standards | `instructions/**` | `instructions/documentation-formats.instructions.md` |

## Core Rules

- Use one H1 per file and keep heading levels sequential.
- Use fenced code blocks with language tags.
- Keep links relative for in-repo files and verify they resolve.
- Use `1.` numbering for ordered lists and `-` for unordered lists.
- Keep wording in UK English.

## Accessibility

- Provide descriptive alt text for images.
- Ensure table headings are explicit and readable.
- For Mermaid diagrams, use readable labels and avoid low-contrast palettes.
- Write link text that describes destination and purpose.

## Validation

Run these checks before merging Markdown changes:

```bash
npm run lint:md
git diff --check
```

## Examples

Good heading flow:

```markdown
# Title

## Section

### Detail
```

Good code block:

```markdown

```bash
npm run lint:md
```

```

## Contribution And Review

- Keep edits scoped to the issue.
- Add a short rationale in the PR description.
- Cross-link related standards when introducing new conventions.

## Cross-References

- [`../../instructions/documentation-formats.instructions.md`](../../instructions/documentation-formats.instructions.md)
- [`../../instructions/community-standards.instructions.md`](../../instructions/community-standards.instructions.md)
- [`../../instructions/quality-assurance.instructions.md`](../../instructions/quality-assurance.instructions.md)
- [`./file-organisation.instructions.md`](./file-organisation.instructions.md)

---

*Maintained by the LightSpeedWP automation and governance maintainers.*
