# Schema Audit Reference

## When to load

Load when the user asks about schema, structured data, rich results, Yoast schema graph, WooCommerce product schema or schema-related developer handoff.

## What it helps decide

Review the observed schema output and classify missing inputs, conflicts and customisation risks.

## Key checks

- Confirm the schema graph exists on reviewed pages where expected.
- Identify schema pieces found: Organisation, Person, WebSite, WebPage, Article, Breadcrumb, Product, ProductGroup, Offer, AggregateOffer, LocalBusiness, Review, Video, Event or FAQ where relevant.
- Check whether required or important inputs are missing, weak or inconsistent.
- Identify duplicate/conflicting schema from themes, plugins or custom code.
- Check WooCommerce product schema for variation, offer, stock, price and identifier quality when relevant.
- Treat custom schema changes as developer risk unless evidence shows a safe supported route.

## Evidence handling

Separate confirmed schema output from inference about the cause. Use validation tools or captured output as evidence when available.

## Routing notes

- Schema output audit: `woocommerce-yoast-auditor`.
- Schema setup defaults: `woocommerce-yoast-configuration`.
- Schema filters or code customisations: developer handoff.

## Output expectations

For each reviewed page/template, list schema pieces found, missing or weak inputs, conflicts, validation method, confidence, recommendation and owner route.
