# Core content model source map

## Uploaded source files used

| Generated reference | Source files | Evidence captured |
|---|---|---|
| `post-types.json` | `tour.json`, `destination.json`, `accommodation.json` | Confirmed core post type slugs, labels, hierarchy, REST support, menu placement, declared archive behaviour, templates and fields. |
| `taxonomies.json` | `class-taxonomies.php`, `config-accommodation-brand.php`, `config-accommodation-type.php`, `config-continent.php`, `config-facility.php`, `config-travel-style.php` | Taxonomy registration behaviour, taxonomy labels, object types, hierarchy, REST/public/nav/admin/query/rewrite settings and purpose descriptions. |
| `relationships.json` | `class-post-connections.php` | FacetWP relationship/facet sources, row expansion behaviour, destination hierarchy depth handling, continent filter behaviour, price/duration indexing notes and extension-facing boundaries. |

## Confirmed core post types

- `tour`
- `destination`
- `accommodation`

## Confirmed taxonomy configs from uploaded files

- `accommodation-brand` attached to `accommodation`.
- `accommodation-type` attached to `accommodation`.
- `continent` attached to `destination`.
- `facility` attached to `accommodation`.
- `travel-style` attached to `accommodation`, `tour`, `destination`, `review`, `vehicle` and `special`.

## Important boundary note

The `travel-style` taxonomy and FacetWP relationship sources reference `review`, `vehicle`, `special` and `activity`. In this package, those references are treated as extension-facing or unknown unless separate source evidence confirms post type registration.
