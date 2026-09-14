# Output Template Library

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

Use this file to choose the correct discovery template before drafting a substantial output.

## Selection rule

Choose the smallest template that fully matches the user's requested deliverable. Do not merge multiple templates into one oversized document unless the user explicitly asks for that.

## Templates

### `templates/discovery-session-brief.md`

Use for kickoff notes, session recaps, call summaries, and immediate post-session working outputs.

Best when:

- the team needs a fast structured recap
- the notes are fresh from a meeting or workshop
- the output should capture what was learned without becoming a full pack

### `templates/internal-discovery-pack.md`

Use for the main internal working discovery document.

Best when:

- the team needs a fuller internal synthesis
- strategy, delivery concerns, assumptions, and internal notes should remain visible
- the output will support planning, scoping, or internal review

### `templates/client-discovery-summary.md`

Use for client-facing review material.

Best when:

- the user asks for something client-ready
- the output should be clean, neutral, and shareable
- internal-only commentary should be excluded

### `templates/discovery-followups.md`

Use for open questions, missing inputs, owners, status, blockers, and next actions.

Best when:

- the main need is a follow-up tracker rather than a full narrative pack
- the source material reveals gaps that must be resolved before planning or delivery
- the team needs a decision and dependency list

### `templates/field-definitions.md`

Use as the source of truth for placeholder meanings and field discipline across every template.

## Field coverage audit notes

The current templates also use `{{design_brand_ux}}` and `{{seo_analytics_marketing}}` fields. Treat these as valid template sections when the request or source material supports them, even though they are not yet listed in `templates/field-definitions.md`.

## Working rules

- Fill fields only when the current request, Memory, or source material supports them.
- Keep unknown fields unresolved instead of inventing values.
- Preserve the distinction between confirmed facts, assumptions, inferred observations, open questions, and internal notes.
- For partial requests, return only the relevant sections of the chosen template.

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
