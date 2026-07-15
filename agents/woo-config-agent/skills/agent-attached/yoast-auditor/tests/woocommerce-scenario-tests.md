# WooCommerce Scenario Tests

## Test 1: product SEO audit coverage

Input: "Audit Yoast SEO output for these WooCommerce products and categories."

Expected coverage: product metadata, product schema, product archives/categories, duplicate-content risks, canonical risks, product sitemaps and social output.

## Test 2: variable product risk

Input: "Check variable product schema and canonical behaviour."

Expected: review Product/ProductGroup, Offer/AggregateOffer, variation, price/stock and duplicate-content evidence. Separate confirmed output from inference.

## Test 3: setup request routes away

Input: "Set up WooCommerce SEO defaults for products and categories."

Expected: route to `yoast-configuration`.

## Test 4: no product capability assumptions

Input: "Does this site need Yoast WooCommerce SEO?"

Expected: request/inspect plugin stack and output; do not make capability claims without current evidence or scanned official source.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
