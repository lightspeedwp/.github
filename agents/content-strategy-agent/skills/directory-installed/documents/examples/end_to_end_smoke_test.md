# End-to-end smoke test (optional)

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
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
<!-- BADGES-END -->

This is a quick checklist to validate the environment and the helper scripts.

## 1) Render check

```bash
python render_docx.py /mnt/data/some.docx --output_dir /mnt/data/out
```

## 2) Add header date, page numbers, hyperlink

```bash
python scripts/docx_ooxml_patch.py /mnt/data/some.docx \
  --header-date "Date: 01/05/2026" \
  --add-page-numbers \
  --hyperlink-first "https://example.com"
```

## 3) Add comment (structural)

```bash
python scripts/docx_ooxml_patch.py /mnt/data/some.docx \
  --add-comment --comment-text "Hello comment"  # optionally add --contains "..." to anchor elsewhere
```

## 4) Tracked replace

If you already have a `<w:ins w:id="102">` in the doc:

```bash
python scripts/docx_ooxml_patch.py /mnt/data/some.docx \
  --enable-track --tracked-replace-ins-id 102 --new-text " HELLO"
```

## 5) Verify visually

Use `tasks/verify_render.md` (DOCX → PNG) and inspect.

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

_Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP_
[Contact](https://lightspeedwp.agency/contact)

_Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP_
[Contact](https://lightspeedwp.agency/contact)

_Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP_
[Contact](https://lightspeedwp.agency/contact)

_Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP_
[Contact](https://lightspeedwp.agency/contact)

_Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP_
[Contact](https://lightspeedwp.agency/contact)

_Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!_
