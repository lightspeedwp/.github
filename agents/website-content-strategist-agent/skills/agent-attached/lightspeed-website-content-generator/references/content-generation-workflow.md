# Content Generation Workflow

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

## 1. Classify the task

Identify whether the user wants:

- a single page draft
- a service page
- a solution page
- a lifecycle/process page
- an FAQ page
- page-level FAQs
- CTA blocks
- metadata and schema notes
- case-study copy
- policy/trust copy
- chatbot-safe snippets
- a full Markdown content pack

## 2. Check source maturity

Before drafting, classify source material as:

| Status | Meaning | How to use |
|---|---|---|
| Approved | Reviewed and safe to publish | Can be used directly |
| Received | Supplied but not reviewed | Use cautiously and mark Needs Review |
| Needs Review | Good draft, not final | Draft from it but add review note |
| Needs Rewrite | Current wording is risky or weak | Rewrite carefully and explain why |
| Evidence Required | Claim needs proof | Do not use as fact |
| Legal Review | Policy, privacy, compliance or regulated content | Draft only, add legal/privacy note |
| Not for Chatbot | Internal, private, unverified or too risky | Do not use in chatbot-safe snippets |

## 3. Draft from approved intent

Use the strongest safe source material. Preserve the business intent, but improve clarity, structure and conversion flow.

Prefer:

- specific audience routing
- clear next steps
- proof with evidence notes
- practical explanations
- maintainable WordPress language
- governance-aware AI wording

Avoid:

- overclaiming
- exaggerated AI/ROI promises
- vague transformation language
- pretending draft material is final
- unsupported client outcomes

## 4. Add review metadata

Every output should end with internal notes:

- Review status
- Owner or suggested owner
- Claims used
- Evidence required
- Chatbot-safe status
- Legal/privacy review required
- Suggested next step

## 5. Package outputs

For multi-file outputs, use this structure:

```text
content-pack/
├── README.md
├── 01-homepage.md
├── 02-services.md
├── 03-solutions.md
├── 04-faq.md
├── 05-ctas.md
├── 06-metadata.md
└── source-notes/
    ├── claims-used.md
    ├── evidence-required.md
    └── chatbot-safe-status.md
```

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)
