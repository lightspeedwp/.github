---
file_type: documentation
title: Hook Standards
description: Portable repository guardrails, Claude Code hook configuration, testing and enforcement.
version: '2.0.0'
last_updated: '2026-11-27'
---

# Hook Standards

The repository's `hooks/` folder owns portable guardrail implementations and their documentation. Claude Code runtime hooks are configuration in settings, a plugin, a skill or a subagent. These are related but not interchangeable. Rules are marked **enforced** only where a named check rejects a violation. Sources were checked on 2026-11-27.

## Canonical layout

```text
hooks/
├── README.md                        # Portable hook index
├── hook-registry.json               # Repository guardrail registry
└── <hook-id>/
    ├── README.md                    # Purpose, inputs, outputs and safety
    ├── index.js                     # Optional implementation
    ├── *.sh                         # Optional shell entry point
    └── tests/                       # Tests; __tests__/ is also accepted

.claude/
└── settings.json                    # Project-scoped Claude Code hooks

plugins/<plugin-name>/hooks/
└── hooks.json                       # Plugin-scoped Claude Code hooks
```

The repository registry records `pre-commit` and `pre-push` triggers. Claude Code hook events and matchers are a separate configuration contract defined by the current Claude Code hooks documentation.

## Rules and enforcement

| ID    | Rule                                                                                                                                      | Source         | Checked    | Enforcement                                                                          |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------- | -------------- | ---------- | ------------------------------------------------------------------------------------ |
| H-01  | Distinguish a portable repository guardrail from a Claude Code runtime hook.                                                              | [R-H], [CC-H]  | 2026-11-27 | **guidance** — no hook-specific active validator.                                    |
| H-02  | Store each portable hook as `hooks/<hook-id>/` with a README and optional implementation, fixtures and tests.                             | [R-H]          | 2026-11-27 | **guidance** — `validate-structure.js` checks only the top-level folder and index.   |
| H-03  | Register active portable guardrails in `hooks/hook-registry.json` with a real path and the applicable `pre-commit` or `pre-push` trigger. | [R-REG]        | 2026-11-27 | **guidance** — no active registry validator runs in CI.                              |
| H-04  | Configure Claude Code hooks in user/project/local/managed settings, plugin `hooks/hooks.json`, skill frontmatter or subagent frontmatter. | [CC-H]         | 2026-11-27 | **guidance** — platform configuration, not a repository gate.                        |
| H-05  | Keep plugin runtime hooks in `hooks/hooks.json`.                                                                                          | [CC-H], [CC-P] | 2026-11-27 | **enforced** — `claude plugin validate --strict` when run; no active CI job runs it. |
| H-06  | Treat Markdown instructions as guidance; use hooks and permissions when a rule must block an action.                                      | [CC-H]         | 2026-11-27 | **guidance** — platform enforcement distinction.                                     |
| H-07  | Give new hook code focused tests in `tests/` or `__tests__/`.                                                                             | [R-A], [R-J]   | 2026-11-27 | **guidance** — Jest discovers both folders, but no check requires hook tests.        |
| H-08  | Lint new JavaScript hooks with the repository ESLint gate.                                                                                | [R-A], [R-L]   | 2026-11-27 | **enforced** — `npm run lint`.                                                       |
| H-08a | Lint new shell hooks with ShellCheck.                                                                                                     | [R-A]          | 2026-11-27 | **guidance** — ShellCheck is not a required check for standalone hooks.              |
| H-09  | Keep hooks deterministic, bounded and safe: validate inputs, avoid secrets, fail clearly and do not mutate unrelated files.               | [R-A], [CC-H]  | 2026-11-27 | **guidance** — no dedicated active safety check.                                     |
| H-10  | Validate a changed hook with its tests, the relevant lint tools and the platform validator when it is packaged.                           | [R-A], [CC-V]  | 2026-11-27 | **guidance** — review procedure.                                                     |
| H-11  | Do not use the legacy agent-hook dispatcher as evidence that the canonical agent layout is enforced.                                      | [R-LEGACY]     | 2026-11-27 | **guidance** — it is local-only, currently failing and tied to the older format.     |

## Repository example

The real [hook registry](../hooks/hook-registry.json) records active guardrails and their triggers. The [portable hook index](../hooks/README.md) defines the folder ownership. No synthetic event API is required by this standard.

> **History note:** `scripts/validation/validate-agent-hooks.cjs` still discovers legacy `AGENT.md` folders and older provider fields. It is not a canonical agent validator and is not run by active CI.

## Validation procedure

```bash
npm run lint
npm test
shellcheck hooks/<hook-id>/<entrypoint>.sh
claude plugin validate plugins/<plugin-name> --strict --json
```

Use only the commands applicable to the changed hook. A hook that is not packaged as a Claude plugin has no platform manifest to validate.

## Known gaps

- No active hook-specific schema, registry validator or runtime-contract test covers the whole `hooks/` tree.
- The legacy dispatcher and multi-provider checker enforce obsolete agent conventions and currently fail; they are not active CI.
- The Husky pre-commit runs lint-staged, and its Markdown task skips ignored `docs/**` paths.
- Root `AGENTS.md` still describes folder-based agent code/spec pairs. The conflict with the Markdown-profile standard remains open and is not resolved here.
- Existing hooks are not migrated by this documentation change.

## Related standards

- [Agent Standards](./AGENT_STANDARDS.md)
- [Plugin Standards](./PLUGINS_STANDARDS.md)
- [Workflow Standards](./WORKFLOWS_STANDARDS.md)
- [Skill Standards](./SKILLS_STANDARDS.md)

[CC-H]: https://code.claude.com/docs/en/hooks
[CC-P]: https://code.claude.com/docs/en/plugins/manifest-reference
[CC-V]: https://code.claude.com/docs/en/plugins/cli-reference#plugin-validate
[R-A]: ../AGENTS.md
[R-H]: ../hooks/README.md
[R-J]: ../.jest.config.cjs
[R-L]: ../package.json
[R-LEGACY]: ../scripts/validation/validate-agent-hooks.cjs
[R-REG]: ../hooks/hook-registry.json
