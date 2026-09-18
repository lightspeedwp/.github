# Safety and Governance

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

Use this reference when proposed evolution touches tools, code execution, memory, connectors, customer data, external systems, or irreversible changes.

## Non-negotiable boundaries

- Do not create autonomous self-modifying systems.
- Do not claim an agent improved itself unless a specific human-approved change and evaluation are documented.
- Do not run generated code outside an isolated sandbox.
- Do not grant new tools, connector permissions, data access, or external actions without explicit user approval.
- Do not store sensitive personal data, secrets, credentials, private customer data, or short-lived incident details in durable memory unless explicitly requested and allowed by policy.
- Do not optimise for benchmark scores by weakening safety, privacy, or honesty constraints.

## Approval levels

Treat these as separate gates. Do not assume approval at one level grants approval at the next.

| Level | What is allowed | Requires |
|---|---|---|
| Proposal | Analyse, recommend, and draft mutations in chat. | User request for review or ideas. |
| Local package | Create or update files in a local sandbox and return a zip. | Explicit request to proceed, update, package, or create the deliverable. |
| Connected edit | Edit repo files, Drive docs, tickets, tasks, calendars, emails, CRM records, or other connected systems. | Explicit target, action, and approval for that system. |
| Publication | Install, publish, replace, or enable a skill/agent in a live workspace. | Explicit publication approval and any required validation. |
| Permission change | Add tools, connectors, scopes, memory retention, network access, or irreversible actions. | Explicit approval plus a safety review. |

## Approval gates

Require approval before:

- Installing, packaging, publishing, or replacing a skill.
- Editing a repo, connected document, ticket, calendar, email, CRM, or project-management record.
- Changing allowed tools, connector scope, or data retention rules.
- Adding scripts that execute network calls, shell commands, browser automation, or file deletion.
- Removing existing safety constraints or review steps.

When the user asks directly for a packaged deliverable, approval to create the local package is implied. Approval for external installation or publication is not implied.

## Sandboxed evaluation

For scripts or generated code:

1. Inspect the code for file deletion, network calls, subprocess usage, dynamic imports, secrets handling, and permission changes.
2. Run only representative safe commands in the local sandbox.
3. Capture command, result, and limitation.
4. If testing is skipped, state why and mark confidence lower.

## Memory policy

Store only durable, reusable preferences or decisions that will improve future runs. Prefer local archive entries for run-specific observations.

Good candidates:

- Stable evaluation criteria.
- Approved routing rules.
- Reusable output templates.
- Long-lived tool boundaries.
- Version decisions and rollback notes.

Poor candidates:

- Raw private feedback logs.
- Secrets, credentials, tokens, or private keys.
- Sensitive personal attributes.
- Temporary project status.
- Unverified research claims.
- One-off rejected ideas with no future value.

## Risk labels

- **Low**: wording, formatting, examples, small clarification.
- **Medium**: workflow order, routing changes, output contract changes.
- **High**: tool permissions, code execution, connector writes, memory policy, safety gates.
- **Blocked**: missing evidence, unsafe request, unavailable source, or unclear authority.

## Safe redirect for autonomous requests

When asked to build an agent that rewrites itself without review, respond with a governed alternative:

> I can help design a human-approved evolution loop: the agent records feedback, proposes versioned changes, evaluates them against tests, and waits for approval before anything is applied.

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)
