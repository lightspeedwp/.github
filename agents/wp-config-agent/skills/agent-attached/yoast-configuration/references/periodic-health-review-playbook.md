# Periodic health review playbook

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

Use this playbook for monthly, quarterly, retainer, post-launch monitoring, and low-touch Yoast health reviews. It is not a replacement for a full Yoast audit. It helps decide whether the site still appears stable, whether previous decisions remain valid, and whether a deeper audit is needed.

## When to load

Load this file when the user asks for:

- monthly Yoast review
- quarterly SEO health note
- retainer check-in
- what changed since last review
- lightweight Yoast health check
- post-launch Yoast monitoring
- recurring client summary
- maintenance report inputs

Also load `references/yoast-health-score-model.md` when the user asks for a score, traffic-light status, priority ranking, or cross-site comparison.

## Inputs

Accept any combination of:

- Previous Yoast audit or decision log.
- Current settings export or copied settings.
- Rendered source for priority pages.
- Sitemap, robots.txt, llms.txt, or HTTP header observations.
- Search Console notes supplied by the user.
- Crawl export summaries supplied by the user.
- Plugin update or regression report.
- Client decisions, approved exceptions, or known constraints.
- Portfolio site summary rows.

## Evidence boundaries

| Evidence | Can support | Cannot prove |
|---|---|---|
| Previous audit | Baseline recommendations and known risks | Current output or current plugin behaviour |
| Settings export | Configured intent at time of export | Rendered metadata, schema, headers, or Google interpretation |
| Rendered source | Page-level output at capture time | Whole-site correctness |
| Sitemap/robots captures | Exposed crawl-control files at capture time | Google indexing outcome |
| Search Console notes | Reported Google-side symptoms or coverage | Exact Yoast cause without site evidence |
| Client notes | Business context and approvals | Technical correctness |

## Review levels

### Level 1: low-touch health note

Use when evidence is partial and the user wants a short retainer update.

Output:

- Current confidence level.
- Notable changes since last review.
- Red/amber/green status by area.
- Smallest next checks.
- Whether a deeper audit is needed.

Do not provide strong implementation recommendations unless supported by current evidence.

### Level 2: focused maintenance review

Use when current artefacts exist for key pages or key settings.

Check:

- Site representation and organisation/person data.
- Search appearance defaults.
- Priority page titles, descriptions, canonicals and meta robots.
- Sitemap exposure.
- Robots.txt and llms.txt state where relevant.
- Schema graph on sample priority pages.
- WooCommerce product/.schemas/archive checks if relevant.
- Open decisions and accepted exceptions.

### Level 3: retainer audit checkpoint

Use when multiple current evidence sources exist or when the site had major changes.

Add:

- Before/after comparison.
- Regression risk review.
- Defaults drift classification.
- Remediation backlog update.
- Client-safe summary.
- Decision log updates.

## Health review workflow

1. Identify site type and review cadence.
2. State evidence received and evidence missing.
3. Compare against previous baseline, agency defaults, or approved decisions.
4. Classify change type:
   - no material change
   - approved change
   - beneficial improvement
   - risky drift
   - regression suspected
   - unsupported or unclear
5. Score only what the evidence supports.
6. Route action:
   - no action
   - monitor
   - admin check
   - developer check
   - client decision
   - full audit required
7. Produce the smallest useful output.

## What changed since last review

Use this table shape:

| Area | Previous state | Current state | Change type | Evidence | Risk | Action |
|---|---|---|---|---|---|---|

Common change areas:

- plugin versions and entitlement state
- global search appearance defaults
- content-type visibility
- taxonomy visibility
- sitemap inclusion
- canonical output
- meta robots output
- schema output
- product schema completeness
- breadcrumbs
- robots.txt or llms.txt
- redirects
- AI-generated metadata approval state
- developer overrides

## Stop conditions

Recommend a deeper audit instead of a light health note when:

- site-wide noindex or canonical conflict is suspected
- sitemap suddenly loses key content types
- product schema materially changes on a transactional store
- rendered output conflicts with configured intent
- source evidence is stale for a version-sensitive claim
- migration or large content restructure happened since the last review
- client asks for sign-off, launch approval, or implementation instructions

## Output options

- Use `templates/yoast-health-summary.md` for a compact retainer health note.
- Use `templates/yoast-retainer-review-note.md` for an account-manager-friendly monthly/quarterly update.
- Use `templates/yoast-state-comparison-report.md` for evidence-heavy before/after comparisons.
- Use `templates/yoast-remediation-backlog.md` when actions need owner routing.
- Use `templates/client-safe-summary.md` when the output is client-facing.

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
