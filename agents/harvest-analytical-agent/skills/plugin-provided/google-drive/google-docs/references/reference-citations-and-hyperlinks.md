# Citations And Hyperlinks

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

When to read: any task that includes sources, links, evidence, or source lists.

## Hyperlink Requirement

1. Use readable linked labels instead of naked URLs in narrative sections.
2. Citations must be hyperlinks instead of raw URL text unless the template explicitly requires raw links.
3. Keep citation labels short and descriptive.
4. Resolve hyperlink ranges from exact document text when possible. Prefer `find_text_range` or another text-exact lookup over hand-counted start and end indexes.
5. Link the full visible label, including plural endings or trailing words that are part of the intended citation text. Do not stop the link one character early.
6. If a URL must appear in the document, apply it as a hyperlink to readable label text unless the template explicitly requires the raw URL string to stay visible.
7. This rule still applies inside tables, supporting sections, and structured response areas. Raw pasted URLs are not an acceptable default just because the content lives in a grid or structured block.
8. Never apply hyperlinks to guessed or pre-insertion ranges. Insert the final text first, re-read the live document, then resolve the exact visible label range before applying the link.
9. If a link is meant for a table label or other short visible phrase, target that exact text only. Do not rely on broad row ranges or offsets that can drift after content insertion.

## Citation Behavior

1. Add short source callouts where trust and traceability matter.
2. Keep citations concise and unobtrusive.
3. Prefer linked labels over raw URL dumps in source lists, evidence sections, and supporting notes.
4. After applying a link, verify through connector readback that the label text still matches the intended phrase exactly.
5. If the source block already contains raw URLs from an earlier write, clean them up into linked labels during the final pass instead of leaving them behind.
6. If connector readback shows a partial hyperlink on only part of a word or phrase, treat that as a failed write and repair it before handoff.

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

_Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP_
[Contact](https://lightspeedwp.agency/contact)
