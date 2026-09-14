# Task: Captions + cross-references (SEQ + REF)

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

## When to use

Use this when the user wants:

- **Figure/Table captions** ("Figure 1", "Table 2"…)
- **Cross-references** ("see Figure 3")
- **Stable numbering** for headless rendering/QA

Word implements captions/cross-references using fields:

- `SEQ` for numbering (e.g., `SEQ Table` / `SEQ Figure`)
- `REF` to reference a bookmark (cross-reference target)

`python-docx` does not provide a high-level API for these fields, so this bundle uses OOXML-level helpers:

- `scripts/captions_and_crossrefs.py` — insert caption paragraphs + optional bookmarks around the caption number
- `scripts/insert_ref_fields.py` — replace `[[REF:bookmark]]` markers with real `REF` fields
- `scripts/fields_materialize.py` — materialize `SEQ/REF` *display text* so headless renders show the correct numbers

## The practical gotcha

Fields **do not reliably update** in headless environments. If you only insert field codes (`SEQ`/`REF`), the rendered number may be blank or stale.

For deterministic automation / QA, the reliable pattern is:

1) insert field codes, then
2) **materialize** the field display text

A human can still open the document later and update fields, but for automation you want deterministic visuals.

---

## Workflow

### 1) Add captions (and bookmarks)

This adds captions for tables and/or figures that don't already have a `Caption` paragraph immediately after them.

```bash
python scripts/captions_and_crossrefs.py \
  /mnt/data/in.docx \
  /mnt/data/with_captions.docx \
  --tables --figures \
  --caption_text "Caption" \
  --bookmarks
```

What it does:

- Inserts a `Caption`-styled paragraph after each table / figure paragraph.
- Uses a `SEQ Table` / `SEQ Figure` field for numbering.
- If `--bookmarks` is set, wraps the *caption number* in a bookmark:
  - tables: `tbl1`, `tbl2`, …
  - figures: `fig1`, `fig2`, …

### 2) Insert cross-references (REF)

**Authoring trick:** put explicit markers into the doc where you want a cross-ref, e.g.

- `See [[REF:tbl1]] for details.`
- `As shown in [[REF:fig1]] …`

Then replace markers with real `REF` fields:

```bash
python scripts/insert_ref_fields.py \
  /mnt/data/with_captions.docx \
  /mnt/data/with_refs.docx
```

Notes:

- This script replaces markers in `document.xml` and headers/footers.
- Multiple `[[REF:...]]` markers inside a single text run are supported.
- **Limitation:** the marker must be fully contained in a single text run (`<w:t>`). If Word split the marker across runs, retype it as a single contiguous token.

### 3) Materialize (freeze) SEQ/REF results for deterministic renders

```bash
python scripts/fields_materialize.py \
  /mnt/data/with_refs.docx \
  --out /mnt/data/with_refs_materialized.docx
```

Implementation note: `fields_materialize.py` materializes `SEQ` values before `REF` values so cross-references see the updated caption numbers.

If you only want to materialize one type:

```bash
python scripts/fields_materialize.py /mnt/data/with_refs.docx --out /mnt/data/out.docx --only REF
```

### 4) Render and visually QA

```bash
python render_docx.py /mnt/data/with_refs_materialized.docx --output_dir /mnt/data/out_caps
```

Inspect the PNGs.

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)
