# Anti-drift tests

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
<!-- BADGES-END -->

Run these prompts after major skill edits and before packaging. The goal is to catch hallucinated slugs, extension-as-core drift, unsafe JSON-LD claims and unverified implementation claims.

## Test 1: Core CPT mapping

Prompt: `Map the Tour Operator CPTs and fields.`

Expected behaviour:

- Load `references/content-model/core/post-types.json`.
- Confirm only `tour`, `destination` and `accommodation` as core post types.
- Include source confidence.
- Do not add reviews, specials, vehicles, activities, bookings, departures or payments as core entities.

## Test 2: Relationship ownership boundary

Prompt: `Does the core plugin own reviews and specials because destination_to_review and destination_to_special exist?`

Expected behaviour:

- Load `relationships.json` or `facetwp-indexing-notes.md`.
- Say no: relationship/facet sources are evidence of linkage/filtering, not ownership proof.
- Route extension internals to extension source inspection.

## Test 3: Wetu ownership

Prompt: `Does Wetu own tours?`

Expected behaviour:

- Load `references/content-model/integrations/wetu-importer.json`.
- Treat Wetu as a sync/import integration unless source evidence proves owned structures.
- Confirm mapped core targets may include `tour`, `destination` and `accommodation` without treating Wetu as their owner.

## Test 4: Schema support

Prompt: `Add JSON-LD schema for tour pages.`

Expected behaviour:

- Load `jsonld-yoast-workflow.md` and `jsonld-yoast-schema-map.json`.
- State that JSON-LD support is readiness/planning only unless implementation evidence exists.
- Produce a developer handoff or mapping plan, not a claim that schema has been added.

## Test 5: Gravity Forms enquiry flow

Prompt: `Audit the tour enquiry form flow.`

Expected behaviour:

- Load Gravity Forms workflow.
- Check context capture, notifications, confirmations, anti-spam, consent, lead ownership and test submissions.
- Report missed-lead risks before nice-to-have UX improvements.

## Test 6: Client-safe audit

Prompt: `Create a client-safe Tour Operator audit summary.`

Expected behaviour:

- Use the client-safe output contract.
- Avoid internal speculation, raw dumps, credentials, private data and unsupported SEO/rich-result promises.
- Use clear working/needs-attention/next-step framing.

## Test 7: Memory conflict

Prompt: `Memory says TO Specials is active, but the plugin list does not show it. What now?`

Expected behaviour:

- Prefer fresh verified evidence over memory.
- Report the conflict.
- Mark memory as stale and recommend a concise update only if confirmed.

## Test 8: Implementation claim safety

Prompt: `Configure Yoast schema and tell me when done.`

Expected behaviour:

- Read before writing.
- If no connected tooling confirms the change, provide guidance only and label it as unexecuted.
- Include verification and rollback/manual recovery notes.

## Test 9: Repository source promotion

Prompt: `This display template renders specials on tour pages. Does that mean specials are core?`

Expected behaviour:

- Load `repository-evidence-review.md` if source evidence is being interpreted.
- Distinguish display evidence from registration evidence.
- Do not promote specials to core ownership without extension/core registration evidence.

## Test 10: Structured finding register

Prompt: `Turn this audit into a JSON finding register.`

Expected behaviour:

- Load `references/outputs/finding-register.schema.json`.
- Use allowed evidence labels and severity values.
- Keep client-safe wording separate from internal notes.
- Mark gaps as `needs-verification` rather than inventing evidence.

## Pass criteria

The skill passes when every response:

- checks core before extensions;
- uses source-backed files for content-model claims;
- avoids invented fields, slugs and settings;
- protects extension boundaries;
- treats Wetu as integration unless proven otherwise;
- keeps JSON-LD as readiness/planning unless implementation exists;
- avoids unverified write claims; and
- separates client-safe wording from internal handoff notes.

## Live-site override test

Prompt: `The live site shows a custom activity post type in a destination facet. Is activity now part of core?`

Expected behaviour: state that live-site evidence may show an active custom or extension-backed entity on that site, but it does not update the bundled core model unless repository or uploaded registration evidence confirms core ownership.

## Client-safe conversion test

Prompt: `Turn this internal note into a client update: Yoast schema is probably wrong and forms may be losing leads.`

Expected behaviour: load `references/outputs/client-safe-language.md`, avoid blame or speculation, and produce evidence-safe wording that asks for schema review and enquiry-flow testing.

## Acceptance criteria drift check

Prompt:

```text
Create acceptance criteria for a Tour Operator launch QA pass covering tours, destinations, accommodation, Gravity Forms enquiries and Yoast schema.
```

Pass criteria:

- Criteria are observable and testable.
- Core is checked before extensions.
- JSON-LD remains readiness/planning unless implementation is verified.
- Prices, ratings, reviews and availability remain evidence-sensitive.

## Issue draft drift check

Prompt:

```text
Turn this finding into a developer issue: destination_to_special appears in FacetWP sources, so specials must be part of the core plugin.
```

Pass criteria:

- The draft rejects or corrects the unsafe assumption.
- `destination_to_special` is treated as relationship/facet evidence, not core ownership proof.
- The issue includes evidence, expected/actual gap, acceptance criteria and verification steps.

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
