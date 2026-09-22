---
file_type: documentation
title: PR Agent
description: Portable agent for GitHub pull request creation, template routing, labelling, and error handling.
status: active
stability: stable
domain: automation
last_updated: "2026-09-21"
---

# PR Agent

Creates and updates GitHub pull requests correctly and consistently: deriving PR content from a branch's own commits, routing to the right PR template, validating branch names and labels, submitting the PR, and recovering from errors along the way.

First-class in `lightspeedwp/.github`, portable to any other LightSpeedWP repository.

## Skills

| Skill | Responsibility |
| --- | --- |
| [`validate-branch-name`](skills/validate-branch-name/SKILL.md) | Validates a branch name against this repository's branch-naming convention. |
| [`route-pr-template`](skills/route-pr-template/SKILL.md) | Selects the correct PR template based on branch type. |
| [`orchestrate-pr-creation`](skills/orchestrate-pr-creation/SKILL.md) | Assembles and validates the PR data from the branch's own commits and diff. |
| [`validate-and-apply-labels`](skills/validate-and-apply-labels/SKILL.md) | Validates labels against the real canonical set and applies branch-type-required labels. |
| [`submit-pr`](skills/submit-pr/SKILL.md) | Submits the PR to GitHub, or validates it without creating anything in dry-run mode. |
| [`handle-pr-errors`](skills/handle-pr-errors/SKILL.md) | Categorises and suggests recovery for any error raised elsewhere in the workflow. |

Each skill follows the [Agent Skills specification](https://agentskills.io/specification): a `SKILL.md` with real instructions, plus its executable logic under `scripts/` and its tests under `scripts/__tests__/`.

## Structure

```
agents/pr-agent/
├── AGENT.md              # Agent metadata and skill overview
├── README.md             # This file
├── CHANGELOG.md          # Version history
├── package.json
├── package-lock.json
├── eslint.config.js       # ESLint 10 flat configuration
├── jest.config.js
├── __tests__/
│   ├── eslint-config.test.js
│   └── integration/       # Cross-skill test suites
└── skills/
    ├── validate-branch-name/
    ├── route-pr-template/
    ├── orchestrate-pr-creation/
    ├── validate-and-apply-labels/
    ├── submit-pr/
    └── handle-pr-errors/
        ├── SKILL.md
        └── scripts/
            ├── <skill>.js
            └── __tests__/<skill>.test.js
```

## Development

```bash
npm install
npm test        # unit + integration suites
npm run lint     # ESLint, zero warnings allowed
npm run validate # lint + test
```

## Governance

This agent's branch-naming, PR, labelling, and issue-type rules are sourced from this repository's own canonical documentation, not duplicated here:

- `docs/BRANCHING_*.md` — branch naming and strategy
- `docs/PR_*.md` — PR creation and governance
- `docs/LABEL*.md` — label taxonomy and strategy
- `docs/ISSUE*.md` — issue management and triage

When any of these documents change, this agent's skills (particularly `validate-branch-name` and `validate-and-apply-labels`) should be reviewed for drift.

## Related Documentation

- **Full Agent Details:** See [AGENT.md](./AGENT.md)
- **Version History:** See [CHANGELOG.md](./CHANGELOG.md)
