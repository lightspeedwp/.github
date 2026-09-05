---
title: "LightSpeed .github — Claude Instructions"
description: "Claude-specific project instructions for the LightSpeed .github repository."
version: "v2.0"
last_updated: "2026-09-05"
file_type: "agents-index"
maintainer: "LightSpeed Team"
---

# CLAUDE.md — LightSpeed .github

Full org-wide AI rules and coding standards: [AGENTS.md](./AGENTS.md). Canonical AI references: [`ai/`](./ai/).

## What this repo is

The LightSpeed organisation `.github` control plane: community-health files, org labels and issue
types, Actions workflows, repo-local Copilot/agent instructions, reports and project artefacts.

Reusable assets go in top-level folders, never under `.github/`: `ai/`, `agents/`, `schemas/`,
`cookbook/`, `hooks/`, `instructions/`, `plugins/`, `skills/`, `workflows/`.

Placement rules: [instructions/file-organisation.instructions.md](./instructions/file-organisation.instructions.md).
Scripts, website and active projects live under `.github/`; JSON schemas in `.schemas/` at root
(scripts reference them by relative path — three levels up from `.github/scripts/<area>/`).

## Git & branching — no exceptions

Canonical: [docs/BRANCHING_STRATEGY.md](./docs/BRANCHING_STRATEGY.md).

- **Never use a `claude/` branch prefix.** Format is `{type}/{scope}-{short-title}`, lowercase
  kebab-case. Types: feat, fix, hotfix, release, refactor, chore, docs, test, perf, ci, build,
  deps, security, revert, research, design, a11y, ux, i18n, ops.
- `main` is release-only — `main-branch-guard.yml` rejects any PR not from `release/*` or
  `hotfix/*`. Everything else targets `develop`. Never push directly to either.
- A merged branch name is permanently retired; never reuse it.
- Explicit user instructions ("merge this", "push") execute immediately. Governance checks still
  run; report a failure rather than bypassing it.

**Merge protocol (maintainers):** verify the base is `develop`; if it is `main`, stop and ask
whether this is a release cycle. Squash merge, then delete the remote branch
(`git push origin --delete <branch>`; GitHub usually auto-deletes) and the local branch.

**Before every push:** confirm the branch is not `main`/`develop`, matches the naming pattern, and
passes `npm run validate:branch-name -- --branch $(git branch --show-current)`.

## Templates

- PR route map: [.github/PULL_REQUEST_TEMPLATE/config.yml](./.github/PULL_REQUEST_TEMPLATE/config.yml) — read it rather than guessing the template for a prefix.
- Issue intake: [.github/ISSUE_TEMPLATE/config.yml](./.github/ISSUE_TEMPLATE/config.yml) and [.github/issue-types.yml](./.github/issue-types.yml).
- Every issue template requires `## Definition of Ready (DoR)` and `## Definition of Done (DoD)`.
  `template-enforcement.yml` labels non-compliant issues `status:needs-more-info`.

## Commands

```bash
npm ci                        # install
npm test                      # tests
npm run lint:md               # markdown
npm run lint:js               # js/ts
npm run format                # prettier
npm run validate:frontmatter  # frontmatter schema
```

## Conventions

- UK English throughout (optimise, organisation, colour, behaviour).
- WordPress Coding Standards for PHP; ESLint/Prettier for JS/TS; PHPCS/WPCS.
- Validate input, escape output, use nonces, never commit secrets.
- WCAG 2.2 AA minimum: semantic HTML, keyboard support, sufficient contrast.
- No unnecessary JS; defer/lazy-load; prefer native blocks.
- No `references` frontmatter field — use inline links or a footer section.
- Instruction files follow `.github/instructions/instructions.instructions.md`.

## Do not

- Put plugin/theme project code, reports or task trackers outside their designated folders.
- Move agents, instructions or schemas without a migration issue recording source, target and
  validation plan.
- Enqueue editor-only WordPress assets on the front end (or vice versa).
- Commit `node_modules/`, `build/`, or other generated artefacts.

## Related

Org-wide: [coding-standards](./instructions/coding-standards.instructions.md),
[a11y](./instructions/a11y.instructions.md),
[documentation-formats](./instructions/documentation-formats.instructions.md),
[issues](./instructions/issues.instructions.md),
[pull-requests](./instructions/pull-requests.instructions.md),
[community-standards](./instructions/community-standards.instructions.md).

Repo-local: [.github/custom-instructions.md](./.github/custom-instructions.md),
[file-organisation](./instructions/file-organisation.instructions.md),
[plugin-structure](./instructions/plugin-structure.instructions.md),
[AGENTS.md](./AGENTS.md).
