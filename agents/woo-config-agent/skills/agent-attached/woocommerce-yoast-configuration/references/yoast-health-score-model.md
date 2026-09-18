# Yoast health score model

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](https://img.shields.io/badge/Docs Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](https://img.shields.io/badge/Labeling Governance-OK-success.svg)
![Main Branch Guard](https://img.shields.io/badge/Main Branch Guard-OK-success.svg)
![Metadata Governance](https://img.shields.io/badge/Metadata Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](https://img.shields.io/badge/Template Enforcement-OK-success.svg)
![Validate PR Template](https://img.shields.io/badge/Validate PR Template-OK-success.svg)
![Badges: Documentation Update](https://img.shields.io/badge/Badges: Documentation Update-OK-success.svg)
![Badges: Health Check](https://img.shields.io/badge/Badges: Health Check-OK-success.svg)
![Badges: README Status Maintenance](https://img.shields.io/badge/Badges: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](https://img.shields.io/badge/Badges: Workflow Inventory Audit-OK-success.svg)
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

Use this model when a user asks for a Yoast health score, traffic-light status, retainer summary, portfolio health view, or prioritised health trend.

## Important caveat

Do not present the score as an SEO performance score, ranking forecast, or Google visibility score. It is an internal configuration-health indicator based only on the evidence supplied.

Use the label: **Yoast configuration health**.

## Score bands

| Band | Label | Meaning | Typical next action |
|---|---|---|---|
| 90-100 | Green | Evidence suggests Yoast-critical configuration is stable and low risk | Monitor and keep current QA cadence |
| 75-89 | Light amber | Some gaps or minor drift exist, but no clear critical risk | Fix small issues or verify missing evidence |
| 50-74 | Amber | Meaningful risk, incomplete evidence, or multiple medium findings | Prioritise focused remediation |
| 25-49 | Red | High-risk Yoast configuration or output problem likely | Remediate or run full audit before sign-off |
| 0-24 | Critical | Severe site-wide indexation, canonical, sitemap, robots, or schema risk | Stop launch/changes until resolved |
| Unscored | Evidence insufficient | Inputs are too weak, stale, or indirect | Request targeted evidence |

## Weighted areas

Only score areas with evidence. Mark unobserved areas as `not assessed` rather than assuming pass/fail.

| Area | Weight | Examples |
|---|---:|---|
| Indexation and crawl controls | 25 | noindex, meta robots, robots.txt, sitemap exposure, archive visibility |
| Canonicals and duplicate control | 15 | canonical output, parameter/facet handling, migration canonical state |
| Metadata quality and templates | 15 | title templates, descriptions, page overrides, social metadata |
| Schema and entity output | 15 | WebSite, WebPage, Article, Product, Organization, breadcrumbs |
| WooCommerce-specific output | 15 | Product/ProductGroup/Offer data, variations, archives, product identifiers |
| Maintenance and regression state | 10 | plugin update checks, stale decisions, defaults drift, unresolved regressions |
| Evidence quality | 5 | freshness, source confidence, rendered-output coverage |

If the site is not WooCommerce, redistribute the WooCommerce weight across indexation, metadata, schema, and evidence quality. State that the redistribution is an internal scoring adjustment.

## Finding severity to score impact

| Finding severity | Typical score impact |
|---|---:|
| Critical | -25 to -50 |
| High | -15 to -25 |
| Medium | -5 to -15 |
| Low | -1 to -5 |
| Informational | 0 |

Do not double-count the same root cause across multiple symptoms. For example, one global noindex setting may explain sitemap exclusion, rendered noindex, and Search Console symptoms.

## Confidence modifier

| Evidence confidence | Modifier |
|---|---|
| High, current rendered/live evidence | no adjustment |
| Medium, settings/export plus partial live output | cap score at 89 |
| Low, screenshots or copied notes only | cap score at 74 |
| Stale evidence or unsupported claim | mark unscored or cap at 60 |

## Health summary fields

Use these fields when building structured outputs:

```json
{
  "site": "",
  "review_date": "",
  "review_type": "monthly|quarterly|post_launch|post_update|portfolio|ad_hoc",
  "evidence_level": "none|partial|settings_export|rendered_output|crawl_export|live_verified|mixed",
  "overall_status": "green|light_amber|amber|red|critical|unscored",
  "configuration_health_score": null,
  "confidence": "high|medium|low|insufficient",
  "top_risks": [],
  "changed_since_last_review": [],
  "recommended_next_actions": [],
  "deeper_audit_required": false
}
```

## When not to score

Do not score when:

- no current site-specific evidence exists
- only generic Yoast documentation is available
- the user asks a product-capability question
- the request is a developer API reference task
- evidence is too stale for a current health claim
- the score would imply unsupported ranking or traffic outcomes

In those cases, provide a qualitative status and smallest next evidence request.

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
