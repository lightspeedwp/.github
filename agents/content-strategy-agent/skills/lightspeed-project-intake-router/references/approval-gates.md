# Approval Gates

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](https://img.shields.io/badge/Docs%20Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](https://img.shields.io/badge/Labeling%20Governance-OK-success.svg)
![Main Branch Guard](https://img.shields.io/badge/Main%20Branch%20Guard-OK-success.svg)
![Metadata Governance](https://img.shields.io/badge/Metadata%20Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](https://img.shields.io/badge/Template%20Enforcement-OK-success.svg)
![Validate PR Template](https://img.shields.io/badge/Validate%20PR%20Template-OK-success.svg)
![Badges: Documentation Update](https://img.shields.io/badge/Badges:%20Documentation%20Update-OK-success.svg)
![Badges: Health Check](https://img.shields.io/badge/Badges:%20Health%20Check-OK-success.svg)
![Badges: README Status Maintenance](https://img.shields.io/badge/Badges:%20README%20Status%20Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](https://img.shields.io/badge/Badges:%20Workflow%20Inventory%20Audit-OK-success.svg)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![labeling-unified](https://github.com/lightspeedwp/.github/actions/workflows/labeling-unified.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling-unified.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
[![workflow-lint](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml)
<!-- BADGES-END -->

Use approval gates to keep intake, planning, implementation and launch work from blurring together.

## Default gates

1. Intake confirmed.
2. Source inventory approved.
3. Scope and exclusions approved.
4. PRD approved.
5. Figma/design direction approved.
6. Technical brief approved.
7. Task breakdown approved.
8. GitHub issue drafts approved.
9. Implementation plan approved.
10. Acceptance test plan approved.
11. Launch QA plan approved.
12. Final go/no-go approved.
13. Release handoff approved.

## Gate rules

Do not skip gates when there are unresolved blockers, missing evidence, unclear theme/plugin boundaries, design-system ambiguity, privacy/legal risks, unsupported claims, unapproved content, migration risk, conversion-tracking uncertainty, chatbot source uncertainty or accessibility/performance risk.

## Gate severity

- **Required now:** blocks the next recommended route.
- **Required before implementation:** does not block planning, but must be resolved before build.
- **Required before launch:** track for launch QA or go/no-go.
- **Optional:** useful but not required for current decision-making.
