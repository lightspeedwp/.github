# Memory Policy

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

This skill should be conservative about Memory because support documentation and case facts can be sensitive, temporary, or customer-specific.

## Default rule

Do not save anything to Memory by default.

## Safe to consider saving only when explicitly requested or clearly durable

Only consider saving reusable, non-sensitive, document-level patterns that will improve future shared-agent behaviour, such as:

- stable routing preferences between Zendesk skills
- approved naming conventions for documentation sources
- durable source-of-truth locations, such as "refund policy lives in Help Center collection X"
- reusable documentation risk labels or workflow conventions
- broad support documentation rules that are not customer-specific and not confidential beyond the shared workspace context

Even then, save only the minimal useful rule, not full document contents.

## Do not save by default

Never save these items by default:

- customer names, account details, ticket IDs, emails, order IDs, invoices, payments, or refund amounts
- case-specific facts, diagnosis, exception approvals, or commitments
- private customer communications or sensitive attachments
- internal-only policy text copied from documents
- security, legal, compliance, health, financial, or other sensitive details from a case
- temporary documentation gaps, draft wording, or stale article snapshots
- teammate-specific assumptions, such as who owns a workflow or who has connector access

## If the user explicitly asks to remember something

If the user explicitly asks to save a durable rule, keep it narrow and reusable. Prefer saving a routing or source-location rule over saving policy content.

Good memory candidate:

- "For the shared Zendesk agent, treat the public Help Center refund policy article as the first source to check before internal refund notes."

Unsafe memory candidate:

- "Customer ACME received a refund exception on ticket 12345 because their plan was misconfigured."

## If unsure

Do not save. Ask for confirmation only when Memory is necessary for future shared-agent behaviour. Otherwise keep the information in the current grounding brief only.

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)
