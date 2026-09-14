# OOXML: Tracked changes (true redlines)

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

Use OOXML patching when the user needs *real* Word tracked changes, i.e. redlines that appear as insertions/deletions in Word.

`python-docx` does **not** provide a first-class API for tracked changes.

## Minimum wiring

Tracked changes typically involve:

- `word/settings.xml`: add `<w:trackRevisions/>` to enable tracking mode
- `word/document.xml`: wrap inserted runs with `<w:ins ...>` and deletions with `<w:del ...>`

## Key rules (to avoid broken docs)

- IDs: `w:id` should be an integer string and **must not collide** with existing ids in the document
- `w:author` and `w:date` are strongly recommended
- Deletions must use `<w:delText>` (not `<w:t>`) inside `<w:del>`
- Word can split text into many runs; operate at run granularity

## Example pattern: replace a word via tracked delete + tracked insert

Pseudo-structure:

```xml
<w:del w:id="202" w:author="ChatGPT" w:date="...">
  <w:r><w:delText> old text </w:delText></w:r>
</w:del>
<w:ins w:id="203" w:author="ChatGPT" w:date="...">
  <w:r><w:t> new text </w:t></w:r>
</w:ins>
```

## Recommended: use the helper script

See `scripts/docx_ooxml_patch.py` for a runnable patcher that:

- enables `<w:trackRevisions/>`
- converts an existing `<w:ins>` to `<w:del>` and inserts a new `<w:ins>`

The CLI defaults to auto-generated `w:id` values (`--del-id auto --ins-id auto`) by scanning existing ids and choosing new ones.

## Verification

- Render to PDF/PNG for layout sanity (`tasks/verify_render.md`)
- Confirm Word shows the change as tracked
- Be aware: renders usually show redlines, but always verify the OOXML is correct too

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

_Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!_
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

_Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!_
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

_Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!_
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)
