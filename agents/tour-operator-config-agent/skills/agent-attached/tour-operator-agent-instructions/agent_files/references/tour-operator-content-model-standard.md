# Tour Operator Core Content Model Standard

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
[![actions-minute-savings-watch](https://github.com/lightspeedwp/.github/actions/workflows/actions-minute-savings-watch.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/actions-minute-savings-watch.yml)
[![allocate-pr-issue-to-milestone](https://github.com/lightspeedwp/.github/actions/workflows/allocate-pr-issue-to-milestone.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/allocate-pr-issue-to-milestone.yml)
[![awesome-github-site](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml)
[![badges-documentation-update](https://github.com/lightspeedwp/.github/actions/workflows/badges-documentation-update.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/badges-documentation-update.yml)
[![badges-health-check](https://github.com/lightspeedwp/.github/actions/workflows/badges-health-check.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/badges-health-check.yml)
[![badges-readme-status](https://github.com/lightspeedwp/.github/actions/workflows/badges-readme-status.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/badges-readme-status.yml)
[![badges-workflow-audit](https://github.com/lightspeedwp/.github/actions/workflows/badges-workflow-audit.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/badges-workflow-audit.yml)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![checklist-finalisation](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml)
[![checks](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml)
[![cleanup-branches](https://github.com/lightspeedwp/.github/actions/workflows/cleanup-branches.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/cleanup-branches.yml)
[![docs-maintenance](https://github.com/lightspeedwp/.github/actions/workflows/docs-maintenance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/docs-maintenance.yml)
[![docs-validation](https://github.com/lightspeedwp/.github/actions/workflows/docs-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/docs-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![flaky-test-detection](https://github.com/lightspeedwp/.github/actions/workflows/flaky-test-detection.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/flaky-test-detection.yml)
[![gitleaks-reusable](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks-reusable.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks-reusable.yml)
[![gitleaks-update](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks-update.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks-update.yml)
[![gitleaks](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks.yml)
[![issue-create-enhanced](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-enhanced.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-enhanced.yml)
[![issue-create-from-template](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-from-template.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-from-template.yml)
[![issue-fields-backfill](https://github.com/lightspeedwp/.github/actions/workflows/issue-fields-backfill.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-fields-backfill.yml)
[![issue-health-audit](https://github.com/lightspeedwp/.github/actions/workflows/issue-health-audit.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-health-audit.yml)
[![issue-labeling-automation](https://github.com/lightspeedwp/.github/actions/workflows/issue-labeling-automation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-labeling-automation.yml)
[![issue-project-field-sync](https://github.com/lightspeedwp/.github/actions/workflows/issue-project-field-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-project-field-sync.yml)
[![issue-remediation-automation](https://github.com/lightspeedwp/.github/actions/workflows/issue-remediation-automation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-remediation-automation.yml)
[![issue-remediation-bulk](https://github.com/lightspeedwp/.github/actions/workflows/issue-remediation-bulk.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-remediation-bulk.yml)
[![issues](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml)
[![label-audit-report](https://github.com/lightspeedwp/.github/actions/workflows/label-audit-report.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/label-audit-report.yml)
[![labeling-governance](https://github.com/lightspeedwp/.github/actions/workflows/labeling-governance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling-governance.yml)
[![labeling](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml)
[![main-branch-guard](https://github.com/lightspeedwp/.github/actions/workflows/main-branch-guard.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/main-branch-guard.yml)
[![manage-blocking-status-labels](https://github.com/lightspeedwp/.github/actions/workflows/manage-blocking-status-labels.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/manage-blocking-status-labels.yml)
[![meta-labels-sync](https://github.com/lightspeedwp/.github/actions/workflows/meta-labels-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta-labels-sync.yml)
[![meta](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml)
[![metadata-governance](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml)
[![metrics-pipeline](https://github.com/lightspeedwp/.github/actions/workflows/metrics-pipeline.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics-pipeline.yml)
[![metrics-reporting](https://github.com/lightspeedwp/.github/actions/workflows/metrics-reporting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics-reporting.yml)
[![planner](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml)
[![project-archival](https://github.com/lightspeedwp/.github/actions/workflows/project-archival.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-archival.yml)
[![project-maintenance-nightly](https://github.com/lightspeedwp/.github/actions/workflows/project-maintenance-nightly.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-maintenance-nightly.yml)
[![project-maintenance-on-demand](https://github.com/lightspeedwp/.github/actions/workflows/project-maintenance-on-demand.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-maintenance-on-demand.yml)
[![project-meta-sync](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml)
[![release](https://github.com/lightspeedwp/.github/actions/workflows/release.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release.yml)
[![reporting](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml)
[![reviewer](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml)
[![template-enforcement](https://github.com/lightspeedwp/.github/actions/workflows/template-enforcement.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/template-enforcement.yml)
[![validate-blocking-issue-before-close](https://github.com/lightspeedwp/.github/actions/workflows/validate-blocking-issue-before-close.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-blocking-issue-before-close.yml)
[![validate-blocking-status-before-close](https://github.com/lightspeedwp/.github/actions/workflows/validate-blocking-status-before-close.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-blocking-status-before-close.yml)
[![validate-dor-dod-sections](https://github.com/lightspeedwp/.github/actions/workflows/validate-dor-dod-sections.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-dor-dod-sections.yml)
[![validate-issue-dod-before-close](https://github.com/lightspeedwp/.github/actions/workflows/validate-issue-dod-before-close.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-issue-dod-before-close.yml)
[![validate-mermaid-pr](https://github.com/lightspeedwp/.github/actions/workflows/validate-mermaid-pr.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-mermaid-pr.yml)
[![validate-pr-template](https://github.com/lightspeedwp/.github/actions/workflows/validate-pr-template.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-pr-template.yml)
[![validate-project-linking](https://github.com/lightspeedwp/.github/actions/workflows/validate-project-linking.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-project-linking.yml)
<!-- BADGES-END -->

Use this reference as the content-model source of truth for LightSpeed tour operator website audits, planning, and hands-on configuration work.

Source document: `Tour Operator Content Model` Google Doc, document id `1A50dnI7RJzFhwM4L8sht1uE8QaR0W_cHYJY8nv41-6I`.

## Non-negotiable behaviour

- Start with the LightSpeedWP `Tour Operator` core plugin model before inventing new post types, taxonomies, fields, templates, or plugin dependencies.
- Treat the built-in core model as: `accommodation`, `destination`, and `tour`.
- Treat `review`, `team`, `special`, `vehicle`, and Wetu-synced structures as extension-backed or project-specific unless the active plugin stack confirms otherwise.
- Do not recommend SCF, ACF, CPT UI, custom post-type builders, field frameworks, or custom relationship plugins for content-model work until the built-in Tour Operator model has been checked and found insufficient for a confirmed requirement.
- Do not rename plugin slugs or field keys. Use the exact slugs below when inspecting, mapping, importing, documenting, or briefing implementation work.
- Separate confirmed plugin behaviour from likely behaviour. If the connected site, repo, or project docs cannot confirm a field or taxonomy, label it as `not verified`.
- Prefer relationship fields and taxonomies already provided by the Tour Operator plugin stack before creating duplicate custom fields or manual page links.
- Keep the model editor-friendly: explain which content belongs in CPTs, which belongs in taxonomies, which belongs in custom fields, and which belongs in normal page/post content.

## Built-in core post types

| Post type | Slug | Hierarchical | Primary purpose |
| --- | --- | --- | --- |
| Accommodation | `accommodation` | No | Lodging entities, room or unit details, facilities, prices, ratings, media, and links to tours or destinations. |
| Destination | `destination` | Yes | Geographic structure for countries, regions, places, and destination-led discovery. |
| Tour | `tour` | No | Primary commercial travel product, including itinerary, price, duration, start/end destinations, media, and related accommodation or destinations. |

## Core content-model workflow

Use this order for audits, implementation plans, imports, and hands-on configuration:

1. Confirm the active plugin stack:
   - Tour Operator core plugin installed, active, and versioned.
   - First-party extensions installed and active where relevant: `TO Team`, `TO Specials`, `TO Reviews`, `Wetu Importer`.
2. Confirm which content entities are core versus extension-backed:
   - Core: Accommodation, Destination, Tour.
   - Extension/project-specific: Reviews, Team, Specials, Vehicles, Wetu import records, booking/departure objects.
3. Inspect existing content counts and sample entries for each active CPT.
4. Inspect taxonomy terms and whether terms are reused consistently across entries.
5. Inspect relationship fields in both directions before assuming content is disconnected.
6. Inspect shared fields such as banner image, gallery, and related posts/tours/destinations/accommodation.
7. Confirm archive, single, and taxonomy template coverage for every public entity in use.
8. Confirm SEO visibility and sitemap inclusion for relevant post types and taxonomies.
9. Report gaps as content-model gaps, template gaps, data-quality gaps, plugin-stack gaps, or editorial-process gaps.
10. Make changes only after the target entity, field, taxonomy, and expected frontend behaviour are clear.

## Accommodation model

Core details:

- Slug: `accommodation`
- Title: `Accommodation`
- Plural title: `Accommodation`
- Hierarchical: `false`

Basic fields:

| Field slug | Label | Type | Stored as | Use |
| --- | --- | --- | --- | --- |
| `tagline` | Tagline | text | string | Short positioning line. |
| `price` | Price From | text | string | Minimum price. |
| `sale_price` | Sale Price | text | string | Sale price. |
| `price_type` | Price Type | select | string | Pricing type. |
| `single_supplement` | Single Supplement | text | string | Additional cost for single travellers. |
| `rating` | Rating | select | string | Star rating. |
| `rating_type` | Rating Type | select | string | Rating type. |
| `best_time_to_visit` | Best time to visit | multiselect | array | Ideal months or season. |
| `spoken_languages` | Spoken Languages | multiselect | array | Languages spoken. |
| `suggested_visitor_types` | Friendly | multiselect | array | Visitor types. |
| `special_interests` | Special Interests | multiselect | array | Interests catered for. |
| `number_of_rooms` | Number of Rooms | text | string | Total rooms or units. |
| `checkin_time` | Check-in Time | text_time | string | Standard check-in. |
| `checkout_time` | Check-out Time | text_time | string | Standard check-out. |
| `minimum_child_age` | Minimum Child Age | text | string | Minimum child age. |

Metabox fields:

| Field slug | Label | Type | Stored as | Use |
| --- | --- | --- | --- | --- |
| `included` | Included | wysiwyg | string | Included items or services. |
| `not_included` | Not Included | wysiwyg | string | Excluded items or services. |
| `team_to_accommodation` | Accommodation Expert | pw_select | int | Related team member, when the team extension/model is present. |
| `location` | Address | pw_map | string | Map address. |
| `map_placeholder` | Map Placeholder | file | string | Static map placeholder image. |
| `banner_image` | Banner | file | string | Banner image. |
| `gallery` | Gallery | file_list | array | Gallery images. |
| `units` | Rooms / Units | group | array | Repeatable unit entries with unit type, title, description, price, and gallery. |
| `post_to_accommodation` | Related Posts | pw_multiselect | array | Related editorial posts. |
| `destination_to_accommodation` | Related Destinations | pw_multiselect | array | Related destinations. |
| `tour_to_accommodation` | Related Tours | pw_multiselect | array | Related tours. |

## Destination model

Core details:

- Slug: `destination`
- Title: `Destination`
- Plural title: `Destinations`
- Hierarchical: `true`

Basic fields:

| Field slug | Label | Type | Stored as | Use |
| --- | --- | --- | --- | --- |
| `tagline` | Tagline | text | string | Short destination positioning line. |
| `best_time_to_visit` | Best time to visit | multiselect | array | Ideal months or season. |

Metabox fields:

| Field slug | Label | Type | Stored as | Use |
| --- | --- | --- | --- | --- |
| `electricity` | Electricity | wysiwyg | string | Electrical information. |
| `banking` | Banking | wysiwyg | string | Banking or currency information. |
| `cuisine` | Cuisine | wysiwyg | string | Food or cuisine information. |
| `climate` | Climate | wysiwyg | string | Climate or weather information. |
| `transport` | Transport | wysiwyg | string | Transport information. |
| `dress` | Dress | wysiwyg | string | Dress customs. |
| `health` | Health | wysiwyg | string | Health information. |
| `safety` | Safety | wysiwyg | string | Safety tips. |
| `visa` | Visa | wysiwyg | string | Visa requirements. |
| `additional_info` | General | wysiwyg | string | General destination information. |
| `banner_image` | Banner | file | string | Banner image. |
| `gallery` | Gallery | file_list | array | Gallery images. |
| `location` | Address | pw_map | string | Map address. |
| `map_placeholder` | Map Placeholder | file | string | Static map placeholder image. |
| `disable_auto_zoom` | Disable Auto Zoom | checkbox | bool | Disable map auto zoom. |
| `post_to_destination` | Related Posts | pw_multiselect | array | Related editorial posts. |
| `accommodation_to_destination` | Related Accommodation | pw_multiselect | array | Related accommodation. |
| `tour_to_destination` | Related Tours | pw_multiselect | array | Related tours. |

## Tour model

Core details:

- Slug: `tour`
- Title: `Tour`
- Plural title: `Tours`
- Hierarchical: `false`

Basic fields:

| Field slug | Label | Type | Stored as | Use |
| --- | --- | --- | --- | --- |
| `tagline` | Tagline | text | string | Short commercial positioning line. |
| `price` | Price | text | string | Tour price. |
| `sale_price` | Sale Price | text | string | Sale price. |
| `duration` | Duration | text | string | Duration, usually in days. |
| `single_supplement` | Single Supplement | text | string | Additional cost for single travellers. |
| `best_time_to_visit` | Best time to visit | multiselect | array | Best months or season. |

Metabox fields:

| Field slug | Label | Type | Stored as | Use |
| --- | --- | --- | --- | --- |
| `departs_from` | Departs From | pw_select | int | Start destination. |
| `ends_in` | Ends In | pw_select | int | End destination. |
| `group_size` | Group Size | wysiwyg | string | Group size range. |
| `highlights` | Highlights | wysiwyg | string | Key experiences. |
| `included` | Included | wysiwyg | string | Included items or services. |
| `not_included` | Not Included | wysiwyg | string | Excluded items or services. |
| `booking_validity_start` | Booking Validity (start) | text_date_timestamp | int | Start date for booking validity. |
| `booking_validity_end` | Booking Validity (end) | text_date_timestamp | int | End date for booking validity. |
| `expire_post` | Expire this tour automatically | checkbox | bool | Expire tour automatically. |
| `location_title` | Location | title | - | Section title. |
| `map_placeholder` | Map Placeholder | file | string | Static map placeholder image. |
| `itinerary_kml` | Itinerary KML File | file | string | GPS points file. |
| `banner_image` | Banner | file | string | Banner image. |
| `gallery` | Gallery | file_list | array | Gallery images. |
| `itinerary` | Itinerary | group | array | Repeatable itinerary entries with title, tagline, description, featured image, related accommodation/destination, included, excluded, drinks basis, and room basis. |
| `post_to_tour` | Related Posts | pw_multiselect | array | Related editorial posts. |
| `accommodation_to_tour` | Related Accommodation | pw_multiselect | array | Related accommodation. |
| `destination_to_tour` | Related Destinations | pw_multiselect | array | Related destinations. |

## Core taxonomies

| Taxonomy slug | Label | Associated post types | Hierarchical | Use |
| --- | --- | --- | --- | --- |
| `brand` | Brands | `accommodation` | true | Accommodation brand grouping. |
| `accommodation-type` | Accommodation Types | `accommodation` | true | Accommodation type grouping. |
| `continent` | Continents | `destination` | true | Continent grouping for destination hierarchy. |
| `facility` | Facilities | `accommodation` | true | Accommodation facilities. |
| `travel-style` | Travel Styles | `accommodation`, `tour`, `destination`, `review`, `vehicle`, `special` | true | Travel-style classification across core and extension entities where active. |

## Shared post fields

Use these shared fields before creating duplicate custom media or relationship fields on posts:

| Field slug | Label | Type | Stored as | Use |
| --- | --- | --- | --- | --- |
| `banner_image` | Banner | file | string | Banner image. |
| `gallery` | Gallery | file_list | array | Gallery images. |
| `accommodation_to_post` | Related Accommodation | pw_multiselect | array | Related accommodation. |
| `destination_to_post` | Related Destinations | pw_multiselect | array | Related destinations. |
| `tour_to_post` | Related Tours | pw_multiselect | array | Related tours. |

## Extension boundary rules

The broader Tour Operator architecture may include these entities, but they must not be treated as built-in core unless the active plugin stack confirms them:

| Entity | Likely source | Use when |
| --- | --- | --- |
| Reviews | `TO Reviews` extension or project-specific review model | Guest feedback must be related to tours, accommodation, destinations, or trust sections. |
| Team | `TO Team` extension | Consultants, guides, or travel experts are part of the commercial positioning or enquiry routing. |
| Specials | `TO Specials` extension | Time-sensitive offers, campaign-led pricing, or promotional landing pages are required. |
| Wetu import data | `Wetu Importer` extension | The site imports third-party tour or itinerary data and must preserve structured tour/accommodation mapping. |
| Vehicles | Project-specific or extension-specific | Vehicle listings are confirmed by the active plugin stack and commercial model. |

## Audit checklist

For each content-model audit, verify:

- Core plugin active state and version.
- Extension active state and version.
- Whether `accommodation`, `destination`, and `tour` exist in admin and have content.
- Whether destination hierarchy is being used deliberately.
- Whether tours have useful `departs_from`, `ends_in`, itinerary, price, duration, and relationship data.
- Whether accommodation entries use location, gallery, units, facility, brand, and related-tour data where relevant.
- Whether destination entries use travel-info fields such as climate, visa, health, safety, transport, and related tours or accommodation.
- Whether shared media fields duplicate or conflict with featured images, page builders, or block content.
- Whether taxonomies are editorially clean, non-duplicated, and useful for frontend filters or archive pages.
- Whether related content is stored through relationship fields rather than unmanaged manual links.
- Whether templates, archive pages, Yoast search appearance, schema, and XML sitemaps reflect the actual public content model.
- Whether Wetu-imported content has preserved core field and relationship structure after sync.

## Implementation checklist

Before changing content model data:

1. Read the current entry, field, taxonomy, or setting first.
2. Confirm whether the change belongs in a CPT field, taxonomy term, relationship field, page content, template, or plugin setting.
3. Use exact plugin slugs and field keys.
4. Avoid creating custom fields that duplicate built-in fields.
5. Avoid creating new taxonomies that duplicate built-in taxonomies.
6. Avoid editing imported Wetu data manually until the import ownership and overwrite risk are understood.
7. For relationship changes, verify both the source entry and destination entry where the UI or frontend exposes both sides.
8. After editing, re-read or otherwise verify the changed field, taxonomy assignment, relationship, archive output, or template display.
9. Report before and after values for material changes.
10. Record durable content-model decisions in Memory only as concise facts, with source and date.

## Reporting language

Use these labels consistently:

- `Confirmed core model` for verified core CPTs, fields, taxonomies, and relationships.
- `Extension-backed model` for review, team, special, Wetu, or vehicle structures confirmed by active extensions or project evidence.
- `Project-specific model` for content structures approved by the project but not built into the Tour Operator core plugin.
- `Unknown / needs verification` for anything inferred but not confirmed.
- `Avoid / not recommended yet` for proposed entities, fields, or plugins that duplicate built-in functionality or lack a confirmed business need.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
