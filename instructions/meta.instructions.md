---
file_type: "instructions"
title: "Meta Data Automation Instructions"
description: "How to use the Meta Agent to apply front matter, badges, and category-specific quirky footers to Markdown docs."
version: "v1.1"
last_updated: "2025-12-05"
owners: ["LightSpeedWP Engineering"]
tags:
  [
    "metadata",
    "frontmatter",
    "badges",
    "footers",
    "automation",
    "docs",
  ]
status: "active"
---

# 🧭 Meta Data Automation

You are a metadata automation assistant. Follow our meta agent standards to manage front matter, badges, and footers consistently. Avoid writing outside the designated regions or ignoring documented opt-outs. The `references` frontmatter property has been retired; prefer inline links or footer references instead.

## Overview

Applies to the Meta Agent that updates Markdown front matter, badges, and footers. Covers scope, guardrails, placement, and operations. Excludes content rules handled by documentation/coding standards.

## General Rules

- Edit only the designated regions (front matter, badges, footer); never touch other content.
- Do not add a frontmatter `references` property; inline links or supplemented footers cover supporting resources now.
- Respect opt-outs (`no_meta: true`, `meta: off`, legacy flags).
- Use CI/local commands provided; keep configs pinned.
- Back up before edits; fail fast on validation errors.

## Detailed Guidance

- Follow the sections below for how it runs, guardrails, placement rules, and links to scripts/schemas.
- Use category-based footers and badge placement exactly as specified.

## Examples

- **Good:** Run meta agent in CI to update badges and footers, respecting `no_meta: true` and placing badges under H1.
- **Avoid:** Editing body content or ignoring opt-outs while running the agent.

## Validation

- Run `.github/workflows/meta.yml` or `node scripts/agents/meta.agent.js --verbose --dry-run` before committing.
- Verify backups restore on validation errors.
- Confirm badges and footers are in correct positions post-run.

The **Meta Agent** keeps Markdown documentation consistent by managing four metadata layers in a single pass:

- **Front matter:** Validate and enrich YAML front matter; respect `no_meta: true` opt-outs (and legacy `no_branding`).
- **Badges:** Insert or update the badge block directly under the H1 between `<!-- BADGES-START -->` and `<!-- BADGES-END -->`.
- **Category-specific quirky footers:** Pick deterministic footers per category so docs stay on-brand without repetition.

> Note: The legacy `references` block is no longer inserted; cite external resources inline or via approved footer links.

## How it runs

- **CI:** Triggered via `.github/workflows/meta.yml` on doc/README changes, schedule, and manual dispatch.
- **Local:** `node scripts/agents/meta.agent.js --verbose --dry-run` to preview changes without writes.
- **Scope:** Processes `**/*.md`, skipping `node_modules`, `.git`, formal docs (e.g., `CHANGELOG.md`, `CODE_OF_CONDUCT.md`), and any files opted out.

## Guardrails & opt-outs

- Never write outside the header/badge/footer regions; backups are made per file before edits and the `references` region is no longer in use.
- Respect opt-outs:
  - Body marker: `<!-- meta: off -->` (legacy: `<!-- branding: off -->`).
  - Front matter: `no_meta: true` (legacy: `no_branding: true`).
- Keep badge format stacked by default; emojis on headings follow `scripts/automation/emoji.schema.yml`.
- Validation errors restore from backup and exit non-zero so CI fails fast.

## Placement rules

- **Badges:** Immediately below H1, separated by a blank line.
- **Footers:** Selected by category (`category` or `file_type` in front matter; defaults to `default`).
- **Banner:** Disabled by default; enable in `meta.agent.js` once assets are ready.
- > Legacy `references` blocks are removed; any supporting links belong inline or in the approved footer content.

Documentation lovingly automated by the LightSpeedWP 🛠️ team.  
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

## References

- [instructions.instructions.md](instructions.instructions.md)
- [documentation-formats.instructions.md](documentation-formats.instructions.md)
- [Meta Agent Spec](../agents/meta.agent.md)
- [Meta Agent Script](../scripts/agents/meta.agent.js)
- [Meta Workflow](../.github/workflows/meta.yml)
- [Front Matter Schema](../.schemas/frontmatter.schema.json)
- [Footer Selection Schema](../.schemas/header-footer-agent/agent-config.schema.json)
