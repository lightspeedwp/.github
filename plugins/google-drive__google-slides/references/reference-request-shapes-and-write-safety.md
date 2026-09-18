# Request Shapes And Write Safety

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
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
<!-- BADGES-END -->

When to read: any task that writes through Slides connector APIs.

## Batch Update Shape

Always pass `requests` as structured request objects, not stringified JSON.

Bad:

```json
{"requests":["{\"deleteObject\":{\"objectId\":\"shape1\"}}"]}
```

Good:

```json
{"requests":[{"deleteObject":{"objectId":"shape1"}}]}
```

## Live Object IDs

1. Read the presentation and target slide before writing.
2. Use object IDs from the live slide state.
3. For new objects, use valid Google Slides IDs: 5-50 characters, starting with an alphanumeric character or underscore.
4. If creating a slide and editing placeholders in one batch, create valid placeholder ID mappings first and reference those IDs later in the same batch.
5. When editing an existing slide, following a template/reference deck, or creating from a layout, build a slot map from the live slide state before creating new page elements. Prefer suitable existing placeholder, text, image, chart, and table object IDs over new object IDs for primary content.

## Duplicated Slide Ordering

When duplicating slides that must land in a specific sequence, use a two-pass workflow:

1. First call `duplicateObject` only. Do not combine `duplicateObject` and `updateSlidesPosition` in the same batch.
2. Re-read the presentation outline after the duplicate batch completes. Record the actual slide order and the new slide object IDs returned or observed.
3. If the new slides are not already in the intended sequence, run a separate `updateSlidesPosition` batch using the observed slide object IDs in their current presentation order. Google rejects move requests when `slideObjectIds` are not listed in current presentation order.
4. Only rewrite slide content after the new slides exist and their order is grounded, unless the content rewrite does not depend on slide order.
5. Never change the requested story/content order to match an accidental duplicate order. Fix the slide order instead.

## Inserted Layout Placeholder Contract

This applies to any slide created from a layout, including existing-deck edits. It is not limited to template/reference-deck copy workflows.

1. After `createSlide` with `slideLayoutReference` or `predefinedLayout`, re-read the new slide before final handoff and inventory every inherited placeholder object exposed by the connector, including `shape.placeholder`, image placeholder metadata, table placeholder metadata, or equivalent layout/master placeholder fields.
2. Treat title, body, picture, chart, table, and other content-bearing placeholders as required slots unless they are clearly decorative, a slide number, a footer, or another non-content element.
3. Prefer `placeholderIdMappings` when you need to edit layout placeholders in the same batch as `createSlide`; otherwise use the generated placeholder object IDs from the post-create slide read.
4. Fill, replace, or intentionally delete every inherited content-bearing placeholder. Empty placeholder objects are unresolved even when they contain no visible prompt text.
5. Do not create new primary text, image, chart, table, or diagram objects while a suitable inherited placeholder remains empty. If the layout does not have the right slots for the intended content, choose a different layout/pattern or split the content.
6. If a placeholder is not part of the intended final design, delete it explicitly with `deleteObject` after grounding the slide and confirming the object ID.
7. Thumbnail checks are necessary but insufficient for this contract because empty inherited placeholders may be invisible in rendered thumbnails. The final check must inspect connector JSON for unresolved placeholder metadata.

## Geometry Safety

1. Treat the slide page size as a hard boundary.
2. Keep text boxes, images, tables, and shapes inside the slide bounds unless intentionally full-bleed.
3. Slides transforms place an element's upper-left corner, not its center.
4. Before moving or resizing, classify the object as text box, shape, line/connector, image, table, or chart.
5. Use small batches and re-read the slide after writes that change text flow, geometry, or object membership.

## Text Style And List Safety

1. Inspect the existing text elements and style runs before rewriting a text object.
2. If an object intentionally mixes title, subtitle, emphasis, link, or label styles, preserve that hierarchy with explicit fixed ranges after inserting the new text.
3. Do not apply `updateTextStyle` with `textRange.type: ALL` to any intentionally multi-style text object. That flattens the hierarchy and is a formatting defect.
4. Re-read paragraphs after list edits. A paragraph that contains only spaces, tabs, or a newline but still has bullet metadata is an unresolved blank bullet and must be deleted or unbulleted.
5. Preserve meaningful links and verify their target URLs after text replacement.

## Table, Card, And KPI Semantics

1. Treat highlight colors, bold totals, selected states, rank markers, arrows, and status colors as semantic content.
2. Keep inherited or copied emphasis only when the same meaning applies to the current content.
3. When a reference pattern's emphasis does not transfer, neutralize it or move it to the correct cell/card rather than preserving it cosmetically.
4. Verify table and card emphasis against the content, not merely against a reference thumbnail.

## Source Speaker Notes

Use these rules when copying, adapting, or migrating slides from a source deck:

1. Read each source slide's notes page and record `notesPage.notesProperties.speakerNotesObjectId` when speaker notes exist.
2. Treat notes as part of the slide's content contract. Copy them to the corresponding destination slide unless the user explicitly excludes them.
3. Use the destination slide's live speaker-notes object ID for `deleteText` and `insertText`; never reuse a source notes object ID in another slide.
4. After the source-based adaptation, compare source and destination slides with notes, then spot-check exact note text on representative and high-risk slides.

## Destructive Writes

1. Before deleting, replacing, or rewriting multiple slides, state or record exactly which slides and objects will change.
2. Preserve slide order, titles, speaker notes, charts, tables, links, existing evidence, and unrelated elements unless the user asked to change them. Preserve active, accessible media type and source identifier; follow the documented fallback path for unavailable media.
3. Do not layer new primary content over stale placeholders. Delete or replace the obsolete placeholder once the target is grounded.

## New Object Restraint

1. When editing an existing slide, following a reference/template pattern, or creating from a layout, do not use `createShape` or `createImage` as the default while suitable editable slots remain available.
2. First look for an existing editable slot: a placeholder, text box, image frame, chart frame, table cell, or reusable non-placeholder object from the selected pattern.
3. If the chosen slide lacks a suitable slot, choose a different pattern/layout or split the content before adding freeform primary content.
4. For a genuinely net-new composition, new objects are expected, but create only the objects required by the slide plan and align them to the deck's visual system.
5. When a new object is necessary in an existing or template-following slide, record its object ID and reason, keep it aligned to the selected slide pattern, and verify that no suitable content-bearing placeholder or inherited scaffold was bypassed.

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)
