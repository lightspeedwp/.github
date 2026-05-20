---
title: "LightSpeed .github — Claude Instructions"
description: "Claude-specific project instructions for the LightSpeed .github repository."
version: "v1.0"
last_updated: "2026-05-20"
file_type: "agents-index"
maintainer: "LightSpeed Team"
---

# CLAUDE.md — LightSpeed .github

> Full organisation-wide AI rules, coding standards, and contribution guidelines live in [AGENTS.md](./AGENTS.md). Read that file first.

## What This Repository Is

This is the **LightSpeed organisation `.github` control plane**. It owns:

- GitHub community-health files (issue templates, PR templates, discussion templates, saved replies, code of conduct, security policy).
- Organisation-wide labels, labeler rules, and issue types.
- GitHub Actions workflows for labeling, metrics, releases, and validation.
- Repo-local Copilot and agent instructions (`.github/instructions/`, `.github/custom-instructions.md`).
- Reports, project artefacts, and active planning documents.

It also hosts **portable AI operations assets** in top-level source folders that are intended to be reusable outside this repository:

| Folder | Purpose |
| --- | --- |
| `agents/` | Portable agent specifications |
| `cookbook/` | Recipes, playbooks, and implementation guides |
| `hooks/` | Portable hooks and guardrails |
| `instructions/` | Portable instruction files (no `.github` assumptions) |
| `plugins/` | Installable plugin bundles |
| `skills/` | Self-contained skills with `SKILL.md` entrypoints |
| `workflows/` | Portable agentic workflows |

Do **not** place reusable assets under `.github/`—use the matching top-level folder instead.

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

- [AGENTS.md](./AGENTS.md) — full global AI rules
- [.github/custom-instructions.md](./.github/custom-instructions.md) — Copilot-specific repo instructions
- [.github/instructions/coding-standards.instructions.md](./.github/instructions/coding-standards.instructions.md) — unified coding standards
- [.github/instructions/file-organisation.instructions.md](./.github/instructions/file-organisation.instructions.md) — canonical file placement rules
- [.github/instructions/plugin-structure.instructions.md](./.github/instructions/plugin-structure.instructions.md) — WordPress block plugin structure
