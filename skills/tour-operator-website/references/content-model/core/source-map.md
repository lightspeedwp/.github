# Core content model source map

Use this file to trace generated content-model references back to the uploaded source files. The source files are evidence inputs, not bundled raw dumps.

## Post types

| Generated section | Uploaded source | Evidence used |
|---|---|---|
| `references/content-model/core/post-types.json` -> `tour` | `tour.json` | post type slug, labels, hierarchy, REST support, menu placement, empty template declaration, and fields: tagline, price, sale price, duration, single supplement, best time to visit. |
| `references/content-model/core/post-types.json` -> `destination` | `destination.json` | post type slug, labels, archive slug, hierarchy, REST support, menu placement, empty template declaration, and fields: tagline, best time to visit. |
| `references/content-model/core/post-types.json` -> `accommodation` | `accommodation.json` | post type slug, labels, archive slug, hierarchy, REST support, menu placement, empty template declaration, and accommodation pricing, rating, visitor, language, timing and room fields. |

## Taxonomies

| Generated section | Uploaded source | Evidence used |
|---|---|---|
| `references/content-model/core/taxonomies.json` -> registration behaviour | `class-taxonomies.php` | `lsx\Taxonomies`, `type = taxonomies`, filter hooks, and `register_taxonomy()` registration pattern. |
| `references/content-model/core/taxonomies.json` -> `accommodation-brand` | `config-accommodation-brand.php` | object type, labels, hierarchy, REST support, public/nav/admin/query/rewrite behaviour, menu position and description. |
| `references/content-model/core/taxonomies.json` -> `accommodation-type` | `config-accommodation-type.php` | object type, labels, hierarchy, REST support, public/nav/admin/query/rewrite behaviour, menu position and description. |
| `references/content-model/core/taxonomies.json` -> `continent` | `config-continent.php` | object type, labels, hierarchy, quick edit, REST support, public/nav/admin/query/rewrite behaviour, menu position and description. |
| `references/content-model/core/taxonomies.json` -> `facility` | `config-facility.php` | object type, labels, hierarchy, REST support, public/nav/admin/query/rewrite behaviour, menu position and description. |
| `references/content-model/core/taxonomies.json` -> `travel-style` | `config-travel-style.php` | associated object types, labels, hierarchy, REST support, public/nav/admin/query/rewrite behaviour, menu position and description. |

## Relationships and facets

| Generated section | Uploaded source | Evidence used |
|---|---|---|
| `references/content-model/core/relationships.json` -> FacetWP relationship sources | `class-post-connections.php` | source list: `cf/destination_to_accommodation`, `cf/destination_to_tour`, `cf/destination_to_special`, `cf/destination_to_activity`, `cf/destination_to_review`, `cf/destination_to_vehicle`. |
| `references/content-model/core/relationships.json` -> hierarchy/depth behaviour | `class-post-connections.php` | `facetwp_index_row_data()`, destination parent handling, country/region depth, optional continent augmentation, and `continent` taxonomy term usage. |
| `references/content-model/core/relationships.json` -> rendering/count behaviour | `class-post-connections.php` | `destination_facet_html()`, `destination_facet_render()`, `format_checkbox_facet()`, `format_fselect_facet()`, and fselect count disabling. |

## Boundary note

Relationship and taxonomy object-type references to `review`, `special`, `vehicle` and `activity` are not treated as core post type registration evidence in this package. They remain extension-facing or unknown until their owning code is inspected.

## Field and indexing interpretation files

| Generated section | Uploaded source | Evidence used |
|---|---|---|
| `references/content-model/core/field-usage-rules.md` | `tour.json`, `destination.json`, `accommodation.json`, `class-post-connections.php` | Safe interpretation rules for confirmed fields, string price/duration limits, ratings, multiselects and schema readiness. |
| `references/content-model/core/facetwp-indexing-notes.md` | `class-post-connections.php` | Destination facet source list, `_to_` custom-field indexing, hierarchy/depth behaviour, continent filtering, fselect rendering/count behaviour and `cf/price` / `cf/duration` normalisation. |
| `references/content-model/core/taxonomies.json` -> `registrationBehaviour` | `class-taxonomies.php` | Runtime registration method and filters for taxonomy args/object types. |
