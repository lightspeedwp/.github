# Proposal Output Format Guide

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](<https://img.shields.io/badge/Docs> Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](<https://img.shields.io/badge/Labeling> Governance-OK-success.svg)
![Main Branch Guard](<https://img.shields.io/badge/Main> Branch Guard-OK-success.svg)
![Metadata Governance](<https://img.shields.io/badge/Metadata> Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](<https://img.shields.io/badge/Template> Enforcement-OK-success.svg)
![Validate PR Template](<https://img.shields.io/badge/Validate> PR Template-OK-success.svg)
![Badges: Documentation Update](<https://img.shields.io/badge/Badges>: Documentation Update-OK-success.svg)
![Badges: Health Check](<https://img.shields.io/badge/Badges>: Health Check-OK-success.svg)
![Badges: README Status Maintenance](<https://img.shields.io/badge/Badges>: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](<https://img.shields.io/badge/Badges>: Workflow Inventory Audit-OK-success.svg)
[![branch-management](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
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

*Maintained by the 🤖 LightSpeedWP Automation Team*

_Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team_
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

_Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team_
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

_Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team_
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

_Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team_
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

_Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team_
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

_Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team_
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)
