# Evidence Map

## When to load

Load when collecting, requesting or interpreting site evidence.

## What it helps decide

Identify safe evidence sources and distinguish inspectable evidence from editable configuration.

## Key evidence areas

- WordPress environment: staging/production, active plugins, plugin versions, theme, multisite/multilingual status.
- Yoast settings evidence: Search Appearance, content types, taxonomies, breadcrumbs, schema, social, sitemaps, redirects where safely visible.
- Content evidence: `_yoast_wpseo_title`, `_yoast_wpseo_metadesc`, `_yoast_wpseo_focuskw`, `_yoast_wpseo_canonical`, `_yoast_wpseo_meta-robots-noindex`, primary taxonomy fields and social fields.
- Term evidence: Yoast term title, description, canonical, social fields and indexation settings.
- Output evidence: rendered title, meta description, canonical, meta robots, Open Graph, Twitter/X, schema graph, breadcrumbs, sitemap inclusion, robots.txt and llms.txt.
- Database evidence: options, post meta, term meta and Yoast indexables may be inspected read-only when available.

## Safe handling

Use MCP-safe reads and read-only SQL by default. Do not edit Yoast indexables, migration tables, SEO links tables or generated diagnostic tables directly.

## Output expectations

For each finding, identify evidence type, source, confidence, limitation and whether the next action is audit follow-up, `woocommerce-yoast-configuration`, content editing or developer handoff.
