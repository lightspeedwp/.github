# Task: Style lint + normalize (format consistency)

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

## When to use

Use this when the user asks for:

- "Make formatting consistent"
- "Apply our style guide"
- "Remove random bold/Calibri/spacing changes"
- "Why do headings look inconsistent?"

This bundle provides:

- `scripts/style_lint.py` — report likely inconsistencies
- `scripts/style_normalize.py` — conservative cleanup (optional)

## The reliable workflow

1. **Render to PNGs** (baseline) and inspect a few problem areas.
2. Run the **lint** to see what is causing drift.
3. Apply **normalization** only if it matches the user’s intent.
4. **Re-render and inspect all pages**.

## 1) Lint

```bash
python scripts/style_lint.py input.docx --json /mnt/data/style_report.json
```

What to look for:

- Lots of `run_direct_formatting`: common cause of “why is this one different”.
- Multiple fonts/sizes in `Normal` body text.
- “Heading-like” paragraphs that are not actually Heading styles.

## 2) Normalize (conservative)

`style_normalize.py` always clears **run-level** direct formatting overrides (bold/italic/underline/font/size/color) so styles drive appearance.

### A) Default normalization (recommended starting point)

```bash
python scripts/style_normalize.py input.docx out_normalized.docx
```

> Tip: `style_normalize.py` also accepts `--out` as an alias:
>
> ```bash
> python scripts/style_normalize.py input.docx --out out_normalized.docx
> ```

### B) Also clear paragraph-level overrides (use sparingly)

This can change layout. Use only when the user wants style-driven spacing/indents:

```bash
python scripts/style_normalize.py input.docx out_normalized.docx --clear_paragraph_format
```

### C) Enforce a simple heading spacing rule

Useful when headings are visually inconsistent (space-after drift):

```bash
python scripts/style_normalize.py input.docx out_normalized.docx --enforce_heading_spacing
```

## Visual QA gate

```bash
python render_docx.py out_normalized.docx --output_dir /mnt/data/out_norm
```

Success criteria:

- No clipped/overlapping text
- Headings and body text are consistent
- Tables remain aligned

## Pitfalls / gotchas

- **Clearing run overrides can remove intentional emphasis.** If the user wants to keep bold/italic emphasis, don’t normalize globally; instead normalize only certain styles/sections.
- Some docs intentionally mix fonts (e.g., code blocks). Consider whitelisting styles rather than global clearing.

## Deliverables

- Deliver **only the final DOCX** requested by the user.
- PNGs / optional PDFs are internal QA only unless explicitly requested.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

_Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team_
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)
