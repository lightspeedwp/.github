# Skill Routing Rules

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

## Core rule

Always start with the router logic. Route into a specialist workflow only after identifying the client context, project stage, available source material and desired output.

## Workflow sequence

1. AI Readiness Assessor
2. AI Governance Documentor
3. Content Collection Planner
4. AI Chatbot Planner
5. Roadmap or proposal pack

## Routing matrix

| User need | Route to | Notes |
|---|---|---|
| "Is this website ready for AI?" | ai-readiness-assessor | Score readiness, red flags and next steps. |
| "Create a readiness report" | ai-readiness-assessor | Use 0-10 scoring and Markdown report output. |
| "We need an AI policy" | ai-governance-documentor | Create lightweight policy and operational playbook. |
| "Define governance rules" | ai-governance-documentor | Include owners, approvals, source-of-truth, matrix and disclaimer. |
| "What content do we need from the client?" | content-collection-planner | Generate checklist, folder structure and request email. |
| "What content is missing?" | content-collection-planner | Produce content gap report from supplied files or notes. |
| "Plan a chatbot" | ai-chatbot-planner | Require content quality and governance context first. |
| "Use AI Engine" | ai-chatbot-planner | Include AI Engine implementation notes after source/gov checks. |
| "Start a new project" | lightspeed-ai-readiness-router | Run the full wizard and route progressively. |

## When to ask more questions

Ask follow-up questions when:

- source files are missing
- the website URL is missing
- project stage is unclear
- desired output is unclear
- the sector may be high-risk
- client wants chatbot implementation but FAQs or policies are weak
- there is no content owner or approval path
- legal/privacy content is missing or outdated

## When to stop or warn

Do not continue directly into chatbot implementation if:

- approved sources do not exist
- the source list is mostly draft or outdated
- no escalation route exists
- privacy/cookie/terms content is missing in a data-collection flow
- the client operates in a strict-mode sector and governance has not been completed

Provide a warning and recommend governance/content foundation work first.

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)
