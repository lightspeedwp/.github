# Project History

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

## 2026-07-04 - WooCommerce Implementation Planning Recheck

- Rechecked KWV Dev Site via connected WordPress and WooCommerce tools before planning.
- WooCommerce is now active and inspectable, with active plugin evidence including WooCommerce 10.9.1, PayFast, Payflex, Flexible Shipping, WP Mail SMTP, Disable Emails, WooCommerce Subscriptions and related WooCommerce extensions.
- Current store evidence shows KWV on `https://kwv.lightspeedwp.dev`, ZAR currency, South Africa-specific selling region, tax calculation enabled with a 15% VAT rate, and Shop, Cart, Checkout and My Account pages assigned and published.
- Product data is materially larger than the June recheck: 158 published products, 420 draft products, 222 pending products, recent stored orders in ZAR, 798 products in the stock report, 313 out of stock and 41 low-stock products.
- Current high-priority risks are now validation and launch-readiness risks rather than WooCommerce absence: active production-mode gateways need safe test confirmation, BACS is enabled but bank-account fields are blank, an international shipping zone is enabled despite South Africa-only defaults, Disable Emails remains active, search visibility is still off, and catalogue hygiene issues remain visible.

## 2026-06-30 - WooCommerce Launch-Readiness Audit Recheck

- Rechecked LS Agency Dev Site via connected WordPress tools and read-only database queries.
- WooCommerce remains absent from the installed/active plugin list and public post type registry, so live WooCommerce checkout behaviour could not be confirmed.
- Legacy WooCommerce data remains: 31 published products, 50 draft products, 124 product variations, historic orders, WooCommerce tables/options, assigned Shop/Terms pages, and stored payment/shipping/tax/email settings.
- Confirmed current blockers from stored/live evidence: Cart/Checkout/My Account page IDs do not resolve; Shop page points to LSX Design System; shipping zones table is empty; tax rates table is empty and tax calculation is off; only stored BACS appears enabled and bank details are blank; `blog_public` is `0`; 28/28 published product thumbnails sampled via DB have empty alt text; Accessibility Checker has 2,265 stored rows.

## 2026-06-30 - WooCommerce Launch-Readiness Recheck

- Rechecked LS Agency Dev Site via the connected WordPress tools in read-only mode.
- Current evidence still does not show WooCommerce in the installed/active plugin list, although legacy WooCommerce options and product records remain in the database.
- Confirmed high-impact blockers: core Cart, Checkout and My Account page IDs do not resolve; Shop page is assigned to LSX Design System content; shipping is disabled; tax calculation is off; `blog_public` is `0`; only BACS appears enabled and bank details are blank; sampled product data has query-string permalinks, no returned terms, empty image alt text, and legacy/test download data.
- Verdict remains not launch-ready until WooCommerce is restored, core pages/settings are rebuilt, and checkout is tested end to end.

## 2026-06-30 - WooCommerce Launch-Readiness Audit

- Read-only audit of the LS Agency Dev Site for WooCommerce launch readiness.
- Major blockers found: WooCommerce core was not listed among installed/active plugins in current plugin evidence, product URLs returned query-string `?p=` permalinks, assigned Cart/Checkout/My Account page IDs could not be fetched, the Shop page points to LSX Design System content, `blog_public` was `0`, shipping was disabled/no zones were confirmed, tax calculation was off while sampled products remained taxable, and payment/email settings need verification.
- Product catalogue exists with multiple published service products, but sampled products had empty image alt text, no returned product terms, some non-virtual service settings, and stale/import/test data on at least one retainer product.
- Active plugin stack is high risk for launch without pruning and compatibility QA.
- Database SQL follow-up was limited because the connector required approval and timed out during deeper read queries.

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
