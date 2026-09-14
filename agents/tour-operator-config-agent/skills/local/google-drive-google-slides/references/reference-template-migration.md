# Template Migration

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

When to read: moving source deck content onto a target template deck.

If the user asks for a new deck that follows a provided native Google Slides template or reference deck, read `reference-template-reference-deck-copy-workflow.md` first. Create the destination by copying the provided deck directly, then use this migration reference for content mapping details as needed.

Read `reference-slide-planning-and-layout-selection.md` and `reference-slide-archetype-mapping.md` before migrating beyond the first few slides.

## Workflow

1. Identify the source deck and template deck.
2. Read both decks, including thumbnails for template patterns.
3. Inventory each source slide's substantive text, evidence visuals, charts, tables, links, media objects, and non-empty speaker notes.
4. Define each target slide's narrative job, visual orientation, evidence type, and hierarchy before choosing a layout.
5. Map source slides to template archetypes by narrative job, density, orientation, hierarchy, and semantic intent; use sample labels and compositions as archetype metadata rather than treating slides as interchangeable slot collections.
6. Duplicate from the template, not from the source deck.
7. Port source content into the duplicated template slide by replacing existing template slots first, preserving meaningful style runs and speaker notes.
8. Verify each migrated slide with connector readback, source comparison, and thumbnails.
9. Choose a denser archetype rather than forcing content into a bad fit. Split a source slide only when the user's requested slide-count contract allows it.
10. Finish with a deck-wide consistency and fidelity pass.

## Mapping Rules

- Source deck is truth for substantive content, evidence, links, media intent, and speaker notes.
- Template deck is truth for layout, margins, hierarchy, and style.
- Match by narrative job first: title, section divider, agenda, dense content, metrics/dashboard, image-heavy, quote, or appendix.
- Treat template sample text and defining artwork as semantic signals. Presentation-title, section-opener, phone-demo, quote, summary, total, and status treatments are not interchangeable.
- Preserve claims, bullets, charts, evidence visuals, links, and non-empty speaker notes unless the user asks otherwise.
- For exact migrations, do not silently summarize, shorten, or omit source content.
- Keep repeated roles such as section dividers in a consistent template family.
- Match evidence frames by orientation and required readable area; do not force a landscape screenshot into a portrait frame merely because both use one image slot.
- Do not restyle the old deck slide by slide when a clean template pattern exists.
- Do not leave major template regions accidentally empty.
- Do not bypass usable template placeholders, image frames, tables, charts, or reusable non-placeholder text objects by placing primary content in new freeform objects.
- If the chosen template slide lacks the right content slots, choose another archetype or split the content.
- If no template archetype fits, split the content or flag the slide for human design judgment.

## Verification

Migration is complete only when every migrated slide is presentation-readable, visibly template-consistent, source-faithful, free of unintentional placeholder/sample scaffolding, and checked with both connector readback and a fresh thumbnail after visible writes. Final readback must reconcile text, visuals, charts, tables, links, media type, and non-empty speaker notes.

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
