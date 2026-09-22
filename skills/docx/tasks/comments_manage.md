# Comments: Extract, Remove, or Preserve for Review

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
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![labeling-unified](https://github.com/lightspeedwp/.github/actions/workflows/labeling-unified.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling-unified.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
[![workflow-lint](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml)
<!-- BADGES-END -->

## Goal

Handle reviewer comments in a `.docx` without confusing intermediate artifacts.

Common situations:

- **Review mode**: keep comments and deliver a commented `.docx`.
- **Final mode**: remove comments (and optionally accept tracked changes) and deliver a clean `.docx`.
- **Triage mode**: extract comments into a machine-readable report (JSON/Markdown) for summarization.

> Word "resolved" state is not reliably round-trippable with `python-docx` alone. This skill focuses on **reliable** operations.

## Adding comments (true Word comments)

If the task is to *insert* new comments (not just extract/strip), use the OOXML-level guide: `ooxml/comments.md` (via `scripts/docx_ooxml_patch.py`).

## Add comments at scale (review mode)

For programmatic review injection (multiple comments across the document), use:

```bash
python scripts/comments_add.py input.docx --out reviewed.docx --author "Reviewer"   --add "Payment Terms=Please confirm Net 45 is acceptable."   --add "Governing Law=Prefer Delaware; any constraints?"   --ignore_case
```

Notes:

- Matching looks across normal text **and** deleted text (`w:delText`), so it can still find anchors in docs with tracked changes.
- The script warns on patterns with no matches; add `--require_all` to fail fast.

## Patch / resolve existing comments

For updating or marking comments as resolved:

```bash
python scripts/comments_extract.py reviewed.docx --out comments.json

# Create a separate patch file (JSON). Example:
# {
#   "ops": [
#     {"id": 0, "append": "Follow-up note"},
#     {"id": 0, "replace": "Full replacement text"},
#     {"id": 0, "resolved": true}
#   ]
# }
# (Set "resolved": false to clear the resolved state.)

python scripts/comments_apply_patch.py reviewed.docx patch.json --out reviewed_v2.docx
```

## Extract comments (triage)

Produces JSON with comment text, author, date (if present), and the anchored snippet.

```bash
python scripts/comments_extract.py input.docx --out comments.json
```

## Remove all comments (final mode)

This removes:

- comment ranges and references in story parts (main doc + headers/footers)
- `word/comments.xml` and any comment-related relationships / content type overrides

```bash
python scripts/comments_strip.py input.docx --out no_comments.docx
```

## Recommended finalize workflow

If the requested deliverable is a **clean final DOCX**:

```bash
python scripts/accept_tracked_changes.py input.docx --mode accept --out accepted.docx
python scripts/comments_strip.py accepted.docx --out final_clean.docx
python render_docx.py final_clean.docx --output_dir out_final_clean
```

## Pitfalls

- Comments can be anchored in headers/footers too; always strip across all story parts.
- Some docs include `commentsExtended.xml` (newer Word). This script removes it if present.
- After stripping, render PNGs and verify nothing disappeared around comment anchors.

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

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
