---
file_type: "instructions"
title: "Tool Configuration Documentation Template"
description: "Standard format for documenting configuration files under docs/config"
last_updated: "2025-11-12"
version: "1.0"
maintainers: ["LightSpeed Team"]
tags: ["documentation", "configuration", "standards"]
---

# Tool Configuration Documentation Template

You are a tooling documentation assistant. Follow our configuration documentation template to describe tools in `docs/config`. Avoid omitting purpose, scope, run-time details, or letting script names drift from `package.json`.

## Overview

Use this template for documenting configuration files under `docs/config/`. Covers purpose, scope, runtime triggers, scripts, severity, suppression, versioning, maintenance, ROI, and references.

## General Rules

- Document purpose/scope clearly and map to actual file globs.
- List when the tool runs (editor, pre-commit, CI) and exact scripts/commands.
- Keep script names aligned with `package.json`; note failure modes and suppressions.
- Record version pinning, maintenance owner, and ROI rationale.

## Detailed Guidance

Each configuration file in **`docs/config/`** should follow this standard format to ensure consistency and completeness. This template defines the required sections and the content to include in each.

## Purpose

Describe **why this configuration exists** and what it aims to achieve. For example, explain if it enforces coding standards, formatting conventions, or other project policies. Focus on the problem it solves.

## Scope

Detail the **scope of files or domains** the tool covers. Include file globs or extensions (e.g. “applies to all `*.js` and `*.ts` files” for ESLint, or “all `*.md` docs and READMEs” for markdownlint). This should mirror any patterns in the tool’s config or ignore files. If the config only applies to certain directories or file types, note that here.

## When It Runs

Explain **when and how this check is executed**:

- **In Editors:** Does the tool run on file save via editor integration? (e.g. VS Code format-on-save or linting feedback).
- **Pre-commit:** Does it run in local Git hooks (Husky) before commits? If so, note that (e.g. Prettier/ESLint run at pre-commit to prevent bad code).
- **CI:** Does it run in Continuous Integration? Name the workflow or npm script (e.g. “executed in CI via `npm run check` in our build workflow”). Link to the relevant `package.json` script or workflow file for traceability.

## Exact Scripts

List the **npm scripts or commands** that invoke this tool, and link to their definitions in `package.json`:

- For example, *“`npm run lint:js` – runs ESLint on all JS/TS files”*:contentReference[oaicite:3]{index=3}, or *“`npm run format` – formats code with Prettier (and Stylelint for CSS)”*.
- If the tool is part of a composite script (e.g. `npm run check` runs multiple checks), note that hierarchy. Ensure script names in docs match those in `package.json` to avoid drift.

## Severity & Failure Modes

Clarify how **failures are handled**:

- Does a rule violation fail the commit or CI build (treated as an error), or just log a warning? For example, our config typically makes linters error out on issues, causing Husky or CI to block the build.
- Mention if some rules are intentionally warnings (non-blocking) and why.
- Note if the tool can auto-fix issues (and if we use that). E.g. *“Prettier auto-formats on save and commit, so format issues should be fixed automatically.”*

## Suppression & Ignoring

List how to **suppress** checks when needed and any ignore files in use:

- e.g. Prettier uses a [`.prettierignore`](../.prettierignore) to skip certain files (like built assets). Spectral (YAML/JSON linter) uses [`.spectralignore`](../.spectralignore) to exclude files like third-party workflows.
- Mention any inline disable comments (e.g. `eslint-disable` comments, `<!-- markdownlint-disable -->`) that are supported, and discourage overuse.
- If developers should rarely need to ignore, state that (suppression is the exception, not the rule).

## Version Pinning & Reproducibility

Document how we ensure **consistent behavior** across machines:

- We pin tool versions in `package.json` (devDependencies) so that everyone runs the same version (e.g. ESLint v8, Prettier v3, etc.).
- Node.js is pinned via [`.nvmrc`](../.nvmrc) to ensure Husky/CI use the correct Node version.
- If the config relies on external schemas or definitions, note how those are versioned (e.g. JSON schemas copied into our repo at a fixed version).
- Emphasize using exact version installs (`npm ci` with lockfile) for reproducibility.

## Maintenance

Identify the **owner** of this config (e.g. “Owner: Workflows Team”) and a review cadence:

- e.g. _“Owner: DevEx Team – review this config quarterly (Jan/Apr/Jul/Oct) for updates to rules or versions.”_
- Note any known gaps or upcoming changes. For example, _“Husky integration pending – currently this runs in CI only (see Audit list).”_ If something isn’t fully implemented, flag it so it’s not forgotten.

## ROI vs Cost

Provide a brief rationale for **keeping or removing** this tool:

- **Benefit (ROI):** What value it adds (e.g. catches bugs early, enforces consistency to reduce PR churn).
- **Cost:** The overhead it introduces (maintenance effort, longer commit times, etc.).
- **Decision:** State whether we plan to _Keep_ or _Retire_ the tool and why. For example, _“**Keep** – high lint coverage prevents bugs, worth the minor config upkeep”_ or _“**Retire** – low usage and high maintenance (see Audit)”._

## Reference Guidance

Link to relevant files and external docs:

- The config file itself (for readers to view raw settings).
- Upstream documentation (e.g. ESLint or Prettier rule docs, Spectral rule references).
- Our usage in context (e.g. mention [docs/LINTING.md](../docs/LINTING.md) for overall strategy, or CI workflow names).
- Any LightSpeed internal guides if available.

_By following this template, every `docs/config/_` page will be structured uniformly, making it easy for contributors (and AI assistants) to find information. Always update the config docs when changing a tool’s setup (script names, ignore patterns, etc.) to keep docs and code in sync.\*

## Examples

- **Good:** ESLint config doc listing purpose, scope (`**/*.{js,ts}`), scripts, pre-commit/CI usage, suppressions, version pinning, maintenance cadence, ROI, and references.
- **Avoid:** Missing scripts, unclear scope, or unaligned `package.json` references.

## Validation

- Check script names match `package.json`; verify references and links exist.
- Ensure sections are completed and scope aligns with tool configuration.

## References

- [instructions.instructions.md](./instructions.instructions.md)
- [file-organisation.instructions.md](./file-organisation.instructions.md)
