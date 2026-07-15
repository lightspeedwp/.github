# Tour Operator Structured Data

## Status

- Active planning and estimation.

## Approved Decisions

- 2026-07-13: The field mappings supplied in the Google Doc "Tour Operator - Structured Data" are approved as the schema mapping baseline.

## Source Of Truth

- Google Doc: <https://docs.google.com/document/d/1UVfrdgR1o2A-5YuyMbY6Bxevy3EXYfOkj-p6dwXFxMA/edit>
- Tour Operator PR 1148: <https://github.com/lightspeedwp/tour-operator/pull/1148>
- Tour Operator schema branch path: <https://github.com/lightspeedwp/tour-operator/tree/copilot/implement-schema-plan/includes/classes/schema>
- Tour Operator legacy schema path: <https://github.com/lightspeedwp/tour-operator/tree/copilot/implement-schema-plan/includes/classes/legacy/schema>
- TO Team schema: <https://github.com/lightspeedwp/to-team/blob/develop/classes/class-to-team-schema.php>
- TO Reviews schema: <https://github.com/lightspeedwp/to-reviews/blob/develop/classes/class-to-review-schema.php>
- TO Specials schema: <https://github.com/lightspeedwp/to-specials/blob/develop/classes/class-to-specials-schema.php>

## Current Evidence Summary

- PR 1148 is an open draft PR against `develop` for Tour Operator, adding new schema helpers and graph pieces for Tour, Accommodation, and Destination.
- PR 1148 changed six files: legacy schema orchestrator, schema helper, three schema pieces, and helper tests.
- Extension schemas for Team, Reviews, and Specials still need alignment with the approved mappings.

## Open Loops

- Confirm whether PR 1148 should be revised in place or superseded by a new implementation branch.
- Confirm whether archive pages, static pages, blog posts, gallery/video schema, and page selector schema are in this release or a later phase.
- Review current and legacy schema loading to avoid duplicate schema output.
- Validate one complete test entry per covered post type with all relevant fields populated.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
