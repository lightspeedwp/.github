---
title: "LightSpeed .github — Claude Instructions"
description: "Claude-specific project instructions for the LightSpeed .github repository."
version: "v1.2"
last_updated: "2026-06-01"
file_type: "agents-index"
maintainer: "LightSpeed Team"
---

# CLAUDE.md — LightSpeed .github

> Full organisation-wide AI rules, coding standards, and contribution guidelines live in [AGENTS.md](./AGENTS.md). Read that file first.

Canonical AI references are maintained under [`ai/`](./ai/), including
[`ai/Claude.md`](./ai/Claude.md), [`ai/Gemini.md`](./ai/Gemini.md), and
[`ai/RUNNERS.md`](./ai/RUNNERS.md).

## What This Repository Is

This is the **LightSpeed organisation `.github` control plane**. It owns:

- GitHub community-health files (issue templates, PR templates, discussion templates, saved replies, code of conduct, security policy).
- Organisation-wide labels, labeler rules, and issue types.
- GitHub Actions workflows for labeling, metrics, releases, and validation.
- Repo-local Copilot and agent instructions (`.github/instructions/` for control-plane-specific, `.github/custom-instructions.md`).
- Reports, project artefacts, and active planning documents.

It also hosts **portable AI operations assets** in top-level source folders that are intended to be reusable outside this repository:

| Folder | Purpose |
| --- | --- |
| `ai/` | Canonical AI agent references (Claude, Gemini, RUNNERS configurations) |
| `agents/` | Portable agent specifications |
| `cookbook/` | Recipes, playbooks, and implementation guides |
| `hooks/` | Portable hooks and guardrails |
| `instructions/` | Portable instruction files (no `.github` assumptions) |
| `plugins/` | Installable plugin bundles |
| `skills/` | Self-contained skills with `SKILL.md` entrypoints |
| `workflows/` | Portable agentic workflows |

Do **not** place reusable assets under `.github/`—use the matching top-level folder instead.

## Git & Branching Strategy

> **CRITICAL:** This repository follows a strict branching discipline. Read [docs/BRANCHING_STRATEGY.md](./docs/BRANCHING_STRATEGY.md) before opening any PR.

### Protected Branches

- `main` is **always production-ready**. Never push to `main` unless performing a **release cycle**.
- `develop` (if used) is an integration branch. Never push to `develop` outside release/hotfix workflows.
- All other work goes to feature/fix/chore branches.

### Branch Naming Convention

Use the format: `{type}/{scope}-{short-title}` (lowercase, kebab-case)

**Common prefixes:**

- `feat/` — new feature or capability
- `fix/` — bug fix
- `hotfix/` — urgent production fix (branches from `main`)
- `chore/` — maintenance, refactoring, dependency updates
- `docs/` — documentation changes
- `ci/` — CI/CD workflow changes
- `test/` — test-only changes
- `refactor/` — code restructure
- `security/` — security fixes

**Examples:**

```
chore/readme-frontmatter-standardization
fix/invalid-branch-name-validation
docs/update-contributing-guide
release/v1.2.0
```

**Branch protection enforcement:**

- All PRs require branch names matching the regex pattern
- CI will block misnamed branches from merging
- Rename with `git branch -m <old> <new>` if needed

### Before Every Push

1. Verify the current branch: `git branch -v`
2. Confirm it is NOT `main` or `develop` (unless in a release cycle)
3. Ensure the branch name follows the `{type}/{scope}-{short-title}` pattern
4. Use: `git push -u origin <branch-name>`

## Development Commands

```bash
# Install dependencies
npm ci

# Run all tests
npm test

# Lint Markdown files
npm run lint:md

# Lint JS/TS files
npm run lint:js

# Format files
npm run format

# Validate frontmatter
npm run validate:frontmatter
```

## Key Conventions

- **Language:** UK English throughout (optimise, organisation, colour, behaviour).
- **Coding Standards:** Follow [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/) for PHP, plus ESLint/Prettier for JS/TS and PHPCS/WPCS for PHP.
- **Security:** Validate all input, escape all output, use nonces, never commit secrets.
- **Accessibility:** WCAG 2.2 AA minimum; semantic HTML, keyboard support, sufficient contrast.
- **Performance:** Avoid unnecessary JS, defer/lazy-load where possible, prefer native blocks.
- **No `references` frontmatter field:** Use inline links or footer sections instead.
- **Instruction files:** Follow the pattern in `.github/instructions/instructions.instructions.md`—frontmatter + role declaration + Overview + General Rules + Detailed Guidance + Examples + Validation + References.

## Repository Boundaries

| Asset Type | Belongs In |
| --- | --- |
| GitHub-native governance (templates, labels, workflows) | `.github/` |
| Repo-local Copilot/agent instructions | `.github/instructions/` or `.github/custom-instructions.md` |
| Reports, audits, metrics | `.github/reports/{category}/` |
| Active project artefacts | `.github/projects/active/{slug}/` |
| Temporary scratch files | `.github/tmp/` (clean up before PR) |
| Portable reusable AI assets | top-level source folders above |
| Permanent human documentation | `docs/` |

## What Not to Do

- Do not add WordPress plugin or theme project-specific code to `.github/`.
- Do not place reports or task trackers in `docs/` or the repo root.
- Do not create instruction files with a `references` frontmatter field.
- Do not move existing agents, instructions, or schemas without a migration issue that records source path, target path, and validation plan.
- Do not enqueue editor-only WordPress assets on the front end (and vice versa).
- Do not commit `node_modules/`, `build/`, or other generated artefacts.

## Related Files

**Organization-wide instructions** (reusable across all LightSpeedWP repos):

- [instructions/coding-standards.instructions.md](./instructions/coding-standards.instructions.md) — unified coding standards
- [instructions/a11y.instructions.md](./instructions/a11y.instructions.md) — WCAG 2.2 AA accessibility standards
- [instructions/documentation-formats.instructions.md](./instructions/documentation-formats.instructions.md) — Markdown, YAML, Mermaid standards
- [instructions/issues.instructions.md](./instructions/issues.instructions.md) — issue creation & labeling standards
- [instructions/pull-requests.instructions.md](./instructions/pull-requests.instructions.md) — PR creation & labeling standards
- [instructions/community-standards.instructions.md](./instructions/community-standards.instructions.md) — community health standards

**Repo-local instructions** (specific to this .github control plane):

- [.github/custom-instructions.md](./.github/custom-instructions.md) — Copilot-specific repo instructions
- [instructions/file-organisation.instructions.md](./instructions/file-organisation.instructions.md) — this repo's file placement rules
- [AGENTS.md](./AGENTS.md) — full global AI rules
- [instructions/plugin-structure.instructions.md](./instructions/plugin-structure.instructions.md) — WordPress block plugin structure
