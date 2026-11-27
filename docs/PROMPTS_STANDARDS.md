---
file_type: documentation
title: Prompt Standards
description: Canonical prompt files, GitHub Copilot prompt format, Claude Code loading and validation.
version: '2.0.0'
last_updated: '2026-11-27'
---

# Prompt Standards

A reusable prompt is a Markdown template for a specific interaction. The canonical repository source is `prompts/<name>.prompt.md`. GitHub Copilot prompt files and Claude Code commands/skills have different discovery paths. Rules are marked **enforced** only where a named check rejects a violation. Sources were checked on 2026-11-27.

## Canonical layout

```text
prompts/
├── <name>.prompt.md                 # One canonical reusable prompt per file
└── README.md                        # Prompt library index

.github/
└── prompts/
    └── <name>.prompt.md             # GitHub Copilot repository prompt

.claude/
├── commands/
│   └── <name>.md                   # Supported legacy Claude Code command
└── skills/
    └── <name>/
        └── SKILL.md                 # Preferred new Claude Code reusable procedure
```

Root `prompts/` is repository organisation, not a documented default discovery path for Claude Code or GitHub Copilot. GitHub documents `.github/prompts/*.prompt.md` as the typical IDE prompt location. Claude Code keeps `.claude/commands/*.md` working, but new reusable procedures should normally be skills.

## Rules and enforcement

| ID    | Rule                                                                                                                                                                     | Source         | Checked    | Enforcement                                                                                                      |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------- | ---------- | ---------------------------------------------------------------------------------------------------------------- |
| P-01  | Name canonical prompt files `<name>.prompt.md`.                                                                                                                          | [R-P], [GH-P]  | 2026-11-27 | **guidance** — no repository validator enforces prompt naming.                                                   |
| P-02  | Store repository prompt frontmatter with `file_type: prompt`, `title`, `description`, `version`, `last_updated`, owners, tags and status.                                | [R-F], [R-P]   | 2026-11-27 | **enforced** — local `validate-frontmatter.js` requires `file_type` and `description`; no active CI job runs it. |
| P-03  | Use a focused body with Context, Task, Constraints, Acceptance Criteria and References sections.                                                                         | [R-P], [R-D]   | 2026-11-27 | **guidance** — no section validator exists.                                                                      |
| P-04  | Treat GitHub's documented `agent` and `description` examples as platform hints, not a complete normative frontmatter schema.                                             | [GH-P]         | 2026-11-27 | **guidance** — current GitHub Docs do not publish a complete required/optional prompt-field table.               |
| P-05  | Verify prompt-file support for the target client; GitHub.com and Copilot CLI are not listed as prompt-file clients in the current cheat sheet.                           | [GH-P], [GH-C] | 2026-11-27 | **guidance** — platform support fact.                                                                            |
| P-06  | Do not claim that root `prompts/*.md` is a Claude Code slash-command path.                                                                                               | [CC-K]         | 2026-11-27 | **guidance** — platform loading fact.                                                                            |
| P-07  | For Claude Code, use `.claude/commands/*.md` for an existing command or `.claude/skills/<name>/SKILL.md` for new reusable work. Existing command files remain supported. | [CC-K]         | 2026-11-27 | **guidance** — no repository loader check.                                                                       |
| P-08  | Document placeholders and expected inputs; never include secrets or real environment values.                                                                             | [R-A], [R-D]   | 2026-11-27 | **guidance** — no prompt-specific secret check.                                                                  |
| P-09  | Test a prompt against representative inputs and record expected outputs or acceptance checks.                                                                            | [R-D]          | 2026-11-27 | **guidance** — no automated prompt test exists.                                                                  |
| P-10  | Keep model names, limits and pricing out of reusable prompts unless a dated official source is cited.                                                                    | [R-D], [AI]    | 2026-11-27 | **guidance** — volatile platform facts require maintenance.                                                      |
| P-11  | Keep existing prompt sources; add a platform adapter or skill only when a separate change approves it.                                                                   | [R-P], [CC-K]  | 2026-11-27 | **guidance** — migration policy.                                                                                 |
| P-12  | Validate changed prompt frontmatter before review.                                                                                                                       | [R-V]          | 2026-11-27 | **enforced** — local `validate-frontmatter.js`; no active CI job runs it.                                        |
| P-12a | Check local links in changed prompt files.                                                                                                                               | [R-L]          | 2026-11-27 | **guidance** — `validate-links.js` does not cover root `prompts/`.                                               |

## Validated example

This example passed `.schemas/frontmatter.schema.json` on 2026-11-27.

`prompts/sample.prompt.md`:

```markdown
---
file_type: prompt
title: Sample Prompt
description: Sample reusable prompt used for schema validation.
version: '1.0.0'
last_updated: '2026-11-27'
owners:
  - LightSpeed Team
tags:
  - prompts
  - examples
status: active
---

# Sample Prompt

## Context

State the repository and task.

## Task

Describe the requested result.

## Acceptance Criteria

- The result is concise.
- The result uses UK English.
```

## Validation procedure

```bash
node scripts/validation/validate-frontmatter.js --base origin/develop --head HEAD
node scripts/validation/validate-links.js
```

Use a scoped local-link check for changed prompt files because the repository link checker covers only a small explicit list. Prompt quality and target-client loading remain manual review responsibilities.

## Known gaps

- No repository validator enforces prompt naming, body sections, placeholders, expected outputs or client loadability.
- Root `prompts/` is a canonical source library, not proof that a client discovers the files automatically.
- Existing prompts and GitHub governance prompts are not moved by this documentation change.
- The repository's prompt README contains older broad discovery claims; this standard is the verified loading reference for new work.

## Related standards

- [Instruction Standards](./INSTRUCTIONS_STANDARDS.md)
- [Skill Standards](./SKILLS_STANDARDS.md)
- [Agent Standards](./AGENT_STANDARDS.md)
- [AI Reference Standards](./AI_REFERENCES_STANDARDS.md)
- [Prompt Library](../prompts/README.md)

[AI]: ./AI_REFERENCES_STANDARDS.md
[CC-K]: https://code.claude.com/docs/en/skills
[GH-C]: https://docs.github.com/en/copilot/reference/customization-cheat-sheet
[GH-P]: https://docs.github.com/en/copilot/concepts/prompting-and-context/prompt-files
[R-A]: ../AGENTS.md
[R-D]: ../instructions/documentation-formats.instructions.md
[R-F]: ../.schemas/frontmatter.schema.json
[R-L]: ../scripts/validation/validate-links.js
[R-P]: ../prompts/README.md
[R-V]: ../scripts/validation/validate-frontmatter.js
