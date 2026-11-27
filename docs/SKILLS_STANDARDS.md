---
file_type: documentation
title: Skills Standards
description: Canonical skill layout, portable and Claude Code frontmatter layers, distribution and validation.
version: '2.0.0'
last_updated: '2026-11-27'
---

# Skills Standards

A skill is a directory containing a required `SKILL.md` file. The canonical repository source is root `skills/<name>/SKILL.md`; platform loading and distribution are separate concerns. Rules are marked **enforced** only where a named check rejects a violation. Sources were checked on 2026-11-27.

## Canonical layout

```text
skills/
└── <skill-name>/
    ├── SKILL.md                 # Required portable entry point
    ├── scripts/                 # Optional executable helpers
    ├── references/              # Optional on-demand documentation
    ├── assets/                  # Optional templates and resources
    └── tests/                   # Optional tests; __tests__/ is also accepted

plugins/
└── <plugin-name>/
    ├── .claude-plugin/
    │   └── plugin.json          # Lists packaged skill directories
    └── skills/
        └── <skill-name>/
            └── SKILL.md

.claude-plugin/
└── marketplace.json             # Planned catalogue; absent today
```

The root `skills/` folder is the portable source collection. Claude Code loads project skills from `.claude/skills/`, personal skills from `~/.claude/skills/`, managed skills or plugin skills; it does not automatically scan an arbitrary root `skills/` directory. A plugin can package the canonical source without duplicating its instructions.

## Two frontmatter layers

| Layer                       | Fields                                                                                                                                                                                                         | Target                                                                                                                                  |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Agent Skills portable layer | `name`, `description`, `license`, `compatibility`, `metadata`, `allowed-tools`                                                                                                                                 | Any compatible agent, claude.ai upload and the Skills API. Only `name` and `description` are required.                                  |
| Claude Code extension layer | `when_to_use`, `argument-hint`, `arguments`, `disable-model-invocation`, `user-invocable`, `allowed-tools`, `disallowed-tools`, `model`, `effort`, `context`, `agent`, `background`, `hooks`, `paths`, `shell` | Skills actually loaded by Claude Code. All fields are optional; `description` is recommended and `name` defaults to the directory name. |

The portable layer has six fields in total. The Claude Code table has 20 fields in total: those six plus 14 extensions. `allowed-tools` exists in both layers but has different accepted forms. Packaging or uploading a Claude Code skill outside Claude Code fails on an extension field instead of silently ignoring it.

Repository root `skills/` targets the portable layer. A skill under `.claude/skills/`, a plugin skill directory or another documented Claude Code location may use the extension layer. Per-platform adapter data such as `metadata.yml` or `agents/*.yaml` stays outside `SKILL.md`.

### Repository validator classes

| Validator class     | Directory rule                                                                                                                                  | Source | Checked    | Enforcement                          |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ---------- | ------------------------------------ |
| `open-spec-skill`   | A `SKILL.md` outside the Claude Code roots uses the portable six-field set.                                                                     | [R-S]  | 2026-11-27 | **enforced** — `validate-skills.js`. |
| `claude-code-skill` | A `SKILL.md` beneath a `CLAUDE_CODE_SKILL_ROOTS` prefix may use the Claude Code extensions; classification is directory-based, not field-based. | [R-S]  | 2026-11-27 | **enforced** — `validate-skills.js`. |

## Rules and enforcement

| ID    | Rule                                                                                                                                                                                               | Source              | Checked    | Enforcement                                                                                       |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- | ---------- | ------------------------------------------------------------------------------------------------- |
| S-01  | Store each skill as `<skill-name>/SKILL.md`; supporting folders are optional.                                                                                                                      | [AS]                | 2026-11-27 | **enforced** — `validate-skills.js` checks discovered `SKILL.md` files.                           |
| S-02  | Portable frontmatter uses only the six specification fields; only `name` and `description` are required.                                                                                           | [AS], [CC-K]        | 2026-11-27 | **enforced** — `validate-skills.js` applies the portable closed field set by file class.          |
| S-03  | `name` is 1–64 characters, lowercase letters/numbers/hyphens only, has no leading, trailing or consecutive hyphen, and matches the parent directory.                                               | [AS]                | 2026-11-27 | **enforced** — `validate-skills.js`.                                                              |
| S-04  | `description` is non-empty and at most 1,024 characters.                                                                                                                                           | [AS]                | 2026-11-27 | **enforced** — `validate-skills.js` checks presence and length.                                   |
| S-04a | Explain what the skill does and when to use it, using specific trigger language.                                                                                                                   | [AS]                | 2026-11-27 | **guidance** — wording quality is manual review.                                                  |
| S-05  | `license` is a short string; `compatibility` is at most 500 characters; `metadata` is a flat string-to-string map.                                                                                 | [AS]                | 2026-11-27 | **enforced** — `validate-skills.js` checks these shapes.                                          |
| S-06  | Portable `allowed-tools` is a space-separated string. Claude Code also accepts comma-separated strings and YAML lists.                                                                             | [AS], [CC-K]        | 2026-11-27 | **enforced** — `validate-skills.js` applies the form for the classified file type.                |
| S-07  | `SKILL.md` has a substantive Markdown body after the frontmatter; a heading alone is not instructions.                                                                                             | [AS], [R-S]         | 2026-11-27 | **enforced** — `validate-skills.js` rejects empty or footer-only bodies.                          |
| S-08  | Keep `SKILL.md` under 500 lines and the instruction body under about 5,000 tokens; move detail into `references/`.                                                                                 | [AS], [AS-B]        | 2026-11-27 | **guidance** — these are recommendations, not rejection limits.                                   |
| S-09  | Keep file references relative to the skill root and one level deep.                                                                                                                                | [AS]                | 2026-11-27 | **guidance** — no repository check validates reference depth.                                     |
| S-10  | Use Claude Code extension fields only for a Claude Code target.                                                                                                                                    | [CC-K], [R-S]       | 2026-11-27 | **enforced** — `validate-skills.js` applies field eligibility by file class.                      |
| S-10a | Keep per-platform adapter metadata outside `SKILL.md`.                                                                                                                                             | [CC-K], [R-S]       | 2026-11-27 | **guidance** — no adapter-placement validator exists.                                             |
| S-11  | In Claude Code, all skill fields are optional, `description` is recommended and unknown fields are ignored at runtime. Portable upload remains stricter.                                           | [CC-K]              | 2026-11-27 | **guidance** — runtime behaviour, not an active repository gate.                                  |
| S-12  | Distribute shared skills through a plugin and root `.claude-plugin/marketplace.json`; each marketplace requires `name`, `owner` and `plugins`, and each plugin entry requires `name` and `source`. | [CC-M], [CC-P]      | 2026-11-27 | **guidance** — the marketplace file does not exist; future `claude plugin validate` is not in CI. |
| S-13  | Plugin component paths start `./`, resolve inside the plugin root and point `skills` entries at directories containing `SKILL.md`.                                                                 | [CC-P]              | 2026-11-27 | **enforced** — `claude plugin validate --strict` when run; no active CI job runs it.              |
| S-14  | Put tests for new helper code in `tests/` or `__tests__/`.                                                                                                                                         | [R-A], [R-J]        | 2026-11-27 | **guidance** — Jest discovers both folders; no check requires tests for every skill.              |
| S-15  | Validate with `skills-ref validate` when available, `npm run validate:skills`, and `claude plugin validate --strict` for each packaging plugin.                                                    | [AS], [R-S], [CC-V] | 2026-11-27 | **guidance** — review procedure; `skills-ref` is not installed in this environment.               |
| S-16  | Do not treat a baselined finding or a platform run with empty `contents` as proof of conformance.                                                                                                  | [R-S], [CC-V]       | 2026-11-27 | **guidance** — evidence rule for maintainers.                                                     |

## Validated portable example

This example passed `validate-skills.js` in the throwaway tree on 2026-11-27.

`skills/sample-skill/SKILL.md`:

```markdown
---
name: sample-skill
description: Use this sample skill to validate the documented portable skill layout.
---

# Sample Skill

## Instructions

1. Read the requested input.
2. Produce a concise result.
```

## Validated Claude Code example

This example also passed `validate-skills.js` when classified as a Claude Code skill under `.claude/skills/sample-claude/SKILL.md`.

```markdown
---
name: sample-claude
description: Use this sample skill to validate Claude Code extension fields.
allowed-tools:
  - Read
  - Grep
context: fork
agent: general-purpose
---

# Sample Claude Skill

## Instructions

1. Read the requested input.
2. Produce a concise result.
```

## Validation procedure

```bash
skills-ref validate ./skills/<skill-name>
npm run validate:skills
claude plugin validate plugins/<plugin-name> --strict --json
```

The repository validator uses constants dated 2026-10-01 and a checked-in baseline. It complements, but does not replace, current platform validation. On Claude Code 2.1.332, validating the repository's root `skills/` returned no contents; only `.claude/skills`, `~/.claude/skills` or a plugin manifest provides meaningful platform coverage for that layout.

## Known gaps

- The root marketplace file is absent and creating it is out of scope.
- No active workflow runs `claude plugin validate`; current strict validation reports existing plugin and skill failures.
- The repository baseline hides known findings, including missing frontmatter and invalid names. A green baseline gate is not a clean bill of health.
- The local field lists are snapshots. Re-read the official specification and Claude Code table before changing them.
- `skills-ref` and `uv` are not installed in this environment, so the official reference validator could not be run here.
- Existing skills and plugins are not migrated by this documentation change.

## Related standards

- [Agent Standards](./AGENT_STANDARDS.md)
- [Plugin Standards](./PLUGINS_STANDARDS.md)
- [Workflow Standards](./WORKFLOWS_STANDARDS.md)
- [Cookbook Standards](./COOKBOOKS_STANDARDS.md)

[AS]: https://agentskills.io/specification
[AS-B]: https://agentskills.io/skill-creation/best-practices
[CC-K]: https://code.claude.com/docs/en/skills
[CC-M]: https://code.claude.com/docs/en/plugins/create-marketplace
[CC-P]: https://code.claude.com/docs/en/plugins/manifest-reference#path-rules
[CC-V]: https://code.claude.com/docs/en/plugins/cli-reference#plugin-validate
[R-A]: ../AGENTS.md
[R-J]: ../.jest.config.cjs
[R-S]: ../scripts/validation/lib/skills-spec.js
