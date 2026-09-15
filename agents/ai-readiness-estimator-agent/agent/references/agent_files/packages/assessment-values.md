# AI Package Assessment Values

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

Use this file to drive intake before package routing or pricing.

## Operating Rules

- Gather values in batches.
- Try to source each value automatically first.
- Show the client what was found.
- Ask the client to confirm or correct it.
- Ask only for missing values.
- If Gmail, Figma, GitHub, or another source is not connected, do not imply it was scanned.

## Intake Batches

### 1. Reference Sources

Ask for or inspect:

- primary website URL
- staging site URL if available
- Google Docs or Drive links
- GitHub repo if relevant
- Figma links if relevant
- prior proposal or scope documents
- SEO or technical audit documents
- analytics or Search Console references
- policy, governance, or compliance documents
- chatbot or AI strategy notes if they already exist

### 2. Live Website / Platform Discovery

Try to identify from the live site or references:

- platform
- WooCommerce status
- blog, FAQ, and policy-page presence
- sitemap and robots.txt status
- visible search feature
- product and category scale signals
- critical plugins or technical dependencies
- integrations or third-party systems
- multilingual or multi-brand status

### 3. Business Goals / Package Intent

Confirm:

- project goal
- requested services or package intent
- delivery type
- target timeline
- internal owner
- whether a chatbot is already live, planned, or exploratory

### 4. Scope Confirmation / Commercial Routing

Confirm:

- whether the audit findings fit a standard package
- whether any fixed-fee disqualifiers are present
- whether add-ons are needed after the primary base package is chosen
- whether sensitive or regulated use cases change the routing or scope

## Shared Values Required Before Routing Or Pricing

| Value | Description | Try to source from | Ask if missing |
|---|---|---|---|
| `website_url` | Live site URL | client input, live site | website URL |
| `staging_url` | Staging site URL | client input, docs | staging URL |
| `platform` | CMS / stack | live site, repo | confirm platform |
| `woocommerce_status` | WooCommerce in use | live site, repo | confirm ecommerce |
| `product_count_estimate` | Rough product volume | live site, sitemap | approximate product count |
| `category_count_estimate` | Rough category volume | live site, navigation | approximate category count |
| `blog_presence` | Blog or resource content exists | live site | confirm |
| `faq_presence` | FAQ or help content exists | live site | confirm source pages |
| `policy_presence` | privacy / terms / returns pages exist | live site | confirm missing policies |
| `ga4_status` | GA4 present | site tags, docs | confirm analytics status |
| `gtm_status` | GTM present | site tags, docs | confirm tag manager status |
| `search_console_status` | Search Console access exists | docs, client input | confirm access |
| `critical_plugins` | plugins affecting scope | repo, plugin list, docs | list critical plugins |
| `integrations` | CRM, booking, ERP, helpdesk, API dependencies | website, docs | list integrations |
| `multilingual_or_multibrand_status` | multi-language or multi-brand status | live site, docs | confirm |
| `sensitive_or_regulated_use_cases` | privacy, regulated, or sensitive flows | docs, client input | describe risks |
| `project_goal` | main business goal | brief, client input | goal statement |
| `delivery_type` | audit only / implementation / implementation + chatbot | client input | delivery type |
| `target_timeline` | timing | client input, prior comms | deadline or target month |
| `internal_owner` | client-side owner | docs, client input | name and role |

## Client Confirmation Questions

Ask these after the first scan:

- What is the main AI-related outcome you want to achieve first?
- Are you looking for audit only, implementation, or implementation plus chatbot?
- Do you already have internal rules for AI content or chatbot governance?
- Are there any restricted topics or sensitive user-data flows we should know about?
- Is a chatbot already live, planned, or only exploratory?

## Output Rule

Do not finalise package recommendation until:

1. website findings are confirmed
2. missing business-goal fields are supplied
3. any sensitive or regulated use cases are disclosed

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

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)
