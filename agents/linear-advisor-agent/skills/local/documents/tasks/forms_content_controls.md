# Task: Forms / content controls (SDTs)

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

Use this when the user wants a **fillable DOCX template** (fields, dropdowns, checkboxes) or when you need to **populate** an existing template that contains Word content controls.

`python-docx` does not support SDTs. Use the helper script:

- `scripts/content_controls.py`

This task doc focuses on **plain-text SDTs** (the most common case for templates).

## Golden path

1. **Make placeholders visible (authoring step)**
   - Write placeholders like `{{NAME}}`, `{{DATE}}`, `{{EMAIL}}` in the DOCX where values should go.
   - If you control authoring, keep each placeholder contiguous (a single token).

2. **Wrap placeholders into SDTs**

```bash
python scripts/content_controls.py /mnt/data/template.docx wrap_placeholders \
  --output /mnt/data/template_sdt.docx
```

1. **Populate SDTs by tag**

```bash
python scripts/content_controls.py /mnt/data/template_sdt.docx fill \
  --set NAME="Ada Lovelace" \
  --set EMAIL="ada@example.com" \
  --output /mnt/data/filled.docx
```

1. **Render for QA**

```bash
python render_docx.py /mnt/data/filled.docx --output_dir /mnt/data/out_forms
```

Inspect `page-<N>.png` at 100% zoom.

## Listing / debugging

List all SDTs (tag, alias, visible text, part location):

```bash
python scripts/content_controls.py /mnt/data/template_sdt.docx list --json
```

## Pitfalls / lessons learned

- **Markers split across runs:** if Word splits `{{NAME}}` into multiple runs (common when styling is applied mid-token), the wrapper may miss it. Fix by retyping the placeholder so it is one contiguous token.
- **SDTs in footnotes/comments:** this helper patches document.xml + headers/footers. If a template uses SDTs in other parts, you may need a custom patch.
- **Rich content controls** (dropdown, checkbox, date picker): those require additional SDT properties/parts. This bundle does not attempt full fidelity.

## Deliverables

- Deliver **only the final DOCX** requested by the user.
- PNGs / optional PDFs are for internal QA only unless explicitly requested.

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
