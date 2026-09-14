# Pricing Rules

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

## Purpose

Lock the pricing logic the estimator must use after package routing and audit review.

## Rule Order

1. Confirm the correct base package from `/packages/package-index.md` and the relevant package spec.
2. Confirm the audit-first rule has been applied.
3. Confirm the required shared values from `/packages/assessment-values.md`.
4. Apply add-on rules only after the base package remains correct.
5. Check approval and custom-scope rules before treating any price as final.

## Fixed-Fee Pricing Logic By Package

### AI Readiness Foundation

Treat as fixed-fee only when the site is a standard WordPress implementation, the audit shows no severe irregularities, and scope stays within the agreed baseline readiness work.

### AI Search and Structured Data

Treat as fixed-fee only when template structure is reasonably standard, schema scope stays within agreed baseline types, and no major technical blocker is found.

### AI Chatbot Planning Workshop

Treat as fixed-fee only when the work remains discovery and planning, with standard workshop depth and no unusually complex governance programme.

### AI Chatbot with AI Engine — Starter

Treat as fixed-fee only when the chatbot remains a simple FAQ, service, or enquiry-routing assistant with approved source content and no advanced integrations.

### AI Chatbot with AI Engine — Tailored

Treat as fixed-fee only when the tailored flow stays within standard configurable chatbot behaviour and does not require major integrations, bespoke application logic, or major source remediation.

### Yoast AI Content Training

Treat as fixed-fee only when the work stays within a standard enablement format and does not expand into strategy, copy delivery, or multi-team programme design.

### Ongoing AI Governance and Optimisation Retainer

Treat as fixed-fee only when support stays inside the standard cadence and optimisation remit rather than project-scale delivery.

## Pricing Preconditions

Do not treat pricing as final until the agent has confirmed:

- correct base package
- fixed-fee eligibility status
- required shared values
- any add-ons that genuinely apply
- any assumptions that still affect price confidence

## Final Pricing Rule

If required values are missing, evidence is weak, or a custom-scope trigger is present, present the commercial outcome as provisional, audit-first, or custom-scope instead of final fixed-fee pricing.

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
