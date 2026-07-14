# FacetWP indexing notes

Use this file when interpreting `class-post-connections.php`, diagnosing destination filters, or planning FacetWP-related handoff work.

## Confirmed relationship/facet sources

The uploaded source lists these FacetWP sources:

- `cf/destination_to_accommodation`
- `cf/destination_to_tour`
- `cf/destination_to_special`
- `cf/destination_to_activity`
- `cf/destination_to_review`
- `cf/destination_to_vehicle`

These sources confirm FacetWP and custom-field linkage behaviour. They do not prove that `special`, `activity`, `review` or `vehicle` are core-owned post types.

## Generic `_to_` custom-field indexing

For FacetWP sources containing both `cf/` and `_to_`, the integration:

1. casts the facet value to an array;
2. iterates each value;
3. allows `lsx_to_facetwp_index_skip_row` to skip a value;
4. uses `get_the_title()` as the display value when available;
5. clears empty values when no title is available;
6. inserts each row manually; and
7. returns `false` to skip default indexing.

## Destination hierarchy augmentation

Hierarchy/depth augmentation is explicitly applied to:

- `cf/destination_to_tour`
- `cf/destination_to_accommodation`

Without continent filtering, top-level destinations behave as country-level depth `0`, and child destinations behave as region-level depth `1`.

With continent filtering enabled, continent terms behave as depth `0`, top-level country destinations as depth `1`, and child/region destinations as depth `2`.

## Continent filtering

The integration reads display settings from the `lsx-search-settings` option. Two relevant option keys appear in the source:

- `engine_search_continent_filter`
- `enable_search_continent_filter`

When enabled, the `continent` taxonomy is used to add continent rows and parent relationships for destination facet output.

## Facet rendering

Destination facet rendering applies to sources in the integration's source list. Rendering is supported for `checkboxes` and `fselect` facet types. For `fselect` facets using these sources, FacetWP dropdown counts are disabled by the integration.

## Price and duration indexing

The same integration normalises these non-relationship custom field sources:

- `cf/price`: strips non-numeric characters except dots and trims leading dots.
- `cf/duration`: strips non-numeric characters except spaces, takes the first token, and uses that as the indexed value.

Use this as filter-indexing behaviour only. It does not make `price` or `duration` fully structured data fields.
