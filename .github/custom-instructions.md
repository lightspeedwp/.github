---
mode: "agent"
description: "Repo-local Copilot and agent instructions for maintaining the LightSpeed .github control-plane repository."
---

# LightSpeed .github Copilot And Agent Instructions

## Overview

You are maintaining the LightSpeed `.github` repository. This repository is the
GitHub control plane for community-health files, templates, labels, workflows,
reports, active project planning, and repo-local AI governance.

Do not treat `.github` as the default home for every reusable LightSpeed
WordPress or AI asset. Portable agents, instructions, skills, hooks, workflows,
schemas, cookbook recipes, and plugin bundles now belong in the top-level source
folders created for the portable AI plugin restructure.

## Boundary Rules

- Use `.github/` for GitHub-native governance, community health, repo-local
  automation, reports, active project files, and instructions for maintaining
  this repository.
- Use top-level source folders for portable AI assets intended to be reused or
  installed elsewhere.
- Keep block theme, block plugin, and general WordPress project guidance out of
  `.github` unless the file is specifically about maintaining this repository.
- Do not move existing assets without a migration issue, source path, target
  path, and validation plan.
- Keep security, accessibility, performance, maintainability, and UK English as
  non-negotiable standards.

## Branch Naming (CRITICAL for Copilot)

**All branches MUST follow this pattern:** `{type}/{scope}-{title}`

**NEVER use `copilot/` as a prefix** — it is reserved for GitHub Copilot integration and will break PR template assignment and GitHub Actions workflows.

### Copilot-Specific Rules

- Copilot must ALWAYS use `{type}/{scope}-{title}` pattern
- Type value must be one of the 34 allowed values (feat, fix, docs, ci, etc.)
- Use lowercase, hyphens for word separation
- Scope should be concise (1-3 words)
- Title should be brief (3-5 words max)

### Examples

✅ **Correct (Copilot should create these):**

- `feat/governance-audit-implementation`
- `fix/pr-template-routing-bug`
- `docs/branching-strategy-guide`
- `ci/github-actions-validation`

❌ **Wrong (Never create these):**

- `copilot/fix-something` — FORBIDDEN
- `feature/my-feature` — Wrong (should be `feat/`)
- `my-feature` — Missing type prefix

### Before Pushing

**Always validate branch name:**

```bash
npm run validate:branch-name -- --branch <your-branch>
```

Expected output:

```
Branch '{your-branch}' matches the repository branching strategy.
```

### Full Reference

- **Complete guidance:** [CLAUDE.md — Branch Naming](../CLAUDE.md#-branch-naming--critical-read-first) (34 types, examples, consequences)
- **Global rules:** [AGENTS.md — Branch Naming Governance](../AGENTS.md#branch-naming-governance-critical)
- **Detailed rules:** [.github/instructions/branch-naming.instructions.md](./instructions/branch-naming.instructions.md)
- **Strategy doc:** [docs/BRANCHING_STRATEGY.md](../docs/BRANCHING_STRATEGY.md)

---

## Start Here

Use these files as the primary map before editing:

| File | Purpose |
| --- | --- |
| [`../AGENTS.md`](../AGENTS.md) | Global AI rules, tone, security, accessibility, and contribution expectations. |
| [`.github/instructions/file-organisation.instructions.md`](./instructions/file-organisation.instructions.md) | Repo-local placement rules for GitHub-native files versus portable AI assets. |
| [`../instructions/coding-standards.instructions.md`](../instructions/coding-standards.instructions.md) | Coding standards and WordPress-oriented engineering expectations. |
| [`../instructions/documentation-formats.instructions.md`](../instructions/documentation-formats.instructions.md) | Markdown, frontmatter, and Mermaid standards. |
| [`../instructions/quality-assurance.instructions.md`](../instructions/quality-assurance.instructions.md) | Testing, validation, and quality guidance. |
| [`../instructions/automation.instructions.md`](../instructions/automation.instructions.md) | Repo automation, agents, labels, releases, and metrics. |
| [`../instructions/community-standards.instructions.md`](../instructions/community-standards.instructions.md) | Community files, naming, README, and saved reply guidance. |

## Repository Structure

| Path | Scope |
| --- | --- |
| `.github/ISSUE_TEMPLATE/` | GitHub issue templates. |
| `.github/PULL_REQUEST_TEMPLATE.md` and `.github/PULL_REQUEST_TEMPLATE/` | Pull request templates. |
| `.github/SAVED_REPLIES/` | Maintainer replies and triage language. |
| `.github/workflows/` | GitHub Actions workflows. |
| `.github/agents/` | Repo-only and legacy agent specs during migration. |
| `.github/instructions/` | Repo-local instructions for maintaining this repository. |
| `.github/prompts/` | Legacy prompt library pending migration decisions. |
| `.github/reports/` | Reports, audits, metrics, validation output, and analysis. |
| `.github/projects/` | Active and completed project planning artefacts. |
| `.github/tmp/` | Short-lived scratch output that must be cleaned up. |

## Portable Source Folders

Use these folders for reusable assets that should travel across tools, projects,
or plugin bundles:

| Path | Scope |
| --- | --- |
| `../.schemas/` | Portable JSON, YAML, and frontmatter schemas. |
| `../agents/` | Portable agent specifications. |
| `../cookbook/` | Recipes, examples, playbooks, and implementation guides. |
| `../hooks/` | Portable hooks, guardrails, and tool adapters. |
| `../instructions/` | Portable instruction files without `.github` assumptions. |
| `../plugins/` | Installable plugin bundles, starting with `lightspeed-github-ops`. |
| `../skills/` | Self-contained skills with `SKILL.md` entrypoints. |
| `../workflows/` | Portable agentic workflows; GitHub Actions stay in `.github/workflows/`. |

## Current Migration Direction

The portable AI plugin restructure keeps `.github` important but narrows its
scope. The target direction is:

- keep repo governance, community health, labels, workflows, reports, and
  project tracking under `.github`;
- move reusable agent specs to `../agents/` only after frontmatter and links are
  updated;
- move reusable instructions to `../instructions/` only after `.github`
  assumptions are removed;
- convert durable prompt workflows into `../skills/<skill-id>/SKILL.md`;
- convert examples and teaching material into `../cookbook/`;
- move portable schemas to `../.schemas/` only when new validators consume them;
- build the first plugin as `../plugins/lightspeed-github-ops/` before broader
  plugin families.

## Workflow Expectations

1. Read the relevant issue draft or GitHub issue before editing.
2. Check file placement with
   [`file-organisation.instructions.md`](./instructions/file-organisation.instructions.md).
3. Keep changes scoped to the issue; do not move production assets in policy
   update tasks.
4. Run targeted validation that does not mutate unrelated files.
5. Use `git status --short` before finishing and call out unrelated changes.

## Validation Notes

- For Markdown-only changes, run targeted `markdownlint-cli2` on the changed
  files and `git diff --check`.
- Avoid using known mutating validation commands as proof for documentation-only
  tasks.
- If a validation command changes files, stop, inspect the diff, and revert only
  the changes made by that command.

## Community Health Assets

- Shared across the organisation: discussion templates, saved replies, issue
  templates, pull request templates, support, security, code of conduct, and
  contribution files.
- Repository-scoped: labels, issue types, labeler rules, workflows, reports,
  project artefacts, and repo-local AI instructions.

## Related Project Documents

- [Portable AI plugin restructure PRD](./projects/active/portable-ai-plugin-restructure/portable-ai-plugin-restructure-prd-2026-05-14.md)
- [Issue #291 draft](./projects/active/portable-ai-plugin-restructure/issues/children/batch-01-skeleton-boundary/01-03-refactor-file-organisation-boundary.md)
- [Issue #292 draft](./projects/active/portable-ai-plugin-restructure/issues/children/batch-01-skeleton-boundary/01-04-refactor-repo-local-copilot-instructions.md)
