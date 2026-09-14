# True Footnotes / Endnotes (OOXML parts, numbering, refs)

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

## Goal

Add or audit **true** footnotes/endnotes in a `.docx` and verify they render correctly.

## What footnotes/endnotes are (OOXML)

Footnotes and endnotes are **not** "text in the footer." They live in separate parts:

- `word/footnotes.xml`
- `word/endnotes.xml`

And the body refers to them using references:

- `w:footnoteReference w:id="N"`
- `w:endnoteReference w:id="N"`

The note parts also contain required separators (`w:id=-1` and `w:id=0`).

## Audit

Use the reporter to see what a doc contains:

```bash
python scripts/footnotes_report.py input.docx
```

## Insert a note (minimal helper)

This repo includes `insert_note.py` which patches OOXML to insert a note.

1. Add a marker into the document where you want the reference:

- `[[FN]]` for a footnote
- `[[EN]]` for an endnote

1. Insert the note:

```bash
python scripts/insert_note.py input.docx --kind footnote --marker "[[FN]]" --text "Footnote text" --out with_fn.docx
python scripts/insert_note.py input.docx --kind endnote  --marker "[[EN]]" --text "Endnote text"  --out with_en.docx
```

1. Render → PNG review:

```bash
python render_docx.py with_fn.docx --output_dir out_fn
```

## Render → PNG review checklist

- Footnote/endnote marker appears in the body where expected
- Footnote text appears at page bottom (footnotes) or note section (endnotes)
- Numbering is correct (no duplicates, starts at 1)
- Long notes wrap nicely (no overlap/clipping)

## Pitfalls

- Some consumers are strict about separator entries in footnotes.xml/endnotes.xml.
- If the marker appears but note text doesn't, run `footnotes_report.py` to confirm:
  - reference IDs exist in `document.xml`
  - note IDs exist in `footnotes.xml`/`endnotes.xml`
- For high-stakes deliverables, verify in Microsoft Word in addition to LO rendering.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)
