# Task: Insert + update a Table of Contents (TOC)

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](https://img.shields.io/badge/Docs Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](https://img.shields.io/badge/Labeling Governance-OK-success.svg)
![Main Branch Guard](https://img.shields.io/badge/Main Branch Guard-OK-success.svg)
![Metadata Governance](https://img.shields.io/badge/Metadata Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](https://img.shields.io/badge/Template Enforcement-OK-success.svg)
![Validate PR Template](https://img.shields.io/badge/Validate PR Template-OK-success.svg)
![Badges: Documentation Update](https://img.shields.io/badge/Badges: Documentation Update-OK-success.svg)
![Badges: Health Check](https://img.shields.io/badge/Badges: Health Check-OK-success.svg)
![Badges: README Status Maintenance](https://img.shields.io/badge/Badges: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](https://img.shields.io/badge/Badges: Workflow Inventory Audit-OK-success.svg)
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

## Goal

Create a TOC that **actually populates and stays correct** after edits.

## Key reality

A TOC is a **field**. It will not update unless fields are refreshed.

## Headless-safe alternative (no Word field update)

If you need a deterministic TOC in a fully automated / headless flow, prefer the **static TOC** workflow:

```bash
python scripts/internal_nav.py /mnt/data/input.docx --out /mnt/data/with_static_toc.docx
```

This builds a static TOC + internal links (TOC -> headings, headings -> Back to TOC) without relying on Word field updates.
See: `tasks/navigation_internal_links.md`.

## Requirements for a working TOC

1. **Use Heading styles** (`Heading 1/2/3`) for headings. Do not fake headings with bold + bigger font.
2. Keep heading text in the paragraph (avoid leading manual numbers as plain text).
3. After edits, **update fields** before final export.

## Insert a TOC at a placeholder

1) Add a single paragraph containing the placeholder token:

```
[[TOC]]
```

1) Run the inserter:

```bash
python scripts/insert_toc.py /mnt/data/input.docx --out /mnt/data/with_toc.docx
```

Defaults: include Heading 1–3.

1) Open in Word and update fields:

- `Ctrl+A` → `F9` (Update Fields)
- Save

1) Render and visually verify:

```bash
python render_docx.py /mnt/data/with_toc.docx --output_dir /mnt/data/out
```

## Render → PNG review checklist (TOC)

- TOC is present (not blank)
- Indentation reflects heading levels
- Page numbers in TOC match the actual headings’ pages
- Headings that should appear do appear (and vice versa)
- No placeholder text remains (e.g., “TOC will populate…”)

## Common pitfalls

- **Headings not styled** → TOC is empty.
- **Manual numbering/direct formatting** → TOC levels/indentation drift.
- **Fields not updated** → TOC and page numbers stale after edits.

Tip: run `scripts/heading_audit.py` if you suspect heading-style issues.

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*

_This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP._
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

_This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP._
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

_This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP._
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

_This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP._
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)
