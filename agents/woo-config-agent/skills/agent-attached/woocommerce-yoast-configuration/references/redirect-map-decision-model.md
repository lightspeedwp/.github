# Redirect map decision model

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

Use this model for old-to-new URL decisions, redirect map reviews, migration launch controls, and Yoast Premium redirect-manager planning.

## Decision states

| State | Meaning | Safe next action |
|---|---|---|
| approved redirect | Old URL has a clear equivalent destination and owner approval | Implement via selected route, then QA status, chain and destination canonical |
| approved 410/404 | URL is intentionally removed and no equivalent exists | Exclude from redirect import, monitor crawl/Search Console evidence |
| approved noindex | URL remains live but should not be indexed | Check robots meta, sitemap exclusion and canonical consistency |
| approved canonical consolidation | Source remains accessible but should consolidate to preferred URL | Verify canonical output and sitemap inclusion strategy |
| needs content owner | Content equivalence or replacement value is unclear | Ask content owner to confirm destination or removal |
| needs developer/sysadmin | Implementation requires server/CDN/rule/code work | Create handoff with route, sample URLs, rollback and QA steps |
| needs Yoast entitlement check | Proposed implementation depends on Yoast Premium redirect manager | Verify plugin/product availability before routing |
| duplicate or superseded row | Another row already covers the URL or newer decision exists | Keep only canonical decision and preserve audit note |
| monitor only | No immediate change; watch crawl/indexation behaviour | Record reason, evidence and review date |
| reject | Proposed redirect is unsafe or unsupported | Explain risk and request new destination or decision |

## Risk levels

| Risk | Typical triggers | Required controls |
|---|---|---|
| Critical | High-value URLs unmapped, redirect loop, site-wide wrong domain/canonical, production import without rollback | Stop launch or mark not ready |
| High | Bulk redirects, domain migration, wrong-language destinations, product/category remaps, conflicting redirect systems | Approval, staging/sample QA, owner and rollback |
| Medium | Low-volume URL remaps, archive cleanup, noindex/canonical decisions | Representative QA and decision log |
| Low | Small one-to-one slug changes with clear equivalent page | Basic rendered status/canonical check |
| Unknown | Thin evidence, missing old URL inventory, no traffic/backlink/content context | Evidence request before approval |

## Required row fields

Every redirect-map row should capture:

- Old URL.
- Proposed new URL or action.
- Content type.
- Proposed status: `301`, `302`, `410`, `404`, `noindex`, `canonical`, `hold`, or `monitor`.
- Implementation route: `Yoast Premium`, `server/CDN`, `WordPress admin`, `custom code`, `content decision`, or `unknown`.
- Evidence source.
- Approval state.
- Risk level.
- QA status.
- Owner.
- Notes and review date.

## Decision guardrails

- Prefer a relevant destination over a homepage redirect.
- Do not redirect deleted content to an unrelated page to hide 404s.
- Do not approve wrong-language, wrong-product, or wrong-intent destinations.
- Do not approve chains as the final target state.
- Do not combine redirect, noindex and canonical decisions without a clear reason.
- Keep temporary campaign or maintenance redirects separate from permanent migration redirects.
- Record accepted exceptions explicitly.

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
