---
file_type: documentation
title: Agent Standards
description: Canonical repository layout, platform fields, governance fields and validation for agent profiles.
version: '2.0.0'
last_updated: '2026-11-27'
---

# Agent Standards

This document defines the canonical **repository source layout** for agent profiles. It distinguishes that layout from each platform's discovery rules and from the repository's current state. A rule marked **enforced** names a check that rejects a violation; a rule marked **guidance** has no such check. Sources were checked on 2026-11-27.

## Scope

The canonical source is a Markdown agent profile under root `agents/`, shared working instructions in root `AGENTS.md`, and optional supporting files. GitHub Copilot organisation distribution and Claude Code plugin loading are separate platform layers. This document does not move existing agents or claim that the repository already conforms.

## Canonical layout

```text
.
├── AGENTS.md                              # Shared repository working instructions
├── agents/
│   └── <name>.agent.md                    # Canonical agent profile
├── skills/
│   └── <skill-name>/
│       └── SKILL.md                       # Portable capability used by an agent
├── plugins/
│   └── <plugin-name>/
│       ├── .claude-plugin/
│       │   └── plugin.json                # Claude Code component adapter
│       ├── agents/                        # Optional packaged agent files
│       └── skills/                        # Optional packaged skills
└── .claude-plugin/
    └── marketplace.json                   # Planned distribution catalogue; absent today
```

The root `agents/` and `skills/` folders are the repository's canonical sources. Claude Code does not automatically discover an arbitrary root `agents/` or `skills/` folder; it loads project, user, managed or plugin components. A plugin manifest can package the canonical files without changing their source location.

## Platform layers

| Layer                              | Verified location or format                                        | Consequence                                                                                 |
| ---------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| GitHub Copilot organisation agents | Root `agents/*.agent.md` in the organisation `.github` repository. | This is the verified organisation-distribution meaning of the canonical root folder.        |
| GitHub Copilot repository agents   | `.github/agents/*.agent.md`.                                       | A repository agent with the same filename/ID overrides the organisation agent.              |
| Claude Code project/user agents    | `.claude/agents/*.md` and `~/.claude/agents/*.md`.                 | Root `agents/*.agent.md` is not a Claude Code project-discovery path.                       |
| Claude Code plugin agents          | A plugin's `agents/` directory, referenced by its manifest.        | This is the verified route for loading the repository's canonical profiles in Claude Code.  |
| Shared working instructions        | `AGENTS.md` ordinary Markdown.                                     | GitHub support varies by surface; Claude Code support is version- and fallback-conditional. |

## Rules and enforcement

| ID   | Rule                                                                                                                                                                                                                                                                                                                                                                                  | Source                      | Checked    | Enforcement                                                                                                                   |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------- |
| A-01 | Store organisation agent profiles as root `agents/<name>.agent.md`.                                                                                                                                                                                                                                                                                                                   | [GH-O]                      | 2026-11-27 | **guidance** — no repository validator requires root-only placement.                                                          |
| A-02 | Use YAML frontmatter followed by a Markdown system prompt.                                                                                                                                                                                                                                                                                                                            | [GH-A], [CC-S]              | 2026-11-27 | **enforced** — `validate-skills.js` checks parseable frontmatter and required fields for `*.agent.md`.                        |
| A-03 | The repository requires non-empty `name` and `description`; GitHub itself requires only `description` and defaults `name` to the filename.                                                                                                                                                                                                                                            | [GH-A], [R-S]               | 2026-11-27 | **enforced** — `validate-skills.js` requires both for repository subagent definitions.                                        |
| A-04 | Write `tools` as a YAML list. Claude Code and GitHub accept a comma-separated string, but both repository agent frontmatter validators reject it.                                                                                                                                                                                                                                     | [CC-S], [GH-A], [R-F]       | 2026-11-27 | **enforced** — local `validate-agents.js` and `validate-agent-frontmatter.js`; neither runs in active CI.                     |
| A-05 | Use `model` only when a platform-specific choice is needed; omission inherits the platform default.                                                                                                                                                                                                                                                                                   | [CC-S], [GH-A]              | 2026-11-27 | **guidance** — no active check validates model selection.                                                                     |
| A-06 | Add repository governance fields `file_type: agent`, `title` and `last_updated`. These are repository fields, not Claude Code or GitHub requirements.                                                                                                                                                                                                                                 | [R-S], [R-C]                | 2026-11-27 | **enforced** — `validate-skills.js` requires all three; the general agent schema does not.                                    |
| A-07 | Write `last_updated` as an ISO date `YYYY-MM-DD`.                                                                                                                                                                                                                                                                                                                                     | [R-F]                       | 2026-11-27 | **enforced** — local `validate-agents.js` and `validate-agent-frontmatter.js`; `validate-skills.js` checks only string shape. |
| A-08 | Do not require `version`, `providers` or a separate implementation file. Supporting code is optional and does not replace the Markdown profile.                                                                                                                                                                                                                                       | [CC-S], [GH-A], [R-A]       | 2026-11-27 | **guidance** — no platform requires those legacy fields.                                                                      |
| A-09 | Keep shared working instructions in `AGENTS.md` as ordinary Markdown without required frontmatter.                                                                                                                                                                                                                                                                                    | [AM], [CC-M]                | 2026-11-27 | **guidance** — the repository validator applies a local frontmatter dialect, but `agents.md` defines none.                    |
| A-10 | For Claude Code, use `.claude/agents/`, `~/.claude/agents/`, managed settings or a plugin. Managed definitions have highest priority, then session `--agents`, project, user and plugin definitions.                                                                                                                                                                                  | [CC-S]                      | 2026-11-27 | **guidance** — no repository check validates discovery scope.                                                                 |
| A-11 | Current Claude Code subagent fields are `name`, `description`, `tools`, `disallowedTools`, `model`, `permissionMode`, `maxTurns`, `autoCompactWindow`, `skills`, `mcpServers`, `hooks`, `memory`, `background`, `omitClaudeMd`, `effort`, `isolation`, `color`, `initialPrompt` and `experimental`. Plugin agents ignore `permissionMode`, `hooks`, `mcpServers` and `initialPrompt`. | [CC-S], [CC-C]              | 2026-11-27 | **guidance** — the local constant is a snapshot and omits `autoCompactWindow`.                                                |
| A-12 | For GitHub profiles, `target` is `vscode` or `github-copilot`; `disable-model-invocation` and `user-invocable` control invocation; `mcp-servers` and `metadata` are not used by IDE custom agents; `infer` is retired in the general reference but remains in the CLI reference.                                                                                                      | [GH-A], [GH-C]              | 2026-11-27 | **guidance** — no repository check validates these GitHub-only semantics.                                                     |
| A-13 | Keep a GitHub agent prompt at or below 30,000 characters and deduplicate by filename/ID, not YAML `name`. Repository overrides organisation; organisation overrides enterprise.                                                                                                                                                                                                       | [GH-A]                      | 2026-11-27 | **guidance** — no repository check enforces the limit or precedence.                                                          |
| A-14 | Treat `.github-private` by scope: root `agents/` supports organisation/enterprise governance, while `.github-private/.github/agents/` is for private testing by members with access. Qualify preview status by client surface.                                                                                                                                                        | [GH-O], [GH-T], [GH-A]      | 2026-11-27 | **guidance** — platform documentation, not a repository gate.                                                                 |
| A-15 | Package canonical agents through `.claude-plugin/plugin.json`; component paths start `./`, stay inside the plugin root and agent entries are Markdown files.                                                                                                                                                                                                                          | [CC-P], [CC-C]              | 2026-11-27 | **enforced** — `claude plugin validate --strict` when run; no active CI job runs it.                                          |
| A-16 | Put tests for new implementation code in `tests/` or `__tests__/`; a single-file agent needs no implementation or test file.                                                                                                                                                                                                                                                          | [R-A], [R-J]                | 2026-11-27 | **guidance** — Jest discovers those folders, but no check requires a test for every agent.                                    |
| A-17 | Validate with `validate-skills.js`, both standalone agent validators and, for packaged agents, a pinned `claude plugin validate --strict`. A skipped file is not a pass.                                                                                                                                                                                                              | [R-S], [R-F], [R-G], [CC-V] | 2026-11-27 | **guidance** — this is the required review procedure, not an automatic content check.                                         |

## Validated example

The following layout and frontmatter were validated in a throwaway tree on 2026-11-27. `validate-skills.js`, `validate-agents.js sample-agent` and `validate-agent-frontmatter.js` all exited 0 when the throwaway tree retained the nested `scripts/validation/package.json` module boundary.

`agents/sample-agent.agent.md`:

```markdown
---
name: sample-agent
description: Use this sample agent to validate the documented agent layout.
tools:
  - Read
  - Grep
model: inherit
file_type: agent
title: Sample Agent
last_updated: '2026-11-27'
---

# Sample Agent

You are a minimal sample agent used only for validation.

## Instructions

1. Read the requested files.
2. Report concise findings.
3. Do not modify files.
```

## Validation procedure

```bash
npm run validate:skills
node scripts/validation/validate-agent-frontmatter.js
node scripts/validation/validate-agents.js sample-agent
claude plugin validate plugins/<plugin-name> --strict --json
```

`npm run validate:agents` is an alias for the skip-prone `validate-agent-frontmatter.js`, not for `validate-agents.js`. Check its summary for `Skipped` entries. The standalone agent validators are local-only; `validate-skills.js` runs in an active but non-required workflow and uses a checked-in baseline.

## Known gaps and open decisions

- Root `AGENTS.md` describes folder-based code/spec pairs and an agent index, while this standard defines single Markdown profiles. That conflict is an open maintainer decision; this document does not amend `AGENTS.md`.
- Claude Code does not discover root `agents/*.agent.md`. Plugin packaging is the verified loading route, but no root marketplace exists yet.
- The repository contains legacy folder agents and older entry filenames. This documentation change does not migrate them.
- `validate-skills.js` copies platform rules into constants dated 2026-10-01. Its subagent set omits the current `autoCompactWindow` field and does not track upstream automatically.
- No active workflow runs the standalone agent validators or `claude plugin validate`. Current strict platform validation reports existing failures; those are tracked separately from this document.
- Draft specification 014 still requires a legacy entry filename. The conflict remains open under GIT-2626.
- Whether GIT-1157, GIT-33, GIT-1140 and GIT-405 are superseded remains an open maintainer decision.

## Related standards

- [Skills Standards](./SKILLS_STANDARDS.md)
- [Plugin Standards](./PLUGINS_STANDARDS.md)
- [Instruction Standards](./INSTRUCTIONS_STANDARDS.md)
- [Hook Standards](./HOOKS_STANDARDS.md)
- [Workflow Standards](./WORKFLOWS_STANDARDS.md)

[AM]: https://agents.md
[CC-C]: https://code.claude.com/docs/en/plugins/components
[CC-M]: https://code.claude.com/docs/en/memory#agents-md
[CC-P]: https://code.claude.com/docs/en/plugins/manifest-reference#path-rules
[CC-S]: https://code.claude.com/docs/en/sub-agents
[CC-V]: https://code.claude.com/docs/en/plugins/cli-reference#plugin-validate
[GH-A]: https://docs.github.com/en/copilot/reference/custom-agents-configuration
[GH-C]: https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference#custom-agent-frontmatter-fields
[GH-O]: https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/prepare-for-custom-agents
[GH-T]: https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/test-custom-agents
[R-A]: ../AGENTS.md
[R-C]: ../schemas/agent-config.schema.json
[R-F]: ../.schemas/frontmatter.schema.json
[R-G]: ../scripts/validation/validate-agents.js
[R-J]: ../.jest.config.cjs
[R-S]: ../scripts/validation/lib/skills-spec.js
