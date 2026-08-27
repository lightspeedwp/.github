---
file_type: instructions
title: Markdown Instructions (Repo-local)
description: Canonical Markdown authoring rules for the LightSpeed .github control-plane
  repository.
version: v1.1
last_updated: '2026-05-28'
owners:
- LightSpeed Team
tags:
- markdown
- documentation
- a11y
- governance
applyTo:
- '**/*.md'
status: active
stability: stable
domain: governance
---

# Markdown Instructions (Repo-local)

This file is the **canonical Markdown standard** for all `.md` files in the `lightspeedwp/.github`
control-plane repository. It takes precedence over general editor defaults and any downstream repo
overrides for files within this repository.

For portable, organisation-wide Markdown rules (reusable outside this repo), see
[`../../instructions/documentation-formats.instructions.md`](../../instructions/documentation-formats.instructions.md).

## Canonical Scope & Precedence

| Scope | File family | Canonical source |
| --- | --- | --- |
| Repo-local `.github` docs | `.github/**/*.md`, `docs/**/*.md` | This file |
| Portable shared standards | `instructions/**` | `instructions/documentation-formats.instructions.md` |
| Accessibility | All content | `instructions/a11y.instructions.md` |
| Coding standards | Code-adjacent docs | `instructions/coding-standards.instructions.md` |

**Conflict resolution**: repo-local rules in this file override portable defaults for files within
this repository. When rules conflict, the more specific (more scoped) rule wins.

## Related Instruction Files

| File | Scope | Purpose |
| --- | --- | --- |
| `instructions/documentation-formats.instructions.md` | Portable, org-wide | Structure, frontmatter, format standards |
| `instructions/a11y.instructions.md` | All code and content | WCAG 2.2 AA, inclusive design |
| `instructions/community-standards.instructions.md` | All contributors | Code of conduct, contribution norms |
| `instructions/quality-assurance.instructions.md` | CI/CD, reviews | QA gates, review criteria |
| `instructions/mermaid.instructions.md` | Diagrams in `.md` files | Mermaid syntax, accessibility attributes |
| `.github/instructions/file-organisation.instructions.md` | Repo-local | File placement and naming rules |

## Core Rules

- Use one H1 (`#`) per file; keep heading levels sequential (never skip from H2 to H4).
- Use fenced code blocks with explicit language tags (`bash`, `yaml`, `markdown`, etc.).
- Keep links relative for in-repo files; verify they resolve before merging.
- Use `1.` for ordered lists and `-` for unordered lists.
- Keep all wording in **UK English** (optimise, organisation, colour, behaviour, analyse).
- Do not add a `references:` frontmatter field — use inline links or a footer section instead.
- Blank lines before and after headings, code blocks, and block-level elements.
- Maximum line length: 120 characters (soft limit; prefer wrapping at natural sentence boundaries).

## Frontmatter Standards

All `.md` files in this repository should include YAML frontmatter. Required fields:

```yaml
---
file_type: "instructions" # or "agent", "prompt", "project", "documentation"
title: "Human-readable title"
description: "One-sentence description"
version: "v1.0"
last_updated: "YYYY-MM-DD"
owners: ["LightSpeed Team"]
tags: ["tag1", "tag2"]
status: "active"        # active | deprecated | draft
stability: "stable"     # stable | experimental | deprecated
domain: "governance"    # governance | planning | quality | engineering
---
```

Prohibited: `references:` field. Use inline links or a `## Cross-References` footer section.

## Accessibility (WCAG 2.2 AA)

All Markdown content in this repository must meet **WCAG 2.2 Level AA** as a minimum. See
[`instructions/a11y.instructions.md`](../../instructions/a11y.instructions.md) for full guidance.

### Required checks

- **Images**: every `![]()` must have descriptive alt text explaining the image's purpose, not
  its appearance. Empty alt (`![ ]()`) is valid only for purely decorative images.
- **Links**: link text must describe the destination — never use "click here", "read more", or
  bare URLs as visible text.
- **Tables**: every table must have a header row (`| Header |`). Avoid merged cells.
- **Headings**: use headings to communicate document structure, not for visual styling.
- **Colour and contrast**: do not rely on colour alone to convey information in diagrams or
  callout blocks.
- **Mermaid diagrams**: include `accTitle` and `accDescr` attributes; see
  [`instructions/mermaid.instructions.md`](../../instructions/mermaid.instructions.md).
- **Language**: specify language in frontmatter; use plain language, avoid jargon where possible.

### Accessibility validation

```bash
# Check heading hierarchy and link text
npm run lint:md

# Screen-reader-friendly link text review (manual)
# Search for bare URLs used as link text:
grep -r '\[http' docs/ .github/
```

## Validation

Run these checks before merging any Markdown changes:

```bash
# Lint all Markdown files
npm run lint:md

# Check for trailing whitespace and mixed line endings
git diff --check

# Validate frontmatter schema
npm run validate:frontmatter

# Check for broken relative links (runs in CI via lychee)
# Locally: inspect changed files manually or use markdown-link-check
```

Frontmatter validation uses the canonical schema at `.schemas/frontmatter.schema.json`.

## Examples

### Heading flow

```markdown
# Document Title

## Major Section

### Sub-section

#### Detail (use sparingly)
```

### Code block with language tag

```markdown
    ```bash
    npm run lint:md
    ```
```

### Table with header row

```markdown
| Column A | Column B | Column C |
| --- | --- | --- |
| value | value | value |
| value | value | value |
```

### Image with descriptive alt text

```markdown
![Bar chart showing 42% adoption rate in Q1 2026 vs 18% in Q4 2025](../assets/adoption-q1-2026.png)
```

### Link with descriptive text

```markdown
<!-- Good -->
See the [CodeRabbit configuration reference](https://docs.coderabbit.ai/reference/configuration/) for supported keys.

<!-- Bad — do not use -->
Click [here](https://docs.coderabbit.ai/reference/configuration/) for the config reference.
```

### Relative in-repo link

```markdown
See [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution guidelines.
```

### Frontmatter (minimal valid example)

```yaml
---
file_type: "documentation"
title: "My Document"
description: "Short description"
version: "v1.0"
last_updated: "2026-05-28"
owners: ["LightSpeed Team"]
tags: ["docs"]
status: "active"
---
```

## Contribution and Review

- Keep edits scoped to the issue; don't refactor unrelated sections.
- Add a short rationale in the PR description explaining *why* the change was made.
- Cross-link related standards when introducing new conventions.
- When changing rules that affect many files, raise a separate issue for the follow-up audit.
- For significant changes to this file, bump `version` and update `last_updated` in frontmatter.
- Propose changes to organisation-wide rules in
  [`instructions/documentation-formats.instructions.md`](../../instructions/documentation-formats.instructions.md),
  not here.

## Cross-References

- [`../../instructions/documentation-formats.instructions.md`](../../instructions/documentation-formats.instructions.md) — portable format standards
- [`../../instructions/a11y.instructions.md`](../../instructions/a11y.instructions.md) — WCAG 2.2 AA accessibility
- [`../../instructions/community-standards.instructions.md`](../../instructions/community-standards.instructions.md) — contribution norms
- [`../../instructions/quality-assurance.instructions.md`](../../instructions/quality-assurance.instructions.md) — QA and review criteria
- [`../../instructions/mermaid.instructions.md`](../../instructions/mermaid.instructions.md) — Mermaid diagram standards
- [`./file-organisation.instructions.md`](./file-organisation.instructions.md) — file placement rules

---

*Maintained by the LightSpeedWP automation and governance maintainers.*
*Licence: [GPL-3.0](https://www.gnu.org/licenses/gpl-3.0.html) · Support: <support@lightspeedwp.agency>*
