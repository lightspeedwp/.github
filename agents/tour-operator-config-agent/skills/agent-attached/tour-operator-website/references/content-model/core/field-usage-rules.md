# Core field usage rules

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
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
<!-- BADGES-END -->

Use this file when interpreting Tour Operator core fields, proposing schema mappings, reviewing templates, or designing filters. Confirm exact runtime storage in live code/admin before migration or bulk edits.

## General rules

- Treat source-backed field slugs as stable only for the uploaded source package version.
- Preserve existing slugs when planning migrations; add compatibility notes for field type changes.
- Do not infer validation, currency, units, required status, storage format or public display behaviour unless source evidence confirms it.
- Treat visible fields as editor-facing fields, not automatically front-end fields.
- For client-safe reporting, describe data quality risks without exposing internal uncertainty as accusations.

## Tour fields

Confirmed source-backed fields: `tagline`, `price`, `sale_price`, `duration`, `single_supplement`, `best_time_to_visit`.

Practical rules:

- `price`, `sale_price` and `single_supplement` are string fields. Do not map them directly to structured `Offer` prices without parsing, currency, validity and display rules.
- `duration` is a string field. The FacetWP integration normalises `cf/duration` by stripping non-numeric characters and taking the first numeric token for indexing; do not assume this is a full duration model.
- `best_time_to_visit` is a month multiselect. Use the confirmed option values before adding seasonal labels.

## Destination fields

Confirmed source-backed fields: `tagline`, `best_time_to_visit`.

Practical rules:

- `destination` is hierarchical and has archive support declared as `destination` in the source model.
- `best_time_to_visit` is a month multiselect. Do not infer climate, seasonality or itinerary availability from this field alone.
- Destination relationship/facet sources are filtering evidence, not proof of ownership for every referenced post type.

## Accommodation fields

Confirmed source-backed fields include pricing, rating, rating type, best-time, spoken languages, visitor suitability, special interests, room count, check-in/check-out time and minimum child age.

Practical rules:

- `price` and `sale_price` are string fields. Structured price output requires parsing and currency rules.
- `price_type` uses a fixed select list. Use source values exactly when mapping pricing labels.
- `rating` is a select field with values `0` to `5`; do not treat it as a verified review score or aggregate rating without source evidence.
- `rating_type` distinguishes rating systems such as `tgcsa` and `hotelstars_union`; do not mix official ratings with user reviews.
- `spoken_languages`, `suggested_visitor_types` and `special_interests` are multiselects. Use exact option values for filters or schema candidates.
- `checkin_time` and `checkout_time` are `text_time` fields; confirm format before schema mapping.

## Schema readiness implications

- Prices need numeric value, currency, validity and item context before `Offer` mapping.
- Ratings need rating source, scale, author/organisation and item context before `Rating` or `AggregateRating` mapping.
- Best-time values are editorial guidance, not availability.
- Visitor suitability and special-interest values can support content filters and copy, but need careful mapping before public schema use.

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

_This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP._
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)
