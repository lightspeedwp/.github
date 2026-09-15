# Migration launch SEO control plan

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

## Project context

- Site / project:
- Migration type:
- Planned launch window:
- Evidence available:
- Access level:
- Owner(s):

## Readiness status

| Area | Status | Evidence | Owner | Notes |
|---|---|---|---|---|
| Old URL inventory |  |  |  |  |
| Redirect map approval |  |  |  |  |
| Yoast metadata migration |  |  |  |  |
| Canonicals |  |  |  |  |
| XML sitemaps |  |  |  |  |
| Robots.txt / noindex |  |  |  |  |
| Schema / breadcrumbs |  |  |  |  |
| Multilingual hreflang |  |  |  |  |
| WooCommerce products/taxonomies |  |  |  |  |
| Search Console handoff |  |  |  |  |

## Pre-launch controls

| Control | Required evidence | Pass condition | Owner |
|---|---|---|---|
| Redirect sample test |  | No chains/loops; expected status and destination |  |
| Canonical sample test |  | Live/staging URLs point to correct preferred URLs |  |
| Sitemap sample test |  | Only intended indexable URLs listed |  |
| Metadata sample test |  | Titles/descriptions/social metadata match approved source |  |
| Schema sample test |  | Valid graph and no wrong-domain/wrong-language URLs |  |
| Robots/noindex test |  | Live launch state is not blocked accidentally |  |

## Launch-day checks

| Check | Sample | Expected result | Evidence captured | Owner |
|---|---|---|---|---|
| Homepage and top pages |  |  |  |  |
| High-value old URLs |  |  |  |  |
| Product/category URLs |  |  |  |  |
| XML sitemap index |  |  |  |  |
| Robots.txt |  |  |  |  |
| Canonical and meta robots |  |  |  |  |
| Schema and breadcrumbs |  |  |  |  |

## Rollback / recovery notes

- Redirect import/export location:
- Server/CDN rules owner:
- Yoast settings backup/export:
- Emergency stop conditions:
- Escalation owner:

## Post-launch monitoring

| Window | Checks | Owner | Notes |
|---|---|---|---|
| Same day | 404s, redirect loops, robots/noindex, sitemap access |  |  |
| Week 1 | Search Console coverage, top redirected URLs, canonical warnings |  |  |
| Week 2-4 | New 404 patterns, indexed URLs, sitemap discoveries |  |  |

## Decision record

- Approved exceptions:
- Accepted risks:
- Follow-up date:

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
