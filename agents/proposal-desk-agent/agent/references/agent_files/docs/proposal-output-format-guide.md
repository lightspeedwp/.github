# Proposal Output Format Guide

<!-- BADGES-START -->
[![actions-minute-savings-watch](https://github.com/lightspeedwp/.github/actions/workflows/actions-minute-savings-watch.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/actions-minute-savings-watch.yml)
[![awesome-github-site](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml)
[![changelog-auto-update](https://github.com/lightspeedwp/.github/actions/workflows/changelog-auto-update.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-auto-update.yml)
[![changelog-validate](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validate.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validate.yml)
[![checklist-finalisation](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml)
[![checks](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml)
[![cleanup-branches](https://github.com/lightspeedwp/.github/actions/workflows/cleanup-branches.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/cleanup-branches.yml)
[![dependabot-security-label](https://github.com/lightspeedwp/.github/actions/workflows/dependabot-security-label.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/dependabot-security-label.yml)
[![flaky-test-detection](https://github.com/lightspeedwp/.github/actions/workflows/flaky-test-detection.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/flaky-test-detection.yml)
[![issue-close-label-hygiene](https://github.com/lightspeedwp/.github/actions/workflows/issue-close-label-hygiene.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-close-label-hygiene.yml)
[![issue-create-from-template](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-from-template.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-from-template.yml)
[![issues](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml)
[![labeling](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml)
[![linting](https://github.com/lightspeedwp/.github/actions/workflows/linting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/linting.yml)
[![main-branch-guard](https://github.com/lightspeedwp/.github/actions/workflows/main-branch-guard.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/main-branch-guard.yml)
[![meta](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml)
[![metadata-governance](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml)
[![metrics-summary](https://github.com/lightspeedwp/.github/actions/workflows/metrics-summary.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics-summary.yml)
[![metrics](https://github.com/lightspeedwp/.github/actions/workflows/metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics.yml)
[![planner](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml)
[![project-archival](https://github.com/lightspeedwp/.github/actions/workflows/project-archival.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-archival.yml)
[![project-meta-sync](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml)
[![readme-audit](https://github.com/lightspeedwp/.github/actions/workflows/readme-audit.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/readme-audit.yml)
[![readme-regen](https://github.com/lightspeedwp/.github/actions/workflows/readme-regen.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/readme-regen.yml)
[![readme-update](https://github.com/lightspeedwp/.github/actions/workflows/readme-update.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/readme-update.yml)
[![release](https://github.com/lightspeedwp/.github/actions/workflows/release.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release.yml)
[![reporting](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml)
[![reviewer](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml)
[![template-enforcement](https://github.com/lightspeedwp/.github/actions/workflows/template-enforcement.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/template-enforcement.yml)
[![testing](https://github.com/lightspeedwp/.github/actions/workflows/testing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/testing.yml)
[![validate-mermaid-pr](https://github.com/lightspeedwp/.github/actions/workflows/validate-mermaid-pr.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-mermaid-pr.yml)
[![validate-pr-template](https://github.com/lightspeedwp/.github/actions/workflows/validate-pr-template.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-pr-template.yml)
<!-- BADGES-END -->

## Purpose

This file defines the default formatting standard for substantial Markdown outputs produced by Proposal Desk.

Use it when drafting proposal packs, intake briefs, executive summaries, review packs, gap trackers, internal follow-ups, and other document-style deliverables that should be ready to copy into a formal internal or client-facing document.

## Agent-Specific Intent

Proposal Desk should produce polished, document-ready Markdown that is:

- **consistent**
- **highly structured**
- **easy to scan**
- **easy to copy into a formal document with minimal cleanup**
- **suitable for internal working documents and client-ready first-pass deliverables**

The agent is responsible for both the content and the presentation quality.

## Output Goal

Create a clean, professional, multi-stage brief or proposal-style document in Markdown.

The output should feel deliberate, publication-ready, and structured tightly enough that a human reviewer can:

- scan it quickly
- understand the progression of the work
- identify gaps and next actions
- reuse it directly in a working document or proposal draft

## When This Guide Applies

Apply this guide by default when the output is a substantial Markdown deliverable, including:

- intake summaries
- multi-stage briefs
- executive summaries
- full response packs
- draft proposal sections
- gap and blocker trackers
- review notes packs
- internal follow-up packs
- other structured discovery or proposal artefacts

If the user explicitly asks for a different format, follow the user’s requested format instead.

## Mandatory Document Structure

For substantial Markdown deliverables, always use this order:

1. YAML frontmatter at the very top
2. one main H1 heading immediately below the frontmatter
3. body content organised into major sections using H2 headings
4. one horizontal divider line between every major H2 section
5. one final horizontal divider line at the very end of the document

Do not place any text above the YAML frontmatter.

## Frontmatter Placement Rule

The frontmatter is **mandatory** for substantial document-style Markdown outputs.

Use it above the main H1 every time.

Never start a substantial document with the H1 first.

Correct order:

```md
---
version: 1.0.0
title: "Document title here"
date: "YYYY-MM-DD"
timezone: "Africa/Johannesburg"
status: "draft"
---

# Document Title
```

Incorrect order:

```md
# Document Title
---
version: 1.0.0
...
```

## YAML Frontmatter Rules

Always include valid YAML frontmatter enclosed by triple dashes.

Required fields:

- `version`
- `title`
- `date`
- `timezone`
- `status`

Use this structure:

```yaml
---
version: 1.0.0
title: "Document title here"
date: "YYYY-MM-DD"
timezone: "Africa/Johannesburg"
status: "draft"
---
```

### Frontmatter Notes

- Use a real version value, never a placeholder.
- The title should match the document’s purpose closely.
- Use the current date in `YYYY-MM-DD` format.
- Default timezone is `Africa/Johannesburg`.
- Default status is `draft` unless the user clearly requests another status.

## Versioning Rules

Every time a document is created or regenerated, update the version.

- If no earlier version exists, start at `1.0.0`.
- If an earlier version exists, increment the version.
- Use semantic versioning judgment:
  - **major**: major changes
  - **minor**: moderate structural or content revisions
  - **patch**: minor edits or formatting refreshes
- Never omit the version field.
- Never leave the version as a placeholder.

## Heading Rules

### Main Heading

- Place exactly one H1 immediately below the YAML frontmatter.
- The H1 should closely match the document title.
- Do not use more than one H1 in the full document.

### Section Headings

- Use H2 headings for all major sections.
- Use H3 headings only for subsections inside a major section.
- Keep heading levels consistent.
- Use headings to improve scanability, not decoration.
- Treat each H2 as a true document section, not as a casual label.

## Divider Rules

Use a horizontal divider line written exactly as:

```md

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
