---
file_type: documentation
title: Workflow Standards
description: Portable Markdown workflows, Claude Code dynamic workflows and GitHub Actions boundaries.
version: '2.0.0'
last_updated: '2026-11-27'
---

# Workflow Standards

Three different artefacts share the word "workflow": portable Markdown procedures, Claude Code dynamic JavaScript workflows and GitHub Actions YAML. Their locations and contracts are separate. Rules are marked **enforced** only where a named check rejects a violation. Sources were checked on 2026-11-27.

## Canonical layout

```text
workflows/
├── README.md                        # Portable workflow index
├── <workflow-id>.md                 # Portable human-readable procedure
└── <workflow-id>/
    └── README.md                    # Optional index for a larger workflow package

.claude/
└── workflows/
    └── <name>.js                    # Claude Code dynamic workflow

.github/
└── workflows/
    └── <name>.yml                   # GitHub Actions workflow
```

Root `workflows/*.md` is the repository's portable procedure library. It is not a Claude Code discovery path. Claude Code dynamic workflows use JavaScript in `.claude/workflows/`, `~/.claude/workflows/` or a plugin's `workflows/` directory. GitHub Actions YAML is CI configuration, not a portable agent workflow.

## Rules and enforcement

| ID   | Rule                                                                                                                                                                         | Source             | Checked    | Enforcement                                                                               |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ---------- | ----------------------------------------------------------------------------------------- |
| W-01 | Store portable procedures as `workflows/<workflow-id>.md`; use an optional folder README only as a package index.                                                            | [R-W]              | 2026-11-27 | **guidance** — `validate-structure.js` checks only the folder and index.                  |
| W-02 | Give portable workflow documents repository frontmatter with `file_type: documentation`, title, description, version, date and owners.                                       | [R-F], [R-W]       | 2026-11-27 | **enforced** — local `validate-frontmatter.js`; no active CI job runs it.                 |
| W-03 | Use Overview, Inputs, Stages, Verification, Failure Handling and References sections for a portable procedure.                                                               | [R-W], [R-D]       | 2026-11-27 | **guidance** — no section validator exists.                                               |
| W-04 | Do not invent runtime APIs such as `agent()`, `parallel()` or `pipeline()` unless a linked official client actually defines them.                                            | [CC-W], [R-W]      | 2026-11-27 | **guidance** — no repository workflow runner enforces an API.                             |
| W-05 | Store Claude Code dynamic workflows as JavaScript in `.claude/workflows/`, `~/.claude/workflows/` or plugin `workflows/`, with the documented `meta` object and script body. | [CC-W]             | 2026-11-27 | **guidance** — platform loader contract; no active repository check.                      |
| W-06 | Keep GitHub Actions YAML under `.github/workflows/` and pass actionlint plus the repository workflow lint checks.                                                            | [GH-A], [R-ACTION] | 2026-11-27 | **enforced** — required `actionlint` check and repository workflow lint scripts.          |
| W-07 | Do not describe root `workflows/*.md` as automatically loaded by Claude Code.                                                                                                | [CC-W]             | 2026-11-27 | **guidance** — platform loading fact.                                                     |
| W-08 | Make stages ordered, inputs explicit, failure actions clear and verification measurable.                                                                                     | [R-D], [R-W]       | 2026-11-27 | **guidance** — manual quality review.                                                     |
| W-09 | Link agents, skills, cookbooks and hooks by their canonical relative paths.                                                                                                  | [R-W], [R-D]       | 2026-11-27 | **guidance** — use the scoped local-link check; general link validation is not active CI. |
| W-10 | Validate changed Markdown frontmatter and links, and run actionlint only when GitHub Actions YAML changes.                                                                   | [R-F], [R-ACTION]  | 2026-11-27 | **enforced** — named local/CI checks for their respective file types.                     |

## Repository example

The real [Release Readiness Validation Workflow](../workflows/release-readiness-validation.md) is a portable Markdown procedure. The [portable workflow index](../workflows/README.md) owns the source layout. Neither file is a Claude Code dynamic workflow or a GitHub Actions workflow.

## Validation procedure

```bash
node scripts/validation/validate-frontmatter.js --base origin/develop --head HEAD
node scripts/validation/validate-links.js
npm run lint:actionlint
npm run lint:workflows
npm run validate:workflow-npm-scripts
```

Use a scoped local-link check for changed portable Markdown because the general link checker covers only a small explicit list. `npm run validate:workflows` is a separate local legacy guardrail and does not validate portable `workflows/*.md`.

## Known gaps

- No repository validator checks portable workflow sections, stage ordering, budgets or return schemas.
- Claude Code dynamic workflows have no active repository CI check.
- GitHub Actions has required actionlint coverage; Spectral and npm-script reference checks add repository-specific rules.
- Existing portable workflows are not converted or removed by this documentation change.

## Related standards

- [Agent Standards](./AGENT_STANDARDS.md)
- [Skill Standards](./SKILLS_STANDARDS.md)
- [Cookbook Standards](./COOKBOOKS_STANDARDS.md)
- [Hook Standards](./HOOKS_STANDARDS.md)
- [Automation Guide](./AUTOMATION.md)

[CC-W]: https://code.claude.com/docs/en/workflows
[GH-A]: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax
[R-ACTION]: ../scripts/validation/run-actionlint.cjs
[R-D]: ../instructions/documentation-formats.instructions.md
[R-F]: ../.schemas/frontmatter.schema.json
[R-W]: ../workflows/README.md
