# Schema reference

Use this file for Yoast schema graph and schema piece work. Always distinguish Yoast schema output, Schema.org vocabulary validity, and Google rich-result eligibility.

## Graph approach

- Treat Yoast schema as a connected graph rather than isolated JSON-LD blobs.
- Confirm site representation, content object type, breadcrumbs, images, author/entity data, and product data before changing schema.
- Use Yoast developer schema documentation as the primary source for graph behaviour and extension points.
- Use Schema.org for vocabulary and Google Search Central for Google-specific eligibility.

## Schema aggregator and plugin-specific behaviour

- Load schema aggregator docs for custom data pipelines or third-party integrations.
- Load plugin schema docs for Yoast SEO, Yoast SEO Premium, WooCommerce SEO, Local SEO, and News SEO when comparing add-on behaviour.
- Local SEO and News SEO are comparison references here unless the user explicitly includes them in scope.

## AggregateOffer

- **Source URL:** https://developer.yoast.com/features/.schemas/pieces/aggregateoffer/
- **Plugin scope:** woocommerce; verify current output conditions.
- **When Yoast outputs it:** needs source capture from the Yoast schema piece page and plugin-specific schema docs.
- **Required inputs:** needs source capture; generally depends on WordPress object data, site representation, and add-on data where relevant.
- **Optional inputs:** needs source capture; do not invent fields.
- **Related WordPress or WooCommerce data:** map after scanning the source page and WooCommerce docs where relevant.
- **Configuration dependency:** site representation, content type schema settings, product data, breadcrumbs, or plugin-specific add-ons as applicable.
- **Customisation route:** use documented Yoast Schema API, graph pieces, or schema aggregator routes only after verification.
- **QA method:** inspect JSON-LD graph, validate vocabulary with Schema.org, and validate Google eligibility with Google tools where relevant.
- **Risks or limitations:** vocabulary validity does not guarantee Google rich results; avoid duplicate/conflicting schema plugins.

## Article

- **Source URL:** https://developer.yoast.com/features/.schemas/pieces/article/
- **Plugin scope:** free/premium; verify current output conditions.
- **When Yoast outputs it:** needs source capture from the Yoast schema piece page and plugin-specific schema docs.
- **Required inputs:** needs source capture; generally depends on WordPress object data, site representation, and add-on data where relevant.
- **Optional inputs:** needs source capture; do not invent fields.
- **Related WordPress or WooCommerce data:** map after scanning the source page and WooCommerce docs where relevant.
- **Configuration dependency:** site representation, content type schema settings, product data, breadcrumbs, or plugin-specific add-ons as applicable.
- **Customisation route:** use documented Yoast Schema API, graph pieces, or schema aggregator routes only after verification.
- **QA method:** inspect JSON-LD graph, validate vocabulary with Schema.org, and validate Google eligibility with Google tools where relevant.
- **Risks or limitations:** vocabulary validity does not guarantee Google rich results; avoid duplicate/conflicting schema plugins.

## Breadcrumb

- **Source URL:** https://developer.yoast.com/features/.schemas/pieces/breadcrumb/
- **Plugin scope:** free/premium/woocommerce; verify current output conditions.
- **When Yoast outputs it:** needs source capture from the Yoast schema piece page and plugin-specific schema docs.
- **Required inputs:** needs source capture; generally depends on WordPress object data, site representation, and add-on data where relevant.
- **Optional inputs:** needs source capture; do not invent fields.
- **Related WordPress or WooCommerce data:** map after scanning the source page and WooCommerce docs where relevant.
- **Configuration dependency:** site representation, content type schema settings, product data, breadcrumbs, or plugin-specific add-ons as applicable.
- **Customisation route:** use documented Yoast Schema API, graph pieces, or schema aggregator routes only after verification.
- **QA method:** inspect JSON-LD graph, validate vocabulary with Schema.org, and validate Google eligibility with Google tools where relevant.
- **Risks or limitations:** vocabulary validity does not guarantee Google rich results; avoid duplicate/conflicting schema plugins.

## Comment

- **Source URL:** https://developer.yoast.com/features/.schemas/pieces/comment/
- **Plugin scope:** free/premium; verify current output conditions.
- **When Yoast outputs it:** needs source capture from the Yoast schema piece page and plugin-specific schema docs.
- **Required inputs:** needs source capture; generally depends on WordPress object data, site representation, and add-on data where relevant.
- **Optional inputs:** needs source capture; do not invent fields.
- **Related WordPress or WooCommerce data:** map after scanning the source page and WooCommerce docs where relevant.
- **Configuration dependency:** site representation, content type schema settings, product data, breadcrumbs, or plugin-specific add-ons as applicable.
- **Customisation route:** use documented Yoast Schema API, graph pieces, or schema aggregator routes only after verification.
- **QA method:** inspect JSON-LD graph, validate vocabulary with Schema.org, and validate Google eligibility with Google tools where relevant.
- **Risks or limitations:** vocabulary validity does not guarantee Google rich results; avoid duplicate/conflicting schema plugins.

## Event

- **Source URL:** https://developer.yoast.com/features/.schemas/pieces/event/
- **Plugin scope:** plugin integration; verify; verify current output conditions.
- **When Yoast outputs it:** needs source capture from the Yoast schema piece page and plugin-specific schema docs.
- **Required inputs:** needs source capture; generally depends on WordPress object data, site representation, and add-on data where relevant.
- **Optional inputs:** needs source capture; do not invent fields.
- **Related WordPress or WooCommerce data:** map after scanning the source page and WooCommerce docs where relevant.
- **Configuration dependency:** site representation, content type schema settings, product data, breadcrumbs, or plugin-specific add-ons as applicable.
- **Customisation route:** use documented Yoast Schema API, graph pieces, or schema aggregator routes only after verification.
- **QA method:** inspect JSON-LD graph, validate vocabulary with Schema.org, and validate Google eligibility with Google tools where relevant.
- **Risks or limitations:** vocabulary validity does not guarantee Google rich results; avoid duplicate/conflicting schema plugins.

## HowTo

- **Source URL:** https://developer.yoast.com/features/.schemas/pieces/howto/
- **Plugin scope:** free/premium blocks; verify current availability; verify current output conditions.
- **When Yoast outputs it:** needs source capture from the Yoast schema piece page and plugin-specific schema docs.
- **Required inputs:** needs source capture; generally depends on WordPress object data, site representation, and add-on data where relevant.
- **Optional inputs:** needs source capture; do not invent fields.
- **Related WordPress or WooCommerce data:** map after scanning the source page and WooCommerce docs where relevant.
- **Configuration dependency:** site representation, content type schema settings, product data, breadcrumbs, or plugin-specific add-ons as applicable.
- **Customisation route:** use documented Yoast Schema API, graph pieces, or schema aggregator routes only after verification.
- **QA method:** inspect JSON-LD graph, validate vocabulary with Schema.org, and validate Google eligibility with Google tools where relevant.
- **Risks or limitations:** vocabulary validity does not guarantee Google rich results; avoid duplicate/conflicting schema plugins.

## Image

- **Source URL:** https://developer.yoast.com/features/.schemas/pieces/image/
- **Plugin scope:** free/premium/woocommerce; verify current output conditions.
- **When Yoast outputs it:** needs source capture from the Yoast schema piece page and plugin-specific schema docs.
- **Required inputs:** needs source capture; generally depends on WordPress object data, site representation, and add-on data where relevant.
- **Optional inputs:** needs source capture; do not invent fields.
- **Related WordPress or WooCommerce data:** map after scanning the source page and WooCommerce docs where relevant.
- **Configuration dependency:** site representation, content type schema settings, product data, breadcrumbs, or plugin-specific add-ons as applicable.
- **Customisation route:** use documented Yoast Schema API, graph pieces, or schema aggregator routes only after verification.
- **QA method:** inspect JSON-LD graph, validate vocabulary with Schema.org, and validate Google eligibility with Google tools where relevant.
- **Risks or limitations:** vocabulary validity does not guarantee Google rich results; avoid duplicate/conflicting schema plugins.

## LocalBusiness

- **Source URL:** https://developer.yoast.com/features/.schemas/pieces/localbusiness/
- **Plugin scope:** local seo comparison; verify current output conditions.
- **When Yoast outputs it:** needs source capture from the Yoast schema piece page and plugin-specific schema docs.
- **Required inputs:** needs source capture; generally depends on WordPress object data, site representation, and add-on data where relevant.
- **Optional inputs:** needs source capture; do not invent fields.
- **Related WordPress or WooCommerce data:** map after scanning the source page and WooCommerce docs where relevant.
- **Configuration dependency:** site representation, content type schema settings, product data, breadcrumbs, or plugin-specific add-ons as applicable.
- **Customisation route:** use documented Yoast Schema API, graph pieces, or schema aggregator routes only after verification.
- **QA method:** inspect JSON-LD graph, validate vocabulary with Schema.org, and validate Google eligibility with Google tools where relevant.
- **Risks or limitations:** vocabulary validity does not guarantee Google rich results; avoid duplicate/conflicting schema plugins.

## Offer

- **Source URL:** https://developer.yoast.com/features/.schemas/pieces/offer/
- **Plugin scope:** woocommerce; verify current output conditions.
- **When Yoast outputs it:** needs source capture from the Yoast schema piece page and plugin-specific schema docs.
- **Required inputs:** needs source capture; generally depends on WordPress object data, site representation, and add-on data where relevant.
- **Optional inputs:** needs source capture; do not invent fields.
- **Related WordPress or WooCommerce data:** map after scanning the source page and WooCommerce docs where relevant.
- **Configuration dependency:** site representation, content type schema settings, product data, breadcrumbs, or plugin-specific add-ons as applicable.
- **Customisation route:** use documented Yoast Schema API, graph pieces, or schema aggregator routes only after verification.
- **QA method:** inspect JSON-LD graph, validate vocabulary with Schema.org, and validate Google eligibility with Google tools where relevant.
- **Risks or limitations:** vocabulary validity does not guarantee Google rich results; avoid duplicate/conflicting schema plugins.

## Organization

- **Source URL:** https://developer.yoast.com/features/.schemas/pieces/organization/
- **Plugin scope:** free/premium; verify current output conditions.
- **When Yoast outputs it:** needs source capture from the Yoast schema piece page and plugin-specific schema docs.
- **Required inputs:** needs source capture; generally depends on WordPress object data, site representation, and add-on data where relevant.
- **Optional inputs:** needs source capture; do not invent fields.
- **Related WordPress or WooCommerce data:** map after scanning the source page and WooCommerce docs where relevant.
- **Configuration dependency:** site representation, content type schema settings, product data, breadcrumbs, or plugin-specific add-ons as applicable.
- **Customisation route:** use documented Yoast Schema API, graph pieces, or schema aggregator routes only after verification.
- **QA method:** inspect JSON-LD graph, validate vocabulary with Schema.org, and validate Google eligibility with Google tools where relevant.
- **Risks or limitations:** vocabulary validity does not guarantee Google rich results; avoid duplicate/conflicting schema plugins.

## Person

- **Source URL:** https://developer.yoast.com/features/.schemas/pieces/person/
- **Plugin scope:** free/premium; verify current output conditions.
- **When Yoast outputs it:** needs source capture from the Yoast schema piece page and plugin-specific schema docs.
- **Required inputs:** needs source capture; generally depends on WordPress object data, site representation, and add-on data where relevant.
- **Optional inputs:** needs source capture; do not invent fields.
- **Related WordPress or WooCommerce data:** map after scanning the source page and WooCommerce docs where relevant.
- **Configuration dependency:** site representation, content type schema settings, product data, breadcrumbs, or plugin-specific add-ons as applicable.
- **Customisation route:** use documented Yoast Schema API, graph pieces, or schema aggregator routes only after verification.
- **QA method:** inspect JSON-LD graph, validate vocabulary with Schema.org, and validate Google eligibility with Google tools where relevant.
- **Risks or limitations:** vocabulary validity does not guarantee Google rich results; avoid duplicate/conflicting schema plugins.

## PostalAddress

- **Source URL:** https://developer.yoast.com/features/.schemas/pieces/postaladdress/
- **Plugin scope:** local seo comparison; verify current output conditions.
- **When Yoast outputs it:** needs source capture from the Yoast schema piece page and plugin-specific schema docs.
- **Required inputs:** needs source capture; generally depends on WordPress object data, site representation, and add-on data where relevant.
- **Optional inputs:** needs source capture; do not invent fields.
- **Related WordPress or WooCommerce data:** map after scanning the source page and WooCommerce docs where relevant.
- **Configuration dependency:** site representation, content type schema settings, product data, breadcrumbs, or plugin-specific add-ons as applicable.
- **Customisation route:** use documented Yoast Schema API, graph pieces, or schema aggregator routes only after verification.
- **QA method:** inspect JSON-LD graph, validate vocabulary with Schema.org, and validate Google eligibility with Google tools where relevant.
- **Risks or limitations:** vocabulary validity does not guarantee Google rich results; avoid duplicate/conflicting schema plugins.

## Product

- **Source URL:** https://developer.yoast.com/features/.schemas/pieces/product/
- **Plugin scope:** woocommerce; verify current output conditions.
- **When Yoast outputs it:** needs source capture from the Yoast schema piece page and plugin-specific schema docs.
- **Required inputs:** needs source capture; generally depends on WordPress object data, site representation, and add-on data where relevant.
- **Optional inputs:** needs source capture; do not invent fields.
- **Related WordPress or WooCommerce data:** map after scanning the source page and WooCommerce docs where relevant.
- **Configuration dependency:** site representation, content type schema settings, product data, breadcrumbs, or plugin-specific add-ons as applicable.
- **Customisation route:** use documented Yoast Schema API, graph pieces, or schema aggregator routes only after verification.
- **QA method:** inspect JSON-LD graph, validate vocabulary with Schema.org, and validate Google eligibility with Google tools where relevant.
- **Risks or limitations:** vocabulary validity does not guarantee Google rich results; avoid duplicate/conflicting schema plugins.

## ProductGroup

- **Source URL:** https://developer.yoast.com/features/.schemas/pieces/productgroup/
- **Plugin scope:** woocommerce; verify current output conditions.
- **When Yoast outputs it:** needs source capture from the Yoast schema piece page and plugin-specific schema docs.
- **Required inputs:** needs source capture; generally depends on WordPress object data, site representation, and add-on data where relevant.
- **Optional inputs:** needs source capture; do not invent fields.
- **Related WordPress or WooCommerce data:** map after scanning the source page and WooCommerce docs where relevant.
- **Configuration dependency:** site representation, content type schema settings, product data, breadcrumbs, or plugin-specific add-ons as applicable.
- **Customisation route:** use documented Yoast Schema API, graph pieces, or schema aggregator routes only after verification.
- **QA method:** inspect JSON-LD graph, validate vocabulary with Schema.org, and validate Google eligibility with Google tools where relevant.
- **Risks or limitations:** vocabulary validity does not guarantee Google rich results; avoid duplicate/conflicting schema plugins.

## Question

- **Source URL:** https://developer.yoast.com/features/.schemas/pieces/question/
- **Plugin scope:** faq/howto; verify current rich-result caveat; verify current output conditions.
- **When Yoast outputs it:** needs source capture from the Yoast schema piece page and plugin-specific schema docs.
- **Required inputs:** needs source capture; generally depends on WordPress object data, site representation, and add-on data where relevant.
- **Optional inputs:** needs source capture; do not invent fields.
- **Related WordPress or WooCommerce data:** map after scanning the source page and WooCommerce docs where relevant.
- **Configuration dependency:** site representation, content type schema settings, product data, breadcrumbs, or plugin-specific add-ons as applicable.
- **Customisation route:** use documented Yoast Schema API, graph pieces, or schema aggregator routes only after verification.
- **QA method:** inspect JSON-LD graph, validate vocabulary with Schema.org, and validate Google eligibility with Google tools where relevant.
- **Risks or limitations:** vocabulary validity does not guarantee Google rich results; avoid duplicate/conflicting schema plugins.

## Recipe

- **Source URL:** https://developer.yoast.com/features/.schemas/pieces/recipe/
- **Plugin scope:** integration; verify; verify current output conditions.
- **When Yoast outputs it:** needs source capture from the Yoast schema piece page and plugin-specific schema docs.
- **Required inputs:** needs source capture; generally depends on WordPress object data, site representation, and add-on data where relevant.
- **Optional inputs:** needs source capture; do not invent fields.
- **Related WordPress or WooCommerce data:** map after scanning the source page and WooCommerce docs where relevant.
- **Configuration dependency:** site representation, content type schema settings, product data, breadcrumbs, or plugin-specific add-ons as applicable.
- **Customisation route:** use documented Yoast Schema API, graph pieces, or schema aggregator routes only after verification.
- **QA method:** inspect JSON-LD graph, validate vocabulary with Schema.org, and validate Google eligibility with Google tools where relevant.
- **Risks or limitations:** vocabulary validity does not guarantee Google rich results; avoid duplicate/conflicting schema plugins.

## Review

- **Source URL:** https://developer.yoast.com/features/.schemas/pieces/review/
- **Plugin scope:** woocommerce/reviews; verify; verify current output conditions.
- **When Yoast outputs it:** needs source capture from the Yoast schema piece page and plugin-specific schema docs.
- **Required inputs:** needs source capture; generally depends on WordPress object data, site representation, and add-on data where relevant.
- **Optional inputs:** needs source capture; do not invent fields.
- **Related WordPress or WooCommerce data:** map after scanning the source page and WooCommerce docs where relevant.
- **Configuration dependency:** site representation, content type schema settings, product data, breadcrumbs, or plugin-specific add-ons as applicable.
- **Customisation route:** use documented Yoast Schema API, graph pieces, or schema aggregator routes only after verification.
- **QA method:** inspect JSON-LD graph, validate vocabulary with Schema.org, and validate Google eligibility with Google tools where relevant.
- **Risks or limitations:** vocabulary validity does not guarantee Google rich results; avoid duplicate/conflicting schema plugins.

## SearchAction

- **Source URL:** https://developer.yoast.com/features/.schemas/pieces/searchaction/
- **Plugin scope:** free/premium; verify current output conditions.
- **When Yoast outputs it:** needs source capture from the Yoast schema piece page and plugin-specific schema docs.
- **Required inputs:** needs source capture; generally depends on WordPress object data, site representation, and add-on data where relevant.
- **Optional inputs:** needs source capture; do not invent fields.
- **Related WordPress or WooCommerce data:** map after scanning the source page and WooCommerce docs where relevant.
- **Configuration dependency:** site representation, content type schema settings, product data, breadcrumbs, or plugin-specific add-ons as applicable.
- **Customisation route:** use documented Yoast Schema API, graph pieces, or schema aggregator routes only after verification.
- **QA method:** inspect JSON-LD graph, validate vocabulary with Schema.org, and validate Google eligibility with Google tools where relevant.
- **Risks or limitations:** vocabulary validity does not guarantee Google rich results; avoid duplicate/conflicting schema plugins.

## Video

- **Source URL:** https://developer.yoast.com/features/.schemas/pieces/video/
- **Plugin scope:** video seo comparison; verify; verify current output conditions.
- **When Yoast outputs it:** needs source capture from the Yoast schema piece page and plugin-specific schema docs.
- **Required inputs:** needs source capture; generally depends on WordPress object data, site representation, and add-on data where relevant.
- **Optional inputs:** needs source capture; do not invent fields.
- **Related WordPress or WooCommerce data:** map after scanning the source page and WooCommerce docs where relevant.
- **Configuration dependency:** site representation, content type schema settings, product data, breadcrumbs, or plugin-specific add-ons as applicable.
- **Customisation route:** use documented Yoast Schema API, graph pieces, or schema aggregator routes only after verification.
- **QA method:** inspect JSON-LD graph, validate vocabulary with Schema.org, and validate Google eligibility with Google tools where relevant.
- **Risks or limitations:** vocabulary validity does not guarantee Google rich results; avoid duplicate/conflicting schema plugins.

## WebPage

- **Source URL:** https://developer.yoast.com/features/.schemas/pieces/webpage/
- **Plugin scope:** free/premium/woocommerce; verify current output conditions.
- **When Yoast outputs it:** needs source capture from the Yoast schema piece page and plugin-specific schema docs.
- **Required inputs:** needs source capture; generally depends on WordPress object data, site representation, and add-on data where relevant.
- **Optional inputs:** needs source capture; do not invent fields.
- **Related WordPress or WooCommerce data:** map after scanning the source page and WooCommerce docs where relevant.
- **Configuration dependency:** site representation, content type schema settings, product data, breadcrumbs, or plugin-specific add-ons as applicable.
- **Customisation route:** use documented Yoast Schema API, graph pieces, or schema aggregator routes only after verification.
- **QA method:** inspect JSON-LD graph, validate vocabulary with Schema.org, and validate Google eligibility with Google tools where relevant.
- **Risks or limitations:** vocabulary validity does not guarantee Google rich results; avoid duplicate/conflicting schema plugins.

## WebSite

- **Source URL:** https://developer.yoast.com/features/.schemas/pieces/website/
- **Plugin scope:** free/premium; verify current output conditions.
- **When Yoast outputs it:** needs source capture from the Yoast schema piece page and plugin-specific schema docs.
- **Required inputs:** needs source capture; generally depends on WordPress object data, site representation, and add-on data where relevant.
- **Optional inputs:** needs source capture; do not invent fields.
- **Related WordPress or WooCommerce data:** map after scanning the source page and WooCommerce docs where relevant.
- **Configuration dependency:** site representation, content type schema settings, product data, breadcrumbs, or plugin-specific add-ons as applicable.
- **Customisation route:** use documented Yoast Schema API, graph pieces, or schema aggregator routes only after verification.
- **QA method:** inspect JSON-LD graph, validate vocabulary with Schema.org, and validate Google eligibility with Google tools where relevant.
- **Risks or limitations:** vocabulary validity does not guarantee Google rich results; avoid duplicate/conflicting schema plugins.
