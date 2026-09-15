# Help Centre overlap guide

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

Use this guide when deciding whether to create a new article or update existing documentation. Keep the check proportionate: the goal is to avoid duplicate or hard-to-find knowledge, not to run a broad content audit.

## Search intent first

Identify the customer intent before choosing a documentation path. Customer intent is the task, question, error, limitation, or workaround the customer is trying to resolve.

Use customer wording before internal terminology:

- Exact error messages or warning text.
- Setup task names customers use.
- Feature names customers recognise.
- Workaround phrases used in replies.
- Limitation wording from public replies.
- Known issue symptoms.
- Product area plus action, such as "connect account", "reset sync", or "export report".

## Suggested overlap searches

Search existing public, internal, and macro knowledge with a small set of targeted queries:

1. Exact customer error message or symptom.
2. Customer task plus product or feature name.
3. Internal product term plus customer-facing term.
4. Workaround phrase or limitation wording.
5. Existing macro title or repeated reply wording, if available.
6. Known issue language, if the case may be incident-linked.

If connector access is permission-limited, use the supplied evidence and name the smallest missing Help Centre search instead of blocking the review.

## Prefer updating an existing article when

- An article already serves the same customer intent.
- The article is mostly correct but stale, incomplete, ambiguous, or missing a caveat.
- Customers still contact support because the existing article lacks exact error wording, prerequisites, troubleshooting steps, screenshots, or workaround boundaries.
- A short section, FAQ, warning, or link would close the gap without creating another article.
- Internal guidance already exists and can safely be promoted or summarised for the relevant audience.

## Prefer creating a new article when

- No existing article covers the same customer intent well.
- The topic is a distinct task, question, limitation, or known workaround customers will search for directly.
- Adding the content to an existing article would bury the answer or make the original article unfocused.
- The guidance has enough stable, customer-safe detail to stand alone.
- Publishing would reduce repeated tickets, repeated agent effort, onboarding friction, or customer confusion.

## Prefer internal-only when overlap is sensitive

Keep or create internal support knowledge instead of public Help Centre content when the reusable guidance depends on:

- Private tooling or logs.
- Account-specific checks.
- Billing, security, legal, privacy, or commercial judgement.
- Unpublished behaviour or unreleased changes.
- Staff-only escalation paths.
- Agent judgement that should not be turned into customer instructions.

## Mark overlap as unknown when

Use `update existing: unknown` or `readiness level: needs one more check` when:

- Help Centre, macro, or internal article search was not available.
- Results were permission-limited.
- Supplied notes mention an article but do not identify it.
- The likely article owner is unclear.
- Existing content may be stale, but the current content was not available to inspect.

## Smallest missing overlap checks

Use one concrete check rather than a generic request for more context:

- Search Help Centre for the exact error message.
- Search internal articles and macros for the workaround phrase.
- Check whether the named article already covers the customer intent.
- Check whether the existing article is public, internal, or macro-only.
- Confirm whether the existing article is stale or missing the customer-facing caveat.

## Output hints

When overlap influences the decision, say so explicitly:

- "Update existing" because the same customer intent already has an article but lacks the workaround.
- "Create new" because no article appears to own this distinct search intent.
- "Needs one more check" because Help Centre overlap was not available in the current session.

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
