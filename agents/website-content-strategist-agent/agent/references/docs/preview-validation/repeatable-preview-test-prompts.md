# Repeatable preview test prompts

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

## Purpose

Use these prompts with the example context files so preview runs can be repeated consistently across the current reference projects while testing source authority, routing quality, readiness judgement, and next-step recommendations.

## How to use

1. Pick one project from the example-contexts index.
2. Open the matching example context file.
3. Use one prompt below without rewriting it unless you are intentionally testing prompt variation.
4. Compare the result against the preview QA checklist.
5. Change only one variable at a time when iterating.

## Cross-context baseline prompts

### Confirmed context and routing review

Use the selected example context as the project context. Review the referenced sites, source files, design references, repositories, and documentation sources. Tell me what context is confirmed, what is still missing, what the safest current assumptions are, the best workflow to run next, the readiness state, what should be saved only if confirmed, and the single best next step.

### Source-of-truth review

Use the selected example context as the project context. Review the source set and explain which references should control planning decisions, implementation truth, component or layout intent, and public-facing messaging. Flag any likely source conflicts, authority gaps, or approval gaps.

### Readiness and approval review

Use the selected example context as the project context. Assess whether the project appears planning-ready, review-ready, approval-ready, approved-for-use, or blocked-from-approval based on the available sources. Explain the main limitation and the single most useful next workflow.

### Workflow recommendation review

Use the selected example context as the project context. Decide which upstream workflow should run first, explain why it is the most blocking stage, and state the clearest next handoff after that workflow completes.

## LightSpeedWP.Agency prompts

### Agency source authority review

Use the LightSpeedWP.Agency example context. Compare the live site, Figma prototype site, dev site, theme repo, plugin repo, Drive folder, Figma design system, and Figma Make prototype. Explain which sources should control positioning, service-page intent, implementation truth, component behaviour, and public-facing messaging.

### Figma-to-WordPress alignment review

Use the LightSpeedWP.Agency example context. Review the Figma system, Figma Make prototype, live site, dev site, theme repo, and plugin repo. Identify the biggest signs of design-versus-build drift, the safest current assumptions, and the one workflow that should happen next before launch QA or copy revision.

### Agency planning and CTA review

Use the LightSpeedWP.Agency example context. Assess whether the strongest available sources clearly support the site's positioning, service architecture, CTA logic, and next-step routing. Explain what looks confirmed, what remains weak, and what should be reviewed before page drafting or launch decisions.

## TourOperator.solutions prompts

### Product and demo authority review

Use the TourOperator.solutions example context. Compare the live product site, demo site, dev site, repository, Drive folder, and Figma design system. Explain which sources should control planning, implementation, design-system decisions, and public-facing messaging.

### Tourism planning-readiness review

Use the TourOperator.solutions example context. Assess whether the available material is strong enough for planning, drafting, review, or launch QA. Identify the biggest source or approval gap and recommend the one workflow that should happen next.

### Product-versus-demo comparison review

Use the TourOperator.solutions example context. Review the live site, demo site, and dev site alongside the repository, Drive folder, and Figma system. Explain where authority likely sits, where drift is most likely, and how the next review should be scoped.

## LSX Design System prompts

### Design-system source-of-truth review

Use the LSX Design System example context. Compare the live site, demo site, repository, Drive folder, and Figma design system. Explain which sources should control component intent, pattern behaviour, implementation truth, and public-facing messaging.

### Design-versus-build comparison review

Use the LSX Design System example context. Assess whether the visible site experience, demo experience, Figma system, and repository implementation appear aligned. Identify the biggest authority conflicts or evidence gaps and recommend the one workflow that should happen next.

### Component governance review

Use the LSX Design System example context. Review the current source set and explain whether the project is better suited for design-system review, implementation review, documentation review, or approval-style readiness review right now. State the strongest reason for that choice.

## Prompt selection guidance

- Use the baseline prompts when you want comparable output structure across all three contexts.
- Use the project-specific prompts when you want to test more specific source-authority and routing behaviour.
- Reuse the exact same prompt across runs when you want to compare instruction or context changes.
- Only change the wording deliberately when you are testing prompt sensitivity.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)
