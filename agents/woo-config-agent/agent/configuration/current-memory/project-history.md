# Project History

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

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
