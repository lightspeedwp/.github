# QA Findings Workflow

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
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
<!-- BADGES-END -->

Use this reference when converting mixed QA evidence into a consistent LightSpeed findings register.

## 1. Source inventory

Start by listing the evidence reviewed:

- source name or link
- source type: test script, screenshot, Figma note, GitHub issue, Asana task, stakeholder feedback, audit report, launch checklist, PRD or implementation note
- source status: Approved Source, Observed Evidence, Stakeholder Reported, Unconfirmed, Assumption or Out of Scope
- date or version if supplied
- gaps or missing context

Do not rely on a finding if the source is unclear. Mark it as `Needs Reproduction` or `Unconfirmed`.

## 2. Normalise each finding

Convert each raw finding into this structure:

| Field | Guidance |
|---|---|
| Finding ID | Use stable IDs such as `QA-001`. |
| Summary | Short action-oriented description. |
| Source | File, issue, screenshot, tester, audit or note. |
| Evidence quality | Reproducible, Observed Evidence, Partial Evidence, Stakeholder Reported, Needs Reproduction, Duplicate, Invalid or Out of Scope. |
| Affected area | URL, page, template, pattern, block, component, form, flow or viewport. |
| Expected result | What should happen. |
| Actual result | What happened. |
| Reproduction steps | Exact steps if known; otherwise state what is missing. |
| Severity | Critical, High, Medium, Low or Improvement. |
| Launch status | Launch Blocker, Must Fix Before Launch, Can Launch With Follow-up, Post-launch Improvement, Needs Reproduction, Duplicate or Out of Scope. |
| Workstream | Use the workstream taxonomy below. |
| Owner role | Accountable LightSpeed role, not a named person unless provided. |
| Specialist route | Most specific related LightSpeed skill for follow-on work. |
| Next action | Fix, reproduce, route, defer, close as duplicate, or escalate. |
| Retest steps | Clear checks required after fix. |

## 3. Workstream taxonomy

Use these workstreams consistently:

- Design parity
- Design handoff
- Block theme
- Block plugin
- Pattern/template
- Content/copy
- Claim/proof
- Accessibility
- Responsive/mobile
- Forms/conversion
- Analytics/tagging
- Redirects/SEO
- Technical SEO
- Schema/AI discoverability
- Performance
- Policy/governance
- Chatbot/source governance
- Launch operations
- Release/handoff
- Post-launch optimisation

## 4. Duplicate handling

When multiple findings point to the same root fix:

1. Keep the clearest finding as canonical.
2. Preserve all affected URLs and evidence in the canonical row.
3. Mark duplicates with the canonical ID.
4. Do not create separate implementation issues unless fixes are independently testable.

## 5. Minimal follow-up questions

Ask follow-up questions only when the answer changes routing or launch status. Good questions are specific:

- Which URL or template shows this issue?
- Is the screenshot from production, staging or Figma?
- Which viewport/browser was used?
- Is this within the approved launch scope?
- Has this already been fixed in a PR or issue?

## 6. Output generation

Always separate:

- launch blockers
- must-fix items
- accepted-risk items
- post-launch items
- needs reproduction
- invalid/duplicate/out-of-scope items
- GitHub-ready issue drafts
- retest checklist
- client-facing summary
- internal LightSpeed notes

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)
