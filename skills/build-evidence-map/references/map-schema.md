# Evidence map schema

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

The canonical artifact is UTF-8 JSON. Use a `.doubt.json` suffix when practical.

```json
{
  "title": "Short artifact title",
  "question": "One decision-changing question?",
  "updatedAt": "YYYY-MM-DD",
  "verdict": "A provisional, evidence-bounded answer.",
  "nodes": [
    {
      "id": "current-position",
      "type": "position",
      "label": "Current position",
      "text": "The proposition represented by this node."
    },
    {
      "id": "primary-observation",
      "type": "evidence",
      "label": "Observed result",
      "text": "A faithful statement of the source region.",
      "sourceId": "source-1"
    },
    {
      "id": "missing-baseline",
      "type": "unknown",
      "label": "Missing baseline",
      "text": "The exact absent fact and why it matters."
    }
  ],
  "edges": [
    {
      "from": "primary-observation",
      "to": "current-position",
      "relation": "supports",
      "note": "Why the observation increases reason to accept the position."
    },
    {
      "from": "missing-baseline",
      "to": "current-position",
      "relation": "missing",
      "note": "Why this missing baseline could reverse the position."
    }
  ],
  "sources": [
    {
      "id": "source-1",
      "title": "Source title",
      "url": "https://example.com/source",
      "publisher": "Publisher",
      "date": "YYYY-MM-DD",
      "retrievedAt": "YYYY-MM-DD",
      "locator": "Section: Results, p. 7, § 2.1, L12-L18, or 00:04:31",
      "excerpt": "A short, checkable excerpt or bounded source-region description."
    }
  ]
}
```

## Invariants

- Allowed node types: `position`, `claim`, `evidence`, `unknown`.
- Allowed relations: `supports`, `contradicts`, `qualifies`, `missing`.
- Exactly one `position` node is required.
- Evidence nodes require `sourceId`.
- Every evidence node must be the `from` side of at least one edge.
- Every non-position node must have a directed path to the position.
- Duplicate reasoning edges and directed cycles are rejected.
- Every source must be used by an evidence node.
- Every edge needs a plain-language `note`.
- Map and source dates are real ISO calendar dates; source dates cannot be later
  than `updatedAt`.
- Every source records `retrievedAt`. Receipts cover that value and the recorded
  excerpt, not the mutable bytes currently served by the URL.
- Locators identify a bounded section, page, line range, or timestamp.
- Excerpts contain 40–500 characters of varied, checkable content; repeated
  filler is invalid.
- `confidence` fields are invalid. Use an `unknown` node or a qualified claim.

## Optional verification record

Only a successful explicit source-verification command may add this object to a
source:

```json
{
  "verification": {
    "status": "verified",
    "method": "normalized-excerpt-match",
    "checkedAt": "YYYY-MM-DDTHH:mm:ss.sssZ",
    "contentSha256": "64 lowercase hexadecimal characters",
    "excerptSha256": "64 lowercase hexadecimal characters",
    "finalUrl": "The checked URL or absolute local path",
    "locatorStatus": "matched"
  }
}
```

`locatorStatus` may be `not-machine-checked` for page, section, and timestamp
locators. Do not treat it as proof that the region was manually confirmed.

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)
