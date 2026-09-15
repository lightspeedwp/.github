# Task: Fields + update behavior (TOC / page # / refs)

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
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
<!-- BADGES-END -->

## Goal

Avoid "looks wrong" renders that are actually **stale Word fields**.

Common fields:

- `PAGE` — current page number
- `NUMPAGES` — total page count
- `TOC` — table of contents
- `REF` / `PAGEREF` — cross references (often "see page X")

## When this matters

- PDF/PNG render shows placeholders (e.g., TOC looks empty, refs show wrong page, page numbers all “1”).
- The doc was modified programmatically (python-docx / OOXML patch) and then exported without a field refresh.
- LibreOffice vs Word disagree.

## What to do

### 1) Scan for fields

Run a quick field inventory:

```bash
python scripts/fields_report.py /mnt/data/input.docx
```

If you see `TOC`, `REF`, `PAGEREF`, `NUMPAGES`, or `PAGE`, plan for a field refresh step.

### 2) Render and inspect

```bash
python render_docx.py /mnt/data/input.docx --output_dir /mnt/data/out
```

Inspect all `page-*.png` at 100% zoom.

### 3) If anything is wrong: update fields in a GUI editor

**Fast checklist (Word):**

1. Open the DOCX in **Microsoft Word**
2. `Ctrl+A` (select all)
3. `F9` (Update Fields)
4. Save
5. Re-render with `render_docx.py`

LibreOffice (GUI) can also update fields, but Word is the reference implementation.

## Deterministic rendering workaround (when you can't update fields)

If your goal is **stable PNG regression testing** (not perfect Word semantics), you can
*materialize* some field results into literal text so headless renders won't omit them:

```bash
# Replace REF/PAGEREF blocks with their currently cached visible text
python scripts/flatten_ref_fields.py input.docx --out ref_flattened.docx

# Materialize SEQ/REF results (e.g., caption numbers / cross-refs)
python scripts/fields_materialize.py ref_flattened.docx --out fields_materialized.docx
```

Notes:

- This does **not** refresh TOC/PAGE/NUMPAGES; those still typically require Word/LO GUI.
- Always render and visually verify after materialization.

## Render → PNG review checklist (fields)

- Page numbers increment correctly (footer/header)
- Total page count (`NUMPAGES`) matches the rendered page count
- TOC entries exist, have correct indentation, and page numbers match headings
- Cross references (`REF`/`PAGEREF`) resolve (no "Error! Reference source not found.")
- No placeholder text like “(TOC will populate...)” remains

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)
