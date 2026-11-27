---
file_type: documentation
title: Plugin Standards
description: Canonical Claude Code plugin layout, manifest path rules, marketplace distribution and validation.
version: '2.0.0'
last_updated: '2026-11-27'
---

# Plugin Standards

A Claude Code plugin packages agents, skills, commands, hooks, MCP servers and related components. Its manifest lives at `.claude-plugin/plugin.json`; a marketplace catalogue lives at `.claude-plugin/marketplace.json`. Rules are marked **enforced** only where a named check rejects a violation. Sources were checked on 2026-11-27.

## Canonical layout

```text
plugins/
└── <plugin-name>/
    ├── .claude-plugin/
    │   └── plugin.json              # Required when using an explicit manifest
    ├── README.md
    ├── LICENSE
    ├── agents/                      # Agent Markdown files
    ├── skills/                      # Skill directories containing SKILL.md
    ├── commands/                     # Command Markdown files
    ├── hooks/
    │   └── hooks.json                # Claude Code hook configuration
    ├── .mcp.json                     # MCP server configuration
    └── scripts/                      # Optional executable helpers

.claude-plugin/
└── marketplace.json                 # Root distribution catalogue; absent today
```

The manifest is optional in Claude Code and only `name` is required by the manifest schema. This repository uses an explicit `.claude-plugin/plugin.json` for each plugin. A plugin-root `CLAUDE.md` is not loaded as plugin context; put shared runtime guidance in an appropriate component.

## Rules and enforcement

| ID     | Rule                                                                                                                                      | Source         | Checked    | Enforcement                                                                                                       |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------- | -------------- | ---------- | ----------------------------------------------------------------------------------------------------------------- |
| PL-01  | Store an explicit plugin manifest at `.claude-plugin/plugin.json`, not root `plugin.json`.                                                | [CC-P]         | 2026-11-27 | **enforced** — `claude plugin validate --strict` when run; no active CI job runs it.                              |
| PL-02  | Include a unique plugin `name`.                                                                                                           | [CC-P]         | 2026-11-27 | **enforced** — `claude plugin validate --strict`.                                                                 |
| PL-02a | Add version, description and author metadata when the distribution surface needs them.                                                    | [CC-P]         | 2026-11-27 | **guidance** — unless a stricter validator profile is selected.                                                   |
| PL-03  | Start every manifest component path with `./`, resolve it inside the plugin root and ensure it exists.                                    | [CC-P]         | 2026-11-27 | **enforced** — `claude plugin validate --strict`.                                                                 |
| PL-04  | Point `skills` entries at directories containing `SKILL.md`; `"."` is also accepted for a plugin-root skill.                              | [CC-P]         | 2026-11-27 | **enforced** — `claude plugin validate --strict`.                                                                 |
| PL-05  | Point `agents` entries at Markdown files, not directories.                                                                                | [CC-P]         | 2026-11-27 | **enforced** — `claude plugin validate --strict`.                                                                 |
| PL-06  | Use the default component directories or declare them explicitly; plugin agents support a narrower field set than project/user subagents. | [CC-P], [CC-C] | 2026-11-27 | **guidance** — platform behaviour; the repository validator does not check the full component model.              |
| PL-07  | Store Claude Code hooks in `hooks/hooks.json` and MCP configuration in `.mcp.json`.                                                       | [CC-P], [CC-H] | 2026-11-27 | **enforced** — `claude plugin validate --strict` for declared component shape when run; no active CI job runs it. |
| PL-08  | Do not extend plugin component containment into a blanket ban on external marketplace sources; external source objects are supported.     | [CC-M]         | 2026-11-27 | **guidance** — marketplace semantics.                                                                             |
| PL-09  | Create a root marketplace with `name`, `owner` and `plugins`; each entry has `name` and `source`.                                         | [CC-M]         | 2026-11-27 | **guidance** — no marketplace file exists yet; future platform validation is not in CI.                           |
| PL-10  | Treat `validate-plugins.js` as a narrow repository check, not proof of Claude platform conformance.                                       | [R-P]          | 2026-11-27 | **guidance** — it checks one plugin and does not load the platform schema.                                        |
| PL-11  | Run both repository and pinned platform validation before publishing.                                                                     | [R-P], [CC-V]  | 2026-11-27 | **guidance** — review procedure.                                                                                  |
| PL-12  | Keep current failing plugin details in the validation work, not in this standing standard.                                                | [R-SPEC]       | 2026-11-27 | **guidance** — documentation scope rule.                                                                          |

## Validated manifest example

This manifest passed `claude plugin validate --strict --json` on Claude Code 2.1.332. The temporary plugin was outside Git, so the validator proved the manifest but did not read its component contents.

`plugins/sample-plugin/.claude-plugin/plugin.json`:

```json
{
  "name": "sample-plugin",
  "version": "1.0.0",
  "description": "Temporary plugin used to test current Claude Code validation.",
  "author": {
    "name": "LightSpeed Team"
  },
  "skills": ["./skills/sample-skill"],
  "agents": ["./agents/sample-profile.md"]
}
```

## Validation procedure

```bash
npm run validate:plugins
claude plugin validate plugins/<plugin-name> --strict --json
claude plugin validate .claude-plugin/marketplace.json --strict --json
```

The marketplace command becomes applicable only after the root file exists. Pin the Claude Code version in future CI and update it deliberately with the known-findings baseline.

## Known gaps

- The root marketplace file is absent and creating it is out of scope.
- `validate-plugins.js` checks only `plugins/lightspeed-github-ops`; the other plugins and marketplace are outside its scope.
- No active workflow runs `claude plugin validate`; current strict validation reports existing failures across all eight plugin manifests.
- Current plugins are not migrated by this documentation change.
- A manifest pass does not prove that every packaged skill or agent was read; inspect the validator's `contents` array.

## Related standards

- [Agent Standards](./AGENT_STANDARDS.md)
- [Skill Standards](./SKILLS_STANDARDS.md)
- [Hook Standards](./HOOKS_STANDARDS.md)
- [Workflow Standards](./WORKFLOWS_STANDARDS.md)

[CC-C]: https://code.claude.com/docs/en/plugins/components
[CC-H]: https://code.claude.com/docs/en/hooks
[CC-M]: https://code.claude.com/docs/en/plugins/create-marketplace
[CC-P]: https://code.claude.com/docs/en/plugins/manifest-reference
[CC-V]: https://code.claude.com/docs/en/plugins/cli-reference#plugin-validate
[R-P]: ../scripts/validation/validate-plugins.js
[R-SPEC]: ../.github/specs/028-agent-skill-standards-docs/spec.md
