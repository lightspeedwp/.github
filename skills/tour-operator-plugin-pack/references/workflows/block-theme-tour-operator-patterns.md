# Block-theme Tour Operator patterns

Use this when auditing or planning block-theme support for Tour Operator content.

## Checks

- Single templates for `tour`, `destination` and `accommodation`.
- Archive templates for declared archives and query loops.
- Dynamic field output for confirmed fields from `post-types.json`.
- Taxonomy display for confirmed taxonomies from `taxonomies.json`.
- Relationship sections for source-backed relationships from `relationships.json`.
- Related content patterns.
- Empty/fallback states.
- Editor usability for non-technical content teams.
- Responsive behaviour and accessibility.

## Boundary rule

Do not hard-code extension-backed sections into core templates unless the extension is confirmed active or the template has a safe empty state.
