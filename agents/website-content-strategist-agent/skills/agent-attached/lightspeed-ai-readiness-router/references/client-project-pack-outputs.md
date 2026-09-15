# Combined Client Project Pack Outputs

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

Use this structure when enough specialist outputs exist to assemble a LightSpeed AI readiness project pack.

```text
[client-slug]-ai-readiness-pack/
├── README.md
├── 00-source-register.md
├── 01-ai-readiness-assessment.md
├── 02-governance-discovery-summary.md
├── 03-content-collection-checklist.md
├── 04-ai-governance-guide.md
├── 05-faq-and-source-curation.md
├── 06-chatbot-planning-brief.md
├── 07-roadmap-and-proposal-notes.md
└── source-notes/
    ├── evidence-reviewed.md
    ├── missing-information.md
    ├── assumptions-and-risks.md
    └── approval-gates.md
```

## README template

```markdown
# [Client Name] - AI Readiness Project Pack

## Purpose

This pack summarises the current AI readiness position, governance requirements, content and source readiness, chatbot planning recommendations, and proposal-ready next steps.

## Audience

- Internal LightSpeed delivery team
- Client stakeholders, where marked client-facing

## Files

1. Source register
2. AI readiness assessment
3. Governance discovery summary
4. Content collection checklist
5. AI governance guide
6. FAQ and source curation notes
7. Chatbot planning brief
8. Roadmap and proposal notes

## Evidence status

- Approved sources: [list]
- Client-provided but unverified: [list]
- Internal drafts: [list]
- Missing / requested: [list]

## Recommended next step

[Insert recommended LightSpeed next step and responsible role.]

## Review notes

This pack supports operational planning and proposal preparation. Legal, privacy and regulatory requirements should be confirmed with a qualified adviser.
```

## Source register fields

Use these fields when creating or requesting a source register:

| Field | Purpose |
|---|---|
| Source name | Human-readable source title. |
| Source type | Website page, Google Doc, spreadsheet, transcript, email, ticket, Figma, GitHub issue, analytics export or other. |
| Owner | Client, LightSpeed, third party or unknown. |
| Status | Approved, client-provided, internal draft, stale, inferred, missing or unverified. |
| Last reviewed | Date or `unknown`. |
| Used for | Readiness, governance, content, FAQ, chatbot, schema, claims, proposal or launch QA. |
| Risk notes | Any accuracy, freshness, privacy, claims or approval concerns. |

## Pack assembly rules

- Keep internal-only caveats out of client-facing sections unless they are appropriate to share.
- Do not hide missing evidence. Put it in `missing-information.md` and summarise the impact.
- Include assumptions and exclusions in proposal notes, not only in internal source notes.
- Link each recommended next action to a responsible role or team where possible.

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
