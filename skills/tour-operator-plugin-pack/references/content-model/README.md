# Tour Operator content model references

Use this folder before answering Tour Operator content model questions.

## Source-backed core files

- `core/post-types.json` documents confirmed core post types and fields from uploaded `tour.json`, `destination.json` and `accommodation.json`.
- `core/taxonomies.json` documents confirmed taxonomy configs from uploaded PHP taxonomy config files.
- `core/relationships.json` documents confirmed FacetWP relationship/facet sources from uploaded `class-post-connections.php`.
- `core/source-map.md` maps each model section back to its source file.

## Conservative extension files

- `extensions/to-reviews.json`
- `extensions/to-team.json`
- `extensions/to-specials.json`

These remain conservative because extension source files were not supplied for this build. Do not promote unknown extension internals into confirmed facts.

## Integration files

- `integrations/wetu-importer.json` treats Wetu Importer as a sync/integration layer unless source evidence proves otherwise.

## Boundary rule

Relationship or taxonomy references to `review`, `special`, `vehicle` or `activity` are not proof that those post types are core-owned.
