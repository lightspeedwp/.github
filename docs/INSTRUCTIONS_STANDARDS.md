---
file_type: documentation
title: Instruction Standards
description: Canonical instruction sources, GitHub Copilot path rules, Claude Code loading and validation.
version: '2.0.0'
last_updated: '2026-11-27'
---

# Instruction Standards

Instruction files are Markdown guidance, but their loading behaviour depends on the client and location. The canonical repository sources are root `instructions/` for portable guidance and `.github/instructions/` for GitHub Copilot path-specific rules. Claude Code uses its own memory and rules locations. Rules are marked **enforced** only where a named check rejects a violation. Sources were checked on 2026-11-27.

## Canonical layout

```text
instructions/
├── <topic>.instructions.md          # Portable organisation guidance
├── <topic>/
│   └── README.md                    # Optional topic index
└── README.md                        # Portable instruction index

.github/
└── instructions/
    └── <rule>.instructions.md       # Copilot path-specific repository rule

CLAUDE.md                            # Claude Code repository memory
.claude/
└── rules/
    └── <rule>.md                    # Claude Code path-scoped rules
AGENTS.md                            # Shared ordinary-Markdown working instructions
```

Root `instructions/` is a portable source library, not a Claude Code auto-load directory. GitHub Copilot discovers `.github/instructions/**/*.instructions.md` when `applyTo` matches. Claude Code natively loads `CLAUDE.md`, `.claude/rules/*.md` and supported `AGENTS.md` locations; other Markdown can be imported or referenced explicitly.

## Rules and enforcement

| ID    | Rule                                                                                                                                                                                         | Source         | Checked    | Enforcement                                                                                                 |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | ---------- | ----------------------------------------------------------------------------------------------------------- |
| I-01  | Store portable guidance as `instructions/<topic>.instructions.md` and use an optional topic `README.md` only as an index.                                                                    | [R-I]          | 2026-11-27 | **guidance** — `validate-structure.js` checks only the top-level folder and index.                          |
| I-02  | Store GitHub Copilot path-specific rules as `.github/instructions/**/*.instructions.md`.                                                                                                     | [GH-I]         | 2026-11-27 | **guidance** — no repository check requires this path.                                                      |
| I-03  | Give a Copilot path-specific rule an `applyTo` glob; comma-separated patterns are supported.                                                                                                 | [GH-I]         | 2026-11-27 | **guidance** — the local schema checks the field when present but does not replace GitHub's loader.         |
| I-04  | Use `file_type` and `description` in repository instruction frontmatter. `applyTo` is required by GitHub for path-specific rules, not by the repository schema.                              | [R-F], [GH-I]  | 2026-11-27 | **enforced** — local `validate-frontmatter.js` for `file_type` and `description`; no active CI job runs it. |
| I-05  | Do not add a `references` frontmatter field; use inline links or a references section.                                                                                                       | [R-F], [R-V]   | 2026-11-27 | **enforced** — `validate-frontmatter.js` explicitly rejects `references`.                                   |
| I-06  | Use clear sections such as Overview, Rules, Examples, Validation and References.                                                                                                             | [R-I], [R-D]   | 2026-11-27 | **guidance** — no validator enforces instruction sections.                                                  |
| I-07  | Do not claim that root `instructions/*.instructions.md` is automatically loaded by Claude Code.                                                                                              | [CC-M]         | 2026-11-27 | **guidance** — platform loading fact.                                                                       |
| I-08  | For Claude Code, use `CLAUDE.md`, `.claude/rules/*.md`, conditional `AGENTS.md`, explicit `@path` imports or a skill reference.                                                              | [CC-M], [CC-K] | 2026-11-27 | **guidance** — no repository check validates loadability.                                                   |
| I-09  | Treat `AGENTS.md` as ordinary Markdown with no required frontmatter. Claude Code direct loading requires v2.1.277+ and is conditional on the absence of higher-priority Claude memory files. | [AM], [CC-M]   | 2026-11-27 | **guidance** — the repository applies a separate local frontmatter dialect.                                 |
| I-10  | Use UK English and keep guidance concise, actionable and accessible.                                                                                                                         | [R-A], [R-D]   | 2026-11-27 | **guidance** — no dedicated language or readability gate.                                                   |
| I-11  | Keep existing instruction files unless a separate migration approves removal; document the target loader rather than deleting a source.                                                      | [GH-I], [CC-M] | 2026-11-27 | **guidance** — migration policy.                                                                            |
| I-12  | Validate changed instruction frontmatter before review.                                                                                                                                      | [R-V]          | 2026-11-27 | **enforced** — local `validate-frontmatter.js`; no active CI job runs it.                                   |
| I-12a | Check local links in changed instruction files.                                                                                                                                              | [R-L]          | 2026-11-27 | **guidance** — `validate-links.js` does not cover the instruction paths.                                    |

## Validated example

This example passed `.schemas/frontmatter.schema.json` on 2026-11-27.

`.github/instructions/sample.instructions.md`:

```markdown
---
file_type: instructions
description: Sample path-specific Copilot instruction used for schema validation.
applyTo: 'docs/**'
version: '1.0.0'
last_updated: '2026-11-27'
---

# Sample Instruction

## Overview

This sample applies only to documentation.

## Rules

- Use UK English.
- Keep links relative.
```

## Validation procedure

```bash
node scripts/validation/validate-frontmatter.js --base origin/develop --head HEAD
node scripts/validation/validate-links.js
```

The general frontmatter validator is local-only and its unscoped run currently reports unrelated existing errors. The general link checker covers a small explicit file list and currently reports pre-existing broken links in `agents/README.md`; use a scoped check for changed instruction files.

## Known gaps and open decisions

- No active CI check verifies instruction sections, `applyTo` semantics or Claude Code loadability.
- Root `AGENTS.md` describes folder-based agent code/spec pairs, while the agent standard defines Markdown profiles. That conflict remains a maintainer decision and `AGENTS.md` is not amended here.
- Some existing `.github/instructions/` files do not carry the repository `file_type` field. This document does not migrate them.
- GitHub Copilot instruction support and precedence vary by client; do not generalise the GitHub.com precedence order to CLI or IDE sessions.

## Related standards

- [Agent Standards](./AGENT_STANDARDS.md)
- [Prompt Standards](./PROMPTS_STANDARDS.md)
- [Documentation Formats](../instructions/documentation-formats.instructions.md)
- [File Organisation](../.github/instructions/file-organisation.instructions.md)

[AM]: https://agents.md
[CC-K]: https://code.claude.com/docs/en/skills
[CC-M]: https://code.claude.com/docs/en/memory
[GH-I]: https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions
[R-A]: ../AGENTS.md
[R-D]: ../instructions/documentation-formats.instructions.md
[R-F]: ../.schemas/frontmatter.schema.json
[R-I]: ../instructions/README.md
[R-L]: ../scripts/validation/validate-links.js
[R-V]: ../scripts/validation/validate-frontmatter.js
