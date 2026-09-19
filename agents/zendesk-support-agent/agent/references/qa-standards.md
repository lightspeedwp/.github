# QA Standards

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

Use these standards when creating, reviewing, or validating instructions, skills, templates, examples, schemas, memory files, fixtures, profiles, scripts, and default outputs for this agent.

## Core standards

- Zendesk remains the primary system of record for support-operational work.
- Every attached app must be represented clearly, but secondary apps must not displace the Zendesk-first workflow.
- Skills must stay narrowly routed, non-overlapping, and deliverable-specific.
- References, templates, examples, schemas, scripts, fixtures, profiles, memory files, and tests must agree with the current instructions.
- A validator-friendly file system is part of the agent contract.
- Material instruction rewrites must update the validation snapshot and any contract-bearing reference files.

## Operating standards

- Default to one primary skill and at most one supporting skill.
- Default to Zendesk evidence before secondary-app context.
- Prefer the smallest complete deliverable over broad unnecessary audits.
- Prefer drafts over consequential writes when the user did not clearly request a write.
- Keep support-operational work separate from downstream product, engineering, repository, document, and delivery work unless the user explicitly asks for that next step.
- Treat audit and validation work as a real operating mode with the same discipline as support work.

## Routing standards

- Every repeated deliverable should map to one primary skill by default.
- Supporting skills may fill evidence, readiness, grounding, or QA gaps, but should not silently replace the primary skill.
- Routing guidance must make clear which skills should not be chained together by default.
- Legacy exception skills must be marked as exception paths, not default routes.
- If routing changes, update the routing inventory, output rules, instructions snapshot, routing tests, and routing validator together.

## Evidence standards

- Do not invent facts, root causes, policy, approvals, refunds, or downstream decisions.
- Distinguish confirmed facts from inferences and unknowns.
- Keep customer-facing outputs stricter than internal diagnostic notes.
- Require the smallest amount of evidence needed for a decision-useful output.

## Output standards

- Repeated deliverables must have practical, structured, validation-friendly output contracts.
- Template-linked outputs must identify the primary skill and any allowed supporting skills.
- A custom output format may change the structure, but not the evidence, safety, or quality bar.
- Supporting skills must not redefine a reply into a handoff, a handoff into an escalation, or a documentation review into a draft by default.

## File and validation standards

- Every material instruction rewrite must refresh `references/instructions.snapshot.md`.
- Every repeated deliverable template must have a paired example and explicit validation coverage.
- Every memory file must have a documented purpose, a stable structure, and validator coverage.
- Profiles and fixtures must have schema-backed validation coverage.
- Markdown validation should check required headings, required placeholder blocks, and obvious structure drift.
- Validation scripts should fail on stale references, missing files, app-coverage drift, unapproved memory content, routing drift, and template/example mismatch.
- Validation tests should explain what each validator is meant to protect.
- When a schema-backed contract changes, update the schema, example, validator, and tests together.

## Review checklist

- Is the workflow still Zendesk-first?
- Do all attached apps have accurate role and write-boundary coverage?
- Do the instructions reference real files and current validation assets?
- Does each attached Zendesk skill have a clear routing role?
- Is the primary skill for each repeated deliverable obvious?
- Are supporting-skill allowances and non-default chains explicit?
- Are output templates and examples still structurally aligned?
- Are memory rules, schemas, examples, and validators aligned?
- Are profile and fixture files still schema-valid?
- Are Markdown-specific validation scripts and tests still checking the right contracts?
- Are the smoke tests and QA tests still checking the right things?
- Can a future editor understand what each reference file, script, schema, fixture, profile, and test is for?

## Acceptable completion standard

A change is only complete when the instruction system is coherent, the reference files match the instructions, the validator inventory reflects the current file set, the main file checks would pass against the updated structure, and the audit leaves no obvious contract drift behind.

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

_This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP._
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)
